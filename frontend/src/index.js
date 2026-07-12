import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/index.css";
import App from "@/App";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";
import Contact from "@/pages/Contact";
import Methodology from "@/pages/Methodology";
import About from "@/pages/About";
import Changelog from "@/pages/Changelog";
import CountryPage from "@/pages/CountryPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/methodology" element={<Methodology />} />
          <Route path="/about" element={<About />} />
          <Route path="/changelog" element={<Changelog />} />
          <Route path="/canada/cpp-payment-dates/*" element={<CountryPage slug="canada-cpp" />} />
          <Route path="/canada/oas-payment-dates/*" element={<CountryPage slug="canada-oas" />} />
          <Route path="/uk/state-pension-payment-dates/*" element={<CountryPage slug="uk-state-pension" />} />
          <Route path="/australia/centrelink-payment-dates/*" element={<CountryPage slug="australia-centrelink" />} />
          <Route path="/south-africa/sassa-payment-dates/*" element={<CountryPage slug="southafrica-sassa" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
