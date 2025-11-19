const ArtToy = require('../models/ArtToy');
const dayjs = require('dayjs');

// @desc    Get all art toys
// @route   GET /api/v1/arttoys
// @access  Public
// exports.getArtToys = async (req, res) => {
//   try {
//     const artToys = await ArtToy.find();
//     res.json({
//       success: true,
//       count: artToys.length,
//       data: artToys
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'Server Error'
//     });
//   }
// };
exports.getArtToys = async (req, res) => {
  const {
    rating,
    discountPercentage,
    arrivalDate,
    availableQuota,
    createdAt,
    price,
    tags,
  } = req.query;

  const filters = {};


  if (rating) {
    filters.rating = { $gte: Number(rating) }; 
  }


  if (discountPercentage) {
    filters.discountPercentage = { $gte: Number(discountPercentage) };
  }


  if (arrivalDate) {
    const arrivalDateObj = new Date(arrivalDate);
    filters.arrivalDate = { $gte: arrivalDateObj };
  }

  if (availableQuota) {
    filters.availableQuota = { $gte: Number(availableQuota) };
  }

  if (createdAt) {
    const createdAtObj = new Date(createdAt);
    filters.createdAt = { $gte: createdAtObj };
  }

  if (price) {
    filters.price = { $lte: Number(price) };
  }


  if (tags) {
    const tagArray = tags.split(',');
    filters.tags = { $in: tagArray };
  }

  try {
    const artToys = await ArtToy.find(filters);

    if (artToys.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No art toys found with the given filters',
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
      message: 'Server Error',
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
        message: 'Art Toy not found'
      });
    }
    res.json({
      success: true,
      data: artToy
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Art Toy not found - Invalid ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Create art toy
// @route   POST /api/v1/arttoys
// @access  Admin
exports.createArtToy = async (req, res) => {
  const { sku, name, description, arrivalDate, availableQuota, posterPicture, tags, discountPercentage, price } = req.body;

  // Validate arrival date
  if (dayjs(arrivalDate).isBefore(dayjs(), 'day')) {
    return res.status(400).json({
      success: false,
      message: 'Arrival date cannot be earlier than current date'
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
      images
    });

    res.status(201).json({
      success: true,
      data: artToy
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update art toy
// @route   PUT /api/v1/arttoys/:id
// @access  Admin
exports.updateArtToy = async (req, res) => {
  const { arrivalDate, tags, discountPercentage, price } = req.body;

  // Validate arrival date if it's being updated
  if (arrivalDate && dayjs(arrivalDate).isBefore(dayjs(), 'day')) {
    return res.status(400).json({
      success: false,
      message: 'Arrival date cannot be earlier than current date'
    });
  }

  // Update the art toy document
  try {
    const artToy = await ArtToy.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!artToy) {
      return res.status(404).json({
        success: false,
        message: 'Art Toy not found'
      });
    }

    res.json({
      success: true,
      data: artToy
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
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
        message: 'Art Toy not found'
      });
    }

    res.json({
      success: true,
      message: 'Art Toy deleted'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
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
      message: 'Please provide tags to search for'
    });
  }

  const tagArray = tags.split(','); // Convert the comma-separated string into an array of tags

  try {
    const artToys = await ArtToy.find({
      tags: { $in: tagArray }
    });

    if (artToys.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No art toys found with the given tags'
      });
    }

    res.json({
      success: true,
      count: artToys.length,
      data: artToys
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};
