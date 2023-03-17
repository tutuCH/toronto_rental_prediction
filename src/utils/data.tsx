export const MODEL_MESSAGES = {
    "API_ERROR": "We apologize for the inconvenience, but we have encountered an internet connection error. Please try again later.",
    "INVALID_INPUT": "Please make sure the information are correct",
    "MISSING_INPUT": "Please fill in all fields",
    "": ""
}

type ModelMessagesKeys = keyof typeof MODEL_MESSAGES;

export const MODEL_ID: Record<ModelMessagesKeys, ModelMessagesKeys> = {
    "API_ERROR": "API_ERROR",
    "INVALID_INPUT": "INVALID_INPUT",
    "MISSING_INPUT": "MISSING_INPUT",
    "": "",
}