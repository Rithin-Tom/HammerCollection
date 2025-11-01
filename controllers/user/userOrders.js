const User = require('../../models/userSchema')
const Orders = require('../../models/orderSchema')
const Products = require('../../models/productSchema')
const fs = require('fs')
const path = require('path')
const PDFDocument=require('pdfkit')
const Order = require('../../models/orderSchema')

const loadOrders = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const user = await User.findById(userId);

   
    const page = parseInt(req.query.page) || 1; 
    const limit = 5;
    const skip = (page - 1) * limit;

  
    const totalOrders = await Orders.countDocuments({ userId });

    
    const orders = await Orders.find({ userId })
      .populate({ path: "orderedItems.productId", model: "Product" })
      .sort({ createdOn: -1 }) 
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPages = Math.ceil(totalOrders / limit);

    res.render("user/orders", {
      user,
      orders,
      currentPage: page,
      totalPages
    });
  } catch (error) {
    console.error("Load orders error:", error);
    res.status(500).send("Server error");
  }
};

const loadOrderDeatils =async (req,res) => {
    try {
         const userId = req.session.user._id;
          const orderId = req.params.orderId;
          
        const user = await User.findById(userId);

     const orders = await Orders.findOne({ orderId }).populate({ path: "orderedItems.productId", model: "Product" })
     

         res.render('user/orderDetail',{user,orders})
        
    } catch (error) {
        
    }
    
}

const cancelOrder = async (req,res) => {
    try {
       const {orderId,reason} = req.body;
      const order = await Orders.findByIdAndUpdate({ _id:orderId },{  orderStatus: "Cancelled",cancellation: {
          isRequested: true,
          reason: reason,
          requestedAt: new Date(),
        },} ,{ new: true })

       

        if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

      for (const item of order.orderedItems) {
      await Products.findByIdAndUpdate(
        item.productId,
        { $inc: { quantity: item.quantity } },
        { new: true }
      );
    }

    res.json({ success: true, order });

    } catch (error) {
        
    }
    
}

const returnProduct =async (req,res) => {
  try {
     const {orderId,reason} = req.body;
      const order = await Orders.findByIdAndUpdate({ _id:orderId },{  orderStatus: "Returned",returnRequest: {
          isRequested: true,
          reason: reason,
          requestedAt: new Date(),
        },} ,{ new: true })

       

        if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

      for (const item of order.orderedItems) {
      await Products.findByIdAndUpdate(
        item.productId,
        { $inc: { quantity: item.quantity } },
        { new: true }
      );
    }

    res.json({ success: true, order });

    
  } catch ( error) {
    
  }
  
}


const downloadInvoice =async (req,res) => {
 
  try {
    const userId = req.session.user._id;
    const orderId = req.params.id;
    const invoiceName = `invoice-${orderId}.pdf`;
    const invoicePath = path.join('invoices', invoiceName);

    const orderDetail=await Orders.findOne({orderId:orderId})






    const pdfDoc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');

    res.setHeader('Content-Disposition', `attachment; filename="${invoiceName}"`);

    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);


   pdfDoc
    .fontSize(20)
    .text('HammerCollection Pvt. Ltd.', { align: 'center' })
    .moveDown(0.5);

  pdfDoc
    .fontSize(10)
    .text('123, MG Road, Kochi, Kerala - 682001', { align: 'center' })
    .text('Email: hammerCollection@myshop.com | Phone: +91 98765 43210', { align: 'center' })
    .moveDown(1);

  pdfDoc
    .fontSize(16)
    .text('INVOICE', { align: 'center', underline: true })
    .moveDown(1.5);


  pdfDoc
    .fontSize(12)
    .text(`Invoice No: ${orderId}`, 50, pdfDoc.y)
    .text(`Date: ${orderDetail.invoiceDate}`, { align: 'right' })
    .moveDown(1);

  pdfDoc
    .fontSize(12)
    .text('BILL TO:', { bold: true })
    .moveDown(0.3)
    .text(`${orderDetail.address.name}`)
    .text(`${orderDetail.address.landMark},${orderDetail.address. addressLine}`)
    .text(`${orderDetail.address.city},${orderDetail.address.state}-${orderDetail.address. pincode}`)
    .text(`${orderDetail.address.phone}`)
    .moveDown(1.5);

 
 
  pdfDoc.fontSize(12).text('Item', 50, pdfDoc.y, { bold: true });
pdfDoc.text('Qty', 300, pdfDoc.y);
pdfDoc.text('Price', 370, pdfDoc.y);
pdfDoc.text('Total', 450, pdfDoc.y);

pdfDoc.moveTo(50, pdfDoc.y + 5).lineTo(550, pdfDoc.y + 5).stroke();
pdfDoc.moveDown(0.5);
 
  const items =orderDetail.orderedItems 


  let totalAmount = 0;

  items.forEach((item) => {
    const total = item.quantity * item.price;
    totalAmount += total;

          pdfDoc
            .fontSize(12)
            .text(item.name, 50, pdfDoc.y)
            .text(item.qty, 300, pdfDoc.y)
            .text(` ₹${item.price}`, 370, pdfDoc.y)
            .text(` ₹${total}`, 450, pdfDoc.y);
        });

        pdfDoc.moveDown(1);
        pdfDoc.moveTo(50, pdfDoc.y).lineTo(550, pdfDoc.y).stroke();
        pdfDoc.moveDown(0.5);

 
          pdfDoc
            .fontSize(12)
            .text('Subtotal:', 400, pdfDoc.y, { continued: true })
            .text(`₹${totalAmount}`, { align: 'right' })
            .text('Tax (5%):', 400, pdfDoc.y, { continued: true })
            .text(`₹${(totalAmount * 0.05).toFixed(2)}`, { align: 'right' })
            .moveDown(0.5)
            .fontSize(13)
            .text('Total Amount:', 400, pdfDoc.y, { continued: true })
            .text(`₹${(totalAmount * 1.05).toFixed(2)}`, { align: 'right', underline: true });

          pdfDoc.moveDown(2);

    
      pdfDoc
        .fontSize(10)
        .text('Thank you for your purchase!', { align: 'center' })
        .text('invoice.', { align: 'center', italics: true });

      pdfDoc.end();


  } catch (error) {
    
  }
}

module.exports ={
    loadOrders,
    loadOrderDeatils,
    cancelOrder,
    returnProduct,
    downloadInvoice
}