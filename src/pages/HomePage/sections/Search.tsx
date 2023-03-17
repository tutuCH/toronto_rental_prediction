import { useState } from "react";
import { PredictParam } from "../../../assets/data/dataDef";
import { getLatLongByAddress, getPredictionByUserInput } from "../../../utils/apiServices";
interface SearchProps {
  onSearchChange: (newSearched: boolean) => void, 
  onPriceChange: (newPrice: number) => void
}

function Search(props: SearchProps) {
  const { onSearchChange, onPriceChange } = props;
  const [address, setAddress] = useState("");
  const [bedroom, setBedroom] = useState(0);
  const [bathroom, setBathroom] = useState(0);
  const [den, setDen] = useState(0);
  const setters: any = {
    Bedroom: setBedroom,
    Bathroom: setBathroom,
    Den: setDen,
  };
  const maxSelectValue = 10;
  const roomOptions = ["Bedroom", "Bathroom", "Den"];
  const roomOptionDiv = Array.from(roomOptions, (_, i) => (
    <select
      onChange={(e: any) => {
        handleSelectChange(_, e["target"]["value"]);
      }}
      className="select select-primary max-w-xs rounded-full"
    > 
        <option disabled selected> {_} </option>
            {Array.from({ length: maxSelectValue + 1 }, (_, i) => i).map((value) => (
        <option value={value}>{value}</option>
      ))}
    </select>
  ));  

  const handleSelectChange = (type: string, value: number) => {
    const selectedType = setters[type];
    return selectedType && selectedType(value);
  };

  const inputValidation = () => {
    if(!address || !bedroom || !bathroom || !den){
      alert("Please fill in all fields")
      return false
    }
    if(bedroom === 0 || bathroom === 0) {
      alert("Please make sure the information are correct")
      return false
    }
    return true
  }
  const getPrediction = async () => {
    if(!inputValidation()) {
      return
    }
    const coordinates = await getLatLongByAddress(address);
    const param: PredictParam = {
      bedroom: bedroom,
      bathroom: bathroom,
      den: den,
      lat: coordinates["data"]["features"][0]["geometry"]["coordinates"][1],
      long: coordinates["data"]["features"][0]["geometry"]["coordinates"][0],
    };
    const predictedPrice = await getPredictionByUserInput(param);
    onSearchChange(true);
    onPriceChange(JSON.parse(predictedPrice.data)[0][0])
    return JSON.parse(predictedPrice.data)[0][0];
  };  
  return (
    <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56 h-full flex items-center justify-center">
      <div className="text-center opacity-80 rounded-lg">
          <h1 className="text-4xl font-bold tracking-tight text-green-800 sm:text-6xl">
          Rental Price Predictions
          </h1>
          <div className="relative mt-4 rounded-md shadow-sm">
          <textarea
              className="w-full rounded-3xl h-8 textarea-primary textarea textarea-bordered"
              placeholder="Start by entering your address"
              onInput={(e) => setAddress(e.currentTarget.value)}
          ></textarea>
          </div>
          <div className="flex gap-6 justify-center">{roomOptionDiv}</div>
          <div className="mt-10 flex items-center justify-center gap-x-6">
          <button className="flex items-center gap-1 rounded-full btn btn-primary" onClick={() => getPrediction()}>Predict Now</button>
          </div>
      </div>
    </div>
  );
}

export default Search;

