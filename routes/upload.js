const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const Company = require('../models/Company');

const uploadsDir = path.join(require('os').homedir(), 'serviceapp-uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => cb(null, `${req.user.company}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/', auth, upload.single('image'), async (req, res) => {
  const url = `/uploads/${req.file.filename}`;
  await Company.findByIdAndUpdate(req.user.company, { logo: url });
  res.json({ url });
});

module.exports = router;
