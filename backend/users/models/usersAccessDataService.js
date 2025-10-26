const { createError } = require("../../utils/handleErrors");
const { generateToken } = require("../../auth/providers/jwt");
const { generateUserPassword, comparePassword } = require("../helpers/bcrypt");
const User = require("../models/User");
const Book = require("../../books/models/Book");

const minutesLeft = (until) =>
  Math.max(1, Math.ceil((until.getTime() - Date.now()) / 60000));

// register new user
const registerUser = async (newUser) => {
  try {
    if (newUser.email) newUser.email = String(newUser.email).toLowerCase().trim();
    newUser.password = generateUserPassword(newUser.password);
    const user = await User.create(newUser);
    const plain = user.toObject();
    delete plain.password;
    return plain;
  } catch (error) {
    return createError("Mongoose", error.message);
  }
};

// get user by ID
const getUser = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) return createError("Mongoose", "User not found", 404);
    return user;
  } catch (error) {
    return createError("Mongoose", error.message);
  }
};

// get all users
const getAllUsers = async () => {
  try {
    const users = await User.find().select("-password");
    return users;
  } catch (error) {
    return createError("Mongoose", error.message);
  }
};

// login user (с блокировкой)
const loginUser = async (email, password) => {
  try {
    const normEmail = String(email || "").toLowerCase().trim();
    const userFromDB = await User.findOne({ email: normEmail });

    // одинаковое сообщение, чтобы не раскрывать наличие email
    if (!userFromDB) {
      return createError("Authentication", "Invalid email or password", 401);
    }

    // если уже под замком и время не вышло — 403 с оставшимися минутами
    if (userFromDB.lockUntil && Date.now() < userFromDB.lockUntil.getTime()) {
      return createError(
        "Authentication",
        `Account is locked. Try again in ~${minutesLeft(userFromDB.lockUntil)} minutes`,
        403
      );
    }

    // если блок истёк — сброс
    if (userFromDB.lockUntil && Date.now() >= userFromDB.lockUntil.getTime()) {
      userFromDB.lockUntil = null;
      userFromDB.loginAttempts = 0;
      await userFromDB.save();
    }

    // проверка пароля
    const ok = comparePassword(password, userFromDB.password);
    if (!ok) {
      const attempts = (userFromDB.loginAttempts || 0) + 1;

      // достигли лимита — блокируем на 60 минут
      if (attempts >= 3) {
        userFromDB.loginAttempts = 0;
        userFromDB.lockUntil = new Date(Date.now() + 60 * 60 * 1000);
        await userFromDB.save();
        return createError(
          "Authentication",
          `Account is locked. Try again in ~${Math.ceil(60 * 60 * 1000 / 60000)} minutes`,
          403
        );
      }

      userFromDB.loginAttempts = attempts;
      await userFromDB.save();
      return createError("Authentication", "Invalid email or password", 401);
    }

    // успех — сброс счётчиков/блокировки
    if (userFromDB.loginAttempts || userFromDB.lockUntil) {
      userFromDB.loginAttempts = 0;
      userFromDB.lockUntil = null;
      await userFromDB.save();
    }

    const token = generateToken({
      _id: userFromDB._id,
      email: userFromDB.email,
      isAdmin: userFromDB.isAdmin,
    });

    return { token };
  } catch (error) {
    return createError("Authentication", error.message);
  }
};

// update user
const updateUser = async (id, updates) => {
  try {
    if (updates?.email) updates.email = String(updates.email).toLowerCase().trim();
    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
      select: "-password",
    });
    if (!user) return createError("Mongoose", "User not found", 404);
    return user;
  } catch (error) {
    return createError("Mongoose", error.message);
  }
};

// delete user (удаляем его книги)
const deleteUser = async (id) => {
  try {
    const user = await User.findByIdAndDelete(id).select("-password");
    if (!user) return createError("Mongoose", "User not found", 404);

    // удаляем книги пользователя
    await Book.deleteMany({ user_id: id });

    return user;
  } catch (error) {
    return createError("Mongoose", error.message);
  }
};

//  delete users (admin) 
const deleteAllUsers = async ({ keepAdmins = true, keepSelf = true, selfId } = {}) => {
  try {
    const filter = {};
    if (keepAdmins) filter.isAdmin = { $ne: true };
    if (keepSelf && selfId) filter._id = { $ne: selfId };

    // найдём кандидатов и их id
    const toRemove = await User.find(filter).select("_id");
    const ids = toRemove.map((u) => u._id);
    if (!ids.length) return { acknowledged: true, deletedCount: 0 };

    // сначала каскадом удалим их книги
    await Book.deleteMany({ user_id: { $in: ids } });

    // затем удалим пользователей
    const res = await User.deleteMany({ _id: { $in: ids } });
    return res; // { acknowledged, deletedCount }
  } catch (error) {
    return createError("Mongoose", error.message);
  }
};

// update password
const updatePassword = async (id, newPassword) => {
  const user = await User.findById(id);
  if (!user) throw createError("Mongoose", "User not found", 404);

  user.password = generateUserPassword(newPassword);
  await user.save();

  return { message: "Password updated successfully" };
};

module.exports = {
  registerUser,
  getUser,
  getAllUsers,
  loginUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
  updatePassword,
};
