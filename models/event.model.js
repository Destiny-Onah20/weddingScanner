import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    event_type: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    },
    collections: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "collections"
    },
    link:{
      type: String
    },
    qrcode:{
      type: String
    }
  },
  { timestamps: true,
    versionKey: false
   }
);
const Event = mongoose.model("events", eventSchema);

export default Event;
