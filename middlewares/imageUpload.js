const multer = require('multer');
const path = require('path');

const MIME_TYPES ={
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join('./images/'));
    },
    filename: (req, file, cb) => {
        const extension = MIME_TYPES[file.mimetype];
        cb(null, file.fieldname + '-' + Date.now() + '.' + extension);
    }
});

const fileFilter = (res, file, cb) => {
    if(file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.', 400), false);
    }
}

exports.upload = multer({
    storage: storage,
    fileFilter: fileFilter
})