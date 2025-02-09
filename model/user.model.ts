import { model, Schema, Model, Document } from 'mongoose';

export interface User extends Document {
  telegramUserId: number;
  telegramName: string;
  coins?: number;
}

const UserSchema: Schema = new Schema(
  {
    telegramUserId: {
      type: Number,
      required: true,
      unique: true,
    },
    telegramName: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 300,
    },
    coins: {
      type: Number,
      required: false,
      sparse: true,
    },
  },
  { timestamps: true },
);

export const UserModel: Model<User> = model<User>('User', UserSchema);
