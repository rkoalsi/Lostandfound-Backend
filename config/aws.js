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
  let key = fileName;
  // if (!fileName){
  //     key =
  // }
  const params = {
    ACL: 'public-read',
    Bucket: bucket,
    Key: key,
    Expires: expiry
  };
  const urls = {
    writeUrl: s3.getSignedUrl('putObject', params),
    readUrl: getReadUrl(key)
  };
  return urls;
};

const uploadBuffer = async (buffer, options) => {
  const { name = ``, type } = options;
  const params = {
    ACL: 'public-read',
    Bucket: bucket,
    Key: name,
    ContentType: type,
    Body: buffer
  };
  return new Promise((resolve, reject) => {
    s3.putObject(params, err => {
      if (err) reject(err);
      else resolve(getReadUrl(name));
    });
  });
};

module.exports = { getReadUrl, getSignedUrl, uploadBuffer };
