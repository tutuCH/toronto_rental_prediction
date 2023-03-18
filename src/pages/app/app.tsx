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
      <footer className="fixed bottom-2 flex w-full items-center justify-center text-primary">
        Note: Our rental price prediction is based on 2018 data. Actual rental prices may vary due to market conditions and other factors.
      </footer>
      </main>
    </div>
  );
};

export default App;