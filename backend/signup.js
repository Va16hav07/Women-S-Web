import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB Connection Error:", err));

// User Schema
const userSchema = new mongoose.Schema({
    userId: { type: String, unique: true, default: uuidv4 },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

// Signup API Route
app.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;

        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword,
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id, userId: newUser.userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({ message: "User registered successfully", userId: newUser.userId, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));