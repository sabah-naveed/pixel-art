import sharp from 'sharp';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { unique_id } = req.query;

  if (!unique_id) {
    return res.status(400).json({ error: 'Unique ID is required' });
  }

  try {
    // For serverless functions, we can't access previously processed files
    // Instead, we'll return a message directing users to extract colors from the processed image
    return res.status(200).json({
      message: 'Color extraction not available in serverless mode',
      suggestion: 'Extract colors from the processed image data returned from the upload endpoint',
      unique_id: unique_id
    });

  } catch (error) {
    console.error('Colors error:', error);
    return res.status(500).json({ error: `Failed to extract colors: ${error.message}` });
  }
}
