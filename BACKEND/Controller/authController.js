const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Model/User');

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({ name, email, password: hashedPassword, role });

        res.status(201).json({ message: 'User registered' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Store token in HTTP-only cookie (for security)
        res.cookie('token', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'None' 
        });

        // Also return token in response body for localStorage storage
        res.json({ message: 'Login successful', token, role: user.role });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token', { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'None' 
    }); 
    res.status(200).json({ message: 'Logged out successfully' });
};
