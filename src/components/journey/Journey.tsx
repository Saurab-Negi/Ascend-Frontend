
import type { JourneyProps } from '../../types/journey';

function Journey({ bgColor, icon, title, description, onclick }: JourneyProps) {
  return (
   <div className="w-full md:w-[48%] py-5">
  <div className={`relative bg-[${bgColor}] text-white rounded-xl p-4`} style={{ backgroundColor: bgColor }}>
    
    {/* Responsive layout: col on small, row on medium+ */}
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
      
      {/* Icon */}
      <div className={`w-14 h-14 text-2xl bg-white text-[${bgColor}] rounded-full flex items-center justify-center`} style={{ color: bgColor }}>
        {icon}
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm sm:text-base text-white text-start">{description}</p>
      </div>
    </div>

    {/* Start Button */}
    <button
      className="absolute -bottom-4 right-3 bg-[#D4CDC3] text-[#004236] text-sm font-semibold px-5 py-2 rounded-lg"
      onClick={onclick}
    >
      Start
    </button>
  </div>
</div>


  )
}

export default Journey