import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
    role:{
        type: String,
        required: true,
        enum:['user','admin'],
        default:'user'
    },
    name:{
        type: String,
        required:true,
        trim:true,
    },
    email:{
        type: String,
        required:true,
        trim:true,
        unique: true
    },
    password:{
        type: String,
        required:true,
        // trim:true,
        select:false,
    },
    avatar:{
        url:{
            type:String,
            trim:false,
        },
        public_id:{
            type:String,
            trim:true,
        }
    },
    isEmailVerified:{
        type:Boolean,
        default:false,
    },
    Phone:{
        type:String,
        trim:true,
    },
    address:{
        type:String,
        trim:true,
    },
    deletedAt:{
        type:Date,
        default:null,
        index:true,
    },
},{timestamps:true});

UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.
    comparePassword= async function (candidatePassword){
        return await bcrypt.compare(candidatePassword, this.password);
    }   


const userModel =mongoose.models.User || mongoose.model('User', UserSchema, 'users');

export default userModel;