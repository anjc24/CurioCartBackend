const { Order, ProductCart } = require("../models/order");
const formidable =  require("formidable")
const _ = require("lodash")
const fs = require("fs");


exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "NO order found in DB"
        });
      }
      req.order = order;
      next();
    });
};

exports.createOrder = (req, res) => {

  let form = new formidable.IncomingForm();
    form.keepExtensions =  true;

    form.parse(req, (err, fields) => {
        if(err){
            return res.status(400).json({
                error: "problem "
            })
        }
        const {name, address,contact } = fields;
            
        if(
          !name ||
          !address ||
          !contact 
        ){
           res.status(400).json({
               error: "Please include all fields"
           })
        }
        let order = new Order(fields)

   

        order.save((err, order)=> {
          if(err){
                 res.status(400).json({
                  error: "Saving order in db failed"
              })
          }
          
      })


      })

};





exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No orders found in DB"
        });
      }
      res.json(order);
    });
};

exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

exports.updateStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err) {
        return res.status(400).json({
          error: "Cannot update order status"
        });
      }
      res.json(order);
    }
  );
};
