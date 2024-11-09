// middleware/authenticateToken.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer 토큰에서 실제 토큰만 추출

  if (token == null) return res.status(401).json({ error: 'Token is required.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // 비밀 키로 토큰을 검증
    const user = await User.findById(decoded.userId); // JWT에서 userId를 추출하여 사용자 조회

    if (!user) return res.status(404).json({ error: 'User not found.' });

    req.user = user; // 요청 객체에 사용자 정보를 추가
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token.' });
  }
};

module.exports = authenticateToken;
