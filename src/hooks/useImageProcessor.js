import { useState, useCallback } from "react";
import axios from "axios";

export const useImageProcessor = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [colorPalette, setColorPalette] = useState([]);
  const [currentUniqueId, setCurrentUniqueId] = useState(null);

  const processImage = useCallback(async (file, settings) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("blockSize", settings.blockSize);
      formData.append("smartMode", settings.smartMode);
      formData.append("maxColors", settings.maxColors);

      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setResults({
          original: response.data.original,
          processed: response.data.processed,
          filename: response.data.filename,
        });
        setCurrentUniqueId(response.data.unique_id);

        // Extract colors from the processed image data
        await extractColorsFromImage(response.data.processed);
      } else {
        throw new Error(response.data.error || "Processing failed");
      }
    } catch (error) {
      console.error("Processing error:", error);
      throw new Error(
        error.response?.data?.error || error.message || "Processing failed"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const extractColorsFromImage = useCallback(async (imageDataUrl) => {
    try {
      // Create a canvas to extract colors from the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      return new Promise((resolve) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;
          const colorMap = new Map();
          
          // Extract unique colors
          for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];
            
            // Skip transparent pixels
            if (a > 0) {
              const colorKey = `${r},${g},${b}`;
              if (!colorMap.has(colorKey)) {
                colorMap.set(colorKey, { r, g, b });
              }
            }
          }
          
          const colors = Array.from(colorMap.values());
          setColorPalette(colors);
          resolve(colors);
        };
        
        img.src = imageDataUrl;
      });
    } catch (error) {
      console.error("Failed to extract colors:", error);
      setColorPalette([]);
    }
  }, []);

  const downloadImage = useCallback(async () => {
    if (!results?.processed) return;

    try {
      // Convert base64 data URL to blob
      const response = await fetch(results.processed);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `pixelfied_${results.filename || 'image'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      throw error;
    }
  }, [results]);

  const reset = useCallback(() => {
    setResults(null);
    setColorPalette([]);
    setCurrentUniqueId(null);
  }, []);

  return {
    processImage,
    downloadImage,
    reset,
    loading,
    results,
    colorPalette,
  };
};
