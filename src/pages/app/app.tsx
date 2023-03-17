import { useState } from "react";
import Search from './sections/Search';
import Result from './sections/Result';
import background from "../../assets/images/toronto-background.jpeg"
import '../../index.css'
const App = () => {
  const [searched, setSearched] = useState(false);
  const [price, setPrice] = useState(0);
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
        src={background}
        alt='toronto-background'
      />
      <main className="relative backdrop-blur h-full">
      {!searched ? (<Search onSearchChange={handleSearchChange} onPriceChange={handlePriceChange}/>) : <Result onSearchChange={handleSearchChange} price={price}/>}
        
      </main>
    </div>
  );
};

export default App;