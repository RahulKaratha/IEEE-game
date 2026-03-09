import React, { useState } from "react";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Button } from "./ui/Button";
import { calculateTax } from "../api/client";
import { ChevronDown, ChevronRight, Info, Calculator, IndianRupee, MapPin } from "lucide-react";
import { cn } from "../lib/utils";

const InfoButton = ({ text }) => (
  <div className="group relative ml-2 inline-flex">
    <button type="button" className="text-gray-400 hover:text-purple-600 transition-colors">
      <Info className="w-4 h-4" />
    </button>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900/95 backdrop-blur text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl border border-white/10">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900/95"></div>
    </div>
  </div>
);

const FormSection = ({ title, isOpen, onToggle, children, icon: Icon }) => (
  <div className="border border-white/20 rounded-xl overflow-hidden bg-white/40 backdrop-blur-sm transition-all duration-300 hover:bg-white/50 hover:shadow-lg">
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "w-full flex items-center justify-between p-4 transition-colors text-left",
        isOpen ? "bg-purple-500/10 text-purple-900" : "text-gray-700 hover:bg-white/40"
      )}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-purple-600" />}
        <span className="font-semibold">{title}</span>
      </div>
      {isOpen ? <ChevronDown className="w-5 h-5 text-purple-500" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
    </button>
    {isOpen && <div className="p-5 space-y-5 animate-in slide-in-from-top-2 duration-200">{children}</div>}
  </div>
);

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Other"
];

