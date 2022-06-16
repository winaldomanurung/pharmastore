const express = require("express");
const router = express.Router();

const { adminProductController } = require("../../controllers");

router.get("/", adminProductController.getAdmin);
router.post("/product/create", adminProductController.createProduct);
router.get("/products", adminProductController.readProducts);
router.get(
  "/products/sort/by-price/:order",
  adminProductController.sortProducts
);
router.get("/products/search", adminProductController.searchProducts);
router.get("/product/:productId", adminProductController.readProductById);
router.delete(
  "/product/:productId/delete",
  adminProductController.deleteProduct
);
router.patch(
  "/product/:productId/update",
  adminProductController.updateProduct
);

module.exports = router;
