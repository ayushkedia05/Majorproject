const mongoose= require('mongoose');

const productSchema=new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter product Name"],
        trim: true,
      },
      description: {
        type: String,
        required: [true, "Please Enter product Description"],
      },
      price: {
        type: Number,
        required: [true, "Please Enter product Price"],
        maxLength: [8, "Price cannot exceed 8 characters"],
      },
      ratings: {
        type: Number,
        default: 0,
      },
      images: [
        {
          public_id: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
        },
      ],
      category: {
        type: String,
        required: [true, "Please Enter Product Category"],
      },
      Stock: {
        type: Number,
        required: [true, "Please Enter product Stock"],
        maxLength: [4, "Stock cannot exceed 4 characters"],
        default: 1,
      },
      numOfReviews: {
        type: Number,
        default: 0,
      },
      reviews:[
        {
          user: {
            type: mongoose.Schema.ObjectId,
            ref: "user",
            required: true,
          },
          name:{
            type:String,
            require:true,
          },
          rating:{
            type:Number,

          },
          comment:{
            type:String
          }
        }
      ],
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
      },
      createdAt:{
        type:Date,
        default:Date.now
      }

})

module.exports=mongoose.model("product",productSchema)