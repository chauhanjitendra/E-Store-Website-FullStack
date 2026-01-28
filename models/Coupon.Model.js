import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code:{
        type: String,
        require: true,
        trim: true,
        unique: true,
    },
    discountPercentage:{
        type: Number,
        require: true,
        trim: true,
    },
    minShoppingAmount:{
        type: Number,
        require: true,
        trim: true,
    },
    validity:{
        type: Date,
        require: true,
    },
    deletedAt:{
        type: Date,
        default: null,
        index: true,
    },
    
},  {timestamps: true})


const CouponModel = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema, 'coupons')
export default CouponModel;