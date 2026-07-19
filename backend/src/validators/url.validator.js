import { z } from "zod";
import validator from "validator";
import { URL_STATUS } from "../models/Url.js";

const isValidUrl = (value) =>
    validator.isURL(value, {
        protocols: ["http", "https"],
        require_protocol: true,
        require_valid_protocol: true,
    });

const objectId = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

const shortCode = z
    .string()
    .trim()
    .min(1)
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/, "Invalid short code");

const futureDate = z
    .string()
    .datetime()
    .refine(
        (value) => new Date(value) > new Date(),
        "Expiry date must be in the future."
    );

export const createUrlSchema = z.object({
    longUrl: z
        .string()
        .trim()
        .refine(isValidUrl, "Invalid URL."),

    customAlias: shortCode.optional(),

    expiresAt: futureDate.optional(),
});

export const updateUrlSchema = z
    .object({
        longUrl: z
            .string()
            .trim()
            .refine(isValidUrl, "Invalid URL.")
            .optional(),

        expiresAt: futureDate.optional(),

        status: z
            .enum([
                URL_STATUS.ACTIVE,
                URL_STATUS.DISABLED,
            ])
            .optional(),
    })
    .refine(
        (data) => Object.keys(data).length > 0,
        "At least one field must be provided."
    );

export const getUrlSchema = z.object({
    id: objectId,
});

export const deleteUrlSchema = z.object({
    id: objectId,
});

export const resolveUrlSchema = z.object({
    shortCode,
});

export const listUrlsSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});