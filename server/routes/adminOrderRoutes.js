const express = require('express');
const Order = require('../models/Order');
const { protect, authorize } = require('../middleware/authmiddleware');

const router = express.Router();

//Get all orders - Admin only
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'name email')
      .populate('items.productId', 'name price imageUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      orders: orders 
    });
  } catch (error) {
    console.error('Admin get orders error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching orders' 
    });
  }
});

//Update order status - Admin only
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate('userId', 'name email')
     .populate('items.productId', 'name price imageUrl');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating order status'
    });
  }
});

//Get single order - Admin only
router.get('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('items.productId', 'name price imageUrl');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      order: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching order'
    });
  }
});

module.exports = router;