import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
    {
        url: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Url",
            required: true,
            index: true,
        },

        ip: {
            type: String,
            default: null,
        },

        userAgent: {
            type: String,
            default: null,
        },

        referrer: {
            type: String,
            default: null,
        },

        country: {
            type: String,
            default: null,
            trim: true,
        },

        city: {
            type: String,
            default: null,
            trim: true,
        },

        clickedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        versionKey: false,
    }
);

analyticsSchema.index({
    url: 1,
    clickedAt: -1,
});

export default mongoose.model(
    "Analytics",
    analyticsSchema
);