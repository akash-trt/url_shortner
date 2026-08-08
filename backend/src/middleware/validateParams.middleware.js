import ApiError from "../utils/ApiError.js";

const validateParams = (schema) => {
    return async (req, res, next) => {
        try {
            const result = await schema.safeParseAsync(req.params);

            if (!result.success) {
                return next(
                    new ApiError(
                        400,
                        result.error.issues[0]?.message || "Validation failed."
                    )
                );
            }

            Object.assign(req.params, result.data);

            next();
        } catch (error) {
            next(error);
        }
    };
};

export default validateParams;