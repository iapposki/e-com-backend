"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploads = void 0;
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/productImages/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1000000000);
        cb(null, uniqueSuffix + ".png");
    },
});
exports.uploads = multer({ storage: storage });
