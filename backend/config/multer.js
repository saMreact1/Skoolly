const multer = require('multer');
const path = require('path');
const fs = require('fs');

const logoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = path.join(__dirname, '../uploads/logos');
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, filename);
  },
});

const uploadLogo = multer({ storage: logoStorage });

module.exports = uploadLogo;
