import bcrypt from "bcryptjs";
import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
    trim: true,
  },
});

userSchema.methods.checkPassword = async (
  inputPass: string,
  userPass: string
) => {
  return await bcrypt.compare(inputPass, userPass);
};

export interface UserDocument extends InferSchemaType<typeof userSchema> {
  checkPassword(inputPass: string, userPass: string): Promise<boolean>;
}
export const User: Model<UserDocument> =
  models.User || model<UserDocument>("User", userSchema);
