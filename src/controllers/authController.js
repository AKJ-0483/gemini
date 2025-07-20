const authService = require("../services/authService");

exports.sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;
    const otp = await authService.sendOtp(mobile);
    res.status(200).json({ message: "OTP sent", otp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    const token = await authService.verifyOtp(mobile, otp);
    res.status(200).json({ token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

exports.signup = async (req, res) => {
  try {
    const { mobile, name, password } = req.body;
    const user = await authService.signup({ mobile, name, password });
    res.status(201).json({
      message: "Signup successful",
      user: { id: user.id, mobile: user.mobile },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { mobile } = req.body;
    const otp = await authService.forgotPassword(mobile);
    res.status(200).json({ message: "OTP sent", otp }); // Mocked OTP
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newPassword } = req.body;
    await authService.changePassword(userId, newPassword);
    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
