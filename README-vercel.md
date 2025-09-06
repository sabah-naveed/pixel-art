# Pixelfy - Vercel Serverless Version

This is the serverless version of Pixelfy, converted from Flask to JavaScript serverless functions for deployment on Vercel. (deploy)

## Features

- **Serverless Architecture**: Runs on Vercel's serverless functions
- **Image Processing**: Converts images to pixelated versions using JavaScript
- **Smart Color Reduction**: AI-powered color clustering for cohesive pixel art
- **Transparency Support**: Full support for transparent backgrounds
- **Real-time Processing**: Client-side color extraction and download

## Tech Stack

### Frontend

- React 18
- Tailwind CSS
- Lucide React (icons)
- Axios (HTTP requests)

### Backend (Serverless)

- Vercel Functions
- Sharp (image processing)
- Formidable (file upload handling)
- Custom JavaScript image processing algorithms

## Key Changes from Flask Version

1. **No File Storage**: Images are processed in memory and returned as base64
2. **Client-side Color Extraction**: Colors are extracted in the browser using Canvas API
3. **Direct Download**: Downloads work directly from the processed image data
4. **Serverless Functions**: Each API endpoint is a separate serverless function

## API Endpoints

- `POST /api/upload` - Process uploaded images
- `GET /api/download` - Download processed images (returns instructions)
- `GET /api/colors` - Extract color palette (returns instructions)
- `GET /api/health` - Health check

## Deployment

### Prerequisites

- Node.js 18+
- Vercel CLI (`npm i -g vercel`)

### Deploy to Vercel

1. **Install dependencies:**

   ```bash
   npm install
   ```
2. **Build the React app:**

   ```bash
   npm run build
   ```
3. **Deploy to Vercel:**

   ```bash
   vercel
   ```
4. **Follow the prompts** to link your project and deploy

### Local Development

1. **Install dependencies:**

   ```bash
   npm install
   ```
2. **Start development server:**

   ```bash
   npm run dev
   ```
3. **Or use Vercel CLI for local development:**

   ```bash
   vercel dev
   ```

## Configuration

The `vercel.json` file configures:

- Build settings for React app
- API routes
- Function timeouts
- Environment variables

## Limitations

- **File Size**: Limited by Vercel's function memory (512MB)
- **Processing Time**: Limited to 30 seconds per function
- **No Persistent Storage**: Images are not stored between requests
- **Cold Starts**: First request may be slower due to serverless cold starts

## Performance Optimizations

- Sharp library for efficient image processing
- Client-side color extraction to reduce server load
- Optimized image processing algorithms
- Efficient memory usage in serverless functions

## Migration Notes

If migrating from the Flask version:

1. Update API endpoints from `/upload` to `/api/upload`
2. Remove file storage dependencies
3. Update download logic to use processed image data
4. Implement client-side color extraction
5. Update build and deployment process

## Troubleshooting

### Common Issues

1. **Function Timeout**: Increase timeout in `vercel.json`
2. **Memory Issues**: Optimize image processing or reduce image size
3. **Cold Starts**: Consider using Vercel Pro for better performance
4. **Build Failures**: Check Node.js version compatibility

### Debug Mode

Enable debug logging by setting environment variables in Vercel dashboard:

- `DEBUG=true`
- `NODE_ENV=development`
