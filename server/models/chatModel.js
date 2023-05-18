const { default: mongoose } = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const chatSchema = new mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    userId: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: ObjectId,
      ref: "Message",
    },
    admin: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
