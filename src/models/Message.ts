import mongoose, { Schema, type Document } from "mongoose";
import type {IUser} from './User'

export interface IMessage extends Document {
  sender: IUser['_id'];
  content: string;
  timestamp: Date;
}

const MessageSchema: Schema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now }
});

export default mongoose.model<IMessage>("Message", MessageSchema);