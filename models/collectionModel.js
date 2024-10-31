import mongoose from "mongoose";

const collectionSchema=new mongoose.Schema({

},{timestamps:true});

const Collection=mongoose.model("collections",collectionSchema)