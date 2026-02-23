import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        require: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // require: true,
        default: null,
    },
    rating:{
        type: Number,
        require: true,
    },
    title:{
        type: String,
        require: true,
    },
    review:{
        type: String,
        require: true,
    },
    deletedAt:{
        type: Date,
        default: null,
        index: true,
    },
    
},  {timestamps: true})


const ReviewModel = mongoose.models.Review || mongoose.model('Review', ReviewSchema, 'Reviews')
export default ReviewModel;