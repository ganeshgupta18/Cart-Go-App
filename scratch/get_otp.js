const mongoose = require('mongoose');
const User = require('../backend/models/User');

async function getOtp() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/shopnest');
    const user = await User.findOne({ email: 'tester123@gmail.com' });
    console.log('OTP IS:', user ? user.verificationOtp : 'NOT FOUND');
  } catch (error) {
    console.error('Error fetching OTP:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

getOtp();
