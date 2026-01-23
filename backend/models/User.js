const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please add a name"],
            trim: true
        },
        username: {
            type: String,
            required: [true, "Please add a username"],
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: [true, "Please add an email"],
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please add a valid email"
            ]
        },
        passwordHash: {
            type: String,
            required: [true, "Please add a password"]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);
