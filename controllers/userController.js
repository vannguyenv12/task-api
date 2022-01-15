const { sendCancelEmail } = require('./../utils/send-mail');

const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

const updateMe = async (req, res) => {
  try {
    const keysUpdate = Object.keys(req.body);

    keysUpdate.forEach((field) => (req.user[field] = req.body[field]));
    await req.user.save();
    res.status(200).json(req.user);
  } catch (error) {
    res.status(400).json(error);
  }
};

const deleteMe = async (req, res) => {
  try {
    sendCancelEmail(req.user.email, req.user.name);
    await req.user.remove();
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const logoutMe = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.status(200).json();
  } catch (error) {
    res.status(400).json();
  }
};

const logoutAll = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).json();
  } catch (error) {
    res.status(400).json();
  }
};

// UPLOAD AVATAR

module.exports = {
  getMe,
  updateMe,
  deleteMe,
  logoutMe,
  logoutAll,
};