export default function TaxForm({ onResult }) {
  const [formData, setFormData] = useState({
    age: 30,
    annual_income: 1500000,
    income_from_interest: 0,
    income_from_other_sources: 0,
    hra_received: 0,
    rent_paid: 0,
    state: "Delhi",
    city_type: "Non-Metro",
    section_80c: 150000,
    section_80d: 25000,
    section_80ccd_1b: 0,
    section_80tta: 0,
    home_loan_interest: 0,
    preferred_regime: "Auto", // Default
  });

  const [loading, setLoading] = useState(false);
  const [openSections, setOpenSections] = useState({
    location: true,
    basic: true,
    income: false,
    deductions: false,
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : (name === "state" || name === "city_type" || name === "preferred_regime" ? value : parseFloat(value) || 0),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // If New Regime is selected, explicitly zero out deductions for the API call to ensure clarity 
      // (though backend might ignore them, it's safer to clear them logic-wise if hidden)
      const dataToSend = { ...formData };
      if (formData.preferred_regime === "New") {
        dataToSend.section_80c = 0;
        dataToSend.section_80d = 0;
        dataToSend.section_80ccd_1b = 0;
        dataToSend.section_80tta = 0;
        dataToSend.home_loan_interest = 0;
        dataToSend.hra_received = 0;
        dataToSend.rent_paid = 0;
      }

      const result = await calculateTax(dataToSend);
      onResult({ ...result, state: formData.state });
    } catch (error) {
      console.error(error);
      alert("Error calculating tax");
    } finally {
      setLoading(false);
    }
  };

  // Visibility Logic
  const showDeductions = formData.preferred_regime === "Auto" || formData.preferred_regime === "Old";

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Calculator className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Tax Details</h2>
        </div>
        <span className="text-xs px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 font-semibold border border-purple-200">FY 2024-25</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* REGIME SELECTION (New) */}
        <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 space-y-3">
          <Label className="flex items-center text-purple-900 font-semibold">
            Select Tax Regime Preference
            <InfoButton text="Auto: We compare both to find lowest tax. Old: Claims deductions (80C, HRA). New: Lower rates, no deductions." />
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {["Auto", "Old", "New"].map((regime) => (
              <button
                key={regime}
                type="button"
                onClick={() => handleChange({ target: { name: "preferred_regime", value: regime } })}
                className={cn(
                  "py-2 px-3 rounded-lg text-sm font-medium transition-all border",
                  formData.preferred_regime === regime
                    ? "bg-purple-600 text-white border-purple-600 shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                )}
              >
                {regime}
                {regime === "Auto" && <span className="block text-[10px] opacity-80 font-normal">Recommended</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Section 0: Location */}
        <FormSection title="Location & Jurisdiction" isOpen={openSections.location} onToggle={() => toggleSection("location")} icon={MapPin}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label className="flex items-center">
                State of Residence
                <InfoButton text="Select your state to automatically calculate Professional Tax (PT) and other regional compliance rules." />
              </Label>
              <div className="relative">
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full bg-white/60 border border-purple-100 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500/30 outline-none hover:bg-white/80 transition-all appearance-none"
                >
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            {/* City Type is only relevant for HRA (Old Regime), but good to keep for context */}
            <div>
              <Label className="flex items-center">
                City Type
                <InfoButton text="Used for HRA Exemption. Select 'Metro' if you live in Delhi, Mumbai, Kolkata, or Chennai (50% exemption)." />
              </Label>
              <div className="relative">
                <select
                  name="city_type"
                  value={formData.city_type}
                  onChange={handleChange}
                  className="w-full bg-white/60 border border-purple-100 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500/30 outline-none hover:bg-white/80 transition-all appearance-none"
                >
                  <option value="Non-Metro">Non-Metro / Other</option>
                  <option value="Metro">Metro (Delhi/Mumbai/Kol/Che)</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </FormSection>

        {/* Section 1: Basic & Salary */}
        <FormSection title="Income & Basic Details" isOpen={openSections.basic} onToggle={() => toggleSection("basic")} icon={IndianRupee}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label className="flex items-center">
                Annual Salary (₹)
                <InfoButton text="Total Gross Salary before any deductions. Include Basic, HRA, Special Allowance, Bonus, etc." />
              </Label>
              <Input type="number" name="annual_income" value={formData.annual_income} onChange={handleChange} placeholder="e.g. 1500000" />
            </div>
            <div>
              <Label className="flex items-center">
                Age
                <InfoButton text="Your age determines tax slabs. Senior citizens (60+) get higher basic exemption limits in Old Regime." />
              </Label>
              <Input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="e.g. 30" />
            </div>
          </div>

          {showDeductions && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-top-2">
              <div>
                <Label className="flex items-center">
                  Rent Paid (Yearly)
                  <InfoButton text="Total rent paid by you in the financial year. Required to claim HRA exemption." />
                </Label>
                <Input type="number" name="rent_paid" value={formData.rent_paid} onChange={handleChange} />
              </div>
              <div>
                <Label className="flex items-center">
                  HRA Received (Yearly)
                  <InfoButton text="Total House Rent Allowance received from your employer." />
                </Label>
                <Input type="number" name="hra_received" value={formData.hra_received} onChange={handleChange} />
              </div>
            </div>
          )}
        </FormSection>

        {/* Section 2: Other Income (Shown for both, but simplified logic usually implies Old needs it more? No, interest is taxable in both usually) */}
        <FormSection title="Other Income Sources" isOpen={openSections.income} onToggle={() => toggleSection("income")} icon={Info}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label className="flex items-center">
                Interest Income
                <InfoButton text="Interest from Savings Bank and Fixed Deposits. Must be reported." />
              </Label>
              <Input type="number" name="income_from_interest" value={formData.income_from_interest} onChange={handleChange} />
            </div>
            <div>
              <Label className="flex items-center">
                Other Income
                <InfoButton text="Income from Freelancing, Capital Gains, etc." />
              </Label>
              <Input type="number" name="income_from_other_sources" value={formData.income_from_other_sources} onChange={handleChange} placeholder="Freelance, Capital Gains..." />
            </div>
          </div>
        </FormSection>

        {/* Section 3: Deductions (Effectively Old Regime Only) */}
        {showDeductions && (
          <FormSection title="Tax Deductions & Exemptions" isOpen={openSections.deductions} onToggle={() => toggleSection("deductions")} icon={ChevronDown}>
            <div className="p-3 mb-4 bg-orange-50 border border-orange-100 rounded-lg text-sm text-orange-800 flex items-start gap-2">
              <Info className="w-4 h-4 mt-0.5 shrink-0" />
              These deductions are applicable only for the Old Tax Regime.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label className="flex items-center">
                  Section 80C (Max 1.5L)
                  <InfoButton text="Investments in PPF, EPF, ELSS, LIC, Tuition Fees. Max limit ₹1.5 Lakhs." />
                </Label>
                <Input type="number" name="section_80c" value={formData.section_80c} onChange={handleChange} />
              </div>
              <div>
                <Label className="flex items-center">
                  Section 80D (Health Ins)
                  <InfoButton text="Health Insurance premiums for Self/Family (max 25k) and Parents." />
                </Label>
                <Input type="number" name="section_80d" value={formData.section_80d} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label className="flex items-center">
                  NPS (80CCD 1B)
                  <InfoButton text="Exclusive additional deduction of ₹50,000 for NPS Tier I." />
                </Label>
                <Input type="number" name="section_80ccd_1b" value={formData.section_80ccd_1b} onChange={handleChange} />
              </div>
              <div>
                <Label className="flex items-center">
                  Home Loan Interest (Sec 24)
                  <InfoButton text="Interest on Home Loan for self-occupied property. Max ₹2 Lakhs." />
                </Label>
                <Input type="number" name="home_loan_interest" value={formData.home_loan_interest} onChange={handleChange} />
              </div>
            </div>
          </FormSection>
        )}

        <Button type="submit" className="w-full glass-button mt-4 h-12 text-lg shadow-purple-500/20" disabled={loading}>
          {loading ? "Analyzing Tax Models..." : "Calculate & Optimization Strategy"}
        </Button>
      </form>
    </Card>
  );
}
