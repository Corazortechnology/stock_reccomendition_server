const express = require("express");
const { dataUpload } = require("../../../Controllers/dataUpload");
const router = express.Router();
const multer = require("multer");


// for storing file in local folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploads")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })


// rout for uploading csv file 
router.post("/data/upload/csv", upload.single("file"), dataUpload)

module.exports = router; 