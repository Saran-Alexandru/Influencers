import React, { useState } from "react";
import { Save, Loader } from "lucide-react";

export default function Settings() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    dateRange: "last-7",
    claimsPerAnalysis: 100,
    dataSources: {
      pubmed: true,
      cochrane: true,
      who: true,
    },
    minTrustScore: 70,
    confidenceThreshold: 85,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Settings saved:", settings);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Error saving settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDataSourceChange = (source: string) => {
    setSettings((prev) => ({
      ...prev,
      dataSources: {
        ...prev.dataSources,
        [source]: !prev.dataSources[source as keyof typeof prev.dataSources],
      },
    }));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Research Configuration
        </h1>
        <p className="text-gray-600">
          Customize analysis parameters and data sources
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Analysis Parameters
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <select
                  value={settings.dateRange}
                  onChange={(e) => handleChange("dateRange", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="last-7">Last 7 days</option>
                  <option value="last-30">Last 30 days</option>
                  <option value="last-90">Last 90 days</option>
                  <option value="custom">Custom range</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Claims per Analysis
                </label>
                <input
                  type="number"
                  value={settings.claimsPerAnalysis}
                  onChange={(e) =>
                    handleChange("claimsPerAnalysis", parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Data Sources
            </h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pubmed"
                  checked={settings.dataSources.pubmed}
                  onChange={() => handleDataSourceChange("pubmed")}
                  className="w-4 h-4 text-indigo-600"
                />
                <label htmlFor="pubmed" className="ml-2 text-gray-700">
                  PubMed Central
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="cochrane"
                  checked={settings.dataSources.cochrane}
                  onChange={() => handleDataSourceChange("cochrane")}
                  className="w-4 h-4 text-indigo-600"
                />
                <label htmlFor="cochrane" className="ml-2 text-gray-700">
                  Cochrane Library
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="who"
                  checked={settings.dataSources.who}
                  onChange={() => handleDataSourceChange("who")}
                  className="w-4 h-4 text-indigo-600"
                />
                <label htmlFor="who" className="ml-2 text-gray-700">
                  WHO Guidelines
                </label>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              AI Configuration
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Trust Score
                </label>
                <input
                  type="number"
                  value={settings.minTrustScore}
                  onChange={(e) =>
                    handleChange("minTrustScore", parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confidence Threshold
                </label>
                <input
                  type="number"
                  value={settings.confidenceThreshold}
                  onChange={(e) =>
                    handleChange(
                      "confidenceThreshold",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:bg-indigo-400"
            >
              {isSaving ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
