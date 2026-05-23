import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  email: string;
  password: string;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    first_name: {
      type: String,
      required: true,
    },

    last_name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
