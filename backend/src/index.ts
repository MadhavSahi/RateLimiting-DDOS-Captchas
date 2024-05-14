import express from "express";
import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	limit: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
  message:"Too many request. Try again after 5 minutes."
})

const app = express();
// Apply the rate limiting middleware to all requests.
app.use(limiter)
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
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
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
    console.log("New password is :- "+otp);
    
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
