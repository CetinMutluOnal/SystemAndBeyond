import multer from 'multer';

const userStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/users/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()} - ${file.originalname}`);
    }
});

const postCoverStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/posts/covers/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()} - ${file.originalname}`);
    }
});

const userImageUpload = multer({ storage: userStorage });
const postCoverImageUpload = multer({ 
    storage: postCoverStorage,
    limits: 5*1024*1024,
});
export default {
    userImageUpload,
    postCoverImageUpload,
}