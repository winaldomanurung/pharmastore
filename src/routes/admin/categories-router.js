const express = require("express");
const router = express.Router();

const { adminCategoryController } = require("../../controllers");

router.get("/", adminCategoryController.readCategories);
router.post("/create", adminCategoryController.createCategory);
router.delete("/:categoryId/delete", adminCategoryController.deleteCategory);
router.patch("/:categoryId/update", adminCategoryController.updateCategory);

module.exports = router;
