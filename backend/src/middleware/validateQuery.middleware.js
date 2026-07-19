import ApiError from "../utils/ApiError.js";

const validateQuery = (schema) => {
    return async (req, res, next) => {
        try {
            const result = await schema.safeParseAsync(req.query);

            if (!result.success) {
                return next(
                    new ApiError(
                        400,
                        result.error.issues[0]?.message || "Validation failed."
                    )
                );
            }

            // Don't do: req.query = result.data
            Object.assign(req.query, result.data);

            next();
        } catch (error) {
            next(error);
        }
    };
};

export default validateQuery;