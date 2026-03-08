const Order = require('../../models/orderSchema')

const loadOrders = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";   // ✅ search query
    const limit = 10;
    const skip = (page - 1) * limit;

    // 🔎 Search filter
    let filter = {};

    if (search) {
      filter = {
        $or: [
          { orderId: { $regex: search, $options: "i" } },
          { "address.name": { $regex: search, $options: "i" } }
        ]
      };
    }

    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limit);

    const allOrder = await Order.find(filter)
      .sort({ createdOn: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .populate("userId");

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
      Cancelled: [],
    };

    res.render("admin/order", {
      order: allOrder,
      orderStatuses,
      orderStatusFlow,
      currentPage: page,
      totalPages,
      search
    });

  } catch (error) {
    console.log(error);
  }
};

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

const loadProductReturn = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    const status = req.query.status || "";

    let filter = {
      "returnRequest.isRequested": true
    };

    // 🔎 Search
    if (search) {
      filter.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { "address.name": { $regex: search, $options: "i" } }
      ];
    }

    // 🎛 Status Filter
    if (status === "Approved") filter.orderStatus = "Returned";
    if (status === "Rejected") filter.orderStatus = "ReturnRejected";
    if (status === "Pending") filter.orderStatus = "ReturnRequested";

    const total = await Order.countDocuments(filter);

    const returns = await Order.find(filter)
      .populate("userId")
      .sort({ createdOn: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.render("admin/productReturn", {
      returns,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      selectedStatus: status,
      search
    });

  } catch (error) {
    console.log(error);
    res.redirect("/admin");
  }
};
const updateReturnStatus = async (req,res) => {}

const approveReturn = async(req,res)=>{
    
await Order.findByIdAndUpdate(req.params.id,{
orderStatus:"Returned"
})

res.json({success:true})

}

const rejectReturn = async(req,res)=>{

await Order.findByIdAndUpdate(req.params.id,{
orderStatus:"ReturnRejected"
})

res.json({success:true})

}

module.exports ={
    loadOrders,
    updatedOrder,
    loadOrderDetails,
    loadProductReturn,
    updateReturnStatus,
    approveReturn,
    rejectReturn
}