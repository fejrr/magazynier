// type: module
import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const LocationSchema = new Schema({
    name : {
        type: String, 
        required: true
    },    
    state : {
        type: Boolean, 
        required: true
    },
    image: {
        type: String, 
        required: false
    }
}, { 
    timestamps: true 
});

const Location = models.Location || model("Location", LocationSchema);
export default Location;
