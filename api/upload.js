import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import formidable from "formidable";
import fs from "fs";
import path from "path";

// Configure Sharp for better performance
sharp.cache(false);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse the form data
    const form = formidable({
      maxFileSize: 16 * 1024 * 1024, // 16MB
      filter: ({ mimetype }) => {
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/bmp",
          "image/webp",
        ];
        return allowedTypes.includes(mimetype);
      },
    });

    const [fields, files] = await form.parse(req);

    if (!files.file || files.file.length === 0) {
      return res.status(400).json({ error: "No file provided" });
    }

    const file = files.file[0];
    const blockSize = parseInt(fields.blockSize?.[0] || "5");
    const smartMode = fields.smartMode?.[0] === "true";
    const maxColors = parseInt(fields.maxColors?.[0] || "32");

    // Generate unique ID
    const uniqueId = uuidv4();

    // Read the image
    const imageBuffer = fs.readFileSync(file.filepath);
    const image = sharp(imageBuffer);

    // Get image metadata
    const metadata = await image.metadata();

    // Process the image
    const processedBuffer = await pixelfyImage(
      imageBuffer,
      blockSize,
      smartMode,
      maxColors
    );

    // Convert both images to base64
    const originalBase64 = `data:${
      metadata.format
    };base64,${imageBuffer.toString("base64")}`;
    const processedBase64 = `data:image/png;base64,${processedBuffer.toString(
      "base64"
    )}`;

    // Clean up temporary file
    fs.unlinkSync(file.filepath);

    return res.status(200).json({
      success: true,
      original: originalBase64,
      processed: processedBase64,
      filename: file.originalFilename,
      unique_id: uniqueId,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res
      .status(500)
      .json({ error: `Processing failed: ${error.message}` });
  }
}

async function pixelfyImage(imageBuffer, blockSize, smartMode, maxColors) {
  const image = sharp(imageBuffer);
  const metadata = await image.metadata();

  // Ensure we have RGBA format
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const pixels = new Uint8ClampedArray(data);

  // Create output array
  const outputPixels = new Uint8ClampedArray(width * height * channels);

  // Process in blocks
  for (let y = 0; y < height; y += blockSize) {
    for (let x = 0; x < width; x += blockSize) {
      const blockWidth = Math.min(blockSize, width - x);
      const blockHeight = Math.min(blockSize, height - y);

      // Extract block
      const block = extractBlock(
        pixels,
        width,
        height,
        channels,
        x,
        y,
        blockWidth,
        blockHeight
      );

      // Calculate average color
      const avgColor = calculateAverageColor(block, channels);

      // Fill block with average color
      fillBlock(
        outputPixels,
        width,
        height,
        channels,
        x,
        y,
        blockWidth,
        blockHeight,
        avgColor
      );
    }
  }

  // Apply smart color reduction if enabled
  let finalPixels = outputPixels;
  if (smartMode) {
    finalPixels = await smartColorReduction(
      outputPixels,
      width,
      height,
      channels,
      maxColors
    );
  }

  // Convert back to image buffer
  const outputBuffer = await sharp(finalPixels, {
    raw: {
      width,
      height,
      channels,
    },
  })
    .png()
    .toBuffer();

  return outputBuffer;
}

function extractBlock(
  pixels,
  width,
  height,
  channels,
  x,
  y,
  blockWidth,
  blockHeight
) {
  const block = [];

  for (let by = 0; by < blockHeight; by++) {
    for (let bx = 0; bx < blockWidth; bx++) {
      const pixelX = x + bx;
      const pixelY = y + by;

      if (pixelX < width && pixelY < height) {
        const pixelIndex = (pixelY * width + pixelX) * channels;
        const pixel = [];

        for (let c = 0; c < channels; c++) {
          pixel.push(pixels[pixelIndex + c]);
        }

        block.push(pixel);
      }
    }
  }

  return block;
}

function calculateAverageColor(block, channels) {
  if (block.length === 0) return new Array(channels).fill(0);

  const sums = new Array(channels).fill(0);

  for (const pixel of block) {
    for (let c = 0; c < channels; c++) {
      sums[c] += pixel[c];
    }
  }

  return sums.map((sum) => Math.round(sum / block.length));
}

