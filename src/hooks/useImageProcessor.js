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

      const response = await axios.post("/upload", formData, {
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

        // Load color palette
        await loadColorPalette(response.data.unique_id);
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

  const loadColorPalette = useCallback(async (uniqueId) => {
    try {
      const response = await axios.get(`/api/colors/${uniqueId}`);
      if (response.data.colors) {
        setColorPalette(response.data.colors);
      }
    } catch (error) {
      console.error("Failed to load color palette:", error);
    }
  }, []);

  const downloadImage = useCallback(async () => {
    if (!currentUniqueId) return;

    try {
      const response = await fetch(`/download/${currentUniqueId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "pixelfied_image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      throw error;
    }
  }, [currentUniqueId]);

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
