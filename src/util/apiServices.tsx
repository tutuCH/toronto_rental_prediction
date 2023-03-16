import axios from 'axios';
import { PredictParam } from '../data/dataDef';
import { ApiList } from './apiList'
export const sampleData = {
    "data": {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        -79.412611,
                        43.777436
                    ]
                },
                "properties": {
                    "country_code": "ca",
                    "housenumber": "60",
                    "street": "Byng Avenue",
                    "country": "Canada",
                    "county": "Toronto",
                    "datasource": {
                        "sourcename": "openstreetmap",
                        "attribution": "© OpenStreetMap contributors",
                        "license": "Open Database License",
                        "url": "https://www.openstreetmap.org/copyright"
                    },
                    "postcode": "M2N 7H4",
                    "state": "Ontario",
                    "city": "Toronto",
                    "district": "North York",
                    "suburb": "Willowdale East",
                    "lon": -79.412611,
                    "lat": 43.777436,
                    "state_code": "ON",
                    "formatted": "60 Byng Avenue, Toronto, ON M2N 7H4, Canada",
                    "address_line1": "60 Byng Avenue",
                    "address_line2": "Toronto, ON M2N 7H4, Canada",
                    "timezone": {
                        "name": "America/Toronto",
                        "offset_STD": "-05:00",
                        "offset_STD_seconds": -18000,
                        "offset_DST": "-04:00",
                        "offset_DST_seconds": -14400,
                        "abbreviation_STD": "EST",
                        "abbreviation_DST": "EDT"
                    },
                    "result_type": "building",
                    "rank": {
                        "popularity": 6.444778887294483,
                        "confidence": 1,
                        "confidence_city_level": 1,
                        "confidence_street_level": 1,
                        "match_type": "full_match"
                    },
                    "place_id": "5112bef73768da53c059d55dd90583e34540f00102f9019cc8220a00000000c00203e203236f70656e7374726565746d61703a616464726573733a7761792f313730303531373430"
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "datasource": {
                        "sourcename": "openstreetmap",
                        "attribution": "© OpenStreetMap contributors",
                        "license": "Open Database License",
                        "url": "https://www.openstreetmap.org/copyright"
                    },
                    "country": "Canada",
                    "country_code": "ca",
                    "state": "Ontario",
                    "county": "Golden Horseshoe",
                    "city": "Toronto",
                    "postcode": "M2N 0E6",
                    "district": "North York",
                    "suburb": "North York",
                    "quarter": "Willowdale",
                    "street": "Byng Avenue",
                    "housenumber": "60",
                    "lon": -79.413161,
                    "lat": 43.7770157,
                    "state_code": "ON",
                    "formatted": "60 Byng Avenue, Toronto, ON M2N 0E6, Canada",
                    "address_line1": "60 Byng Avenue",
                    "address_line2": "Toronto, ON M2N 0E6, Canada",
                    "timezone": {
                        "name": "America/Toronto",
                        "offset_STD": "-05:00",
                        "offset_STD_seconds": -18000,
                        "offset_DST": "-04:00",
                        "offset_DST_seconds": -14400,
                        "abbreviation_STD": "EST",
                        "abbreviation_DST": "EDT"
                    },
                    "result_type": "building",
                    "rank": {
                        "importance": 0.31001,
                        "popularity": 6.4691561960749615,
                        "confidence": 1,
                        "confidence_city_level": 1,
                        "confidence_street_level": 1,
                        "match_type": "full_match"
                    },
                    "place_id": "51e4bed53a71da53c05941fd1d4075e34540f00103f901df3f853500000000c00203"
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        -79.413161,
                        43.7770157
                    ]
                },
                "bbox": [
                    -79.413211,
                    43.7769657,
                    -79.413111,
                    43.7770657
                ]
            },
            {
                "type": "Feature",
                "properties": {
                    "datasource": {
                        "sourcename": "openstreetmap",
                        "attribution": "© OpenStreetMap contributors",
                        "license": "Open Database License",
                        "url": "https://www.openstreetmap.org/copyright"
                    },
                    "name": "The Monet",
                    "country": "Canada",
                    "country_code": "ca",
                    "state": "Ontario",
                    "county": "Golden Horseshoe",
                    "city": "Toronto",
                    "postcode": "M2N 7H4",
                    "district": "North York",
                    "suburb": "North York",
                    "quarter": "Willowdale",
                    "street": "Byng Avenue",
                    "housenumber": "60",
                    "lon": -79.41276004056604,
                    "lat": 43.77739115,
                    "state_code": "ON",
                    "formatted": "The Monet, 60 Byng Avenue, Toronto, ON M2N 7H4, Canada",
                    "address_line1": "The Monet",
                    "address_line2": "60 Byng Avenue, Toronto, ON M2N 7H4, Canada",
                    "category": "building.residential",
                    "timezone": {
                        "name": "America/Toronto",
                        "offset_STD": "-05:00",
                        "offset_STD_seconds": -18000,
                        "offset_DST": "-04:00",
                        "offset_DST_seconds": -14400,
                        "abbreviation_STD": "EST",
                        "abbreviation_DST": "EDT"
                    },
                    "result_type": "amenity",
                    "rank": {
                        "importance": 0.31001,
                        "popularity": 6.444778887294483,
                        "confidence": 1,
                        "confidence_city_level": 1,
                        "confidence_street_level": 1,
                        "match_type": "inner_part"
                    },
                    "place_id": "51ead416a96ada53c05994b99e8d81e34540f00102f9019cc8220a00000000c00201920309546865204d6f6e6574"
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        -79.41276004056604,
                        43.77739115
                    ]
                },
                "bbox": [
                    -79.4129372,
                    43.7771488,
                    -79.4123813,
                    43.7776174
                ]
            }
        ],
        "query": {
            "text": "60 Byng Ave, North York, ON M2N 7K3, Canada",
            "parsed": {
                "housenumber": "60",
                "street": "byng ave",
                "postcode": "m2n 7k3",
                "city": "north york",
                "state": "on",
                "country": "canada",
                "expected_type": "building"
            }
        }
    },
    "status": 200,
    "statusText": "",
    "headers": {
        "cache-control": "private, max-age=0, no-cache",
        "content-type": "application/json; charset=utf-8"
    },
    "config": {
        "transitional": {
            "silentJSONParsing": true,
            "forcedJSONParsing": true,
            "clarifyTimeoutError": false
        },
        "adapter": [
            "xhr",
            "http"
        ],
        "transformRequest": [
            null
        ],
        "transformResponse": [
            null
        ],
        "timeout": 0,
        "xsrfCookieName": "XSRF-TOKEN",
        "xsrfHeaderName": "X-XSRF-TOKEN",
        "maxContentLength": -1,
        "maxBodyLength": -1,
        "env": {},
        "headers": {
            "Accept": "application/json, text/plain, */*"
        },
        "method": "get",
        "url": "https://api.geoapify.com/v1/geocode/search?text=60%20Byng%20Ave%2C%20North%20York%2C%20ON%20M2N%207K3%2C%20Canada&apiKey=2fdf793c376b48e7881234a2407c0ad3"
    },
    "request": {}
}


export const getLatLongByAddress = async (address: string) => {
    const geocodeApi = {
      method: 'get',
      url: `${ApiList.geoapifyBaseURL}${encodeURIComponent(address)}&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`,
      headers: { }
    };
    const res = await axios.get(`${ApiList.geoapifyBaseURL}${encodeURIComponent(address)}&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`);
    return res
    // return sampleData
}

export const getPredictionByUserInput = async (params: PredictParam) => {
    const res = await axios.get(`${ApiList.getRentalPredictionPrice}`, { params });
    if(res.status === 200) {
        return res;
    } else {
        console.log('error')
        // some error handling
    } 
}