const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const REGION = process.env.AWS_REGION || 'eu-north-1';
const BUCKET = process.env.S3_BUCKET || 'nkitsi-user-files';

// Create S3 client, credentials are discovered by the AWS SDK via env, shared creds file, or IAM role
const s3 = new S3Client({ region: REGION });

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    const file = req.file; // multer memoryStorage -> buffer available
    const key = `uploads/${Date.now()}_${file.originalname}`;

    const params = {
      Bucket: BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype || 'application/octet-stream',
    };

    try {
      await s3.send(new PutObjectCommand(params));
    } catch (s3err) {
      // If the SDK couldn't find credentials or access is denied, return a helpful message
      console.error('S3 error', s3err);
      if (s3err.name === 'CredentialsProviderError' || /Could not load credentials/.test(s3err.message)) {
        return res.status(500).json({ error: 'Upload failed', details: 'Could not load credentials from any providers. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY or configure a credentials provider.' });
      }
      return res.status(500).json({ error: 'Upload failed', details: s3err.message || String(s3err) });
    }

    // Public URL (may need different hostname depending on bucket settings)
    const url = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;

    return res.json({ key, url });
  } catch (err) {
    console.error('Upload error', err);
    return res.status(500).json({ error: 'Upload failed', details: err.message });
  }
};
