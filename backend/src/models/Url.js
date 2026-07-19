// src/models/Url.js

import mongoose from "mongoose";

export const URL_STATUS = Object.freeze({
    ACTIVE: "ACTIVE",
    DISABLED: "DISABLED",
    BLOCKED: "BLOCKED",
});

const urlSchema = new mongoose.Schema(
    {
        shortCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        longUrl: {
            type: String,
            required: true,
            trim: true,
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        customAlias: {
            type: Boolean,
            default: false,
        },

        status: {
            type: String,
            enum: Object.values(URL_STATUS),
            default: URL_STATUS.ACTIVE,
        },

        expiresAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);


urlSchema.index({
    owner: 1,
    createdAt: -1,
});

urlSchema.index({
    expiresAt: 1,
});

urlSchema.methods.isExpired = function () {
    return (
        this.expiresAt &&
        this.expiresAt <= new Date()
    );
};

urlSchema.methods.isAccessible = function () {
    return (
        this.status === URL_STATUS.ACTIVE &&
        !this.isExpired()
    );
};
export default mongoose.model("Url", urlSchema);