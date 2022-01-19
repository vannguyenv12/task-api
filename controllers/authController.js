const crypto = require('crypto');
const User = require('./../models/User');
const { sendWelcomeEmail, sendEmail } = require('./../utils/send-mail');

const registerUser = async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    await user.save();
    sendWelcomeEmail(user.email, user.username);
    const token = await user.generateToken();
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateToken();
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      throw new Error('There is no user with email');
    }

    const resetToken = user.createPasswordResetToken();
    console.log(resetToken);
    await user.save();

    // Send token to email
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/auth/resetPassword/${resetToken}`;

    const message = `Please click link ${resetUrl} with PATCH method to reset the new password (valid for 10 minutes). If you don't forget password, please ignore this message`;
    sendEmail(user.email, message);

    res.status(200).json({
      message: 'Email sent',
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error('Token is invalid or expired! Please try again');
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const token = await user.generateToken();
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
