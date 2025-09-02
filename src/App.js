import React, { useState } from "react";
import {
  Palette,
  Upload,
  Download,
  Settings,
  Image,
  Sparkles,
  Pipette,
} from "lucide-react";
import UploadArea from "./components/UploadArea";
import SettingsPanel from "./components/SettingsPanel";
import ResultsSection from "./components/ResultsSection";
import LoadingModal from "./components/LoadingModal";
import Message from "./components/Message";
import { useImageProcessor } from "./hooks/useImageProcessor";

function App() {
  const [currentFile, setCurrentFile] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [message, setMessage] = useState(null);

  const { processImage, results, loading, colorPalette, downloadImage } =
    useImageProcessor();

  const handleFileSelect = (file) => {
    console.log("::handleFileSelect");
    console.log("file", file);
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      setMessage({
        type: "error",
        text: "Please select a valid image file (JPEG, PNG, GIF, BMP, or WebP)",
      });
      return;
    }

    // Validate file size (16MB max)
    if (file.size > 16 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "File size must be less than 16MB",
      });
      return;
    }

    setCurrentFile(file);
    setShowSettings(true);
    setMessage({
      type: "success",
      text: `File "${file.name}" selected successfully!`,
    });
  };

  const handleProcess = async (settings) => {
    if (!currentFile) {
      setMessage({
        type: "error",
        text: "Please select an image first",
      });
      return;
    }

    try {
      await processImage(currentFile, settings);
      setMessage({
        type: "success",
        text: "Image processed successfully!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: `Error: ${error.message}`,
      });
    }
  };

  const handleDownload = () => {
    if (!results) {
      setMessage({
        type: "error",
        text: "No processed image available for download",
      });
      return;
    }

    downloadImage();
    setMessage({
      type: "success",
      text: "Download started!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-600">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Palette className="h-8 w-8 text-white" />
              <span className="text-xl font-bold text-white">Pixelfy 👾</span>
            </div>
            <div className="flex space-x-4">
              <a
                href="#about"
                className="text-white/80 hover:text-white transition-colors"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-white/80 hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">
            Transform Your Images Into{" "}
            <span className="text-gradient">Pixel Art</span>
          </h1>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            Upload any image and watch it transform into beautiful pixelated
            artwork with our advanced algorithms.
          </p>

          {/* Upload Area */}
          <UploadArea onFileSelect={handleFileSelect} />

          {/* Message Display */}
          {message && (
            <Message
              type={message.type}
              text={message.text}
              onClose={() => setMessage(null)}
            />
          )}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 animate-fade-in-up">
          <SettingsPanel onProcess={handleProcess} />
        </div>
      )}

      {/* Results Section */}
      {results && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 animate-fade-in-up">
          <ResultsSection
            results={results}
            colorPalette={colorPalette}
            onDownload={handleDownload}
          />
        </div>
      )}

      {/* About Section */}
      <section id="about" className="py-20 bg-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            About Pixelfy
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Image className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Block Processing
              </h3>
              <p className="text-white/80">
                Advanced algorithms that process images in customizable pixel
                blocks for perfect pixelation.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Smart Color Reduction
              </h3>
              <p className="text-white/80">
                AI-powered color clustering that creates cohesive pixel art with
                fewer distinct colors.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Pipette className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Transparency Support
              </h3>
              <p className="text-white/80">
                Full support for transparent backgrounds and alpha channels in
                your pixel art.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-md border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/60">
            © 2024 Pixelfy. Made with ❤️ for pixel art enthusiasts.
          </p>
        </div>
      </footer>

      {/* Loading Modal */}
      <LoadingModal isOpen={loading} />
    </div>
  );
}

export default App;
