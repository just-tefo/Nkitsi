const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");

const s3 = new S3Client({ region: "eu-north-1" }); // use your region

async function uploadFile() {
  const filePath = "../uploads/tefo.pdf";
  const fileStream = fs.createReadStream(filePath);

  const uploadParams = {
    Bucket: "nkitsi-user-files", // your bucket name
    Key: "../uploads/tefo.pdf",  // folder + filename
    Body: fileStream,
    ContentType: "application/pdf"
  };

  try {
    const result = await s3.send(new PutObjectCommand(uploadParams));
    console.log("✅ File uploaded successfully:", result);
  } catch (err) {
    console.error("❌ Upload failed:", err);
  }
}

uploadFile();