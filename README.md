# Pixelfy 👾 - Pixel Art Generator

A powerful tool that converts images to pixelated versions by averaging colors in customizable pixel blocks. Available as both a command-line tool and a modern web application.

## Features

- Converts any image format to a pixelfied version
- Uses 5x5 pixel blocks by default (configurable)
- Averages RGB colors within each block
- **Smart pixelation** - reduces color palette for more cohesive look
- **Preserves transparency** - transparent backgrounds stay transparent
- **Modern web interface** - drag-and-drop upload with real-time preview
- **Color palette extraction** - view and interact with generated colors
- Handles various image formats (JPEG, PNG, GIF, etc.)
- Command-line interface with options

## Installation

### Command Line Tool

1. Install the required dependencies:

```bash
pip install -r requirements.txt
```

### Web Application (React + Flask)

#### Quick Start

```bash
./start.sh
```

#### Manual Setup

1. **Install Node.js dependencies:**

   ```bash
   npm install
   ```

2. **Build React app:**

   ```bash
   npm run build
   ```

3. **Install Python dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Start the server:**

   ```bash
   python app.py
   ```

5. **Open your browser and go to `http://localhost:5001`**

#### Development Mode

For development with hot reloading:

```bash
npm start  # Runs React dev server on port 3000
# In another terminal:
python app.py  # Runs Flask API on port 5001
```

## Usage

### Web Application

The web app provides a modern, user-friendly interface:

1. **Drag & Drop**: Simply drag your image onto the upload area
2. **Adjust Settings**: Use sliders to customize block size and color reduction
3. **Real-time Preview**: See your original and processed images side by side
4. **Color Palette**: View and interact with the generated color palette
5. **Download**: Save your pixelated masterpiece with one click

### Command Line Tool

#### Basic Usage

```bash
python main.py input_image.jpg
```

This will create `input_image_pixelfied.png` in the same directory.

### Specify Output File

```bash
python main.py input_image.jpg -o output_image.png
```

### Custom Block Size

```bash
python main.py input_image.jpg -b 10
```

This will use 10x10 pixel blocks instead of the default 5x5.

### Smart Pixelation

```bash
python main.py input_image.jpg -s
```

This applies color clustering to reduce the number of distinct colors, creating a more cohesive pixelated effect.

### Custom Color Limit

```bash
python main.py input_image.jpg -s -c 16
```

Limit the output to 16 colors maximum.

### All Options

```bash
python main.py input_image.jpg -o output_image.png -b 8 -s -c 24
```

## Command Line Arguments

- `input_image`: Path to the input image file (required)
- `-o, --output`: Path for the output image (optional, default: input_pixelfied.png)
- `-b, --block-size`: Size of pixel blocks (optional, default: 5)
- `-s, --smart`: Use smart color reduction to minimize distinct colors
- `-c, --max-colors`: Maximum number of colors for smart mode (optional, default: 32)

## How It Works

1. The tool loads the input image and converts it to RGBA format to preserve transparency
2. It divides the image into blocks of the specified size (default 5x5 pixels)
3. For each block, it calculates the average color of all pixels in that block
4. For transparent areas, it properly handles alpha channel averaging
5. It replaces the entire block with the average color (including transparency)
6. **Smart mode**: If enabled, applies K-means clustering to reduce the color palette
7. The result is saved as a new PNG image with transparency support

## Example

Original image → Pixelfied image (5x5 blocks)

The tool will create a pixelated effect where each 5x5 pixel square is replaced with the average color of those pixels, creating a blocky, retro-style appearance.

## Requirements

### Command Line Tool

- Python 3.6+
- Pillow (PIL)
- NumPy
- scikit-learn (for smart pixelation)

### Web Application

- Python 3.6+
- Node.js 16+
- npm or yarn
- All Python dependencies from requirements.txt
- All Node.js dependencies from package.json

## Deployment

For deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Contributing

Feel free to submit issues and enhancement requests!
