import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Card } from "./ui/Card";

export function RegimeComparisonChart({ oldRegimeTax, newRegimeTax }) {
    const data = [
        {
            name: "Old Regime",
            tax: oldRegimeTax,
            color: "#8b5cf6", // Purple
        },
        {
            name: "New Regime",
            tax: newRegimeTax,
            color: "#ec4899", // Pink
        },
    ];

    return (
        <Card className="flex flex-col items-center justify-center p-6 bg-white/40 h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Regime Comparison (Tax Payable)</h3>
            <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                        <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: "#374151" }} axisLine={false} tickLine={false} />
                        <YAxis stroke="#6b7280" tick={{ fill: "#374151" }} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
                        <Tooltip
                            cursor={{ fill: "transparent" }}
                            contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                color: "#111827",
                            }}
                            formatter={(value) => [`₹${value.toLocaleString()}`, "Tax Payable"]}
                        />
                        <Bar dataKey="tax" radius={[4, 4, 0, 0]} barSize={60}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
