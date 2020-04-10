const AWS = require('aws-sdk');
const accessKeyID = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucket = process.env.AWS_S3_BUCKET;
const expiry = parseInt(process.env.AWS_SIGNED_URL_EXPIRY, 10);
const region = process.env.AWS_S3_REGION;

const s3 = new AWS.S3({
    accessKeyID,
    secretAccessKey,
    region
});

const getReadUrl = key => `https://s3.${region}.amazonaws.com/${bucket}/${key}`;

const getSignedUrl = fileName => {
    const params = {
        ACL: 'public-read',
        Bucket: bucket,
        Key: fileName,
        Expires: expiry,
        Body: buffer
    };
    const urls = {
        writeUrl: s3.getSignedUrl('putObject', params),
        readUrl: getReadUrl(key)
    };
    return urls;
};

const uploadBuffer = async (buffer, options = {}) => {
    const {
        name,
    } = options;
    console.log(bucket, options)
    const params = {
        ACL: 'public-read',
        Bucket: bucket,
        Key: name,
        Body: buffer
    };
    return new Promise((resolve, reject) => {
        s3.putObject(params, function (err, data) {
            if (err) reject(err)
            else {
                resolve(console.log(data));
            };
        });
    });
}
module.exports = {
    getReadUrl,
    getSignedUrl,
    uploadBuffer
};