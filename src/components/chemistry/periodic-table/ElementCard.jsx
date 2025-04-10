import React from 'react';

const ElementCard = ({ element, onClick }) => {
  if (!element) {
    return <div className="w-14 h-14"></div>;
  }
  
  // Define colors for different element categories
  const categoryColors = {
    'alkali metal': 'bg-red-100 hover:bg-red-200 border-red-300',
    'alkaline earth metal': 'bg-orange-100 hover:bg-orange-200 border-orange-300',
    'transition metal': 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300',
    'post-transition metal': 'bg-green-100 hover:bg-green-200 border-green-300',
    'metalloid': 'bg-teal-100 hover:bg-teal-200 border-teal-300',
    'nonmetal': 'bg-blue-100 hover:bg-blue-200 border-blue-300',
    'halogen': 'bg-indigo-100 hover:bg-indigo-200 border-indigo-300',
    'noble gas': 'bg-purple-100 hover:bg-purple-200 border-purple-300',
    'lanthanide': 'bg-pink-100 hover:bg-pink-200 border-pink-300',
    'actinide': 'bg-rose-100 hover:bg-rose-200 border-rose-300'
  };
  
  const colorClass = categoryColors[element.category] || 'bg-gray-100 hover:bg-gray-200 border-gray-300';
  
  return (
    <button
      className={`w-14 h-14 ${colorClass} border rounded-md flex flex-col items-center justify-center p-1 transition-colors duration-200 text-left`}
      onClick={() => onClick(element)}
      title={element.name}
    >
      <div className="w-full flex justify-between items-center text-[10px]">
        <span>{element.number}</span>
        <span>{element.atomic_mass.toFixed(1)}</span>
      </div>
      <div className="text-lg font-bold">{element.symbol}</div>
      <div className="text-[8px] truncate w-full text-center">{element.name}</div>
    </button>
  );
};

export default ElementCard;