function fillBlock(
  outputPixels,
  width,
  height,
  channels,
  x,
  y,
  blockWidth,
  blockHeight,
  color
) {
  for (let by = 0; by < blockHeight; by++) {
    for (let bx = 0; bx < blockWidth; bx++) {
      const pixelX = x + bx;
      const pixelY = y + by;

      if (pixelX < width && pixelY < height) {
        const pixelIndex = (pixelY * width + pixelX) * channels;

        for (let c = 0; c < channels; c++) {
          outputPixels[pixelIndex + c] = color[c];
        }
      }
    }
  }
}

async function smartColorReduction(pixels, width, height, channels, maxColors) {
  // Extract all unique colors
  const colorMap = new Map();

  for (let i = 0; i < pixels.length; i += channels) {
    const color = Array.from(pixels.slice(i, i + channels));
    const colorKey = color.join(",");

    if (!colorMap.has(colorKey)) {
      colorMap.set(colorKey, color);
    }
  }

  const colors = Array.from(colorMap.values());

  if (colors.length <= maxColors) {
    return pixels; // No reduction needed
  }

  // Simple color clustering (k-means approximation)
  const clusters = await clusterColors(colors, maxColors);

  // Create color mapping
  const colorMapping = new Map();
  for (const color of colors) {
    const closestCluster = findClosestCluster(color, clusters);
    colorMapping.set(color.join(","), closestCluster);
  }

  // Apply color mapping
  const outputPixels = new Uint8ClampedArray(pixels.length);

  for (let i = 0; i < pixels.length; i += channels) {
    const color = Array.from(pixels.slice(i, i + channels));
    const colorKey = color.join(",");
    const newColor = colorMapping.get(colorKey);

    for (let c = 0; c < channels; c++) {
      outputPixels[i + c] = newColor[c];
    }
  }

  return outputPixels;
}

async function clusterColors(colors, k) {
  // Simple k-means clustering
  const clusters = [];
  const assignments = new Array(colors.length).fill(0);

  // Initialize clusters randomly
  for (let i = 0; i < k; i++) {
    const randomIndex = Math.floor(Math.random() * colors.length);
    clusters.push([...colors[randomIndex]]);
  }

  // Iterate until convergence
  let changed = true;
  let iterations = 0;
  const maxIterations = 10;

  while (changed && iterations < maxIterations) {
    changed = false;

    // Assign colors to closest cluster
    for (let i = 0; i < colors.length; i++) {
      const color = colors[i];
      let closestCluster = 0;
      let minDistance = Infinity;

      for (let j = 0; j < clusters.length; j++) {
        const distance = calculateColorDistance(color, clusters[j]);
        if (distance < minDistance) {
          minDistance = distance;
          closestCluster = j;
        }
      }

      if (assignments[i] !== closestCluster) {
        assignments[i] = closestCluster;
        changed = true;
      }
    }

    // Update cluster centers
    for (let j = 0; j < clusters.length; j++) {
      const clusterColors = colors.filter((_, i) => assignments[i] === j);

      if (clusterColors.length > 0) {
        const newCenter = new Array(clusterColors[0].length).fill(0);

        for (const color of clusterColors) {
          for (let c = 0; c < color.length; c++) {
            newCenter[c] += color[c];
          }
        }

        for (let c = 0; c < newCenter.length; c++) {
          newCenter[c] = Math.round(newCenter[c] / clusterColors.length);
        }

        clusters[j] = newCenter;
      }
    }

    iterations++;
  }

  return clusters;
}

function findClosestCluster(color, clusters) {
  let closestCluster = clusters[0];
  let minDistance = Infinity;

  for (const cluster of clusters) {
    const distance = calculateColorDistance(color, cluster);
    if (distance < minDistance) {
      minDistance = distance;
      closestCluster = cluster;
    }
  }

  return closestCluster;
}

function calculateColorDistance(color1, color2) {
  let distance = 0;
  for (let i = 0; i < Math.min(color1.length, color2.length); i++) {
    distance += Math.pow(color1[i] - color2[i], 2);
  }
  return Math.sqrt(distance);
}
