export const MODEL_MESSAGES = {
    "API_ERROR": "We apologize for the inconvenience, but we have encountered an internet connection error. Please try again later.",
    "INVALID_INPUT": "Please make sure the information are correct",
    "MISSING_INPUT": "Please fill in all fields",
    "ADDRESS_OUT_OF_BOUND": "Sorry, our rental price prediction service is currently only available for properties located in Toronto. Please enter a valid Toronto address to proceed, or try a different location. Thank you for using our service!",
    "": ""
}

type ModelMessagesKeys = keyof typeof MODEL_MESSAGES;

export const MODEL_ID: Record<ModelMessagesKeys, ModelMessagesKeys> = {
    "API_ERROR": "API_ERROR",
    "INVALID_INPUT": "INVALID_INPUT",
    "MISSING_INPUT": "MISSING_INPUT",
    "ADDRESS_OUT_OF_BOUND": "ADDRESS_OUT_OF_BOUND",
    "": "",
}