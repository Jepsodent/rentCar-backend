import jwt from "jsonwebtoken";

//POST //api/admin/login
export const adminLogin = async (req, res) => {
    const {email , password } = req.body;
    if(!email || !password){
        return res.status(401).json({success:false, message: "Missing required data"});
    }
    try {
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign({email}, process.env.JWT_SECRET, {
                expiresIn: '1d',
            });
    
            res.cookie("adminToken",token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: process.env.NODE_ENV === 'production' ? 'none': 'lax',
            });
            
            return res.json({success:true, message: "Logged In"});
        }else{
            return res.json({success:false, message: "Invalid Credential"});
        }
    } catch (error) {
        res.json({success:false, message: error.message});
    }
}

//GET //api/admin/logout 

export const adminLogout = async (req, res) => {
    try {
        res.clearCookie('adminToken');
        res.status(200).json({success:true, message: "Logged Out"});
    } catch (error) {
        res.status(500).json({success:false, message: error.message });
    }
}

//GET //api/admin/is-auth 

export const isAdmin = async (req, res) => {
    return res.status(200).json({success:true});
}

