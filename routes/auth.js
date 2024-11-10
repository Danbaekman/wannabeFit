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

    // 2. 사용자 정보 조회 또는 생성
    let user = await User.findOne({ email });

    if (user) {
      // 사용자 등록되어 있는 경우, 액세스 토큰 및 정보 업데이트
      let token = await Token.findOne({ userId: user._id });

      if (token) {
        // 토큰이 이미 존재하면 업데이트
        token.accessToken = accessToken;
        token.updated_at = Date.now();
        await token.save();
      } else {
        // 토큰이 존재하지 않으면 새로 생성
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
      console.log('Generated JWT:', jwtToken);
      
      // 성공 메시지와 데이터 반환
      console.log('User already registered:', user);
      return res.status(200).json({ message: 'User already registered', user, token, jwtToken });
    } else {
      // 사용자 등록되어 있지 않은 경우, 새 사용자 등록
      user = new User({
        email,
        name,
        created_at: Date.now()
      });
      await user.save();

      // 새 사용자에 대한 토큰 저장
      const token = new Token({
        userId: user._id,
        accessToken,
        created_at: Date.now(),
        updated_at: Date.now()
      });
      await token.save();

      // JWT 발급
      const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('Generated JWT:', jwtToken);x

      // 성공 메시지와 데이터 반환
      console.log('User registered and token saved:', user);
      return res.status(201).json({ message: 'User registered and token saved', user, token, jwtToken });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
