const Razorpay = require("razorpay");

exports.handler = async (event) => {
  try {
    const { amount } = JSON.parse(event.body);

    if (!amount || amount < 100) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Minimum amount is 100 paise" })
      };
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: "swarnam_" + Date.now()
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};