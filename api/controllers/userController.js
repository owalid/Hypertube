import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import uuidv1 from 'uuidv1';
import { User } from '../models/userModel';
import { Movie } from '../models/movieModel';
import mongoose from 'mongoose';
import { verifParams } from '../utils/verifParams';
import { sendMail } from '../utils/email';
import { checkExtension, checkEmail, checkUsername, checkPassword, checkName } from '../utils/regexVerif';
require('dotenv').config();

const register = async (req, res) => {
  const { picture, username, firstname, lastname, email, password } = req.body;
  if (verifParams(req.body, 6) && checkExtension(req.body.picture)
  && checkName(firstname) && checkName(lastname) && checkUsername(username)
  && checkPassword(password) && checkEmail(email)
  ) {
    try {
      // Check the availibity of username
      const userExist = await User.findOne({ username });
      const emailExist = await User.findOne({ email });
      if (userExist)
        res.status(201).json({ success: false, message: 'This username already exists' });
      if (emailExist)
        res.status(201).json({ success: false, message: 'This email is already exists' });
      if (!userExist && !emailExist) {
        const hash = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
        const confHash = uuidv1();
        await User.collection.insertOne({
          username, firstname, lastname, picture, email, hash, confHash, confirmed: false
        });
        await sendMail('register', email, confHash);
        res.status(201).json({ success: true, message: 'Check your mail box' });
      }
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  } else {
    res.status(500).json({ message: 'error params' });
  }
}

const login = async (req, res) => {
  if (verifParams(req.body, 2)) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (user) {
        const match = await bcrypt.compare(password, user.hash);
        if (match) {
          if (user.confirmed) {
            const token = await jwt.sign({}, process.env.JWT_SECRET, { expiresIn: '4h' })
            const userInfo = {
              uid: user._id,
              username: user.username,
              firstname: user.firstname,
              lastname: user.lastname,
              picture: user.picture,
              email: user.email,
              list: user.list,
              token,
              lang: user.lang,
              bookmarks: user.bookmarks,
              follows: user.follows
            }
            res.status(201).json({ success: true, user: userInfo, token, message: `Welcome ${user.firstname} ${user.lastname}` });
          } else {
            res.status(201).json({ success: false, message: 'Please confirme your email address' });
          }
        } else {
          res.status(201).json({ success: false, message: 'Wrong password' });
        }
      } else {
        res.status(201).json({ success: false, message: 'This email doesn\'t exists' });
      }
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  } else {
    res.status(500).json({ message: 'error params' });
  }
}

