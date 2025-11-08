

const LayeredSpinner = () => {
  return (
    <div className="flex h-screen flex-col justify-center items-center gap-4 p-8">
      <div className="relative w-20 h-20">
        <div className="absolute w-full h-full rounded-full border-4 border-t-green-500 border-transparent animate-spin"></div>
        <div className="absolute w-4/5 h-4/5 top-[10%] left-[10%] rounded-full border-4 border-t-blue-500 border-transparent animate-spin-reverse" style={{ animationDuration: '1.2s' }}></div>
        <div className="absolute w-3/5 h-3/5 top-[20%] left-[20%] rounded-full border-4 border-t-yellow-500 border-transparent animate-spin" style={{ animationDuration: '0.9s' }}></div>
      </div>
     <div className="text-gray-600 relative text-semibold text-2xl flex items-center">
  Loading
  <span className="ml-1 w-6 inline-block text-left relative after:content-['.'] after:animate-ellipsis" />
</div>

    </div>
  );
};

export default LayeredSpinner;