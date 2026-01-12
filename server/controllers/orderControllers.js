import orderModel from "../models/orderModel.js";
import cartModel from "../models/cartModel.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await cartModel
      .findOne({ userId })
      .populate("items.productId", "name price finalPrice");

    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newOrder = await orderModel.create({
      userId,
      items: cart.items.map((i) => ({
        productId: i.productId._id,
        quantity: i.quantity,
        price: i.price,
      })),
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "pending" : "processing",
    });

    await cartModel.findOneAndDelete({ userId });

    res.status(200).json({
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ userId: req.user.id })
      .populate("items.productId", "name brand images price")
      .sort({ createdAt: -1 });
    res.status(200).json({
      message: "Orders fetched successfully",
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await orderModel
      .findOne({ _id: req.params.orderId, userId: req.user.id })
      .populate("items.productId", "name images price");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order details fetched", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
