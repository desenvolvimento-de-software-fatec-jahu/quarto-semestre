import mongoose from "mongoose";

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    todo: {
      type: Schema.Types.ObjectId,
      ref: "Todo",
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;