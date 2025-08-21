import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


//POST /api/user/register
export const register = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, address } = req.body;
    if (!name || !email || !password || !phoneNumber || !address) {
      return res
        .status(400)
        .json({ success: false, message: "Missing details" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ success: false, message: "User already exist" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashPassword,
      phoneNumber,
      address,
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES || "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, //1d expire
    });
    return res.status(200).json({
      success: true,
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST  /api/user/login
export const login = async (req, res) => {
    
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Missing required data" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    const validate = await bcrypt.compare(password, user.password);
    if (!validate) {
      return res.status(401).json({ success: false, message: "Wrong password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES || "1d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === 'production' ? 'none': 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ success: true, user: { email: user.email, name: user.name } });
  } 
  catch (error) {
    res.status(500).json({success:false, message:error.message});
  }
};


//GET //api/user/logout
export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({success:true, message: "Logged Out"});
    } catch (error) {
        res.status(500).json({success:false, message:error.message})
    }
}

//GET /api/user/is-auth
export const isAuth = async (req, res) => {
    try {
        const {userId} = req;
        const user = await User.findById(userId).select('-password');
        if(!user){
            return res.status(404).json({ success: false, message: 'User is not registered' });
        }
        res.status(200).json({success:true, user});
    } catch (error) {
        res.status(500).json({success:false, message: error.message});
    }
}