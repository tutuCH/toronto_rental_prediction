import { useState } from "react";
import { PredictParam } from "../../../assets/data/dataDef";

import { ApiValidate, getLatLongByAddress, getPredictionByUserInput } from "../../../utils/apiServices";
import '../../../index.css'
import Model from "../../../components/Model";
import { API_LIST } from "../../../utils/apiList";
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
  const [isShownApiErrorModel, setIsShownApiErrorModel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setters: any = {
    Bedroom: setBedroom,
    Bathroom: setBathroom,
    Den: setDen,
  };
  const maxSelectValue = 10;
  const roomOptions = ["Bedroom", "Bathroom", "Den"];
  const roomOptionDiv = Array.from(roomOptions, (_, i) => (
    <select
      key={_}
      onChange={(e: any) => { handleSelectChange(_, e["target"]["value"]); }}
      className="select select-primary max-w-xs rounded-full"
      defaultValue={_}
    > 
        <option key={0} disabled> {_} </option>
        { 
          Array.from({ length: maxSelectValue + 1 }, (_, i) => i).map((value) => ( <option key={value} value={value}>{value}</option> ))
        }
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

  const getLatLong = async () => {
    const coordinates = await getLatLongByAddress(address);
    if(ApiValidate(coordinates)){      
      return [coordinates["data"]["features"][0]["geometry"]["coordinates"][1], coordinates["data"]["features"][0]["geometry"]["coordinates"][0]]
    } else {
      setIsShownApiErrorModel(true);
      return
    }
  }

  const getPredictedPriceByUserInput = async (param: PredictParam) => {
    const predictedPrice = await getPredictionByUserInput(param);
    setIsLoading(false)
    if(ApiValidate(predictedPrice)){
      onSearchChange(true);
      onPriceChange(JSON.parse(predictedPrice.data)[0][0])
      return JSON.parse(predictedPrice.data)[0][0];
    } else {
      setIsShownApiErrorModel(true);
      return
    }
  }

  const getPrediction = async () => {
    if(!inputValidation()) return
    setIsLoading(true)
    const coordinates = await getLatLong();
    if(Array.isArray(coordinates)) {
      const param: PredictParam = {
        bedroom: bedroom,
        bathroom: bathroom,
        den: den,
        lat: coordinates[0],
        long: coordinates[1],
      };
      return await getPredictedPriceByUserInput(param)
    }

  };

  return (
    <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56 h-full flex items-center justify-center">
      { !isLoading &&
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
      }
      <Model id={API_LIST.apiError} isShown={isShownApiErrorModel} onShown={setIsShownApiErrorModel}/>
      { isLoading && <progress className="progress progress-primary w-32"></progress>}
    </div>
  );
}

export default Search;

