const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// ✅ Hardcoded secret key
const SECRET_KEY = "mySuperSecretKey123";

// ✅ Dummy user (you can change if needed)
const user = {
  id: 1,
  username: "testuser",
  password: "password123",
};

// =============================
// POST /login  → issue JWT token
// =============================
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check credentials
  if (username === user.username && password === user.password) {
    // Create token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" } // Token valid for 1 hour
    );

    // Send token in JSON response
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

// ==================================
// Middleware to verify token
// ==================================
function verifyToken(req, res, next) {
  // Read token from "Authorization" header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract after "Bearer"

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  // Verify token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
}

// ==============================
// =============================
// Middleware to verify token
// =============================
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
}

// =============================
// Protected route
// =============================
app.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "You have accessed a protected route!",
    user: req.user,
  });
});

// =============================
// Start server
// =============================
app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
