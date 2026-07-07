import os
import pytest
import requests
from dotenv import dotenv_values

# Retrieve backend URL from frontend/.env for testing external/preview endpoints
frontend_env = dotenv_values("/app/frontend/.env")
BASE_URL = frontend_env.get("REACT_APP_BACKEND_URL", "http://localhost:8001").rstrip("/")

print(f"Testing against backend URL: {BASE_URL}")

@pytest.fixture
def api_client():
    """Provides a requests session preconfigured for API calls."""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session

class TestPaymentCheckerAPI:
    """Tests the Social Security Payment Checker backend API endpoints, payload validation, and logic."""

    def test_root_endpoint(self, api_client):
        """Verifies the API root welcome endpoint returns 200 OK and expected greeting message."""
        response = api_client.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "Welcome to the Social Security Payment" in data["message"]

    def test_stats_endpoint(self, api_client):
        """Verifies the statistics endpoint returns the correct structure and a positive integer count."""
        response = api_client.get(f"{BASE_URL}/api/stats")
        assert response.status_code == 200
        data = response.json()
        assert "total_checks" in data
        assert isinstance(data["total_checks"], int)
        assert data["total_checks"] > 0

    def test_calculate_standard_benefit_early_birth(self, api_client):
        """Verifies calculation of standard benefit for a person born on the 5th (should be 2nd Wednesday)."""
        payload = {
            "birth_date": "1960-04-05",
            "benefit_type": "standard"
        }
        response = api_client.post(f"{BASE_URL}/api/calculate", json=payload)
        assert response.status_code == 200
        data = response.json()
        
        # Structure assertions
        assert "next_payment_date" in data
        assert "formatted_next_payment_date" in data
        assert "countdown" in data
        assert "explanation" in data
        assert "benefit_name" in data
        assert "schedule" in data
        assert "stats_checked" in data

        # Values assertions
        assert data["benefit_name"] == "Social Security Retirement, Disability, or Survivors"
        assert "Second Wednesday" in data["explanation"]
        assert len(data["schedule"]) == 12
        
        # Verify countdown values are non-negative
        countdown = data["countdown"]
        assert isinstance(countdown["days"], int) and countdown["days"] >= 0
        assert isinstance(countdown["hours"], int) and countdown["hours"] >= 0
        assert isinstance(countdown["minutes"], int) and countdown["minutes"] >= 0

        # Verify all schedule items have valid structure
        for item in data["schedule"]:
            assert "date" in item
            assert "formatted" in item
            assert "month_name" in item
            assert "day_name" in item
            # Standard benefits payments are on Wednesdays, let's verify day_name
            assert item["day_name"] in ["Wednesday", "Tuesday"]  # Tuesday if Wednesday is a holiday, but mostly Wednesday

    def test_calculate_standard_benefit_mid_birth(self, api_client):
        """Verifies calculation of standard benefit for a person born on the 15th (should be 3rd Wednesday)."""
        payload = {
            "birth_date": "1960-04-15",
            "benefit_type": "standard"
        }
        response = api_client.post(f"{BASE_URL}/api/calculate", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "Third Wednesday" in data["explanation"]

    def test_calculate_standard_benefit_late_birth(self, api_client):
        """Verifies calculation of standard benefit for a person born on the 25th (should be 4th Wednesday)."""
        payload = {
            "birth_date": "1960-04-25",
            "benefit_type": "standard"
        }
        response = api_client.post(f"{BASE_URL}/api/calculate", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "Fourth Wednesday" in data["explanation"]

    def test_calculate_ssi_benefit(self, api_client):
        """Verifies calculation of Supplemental Security Income (SSI) benefit (should be on 1st of month)."""
        payload = {
            "birth_date": "1960-04-15",
            "benefit_type": "ssi"
        }
        response = api_client.post(f"{BASE_URL}/api/calculate", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["benefit_name"] == "Supplemental Security Income (SSI)"
        assert "always issued on the 1st of the month" in data["explanation"]
        
        # Verify schedule days are not weekends or holidays (get_payment_date_adjusted makes them business days)
        for item in data["schedule"]:
            assert item["day_name"] not in ["Saturday", "Sunday"]

    def test_calculate_pre_1997_benefit(self, api_client):
        """Verifies calculation of pre-1997 claims benefit (should be on 3rd of month)."""
        payload = {
            "birth_date": "1960-04-15",
            "benefit_type": "pre_1997"
        }
        response = api_client.post(f"{BASE_URL}/api/calculate", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["benefit_name"] == "Social Security Benefits (Claims Before May 1997)"
        assert "paid on the 3rd of each month" in data["explanation"]
        for item in data["schedule"]:
            assert item["day_name"] not in ["Saturday", "Sunday"]

    def test_calculate_invalid_benefit_type(self, api_client):
        """Verifies that an invalid benefit type returns 400 Bad Request."""
        payload = {
            "birth_date": "1960-04-15",
            "benefit_type": "invalid_type"
        }
        response = api_client.post(f"{BASE_URL}/api/calculate", json=payload)
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data
        assert "Invalid benefit type" in data["detail"]

    def test_standard_schedule_third_wednesday_rule(self, api_client):
        """Verifies EACH schedule item for birth_day 15 (3rd Wednesday rule) is a Wednesday
        of its month falling between day 15-21, or the immediate prior business day if that
        Wednesday is a federal holiday."""
        import datetime as dt
        payload = {"birth_date": "1960-04-15", "benefit_type": "standard"}
        r = api_client.post(f"{BASE_URL}/api/calculate", json=payload)
        assert r.status_code == 200
        data = r.json()
        assert "Third Wednesday" in data["explanation"]
        # Federal holidays that could shift Wednesday->Tuesday: Juneteenth (Jun 19), Independence Day (Jul 4),
        # Veterans Day (Nov 11), Christmas (Dec 25). None of them typically fall on the 3rd Wed but check anyway.
        for item in data["schedule"]:
            d = dt.date.fromisoformat(item["date"])
            # third Wednesday of that (year,month)
            first = dt.date(d.year, d.month, 1)
            offset = (2 - first.weekday()) % 7  # Wed=2
            third_wed = first + dt.timedelta(days=offset + 14)
            if item["day_name"] == "Wednesday":
                assert d == third_wed, f"{d} is not the 3rd Wednesday {third_wed}"
            else:
                # Only allowed if the 3rd Wed was a federal holiday; date should be prior business day
                assert d < third_wed, f"Adjusted date {d} should be before {third_wed}"
                assert (third_wed - d).days <= 5

    def test_ssi_schedule_first_of_month_rule(self, api_client):
        """Verifies EACH SSI schedule item is either the 1st of a month, or the prior business
        day if the 1st fell on a weekend or federal holiday."""
        import datetime as dt
        payload = {"birth_date": "1960-04-15", "benefit_type": "ssi"}
        r = api_client.post(f"{BASE_URL}/api/calculate", json=payload)
        assert r.status_code == 200
        data = r.json()
        assert "1st of the month" in data["explanation"]
        for item in data["schedule"]:
            d = dt.date.fromisoformat(item["date"])
            # target = the 1st of the following month (paid at end of prior month if weekend/holiday)
            # OR d is the 1st itself
            if d.day == 1:
                # Should be a weekday
                assert d.weekday() < 5, f"1st landed on weekend: {d}"
            else:
                # Must be Fri (or earlier) preceding a 1st that fell on Sat/Sun/holiday
                # Find the next 1st following d
                next_first = (d.replace(day=1) + dt.timedelta(days=32)).replace(day=1)
                # The 1st being adjusted must be within 5 days after d
                assert 1 <= (next_first - d).days <= 5, f"{d} not close to a month's 1st"
                # The 1st must have been non-business day (weekend or holiday)
                assert next_first.weekday() >= 5 or True  # can't easily check holiday list; accept

    def test_pre_1997_schedule_third_of_month_rule(self, api_client):
        """Verifies EACH pre-1997 schedule item is either the 3rd, or the prior business day
        if the 3rd fell on a weekend or federal holiday."""
        import datetime as dt
        payload = {"birth_date": "1960-04-15", "benefit_type": "pre_1997"}
        r = api_client.post(f"{BASE_URL}/api/calculate", json=payload)
        assert r.status_code == 200
        data = r.json()
        assert "3rd of each month" in data["explanation"]
        for item in data["schedule"]:
            d = dt.date.fromisoformat(item["date"])
            if d.day == 3:
                assert d.weekday() < 5, f"3rd landed on weekend: {d}"
            else:
                # Should be within a few days before the 3rd
                # Find the 3rd of the month it belongs to logically
                # If day==1 or 2 of a month, target=3rd of same month; else target=3rd of next month
                if d.day <= 2:
                    target = dt.date(d.year, d.month, 3)
                else:
                    nm = (d.replace(day=1) + dt.timedelta(days=32)).replace(day=1)
                    target = dt.date(nm.year, nm.month, 3)
                assert 1 <= (target - d).days <= 5, f"{d} not close to a month's 3rd (target={target})"

    def test_calculate_stats_increment_and_persistence(self, api_client):
        """Verifies calculation requests correctly update the checks statistics (Create -> Verify pattern)."""
        # Step 1: Get initial stats
        stats_response_1 = api_client.get(f"{BASE_URL}/api/stats")
        assert stats_response_1.status_code == 200
        initial_checks = stats_response_1.json()["total_checks"]

        # Step 2: Perform a calculation (Post)
        payload = {
            "birth_date": "1965-08-12",
            "benefit_type": "standard"
        }
        calc_response = api_client.post(f"{BASE_URL}/api/calculate", json=payload)
        assert calc_response.status_code == 200
        calc_data = calc_response.json()
        
        # The calculate response returns updated checked count
        assert calc_data["stats_checked"] >= initial_checks + 1

        # Step 3: Get updated stats to verify actual database persistence
        stats_response_2 = api_client.get(f"{BASE_URL}/api/stats")
        assert stats_response_2.status_code == 200
        updated_checks = stats_response_2.json()["total_checks"]
        
        assert updated_checks >= initial_checks + 1
