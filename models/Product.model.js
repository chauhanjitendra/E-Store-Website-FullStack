import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
        trim: true,
        // unique: true,
    },
    slug:{
        type: String,
        require: true,
        unique: true,
        lowercase:true,
        trim: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        require: true,
    },
    mrp:{
        type: String,
        require: true,
    },
    sellingPrice:{
        type: Number,
        require: true,
    },
    discountPercentages:{
        type: Number,
        require: true,
    },
    media: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Media',
            required: true,
        }
    ],
    description:{
        type: String,
        required: true,
    },
    deletedAt:{
        type: Date,
        default: null,
        index:true,
    },
    
},  {timestamps: true})

productSchema.index({ category: 1})
const ProductModel = mongoose.models.Product || mongoose.model('Products', productSchema,)
export default ProductModel;