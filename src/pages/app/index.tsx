import { useState } from "react";
import Search from './sections/Search';
import Result from './sections/Result';
import '../../index.css'

const App = () => {
  const [searched, setSearched] = useState(false);
  const [price, setPrice] = useState(0);
  const background = {
    path: "../../assets/images/toronto-background.jpeg",
    alt: "toronto-background",
  };
  const handleSearchChange = (newState:boolean) => {
    setSearched(newState);
  }
  const handlePriceChange = (newPrice: number) => {
    setPrice(newPrice);
  }

  return (
    <div className="h-screen relative">
      <img
        className="absolute inset-0 w-full h-full opacity-40 object-cover"
        src={background.path}
        alt={background.alt}
      />
      <main className="relative backdrop-blur h-full">
      {!searched ? (<Search onSearchChange={handleSearchChange} onPriceChange={handlePriceChange}/>) : <Result onSearchChange={handleSearchChange} price={price}/>}
        
      </main>
    </div>
  );
};

export default App;