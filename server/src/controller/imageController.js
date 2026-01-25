import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Create directory if it doesn't exist
        const uploadDir = path.join(__dirname, '../../../cdn/images/products');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

/**
 * Upload single image
 * POST /api/images/upload
 */
export const uploadImage = (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Generate URL path (relative to CDN root)
        const imagePath = `/images/products/${req.file.filename}`;

        res.json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                size: req.file.size,
                imagePath: imagePath,
                url: `http://localhost:5001/cdn${imagePath}`
            }
        });
    });
};

/**
 * Upload multiple images
 * POST /api/images/upload-multiple
 */
export const uploadMultipleImages = (req, res) => {
    upload.array('images', 10)(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        const imagePaths = req.files.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
            imagePath: `/images/products/${file.filename}`,
            url: `http://localhost:5001/cdn/images/products/${file.filename}`
        }));

        res.json({
            success: true,
            message: `${req.files.length} images uploaded successfully`,
            data: imagePaths
        });
    });
};

/**
 * Delete image
 * DELETE /api/images/:filename
 */
export const deleteImage = (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(__dirname, '../../../cdn/images/products', filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({
                success: true,
                message: 'Image deleted successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting image'
        });
    }
};

/**
 * Get all images
 * GET /api/images
 */
export const getAllImages = (req, res) => {
    try {
        const imagesDir = path.join(__dirname, '../../../cdn/images/products');

        if (!fs.existsSync(imagesDir)) {
            return res.json({
                success: true,
                data: []
            });
        }

        const files = fs.readdirSync(imagesDir);
        const images = files
            .filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
            })
            .map(file => ({
                filename: file,
                url: `http://localhost:5001/cdn/images/products/${file}`,
                path: `/images/products/${file}`
            }));

        res.json({
            success: true,
            count: images.length,
            data: images
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching images'
        });
    }
};
