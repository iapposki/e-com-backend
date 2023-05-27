import * as multer from 'multer'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/productImages/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1000000000);
    cb(null, uniqueSuffix + ".png");
  },
});
export const uploads = multer({ storage: storage });
