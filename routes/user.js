const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('./../models/User');
const { auth, restricTo } = require('./../utils/auth');
const {
  getMe,
  updateMe,
  deleteMe,
  logoutMe,
  logoutAll,
  deleteUser,
} = require('./../controllers/userController');

const router = express.Router();

router.get('/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) throw new Error();

    res.set('Content-type', 'image/png');
    res.status(200).send(user.avatar);
  } catch (error) {
    res.status(400).json();
  }
});

router.use(auth);

router.get('/me', getMe);
router.patch('/me', updateMe);
router.delete('/me', deleteMe);
router.post('/logout', logoutMe);
router.post('/logoutAll', logoutAll);

router.delete('/:id', restricTo('admin'), deleteUser);

// UPLOAD AVATAR
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('File should be image'));
    }
    cb(undefined, true);
  },
});

router.post(
  '/me/avatar',
  auth,
  upload.single('avatar'),
  async (req, res) => {
    try {
      const buffer = await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();
      req.user.avatar = buffer;
      await req.user.save();
      res.status(200).json();
    } catch (e) {
      res.status(500).json();
    }
  },
  (error, req, res, next) => {
    res.status(400).json({ error: error.message });
  }
);

router.delete('/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.status(200).json();
});

module.exports = router;
