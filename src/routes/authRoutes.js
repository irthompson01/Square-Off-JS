const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');  // Assuming you've set up the db.js as suggested earlier

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use an environment variable in production

// Register route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await db.query(
      'INSERT INTO auth.users (username, email, password_hash) VALUES ($1, $2, $3)',
      [username, email, passwordHash]
    );
    res.status(201).send('User registered!');
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).send('Error registering user');
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { emailOrUsername, password } = req.body;
  
  try {
    const result = await db.query(
      'SELECT * FROM auth.users WHERE email = $1 OR username = $1',
      [emailOrUsername]
    );
    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      // Generate a JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(200).json({
        message: 'Login successful!',
        token: token
      });
    } else {
      res.status(400).send('Invalid credentials');
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).send('Error during login');
  }
});

module.exports = router;