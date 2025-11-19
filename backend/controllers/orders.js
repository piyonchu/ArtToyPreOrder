const Order = require('../models/Order');
const ArtToy = require('../models/ArtToy');

// @desc    Get all orders (admin) or own orders (member)
// @route   GET /orders
// @access  Private (Admin/Member)
exports.getOrders = async (req, res) => {
  try {
    let query = req.user.role === 'admin' ? {} : { user: req.user.id };
    let populate = req.user.role === 'admin' ? ['user', 'artToy'] : ['artToy'];
    
    const orders = await Order.find(query)
      .populate(populate)
      .sort({ createdAt: -1 }); // Sort by newest first
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders.map(order => ({
        ...order.toObject(),
        artToy: {
          _id: order.artToy._id,
          sku: order.artToy.sku,
          name: order.artToy.name,
          description: order.artToy.description,
          arrivalDate: order.artToy.arrivalDate,
          availableQuota: order.artToy.availableQuota,
          posterPicture: order.artToy.posterPicture,
          price: order.artToy.price, // Original price
          discountedPrice: calculateDiscountedPrice(order.artToy.price, order.artToy.discountPercentage)
        }
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Helper function to calculate discounted price
function calculateDiscountedPrice(price, discountPercentage) {
  if (discountPercentage && discountPercentage > 0) {
    return price - (price * (discountPercentage / 100));
  }
  return price; // No discount
}

// @desc    Get single order
// @route   GET /orders/:id
// @access  Private (Admin/Member - own orders only)
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('artToy')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order not found with id of ${req.params.id}`
      });
    }

    // Ensure the user is the order owner or admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...order.toObject(),
        artToy: {
          _id: order.artToy._id,
          sku: order.artToy.sku,
          name: order.artToy.name,
          description: order.artToy.description,
          arrivalDate: order.artToy.arrivalDate,
          availableQuota: order.artToy.availableQuota,
          posterPicture: order.artToy.posterPicture,
          price: order.artToy.price,
          discountedPrice: calculateDiscountedPrice(order.artToy.price, order.artToy.discountPercentage)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create new order
// @route   POST /orders
// @access  Private (Member only)
exports.createOrder = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    // Check if art toy exists and has enough quota
    const artToy = await ArtToy.findById(req.body.artToy);
    if (!artToy) {
      return res.status(404).json({
        success: false,
        message: `Art toy not found with id of ${req.body.artToy}`
      });
    }

    // Check if order amount is within quota
    if (req.body.orderAmount > artToy.availableQuota) {
      return res.status(400).json({
        success: false,
        message: 'Order amount exceeds available quota'
      });
    }

    // Check if order amount is between 1 and 5
    if (req.body.orderAmount < 1 || req.body.orderAmount > 5) {
      return res.status(400).json({
        success: false,
        message: 'Order amount must be between 1 and 5'
      });
    }

    // Calculate total price based on discounted price if applicable
    const discountedPrice = calculateDiscountedPrice(artToy.price, artToy.discountPercentage);
    req.body.totalPrice = discountedPrice * req.body.orderAmount;

    // Create order
    const order = await Order.create(req.body);

    // Update art toy quota
    artToy.availableQuota -= req.body.orderAmount;
    await artToy.save();

    // Get fully populated order
    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('artToy');

    res.status(201).json({
      success: true,
      data: populatedOrder
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You already have an order for this art toy'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete order
// @route   DELETE /orders/:id
// @access  Private (Admin can delete any, member can only delete their own)
exports.deleteOrder = async (req, res) => {
  try {
    let query = { _id: req.params.id };
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    const order = await Order.findOne(query);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const artToy = await ArtToy.findById(order.artToy);
    // Restore quota
    artToy.availableQuota += order.orderAmount;
    await artToy.save();

    await Order.deleteOne({ _id: order._id });

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update order
// @route   PUT /orders/:id
// @access  Private (Admin: any order, Member: own order)
exports.updateOrder = async (req, res) => {
  try {
    let query = { _id: req.params.id };
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    const order = await Order.findOne(query);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const artToy = await ArtToy.findById(order.artToy);
    // Restore previous quota
    artToy.availableQuota += order.orderAmount;

    // Check new order amount
    const { orderAmount } = req.body;

    // Validate order amount (1-5)
    if (orderAmount < 1 || orderAmount > 5) {
      return res.status(400).json({
        success: false,
        message: 'Order amount must be between 1 and 5'
      });
    }

    if (orderAmount > artToy.availableQuota) {
      return res.status(400).json({
        success: false,
        message: 'Not enough quota available'
      });
    }

    order.orderAmount = orderAmount;

    // Calculate total price based on discounted price
    const discountedPrice = calculateDiscountedPrice(artToy.price, artToy.discountPercentage);
    order.totalPrice = discountedPrice * orderAmount;
    await order.save();
    
    artToy.availableQuota -= orderAmount;
    await artToy.save();

    // Get fully populated updated order
    const updatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('artToy');

    res.json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
