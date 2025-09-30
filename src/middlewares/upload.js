const multer = require('multer');

/**
 * Export a factory that returns a multer middleware configured
 * to store uploaded files in the requested Cloudinary folder.
 * Falls back to a local subfolder under ./uploads/<folder> when
 * Cloudinary isn't configured.
 *
 * Usage: const parser = require('../middlewares/upload')('artists');
 */
module.exports = function parserFor(folder = 'artists') {
  try {
    const { CloudinaryStorage } = require('multer-storage-cloudinary');
    const cloudinary = require('../config/cloudinary');

    if (!cloudinary || !cloudinary.config) {
      throw new Error('Cloudinary not configured');
    }

    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: folder,
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      },
    });

    return multer({ storage: storage });
  } catch (err) {
    console.warn('cloudinary storage unavailable, falling back to local disk storage:', err.message);
    const path = require('path');
    const fs = require('fs');

    const uploadDir = path.join(process.cwd(), 'uploads', folder);
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const diskStorage = multer.diskStorage({
      destination: (req, file, cb) => cb(null, uploadDir),
      filename: (req, file, cb) => {
        const ext = require('path').extname(file.originalname);
        const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, name);
      }
    });

    return multer({ storage: diskStorage });
  }
};
