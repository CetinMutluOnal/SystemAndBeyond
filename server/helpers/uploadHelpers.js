import multer from 'multer';

const userStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/users/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const userImageUpload = multer({ storage: userStorage });
export default userImageUpload;