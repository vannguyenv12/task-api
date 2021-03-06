const jwt = require('jsonwebtoken');
const User = require('./../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace('Bearer ', '');
    if (!token) throw new Error();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) throw new Error();

    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });

    if (!user) throw new Error();

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authentication' });
  }
};

const restricTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          error:
            'You do not permission to use this route! Please use route /delete/me',
        });
    }
    next();
  };
};

module.exports = { auth, restricTo };
