import type { Component } from "solid-js";
import { createSignal, onMount } from "solid-js";
import axios from 'axios';
const Landing: Component = () => {
  const [address, setAddress] = createSignal('');
  const maxSelectValue = 10
  const background = {
    path: "../../../assets/image/toronto-background.jpeg",
    alt: "toronto-background"
  }
  const roomOptions = [ 'Bedroom', 'Bathroom', 'Den', ]
  const roomOptionDiv = Array.from(roomOptions, (_,i) => (
    <select class="select select-primary max-w-xs rounded-full">
      <option disabled selected>{_}</option>
      {Array.from({ length: maxSelectValue + 1 }, (_, i) => i).map((value) => (
        <option value={value}>{value}</option>
      ))}
    </select>  
  ))
  // Generate options from 1 to 10

  
  const getLatLongByAddress = () => {
    const geoapifyBaseURL = 'https://api.geoapify.com/v1/geocode/search?text=';
    const geocodeApi = {
      method: 'get',
      url: `${geoapifyBaseURL}${encodeURIComponent(address())}&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`,
      headers: { }
    };
    
    // axios(geocodeApi)
    // .then(function (response) {
    //   console.log(response.data);
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });  
  }
  return (
    <div class="h-screen relative">
      <img class="absolute inset-0 w-full h-full opacity-40 object-cover" src={background.path} alt={background.alt}/>
      <main class="relative backdrop-blur h-full">
            <div class="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56 h-full flex items-center justify-center">
              <div class="text-center p-4 opacity-80 rounded-lg">
                <h1 class="text-4xl font-bold tracking-tight text-green-800 sm:text-6xl">
                  Rental Price Predictions
                </h1>
                <div class="relative mt-4 rounded-md shadow-sm">
                  <textarea class="w-full rounded-3xl h-8 textarea-primary textarea textarea-bordered" placeholder="Start by entering your address" onInput={(e) => setAddress(e.currentTarget.value)}></textarea>                  
                </div>    
                <div class="flex gap-6 justify-center">
                  {roomOptionDiv}
                </div>            
                <div class="mt-10 flex items-center justify-center gap-x-6">
                  <a class="rounded-full bg-green-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                   onClick={() => getLatLongByAddress()}
                   >
                    Predict
                  </a>
                </div>
              </div>
            </div>
      </main>
    </div>
  );
};

export default Landing;

/*
sample api response

{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -79.378033,
                    43.648861
                ]
            },
            "properties": {
                "country_code": "ca",
                "housenumber": "1",
                "street": "King Street West",
                "country": "Canada",
                "county": "Toronto",
                "datasource": {
                    "sourcename": "openstreetmap",
                    "attribution": "© OpenStreetMap contributors",
                    "license": "Open Database License",
                    "url": "https://www.openstreetmap.org/copyright"
                },
                "postcode": "M6K 1H3",
                "state": "Ontario",
                "city": "Old Toronto",
                "district": "Financial District",
                "suburb": "Toronto Centre",
                "lon": -79.378033,
                "lat": 43.648861,
                "state_code": "ON",
                "formatted": "1 King Street West, Old Toronto, ON M6K 1H3, Canada",
                "address_line1": "1 King Street West",
                "address_line2": "Old Toronto, ON M6K 1H3, Canada",
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
                    "popularity": 8.474143437228948,
                    "confidence": 1,
                    "confidence_city_level": 1,
                    "confidence_street_level": 1,
                    "match_type": "full_match"
                },
                "place_id": "51c3f352b131d853c0592e5393e00dd34540f00103f901341279c100000000c00203e203256f70656e7374726565746d61703a616464726573733a6e6f64652f33323435393337323034"
            }
        }
    ],
    "query": {
        "text": "1 King St W, Toronto, ON M5H 1A1, Canada",
        "parsed": {
            "housenumber": "1",
            "street": "king st w",
            "postcode": "m5h 1a1",
            "city": "toronto",
            "state": "on",
            "country": "canada",
            "expected_type": "building"
        }
    }
}
*/