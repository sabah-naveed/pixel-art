import React, { useState } from "react";
import { Image, Download, Palette, Pipette } from "lucide-react";
import ColorPalette from "./ColorPalette";

const ResultsSection = ({ results, colorPalette, onDownload }) => {
  const [selectedColor, setSelectedColor] = useState(null);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  return (
    <div className="space-y-8">
      {/* Images Comparison */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Original Image */}
        <div className="card">
          <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-4 rounded-t-2xl">
            <div className="flex items-center">
              <Image className="h-5 w-5 mr-2" />
              <h3 className="font-semibold">Original Image</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="relative">
              <img
                src={`data:image/png;base64,${results.original}`}
                alt="Original"
                className="w-full h-auto rounded-lg shadow-lg"
                style={{ imageOrientation: "from-image" }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-3 text-center">
              {results.filename}
            </p>
          </div>
        </div>

        {/* Processed Image */}
        <div className="card">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                <h3 className="font-semibold">Pixelfied Image</h3>
              </div>
              <button
                onClick={onDownload}
                className="bg-white/20 hover:bg-white/30 transition-colors p-2 rounded-lg"
                title="Download"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="relative">
              <img
                src={`data:image/png;base64,${results.processed}`}
                alt="Pixelfied"
                className="w-full h-auto rounded-lg shadow-lg"
                style={{ imageOrientation: "from-image" }}
              />
            </div>
            <div className="mt-4 flex justify-center">
              <button onClick={onDownload} className="btn-primary">
                <Download className="h-4 w-4 mr-2" />
                Download Image
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Color Palette */}
      {colorPalette.length > 0 && (
        <div className="card">
          <div className="bg-gradient-to-r from-success-500 to-success-400 text-white p-4 rounded-t-2xl">
            <div className="flex items-center">
              <Pipette className="h-5 w-5 mr-2" />
              <h3 className="font-semibold">Color Palette</h3>
              <span className="ml-auto text-sm bg-white/20 px-2 py-1 rounded-full">
                {colorPalette.length} colors
              </span>
            </div>
          </div>
          <div className="p-6">
            <ColorPalette
              colors={colorPalette}
              onColorSelect={handleColorSelect}
              selectedColor={selectedColor}
            />

            {selectedColor && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Selected Color
                </h4>
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded-lg border-2 border-gray-300"
                    style={{
                      backgroundColor: `rgb(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b})`,
                    }}
                  />
                  <div>
                    <p className="text-sm font-mono text-gray-800">
                      RGB({selectedColor.r}, {selectedColor.g},{" "}
                      {selectedColor.b})
                    </p>
                    <p className="text-sm font-mono text-gray-600">
                      #{selectedColor.r.toString(16).padStart(2, "0")}
                      {selectedColor.g.toString(16).padStart(2, "0")}
                      {selectedColor.b.toString(16).padStart(2, "0")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsSection;
