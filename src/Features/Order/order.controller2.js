import { v4 as uuidv4 } from 'uuid';
// const router = express.Router();
// const { v4: uuidv4 } = require("uuid");
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

import stripe from "stripe";
import { orderModel } from "./order.schema2.js";

const stripeApiKey = process.env.STRIPE_SECRET_KEY;
const stripeInstance = stripe(stripeApiKey);

export default class OrderController {
    async placeOrder(req, res) {
        const { token, subTotal, currentUser, cartItems } = req.body;
        // console.log("server_orderController2: placeorder", token)
        try {
            const customer = await stripeInstance.customers.create({
                email: token.email,
                source: token.id,
            });
            // console.log("server_orderController2: customer::", customer)
            // const payment = await stripeInstance.charges.create(         //old version
            const payment = await stripeInstance.paymentIntents.create(
                {
                    amount: subTotal * 100,
                    currency: "inr",
                    payment_method_types: ['card'],
                    customer: customer.id,
                    receipt_email: token.email,
                    description: "Payment for order",
                    metadata: {
                        orderId: uuidv4(),
                    }
                },
                // {
                //     idempotencyKey: uuidv4(),
                // }
            );
            // console.log("server_orderController2:payment:: ", payment)

            // Check if payment status is succeeded
            // if (payment.status === 'succeeded') {
            if (payment) {
                const newOrder = new orderModel({
                    name: currentUser.name,
                    email: currentUser.email,
                    userid: currentUser._id,
                    orderItems: cartItems,
                    orderAmount: subTotal,
                    shippingAddress: {
                        street: token.card.address_line1,
                        city: token.card.address_city,
                        country: token.card.address_country,
                        pincode: token.card.address_zip,
                    },
                    transactionId: payment.id,
                });
                newOrder.save();
                res.send("Payment Success");
            } 
            else {
                res.send("Payment Faild");
            }
        } 
        catch (error) {
            // console.log("server_orderController2: error::", error)
            res.status(400).json({
                message: "Something went wrong",
                error: error.stack,
            });
        }
    }


    async getUserOrder(req, res) {
        const { userid } = req.body;
        try {
            // check if userid correct or not
            if(userid){
                const orders = await orderModel.find({ userid: userid });
                // .sort({ _id: "-1" });
                // console.log("Server_orderController2: ", orders.length, userid);
                res.status(200).send(orders);
            }
            else{
                res.send("user_id is not correct");
            }
        } 
        catch (error) {
            res.status(400).json({
                message: "Something Went Wront",
                error: error.stack,
            });
        }
    }

    // ********************* ADMIN ***************************
    async getAllUserOrder(req, res) {
        try {
            const orders = await orderModel.find({});
            res.status(200).send(orders);
        } 
        catch (error) {
            res.status(400).json({
                message: "Something Went Wront",
                error: error.stack,
            });
        }
    }

    async deliverOrder(req, res) {
        const orderid = req.body.orderid;
        try {
            const order = await orderModel.findOne({ _id: orderid });
            order.isDeliverd = true;
            await order.save();
            res.status(200).send("Order deliverd success");
        } 
        catch (error) {
            res.status(400).json({
                message: "Something Went Wront",
                error: error.stack,
            });
        }
    }
}


// router.post("/getuserorder", async (req, res) => {
//     const { userid } = req.body;
//     try {
//         const orders = await Order.find({ userid }).sort({ _id: "-1" });
//         res.status(200).send(orders);
//     } catch (error) {
//         res.status(400).json({
//         message: "Something Went Wront",
//         error: error.stack,
//         });
//     }
// });

// router.get("/alluserorder", async (req, res) => {
//   try {
//     const orders = await Order.find({});
//     res.status(200).send(orders);
//   } catch (error) {
//     res.status(400).json({
//       message: "Something Went Wront",
//       error: error.stack,
//     });
//   }
// });

// router.post("/deliverorder", async (req, res) => {
//   const orderid = req.body.orderid;
//   try {
//     const order = await Order.findOne({ _id: orderid });
//     order.isDeliverd = true;
//     await order.save();
//     res.status(200).send("Order deliverd success");
//   } catch (error) {
//     res.status(400).json({
//       message: "Something Went Wront",
//       error: error.stack,
//     });
//   }
// });
// module.exports = router;