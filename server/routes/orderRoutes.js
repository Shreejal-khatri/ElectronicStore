const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/product');
const { protect } = require('../middleware/authmiddleware');

//Create a new order
router.post('/', protect, async (req, res) => {
  try {
    const { items, totalPrice } = req.body;
    const userId = req.user._id;

    //Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Order must have at least one item' 
      });
    }

    if (!totalPrice || totalPrice <= 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Total price must be a positive number' 
      });
    }

    //Check product availability and validate items
    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({ 
          success: false,
          message: 'Each item must have a product ID and valid quantity' 
        });
      }

      //Check if product exists
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ 
          success: false,
          message: `Product with ID ${item.productId} not found` 
        });
      }

      //Check if there's enough stock
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false,
          message: `Insufficient stock for product: ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
        });
      }
    }

    //Create the order
    const order = new Order({
      items,
      totalPrice,
      userId
    });

    //Save the order
    const savedOrder = await order.save();

    //Update product stock quantities
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
    }

    //Populate the order details for response
    await savedOrder.populate('userId', 'name email');
    await savedOrder.populate('items.productId', 'name price');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: savedOrder
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while creating order', 
      error: error.message 
    });
  }
});

//Get all orders for the authenticated user
router.get('/my-orders', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const orders = await Order.find({ userId })
      .populate('items.productId', 'name price imageUrl')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching orders', 
      error: error.message 
    });
  }
});

//Get a specific order by ID 
router.get('/:id', protect, async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user._id;

    const order = await Order.findOne({ _id: orderId, userId })
      .populate('items.productId', 'name price imageUrl')
      .populate('userId', 'name email');

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching order', 
      error: error.message 
    });
  }
});


router.delete('/:id', protect, async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user._id;

    //Find the order first to check ownership and get order details
    const order = await Order.findOne({ _id: orderId, userId })
      .populate('items.productId', 'name price stock');

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found or you do not have permission to cancel it' 
      });
    }

    //Check if order can be cancelled 
    const cancellableStatuses = ['pending', 'processing'];
    const orderStatus = order.status || 'processing';
    
    if (!cancellableStatuses.includes(orderStatus.toLowerCase())) {
      return res.status(400).json({ 
        success: false,
        message: `Cannot cancel order with status: ${orderStatus}. Only orders with status 'pending' or 'processing' can be cancelled.` 
      });
    }

    //Restore product stock quantities before deleting the order
    for (const item of order.items) {
      if (item.productId && item.productId._id) {
        await Product.findByIdAndUpdate(
          item.productId._id,
          { $inc: { stock: item.quantity } }, //Add the quantity back to stock
          { new: true }
        );
      }
    }

    //Delete the order
    await Order.findByIdAndDelete(orderId);

    res.json({
      success: true,
      message: 'Order cancelled successfully and stock quantities have been restored'
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while cancelling order', 
      error: error.message 
    });
  }
});

module.exports = router;