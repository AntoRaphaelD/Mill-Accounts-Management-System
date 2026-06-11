import { User } from "../models/index.js";

export const updateCurrentUser = async (req, res, next) => {
  try {
    const userName = req.body.user || "SIVA";
    await User.update({ isCurrent: false }, { where: {} });
    await User.upsert({ userName, isCurrent: true });
    res.json({ success: true, currentUser: userName });
  } catch (error) {
    next(error);
  }
};
