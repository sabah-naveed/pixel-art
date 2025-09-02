// Pixelfy Web App JavaScript

class PixelfyApp {
  constructor() {
    this.currentFile = null;
    this.currentUniqueId = null;
    this.selectedColor = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupDragAndDrop();
    this.updateSliderValues();
  }

  setupEventListeners() {
    // File input
    document.getElementById("fileInput").addEventListener("change", (e) => {
      this.handleFileSelect(e.target.files[0]);
    });

    // Settings controls
    document.getElementById("blockSize").addEventListener("input", (e) => {
      document.getElementById(
        "blockSizeValue"
      ).textContent = `${e.target.value}x${e.target.value}`;
    });

    document.getElementById("smartMode").addEventListener("change", (e) => {
      const maxColorsGroup = document.getElementById("maxColorsGroup");
      maxColorsGroup.style.display = e.target.checked ? "block" : "none";
    });

    document.getElementById("maxColors").addEventListener("input", (e) => {
      document.getElementById("maxColorsValue").textContent = e.target.value;
    });

    // Process button
    document.getElementById("processBtn").addEventListener("click", () => {
      this.processImage();
    });

    // Download button
    document.getElementById("downloadBtn").addEventListener("click", () => {
      this.downloadImage();
    });
  }

  setupDragAndDrop() {
    const uploadArea = document.getElementById("uploadArea");
    const fileInput = document.getElementById("fileInput");

    // Prevent default drag behaviors
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      uploadArea.addEventListener(eventName, preventDefaults, false);
      document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop area when item is dragged over it
    ["dragenter", "dragover"].forEach((eventName) => {
      uploadArea.addEventListener(eventName, highlight, false);
    });

    ["dragleave", "drop"].forEach((eventName) => {
      uploadArea.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    uploadArea.addEventListener("drop", (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      this.handleFileSelect(files[0]);
    });

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    function highlight(e) {
      uploadArea.classList.add("dragover");
    }

    function unhighlight(e) {
      uploadArea.classList.remove("dragover");
    }
  }

  handleFileSelect(file) {
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
      this.showMessage(
        "Please select a valid image file (JPEG, PNG, GIF, BMP, or WebP)",
        "error"
      );
      return;
    }

    // Validate file size (16MB max)
    if (file.size > 16 * 1024 * 1024) {
      this.showMessage("File size must be less than 16MB", "error");
      return;
    }

    this.currentFile = file;
    this.showSettingsPanel();
    this.showMessage(`File "${file.name}" selected successfully!`, "success");
  }

  showSettingsPanel() {
    document.getElementById("settingsPanel").style.display = "block";
    document.getElementById("settingsPanel").classList.add("fade-in-up");
  }

  async processImage() {
    if (!this.currentFile) {
      this.showMessage("Please select an image first", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", this.currentFile);
    formData.append("blockSize", document.getElementById("blockSize").value);
    formData.append("smartMode", document.getElementById("smartMode").checked);
    formData.append("maxColors", document.getElementById("maxColors").value);

    // Show loading modal
    const loadingModal = new bootstrap.Modal(
      document.getElementById("loadingModal")
    );
    loadingModal.show();

    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        this.currentUniqueId = result.unique_id;
        this.displayResults(result.original, result.processed);
        this.loadColorPalette();
        this.showMessage("Image processed successfully!", "success");
      } else {
        throw new Error(result.error || "Processing failed");
      }
    } catch (error) {
      this.showMessage(`Error: ${error.message}`, "error");
    } finally {
      loadingModal.hide();
    }
  }

  displayResults(originalB64, processedB64) {
    // Display images
    document.getElementById(
      "originalImage"
    ).src = `data:image/png;base64,${originalB64}`;
    document.getElementById(
      "processedImage"
    ).src = `data:image/png;base64,${processedB64}`;

    // Show results section
    const resultsSection = document.getElementById("resultsSection");
    resultsSection.style.display = "block";
    resultsSection.classList.add("fade-in-up");

    // Scroll to results
    resultsSection.scrollIntoView({ behavior: "smooth" });
  }

  async loadColorPalette() {
    if (!this.currentUniqueId) return;

    try {
      const response = await fetch(`/api/colors/${this.currentUniqueId}`);
      const result = await response.json();

      if (result.colors) {
        this.displayColorPalette(result.colors);
      }
    } catch (error) {
      console.error("Failed to load color palette:", error);
    }
  }

  displayColorPalette(colors) {
    const colorSwatches = document.getElementById("colorSwatches");
    const colorPalette = document.getElementById("colorPalette");

    colorSwatches.innerHTML = "";

    colors.forEach((color) => {
      const swatch = document.createElement("div");
      swatch.className = "color-swatch";
      swatch.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
      swatch.setAttribute(
        "data-color",
        `RGB(${color.r}, ${color.g}, ${color.b})`
      );

      swatch.addEventListener("click", () => {
        this.selectColor(color);
      });

      colorSwatches.appendChild(swatch);
    });

    colorPalette.style.display = "block";
    colorPalette.classList.add("fade-in-up");
  }

  selectColor(color) {
    // Remove previous selection
    document.querySelectorAll(".color-swatch").forEach((swatch) => {
      swatch.classList.remove("selected");
    });

    // Add selection to clicked swatch
    event.target.classList.add("selected");

    this.selectedColor = color;
    this.showMessage(
      `Color selected: RGB(${color.r}, ${color.g}, ${color.b})`,
      "success"
    );
  }

  downloadImage() {
    if (!this.currentUniqueId) {
      this.showMessage("No processed image available for download", "error");
      return;
    }

    // Create download link
    const link = document.createElement("a");
    link.href = `/download/${this.currentUniqueId}`;
    link.download = "pixelfied_image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showMessage("Download started!", "success");
  }

  updateSliderValues() {
    // Update block size display
    const blockSize = document.getElementById("blockSize").value;
    document.getElementById(
      "blockSizeValue"
    ).textContent = `${blockSize}x${blockSize}`;

    // Update max colors display
    const maxColors = document.getElementById("maxColors").value;
    document.getElementById("maxColorsValue").textContent = maxColors;
  }

  showMessage(message, type = "info") {
    // Remove existing messages
    const existingMessages = document.querySelectorAll(".message");
    existingMessages.forEach((msg) => msg.remove());

    // Create new message
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}-message fade-in-up`;
    messageDiv.textContent = message;

    // Add to page
    const heroSection = document.querySelector(".hero-section");
    heroSection.appendChild(messageDiv);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.remove();
      }
    }, 5001);
  }
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PixelfyApp();
});

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Add keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + O to open file dialog
  if ((e.ctrlKey || e.metaKey) && e.key === "o") {
    e.preventDefault();
    document.getElementById("fileInput").click();
  }

  // Ctrl/Cmd + Enter to process image
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    document.getElementById("processBtn").click();
  }

  // Ctrl/Cmd + S to download
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    document.getElementById("downloadBtn").click();
  }
});
