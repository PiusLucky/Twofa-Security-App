import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    full_name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    suspended: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // This will add the createdAt and updatedAt fields
);

const User = models?.User || model("User", UserSchema);

export default User;
