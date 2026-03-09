import React, { useEffect, useState } from "react";
import { Card } from "./ui/Card";
import { Label } from "./ui/Label";
import { Bot, ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";

export function ModelSelector({ onChange }) {
  const [providers, setProviders] = useState({});
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch configuration from the backend
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        setProviders(data);
        // Default to first provider
        const firstProvider = Object.keys(data)[0];
        if (firstProvider) {
          setSelectedProvider(firstProvider);
          const models = data[firstProvider];
          if (models && models.length > 0) {
            setSelectedModel(models[0].id);
            onChange({ provider: firstProvider, model: models[0].id });
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load config", err);
        setLoading(false);
      });
  }, []);

  const handleProviderChange = (e) => {
    const newProvider = e.target.value;
    setSelectedProvider(newProvider);

    // Reset model to first available for this provider
    const models = providers[newProvider] || [];
    if (models.length > 0) {
      const newModel = models[0].id;
      setSelectedModel(newModel);
      onChange({ provider: newProvider, model: newModel });
    } else {
      setSelectedModel("");
      onChange({ provider: newProvider, model: "" });
    }
  };

  const handleModelChange = (e) => {
    const newModel = e.target.value;
    setSelectedModel(newModel);
    onChange({ provider: selectedProvider, model: newModel });
  };

  if (loading) return <div className="text-gray-500 text-base">Loading AI Models...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Bot className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-base text-gray-800">AI Configuration</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">AI Provider</Label>
          <div className="relative">
            <select
              value={selectedProvider}
              onChange={handleProviderChange}
              className="w-full bg-white/60 border border-purple-100 rounded-lg px-3 py-2.5 text-sm text-gray-900 appearance-none focus:ring-2 focus:ring-purple-500/30 outline-none shadow-sm transition-all hover:bg-white/80 pr-8"
            >
              {Object.keys(providers).map((p) => (
                <option key={p} value={p} className="bg-white text-gray-900 py-2">
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Model</Label>
          <div className="relative">
            <select
              value={selectedModel}
              onChange={handleModelChange}
              className="w-full bg-white/60 border border-purple-100 rounded-lg px-3 py-2.5 text-sm text-gray-900 appearance-none focus:ring-2 focus:ring-purple-500/30 outline-none shadow-sm transition-all hover:bg-white/80 pr-8"
            >
              {providers[selectedProvider]?.map((m) => (
                <option key={m.id} value={m.id} className="bg-white text-gray-900 py-2">
                  {m.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
