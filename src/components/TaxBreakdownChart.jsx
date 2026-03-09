import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card } from "./ui/Card";

const COLORS = ["#8b5cf6", "#ec4899", "#3b82f6", "#10b981"];

export function TaxBreakdownChart({ breakdown }) {
    if (!breakdown || breakdown.length === 0) return null;

    return (
        <Card className="flex flex-col items-center justify-center p-6 bg-white/40">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Breakdown</h3>
            <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={breakdown}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {breakdown.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", color: "#111827", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                            itemStyle={{ color: "#111827" }}
                        />
                        <Legend wrapperStyle={{ color: "#374151" }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
