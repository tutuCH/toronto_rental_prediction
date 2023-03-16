import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import { PredictParam } from "../../data/dataDef";
import { getLatLongByAddress, getPredictionByUserInput,} from "../../util/apiServices";
import Search from "./Components/Search";
import Result from "./Components/Result";
const Landing: Component = () => {
  const [searched, setSearched] = createSignal(false);
  const [price, setPrice] = createSignal(0);
  const maxSelectValue = 10;
  const background = {
    path: "../../../assets/image/toronto-background.jpeg",
    alt: "toronto-background",
  };
  const handleSearchChange = (newState:boolean) => {
    setSearched(newState);
  }
  const handlePriceChange = (newPrice: number) => {
    setPrice(newPrice);
  }
  return (
    <div class="h-screen relative">
      <img
        class="absolute inset-0 w-full h-full opacity-40 object-cover"
        src={background.path}
        alt={background.alt}
      />
      <main class="relative backdrop-blur h-full">
        {!searched() ? (<Search onSearchChange={handleSearchChange} onPriceChange={handlePriceChange}/>) : <Result onSearchChange={handleSearchChange} price={price()}/>}
        
      </main>
    </div>
  );
};

export default Landing;