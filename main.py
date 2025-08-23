# python3 -m venv path/to/venv
# source path/to/venv/bin/activate
# python3 -m pip install xyz
"""
Pixelfy Tool - Converts images to pixelated versions by averaging colors in 5x5 pixel blocks
"""

import argparse
import os
from PIL import Image
import numpy as np
from sklearn.cluster import KMeans
from collections import defaultdict


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
    
    # For RGBA images, handle transparency properly
    if block.shape[2] == 4:
        # If all pixels in the block are fully transparent, keep it transparent
        if np.all(block[:, :, 3] == 0):
            return (0, 0, 0, 0)
        
        # For partially transparent blocks, calculate weighted average
        # Only consider non-transparent pixels for color averaging
        non_transparent = block[:, :, 3] > 0
        if np.any(non_transparent):
            # Average color of non-transparent pixels
            color_avg = np.mean(block[non_transparent, :3], axis=0)
            # Average alpha of all pixels in the block
            alpha_avg = np.mean(block[:, :, 3])
            return tuple(map(int, [*color_avg, alpha_avg]))
        else:
            return (0, 0, 0, 0)
    
    return tuple(map(int, avg_color))


def smart_color_reduction(img_array, max_colors=32):
    """
    Reduce the number of colors in an image using K-means clustering
    
    Args:
        img_array: numpy array of the image
        max_colors: maximum number of colors to use
        
    Returns:
        numpy array: image with reduced color palette
    """
    # Reshape the image to 2D array of pixels
    height, width, channels = img_array.shape
    pixels = img_array.reshape(-1, channels)
    
    # Remove fully transparent pixels from clustering
    if channels == 4:
        non_transparent = pixels[:, 3] > 0
        if np.sum(non_transparent) == 0:
            return img_array  # All pixels are transparent
        
        # Only cluster non-transparent pixels
        visible_pixels = pixels[non_transparent]
        
        # Perform K-means clustering on RGB values only
        kmeans = KMeans(n_clusters=min(max_colors, len(visible_pixels)), random_state=42, n_init=10)
        kmeans.fit(visible_pixels[:, :3])
        
        # Get cluster centers (the new colors)
        cluster_centers = kmeans.cluster_centers_.astype(int)
        
        # Assign new colors to pixels
        new_pixels = pixels.copy()
        new_pixels[non_transparent, :3] = cluster_centers[kmeans.labels_]
        
        return new_pixels.reshape(height, width, channels)
    else:
        # For RGB images, cluster all pixels
        kmeans = KMeans(n_clusters=min(max_colors, len(pixels)), random_state=42, n_init=10)
        kmeans.fit(pixels)
        
        # Get cluster centers and reshape back
        cluster_centers = kmeans.cluster_centers_.astype(int)
        new_pixels = cluster_centers[kmeans.labels_]
        
        return new_pixels.reshape(height, width, channels)


def pixelfy_image(image_path, output_path=None, block_size=5, smart=False, max_colors=32):
    """
    Pixelfy an image by averaging colors in block_size x block_size pixel squares
    
    Args:
        image_path (str): Path to input image
        output_path (str): Path for output image (optional)
        block_size (int): Size of pixel blocks (default: 5)
        smart (bool): Use smart color reduction (default: False)
        max_colors (int): Maximum number of colors for smart mode (default: 32)
        
    Returns:
        str: Path to the output image
    """
    # Open the image
    try:
        img = Image.open(image_path)
    except Exception as e:
        raise ValueError(f"Could not open image {image_path}: {e}")
    
    # Convert to RGBA if necessary (preserves transparency)
    if img.mode not in ['RGB', 'RGBA']:
        img = img.convert('RGBA')
    elif img.mode == 'RGB':
        # Convert RGB to RGBA to handle transparency consistently
        img = img.convert('RGBA')
    
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
    
    # Apply smart color reduction if requested
    if smart:
        print(f"Applying smart color reduction (max {max_colors} colors)...")
        output_array = smart_color_reduction(output_array, max_colors)
    
    # Convert back to PIL Image
    output_img = Image.fromarray(output_array.astype(np.uint8), 'RGBA')
    
    # Generate output path if not provided
    if output_path is None:
        base_name = os.path.splitext(image_path)[0]
        output_path = f"{base_name}_pixelfied.png"
    
    # Save the result with transparency support
    output_img.save(output_path, 'PNG')
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
    parser.add_argument(
        "-s", "--smart",
        action="store_true",
        help="Use smart color reduction to minimize distinct colors"
    )
    parser.add_argument(
        "-c", "--max-colors",
        type=int,
        default=32,
        help="Maximum number of colors for smart mode (default: 32)"
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
            args.block_size,
            args.smart,
            args.max_colors
        )
        print(f"Successfully pixelfied image with {args.block_size}x{args.block_size} blocks!")
        return 0
    except Exception as e:
        print(f"Error: {e}")
        return 1


if __name__ == "__main__":
    exit(main())
