# Pixelfy Tool

A Python tool that converts images to pixelated versions by averaging colors in 5x5 pixel blocks.

## Features

- Converts any image format to a pixelfied version
- Uses 5x5 pixel blocks by default (configurable)
- Averages RGB colors within each block
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

### All Options

```bash
python main.py input_image.jpg -o output_image.png -b 8
```

## Command Line Arguments

- `input_image`: Path to the input image file (required)
- `-o, --output`: Path for the output image (optional, default: input_pixelfied.png)
- `-b, --block-size`: Size of pixel blocks (optional, default: 5)

## How It Works

1. The tool loads the input image and converts it to RGB format
2. It divides the image into blocks of the specified size (default 5x5 pixels)
3. For each block, it calculates the average RGB color of all pixels in that block
4. It replaces the entire block with the average color
5. The result is saved as a new image

## Example

Original image → Pixelfied image (5x5 blocks)

The tool will create a pixelated effect where each 5x5 pixel square is replaced with the average color of those pixels, creating a blocky, retro-style appearance.

## Requirements

- Python 3.6+
- Pillow (PIL)
- NumPy
