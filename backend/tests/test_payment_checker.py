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
