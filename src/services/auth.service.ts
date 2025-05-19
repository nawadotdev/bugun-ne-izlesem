import jwt from 'jsonwebtoken';
import User from '../models/User';
import connectDB from '../lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined');
}

export const authService = {
  async register(userData: { name: string; email: string; password: string }) {
    await connectDB();
    
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Bu email adresi zaten kullanımda');
    }

    const user = await User.create(userData);
    const token = this.generateToken(user);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
      token,
    };
  },

  async login(email: string, password: string) {
    await connectDB();
    
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Geçersiz şifre');
    }

    const token = this.generateToken(user);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
      token,
    };
  },

  generateToken(user: any) {
    return jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  },

  verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Geçersiz token');
    }
  },
}; 