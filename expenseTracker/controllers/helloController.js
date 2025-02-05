// controllers/helloController.js
const hello = (req, res) => {
    res.status(200).json({ message: `Hello, ${req.user.username}!` });
};

module.exports = { hello };
