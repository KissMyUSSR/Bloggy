import mongoose from 'mongoose';

import { DEFAULT_PROFILE_PICTURE } from 'config';
import { Blog, User } from 'types/custom';

// a simple email validation
// had to put it here to avoid circular dependencies with entity-validators/user
export const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const BlogSchema = new mongoose.Schema<Blog>(
  {
    likes: {
      type: Number,
      default: 0,
    },
    categories: {
      type: [String],
      default: [],
      validate: {
        validator: (categories: string[]) => categories.length <= 10,
        message: 'Must be 10 categories at most',
      },
      index: 1,
    },
    description: {
      type: String,
      default: '',
      maxLength: [1000, 'Description must be at most 1000 characters long'],
    },
  },
  { timestamps: true, versionKey: false, autoIndex: true }
);

const UserSchema = new mongoose.Schema<User>(
  {
    username: {
      type: String,
      required: true,
      minLength: [3, 'Username must be at least 3 characters long'],
      maxLength: [20, 'Username must be at most 20 characters long'],

      // typescript doesn't recognize this
      // even though it's the only way to add multiple indexes within a mongoose schema
      index: { text: true, unique: true } as any,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validateEmail,
        message: 'Invalid email address!',
      },
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: DEFAULT_PROFILE_PICTURE,
    },
    blog: {
      type: BlogSchema,
    },
  },
  { timestamps: true, versionKey: false, autoIndex: true }
);

const User = mongoose.model<User>('User', UserSchema);
export default User;
