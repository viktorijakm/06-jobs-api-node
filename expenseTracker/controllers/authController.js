const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Register function
const register = async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: "Please provide all fields " });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({ email, username, password: hashedPassword });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Login function
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Please provide username and password" });
  }

  try {
    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      console.log("User not found");

      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log(`Entered Password: ${password}`);
    console.log(`Stored Hashed Password: ${user.password}`);

    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      console.log("Password incorrect");

      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);

    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { register, login };
