import mongoose, { Schema } from 'mongoose'


const userAchievementSchema = new mongoose.Schema({
    userId: {type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    achievementId: {type: Schema.Types.ObjectId,
        ref: 'Achievement',
        required: true
    },
    dateAchieved: {
        type: Date,
        default: Date.now()
    }
}, {timestamps: true})

userAchievementSchema.index({userId: 1, achievementId: 1}, {unique: true})
export const userAchievement = mongoose.model("UserAchievement", userAchievementSchema)