import cloudinary from '../utils/cloudinary.js';

// Resume Upload Controller
export const uploadResume = async (req, res) => {
  try {
    // 1. Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume file',
      });
    }

    // 2. Upload to Cloudinary (using upload_stream for Buffer)
    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'raw', // PDFs/DOCs etc
            folder: 'resumes',
            public_id: `${Date.now()}_${req.file.originalname.split('.')[0]}`, // unique filename
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

    const result = await streamUpload();

    // 3. Send response with uploaded file URL
    return res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      resumeUrl: result.secure_url,
      publicId: result.public_id, // keep for delete later
    });
  } catch (error) {
    console.error('❌ Resume upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while uploading resume',
      error: error.message,
    });
  }
};
