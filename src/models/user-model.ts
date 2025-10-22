import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "crypto";
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
    required: [true, "Password is required"],
    minlength: [8, "password must be at least 8 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "confirm your password"],
    validate: {
      validator: function (this: UserType, value: string) {
        return this.password === value;
      },
      message: "Passwords must match",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.set("passwordConfirm", undefined);
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

userSchema.methods.checkPassword = async (
  inputPass: string,
  userPass: string
) => {
  return await bcrypt.compare(inputPass, userPass);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = randomBytes(32).toString("hex");
  this.passwordResetToken = createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.changedPasswordAfter = function (issuedAt: number) {
  if (this.passwordChangedAt) {
    const changedAtTimeStamp = this.passwordChangedAt.getTime() / 1000;
    return issuedAt < changedAtTimeStamp;
  }
  return false;
};

type UserType = InferSchemaType<typeof userSchema>;
export interface UserDocument extends InferSchemaType<typeof userSchema> {
  checkPassword(inputPass: string, userPass: string): Promise<boolean>;
  createPasswordResetToken(): string;
  changedPasswordAfter(issuedAt: number): boolean;
}
export const User: Model<UserDocument> =
  models.User || model<UserDocument>("User", userSchema);
