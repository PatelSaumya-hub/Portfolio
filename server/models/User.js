import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  profilePic: {
    type: String,
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  is2FAEnabled: {
    type: Boolean,
    default: true
  },
  twoFactorCode: {
    type: String,
    default: '123456'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

export default User;
