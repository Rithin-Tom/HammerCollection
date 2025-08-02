const User = require("../../models/userSchema");
const Cart = require('../../models/cartSchema');
const Product = require('../../models/productSchema')



const loadCart = async (req, res) => {
    try {
        let userId = req.session.user._id
        const user = await User.findById(userId)
        const cart = await Cart.findOne({ userId: userId }).populate({ path: 'items.productId', populate: { path: "category", populate: { path: "parent" } } })

        res.render('user/userCart', { user: user,cart})
    } catch (error) {

    }

}

const addToCart = async (req, res) => {
    try {
        const productId = req.body.id
        const price = req.body.price


        let userId = req.session?.user?._id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Login required' });
        }

        const user = await User.findById(userId)

        const product = await Product.findById(productId)
        

        if (!product) {
            return res.status(401).json({ success: false, message: 'product is discontinued' });
        }
        
        if(product.quantity < 1)return res.status(401).json({success:false,message:"product is out of stock"})

        let userCart = await Cart.findOne({ userId })

        if (!userCart) {
            userCart = new Cart({
                userId,
                items: [],
                totalItems: 0
            })
        }

        let exitingItem = userCart.items.find((items) => items.productId.equals(productId))





        if (exitingItem) {
            if (exitingItem.quantity >= 5) {
                return res.status(401).json({ success: false, message: 'you can only add  5 items' });
            } else {
                exitingItem.quantity += 1;
                exitingItem.total = exitingItem.quantity * price;
                product.quantity -= 1
                await product.save()

            }
        } else {
            let quantity = 1
            userCart.items.push({
                productId: productId,
                quantity: quantity,
                price: product.salePrice,
                total:product.salePrice        
            })

            product.quantity -= 1
            product.status = product.quantity === 0 ? 'sold_out' : 'available';

            await product.save()
            
        }
       
        await userCart.save()

        res.json({ success: true, message: 'Added to cart' })


    } catch (error) {

        console.error('Add to cart error:', error);
        res.status(500).json({ success: false, message: 'Server error' });

    }

}
const updateQuantity =async (req,res) => {
   
    try {

          const userId = req.session.user._id;
          const { productId, quantity } = req.body;

          const cart = await Cart.findOne({userId:userId})
          let product = await Product.findById({_id:productId})

          if(!cart)return res.status(404).json({success:false,message:'cart not found'})

            let items = cart.items.find((items=>items.productId.toString()==productId))
            if(!items)return res.status(404).json({ success: false, message: 'Item not found in cart' });

            let oldQty = items.quantity
            let diff =  quantity - oldQty

            if (diff > 0 && product.quantity < diff) {
               return res.status(400).json({ success: false, message: 'Not enough stock available' });
             }

              product.quantity -= diff;

             
              items.quantity = quantity;
             items.total = items.quantity * product.salePrice;

        
              if (product.quantity === 0) {
                 product.status = 'sold_out';
                } else {
              product.status = 'available';
                   }
        
                await product.save()

            await cart.save()

            res.json({
                 success: true,
                 totalItems: cart.totalItems,
                 totalPrice: cart.totalPrice,
                 subTotal:items.total
            });


        
        
    } catch (error) {
        console.error('Update quantity error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
    }
    
}


const deleteItem = async (req,res) => {
    try {
        const { productId } = req.body;

        const userId = req.session.user._id;
         const  products =  await Product.findById(productId)
       

         const cart = await Cart.findOne({userId:userId});

         if(!cart)return res.status(404).json({success:false,message:"cannot find the cart"})

            cart.items = cart.items.filter((item)=>item.productId.toString() !== productId)
            if(products.quantity>0){
            products.status ="available"
            }

            await cart.save()

            res.json({success:true,message:'product has been removed ',cart:{
            items: cart.items,
            totalItems: cart.totalItems,
            totalPrice: cart.totalPrice
        }
    })

        
    } catch (error) {

        console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
        
    }
    
}



module.exports = {
    loadCart,
    addToCart,
    updateQuantity,
    deleteItem,
   

}