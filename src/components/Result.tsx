import type { Component } from "solid-js";
import { VsRefresh } from 'solid-icons/vs'

const Result: Component<{ onSearchChange: (newSearched: boolean) => void; price: number; }> = (props) => {
  const restoreDefault = () => { props.onSearchChange(false); };
  const redirectLinks = {
    github: "https://github.com/tutuCH/toronto_rental_prediction",
  }  
  const handleRedirect = (destination: 'github') => {
    window.open(redirectLinks[destination], '_blank', 'noreferrer');
  }  
  return (
    <div class="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56 h-full flex items-center justify-center">
      <div class="text-center opacity-80 rounded-lg">
        <p class="text-xl tracking-tight text-green-800 sm:text-3xl">
          The Predicted Price is:
        </p>
        <div class="flex items-center gap-1">
          <h1 class="text-4xl font-bold tracking-tight text-green-800 sm:text-6xl">
            {`$${props.price}`}
          </h1>
          <p class="text-xl font-bold tracking-tight text-green-800 sm:text-4xl"> (per month)</p>
        </div>

        <div class="mt-10 flex items-center justify-center gap-x-6">
          <button class="flex items-center gap-1 rounded-full btn btn-primary" onClick={() => restoreDefault()}>Try Again<VsRefresh /></button>
          <button class="btn btn-active btn-link" onClick={() => handleRedirect('github')}>Learn more</button>
        </div>
      </div>
    </div>
  );
};

export default Result;
