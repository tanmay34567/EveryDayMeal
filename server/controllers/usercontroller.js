// Corrected register controller


import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';




export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: 'Missing details' });
    }

    const existinguser = await User.findOne({ email });

    if (existinguser)
      return res.json({ success: false, message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, user: { email: user.email, name: user.name } });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
}

export const login = async (req,res)=>{
    try{
        const{email,password}=req.body;

        if(!email || !password)
            return res.json({success : false , message: 'Email and password are reqiuired'});
        const user = await User.findOne({email});
         if(!user){
            return res.json({success : false , message: 'Invalid email or password'});

         }

         const isMatch = await bcrypt.compare(password,user.password)

         if(! isMatch)
            return res.json({success : false , message: 'Invalid email or password'});
            
         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
          });
      
          res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
      
          return res.json({ success: true, user: { email: user.email, name: user.name } });
    }catch (error){
        console.log(error.message);
        res.json({ success: false, message: error.message });


    }
}


export const isAuth = async (req, res) => {
    try {
      const user = await User.findById(req.userId).select("-password");
      return res.json({ success: true, user });
    } catch (error) {
      console.log(error.message);
      res.json({ success: false, message: error.message });
    }
  };
  

export const logout = async (req, res) => {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      });
  
      return res.json({ success: true, message: "Logged Out" });
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
};
  