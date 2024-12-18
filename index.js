const express = require("express");
const mongoose = require("mongoose"); // MongoDB driver
const app = express();

const PORT = 8000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// MongoDB connection
mongoose
    .connect("mongodb+srv://balajipatil1220:Bidar123@cluster0.sf2wl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

// User Schema
const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String },
    email: { type: String},
    gender: {type: String},
    job_role: {type: String}
});

const User = mongoose.model("User", userSchema);

// Routes

// GET all users
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the MongoDB database
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// GET user by ID
app.get("/api/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id); // Find user by ID
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

// POST (Add a new user)
app.post("/api/users", async (req, res) => {
    try {
        const user = new User(req.body); // Create a new user document
        await user.save(); // Save user to the database
        res.json({ status: "success", user });
    } catch (err) {
        res.status(500).json({ error: "Failed to add user" });
    }
});

// PUT (Update user by ID)
app.put("/api/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        }); // Update user by ID and return the updated document
        if (user) {
            res.json({ status: "success", updatedUser: user });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ error: "Failed to update user" });
    }
});

// DELETE (Delete user by ID)
app.delete("/api/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id); // Delete user by ID
        if (user) {
            res.json({ status: "success", deletedUser: user });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ error: "Failed to delete user" });
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
