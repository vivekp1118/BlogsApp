// generic function to handle responses
const sendResponse = (options, res) => {
    const { result = null, statusCode = 200, message = "Success", success = true } = options;

    return res.status(statusCode).json({
        result,
        statusCode,
        message,
        success,
    });
};

//  status prefixes
// const prefixes = {
//     200: "Success",
//     201: "Created",
//     400: "Bad Request",
//     401: "Unauthorized",
//     403: "Forbidden",
//     404: "Not Found",
//     500: "Server Error",
// };

// format message with prefix
// const formatMessage = (prefix, message) => {
//     if (!message) return prefix;
//     return `${prefix}: ${message}`;
// };

// Success
const success = (res, result = null, message = "") =>
    sendResponse(
        {
            result,
            message,
            success: true,
        },
        res
    );

const created = (res, result = null, message = "") =>
    sendResponse(
        {
            result,
            statusCode: 201,
            message,
            success: true,
        },
        res
    );

const updated = (res, result = null, message = "Resource updated") =>
    sendResponse(
        {
            result,
            message: formatMessage(prefixes[200], message),
            success: true,
        },
        res
    );

const deleted = (res, message = "Resource deleted") =>
    sendResponse(
        {
            message,
            success: true,
        },
        res
    );

// Error
const badRequest = (res, message = "") =>
    sendResponse(
        {
            statusCode: 400,
            message,
            success: false,
        },
        res
    );

const unauthorized = (res, message = "") =>
    sendResponse(
        {
            statusCode: 401,
            message,
            success: false,
        },
        res
    );

const forbidden = (res, message = "") =>
    sendResponse(
        {
            statusCode: 403,
            message,
            success: false,
        },
        res
    );

const notFound = (res, message = "") =>
    sendResponse(
        {
            statusCode: 404,
            message,
            success: false,
        },
        res
    );

const serverError = (res, message = "") =>
    sendResponse(
        {
            statusCode: 500,
            message,
            success: false,
        },
        res
    );

export { sendResponse, success, created, updated, deleted, badRequest, unauthorized, forbidden, notFound, serverError };
