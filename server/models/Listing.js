import mongoose from "mongoose";
const listingSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
            trim:true
        },
        description:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true,
            min:0
        },
        category:{
            type:String,
            enum:["books","notes","lab materials","others"],
            default:"others"
        },
        images:{
            type:[String],
            default:[]
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true

        },
        imageUrl:{type:String},
        fileUrl:{type:String}
    },
    {timestamp:true}

);

const Listing = mongoose.model("Listing",listingSchema);
export default Listing;