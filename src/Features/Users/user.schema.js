import mongoose from "mongoose";

// ********** only those properties can be save in mongodb which are defined in Schema *************
const userSchema = new mongoose.Schema({
    // id: { type: Number, required: true,},
    name: { type: String, required: true,},
    email: {type: String, unique: true, required: true,},
    password: { type: String, required: [true, "Password is Required"], },
    type: {type: String, enum: ['Customer', 'Seller'], default: 'Customer'},
    dateCreated: { type: Date, default: Date.now }
}, { versionKey: false }, { timestamps: true });   //({ timestamps: true } : Not Working)

export const userModel = mongoose.model('User', userSchema);


// const userSchema = mongoose.Schema(
//     {
//       name: {
//         type: String,
//         required: [true, "Name is required"],
//       },
//       email: {
//         type: String,
//         required: [true, "Email is Required"],
//       },
//       password: {
//         type: String,
//         required: [true, "Password is Required"],
//       },
//       isAdmin: {
//         type: Boolean,
//         default: false,
//       },
//     },
//     { timestamps: true }
// );
  
