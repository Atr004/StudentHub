import express from "express";
import {upload} from "../middleware/upload.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",protect, upload.single("file"), (req,res) =>{
    return res.json({
        success: true,
        fileUrl :`/uploads/${req.file.filename}`
    });
});

export default router;
