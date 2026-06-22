const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const API_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- Starting Password Flow End-to-End Tests ---');
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    // Clean up past test users
    await User.deleteMany({ email: 'test_pwd_user@gmail.com' });
    
    // Create a verified test user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    await User.create({
      name: 'Password Tester',
      email: 'test_pwd_user@gmail.com',
      password: hashedPassword,
      isVerified: true
    });
    console.log('Created verified test user: test_pwd_user@gmail.com');

    // 2. Test Forgot Password (Request OTP)
    console.log('\n--- Test: Request Forgot Password OTP ---');
    const forgotRes = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test_pwd_user@gmail.com' })
    });
    const forgotData = await forgotRes.json();
    console.log('Forgot Password response status:', forgotRes.status);
    console.log('Forgot Password response:', forgotData);
    if (forgotRes.status !== 200) throw new Error('Forgot password request failed');

    // 3. Fetch OTP from Database
    const user = await User.findOne({ email: 'test_pwd_user@gmail.com' });
    const resetOtp = user.resetPasswordOtp;
    console.log(`Retrieved OTP from DB: ${resetOtp}`);
    if (!resetOtp) throw new Error('Reset OTP not saved in DB');

    // 4. Test Verify Reset OTP
    console.log('\n--- Test: Verify Reset OTP ---');
    const verifyRes = await fetch(`${API_URL}/auth/verify-reset-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test_pwd_user@gmail.com', otp: resetOtp })
    });
    const verifyData = await verifyRes.json();
    console.log('Verify OTP response status:', verifyRes.status);
    console.log('Verify OTP response:', verifyData);
    if (verifyRes.status !== 200) throw new Error('OTP verification failed');

    // 5. Test Reset Password
    console.log('\n--- Test: Reset Password ---');
    const resetRes = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test_pwd_user@gmail.com',
        otp: resetOtp,
        newPassword: 'newpassword123'
      })
    });
    const resetData = await resetRes.json();
    console.log('Reset Password response status:', resetRes.status);
    console.log('Reset Password response:', resetData);
    if (resetRes.status !== 200) throw new Error('Reset password failed');

    // 6. Verify login with the new password
    console.log('\n--- Test: Login with Reset Password ---');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test_pwd_user@gmail.com', password: 'newpassword123' })
    });
    const loginData = await loginRes.json();
    console.log('Login response status:', loginRes.status);
    console.log('Login successful:', !!loginData.token);
    if (loginRes.status !== 200 || !loginData.token) throw new Error('Login failed with reset password');

    const token = loginData.token;

    // 7. Test Change Password (Authenticated)
    console.log('\n--- Test: Change Password (Authenticated) ---');
    const changeRes = await fetch(`${API_URL}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        currentPassword: 'newpassword123',
        newPassword: 'finalpassword123'
      })
    });
    const changeData = await changeRes.json();
    console.log('Change Password response status:', changeRes.status);
    console.log('Change Password response:', changeData);
    if (changeRes.status !== 200) throw new Error('Change password failed');

    // 8. Verify login with changed password
    console.log('\n--- Test: Login with Changed Password ---');
    const finalLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test_pwd_user@gmail.com', password: 'finalpassword123' })
    });
    const finalLoginData = await finalLoginRes.json();
    console.log('Final Login response status:', finalLoginRes.status);
    console.log('Final Login successful:', !!finalLoginData.token);
    if (finalLoginRes.status !== 200 || !finalLoginData.token) throw new Error('Login failed with changed password');

    console.log('\n✅ ALL BACKEND PASSWORD FLOW TESTS PASSED SUCCESSFULLY!');

  } catch (error) {
    console.error('\n❌ TEST SUITE FAILED:', error.message);
  } finally {
    // Clean up
    await User.deleteMany({ email: 'test_pwd_user@gmail.com' });
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

runTests();
