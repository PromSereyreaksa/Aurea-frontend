import React from "react";

const StatsCard = ({
  icon,
  title,
  value,
  change,
  changeType,
  color = "blue",
}) => {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-[#fb8500]",
  };

  const bgClasses = {
    blue: "bg-blue-50",
    green: "bg-green-50",
    purple: "bg-purple-50",
    orange: "bg-[#fb8500]/5",
  };

  return (
    <div className="relative h-full border-2 border-neutral-200 bg-white overflow-hidden group hover:border-[#fb8500] transition-all duration-300">
      {/* Decorative elements */}
      <div className={`absolute top-4 right-4 w-12 h-12 ${colorClasses[color]} opacity-5`}></div>
      <div className={`absolute bottom-4 left-4 w-8 h-8 border-2 ${color === 'orange' ? 'border-[#fb8500]' : color === 'purple' ? 'border-purple-600' : 'border-blue-600'} opacity-20`}></div>
      
      <div className="relative p-8">
        {/* Icon in colored square */}
        <div className={`inline-flex items-center justify-center w-14 h-14 ${colorClasses[color]} mb-6 group-hover:scale-110 transition-transform duration-300`}>
          <div className="text-white w-8 h-8">{icon}</div>
        </div>

        {/* Value */}
        <div className="mb-2">
          <div className="text-5xl font-black text-[#1a1a1a] leading-none">
            {value}
          </div>
        </div>

        {/* Title */}
        <div className={`text-sm font-bold uppercase tracking-wider ${color === 'orange' ? 'text-[#fb8500]' : color === 'purple' ? 'text-purple-600' : 'text-blue-600'} mb-4`}>
          {title}
        </div>

        {/* Trend/Change */}
        {change && (
          <div className="text-sm text-neutral-600 font-medium">
            {change}
          </div>
        )}

        {/* Growing bottom line */}
        <div className={`absolute bottom-0 left-0 h-1 w-0 ${colorClasses[color]} group-hover:w-full transition-all duration-500`}></div>
      </div>
    </div>
  );
};

export default StatsCard;
