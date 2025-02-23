import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const TagSchema = new Schema({
    name : {
        type: String, 
        required: true
    },    
    color : {
        type: String, 
    }
});

const Tag = models.Tag || model("Tag", TagSchema);
export default Tag;
