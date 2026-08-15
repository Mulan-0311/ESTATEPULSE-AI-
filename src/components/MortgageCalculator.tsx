import React, { useState, useMemo } from 'react';
import {
  Calculator,
  DollarSign,
  Percent,
  Calendar,
  PieChart,
  ShieldCheck,
  ArrowRight,
  Info,
  TrendingDown,
  Sparkles,
  Building,
  CheckCircle2,
  HelpCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Coins,
  Receipt,
  Wallet,
  Landmark,
  PiggyBank
} from 'lucide-react';

interface MortgageCalculatorProps {
  propertyPrice: number;
  rentalEstimate?: number;
  areaSqft?: number;
  localityName?: string;
}

export const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({
  propertyPrice,
  rentalEstimate,
  areaSqft = 1200,
  localityName
}) => {
  // Base State Parameters
  const [price, setPrice] = useState<number>(propertyPrice || 10000000);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(20); // 20%
  const [interestRate, setInterestRate] = useState<number>(8.5); // 8.5% p.a.
  const [tenureYears, setTenureYears] = useState<number>(20); // 20 years

  // Additional Monthly Breakdown Inclusions
  const [includeTaxes, setIncludeTaxes] = useState<boolean>(true);
  const [includeInsurance, setIncludeInsurance] = useState<boolean>(true);
  const [includeMaintenance, setIncludeMaintenance] = useState<boolean>(true);
  const [maintenancePerSqft, setMaintenancePerSqft] = useState<number>(3.5); // ₹3.5/sqft/mo

  // Extra Prepayment Simulation
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState<number>(0);
  const [showAmortization, setShowAmortization] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'breakdown' | 'amortization' | 'prepayment'>('breakdown');
  const [copied, setCopied] = useState<boolean>(false);

  // Sync if prop changes
  React.useEffect(() => {
    if (propertyPrice && propertyPrice > 0) {
      setPrice(propertyPrice);
    }
  }, [propertyPrice]);

  // Calculations
  const downPaymentAmount = useMemo(() => {
    return Math.round((price * downPaymentPct) / 100);
  }, [price, downPaymentPct]);

  const principal = useMemo(() => {
    return Math.max(0, price - downPaymentAmount);
  }, [price, downPaymentAmount]);

  // Standard Monthly EMI Calculation: E = P * r * (1+r)^n / ((1+r)^n - 1)
  const emiCalculation = useMemo(() => {
    if (principal <= 0 || interestRate <= 0 || tenureYears <= 0) {
      return {
        monthlyEmi: 0,
        totalInterest: 0,
        totalPayment: 0,
        monthlyInterestFirst: 0,
        monthlyPrincipalFirst: 0
      };
    }

    const r = interestRate / 12 / 100; // Monthly interest rate
    const n = tenureYears * 12; // Total months

    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - principal;

    // First month breakdown
    const monthlyInterestFirst = principal * r;
    const monthlyPrincipalFirst = emi - monthlyInterestFirst;

    return {
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      monthlyInterestFirst: Math.round(monthlyInterestFirst),
      monthlyPrincipalFirst: Math.round(monthlyPrincipalFirst)
    };
  }, [principal, interestRate, tenureYears]);

  // Extra Additional Monthly Items
  const monthlyPropertyTax = useMemo(() => {
    if (!includeTaxes) return 0;
    // Approx 0.25% of property value annually / 12
    return Math.round((price * 0.0025) / 12);
  }, [price, includeTaxes]);

  const monthlyInsurance = useMemo(() => {
    if (!includeInsurance) return 0;
    // Approx ₹1,200 - ₹3,500/yr depending on valuation
    return Math.round(Math.max(400, (price * 0.0004) / 12));
  }, [price, includeInsurance]);

  const monthlyMaintenance = useMemo(() => {
    if (!includeMaintenance) return 0;
    return Math.round((areaSqft || 1200) * maintenancePerSqft);
  }, [areaSqft, maintenancePerSqft, includeMaintenance]);

  // Total All-Inclusive Monthly Cost
  const totalMonthlyOutflow = useMemo(() => {
    return emiCalculation.monthlyEmi + monthlyPropertyTax + monthlyInsurance + monthlyMaintenance;
  }, [emiCalculation.monthlyEmi, monthlyPropertyTax, monthlyInsurance, monthlyMaintenance]);

  // Relative percentages for the visual donut / progress bars
  const visualShares = useMemo(() => {
    if (totalMonthlyOutflow <= 0) {
      return { principal: 50, interest: 50, tax: 0, ins: 0, maint: 0 };
    }
    const pEmi = emiCalculation.monthlyEmi;
    const pShare = Math.round((emiCalculation.monthlyPrincipalFirst / totalMonthlyOutflow) * 100);
    const iShare = Math.round((emiCalculation.monthlyInterestFirst / totalMonthlyOutflow) * 100);
    const tShare = Math.round((monthlyPropertyTax / totalMonthlyOutflow) * 100);
    const inShare = Math.round((monthlyInsurance / totalMonthlyOutflow) * 100);
    const mShare = Math.max(0, 100 - (pShare + iShare + tShare + inShare));

    return {
      principal: pShare,
      interest: iShare,
      tax: tShare,
      ins: inShare,
      maint: mShare
    };
  }, [totalMonthlyOutflow, emiCalculation, monthlyPropertyTax, monthlyInsurance, monthlyMaintenance]);

  // Overall Total Loan Ratio (Principal vs Total Interest)
  const totalInterestRatio = useMemo(() => {
    if (emiCalculation.totalPayment <= 0) return { pPct: 50, iPct: 50 };
    const pPct = Math.round((principal / emiCalculation.totalPayment) * 100);
    return { pPct, iPct: 100 - pPct };
  }, [principal, emiCalculation.totalPayment]);

  // Prepayment / Extra Payment Benefit Calculation
  const prepaymentSavings = useMemo(() => {
    if (extraMonthlyPayment <= 0 || principal <= 0 || interestRate <= 0) {
      return { monthsSaved: 0, interestSaved: 0, newTenureYears: tenureYears };
    }

    const r = interestRate / 12 / 100;
    const totalMonthly = emiCalculation.monthlyEmi + extraMonthlyPayment;
    let balance = principal;
    let totalInterestPaid = 0;
    let months = 0;
    const maxMonths = tenureYears * 12;

    while (balance > 0 && months < maxMonths) {
      months++;
      const interestMonth = balance * r;
      totalInterestPaid += interestMonth;
      const principalMonth = totalMonthly - interestMonth;
      balance = Math.max(0, balance - principalMonth);
    }

    const monthsSaved = Math.max(0, maxMonths - months);
    const interestSaved = Math.max(0, emiCalculation.totalInterest - Math.round(totalInterestPaid));
    const newTenureYears = Number((months / 12).toFixed(1));

    return {
      monthsSaved,
      interestSaved,
      newTenureYears
    };
  }, [extraMonthlyPayment, principal, interestRate, tenureYears, emiCalculation]);

  // Yearly Amortization Schedule
  const amortizationSchedule = useMemo(() => {
    if (principal <= 0 || interestRate <= 0 || tenureYears <= 0) return [];

    const r = interestRate / 12 / 100;
    const emi = emiCalculation.monthlyEmi;
    let balance = principal;
    const schedule: Array<{
      year: number;
      openingBalance: number;
      principalPaid: number;
      interestPaid: number;
      totalPaid: number;
      closingBalance: number;
    }> = [];

    for (let yr = 1; yr <= tenureYears; yr++) {
      const openingBalance = balance;
      let yrPrincipal = 0;
      let yrInterest = 0;

      for (let m = 1; m <= 12; m++) {
        if (balance <= 0) break;
        const interest = balance * r;
        const princ = Math.min(balance, emi - interest);
        yrInterest += interest;
        yrPrincipal += princ;
        balance = Math.max(0, balance - princ);
      }

      schedule.push({
        year: yr,
        openingBalance: Math.round(openingBalance),
        principalPaid: Math.round(yrPrincipal),
        interestPaid: Math.round(yrInterest),
        totalPaid: Math.round(yrPrincipal + yrInterest),
        closingBalance: Math.round(balance)
      });

      if (balance <= 0) break;
    }

    return schedule;
  }, [principal, interestRate, tenureYears, emiCalculation.monthlyEmi]);

  // Income eligibility estimate (Assuming standard 40% FOIR / Fixed Obligation to Income Ratio)
  const recommendedMonthlyIncome = useMemo(() => {
    return Math.round(emiCalculation.monthlyEmi / 0.4);
  }, [emiCalculation.monthlyEmi]);

  // Currency formatting helper
  const formatINR = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    } else if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const copyBreakdown = () => {
    const text = `
EstatePulse Home Loan & Monthly EMI Breakdown:
• Property Value: ${formatINR(price)}
• Down Payment (${downPaymentPct}%): ${formatINR(downPaymentAmount)}
• Principal Loan: ${formatINR(principal)}
• Interest Rate: ${interestRate}% p.a. | Tenure: ${tenureYears} Years
• Monthly Base EMI: ₹${emiCalculation.monthlyEmi.toLocaleString('en-IN')}
• Total Monthly Outflow (incl. Taxes & Society Maint.): ₹${totalMonthlyOutflow.toLocaleString('en-IN')}
• Total Interest Payable: ${formatINR(emiCalculation.totalInterest)}
• Total Amount Payable: ${formatINR(emiCalculation.totalPayment)}
• Recommended Min. Monthly Income: ₹${recommendedMonthlyIncome.toLocaleString('en-IN')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6 text-slate-800 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Calculator className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Interactive Home Loan & EMI Calculator
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Model custom loan parameters, bank interest rates, and loan tenure with live monthly payment breakdown.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={copyBreakdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200"
            title="Copy loan summary"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Plan'}</span>
          </button>

          <span className="px-3 py-1.5 text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200 rounded-lg">
            Banking Standard EMI
          </span>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Interactive Sliders & Configuration (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Property Market Value Input & Slider */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                <span>Property Market Value</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-base">{formatINR(price)}</span>
                <span className="text-[11px] text-slate-400 font-semibold">
                  (₹{price.toLocaleString('en-IN')})
                </span>
              </div>
            </div>
            <input
              type="range"
              min={1500000}
              max={150000000}
              step={250000}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full accent-blue-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>₹15 L</span>
              <span>₹2.5 Cr</span>
              <span>₹5.0 Cr</span>
              <span>₹15.0 Cr</span>
            </div>
          </div>

          {/* Down Payment Controls */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-blue-600" />
                <span>Down Payment ({downPaymentPct}%)</span>
              </label>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-blue-600 text-sm">
                  {formatINR(downPaymentAmount)}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">
                  (Loan: {formatINR(principal)})
                </span>
              </div>
            </div>

            <input
              type="range"
              min={10}
              max={75}
              step={5}
              value={downPaymentPct}
              onChange={(e) => setDownPaymentPct(Number(e.target.value))}
              className="w-full accent-blue-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
            />

            {/* Quick Percentage Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {[10, 20, 25, 30, 40, 50].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setDownPaymentPct(pct)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                    downPaymentPct === pct
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {pct}% {pct === 20 && '(Standard)'}
                </button>
              ))}
            </div>
          </div>

          {/* Interest Rate Controls */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-blue-600" />
                <span>Annual Interest Rate (% p.a.)</span>
              </label>
              <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-xs">
                <input
                  type="number"
                  min={5.0}
                  max={16.0}
                  step={0.05}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Math.max(1, Number(e.target.value)))}
                  className="w-14 font-black text-slate-900 text-sm focus:outline-none text-right"
                />
                <span className="font-bold text-slate-500 text-xs">%</span>
              </div>
            </div>

            <input
              type="range"
              min={6.0}
              max={14.0}
              step={0.05}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-blue-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
            />

            {/* Bank Rate Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {[
                { label: 'Prime / Repo (8.25%)', val: 8.25 },
                { label: 'Standard Bank (8.75%)', val: 8.75 },
                { label: 'NBFC (9.5%)', val: 9.5 },
                { label: 'Commercial (10.5%)', val: 10.5 }
              ].map((rate) => (
                <button
                  key={rate.val}
                  onClick={() => setInterestRate(rate.val)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                    interestRate === rate.val
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {rate.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loan Tenure Controls */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Loan Tenure Duration</span>
              </label>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-900 text-base">{tenureYears} Years</span>
                <span className="text-[11px] text-slate-400 font-semibold">
                  ({tenureYears * 12} Months)
                </span>
              </div>
            </div>

            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full accent-blue-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
            />

            {/* Quick Tenure Selection */}
            <div className="grid grid-cols-6 gap-2 pt-1">
              {[5, 10, 15, 20, 25, 30].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setTenureYears(yr)}
                  className={`py-1.5 rounded-lg text-xs font-bold text-center transition-all ${
                    tenureYears === yr
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {yr} Yrs
                </button>
              ))}
            </div>
          </div>

          {/* Additional Monthly Outflow Toggles (Property Tax, Insurance, Society HOA) */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-blue-600" />
                <span>Include Ancillary Monthly Escrow Items</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">Taxes, Insurance & HOA</span>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              {/* Property Tax Toggle */}
              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer hover:bg-slate-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={includeTaxes}
                  onChange={(e) => setIncludeTaxes(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div>
                  <div className="font-bold text-slate-800">Property Tax</div>
                  <div className="text-[10px] text-slate-500">
                    {includeTaxes ? `₹${monthlyPropertyTax.toLocaleString('en-IN')}/mo` : 'Excluded'}
                  </div>
                </div>
              </label>

              {/* Home Insurance Toggle */}
              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer hover:bg-slate-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={includeInsurance}
                  onChange={(e) => setIncludeInsurance(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div>
                  <div className="font-bold text-slate-800">Home Insurance</div>
                  <div className="text-[10px] text-slate-500">
                    {includeInsurance ? `₹${monthlyInsurance.toLocaleString('en-IN')}/mo` : 'Excluded'}
                  </div>
                </div>
              </label>

              {/* Maintenance Toggle */}
              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer hover:bg-slate-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={includeMaintenance}
                  onChange={(e) => setIncludeMaintenance(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div>
                  <div className="font-bold text-slate-800">Society / HOA</div>
                  <div className="text-[10px] text-slate-500">
                    {includeMaintenance ? `₹${monthlyMaintenance.toLocaleString('en-IN')}/mo` : 'Excluded'}
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Calculation Results Card (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-gradient-to-b from-slate-900 to-slate-950 text-white p-6 sm:p-7 rounded-2xl border border-slate-800 shadow-xl">
          {/* Top Main EMI Display */}
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[11px] font-extrabold uppercase text-blue-400 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Total Monthly Payment Outflow</span>
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  ₹{totalMonthlyOutflow.toLocaleString('en-IN')}
                </div>
                <span className="text-xs text-slate-400 font-bold">/ month</span>
              </div>

              {/* Base EMI subline */}
              <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                <span>Base Loan EMI:</span>
                <span className="font-bold text-slate-200">
                  ₹{emiCalculation.monthlyEmi.toLocaleString('en-IN')} / mo
                </span>
              </div>
            </div>

            {/* Visual Breakdown Stacked Bar */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-300">Monthly Payment Distribution</span>
                <span className="text-blue-400 font-extrabold">100% Itemized</span>
              </div>

              {/* Colored Stacked Bar */}
              <div className="h-3.5 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                {/* Principal */}
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${visualShares.principal}%` }}
                  title={`Principal: ${visualShares.principal}%`}
                />
                {/* Interest */}
                <div
                  className="h-full bg-indigo-400 transition-all duration-300"
                  style={{ width: `${visualShares.interest}%` }}
                  title={`Interest: ${visualShares.interest}%`}
                />
                {/* Property Tax */}
                {includeTaxes && (
                  <div
                    className="h-full bg-amber-400 transition-all duration-300"
                    style={{ width: `${visualShares.tax}%` }}
                    title={`Property Tax: ${visualShares.tax}%`}
                  />
                )}
                {/* Insurance */}
                {includeInsurance && (
                  <div
                    className="h-full bg-emerald-400 transition-all duration-300"
                    style={{ width: `${visualShares.ins}%` }}
                    title={`Insurance: ${visualShares.ins}%`}
                  />
                )}
                {/* Maintenance */}
                {includeMaintenance && (
                  <div
                    className="h-full bg-cyan-400 transition-all duration-300"
                    style={{ width: `${visualShares.maint}%` }}
                    title={`Society HOA: ${visualShares.maint}%`}
                  />
                )}
              </div>

              {/* Itemized Legend Pills */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <span>Principal</span>
                  </span>
                  <span className="font-bold text-white">
                    ₹{emiCalculation.monthlyPrincipalFirst.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 flex-shrink-0" />
                    <span>Interest</span>
                  </span>
                  <span className="font-bold text-white">
                    ₹{emiCalculation.monthlyInterestFirst.toLocaleString('en-IN')}
                  </span>
                </div>

                {includeTaxes && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0" />
                      <span>Property Tax</span>
                    </span>
                    <span className="font-bold text-white">
                      ₹{monthlyPropertyTax.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                {includeInsurance && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      <span>Insurance</span>
                    </span>
                    <span className="font-bold text-white">
                      ₹{monthlyInsurance.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                {includeMaintenance && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800 col-span-2">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 flex-shrink-0" />
                      <span>Society Maintenance / HOA</span>
                    </span>
                    <span className="font-bold text-white">
                      ₹{monthlyMaintenance.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Total Lifetime Loan Summary */}
            <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Sanctioned Principal Loan:</span>
                <span className="font-bold text-slate-100">{formatINR(principal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Interest Over {tenureYears} Yrs:</span>
                <span className="font-bold text-amber-400">{formatINR(emiCalculation.totalInterest)}</span>
              </div>
              <div className="flex justify-between text-slate-400 font-bold pt-1.5 border-t border-slate-800/80 text-slate-100">
                <span>Total Lifetime Loan Repayment:</span>
                <span className="text-emerald-400 font-black">
                  {formatINR(emiCalculation.totalPayment)}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Insights: Rental Offset & FOIR Eligibility */}
          <div className="space-y-3 pt-2">
            {/* Rental Income Offset Comparison */}
            {rentalEstimate && rentalEstimate > 0 ? (
              <div className="p-3.5 rounded-xl bg-blue-950/60 border border-blue-800/60 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold text-blue-300">
                  <div className="flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-blue-400" />
                    <span>Rental Income Net Offset</span>
                  </div>
                  <span className="text-emerald-400 font-extrabold">
                    {Math.min(100, Math.round((rentalEstimate / emiCalculation.monthlyEmi) * 100))}% Covered
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Est. monthly rent of <strong className="text-white">₹{rentalEstimate.toLocaleString('en-IN')}</strong> offsets your EMI. Your net out-of-pocket EMI is approximately{' '}
                  <strong className="text-blue-300 font-bold">
                    ₹{Math.max(0, emiCalculation.monthlyEmi - rentalEstimate).toLocaleString('en-IN')}/mo
                  </strong>.
                </p>
              </div>
            ) : null}

            {/* Income Eligibility Guideline */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-bold tracking-wider">
                  Recommended Min. Monthly Income
                </span>
                <span className="text-xs text-slate-300">
                  (Based on 40% Bank DTI/FOIR threshold)
                </span>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-blue-400 text-sm block">
                  ₹{recommendedMonthlyIncome.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">/ month</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* EXPANDABLE ADVANCED TOOLS: Prepayment Simulator & Amortization Table    */}
      {/* ======================================================================= */}
      <div className="pt-4 border-t border-slate-200 space-y-4">
        {/* Tab Toggle Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('breakdown')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'breakdown'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Loan Insights
            </button>
            <button
              onClick={() => setActiveTab('prepayment')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'prepayment'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PiggyBank className="w-3.5 h-3.5 text-emerald-600" />
              <span>Prepayment Simulator</span>
            </button>
            <button
              onClick={() => setActiveTab('amortization')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'amortization'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Receipt className="w-3.5 h-3.5 text-blue-600" />
              <span>Amortization Schedule</span>
            </button>
          </div>
        </div>

        {/* TAB 1: PREPAYMENT SIMULATOR */}
        {activeTab === 'prepayment' && (
          <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/60 pb-3">
              <div>
                <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                  <PiggyBank className="w-4 h-4 text-emerald-700" />
                  <span>Early Payoff & Interest Reduction Simulator</span>
                </h4>
                <p className="text-xs text-emerald-800">
                  See how adding even a modest extra amount each month drastically reduces your total interest and tenure.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-12 gap-6 items-center">
              <div className="sm:col-span-6 space-y-2">
                <div className="flex justify-between text-xs font-bold text-emerald-900">
                  <span>Extra Monthly Prepayment:</span>
                  <span className="text-sm font-black text-emerald-700">
                    +₹{extraMonthlyPayment.toLocaleString('en-IN')} / mo
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50000}
                  step={1000}
                  value={extraMonthlyPayment}
                  onChange={(e) => setExtraMonthlyPayment(Number(e.target.value))}
                  className="w-full accent-emerald-600 bg-emerald-200 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex gap-2 pt-1">
                  {[2000, 5000, 10000, 20000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setExtraMonthlyPayment(amt)}
                      className={`px-2 py-1 rounded-md text-[11px] font-bold transition-colors ${
                        extraMonthlyPayment === amt
                          ? 'bg-emerald-700 text-white'
                          : 'bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                      }`}
                    >
                      +₹{amt / 1000}k
                    </button>
                  ))}
                  <button
                    onClick={() => setExtraMonthlyPayment(0)}
                    className="px-2 py-1 rounded-md text-[11px] font-bold bg-white text-slate-500 border border-slate-200 hover:bg-slate-100"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="sm:col-span-6 grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-emerald-200 shadow-xs">
                  <span className="text-emerald-700 text-[10px] font-bold block uppercase tracking-wider">
                    Total Interest Saved
                  </span>
                  <span className="text-lg font-black text-emerald-700 block mt-0.5">
                    {formatINR(prepaymentSavings.interestSaved)}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium">Over loan lifetime</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-emerald-200 shadow-xs">
                  <span className="text-emerald-700 text-[10px] font-bold block uppercase tracking-wider">
                    Tenure Shortened
                  </span>
                  <span className="text-lg font-black text-emerald-700 block mt-0.5">
                    {(prepaymentSavings.monthsSaved / 12).toFixed(1)} Years
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium">
                    Debt-free in {prepaymentSavings.newTenureYears} yrs
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AMORTIZATION SCHEDULE */}
        {activeTab === 'amortization' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">Year-by-Year Amortization Schedule</span>
              <span className="text-slate-500 text-[11px]">
                Showing {amortizationSchedule.length} years repayment trajectory
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-72 overflow-y-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-100 sticky top-0 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Year</th>
                    <th className="py-2.5 px-3">Opening Balance</th>
                    <th className="py-2.5 px-3 text-blue-600">Principal Paid</th>
                    <th className="py-2.5 px-3 text-indigo-600">Interest Paid</th>
                    <th className="py-2.5 px-3">Total Payment</th>
                    <th className="py-2.5 px-3 text-right">Closing Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {amortizationSchedule.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 px-3 font-bold text-slate-900">Year {row.year}</td>
                      <td className="py-2 px-3">₹{row.openingBalance.toLocaleString('en-IN')}</td>
                      <td className="py-2 px-3 font-bold text-blue-600">
                        ₹{row.principalPaid.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2 px-3 text-indigo-600">
                        ₹{row.interestPaid.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2 px-3">₹{row.totalPaid.toLocaleString('en-IN')}</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">
                        ₹{row.closingBalance.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
