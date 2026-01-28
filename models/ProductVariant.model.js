import mongoose from "mongoose";

const ProductVariantSchema = new mongoose.Schema({
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },  
    color:{
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    size:{
        type: String,
        required: true,
        trim: true,
    },
    mrp:{
        type: String,
        required: true,
    },
    sellingPrice:{
        type: Number,
        required: true,
    },
    discountPercentages:{
        type: Number,
        required: true,
    },
    sku:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    media: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Media',
            required: true,
        }
    ],
    deletedAt:{
        type: Date,
        default: null,
        index:true,
    },
    
},  {timestamps: true})


const ProductVariantModel = mongoose.models.ProductVariant || mongoose.model('ProductVariant', ProductVariantSchema, 'ProductVariants')

export default ProductVariantModel;