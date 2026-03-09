import React from "react";
import { Card } from "./ui/Card";
import { Sparkles, Copy, Check, TrendingUp, ShieldCheck, AlertCircle, Lightbulb } from "lucide-react";
import { Button } from "./ui/Button";

export function AIAdvice({ advice, loading }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(advice);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple Markdown Parser
  const renderContent = (text) => {
    if (!text) return null;

    // Split by double newlines to get paragraphs/sections
    const sections = text.split(/\n\n+/);

    return sections.map((section, index) => {
      // Check for headers
      if (section.startsWith("###") || section.startsWith("##") || section.startsWith("#")) {
        const title = section.replace(/^#+\s*/, "");
        return (
          <h3 key={index} className="text-lg font-bold text-gray-900 mt-6 mb-3 flex items-center gap-2">
            {title.includes("Saving") || title.includes("Strategy") ? <TrendingUp className="w-5 h-5 text-green-600" /> :
              title.includes("Compliance") || title.includes("Legal") ? <ShieldCheck className="w-5 h-5 text-blue-600" /> :
                title.includes("Start") || title.includes("Note") ? <AlertCircle className="w-5 h-5 text-orange-600" /> :
                  <Lightbulb className="w-5 h-5 text-purple-600" />}
            {title}
          </h3>
        );
      }

      // Check for lists
      if (section.trim().startsWith("-") || section.trim().startsWith("*")) {
        const items = section.split(/\n/).filter(line => line.trim().length > 0);
        return (
          <ul key={index} className="space-y-2 mb-4 ml-1">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700 bg-white/50 p-2 rounded-lg border border-purple-50/50">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                <span className="flex-1" dangerouslySetInnerHTML={{
                  __html: item.replace(/^[-*]\s*/, "").replace(/(\*\*)(.*?)\1/g, "<strong>$2</strong>")
                }} />
              </li>
            ))}
          </ul>
        );
      }

      // Default Paragraph
      return (
        <p key={index} className="text-gray-700 mb-4 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: section.replace(/(\*\*)(.*?)\1/g, "<strong>$2</strong>") }}
        />
      );
    });
  };

  if (loading) {
    return (
      <Card className="animate-pulse space-y-4 p-6 bg-white/80 backdrop-blur-sm border-purple-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-purple-100 rounded-full animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-100 rounded w-full"></div>
          <div className="h-4 bg-gray-100 rounded w-5/6"></div>
          <div className="h-4 bg-gray-100 rounded w-4/6"></div>
        </div>
      </Card>
    );
  }

  if (!advice) return null;

  return (
    <Card className="relative overflow-hidden border-purple-200 bg-white/80 backdrop-blur-md shadow-xl shadow-purple-500/5 transition-all hover:shadow-purple-500/10">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-6 border-b border-purple-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Expert AI Strategy</h3>
              <p className="text-xs text-purple-600 font-medium">Personalized for your portfolio</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleCopy} className="hover:bg-purple-50 text-gray-500 hover:text-purple-700 transition-colors">
            {copied ? <div className="flex items-center gap-1 text-green-600"><Check className="w-4 h-4" /> Copied</div> : <div className="flex items-center gap-1"><Copy className="w-4 h-4" /> Copy</div>}
          </Button>
        </div>

        <div className="prose-sm max-w-none">
          {renderContent(advice)}
        </div>

        <div className="mt-6 pt-4 border-t border-purple-50 text-center">
          <p className="text-xs text-gray-400 italic">
            AI-generated advice only. Please consult a CA for official filing.
          </p>
        </div>
      </div>
    </Card>
  );
}
