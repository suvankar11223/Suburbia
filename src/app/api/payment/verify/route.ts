import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      totalAmount
    } = await request.json();

    // Verify payment signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Store order in database
    await client.connect();
    const db = client.db();
    const ordersCollection = db.collection("orders");

    const orderData = {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      totalAmount,
      status: "completed",
      createdAt: new Date(),
    };

    await ordersCollection.insertOne(orderData);

    return NextResponse.json({
      message: "Payment verified successfully",
      orderId: razorpay_order_id,
    });

  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}