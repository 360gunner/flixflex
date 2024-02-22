import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  password: string;
  favorites: Array<string>; 
}

const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Movie' }]
});

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 8);
  next();
});

export default mongoose.model<IUser>('User', userSchema);
