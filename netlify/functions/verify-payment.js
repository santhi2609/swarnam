const crypto = require("crypto");

exports.handler = async (event) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = JSON.parse(event.body);

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: "Missing fields"
                })
            };
        }

        const expectedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                razorpay_order_id + "|" + razorpay_payment_id
            )
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: false,
                    message: "Invalid signature"
                })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: "Payment verified"
            })
        };

    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: err.message
            })
        };
    }
};