import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "order name required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    userid: {
      type: String,
    },
    orderItems: [],
    shippingAddress: {
      type: Object,
    },
    orderAmount: {
      type: String,
      //   required: true,
    },
    isDeliverd: {
      type: Boolean,
      default: false,
    },
    transectionId: {
      type: String,
      //   required: true,
    },
  },
  { timestamps: true }
);

export const orderModel = mongoose.model("order", orderSchema);