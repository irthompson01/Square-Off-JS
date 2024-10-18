const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');  // Assuming you've set up the db.js as suggested earlier

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await db.query(
      'INSERT INTO public.users (email, password_hash) VALUES ($1, $2)',
      [email, passwordHash]
    );
    res.status(201).send('User registered!');
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).send('Error registering user');
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const result = await db.query('SELECT * FROM public.users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      res.status(200).send('Login successful!');
    } else {
      res.status(400).send('Invalid credentials');
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).send('Error during login');
  }
});

module.exports = router;