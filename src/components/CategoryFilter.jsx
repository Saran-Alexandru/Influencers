import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { influencers } from '../data/influencerData';

const CategoryFilter = ({ filters, handleCategoryChange }) => {
  const [filteredInfluencers, setFilteredInfluencers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);
  
  const getCategories = () => {
    const uniqueCategories = [...new Set(influencers.map(inf => inf.category))];
    return ['All', ...uniqueCategories];
  };

  const categories = getCategories();
  const firstRowCategories = categories.slice(0, 5);
  const remainingCategories = categories.slice(5);

  useEffect(() => {
    setActiveCategory(filters.category || 'All');
  }, [filters.category]);

  return (
    <div className="w-full bg-white shadow-sm rounded-xl p-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="bg-blue-50 p-1.5 rounded-lg">
            <Filter className="w-4 h-4 text-blue-500" />
          </div>
          <h2 className="text-base font-semibold text-gray-800">Categories</h2>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 w-full">
          {firstRowCategories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange({
                target: { value: category === 'All' ? 'all' : category.toLowerCase() }
              })}
              className={`
                px-3 py-2 rounded-md text-xs font-medium transition-all duration-200
                hover:transform hover:scale-102
                ${filters.category === (category === 'All' ? 'all' : category.toLowerCase())
                  ? 'bg-blue-500 text-white shadow-sm ring-1 ring-blue-300'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                } flex items-center justify-center`}
            >
              {category}
            </button>
          ))}
          
          {remainingCategories.length > 0 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-3 py-2 rounded-md text-xs font-medium transition-all duration-200
                bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200
                flex items-center justify-center gap-1"
            >
              {showAll ? (
                <>Less <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>More <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          )}
        </div>

        {showAll && remainingCategories.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 w-full">
            {remainingCategories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange({
                  target: { value: category === 'All' ? 'all' : category.toLowerCase() }
                })}
                className={`
                  px-3 py-2 rounded-md text-xs font-medium transition-all duration-200
                  hover:transform hover:scale-102
                  ${filters.category === (category === 'All' ? 'all' : category.toLowerCase())
                    ? 'bg-blue-500 text-white shadow-sm ring-1 ring-blue-300'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  } flex items-center justify-center`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;
