export const BACKEND_URL = () => {
    return process.env.REACT_APP_PROD_BASE_URL
    return process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_BASE_URL : process.env.REACT_APP_DEV_BASE_URL
}
export const API_LIST = {
    "geoapifyBaseURL": process.env.REACT_APP_GEOAPIFY_BASE_URL,
    "getRentalPredictionPrice": `${BACKEND_URL()}/get-rental-prediction-price`,
    "apiError": 'API_ERROR',
}