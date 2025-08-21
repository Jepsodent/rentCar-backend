import jwt from "jsonwebtoken";

const authUser = async (req, res , next) => {
    try {
        const {token} = req.cookies;
        if(!token){
            return res.status(401).json({success:false, message:"Not Authorized"});
        };
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verified.id;
        next();
    } catch (error) {
        return res.status(401).json({success:false, message: error.message});
    }
} 

export default authUser;


