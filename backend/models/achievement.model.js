import mongoose from "mongoose";

const AchievementSchema = mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String},
    image: {type: String}
})

