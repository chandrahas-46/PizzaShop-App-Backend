// // 1. Import express.
// import express from 'express';
// import OrderController from './order.controller.js';

// // 2. Initialize Express router.
// const orderRouter = express.Router();
// const orderController = new OrderController();

// // All the paths to the controller methods.
// // localhost/api/order
// orderRouter.post('/', orderController.placeOrder);
// // orderRouter.patch('/:id', orderController.updateOrder);
// orderRouter.get('/', orderController.orderHistory);
// orderRouter.get('/:id', orderController.orderDetails);

// export default orderRouter;


// {
//     "_id": {
//       "$oid": "65e5bbb67cfe746e336908bf"
//     },
//     "shippingAddress": "Bahuar",
//     "phone": "999888877",
//     "status": "Shipped",
//     "totalPrice": 650,
//     "payment_mode": "Cash",
//     "userID": {
//       "$oid": "65e210ac8cb8ee68b255d1c1"
//     },
//     "orderItems": [
//       {
//         "productID": {
//           "$oid": "65e22904181b7a2ee35fe1e4"
//         },
//         "quantity": 2,
//         "size": "small",
//         "productInfo": {
//           "name": "Chicken Burger Pizza",
//           "price": {
//             "size": {
//               "small": 100,
//               "medium": 200,
//               "large": 300
//             }
//           }
//         },
//         "totalAmount": 200
//       },
//       {
//         "productID": {
//           "$oid": "65e2c06ab245348953d5298b"
//         },
//         "quantity": 3,
//         "size": "small",
//         "productInfo": {
//           "name": "Cheese Margarita Pizza",
//           "price": {
//             "size": {
//               "small": 150,
//               "medium": 250,
//               "large": 300
//             }
//           }
//         },
//         "totalAmount": 450
//       }
//     ],
//     "orderDate": {
//       "$date": "2024-03-04T12:16:54.117Z"
//     }
//   }

// ************************************************************************************

import express from 'express';
import OrderController from './order.controller2.js';

const orderRouter = express.Router();
const orderController = new OrderController();

orderRouter.post('/', orderController.placeOrder);
orderRouter.post('/getUserOrder', orderController.getUserOrder); //[GET method is not working?]
orderRouter.get('/allUserOrder', orderController.getAllUserOrder);
orderRouter.post('/deliverorder', orderController.deliverOrder);

export default orderRouter;