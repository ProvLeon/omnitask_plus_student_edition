import React, { useState, useEffect } from 'react';

interface DropDownProps {
  options: string[];
  priority: string;
  onChange: (priority: string) => void;
}

const DropDown: React.FC<DropDownProps> = ({ options = ['Low', 'Medium', 'High'], priority, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(priority || '');

  useEffect(() => {
    setSelectedOption(priority);
  }, [priority]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    onChange(option);
    setIsOpen(false);
  };

  const getButtonBgColor = () => {
    const index = options ? options.indexOf(selectedOption) : -1;
    switch (index) {
      case 0:
        return 'bg-red-500';
      case 1:
        return 'bg-yellow-500';
      case 2:
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="relative dark:bg-gray-800" >
      <button onClick={toggleDropdown} className={` px-2 py-1 w-20 text-[12px] ${getButtonBgColor()} text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300`}>
        {selectedOption}
      </button>
      {isOpen && (
        <ul className={`z-10 absolute dark:bg-gray-900 left-0 right-0 mt-2  transition ease-in-out duration-1000 bg-white shadow-lg rounded-md ${isOpen ? 'overflow-auto' : 'overflow-hidden'}`}>
          {options.map((option, index) => (
            <li key={index} className="px-4 py-2 hover:rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer" onClick={() => handleOptionClick(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropDown;
