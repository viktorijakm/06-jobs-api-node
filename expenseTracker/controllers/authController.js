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
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email or Username already exists" });
    }

    // Create new user
    const newUser = new User({ email, username, password });

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

    // Compare passwords
    const isPasswordCorrect = await user.matchPassword(password);



   console.log(`Entered Password: ${password}`);
    console.log(`Stored Hashed Password: ${user.password}`);
    console.log(`Password Comparison Result: ${isPasswordCorrect}`);



    if (!isPasswordCorrect) {
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

const getUserById = async (req, res) => {
  try {
      const user = await User.findById(req.params.id).select('-password'); // Exclude password
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
  }
};

// Update User 
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, username, password } = req.body;

  try {
      // Find user by ID
      let user = await User.findById(id);
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      if (req.user.userId !== user._id.toString()) {
          return res.status(403).json({ error: "Unauthorized to update this user" });
      }

      // Update fields if provided
      if (email) user.email = email;
      if (username) user.username = username;
      if (password) {
          user.password = await bcrypt.hash(password, 12);
      }

      await user.save();

      const updatedUser = user.toObject();
      delete updatedUser.password;

      res.status(200).json({ message: "User updated successfully", user:updatedUser });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Find user by ID
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure only the authenticated user can delete their account
    if (req.user.userId !== user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized to delete this user" });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { register, login, getUserById, updateUser, deleteUser };
