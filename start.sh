#!/bin/bash

echo "🚀 Starting Pixelfy Web App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing React dependencies..."
npm install

echo "🔨 Building React app..."
npm run build

echo "🐍 Installing Python dependencies..."
pip install -r requirements.txt

echo "🌟 Starting Flask server..."
echo "🌐 Open your browser and go to: http://localhost:5001"
python app.py
