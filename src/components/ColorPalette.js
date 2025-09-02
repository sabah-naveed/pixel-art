import React from "react";

const ColorPalette = ({ colors, onColorSelect, selectedColor }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {colors.map((color, index) => {
          const isSelected =
            selectedColor &&
            selectedColor.r === color.r &&
            selectedColor.g === color.g &&
            selectedColor.b === color.b;

          return (
            <button
              key={index}
              onClick={() => onColorSelect(color)}
              className={`color-swatch ${isSelected ? "selected" : ""}`}
              style={{
                backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
              }}
              title={`RGB(${color.r}, ${color.g}, ${color.b})`}
            >
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full shadow-sm" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {colors.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No colors found in the processed image.</p>
        </div>
      )}
    </div>
  );
};

export default ColorPalette;
