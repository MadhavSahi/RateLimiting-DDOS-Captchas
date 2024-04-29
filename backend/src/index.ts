import express from "express";

const app = express();
const PORT = 3000;
app.use(express.json());
const otpStore: Record<string, string> = {};
app.post("/generate-otp", (req, res) => {
  const email = req.body.email;
  if (!email) {
    return res.status(400).json({
      msg: "Invalid Email.",
    });
  }
  const otp = Math.floor(10000 + Math.random() * 90000).toString();
  console.log("OTP Generated is : " + otp);
  otpStore[email] = otp;
  return res.status(200).json({
    msg: "OTP generated and logged.",
  });
});

app.post("/forgot-password", (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({
      msg: "Invalid credentials.",
    });
  }
  if (otp === otpStore[email]) {
    delete otpStore[email];
    return res.status(200).json({
      msg: "OTP Verified and new password is : " + newPassword,
    });
  } else {
    return res.status(400).json({
      msg: "Invalid OTP",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is runnig at ${PORT}`);
});
