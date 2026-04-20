const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

const getPresignedViewerUrl = async (key, fileType = 'auto', expiresIn = 3600) => {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ResponseContentType: fileType === 'auto' ? undefined : fileType, // Force browser display
        ResponseContentDisposition: 'inline' // Display inline, not download
    });

    try {
        const url = await getSignedUrl(s3Client, command, { expiresIn });
        console.log(`🔗 Viewer URL generated for ${key}: ${fileType || 'auto'} disposition: inline`);
        return url;
    } catch (error) {
        console.error('Presigned viewer URL error:', error);
        throw new Error('Failed to generate viewer URL');
    }
};

module.exports = getPresignedViewerUrl;

