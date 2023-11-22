const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const payloadSchema = new Schema({
    imageID: {
        type: String,
        required: false,
    },
    latitude: {
        type: String,
        required: true,
    },
    longitude: {
        type: String,
        required: true,
    },
    date: {
       type: String,
       required: true, // Sets the default value to the current timestamp when creating a new document
    },
    filename: {
        type: String,
        required: false,
    },
    imageData: {
        type: Buffer,
        required: false,
    }
});


const payloadModel = model("Images", payloadSchema );
module.exports = payloadModel;