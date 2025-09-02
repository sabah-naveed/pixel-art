import React, { useState } from "react";
import { Settings, Sparkles, Palette } from "lucide-react";

const SettingsPanel = ({ onProcess }) => {
  const [settings, setSettings] = useState({
    blockSize: 5,
    smartMode: false,
    maxColors: 32,
  });

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleProcess = () => {
    onProcess(settings);
  };

  return (
    <div className="card">
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-6 rounded-t-2xl">
        <div className="flex items-center">
          <Settings className="h-6 w-6 mr-3" />
          <h2 className="text-xl font-semibold">Processing Settings</h2>
        </div>
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Block Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Block Size
            </label>
            <div className="space-y-4">
              <input
                type="range"
                min="2"
                max="20"
                value={settings.blockSize}
                onChange={(e) =>
                  handleSettingChange("blockSize", parseInt(e.target.value))
                }
                className="range-slider"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>2×2</span>
                <span className="font-semibold text-primary-600">
                  {settings.blockSize}×{settings.blockSize}
                </span>
                <span>20×20</span>
              </div>
            </div>
          </div>

          {/* Smart Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Smart Color Reduction
            </label>
            <div className="space-y-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.smartMode}
                  onChange={(e) =>
                    handleSettingChange("smartMode", e.target.checked)
                  }
                  className="sr-only"
                />
                <div
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.smartMode ? "bg-success-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.smartMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </div>
                <span className="ml-3 text-sm text-gray-700">
                  {settings.smartMode ? "Enabled" : "Disabled"}
                </span>
              </label>

              {settings.smartMode && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Max Colors
                  </label>
                  <input
                    type="range"
                    min="8"
                    max="64"
                    value={settings.maxColors}
                    onChange={(e) =>
                      handleSettingChange("maxColors", parseInt(e.target.value))
                    }
                    className="range-slider"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>8</span>
                    <span className="font-semibold text-success-600">
                      {settings.maxColors}
                    </span>
                    <span>64</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Process Button */}
          <div className="flex items-end">
            <button onClick={handleProcess} className="btn-secondary w-full">
              <Sparkles className="h-5 w-5 mr-2" />
              Process Image
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-6 p-4 bg-primary-50 rounded-lg">
          <div className="flex items-start">
            <Palette className="h-5 w-5 text-primary-500 mr-3 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-primary-800 mb-1">
                Processing Information
              </h4>
              <p className="text-sm text-primary-700">
                {settings.smartMode
                  ? `Your image will be processed with ${settings.blockSize}×${settings.blockSize} pixel blocks and reduced to ${settings.maxColors} colors for a cohesive pixel art effect.`
                  : `Your image will be processed with ${settings.blockSize}×${settings.blockSize} pixel blocks, averaging colors within each block.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
