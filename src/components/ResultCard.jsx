import React from "react";
import { Card } from "./ui/Card";
import { TrendingUp, CheckCircle, AlertCircle } from "lucide-react";

export default function ResultCard({ result }) {
  if (!result) return null;

  // Handle both old (flat) and new (nested) structures for backward compatibility
  // But since we updated backend, we expect nested.
  // We'll use the "best_regime" data for the main display.

  const isComprehensive = result.best_regime !== undefined;

  const displayData = isComprehensive
    ? (result.best_regime === "New Regime" ? result.new_regime : result.old_regime)
    : result;

  return (
    <div className="space-y-6">
      {/* Comparison Banner */}
      {isComprehensive && (
        <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                Recommended: {result.best_regime}
              </h3>
              <p className="text-gray-600">
                You save <span className="font-bold text-green-600">₹{result.tax_saved.toLocaleString()}</span> compared to the other regime.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center bg-gradient-to-br from-green-50 to-emerald-100 border-green-300 shadow-lg shadow-green-500/10">
          <p className="text-base font-medium text-gray-600 mb-1">Taxable Income</p>
          <p className="text-3xl font-bold text-gray-900">₹{displayData.taxable_income.toLocaleString()}</p>
        </Card>

        <Card className="text-center bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-300 shadow-lg shadow-blue-500/10">
          <p className="text-base font-medium text-gray-600 mb-1">Total Deductions</p>
          <p className="text-3xl font-bold text-gray-900">₹{displayData.total_deductions?.toLocaleString() || displayData.deductions?.toLocaleString()}</p>
        </Card>

        <Card className="text-center bg-gradient-to-br from-red-50 to-orange-100 border-red-300 shadow-lg shadow-red-500/10">
          <p className="text-base font-medium text-gray-600 mb-1">Net Tax Payable</p>
          <p className="text-3xl font-bold text-gray-900">₹{displayData.total_tax_payable.toLocaleString()}</p>
        </Card>
      </div>

      {/* Suggestions Section */}
      {isComprehensive && result.suggestions && result.suggestions.length > 0 && (
        <Card className="bg-orange-50/50 border-orange-200">
          <h4 className="flex items-center gap-2 font-semibold text-orange-800 mb-3">
            <AlertCircle className="w-5 h-5" />
            Optimization Opportunities
          </h4>
          <ul className="space-y-2">
            {result.suggestions.map((suggestion, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                {suggestion}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
