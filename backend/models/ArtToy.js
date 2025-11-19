const mongoose = require('mongoose');

const ArtToySchema = new mongoose.Schema({
  sku: {
    type: String,
    required: [true, "Please add a SKU"],
    unique: true,
    trim: true,
    index: true, // Index for quick look-up
  },
  price: {
    type: Number,
    min: [1, "Price must be greater than 0"],
    required: [true, "Please add a price"],
  },
  discountPercentage: {
    type: Number,
    min: [0, "Discount percentage must be between 1 and 99"],
    max: [99, "Discount percentage must be between 1 and 99"],
    default: 0, // Default discount percentage is 0
  },
  rating: {
    type: Number,
    min: [0, "Rating cannot be less than 0"],
    max: [5, "Rating cannot be greater than 5"],
    default: 0,
    index: true, // Index for faster rating queries
  },
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  arrivalDate: {
    type: Date,
    required: [true, "Please add an arrival date"],
    index: true, // Index for searching by arrival date
  },
  availableQuota: {
    type: Number,
    required: [true, "Please add available quota"],
    min: [0, "Available quota cannot be negative"],
  },
  posterPicture: {
    type: String,
    required: [true, "Please add a poster picture URL"],
  },
  images: {
    type: [String],
    required: true,
  },
  tags: {
    type: [String],
    required: true,
    index: true, // Index to make searching by tags efficient
  },
}, {
  timestamps: true,
});

ArtToySchema.index({ tags: 'text' });


ArtToySchema.virtual('discountedPrice').get(function() {
  if (this.discountPercentage > 0) {
    return this.price - (this.price * this.discountPercentage / 100);
  }
  return this.price;
});


ArtToySchema.pre('save', function(next) {
  if (this.discountPercentage > 0) {
    this.discountedPrice = this.price - (this.price * this.discountPercentage / 100);
  }
  next();
});

module.exports = mongoose.model("ArtToy", ArtToySchema);
