const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const mime = require('mime-types');

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

const uploadFile = async (file) => {
    const key = `reports/${Date.now()}-${file.originalname}`;
    
    // Better MIME type detection
    let contentType = file.mimetype;
    console.log(`📤 Uploading ${file.originalname} | Size: ${file.size}B | Reported MIME: ${contentType}`);
    
    // Force correct MIME if missing/invalid
    if (!contentType || contentType === 'application/octet-stream') {
        contentType = mime.lookup(file.originalname) || 'application/octet-stream';
        console.log(`🔧 Forced MIME: ${contentType}`);
    }
    
    const putCommand = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: contentType,
        ContentLength: file.size,
        CacheControl: 'max-age=3600', // 1hr cache for images
        Metadata: {
            originalName: file.originalname,
            uploadedBy: 'medivault'
        }
    });

    try {
        const result = await s3Client.send(putCommand);
        console.log(`✅ S3 Upload Success: ${key} | ETag: ${result.ETag} | ContentType: ${contentType}`);
        
        const location = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        return { key, location, contentType };
    } catch (error) {
        console.error('❌ S3 upload error:', error);
        throw new Error('Failed to upload file to S3');
    }
};

const getPresignedUrl = async (key, expiresIn = 3600) => {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });

    try {
        const url = await getSignedUrl(s3Client, command, { expiresIn });
        return url;
    } catch (error) {
        console.error('❌ Presigned URL error:', error);
        throw new Error('Failed to generate presigned URL');
    }
};

module.exports = { 
    uploadFile, 
    getPresignedUrl,
    s3Client 
};
