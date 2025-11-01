const express = require("express");
const bookRouter = require("../books/routes/bookController");
const userRouter = require("../users/routes/userRestController");
const { handleError } = require("../utils/handleErrors");

const router = express.Router();

router.use("/books", bookRouter);
router.use("/users", userRouter);

// 404 for unknown routes under /api
router.use((req, res) => handleError(res, 404, "Route not found"));

module.exports = router; 
