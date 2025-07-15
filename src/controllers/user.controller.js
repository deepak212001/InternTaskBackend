import User from "../models/user.models.js";
import ClaimHistory from "../models/claimHistory.models.js";
import asyncHandler from '../asyncHandler.js';

//all users data fetch from the db
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    res.json(users);
});

//add the new user to the db
const addUser = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (name.trim() === "") {
        return res.status(400).json({ message: "Name is required" });
    }
    const existingUser = await User.find({ name });
    if (existingUser.length > 0) {
        return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({ name });
    res.json(user);
});

// add rondom pts to the user 
const claimPoints = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const points = Math.floor(Math.random() * 10) + 1;

    const user = await User.findByIdAndUpdate(userId, {
        $inc: { totalPoints: points }
    }, { new: true });

    await ClaimHistory.create({ userId, points });

    res.json({ message: "Points claimed", user, points });
});

// score board
const getLeaderboard = asyncHandler(async (req, res) => {
    const users = await User.find().sort({ totalPoints: -1 });
    const leaderboard = users.map((user, index) => ({
        rank: index + 1,
        name: user.name,
        totalPoints: user.totalPoints
    }));

    res.json(leaderboard);
});

// pts claim hstry
const getHistory = asyncHandler(async (req, res) => {
    const history = await ClaimHistory.find().populate("userId", "name").sort({ claimedAt: -1 });
    res.json(history);
});


export { getUsers, addUser, claimPoints, getLeaderboard, getHistory };