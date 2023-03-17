interface ResultProps {
  onSearchChange: (newSearched: boolean) => void, 
  price: number,
}
const Result = (props: ResultProps) => {
  const { onSearchChange, price } = props;
  const restoreDefault = () => { onSearchChange(false); };
  const redirectLinks = {
    github: "https://github.com/tutuCH/toronto_rental_prediction",
  }  
  const handleRedirect = (destination: 'github') => {
    window.open(redirectLinks[destination], '_blank', 'noreferrer');
  }    
  return (
    <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56 h-full flex items-center justify-center">
      <div className="text-center opacity-80 rounded-lg">
        <p className="text-xl tracking-tight text-green-800 sm:text-3xl">
          The Predicted Price is:
        </p>
        <div className="flex items-center gap-1">
          <h1 className="text-4xl font-bold tracking-tight text-green-800 sm:text-6xl">
            {`$${price}`}
          </h1>
          <p className="text-xl font-bold tracking-tight text-green-800 sm:text-4xl"> (per month)</p>
        </div>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button className="flex items-center gap-1 rounded-full btn btn-primary" onClick={() => restoreDefault()}>Try Again</button>
          <button className="btn btn-active btn-link" onClick={() => handleRedirect('github')}>Learn more</button>
        </div>
      </div>
    </div>
  );
};

export default Result;
