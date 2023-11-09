const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const payloadSchema = new Schema({
    imageID: {
        type: Number,
        required: false,
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
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