import express from "express";
import { listingLimiter } from "../middleware/rateLimiter.js";
import asyncHandler from "express-async-handler";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

import {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
} from "../controllers/listingController.js";

const router = express.Router();

// CREATE LISTING (with rate limiting + image upload)
router.post(
  "/",
  protect,
  listingLimiter,
  upload.array("images", 5),
  createListing
);

// GET all listings
router.get("/", getAllListings);

// GET single listing
router.get("/:id", getListingById);

// UPDATE listing
router.put(
  "/:id",
  protect,
  upload.array("images", 5),
  updateListing
);

// DELETE listing
router.delete("/:id", protect, deleteListing);

export default router;
