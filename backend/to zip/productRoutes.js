const multer = require("multer");
const path = require("path");
const fs = require("fs");
const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  softDeleteProduct,
} = require("../controllers/productController");

// Set up Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../public/uploads");
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.floor(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", upload.single("video"), addProduct);
router.put("/:id", upload.single("video"), updateProduct);
router.delete("/:id", softDeleteProduct);

module.exports = router;
