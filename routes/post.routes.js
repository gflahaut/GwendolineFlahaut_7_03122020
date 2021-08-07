const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer.config");
const postCtrl = require("../controllers/post.controller");
const mailCtrl= require("../controllers/mail.controller")


// Create Routes
router.post("/create", auth, postCtrl.createPost);
router.post("/mail", auth, mailCtrl.sendMail);
router.post("/like", auth, postCtrl.likePost);

// Read Routes
router.post("/fromUser", auth, postCtrl.getPostsFromUser);
router.get("/all", auth, postCtrl.getAllPost);
router.get("/id/one/", auth, postCtrl.getOnePost);

// Update Routes
router.put("/update", auth, postCtrl.modifyPost);

// Delete Routes
router.delete("/delete/:id", auth, postCtrl.deletePost);

module.exports = router;
