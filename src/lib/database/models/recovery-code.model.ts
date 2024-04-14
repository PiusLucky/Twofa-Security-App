import { Schema, model, models } from "mongoose";

const RecoveryCodeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: "userId is required",
      ref: "User",
    },
    code: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      allowNull: false,
      default: false,
    },
  },
  { timestamps: true } // This will add the createdAt and updatedAt fields
);

const RecoveryCode =
  models?.RecoveryCode || model("RecoveryCode", RecoveryCodeSchema);

export default RecoveryCode;
