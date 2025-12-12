const express = require("express");
const {
  generateInvoice,
  getInvoiceById,
  getAllInvoices,
  updatePaymentStatus,
} = require("../controllers/invoiceController");
const auth = require("../middlewares/auth");
const router = express.Router();

// ----------------------------------------------------
// THAY ĐỔI THỨ TỰ:
// 1. Khai báo các route CỐ ĐỊNH (fixed paths) trước.
// 2. Khai báo các route BIẾN ĐỘNG (params paths, như /:id) sau.
// ----------------------------------------------------

// 1. Route CỐ ĐỊNH (READ ALL) - Phải đặt trước /:id
router.get("/admin", auth, getAllInvoices);
router.post("/admin/generate/:bookingId", auth, generateInvoice);
router.put("/admin/:id/status", auth, updatePaymentStatus); // Vẫn đặt ở đây

// 2. Route BIẾN ĐỘNG (READ ONE) - Phải đặt cuối cùng
router.get("/:id", auth, getInvoiceById);

module.exports = router;
