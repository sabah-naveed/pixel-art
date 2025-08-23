#!/usr/bin/env python3
"""
Pixelfy Tool - Converts images to pixelated versions by averaging colors in 5x5 pixel blocks
"""

import argparse
import os
from PIL import Image
import numpy as np


def average_color(block):
    """
    Calculate the average color of a 5x5 pixel block
    
    Args:
        block: numpy array of shape (5, 5, 3) for RGB or (5, 5, 4) for RGBA
        
    Returns:
        tuple: average RGB or RGBA values
    """
    # Calculate mean across all pixels in the block
    avg_color = np.mean(block, axis=(0, 1))
    return tuple(map(int, avg_color))


def pixelfy_image(image_path, output_path=None, block_size=5):
    """
    Pixelfy an image by averaging colors in block_size x block_size pixel squares
    
    Args:
        image_path (str): Path to input image
        output_path (str): Path for output image (optional)
        block_size (int): Size of pixel blocks (default: 5)
        
    Returns:
        str: Path to the output image
    """
    # Open the image
    try:
        img = Image.open(image_path)
    except Exception as e:
        raise ValueError(f"Could not open image {image_path}: {e}")
    
    # Convert to RGB if necessary (handles RGBA, grayscale, etc.)
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    # Convert to numpy array for easier processing
    img_array = np.array(img)
    height, width, channels = img_array.shape
    
    # Create output array
    output_array = np.zeros_like(img_array)
    
    # Process image in blocks
    for y in range(0, height, block_size):
        for x in range(0, width, block_size):
            # Extract the current block
            y_end = min(y + block_size, height)
            x_end = min(x + block_size, width)
            block = img_array[y:y_end, x:x_end]
            
            # Calculate average color for this block
            avg_color = average_color(block)
            
            # Fill the entire block with the average color
            output_array[y:y_end, x:x_end] = avg_color
    
    # Convert back to PIL Image
    output_img = Image.fromarray(output_array.astype(np.uint8))
    
    # Generate output path if not provided
    if output_path is None:
        base_name = os.path.splitext(image_path)[0]
        output_path = f"{base_name}_pixelfied.png"
    
    # Save the result
    output_img.save(output_path)
    print(f"Pixelfied image saved to: {output_path}")
    
    return output_path


def main():
    """Main function to handle command line arguments and run the pixelfy tool"""
    parser = argparse.ArgumentParser(
        description="Pixelfy an image by averaging colors in 5x5 pixel blocks"
    )
    parser.add_argument(
        "input_image",
        help="Path to the input image file"
    )
    parser.add_argument(
        "-o", "--output",
        help="Path for the output image (default: input_pixelfied.png)"
    )
    parser.add_argument(
        "-b", "--block-size",
        type=int,
        default=5,
        help="Size of pixel blocks (default: 5)"
    )
    
    args = parser.parse_args()
    
    # Check if input file exists
    if not os.path.exists(args.input_image):
        print(f"Error: Input file '{args.input_image}' does not exist.")
        return 1
    
    try:
        output_path = pixelfy_image(
            args.input_image,
            args.output,
            args.block_size
        )
        print(f"Successfully pixelfied image with {args.block_size}x{args.block_size} blocks!")
        return 0
    except Exception as e:
        print(f"Error: {e}")
        return 1


if __name__ == "__main__":
    exit(main())
