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
    collection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "collections"
    }
  },
  { timestamps: true,
    versionKey: false
   }
);
const Event = mongoose.model("events", eventSchema);

export default Event;
