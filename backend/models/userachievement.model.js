import mongoose, { Schema } from 'mongoose'


const userAchievementSchema = new mongoose.Schema({
    userId: {type: Schema.Types.userId,
        ref: 'User',
        required: true
    },
    achievementId: {type: Schema.Types.achievementId,
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