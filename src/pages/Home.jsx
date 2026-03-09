import React, { useState } from "react";
import TaxForm from "../components/TaxForm";
import ResultCard from "../components/ResultCard";
import { TaxBreakdownChart } from "../components/TaxBreakdownChart";
import { ModelSelector } from "../components/ModelSelector";
import { AIAdvice } from "../components/AIAdvice";
import { getAIAdvice } from "../api/client";
import { RegimeComparisonChart } from "../components/RegimeComparisonChart";
import { BrainCircuit, ArrowLeft, Info, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export default function Home() {
  const [taxResult, setTaxResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [llmConfig, setLlmConfig] = useState(null);
  const [advice, setAdvice] = useState("");
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const handleTaxResult = (result) => {
    setTaxResult(result);
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setShowResults(false);
  };

  const handleAdvice = async () => {
    if (!llmConfig || !taxResult) return;

    setLoadingAdvice(true);
    try {
      const prompt = `
        Create a tax saving strategy for an Indian user based in ${taxResult.state || "India"} with:
        - Annual Income: ₹${taxResult.best_regime === "New Regime" ? taxResult.new_regime.gross_income : taxResult.old_regime.gross_income}
        - Current Deductions: ₹${taxResult.best_regime === "New Regime" ? taxResult.new_regime.total_deductions : taxResult.old_regime.total_deductions}
        - Taxable Income: ₹${taxResult.best_regime === "New Regime" ? taxResult.new_regime.taxable_income : taxResult.old_regime.taxable_income}
        - Calculated Tax: ₹${taxResult.best_regime === "New Regime" ? taxResult.new_regime.total_tax_payable : taxResult.old_regime.total_tax_payable}
        
        The user is currently recommended: ${taxResult.best_regime}.
        
        Provide actionable advice on how to save more tax under the Old Regime vs New Regime. 
        Mention any specific benefits or compliance rules relevant to ${taxResult.state || "their state"}.
        Keep it concise and professional.
      `;

      const payload = {
        provider: llmConfig.provider,
        model: llmConfig.model,
        message: prompt
      };

      const res = await getAIAdvice(payload);
      setAdvice(res.reply);
      // Slight delay to allow render
      setTimeout(() => {
        document.getElementById("ai-advice-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (error) {
      console.error(error);
      setAdvice("Failed to get AI advice. Please try again.");
    } finally {
      setLoadingAdvice(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl min-h-screen">

      {/* Header */}
      <header className="text-center mb-8 space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-white/40 rounded-full backdrop-blur-sm border border-white/50 mb-4 shadow-lg shadow-purple-500/10">
          <BrainCircuit className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
          AI Tax Advisor
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Advanced tax planning powered by multi-model AI.
        </p>
      </header>

      {/* View 1: Information Gathering */}
      {!showResults && (
        <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Your Financial Profile</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Please provide your financial details below.
              <span className="font-semibold text-purple-600 block mt-1">
                We need this information to accurately calculate your tax liability, compare regimes, and generate expert saving advice.
              </span>
            </p>
          </div>

          <TaxForm onResult={handleTaxResult} />
        </div>
      )}

      {/* View 2: Expert Analysis */}
      {showResults && taxResult && (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
          {/* ... Header with Back button ... */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2 hover:bg-white/50 text-gray-700">
              <ArrowLeft className="w-4 h-4" />
              Back to Inputs
            </Button>
            <div className="text-sm font-medium text-purple-700 bg-purple-50 px-4 py-1.5 rounded-full border border-purple-100 shadow-sm">
              Analysis Generated Successfully
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Results Column */}
            <div className="lg:col-span-8 space-y-6">
              <ResultCard result={taxResult} />

              {/* Charts Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RegimeComparisonChart
                  oldRegimeTax={taxResult.old_regime.total_tax_payable}
                  newRegimeTax={taxResult.new_regime.total_tax_payable}
                />

                <TaxBreakdownChart breakdown={taxResult.breakdown} />
              </div>

              {/* AI Advice Section - Now visually distinct */}
              <div id="ai-advice-section">
                <AIAdvice advice={advice} loading={loadingAdvice} />
              </div>
            </div>

            {/* AI Configuration Column (Sticky) */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="p-5 bg-white/60 border-purple-100 sticky top-6 shadow-xl shadow-purple-500/5">
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="font-bold text-gray-900 mb-1 text-lg">Expert AI Strategy</h3>
                    <p className="text-sm text-gray-500">
                      Generate a personalized tax saving strategy using advanced AI models.
                    </p>
                  </div>

                  <ModelSelector onChange={setLlmConfig} />

                  <Button
                    onClick={handleAdvice}
                    disabled={loadingAdvice}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all transform hover:-translate-y-0.5"
                  >
                    {loadingAdvice ? "Analysing Portfolio..." : "Generate AI Strategy"}
                    {!loadingAdvice && <ChevronRight className="w-4 h-4 ml-1" />}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