const confirmAccount = async (req, res) => {
  if (verifParams(req.body, 2)) {
    try {
      const { email, confHash } = req.body;
      const user = await User.findOneAndUpdate(
        { email, confHash }, { $set: { confirmed: true } }
      );
      if (user) {
        res.status(201).json({ success: true, message: 'Account confirmed' })
      } else {
        res.status(201).json({ success: false, message: 'This link have been corrupted' });
      }
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  } else {
    res.status(500).json({ message: 'error params' });
  }
}

const resetPasswordReq = async (req, res) => {
  if (verifParams(req.params, 1)) {
    try {
      const email = req.params.email;
      const user = await User.findOne({ email });
      if (user) {
        await sendMail('reset', user.email, user.confHash);
        res.status(201).json({ success: true, message: "Check your mailbox" });
      } else {
        res.status(201).json({ success: false, message: 'Mail doesn\'t find' });
      }
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  } else {
    res.status(500).json({ message: 'error params' });
  }
}

const resetPassword = async (req, res) => {
  const { email, confHash, password } = req.body;
  if (verifParams(req.body, 3) && checkPassword(password)) {
    try {
      // Check password
      const hash = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
      const result = await User.findOneAndUpdate(
        { confHash, email },
        { $set: { hash: hash, confHash: uuidv1() } }
      );
      if (result) {
        res.status(201).json({ success: true, message: 'Password updated successfully' })
      } else {
        res.status(201).json({ success: false, message: 'Invalid mail address' })
      }
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  } else {
    res.status(500).json({ message: 'error params' });
  }
};

const getUserDetails = async (req, res) => {
  if (verifParams(req.params, 1)) {
    try {
      const user = await User.findOne({ _id: req.params.id });
      const bookmarks = (user.bookmarks && user.bookmarks.length > 0) ? await Movie.find({
        _id: { $in: user.bookmarks[0] }
      }) : [];
      if (user && bookmarks) {
        res.status(201).json({
          success: true,
          userDetails: {
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            list: user.list,
            bookmarks: bookmarks,
            picture: user.picture,
            follows: user.follows
          }
        });
      } else {
        res.status(201).json({ success: false, message: `${req.params.id} was not found` });
      }
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  } else {
    res.status(500).json({ message: 'error params' });
  }
}

const uploadAvatar = async (req, res) => {
  if (verifParams(req.body, 2) && checkExtension(req.body.picture)) {
    try {
      await User.findOneAndUpdate(
        { _id: req.body.uid },
        {
          $set: { picture: req.body.picture }
        });
      res.status(201).json({ success: true, message: "Avatar updated successfully" });
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  } else {
    res.status(500).json({ message: 'error params' });
  }
}

const updateNames = async (req, res) => {
  const { uid, username, firstname, lastname } = req.body;
  if (verifParams(req.body, 4) && checkUsername(username) && checkName(firstname) && checkName(lastname)) {
    try {
      const usernameExists = await User.distinct("username", { _id: { $nin: [uid] } });
      if (usernameExists.indexOf(username) === -1) {
        await User.findOneAndUpdate(
          { _id: uid },
          { $set: { username, firstname, lastname } }
        );
        res.status(201).json({ success: true, message: "Names updated successfully" });
      } else {
        res.status(201).json({ success: false, message: "Username already exists" });
      }
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  } else {
    res.status(500).json({ message: 'error params' });
  }
}

const updateLang = async (req, res) => {
  if (verifParams(req.body, 2)) {
    try {
      const { uid, lang } = req.body;
      await User.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(uid) },
        { $set: { lang: lang } }
      );
      res.status(201).json({ success: true, message: "Lang changed" });
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  } else {
    res.status(500).json({ message: 'error params' });
  }
}

const updateEmailReq = async (req, res) => {
  if (verifParams(req.body, 2)) {
    try {
      const { uid, email } = req.body;
      const emailExists = await User.findOne({ email });
      if (!emailExists) {
        const user = await User.findOne({ _id: uid });
        await sendMail('updateMail', email, user.confHash);
        res.status(201).json({ success: true, message: "Check your mailbox to confirm your email" });
      } else {
        res.status(201).json({ success: false, message: "This email already exist in our database" });
      }
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  } else {
    res.status(500).json({ message: 'error params' });
  }
}

const updateEmail = async (req, res) => {
  const { email, confHash } = req.body;
  if (verifParams(req.body, 2) && checkEmail(email)) {
    try {
      const newHash = uuidv1();
      await User.findOneAndUpdate(
        { confHash },
        { $set: { email, newHash } }
      );
      res.status(201).json({ success: true, message: "Mail update successfully" });
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  } else {
    res.status(500).json({ message: 'error params' });
  }
}

const updatePassword = async (req, res) => {
  const { uid, oldPwd, newPwd } = req.body;
  if (verifParams(req.body, 3) && checkPassword(newPwd)) {
    try {
      const user = await User.findOne({ _id: uid });
      const match = await bcrypt.compare(oldPwd, user.hash);
      if (match) {
        const hash = await bcrypt.hash(newPwd, parseInt(process.env.SALT_ROUNDS));
        await User.findOneAndUpdate(
          { _id: uid },
          { $set: { hash: hash } }
        );
        res.status(201).json({ success: true, message: "Password updated successfully" });
      } else {
        res.status(201).json({ success: false, message: "Wrong password" });
      }
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  } else {
    res.status(500).json({ message: 'error params' });
  }
}

const updateBookmark = async (req, res) => {
  if (verifParams(req.body, 2)) {
    try {
      const { bookmarks } = req.body;
      const userId = mongoose.Types.ObjectId(req.body.userId);
      await User.findOneAndUpdate(
        { _id: userId },
        { $set: { bookmarks: bookmarks } }
      );
      res.status(201).json({ success: true, message: "Movie added to bookmark" });
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  } else {
    res.status(500).json({ message: 'error params' });
  }
}

const follow = async (req, res) => {
  if (verifParams(req.body, 2)) {
    const { follows, uid } = req.body;
    try {
      await User.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(uid) },
        { $set: { follows: follows } }
      );
      res.status(201).json({ success: true, message: "New friend" });
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  } else {
    res.status(500).json({ message: 'error params' });
  }
};

const updateList = async (req, res) => {
  if (verifParams(req.body, 2)) {
    try {
      const { idMovie, id } = req.body;
      await User.findOneAndUpdate(
        { _id: id },
        {
          $push: {
            list:
              [{ idMovie: idMovie }]
          }
        });
      res.status(201).json({ success: true, message: "OK" });
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  } else {
    res.status(500).json({ message: 'error params' });
  }
};

const getFollowsDetails = async (req, res) => {
  if (verifParams(req.body, 1)) {
    const { follows } = req.body;
    try {
      const friends = await User.find({
        _id: { $in: follows }
      });
      res.status(201).json({ success: true, friends });
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  } else {
    res.status(500).json({ message: 'error params' });
  }
}

export default {
  register,
  login,
  confirmAccount,
  resetPassword,
  uploadAvatar,
  resetPasswordReq,
  updateBookmark,
  follow,
  getUserDetails,
  getFollowsDetails,
  updateList,
  updateLang,
  updateNames,
  updateEmailReq,
  updateEmail,
  updatePassword
};