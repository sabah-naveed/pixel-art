#!/usr/bin/env python3
"""
Pixelfy Web App - Flask backend for the pixelfy tool
"""

import os
import uuid
from flask import Flask, render_template, request, jsonify, send_file, url_for, send_from_directory
from werkzeug.utils import secure_filename
from PIL import Image
import numpy as np
from sklearn.cluster import KMeans
import io
import base64

# Import the pixelfy functions from main.py
from main import pixelfy_image, smart_color_reduction, average_color

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def encode_image_to_base64(image_path):
    """Convert image to base64 for frontend display"""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

@app.route('/')
def index():
    return send_from_directory('build', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('build', path)

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'upload_folder': app.config['UPLOAD_FOLDER'],
        'upload_folder_exists': os.path.exists(app.config['UPLOAD_FOLDER'])
    })

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        # Generate unique filename
        filename = secure_filename(file.filename)
        unique_id = str(uuid.uuid4())
        base_name = os.path.splitext(filename)[0]
        extension = os.path.splitext(filename)[1]
        
        # Save original file
        original_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{unique_id}_original{extension}")
        file.save(original_path)
        
        # Get processing parameters
        block_size = int(request.form.get('blockSize', 5))
        smart_mode = request.form.get('smartMode', 'false').lower() == 'true'
        max_colors = int(request.form.get('maxColors', 32))
        
        try:
            # Process the image
            output_filename = f"{unique_id}_pixelfied.png"
            output_path = os.path.join(app.config['UPLOAD_FOLDER'], output_filename)
            
            # Use the pixelfy function from main.py
            pixelfy_image(original_path, output_path, block_size, smart_mode, max_colors)
            
            # Convert both images to base64 for frontend
            original_b64 = encode_image_to_base64(original_path)
            processed_b64 = encode_image_to_base64(output_path)
            
            return jsonify({
                'success': True,
                'original': original_b64,
                'processed': processed_b64,
                'filename': filename,
                'unique_id': unique_id
            })
            
        except Exception as e:
            return jsonify({'error': f'Processing failed: {str(e)}'}), 500
    
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/download/<unique_id>')
def download_file(unique_id):
    """Download the processed image"""
    try:
        output_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{unique_id}_pixelfied.png")
        
        if not os.path.exists(output_path):
            return jsonify({'error': 'File not found'}), 404
        
        # Generate a better filename based on the original
        try:
            # Try to get the original filename from the upload folder
            for filename in os.listdir(app.config['UPLOAD_FOLDER']):
                if filename.startswith(unique_id) and filename.endswith('_original'):
                    original_name = filename.replace(f"{unique_id}_original", "")
                    download_name = f"pixelfied{original_name}.png"
                    break
            else:
                download_name = 'pixelfied_image.png'
        except:
            download_name = 'pixelfied_image.png'
        
        return send_file(
            output_path, 
            as_attachment=True, 
            download_name=download_name,
            mimetype='image/png'
        )
    except Exception as e:
        return jsonify({'error': f'Download failed: {str(e)}'}), 500

@app.route('/api/colors/<unique_id>')
def get_colors(unique_id):
    """Get the color palette from the processed image"""
    output_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{unique_id}_pixelfied.png")
    
    if not os.path.exists(output_path):
        return jsonify({'error': 'File not found'}), 404
    
    try:
        # Load the processed image
        img = Image.open(output_path)
        img_array = np.array(img)
        
        # Get unique colors
        if img_array.shape[2] == 4:  # RGBA
            # Remove transparent pixels
            non_transparent = img_array[:, :, 3] > 0
            if np.any(non_transparent):
                colors = img_array[non_transparent][:, :3]
            else:
                colors = np.array([])
        else:  # RGB
            colors = img_array.reshape(-1, 3)
        
        # Get unique colors
        if len(colors) > 0:
            unique_colors = np.unique(colors, axis=0)
            color_list = [{'r': int(c[0]), 'g': int(c[1]), 'b': int(c[2])} for c in unique_colors]
        else:
            color_list = []
        
        return jsonify({'colors': color_list})
        
    except Exception as e:
        return jsonify({'error': f'Failed to extract colors: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
