import Collection from "../models/collectionModel.js";
import Event from "../models/event.model.js";
import Cloudinary from "../utils/cloudinary.js";
import {formatCurrentDate} from "../utils/index.js";

export const uploadFile = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                message: "Event not found",
            });
        };
        const files = req.files.file;
        if(!files){
            return res.status(404).json({
                message: "No file uploaded",
            });
        };
        const collection = new Collection({
            event_id: eventId,
            user_id: event.user_id,
            timeUploaded: formatCurrentDate()
        })
        const uploads = Array.isArray(files) ? files : [files];
        const fileArray = collection.files
        for (let file of uploads) {
            const fileType = file.mimetype.split("/")[1];
            if(fileType === 'mp4'){
                const video = await Cloudinary.uploader.upload(file.tempFilePath,{
                  resource_type: 'video',
                  folder: 'videos'
                }, (err, file)=>{
                  if(err){
                    throw new BadRequestError("Error uploading video", null)
                  }else{
                    return file;
                  }
                });
                const imageBody = {
                    file: video.secure_url,
                    file_url: video.public_id
                  }
                fileArray.push(imageBody);
            }  else{
                const result = await Cloudinary.uploader.upload(file.tempFilePath, {
                    folder: 'wedding_images'
                });
                const imageBody = {
                    file: result.secure_url,
                    file_url: result.public_id
                  };
                fileArray
            };
    
            await Event.updateOne({
                _id: eventId
            }, {
                $push: {
                    collections: collection._id
                }
            });
            await collection.save();
            return res.status(200).json({
                message: "success",
                data: collection
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message ,
            error:error.message
           });
    }
};
