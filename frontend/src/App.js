import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CountryNav } from "@/pages/CountryNav";
import "@/App.css";
import axios from "axios";
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Download, 
  Printer, 
  Copy, 
  Share2, 
  ExternalLink, 
  Phone, 
  ChevronDown,
  RefreshCw,
  Shield,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Toaster, toast } from "sonner";

// Central API Configuration
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
const API = `${BACKEND_URL}/api`;

export default function App() {
  // Theme & Accessibility States
  const [largeText] = useState(false);
  const [highContrast] = useState(true);

  // Form States
  const [birthDate, setBirthDate] = useState("1960-04-15");
  const [benefitType, setBenefitType] = useState("standard");
  const [isLoading, setIsLoading] = useState(false);

  // Statistics
  const [totalChecks, setTotalChecks] = useState(142429);

  // Calculation Result State
  const [result, setResult] = useState(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Refs for scrolling
  const resultRef = useRef(null);

  // Load initial statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API}/stats`);
        if (response.data && response.data.total_checks) {
          setTotalChecks(response.data.total_checks);
        }
      } catch (e) {
        console.error("Error fetching stats:", e);
      }
    };
    fetchStats();
  }, []);

  // Countdown timer logic
  useEffect(() => {
    if (!result) return;

    const timer = setInterval(() => {
      const now = new Date();
      // Parse next payment date (set default to 8:00 AM EST)
      const payDate = new Date(result.next_payment_date + "T08:00:00-05:00");
      const difference = payDate.getTime() - now.getTime();

      if (difference <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const m = Math.floor((difference / 1000 / 60) % 60);
        const s = Math.floor((difference / 1000) % 60);
        setCountdown({ days: d, hours: h, minutes: m, seconds: s });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [result]);

  // Handle calculation submission
  const runCalculation = async (bDate, bType) => {
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/calculate`, {
        birth_date: bDate,
        benefit_type: bType
      });

      if (response.data) {
        setResult(response.data);
        setTotalChecks(response.data.stats_checked);
        toast.success("Schedule calculated successfully!", {
          description: `Your next payment is on ${response.data.formatted_next_payment_date}.`,
        });

        // Smooth scroll to results
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } catch (err) {
      console.error("Error calculating schedule:", err);
      toast.error("Failed to calculate schedule", {
        description: "Please check your birth date and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    await runCalculation(birthDate, benefitType);
  };

  // Pre-fill and auto-calculate from a shareable link (?type=standard&day=15)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    const day = params.get("day");
    const validTypes = ["standard", "ssi", "pre_1997"];

    if (type && validTypes.includes(type)) {
      let bDate = birthDate;
      if (type === "standard" && day) {
        const d = parseInt(day, 10);
        if (d >= 1 && d <= 31) {
          bDate = `1960-01-${String(d).padStart(2, "0")}`;
          setBirthDate(bDate);
        }
      }
      setBenefitType(type);
      runCalculation(bDate, type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // 100% Client-Side Calendar (.ics) Generation
  const handleAddToCalendar = () => {
    if (!result || !result.schedule) return;

    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Social Security Payment Date Checker//EN\n";
    
    result.schedule.forEach((item, index) => {
      // item.date is "YYYY-MM-DD" -> format to "YYYYMMDD"
      const dateStr = item.date.replace(/-/g, "");
      icsContent += "BEGIN:VEVENT\n";
      icsContent += `UID:ssa-payment-${dateStr}-${index}@checkpaydate.com\n`;
      icsContent += `DTSTAMP:${dateStr}T120000Z\n`;
      icsContent += `DTSTART;VALUE=DATE:${dateStr}\n`;
      icsContent += `DTEND;VALUE=DATE:${dateStr}\n`;
      icsContent += `SUMMARY:${result.benefit_name} Payment\n`;
      icsContent += `DESCRIPTION:Your scheduled Social Security benefit payment. Estimate from CheckPayDate.com.\n`;
      // 2-day-before reminder handled by the user's own calendar app
      icsContent += "BEGIN:VALARM\n";
      icsContent += "TRIGGER:-P2D\n";
      icsContent += "ACTION:DISPLAY\n";
      icsContent += "DESCRIPTION:Social Security payment in 2 days\n";
      icsContent += "END:VALARM\n";
      icsContent += "END:VEVENT\n";
    });
    
    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "social_security_payment_calendar.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Calendar file with reminders downloaded!", {
      description: "Import it into Google, Outlook, or Apple Calendar — you'll be alerted 2 days before each payment.",
    });
  };

  // 100% Client-Side CSV Schedule Download
  const handleDownloadCSV = () => {
    if (!result || !result.schedule) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Payment Month,Scheduled Payment Date,Day of Week,Benefit Type\n";
    
    result.schedule.forEach(item => {
      csvContent += `"${item.month_name}","${item.date}","${item.day_name}","${result.benefit_name}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "social_security_payment_schedule.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("CSV schedule downloaded!", {
      description: "The payment schedule has been saved to your downloads.",
    });
  };

  // Copy schedule to Clipboard
  const handleCopySchedule = () => {
    if (!result || !result.schedule) return;

    let text = `--- SOCIAL SECURITY PAYMENT SCHEDULE (${result.benefit_name}) ---\n\n`;
    text += `Next Payment Date: ${result.formatted_next_payment_date}\n\n`;
    text += "Upcoming 12 Months:\n";
    
    result.schedule.forEach(item => {
      text += `- ${item.month_name}: ${item.formatted}\n`;
    });
    
    text += "\nCalculated via Social Security Payment Date Checker.";

    try {
      navigator.clipboard.writeText(text)
        .then(() => {
          toast.success("Schedule copied to clipboard!", {
            description: "You can now paste the text into an email, message, or notes.",
          });
        })
        .catch(err => {
          console.error("Clipboard copy failed:", err);
          toast.error("Could not copy schedule automatically", {
            description: "Please select the text on the page to copy manually.",
          });
        });
    } catch (e) {
      console.error("Clipboard copy error:", e);
      toast.error("Clipboard access not supported", {
        description: "Your browser does not allow clipboard actions.",
      });
    }
  };

  // Print schedule
  const handlePrint = () => {
    window.print();
  };

  // Build a bookmarkable/shareable link that pre-fills this exact result
  const buildShareUrl = () => {
    const day = (birthDate.split("-")[2] || "15").replace(/^0+/, "") || "15";
    const base = `${window.location.origin}${window.location.pathname}`;
    return benefitType === "standard"
      ? `${base}?type=standard&day=${day}`
      : `${base}?type=${benefitType}`;
  };

  // Share schedule
  const handleShare = () => {
    if (!result) return;

    const shareUrl = buildShareUrl();
    const shareText = `My next Social Security payment is on ${result.formatted_next_payment_date}! Check yours here: ${shareUrl}`;

    if (navigator.share) {
      navigator.share({
        title: "CheckPayDate.com — Social Security Payment Date Checker",
        text: shareText,
        url: shareUrl,
      }).catch(err => console.log(err));
    } else {
      try {
        navigator.clipboard.writeText(shareText)
          .then(() => {
            toast.success("Sharing link copied to clipboard!", {
              description: "This link re-opens your exact result. Paste and share it with friends or family.",
            });
          })
          .catch(err => {
            console.error("Share clipboard copy failed:", err);
            toast.error("Sharing link copying failed", {
              description: "Could not copy link automatically.",
            });
          });
      } catch (e) {
        console.error("Share clipboard copy error:", e);
        toast.error("Clipboard access not supported", {
          description: "Could not copy sharing link.",
        });
      }
    }
  };

  // Dynamic contrast classes
  const contrastClasses = {
    bg: highContrast ? "bg-white border-black text-black" : "bg-slate-50 text-slate-900",
    headerBg: highContrast ? "bg-white border-b-2 border-black" : "bg-white/90 backdrop-blur-md border-b border-slate-200",
    card: highContrast ? "bg-white border-2 border-black shadow-none rounded-none" : "bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-2xl",
    textPrimary: highContrast ? "text-black" : "text-slate-900",
    textSecondary: highContrast ? "text-black font-medium" : "text-slate-600",
    buttonPrimary: highContrast ? "bg-black hover:bg-slate-900 text-white border-2 border-black font-bold focus:ring-4 focus:ring-amber-500" : "bg-[#005EA2] hover:bg-[#1A4480] text-white font-semibold transition-colors duration-200 focus:ring-2 focus:ring-[#F59E0B]",
    buttonSecondary: highContrast ? "bg-white hover:bg-slate-100 text-black border-2 border-black font-bold focus:ring-4 focus:ring-amber-500" : "border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors duration-200",
    accentBg: highContrast ? "bg-black text-white p-4" : "bg-blue-50 text-blue-950 p-6 border border-blue-100 rounded-2xl",
    footer: highContrast ? "bg-white text-black border-t-2 border-black py-12" : "bg-slate-900 text-slate-200 py-16",
    badge: highContrast ? "border border-black text-black font-bold px-2 py-1" : "bg-blue-100 text-blue-800 px-3 py-1 font-semibold rounded-full",
    activeTab: highContrast ? "bg-black text-white" : "bg-blue-100 text-blue-900",
    inactiveTab: highContrast ? "bg-white text-black border border-black" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
  };

  // Text Scaling classes
  const fontSizes = {
    h1: largeText ? "text-5xl sm:text-6xl font-extrabold tracking-tight" : "text-4xl sm:text-5xl font-bold tracking-tight",
    h2: largeText ? "text-3xl sm:text-4xl font-bold tracking-tight" : "text-2xl sm:text-3xl font-semibold tracking-tight",
    h3: largeText ? "text-2xl font-bold" : "text-xl font-semibold",
    body: largeText ? "text-lg sm:text-xl leading-relaxed" : "text-base sm:text-lg leading-relaxed",
    small: largeText ? "text-base" : "text-sm",
    label: largeText ? "text-lg font-bold" : "text-base font-semibold",
    buttonHeight: largeText ? "h-14 text-lg px-6" : "h-12 text-base px-4",
    inputHeight: largeText ? "h-14 text-lg" : "h-12 text-base",
    tableText: largeText ? "text-lg" : "text-sm md:text-base"
  };

  return (
    <div className={`min-h-screen font-body ${contrastClasses.bg}`}>
      <Toaster position="top-center" richColors />

      {/* STICKY ACCESSIBLE HEADER */}
      <header className={`sticky top-0 z-50 transition-all ${contrastClasses.headerBg} no-print`}>
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 bg-[#005EA2] text-white rounded-lg`}>
              <Calendar className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <span className={`font-headings font-extrabold text-xl tracking-tight ${contrastClasses.textPrimary}`}>
                CheckPayDate.com
              </span>
              <span className="block text-xs uppercase font-bold tracking-wider text-[#005EA2]">
                Informational Aid
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="max-w-5xl mx-auto px-4 py-8 md:py-16 space-y-12">

        {/* PRINT-ONLY HEADER */}
        <div className="print-header">
          <span className="font-headings font-extrabold text-lg">CheckPayDate.com — Payment Schedule</span>
          <span className="text-sm">Generated {new Date().toLocaleDateString()}</span>
        </div>

        {/* HERO SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center no-print">
          <div className="md:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2">
              <span className={`${contrastClasses.badge}`}>Official 2026 Schedule rules</span>
              <span className="text-slate-500 text-sm font-semibold">|</span>
              <span className="text-slate-600 text-sm font-semibold flex items-center">
                <Shield className="h-4 w-4 text-[#005EA2] mr-1" /> Secure & Non-Government
              </span>
            </div>
            <h1 className={`${fontSizes.h1} ${contrastClasses.textPrimary} font-headings leading-tight`}>
              <span className="text-[#005EA2] underline decoration-wavy decoration-[#F59E0B] underline-offset-4">Social Security</span> Payment Date Checker
            </h1>
            <p className={`${fontSizes.body} ${contrastClasses.textSecondary}`}>
              See when your benefit is scheduled — based on official SSA payment rules.
            </p>
            
            <div className={`p-4 border ${highContrast ? "border-black" : "border-slate-200 bg-slate-100/50"} rounded-xl flex items-center space-x-4`}>
              <div className="p-3 bg-[#DCFCE7] text-emerald-800 rounded-full">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className={`font-semibold ${contrastClasses.textPrimary}`}>
                  {totalChecks.toLocaleString()} Dates Checked
                </p>
                <p className="text-xs text-slate-500">Helping older adults budget with confidence today</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute inset-0 bg-[#005EA2] opacity-10 blur-2xl rounded-full"></div>
              <img 
                src="https://static.prod-images.emergentagent.com/jobs/1b455353-8d86-4d03-8529-c794013da3d7/images/29d232089dbaba701e73ef7a447def0d3bdc83bac84daba9c937fb554bfb29f2.png" 
                alt="Calendar with next payment date circled and a deposit coin icon" 
                className="w-full h-auto object-contain rounded-2xl border border-slate-200 shadow-md relative z-10 bg-white aspect-square"
              />
            </div>
          </div>
        </section>

        {/* CALCULATOR & RESULT SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* CALCULATOR CARD */}
          <Card className={`${contrastClasses.card} no-print`}>
            <CardHeader className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-[#005EA2]" />
                <span className="text-xs uppercase font-bold tracking-wider text-[#005EA2]">Calculator Tools</span>
              </div>
              <CardTitle className={`${fontSizes.h2}`}>Benefit Payment Calculator</CardTitle>
              <CardDescription className={`${fontSizes.body}`}>
                Enter your birth date and benefit type to check when your direct deposits or paper checks will arrive.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCalculate} className="space-y-6">
                
                {/* Benefit Type Select */}
                <div className="space-y-2">
                  <Label htmlFor="benefit-type" className={`${fontSizes.label}`}>
                    1. Select Your Benefit Type
                  </Label>
                  <Select 
                    value={benefitType} 
                    onValueChange={(val) => setBenefitType(val)}
                  >
                    <SelectTrigger 
                      id="benefit-type"
                      data-testid="calculator-benefit-type-select"
                      className={`${fontSizes.inputHeight} font-semibold border-slate-300 bg-white focus:ring-[#F59E0B] focus:border-[#005EA2]`}
                      aria-label="Select Benefit Type"
                    >
                      <SelectValue placeholder="Choose benefit..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-300">
                      <SelectItem value="standard" className="py-3 font-medium">
                        Social Security (Retirement, Disability, SSDI, Survivors)
                      </SelectItem>
                      <SelectItem value="ssi" className="py-3 font-medium">
                        Supplemental Security Income (SSI)
                      </SelectItem>
                      <SelectItem value="pre_1997" className="py-3 font-medium">
                        I receive benefits since before May 1997
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Birth Date Input */}
                {benefitType === "standard" && (
                  <div className="space-y-2">
                    <Label htmlFor="birth-date" className={`${fontSizes.label}`}>
                      2. Enter Your Date of Birth
                    </Label>
                    <p className={`${fontSizes.small} text-slate-500 mb-1`}>
                      Your payment date is determined by your day of birth. We never store or share your date.
                    </p>
                    <Input
                      type="date"
                      id="birth-date"
                      data-testid="calculator-birth-date-input"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className={`${fontSizes.inputHeight} border-slate-300 font-semibold text-slate-900 bg-white focus:ring-[#F59E0B] focus:border-[#005EA2]`}
                      required={benefitType === "standard"}
                    />
                  </div>
                )}

                {/* Fixed-date benefit info (SSI / Pre-1997 hide birthday) */}
                {benefitType === "ssi" && (
                  <div data-testid="ssi-info-note" className="flex items-start space-x-2 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <Info className="h-5 w-5 text-[#005EA2] shrink-0 mt-0.5" />
                    <p className={`${fontSizes.small} text-blue-950 font-medium`}>
                      SSI is paid on the <strong>1st of each month</strong> for everyone, so no birth date is needed. If the 1st falls on a weekend or holiday, payment moves to the prior business day.
                    </p>
                  </div>
                )}

                {benefitType === "pre_1997" && (
                  <div data-testid="pre-1997-info-note" className="flex items-start space-x-2 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <Info className="h-5 w-5 text-[#005EA2] shrink-0 mt-0.5" />
                    <p className={`${fontSizes.small} text-blue-950 font-medium`}>
                      Benefits started before May 1997 are paid on the <strong>3rd of each month</strong> for everyone, so no birth date is needed. If the 3rd falls on a weekend or holiday, payment moves to the prior business day.
                    </p>
                  </div>
                )}
                {/* Submit Button */}
                <Button 
                  type="submit"
                  disabled={isLoading}
                  data-testid="calculator-submit-button"
                  className={`w-full ${fontSizes.buttonHeight} ${contrastClasses.buttonPrimary} rounded-xl shadow-sm hover:shadow flex items-center justify-center space-x-2`}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Computing payment date...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="h-5 w-5" />
                      <span>Check My Payment Dates</span>
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="bg-slate-50 border-t border-slate-100 rounded-b-2xl p-6">
              <div className="flex items-start space-x-2">
                <Info className="h-5 w-5 text-[#005EA2] shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500">
                  <strong>Privacy First:</strong> Date checking happens securely and instantly. We adhere strictly to data privacy standards. No personally identifiable details are preserved.
                </p>
              </div>
            </CardFooter>
          </Card>

          {/* DYNAMIC RESULT CARD */}
          <div ref={resultRef} className="scroll-mt-24 h-full">
            {result ? (
              <Card className={`${contrastClasses.card} border-2 border-[#005EA2] print-card overflow-hidden`}>
                <div className="bg-[#005EA2] text-white py-4 px-6 no-print flex items-center justify-between">
                  <span className="font-headings uppercase font-bold text-xs tracking-wider">Next Payment Countdown</span>
                  <div className="flex items-center space-x-1 text-amber-300">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs font-bold">Active Live Tracking</span>
                  </div>
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className={`${fontSizes.h3} text-[#005EA2] font-semibold`}>
                    {result.benefit_name}
                  </CardTitle>
                  <CardDescription className={`${fontSizes.body} font-bold text-slate-500`}>
                    Your Estimated Scheduled Payment Date
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* HUGE DISPLAY DATE */}
                  <div className="text-center py-6 px-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <span 
                      data-testid="result-payment-date" 
                      className={`block font-headings font-extrabold text-[#005EA2] text-3xl md:text-4xl`}
                    >
                      {result.formatted_next_payment_date}
                    </span>
                  </div>

                  {/* LIVE COUNTDOWN DISPLAY */}
                  <div className="no-print space-y-2">
                    <span className={`${fontSizes.label} block text-slate-700`}>Time Remaining Until Payment:</span>
                    <div 
                      data-testid="result-countdown-display"
                      className="grid grid-cols-4 gap-2 text-center"
                    >
                      <div className={`p-3 ${highContrast ? "border border-black" : "bg-slate-100"} rounded-xl`}>
                        <span className="block font-headings text-2xl md:text-3xl font-extrabold text-[#005EA2]">{countdown.days}</span>
                        <span className="text-xs font-bold uppercase text-slate-500">Days</span>
                      </div>
                      <div className={`p-3 ${highContrast ? "border border-black" : "bg-slate-100"} rounded-xl`}>
                        <span className="block font-headings text-2xl md:text-3xl font-extrabold text-[#005EA2]">{countdown.hours}</span>
                        <span className="text-xs font-bold uppercase text-slate-500">Hrs</span>
                      </div>
                      <div className={`p-3 ${highContrast ? "border border-black" : "bg-slate-100"} rounded-xl`}>
                        <span className="block font-headings text-2xl md:text-3xl font-extrabold text-[#005EA2]">{countdown.minutes}</span>
                        <span className="text-xs font-bold uppercase text-slate-500">Mins</span>
                      </div>
                      <div className={`p-3 ${highContrast ? "border border-black" : "bg-slate-100"} rounded-xl`}>
                        <span className="block font-headings text-2xl md:text-3xl font-extrabold text-[#005EA2]">{countdown.seconds}</span>
                        <span className="text-xs font-bold uppercase text-slate-500">Secs</span>
                      </div>
                    </div>
                  </div>

                  {/* EXPLANATION */}
                  <div className="space-y-2">
                    <span className={`${fontSizes.label} block text-slate-900`}>Official Schedule Explanation:</span>
                    <p 
                      data-testid="result-explanation-text"
                      className={`${fontSizes.body} ${contrastClasses.textSecondary} border-l-4 border-[#005EA2] pl-3 py-1 bg-slate-50/50`}
                    >
                      {result.explanation}
                    </p>
                  </div>

                  {/* ACTION BUTTONS TOOLBAR */}
                  <div className="no-print grid grid-cols-2 md:grid-cols-2 gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={handleAddToCalendar}
                      data-testid="action-add-to-calendar-button"
                      className={`${fontSizes.buttonHeight} ${contrastClasses.buttonSecondary} flex items-center justify-center space-x-2`}
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Add to Calendar + Reminder</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={handleDownloadCSV}
                      data-testid="action-download-button"
                      className={`${fontSizes.buttonHeight} ${contrastClasses.buttonSecondary} flex items-center justify-center space-x-2`}
                    >
                      <Download className="h-4 w-4" />
                      <span>Download CSV</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={handleCopySchedule}
                      data-testid="action-copy-button"
                      className={`${fontSizes.buttonHeight} ${contrastClasses.buttonSecondary} flex items-center justify-center space-x-2`}
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy Schedule</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={handlePrint}
                      data-testid="action-print-button"
                      className={`${fontSizes.buttonHeight} ${contrastClasses.buttonSecondary} flex items-center justify-center space-x-2`}
                    >
                      <Printer className="h-4 w-4" />
                      <span>Print Page</span>
                    </Button>
                  </div>

                  <p data-testid="reminder-disclaimer-note" className="no-print text-xs text-slate-500 text-center -mt-2">
                    Reminders are sent by your calendar app (Google, Apple, or Outlook), not by CheckPayDate.
                  </p>

                  <Button
                    variant="outline"
                    onClick={handleShare}
                    data-testid="action-share-button"
                    className={`no-print w-full ${fontSizes.buttonHeight} ${contrastClasses.buttonSecondary} flex items-center justify-center space-x-2 border-dashed border-[#005EA2] text-[#005EA2] hover:bg-blue-50`}
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share This Tool With Friends</span>
                  </Button>

                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl h-full flex flex-col items-center justify-center text-center p-8 min-h-[350px]">
                <div className="p-4 bg-blue-50 text-[#005EA2] rounded-full mb-4">
                  <Calendar className="h-10 w-10 animate-pulse" />
                </div>
                <h3 className={`${fontSizes.h3} text-slate-800`}>Awaiting Date Information</h3>
                <p className={`${fontSizes.body} text-slate-500 max-w-sm mt-2`}>
                  Please choose your benefit choices and submit the calculation form to view your upcoming dates, schedule, and countdowns.
                </p>
              </Card>
            )}
          </div>
        </section>

        {/* UPCOMING PAYMENTS SCHEDULE TABLE */}
        {result && result.schedule && (
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className={`${fontSizes.h2} ${contrastClasses.textPrimary}`}>Upcoming 12-Month Payment Schedule</h2>
                <p className={`${fontSizes.body} text-slate-500`}>Save, print, or review your schedule for the entire year.</p>
              </div>
              <Button
                variant="outline"
                onClick={handlePrint}
                className="no-print self-start md:self-center border-[#005EA2] text-[#005EA2] hover:bg-blue-50"
              >
                <Printer className="h-4 w-4 mr-2" /> Print Calendar
              </Button>
            </div>

            <div className={`overflow-x-auto border ${highContrast ? "border-black" : "border-slate-200"} rounded-2xl shadow-sm bg-white`}>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b ${highContrast ? "border-black bg-slate-100 text-black" : "bg-slate-50 text-slate-900"} font-semibold`}>
                    <th className={`p-4 md:p-5 ${fontSizes.tableText}`}>Month</th>
                    <th className={`p-4 md:p-5 ${fontSizes.tableText}`}>Scheduled Payment Date</th>
                    <th className={`p-4 md:p-5 ${fontSizes.tableText}`}>Day of Week</th>
                    <th className={`p-4 md:p-5 ${fontSizes.tableText} hidden sm:table-cell`}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {result.schedule.map((item, idx) => (
                    <tr 
                      key={idx} 
                      className={`hover:bg-slate-50/50 transition-colors ${
                        idx === 0 ? (highContrast ? "bg-slate-100 font-bold" : "bg-blue-50/50 font-semibold") : ""
                      }`}
                    >
                      <td className={`p-4 md:p-5 ${fontSizes.tableText} font-bold text-slate-900`}>
                        {item.month_name}
                      </td>
                      <td className={`p-4 md:p-5 ${fontSizes.tableText} ${idx === 0 ? "text-[#005EA2] font-bold" : "text-slate-800"}`}>
                        {item.formatted}
                      </td>
                      <td className={`p-4 md:p-5 ${fontSizes.tableText} text-slate-600`}>
                        {item.day_name}
                      </td>
                      <td className={`p-4 md:p-5 ${fontSizes.tableText} hidden sm:table-cell`}>
                        {idx === 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            Next Payment
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                            Scheduled
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* HOW SOCIAL SECURITY PAYMENT DATES WORK */}
        <section className="space-y-8 no-print">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className={`${fontSizes.h2} ${contrastClasses.textPrimary}`}>How Social Security Payment Dates Work</h2>
            <p className={`${fontSizes.body} text-slate-500 mt-2`}>
              The Social Security Administration (SSA) determines payment dates based on the type of benefit and your day of birth. Here is the general rule set.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className={`${contrastClasses.card}`}>
              <CardHeader>
                <div className="h-12 w-12 bg-blue-100 text-[#005EA2] flex items-center justify-center rounded-xl mb-4 font-extrabold font-headings text-xl">
                  SSI
                </div>
                <CardTitle className={`${fontSizes.h3}`}>SSI Payments</CardTitle>
                <CardDescription className={`${fontSizes.small}`}>Supplemental Security Income</CardDescription>
              </CardHeader>
              <CardContent className={`${fontSizes.body} ${contrastClasses.textSecondary}`}>
                Payments are made on the <strong>1st day of each month</strong>. If the 1st falls on a Saturday, Sunday, or Federal holiday, the payment is advanced to the closest prior business day.
              </CardContent>
            </Card>

            <Card className={`${contrastClasses.card}`}>
              <CardHeader>
                <div className="h-12 w-12 bg-blue-100 text-[#005EA2] flex items-center justify-center rounded-xl mb-4 font-extrabold font-headings text-xl">
                  3rd
                </div>
                <CardTitle className={`${fontSizes.h3}`}>Pre-1997 / Dual Claims</CardTitle>
                <CardDescription className={`${fontSizes.small}`}>Claims filed before May 1997</CardDescription>
              </CardHeader>
              <CardContent className={`${fontSizes.body} ${contrastClasses.textSecondary}`}>
                Payments are made on the <strong>3rd day of each month</strong>. Similar to SSI, if the 3rd lands on a weekend or Federal holiday, the payment is advanced to the prior business day.
              </CardContent>
            </Card>

            <Card className={`${contrastClasses.card}`}>
              <CardHeader>
                <div className="h-12 w-12 bg-blue-100 text-[#005EA2] flex items-center justify-center rounded-xl mb-4 font-extrabold font-headings text-xl">
                  Wed
                </div>
                <CardTitle className={`${fontSizes.h3}`}>Standard Social Security</CardTitle>
                <CardDescription className={`${fontSizes.small}`}>Post-May 1997 Applications</CardDescription>
              </CardHeader>
              <CardContent className={`${fontSizes.body} ${contrastClasses.textSecondary} space-y-2`}>
                Payments are scheduled on Wednesdays based on birth day:
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li><strong>Born 1st - 10th:</strong> Second Wednesday</li>
                  <li><strong>Born 11th - 20th:</strong> Third Wednesday</li>
                  <li><strong>Born 21st - 31st:</strong> Fourth Wednesday</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Senior approachability helper banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-100/50 p-6 md:p-8 rounded-2xl border border-slate-200">
            <div className="md:col-span-4">
              <img 
                src="https://images.pexels.com/photos/6248446/pexels-photo-6248446.jpeg" 
                alt="Older adult checking calendar dates on a tablet device at home" 
                className="rounded-xl object-cover w-full h-auto aspect-video md:aspect-[4/3] border border-slate-200"
              />
            </div>
            <div className="md:col-span-8 space-y-3">
              <h3 className={`${fontSizes.h3} ${contrastClasses.textPrimary}`}>Never Miss a Payment and Plan Your Budget</h3>
              <p className={`${fontSizes.body} text-slate-600`}>
                Using our clean and accessible tools, you can download the entire year&apos;s schedule as a spreadsheet, print it out to paste on your refrigerator, or instantly import dates into your smart phone calendar.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700">✓ Large Print Friendly</span>
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700">✓ One-Click Calendar Sync</span>
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700">✓ 100% Privacy Secure</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION SECTION */}
        <section className="space-y-8 no-print">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className={`${fontSizes.h2} ${contrastClasses.textPrimary}`}>Frequently Asked Questions</h2>
            <p className={`${fontSizes.body} text-slate-500 mt-2`}>
              Answers to common queries regarding Social Security payment distribution rules and scheduling.
            </p>
          </div>

          <Card className={`${contrastClasses.card}`}>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                
                <AccordionItem value="faq-1" className="border-b border-slate-200">
                  <AccordionTrigger 
                    data-testid="faq-accordion-trigger-0"
                    className={`${fontSizes.h3} text-slate-900 py-4 hover:no-underline font-semibold`}
                  >
                    What happens if my payment date falls on a weekend or federal holiday?
                  </AccordionTrigger>
                  <AccordionContent className={`${fontSizes.body} text-slate-600 pb-4`}>
                    If your scheduled payment date falls on a Saturday, Sunday, or a designated federal holiday, your funds will be deposited on the immediate preceding business day. For example, if the 1st of the month lands on a Sunday, your SSI payment is usually deposited on Friday.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-2" className="border-b border-slate-200">
                  <AccordionTrigger 
                    data-testid="faq-accordion-trigger-1"
                    className={`${fontSizes.h3} text-slate-900 py-4 hover:no-underline font-semibold`}
                  >
                    Why is my payment date different from my spouse or neighbor?
                  </AccordionTrigger>
                  <AccordionContent className={`${fontSizes.body} text-slate-600 pb-4`}>
                    Standard Social Security payment dates are determined entirely by your individual day of birth. If you were born on the 5th, your payment is made on the second Wednesday, whereas if your neighbor was born on the 25th, their payment is made on the fourth Wednesday. Additionally, recipients of SSI or older claims (pre-May 1997) follow different fixed-date guidelines entirely.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-3" className="border-b border-slate-200">
                  <AccordionTrigger 
                    data-testid="faq-accordion-trigger-2"
                    className={`${fontSizes.h3} text-slate-900 py-4 hover:no-underline font-semibold`}
                  >
                    How do I sign up for direct deposit?
                  </AccordionTrigger>
                  <AccordionContent className={`${fontSizes.body} text-slate-600 pb-4`}>
                    Direct deposit is the safest and fastest way to receive your payments. You can sign up through your online &quot;my Social Security&quot; account at <strong>ssa.gov</strong>, or call the Social Security Administration toll-free at 1-800-772-1213 (TTY 1-800-325-0778).
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-4" className="border-b border-slate-200">
                  <AccordionTrigger 
                    data-testid="faq-accordion-trigger-3"
                    className={`${fontSizes.h3} text-slate-900 py-4 hover:no-underline font-semibold`}
                  >
                    What should I do if my payment is late or missing?
                  </AccordionTrigger>
                  <AccordionContent className={`${fontSizes.body} text-slate-600 pb-4`}>
                    The Social Security Administration advises waiting three business days before reporting a missing or delayed payment, as bank processing times can occasionally vary. If three days have passed, contact your financial institution first, then call the SSA hotline at 1-800-772-1213.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-5" className="border-b border-slate-200">
                  <AccordionTrigger 
                    data-testid="faq-accordion-trigger-4"
                    className={`${fontSizes.h3} text-slate-900 py-4 hover:no-underline font-semibold`}
                  >
                    Does my birth date affect SSDI and Survivors benefits?
                  </AccordionTrigger>
                  <AccordionContent className={`${fontSizes.body} text-slate-600 pb-4`}>
                    Yes. Social Security Disability Insurance (SSDI) and Survivors benefits follow the exact same birth day schedule rules (Wednesdays) as Retirement benefits, as long as the claim was filed after May 1997.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-6" className="border-b border-slate-200">
                  <AccordionTrigger 
                    data-testid="faq-accordion-trigger-5"
                    className={`${fontSizes.h3} text-slate-900 py-4 hover:no-underline font-semibold`}
                  >
                    Is CheckPayDate.com an official government website?
                  </AccordionTrigger>
                  <AccordionContent className={`${fontSizes.body} text-slate-600 pb-4`}>
                    No. CheckPayDate.com is a free, independent scheduling tool and is not affiliated with, or endorsed by, the Social Security Administration or any government agency. We show schedule estimates based on published SSA payment rules. For your exact deposit date, use your &quot;my Social Security&quot; account at ssa.gov or call 1-800-772-1213.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-7" className="border-b border-slate-200">
                  <AccordionTrigger 
                    data-testid="faq-accordion-trigger-6"
                    className={`${fontSizes.h3} text-slate-900 py-4 hover:no-underline font-semibold`}
                  >
                    Do you collect my Social Security number or personal records?
                  </AccordionTrigger>
                  <AccordionContent className={`${fontSizes.body} text-slate-600 pb-4`}>
                    Never. We only use your day of birth to identify which Wednesday of the month applies to you, and we do not ask for your name, SSN, or any account details. This is a public scheduling calculator, not a people search or background check.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-8" className="border-none">
                  <AccordionTrigger 
                    data-testid="faq-accordion-trigger-7"
                    className={`${fontSizes.h3} text-slate-900 py-4 hover:no-underline font-semibold`}
                  >
                    Can I get a reminder before my payment arrives?
                  </AccordionTrigger>
                  <AccordionContent className={`${fontSizes.body} text-slate-600 pb-4`}>
                    Yes. After you check your dates, click &quot;Add to Calendar + Reminder&quot; to download a calendar file that includes an alert 2 days before every payment. The reminder is delivered by your own calendar app (Google, Apple, or Outlook) — CheckPayDate does not send emails or texts.
                  </AccordionContent>
                </AccordionItem>

              </Accordion>
            </CardContent>
          </Card>
        </section>

        {/* DISCLAIMER AND OFFICIAL RESOURCE CARD */}
        <section className="space-y-6">
          <Card className={`border-l-4 border-amber-500 bg-amber-50/50 p-6 rounded-2xl`}>
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-base font-bold text-amber-900 uppercase tracking-wider">Official Legal Disclaimer</h4>
                <p className={`${fontSizes.small} text-amber-800 mt-1 leading-relaxed`}>
                  Schedule estimate only. Not affiliated with SSA. For your exact deposit, use My Social Security or call 1-800-772-1213.
                </p>
              </div>
            </div>
          </Card>

          <Card className={`${contrastClasses.card} no-print`}>
            <CardHeader>
              <CardTitle className={`${fontSizes.h3} flex items-center`}>
                <HelpCircle className="h-5 w-5 text-[#005EA2] mr-2" /> Official SSA Helplines & Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className={`${fontSizes.body} text-slate-700`}>
                  Need official help? Connect directly with official federal government channels:
                </p>
                <div className="space-y-2">
                  <a 
                    href="https://www.ssa.gov" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[#005EA2] font-semibold hover:underline"
                  >
                    Visit Official ssa.gov Website <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                  <br />
                  <a 
                    href="https://www.ssa.gov/myaccount/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[#005EA2] font-semibold hover:underline"
                  >
                    Log In to &quot;my Social Security&quot; Account <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">SSA National Toll-Free Hotline</p>
                <div className="flex items-center space-x-2 text-slate-900 font-bold">
                  <Phone className="h-4 w-4 text-[#005EA2]" />
                  <span>1-800-772-1213</span>
                </div>
                <p className="text-xs text-slate-500">
                  Available Monday through Friday, 8:00 AM to 7:00 PM local time. For deaf or hard of hearing, call TTY 1-800-325-0778.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

      </main>

      {/* FOOTER */}
      <footer className={`${contrastClasses.footer}`}>
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="font-headings font-extrabold text-lg tracking-tight">CheckPayDate.com</span>
            </div>
            <p className="text-slate-400">
              An independent, privacy-secure utility helping retirees, beneficiaries, and families plan budgets easily and clearly.
            </p>
          </div>
          
          <div className="space-y-3">
            <CountryNav headingClass="text-slate-500" linkClass="text-slate-700 hover:text-[#005EA2] hover:underline font-medium" />
          </div>

          <div className="space-y-3">
            <span className="block font-bold text-xs uppercase tracking-wider text-slate-400">Privacy &amp; Terms</span>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link to="/privacy-policy" data-testid="footer-privacy-link" className="hover:text-white hover:underline font-semibold">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" data-testid="footer-terms-link" className="hover:text-white hover:underline font-semibold">Terms &amp; Conditions</Link>
              </li>
              <li>
                <Link to="/contact" data-testid="footer-contact-link" className="hover:text-white hover:underline font-semibold">Contact Us</Link>
              </li>
            </ul>
            <p className="text-slate-400 pt-1">
              No accounts and no payment data collected. This is a scheduling estimate tool, not a government portal.
            </p>
            <p className="text-xs text-slate-500 pt-2">
              © {new Date().getFullYear()} CheckPayDate.com. All Rights Reserved. Not a Government Entity.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
