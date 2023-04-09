import { useState } from "react";
import { PredictParam } from "../../../assets/data/dataDef";
import { MdArrowForward, } from "react-icons/md";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { ApiValidate, getLatLongByAddress, getPredictionByUserInput } from "../../../utils/apiServices";
import '../../../index.css'
import Model from "../../../components/Model";
import { MODEL_ID, MODEL_MESSAGES } from "../../../utils/data";

interface SearchProps {
  onSearchChange: (newSearched: boolean) => void, 
  onPriceChange: (newPrice: number) => void
}

function Search(props: SearchProps) {
  const { onSearchChange, onPriceChange } = props;
  const [address, setAddress] = useState("");
  const [bedroom, setBedroom] = useState<number>(0);
  const [bathroom, setBathroom] = useState<number>(0);
  const [den, setDen] = useState<number>(0);
  const [isShownModel, setIsShownModel] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modelId, setModelId] = useState<keyof typeof MODEL_MESSAGES>('');
  const setters: any = {
    Bedroom: setBedroom,
    Bathroom: setBathroom,
    Den: setDen,
  };
  const maxSelectValue = 10;
  const roomOptions = ["Bedroom", "Bathroom", "Den"];
  const noteMessage = "Note: Our rental price prediction is based on 2018 data. Actual rental prices may vary due to market conditions and other factors.";
  const roomOptionDiv = Array.from(roomOptions, (roomType, i) => (
    <select
      key={roomType}
      onChange={(e: any) => { handleSelectChange(roomType, e["target"]["value"]); }}
      className="select select-primary max-w-xs rounded-full"
      defaultValue={roomType}
    > 
        <option key={-1} disabled> {roomType} </option>
        { 
          Array.from({ length: maxSelectValue + 1 }, (_, i) => i).map((value) => ( <option key={Number(value)} value={value}>{Number(value)}</option> ))
        }
    </select>
  ));  

  const resetStates = () => {
    setAddress('')
    roomOptions.forEach((roomType: string) => {
      handleSelectChange(roomType, 0)
    })  
    setIsLoading(false)
  }


  const handleError = (error: keyof typeof MODEL_MESSAGES) => {
    setModelId(error);
    setIsShownModel(true);
    resetStates();
  }
  const handleSelectChange = (type: string, value: number) => {
    const selectedType = setters[type];
    return selectedType && selectedType(value);
  };

  const inputValidation = () => {
    if([address].some((_) => !_ )) {
      handleError(MODEL_ID.MISSING_INPUT);
      return false
    }
    return true
  }

  const getLatLong = async () => {
    const coordinates = await getLatLongByAddress(address);
    if(ApiValidate(coordinates)){
      if(coordinates["data"]["features"][0]["properties"]["city"] === 'Toronto') {
        return [coordinates["data"]["features"][0]["geometry"]["coordinates"][1], coordinates["data"]["features"][0]["geometry"]["coordinates"][0]]
      } else {
        handleError(MODEL_ID.ADDRESS_OUT_OF_BOUND)
        return
      }
    } else {
      handleError(MODEL_ID.API_ERROR)
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
      handleError(MODEL_ID.API_ERROR)
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
          <h1 className="text-4xl font-bold tracking-tight text-green-800 sm:text-6xl flex flex-col-reverse">
            Rental Price Predictions
            <div className="tooltip opacity-90 tooltip-left self-end h-8 w-8" data-tip={noteMessage}>
              <HiOutlineInformationCircle className="transform scale-50"/>
            </div>
          </h1>

          <div className="relative mt-4 rounded-md shadow-sm">
          <textarea
              className="w-full rounded-3xl h-8 textarea-primary textarea textarea-bordered"
              placeholder="Start by entering your address"
              onInput={(e) => setAddress(e.currentTarget.value)}
              value={address}
          ></textarea>
          </div>
          <div className="flex gap-6 justify-center mt-3">{roomOptionDiv}</div>
          <div className="mt-10 flex items-center justify-center gap-x-6">
          <button className="flex items-center gap-1 rounded-full btn btn-primary" onClick={() => getPrediction()}>Predict Now <MdArrowForward/> </button>
          </div>
        </div>
      }
      <Model id={modelId} isShown={isShownModel} onShown={setIsShownModel}/>
      { isLoading && <progress className="progress progress-primary w-32"></progress>}
    </div>
  );
}

export default Search;

