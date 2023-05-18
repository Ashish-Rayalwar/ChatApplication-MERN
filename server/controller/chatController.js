const chatModel = require("../models/chatModel");
const userModel = require("../models/userModel");

const createChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "provide userID" });
  }

  var isChat = await chatModel
    .find({
      isGroupChat: false,
      $and: [
        { userId: { $elemMatch: { $eq: req.tokenDetails.userId } } },
        { userId: { $elemMatch: { $eq: userId } } },
      ],
    })
    .populate("userId", "-password")
    .populate("latestMessage");

  isChat = await userModel.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email profile",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      userId: [req.tokenDetails.userId, userId],
    };

    try {
      const createdChat = await chatModel.create(chatData);
      const FullChat = await chatModel
        .findOne({ _id: createdChat._id })
        .populate("userId", "-password");
      res.status(200).json(FullChat);
    } catch (error) {
      console.log(error.message);
      res.status(400).json(error.message);
    }
  }
};

const getChats = async (req, res) => {
  try {
    let chats = await chatModel
      .find({ userId: { $elemMatch: { $eq: req.tokenDetails.userId } } })
      .populate("userId", "-password")
      .populate("admin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    let result = await userModel.populate(chats, {
      path: "latestMessage.sender",
      select: "userName profile email",
    });

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const createGroupChat = async (req, res) => {
  try {
    let data = req.body;
    let { chatName, users } = data;
    console.log(data);
    if (!users || !chatName) {
      return res.status(400).send({ message: "Please Fill all the feilds" });
    }

    users = JSON.parse(users);

    if (users.length < 2) {
      return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }

    users.push(req.tokenDetails.userId);

    let group = await chatModel.create({
      chatName: chatName,
      userId: users,
      isGroupChat: true,
      admin: req.tokenDetails.userId,
    });

    const GroupChat = await chatModel
      .findOne({ _id: group._id })
      .populate("userId", "-password")
      .populate("admin", "-password");

    res.status(200).send(GroupChat);
  } catch (error) {
    console.log(error.message, "error in groupchat");
    return res.status(200);
  }
};

const renameGroup = async (req, res) => {
  try {
    let data = req.body;
    const { chatId, chatName } = data;

    const updatedChat = await chatModel
      .findByIdAndUpdate(
        chatId,
        {
          chatName: chatName,
        },
        {
          new: true,
        }
      )
      .populate("userId", "-password")
      .populate("admin", "-password");

    if (!updatedChat) {
      res.status(404);
      return res.status(404).send("Chat Not Found");
    } else {
      res.json(updatedChat);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

const addToGroup = async (req, res) => {
  try {
    let { chatId, userId } = req.body;

    let isAdmin = await chatModel.findOne({ _id: chatId });
    console.log(isAdmin.admin.toString());
    if (isAdmin.admin.toString() !== req.tokenDetails.userId) {
      return res.status(403).send({
        message: "you are not authorized to perform this task",
      });
    }

    let added = await chatModel
      .findByIdAndUpdate(
        chatId,
        {
          $push: { userId: userId },
        },
        {
          new: true,
        }
      )
      .populate("userId", "-password")
      .populate("admin", "-password");

    if (!added) {
      return res.status(404).send("Chat Not Found");
    } else {
      return res.json(added);
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json(error.message);
  }
};
const remove = async (req, res) => {
  try {
    let { chatId, userId } = req.body;

    let isAdmin = await chatModel.findOne({ _id: chatId });
    console.log(isAdmin.admin.toString());
    if (isAdmin.admin.toString() !== req.tokenDetails.userId) {
      return res.status(403).send({
        message: "you are not authorized to perform this task",
      });
    }

    let remove = await chatModel
      .findByIdAndUpdate(
        chatId,
        {
          $pull: { userId: userId },
        },
        {
          new: true,
        }
      )
      .populate("userId", "-password")
      .populate("admin", "-password");

    if (!remove) {
      return res.status(404).send("Chat Not Found");
    } else {
      return res.json(remove);
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json(error.message);
  }
};

module.exports = {
  createChat,
  getChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  remove,
};
