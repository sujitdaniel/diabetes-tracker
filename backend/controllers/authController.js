const User = require('../models/User');
const bcrypt = require('bcrypt');

const signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed, role });
  await user.save();
  req.session.user = user;
  res.json({ message: 'Signup successful', role: user.role });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: 'Invalid credentials' });
  req.session.user = user;
  res.json({ message: 'Login successful', role: user.role });
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out' });
  });
};

const dashboard = (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'Unauthorized' });
  const { role } = req.session.user;
  if (role === 'patient') res.json({ message: 'Patient Dashboard' });
  else if (role === 'doctor') res.json({ message: 'Doctor Dashboard' });
  else if (role === 'caregiver') res.json({ message: 'Caregiver Dashboard' });
};

module.exports = { signup, login, logout, dashboard };