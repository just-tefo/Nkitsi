const mockCognito = require("../services/mockCognitoService");

exports.signup = (req, res) => {
  const { email, password, phoneNumber } = req.body;
  console.log("Signup hit:", { email, password, phoneNumber });
  res.status(201).json({
    message: "User signed up successfully!",
    user: { email, phoneNumber },
  });
};

exports.confirmSignUp = async (req, res) => {
  try {
    const result = await mockCognito.confirmSignUp(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  console.log("Login hit:", { email, password });
  res.status(200).json({
    message: "User logged in successfully!",
    token: "mock-jwt-token",
  });
};
