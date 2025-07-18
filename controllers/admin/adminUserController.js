const User = require('../../models/userSchema')
const bcrypt = require("bcrypt");
require('dotenv').config()

const loadUser= async (req, res) => {
    try {
        const { name, status, page = 1 } = req.query;
        const pageSize = 5;
        const skip = (page - 1) * pageSize;

        const query = { isAdmin: false };

        if (name) {
            query.name = { $regex: new RegExp(name, 'i') };
        }

        if (status === 'active') query.isBlocked = false;
        if (status === 'blocked') query.isBlocked = true;

        const totalUsers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / pageSize);

        const users = await User.find(query)
            .sort({ createdOn: -1 })
            .skip(skip)
            .limit(pageSize)
            .select('_id name email phone isBlocked');

        res.render('admin/userManagement', {
            success: true,
            users,
            query,
            status,
            currentPage: parseInt(page),
            totalPages
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const blockUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const newStatus = !user.isBlocked;
        user.isBlocked = newStatus;
        await user.save();

        res.json({
            success: true,
            isBlocked: user.isBlocked,
            message: `User has been ${user.isBlocked ? 'blocked' : 'unblocked'}`
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getUsersList = async (req, res) => {
    try {
        const { name = '', status = '', page = 1, limit = 5 } = req.query;
        const query = {};

        if (name.trim()) query.name = { $regex: new RegExp(name, 'i') };
        if (status === 'active') query.isBlocked = false;
        if (status === 'blocked') query.isBlocked = true;

        const skip = (page - 1) * limit;

        const [users, totalUsers] = await Promise.all([
            User.find(query).sort({createdOn:-1}).skip(skip).limit(Number(limit)).select('name email phone isBlocked'),
            User.countDocuments(query)
        ]);

        res.json({
            success: true,
            users,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalUsers / limit)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error fetching users' });
    }
};

module.exports={
    loadUser,
    blockUser,
    getUsersList

}
