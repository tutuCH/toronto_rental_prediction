export const BACKEND_URL = () => {
    return import.meta.env.PROD ? import.meta.env.VITE_DEV_PROD_BASE_URL : import.meta.env.VITE_DEV_DEV_BASE_URL 
}
export const API_LIST = {
    "geoapifyBaseURL": `${import.meta.env.VITE_GEOAPIFY_BASE_URL}`,
    "getRentalPredictionPrice": `${BACKEND_URL()}/get-rental-prediction-price`,
}