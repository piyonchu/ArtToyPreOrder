const ArtToy = require("../models/ArtToy");
const dayjs = require("dayjs");

// @desc    Get all art toys
// @route   GET /api/v1/arttoys
// @access  Public
exports.getArtToys = async (req, res) => {
  const {
    rating,
    discountPercentage,
    arrivalDate,
    availableQuota,
    createdAt,
    price,
    tags,
    sortField,
    sortOrder,
    search,
  } = req.query;

  try {
    const pipeline = [];

    // --- 1. SEARCH STAGE (Must be first) ---
    if (search) {
      pipeline.push({
        $search: {
          index: "artToySearchIndex", // <--- UPDATED: Matches your actual Index Name
          compound: {
            should: [
              {
                text: {
                  query: search,
                  path: "name",
                  score: { boost: { value: 3 } }, // Boost matches in Name
                  fuzzy: {
                    maxEdits: 1, // Allows 1 typo (e.g. "Hutao" -> "Hu Tao")
                    prefixLength: 2, // First 2 letters must match
                  },
                },
              },
              {
                text: {
                  query: search,
                  path: "tags",
                  fuzzy: {
                    maxEdits: 1,
                    prefixLength: 2,
                  },
                },
              },
            ],
            minimumShouldMatch: 1, // At least one condition must allow the match
          },
        },
      });
    }

    // --- 2. FILTER STAGE (Standard Filters) ---
    const matchStage = {};

    if (rating) matchStage.rating = { $gte: Number(rating) };
    if (discountPercentage) matchStage.discountPercentage = { $gte: Number(discountPercentage) };
    if (availableQuota) matchStage.availableQuota = { $gte: Number(availableQuota) };
    if (price) matchStage.price = { $lte: Number(price) };

    if (arrivalDate) {
      matchStage.arrivalDate = { $gte: new Date(arrivalDate) };
    }
    if (createdAt) {
      matchStage.createdAt = { $gte: new Date(createdAt) };
    }
    if (tags) {
      const tagArray = tags.split(",");
      matchStage.tags = { $in: tagArray };
    }

    // Add match stage only if filters exist
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // --- 3. SORT STAGE ---
    if (sortField && sortOrder) {
      const sortDirection = sortOrder === "asc" ? 1 : -1;
      pipeline.push({ $sort: { [sortField]: sortDirection } });
    } else if (search) {
      // If searching without specific sort, showing "Search Score" is helpful for debugging
      // pipeline.push({ $addFields: { score: { $meta: "searchScore" } } });
    }

    // --- 4. EXECUTE ---
    // Important: Use aggregate(), not find()
    const artToys = await ArtToy.aggregate(pipeline);

    if (artToys.length === 0) {
      return res.status(200).json({ // Return 200 even if empty, easier for frontend
        success: true,
        count: 0,
        data: [],
        message: "No art toys found",
      });
    }

    res.json({
      success: true,
      count: artToys.length,
      data: artToys,
    });

  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get single art toy
// @route   GET /api/v1/arttoys/:id
// @access  Public
exports.getArtToy = async (req, res) => {
  try {
    const artToy = await ArtToy.findById(req.params.id);
    if (!artToy) {
      return res.status(404).json({
        success: false,
        message: "Art Toy not found",
      });
    }
    res.json({
      success: true,
      data: artToy,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Art Toy not found - Invalid ID",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Create art toy
// @route   POST /api/v1/arttoys
// @access  Admin
exports.createArtToy = async (req, res) => {
  const {
    sku,
    name,
    description,
    arrivalDate,
    availableQuota,
    posterPicture,
    tags,
    discountPercentage,
    price,
    images,
  } = req.body;

  // Validate arrival date
  if (dayjs(arrivalDate).isBefore(dayjs(), "day")) {
    return res.status(400).json({
      success: false,
      message: "Arrival date cannot be earlier than current date",
    });
  }

  // Create new art toy document
  try {
    const artToy = await ArtToy.create({
      sku,
      name,
      description,
      arrivalDate,
      availableQuota,
      posterPicture,
      tags,
      discountPercentage,
      price,
      images,
    });

    res.status(201).json({
      success: true,
      data: artToy,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Update art toy
// @route   PUT /api/v1/arttoys/:id
// @access  Admin
exports.updateArtToy = async (req, res) => {
  const { arrivalDate, tags, discountPercentage, price } = req.body;

  // Validate arrival date if it's being updated
  if (arrivalDate && dayjs(arrivalDate).isBefore(dayjs(), "day")) {
    return res.status(400).json({
      success: false,
      message: "Arrival date cannot be earlier than current date",
    });
  }

  // Update the art toy document
  try {
    const artToy = await ArtToy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!artToy) {
      return res.status(404).json({
        success: false,
        message: "Art Toy not found",
      });
    }

    res.json({
      success: true,
      data: artToy,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Delete art toy
// @route   DELETE /api/v1/arttoys/:id
// @access  Admin
exports.deleteArtToy = async (req, res) => {
  try {
    const artToy = await ArtToy.findByIdAndDelete(req.params.id);

    if (!artToy) {
      return res.status(404).json({
        success: false,
        message: "Art Toy not found",
      });
    }

    res.json({
      success: true,
      message: "Art Toy deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// @desc    Search for art toys by tags
// @route   GET /api/v1/arttoys/search
// @access  Public
exports.searchArtToysByTags = async (req, res) => {
  const { tags } = req.query; // tags should be passed as a comma-separated string

  if (!tags) {
    return res.status(400).json({
      success: false,
      message: "Please provide tags to search for",
    });
  }

  const tagArray = tags.split(","); // Convert the comma-separated string into an array of tags

  try {
    const artToys = await ArtToy.find({
      tags: { $in: tagArray },
    });

    if (artToys.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No art toys found with the given tags",
      });
    }

    res.json({
      success: true,
      count: artToys.length,
      data: artToys,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
