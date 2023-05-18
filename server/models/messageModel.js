const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const messageSchema = mongoose.Schema(
  {
    sender: { type: ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: ObjectId, ref: "Chat" },
    // readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
