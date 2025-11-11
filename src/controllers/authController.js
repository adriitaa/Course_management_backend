const User = require('../models/User');
const { signToken, setAuthCookie, clearAuthCookie } = require('../utils/jwt');

async function register(req, res) {
  try {
    const { name, email, password, phoneNumber } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'name, email, password required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });

    const user = await User.create({ name, email, password, phoneNumber });
    const token = signToken(user._id);
    setAuthCookie(res, token);

    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, phoneNumber: user.phoneNumber } });
  } catch {
    res.status(500).json({ message: 'Registration failed' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password are required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user._id);
    setAuthCookie(res, token);

    res.json({ user: { id: user._id, name: user.name, email: user.email, phoneNumber: user.phoneNumber } });
  } catch {
    res.status(500).json({ message: 'Login failed' });
  }
}

async function logout(_req, res) {
  clearAuthCookie(res);
  res.json({ message: 'Logged out' });
}

module.exports = { register, login, logout };
