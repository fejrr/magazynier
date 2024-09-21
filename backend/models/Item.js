// type: module
import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const ItemSchema = new Schema({
    name : {
        type: String, 
        required: true
    },    
    quantity : {
        type: Number,
        required: true
    },
    location: {
        type: String, 
        required: false
    },
    tags: {
        type: String, 
        required: false
    },
    image: {
        type: String, 
        required: false
    }
}, { 
    timestamps: true 
});

const Item = models.Item || model("Item", ItemSchema);
export default Item;
