import mongoose from "mongoose";
import { PaymentType } from "../shared/types";

export const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    total: { type: Number, required: true },
    creditsAmount: { type: Number, required: true },
    status: { type: String, required: true },
    receipt: { type: String, required: true },
    refunded: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const PaymentModel = mongoose.model<PaymentType>(
  "Payment",
  paymentSchema
);
