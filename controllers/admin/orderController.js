const Order = require('../../models/orderSchema')

const loadOrders =async (req,res) => {

  const page = parseInt(req.query.page) || 1;
  
  const limit = 10; 
  const skip = (page - 1) * limit;

   const totalOrders = await Order.countDocuments();
    const totalPages = Math.ceil(totalOrders / limit);

  const allOrder = await Order.find().sort({ createdOn: -1 }) 
      .skip(skip)
      .limit(limit)
      .lean().populate('userId') 
  const orderStatuses = [
  "Processing",
  "Shipped",
  "Out for delivery",
  "Delivered",
  "Cancelled",
  "Returned",
  "ReturnRequested",
  "ReturnRejected",
   ];

const orderStatusFlow = {
  Processing: ["Shipped", "Cancelled"],
  Shipped: ["Out for delivery", "Cancelled"],
  "Out for delivery": ["Delivered", "Cancelled"],
  Delivered: ["ReturnRequested"],
  ReturnRequested: ["Returned", "ReturnRejected"],
  Returned: [],       
  ReturnRejected: [],  
  Cancelled: []   
}

    try {
        res.render('admin/order',{order:allOrder,orderStatuses,orderStatusFlow,currentPage: page,
      totalPages,})
    } catch (error) {
        
    }
    
}

const updatedOrder = async (req,res) => {
    try {
         const { status } = req.body;
    const { id } = req.params;
    

    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus: status },
      { new: true }
    );

  

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });

    } catch (error) {
         console.log("Update status error:", error );
    res.status(500).json({ success: false, message: "Server error" });
    }
    
}


const loadOrderDetails = async (req,res) => {
    try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate('orderedItems.productId').populate('userId');  ;
    if (!order) {
      return res.status(404).send('Order not found');
    }
    res.render('admin/orderDetails', { order }); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
    
}

module.exports ={
    loadOrders,
    updatedOrder,
    loadOrderDetails
}