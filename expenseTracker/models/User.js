const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,  
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();  

    // Hash password
    const salt = await bcrypt.genSalt(10);  
    this.password = await bcrypt.hash(this.password, salt);  
    next();
});

// check password match
userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);  // compare entered password with hashed password
};

const User = mongoose.model('User', userSchema);
module.exports = User;
