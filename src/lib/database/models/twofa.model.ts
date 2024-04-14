import { Schema, model, models } from "mongoose";

const TwofaSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: "userId is required",
      ref: "User",
    },
    secret: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      allowNull: false,
      default: false,
    },
  },
  { timestamps: true } // This will add the createdAt and updatedAt fields
);

const Twofa = models?.Twofa || model("Twofa", TwofaSchema);

export default Twofa;
