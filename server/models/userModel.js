const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String, trim: true, required: true },
    profile: {
      type: String,
      default:
        "https://e7.pngegg.com/pngimages/348/800/png-clipart-man-wearing-blue-shirt-illustration-computer-icons-avatar-user-login-avatar-blue-child.png",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
