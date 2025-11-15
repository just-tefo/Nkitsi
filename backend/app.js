const express = require("express");
const cors = require("cors");
require('dotenv').config(); // load .env if present

const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helpful startup logs for credential troubleshooting
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
	console.warn('Warning: AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY not set in environment.');
	console.warn('The S3 upload endpoint will fail unless credentials are provided via environment, shared credentials file, or IAM role.');
}

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));