import mongoose from "mongoose"

const model = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

export default new mongoose.model("User", model)
