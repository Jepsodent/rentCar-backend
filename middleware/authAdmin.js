import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
    try {
        const {adminToken} =req.cookies;
        if(!adminToken){
            return res.status(401).json({success:false, message: "Not Authorized"});
        }
        
        const verified = jwt.verify(adminToken, process.env.JWT_SECRET);
        if(verified.email === process.env.ADMIN_EMAIL){
            next();
        }else{
            return res.status(401).json({success:false, message: "Not Authorized"});
        }
    } catch (error) {
        res.status(401).json({success:false , message: error.message});
    }
}

export default adminAuth;


