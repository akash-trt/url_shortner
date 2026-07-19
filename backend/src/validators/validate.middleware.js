import { ApiError } from "../utils/ApiError.js";

const validate = (schema) => async (req, res, next) => {
    try {
        console.log("req.body:", req.body);
        console.log("req.params:", req.params);
        console.log("req.query:", req.query);
        console.log("content-type:", req.headers["content-type"]);
        const result = await schema.safeParseAsync({
            body: req.body,
            params: req.params,
            query: req.query,
        });

        if (!result.success) {
            return next(
                new ApiError(
                    400,
                    result.error.issues[0]?.message || "Validation failed."
                )
            );
        }

        req.validatedData = {
            ...(result.data.body ?? {}),
            ...(result.data.params ?? {}),
            ...(result.data.query ?? {}),
        };

        next();
    } catch (error) {
        next(error);
    }
};

export default validate;