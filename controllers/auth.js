const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
const {name,email,password} = req.body

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError("Email already in use");
  }


  //  optional
  
  // //     if(!name || !email || !password){
  // // throw  new BadRequestError('Please provide required credential')}

  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(password,salt)

  // const tempUser = {name,email,password:hashedPassword}

  const user = await User.create({ ...req.body });
  // const token= jwt.sign({userId:user._id, name:user.name},'jwtSecret', {expiresIn:'30d',
  // })
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError("Provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid information, provide valid email and password");
  }
  const isPasswordCorrect = await user.checkPassword(password)
  if (!isPasswordCorrect) {
  throw new UnauthenticatedError('Invalid information')
  }
 // comparing password
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
