const { AppDataSource } = require("../data-source");
const generateOTP = require("../utils/generateOTP");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcrypt");
const { hashPassword, comparePassword } = require("../utils/hashPassword");

const userRepo = AppDataSource.getRepository("User");

exports.sendOtp = async (mobile) => {
  const otp = generateOTP();
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

  let user = await userRepo.findOneBy({ mobile });

  if (!user) {
    user = userRepo.create({ mobile, otp, otpExpiresAt: expiry });
  } else {
    user.otp = otp;
    user.otpExpiresAt = expiry;
  }

  await userRepo.save(user);
  return otp;
};

exports.verifyOtp = async (mobile, otp) => {
  const user = await userRepo.findOneBy({ mobile });

  if (!user || user.otp !== otp || new Date() > user.otpExpiresAt) {
    throw new Error("Invalid or expired OTP");
  }

  user.otp = null;
  user.otpExpiresAt = null;
  await userRepo.save(user);

  return generateToken({ id: user.id, mobile: user.mobile });
};

exports.signup = async ({ mobile, name, password }) => {
  const existing = await userRepo.findOneBy({ mobile });
  if (existing) throw new Error("User already exists");

  const hashed = await hashPassword(password);
  const user = userRepo.create({ mobile, name, password: hashed });
  await userRepo.save(user);
  return user;
};

exports.forgotPassword = async (mobile) => {
  const user = await userRepo.findOneBy({ mobile });
  if (!user) throw new Error("User not found");

  const otp = generateOTP();
  const expiry = new Date(Date.now() + 5 * 60 * 1000);

  user.otp = otp;
  user.otpExpiresAt = expiry;
  await userRepo.save(user);

  return otp;
};

// Change Password
exports.changePassword = async (userId, newPassword) => {
  const user = await userRepo.findOneBy({ id: userId });
  if (!user) throw new Error("User not found");

  user.password = await hashPassword(newPassword);
  await userRepo.save(user);

  return true;
};
