import mongoose from "mongoose";

const collectionSchema=new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "events"
    },
    files: [{
        file_url: {
            type: String
        },
        file: {
            type: String
        }
    }],
    timeUploaded: {
        type: String
    }
},{timestamps:true,
    versionKey:false
});

const Collection=mongoose.model("collections",collectionSchema);
export default Collection;
