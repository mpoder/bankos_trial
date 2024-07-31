import mongoose, { Schema, type Document } from "mongoose";

export interface IUser extends Document {
  userName: string;
  hashedPassword: string;
  createdAt: Date;
  lastSeen: Date;
}

const UserSchema: Schema = new Schema({
  userName: { type: String, required: true },
  hashedPassword: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  lastSeen: { type: Date, required: false }
});


export default mongoose.model<IUser>("User", UserSchema);