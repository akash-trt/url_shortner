// src/lib/base62.js

const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const BASE = ALPHABET.length;

/**
 * Encodes a positive integer into a Base62 string.
 *
 * Examples:
 * 1  -> "1"
 * 61 -> "Z"
 * 62 -> "10"
 */
export function encodeBase62(number) {
    if (!Number.isInteger(number) || number < 0) {
        throw new Error("Base62 encoder accepts only positive integers.");
    }

    if (number === 0) {
        return ALPHABET[0];
    }

    let encoded = "";

    while (number > 0) {
        const remainder = number % BASE;
        encoded = ALPHABET[remainder] + encoded;
        number = Math.floor(number / BASE);
    }

    return encoded;
}

/**
 * Decodes Base62 back to integer.
 * Used during Redis recovery.
 */
export function decodeBase62(str) {
    if (!str || typeof str !== "string") {
        throw new Error("Invalid Base62 string.");
    }

    let number = 0;

    for (const char of str) {
        const index = ALPHABET.indexOf(char);

        if (index === -1) {
            throw new Error("Invalid Base62 character.");
        }

        number = number * BASE + index;
    }

    return number;
}
