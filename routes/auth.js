// routes/user.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const Token = require('../models/Token');
const jwt = require('jsonwebtoken'); // JWT 라이브러리 추가

// 네이버 액세스 토큰을 통해 사용자 정보를 확인하고, 회원가입 여부를 판단합니다.
router.post('/login/naver', async (req, res) => {
  try {
    const { accessToken } = req.body;

    // 1. 네이버 API를 통해 액세스 토큰 유효성 검사 및 사용자 정보 조회
    const response = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.data.resultcode !== '00') {
      return res.status(400).json({ error: 'Invalid access token' });
    }

    const { email, name } = response.data.response;

    // 2. 사용자 정보 조회
    let user = await User.findOne({ email });

    if (user) {
      // 사용자 등록되어 있는 경우, 액세스 토큰 업데이트
      let token = await Token.findOne({ userId: user._id });

      if (token) {
        token.accessToken = accessToken;
        token.updated_at = Date.now();
        await token.save();
      } else {
        token = new Token({
          userId: user._id,
          accessToken,
          created_at: Date.now(),
          updated_at: Date.now()
        });
        await token.save();
      }

      // JWT 발급
      const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      return res.status(200).json({ message: 'User already registered', user, token, jwtToken });
    } else {
      // 사용자 등록되어 있지 않은 경우, 새 사용자 등록
      let user = new User({
        email,
        name,
        created_at: Date.now()
      });

      let savedUser;
      try {
        savedUser = await user.save(); // 사용자 저장
      } catch (error) {
        console.error('Error saving user:', error);
        return res.status(500).json({ error: 'Failed to save user' });
      }

      // 새 사용자에 대한 토큰 저장
      let token;
      try {
        token = new Token({
          userId: savedUser._id,
          accessToken,
          created_at: Date.now(),
          updated_at: Date.now()
        });
        await token.save();
      } catch (error) {
        console.error('Error saving token, deleting user:', error);
        await User.deleteOne({ _id: savedUser._id }); // 사용자 삭제
        return res.status(500).json({ error: 'Failed to save token, user rolled back' });
      }

      // JWT 발급
      const jwtToken = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      return res.status(201).json({ message: 'User registered and token saved', user: savedUser, token, jwtToken });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: error.message });
  }
});


router.post('/logout', async (req, res) => {
  try {
    const { userId } = req.body;

    // 1. 사용자 ID로 액세스 토큰 삭제
    const token = await Token.findOne({ userId });

    if (!token) {
      return res.status(404).json({ error: 'Token not found for the user' });
    }

    // 2. 토큰 삭제
    await Token.deleteOne({ userId });
    console.log('Token deleted for user:', userId);

    // 성공 메시지 반환
    return res.status(200).json({ message: 'User successfully logged out' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
