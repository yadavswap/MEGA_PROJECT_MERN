import Product from "../models/orderSchema"
import Coupon from "../models/couponSchema"
import Order from "../models/orderSchema"
import asyncHandler from "../services/asyncHandler"
import CustomError from "../utils/customError"
import razorpay from "../config/razorpay"


export const generateRazorpayOrderId = asyncHandler(async(req,res)=>{
    // get product and coupon from frontend
    // verify product price from backend
    // make DB query to get all products and info
    // total amt and final amt
    // coupon check - DB
    // discount
    // finalamountt = totalamt - discount
    let totalAmt;
    const options = {
        amount :Math.round(totalAmt *100),
        currency:"INR",
        'receipt':`receipt_${new Date().getTime()}`
    }

    const order = await razorpay.orders.create(options)
    // if order not exist

    // success then send it to front end
})