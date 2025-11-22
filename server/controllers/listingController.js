import Listing from "../models/Listing.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

// ------------------------------
// CREATE LISTING (with image upload)
// ------------------------------
export const createListing = asyncHandler(async (req, res) => {
  const { title, description, category, condition, price, location } = req.body;

  if (!title || !description || !price) {
    const error = new Error("Title, description and price are required");
    error.statusCode = 400;
    throw error;
  }

  const images = req.files ? req.files.map(file => file.path) : [];

  const listing = await Listing.create({
    user: req.user._id,
    title,
    description,
    category,
    condition,
    price,
    location,
    images,
  });

  res.status(201).json({ success: true, listing });
});

// ------------------------------
// GET ALL LISTINGS (search + filters + sorting)
// ------------------------------
export const getAllListings = asyncHandler(async (req, res) => {
  const { search, category, minPrice, maxPrice, location, sort, page = 1, limit = 10 } = req.query;

  const currentPage = Number(page);
  const perPage = Number(limit);

  let query = {};

  // --- Search ----
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // --- Category ---
  if (category) query.category = category;

  // --- Price Range ---
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // --- Location ---
  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  // --- Sorting ---
  let sortOption = { createdAt: -1 }; // newest first (default)
  if (sort === "oldest") sortOption = { createdAt: 1 };
  if (sort === "price_low") sortOption = { price: 1 };
  if (sort === "price_high") sortOption = { price: -1 };

  const skip = (currentPage - 1) * perPage;
  const total = await Listing.countDocuments(query);

  const listings = await Listing.find(query)
    .populate("user", "name email")
    .sort(sortOption)
    .skip(skip)
    .limit(perPage);

  res.status(200).json({
    success: true,
    total,
    totalPages: Math.ceil(total / perPage),
    currentPage,
    count: listings.length,
    listings,
  });
});

// ------------------------------
// GET SINGLE LISTING
// ------------------------------
export const getListingById = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate("user", "name email");

  if (!listing) {
    const error = new Error("Listing not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({ success: true, listing });
});

// ------------------------------
// UPDATE LISTING
// ------------------------------
export const updateListing = asyncHandler(async (req, res) => {
  let listing = await Listing.findById(req.params.id);

  if (!listing) {
    const error = new Error("Listing not found");
    error.statusCode = 404;
    throw error;
  }

  if (listing.user.toString() !== req.user._id.toString()) {
    const error = new Error("Not authorized");
    error.statusCode = 403;
    throw error;
  }

  const updates = req.body;

  // handle new image uploads
  if (req.files && req.files.length > 0) {
    updates.images = req.files.map(file => file.path);
  }

  listing = await Listing.findByIdAndUpdate(req.params.id, updates, { new: true });

  res.status(200).json({ success: true, listing });
});

// ------------------------------
// DELETE LISTING
// ------------------------------
export const deleteListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    const error = new Error("Listing not found");
    error.statusCode = 404;
    throw error;
  }

  if (listing.user.toString() !== req.user._id.toString()) {
    const error = new Error("Not authorized");
    error.statusCode = 403;
    throw error;
  }

  await listing.deleteOne();

  res.status(200).json({ success: true, message: "Listing deleted" });
});
