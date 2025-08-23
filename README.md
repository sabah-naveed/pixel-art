# Pixelfy Tool 👾

A Python tool that converts images to pixelated versions by averaging colors in 5x5 pixel blocks.

## Features

- Converts any image format to a pixelfied version
- Uses 5x5 pixel blocks by default (configurable)
- Averages RGB colors within each block
- **Smart pixelation** - reduces color palette for more cohesive look
- **Preserves transparency** - transparent backgrounds stay transparent
- Handles various image formats (JPEG, PNG, GIF, etc.)
- Command-line interface with options

## Installation

1. Install the required dependencies:

```bash
pip install -r requirements.txt
```

## Usage

### Basic Usage

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

- Python 3.6+
- Pillow (PIL)
- NumPy
- scikit-learn (for smart pixelation)
