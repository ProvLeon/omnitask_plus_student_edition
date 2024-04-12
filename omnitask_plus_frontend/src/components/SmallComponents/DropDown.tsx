import React, { useState, useEffect } from 'react';

// Interface defining the props for the DropDown component
interface DropDownProps {
  options: string[]; // Array of options to display in the dropdown
  priority: string; // Selected priority value
  onChange: (priority: string) => void; // Function to handle change in selection
}

// DropDown component definition
const DropDown: React.FC<DropDownProps> = ({ options = ['Low', 'Medium', 'High'], priority, onChange }) => {
  const [isOpen, setIsOpen] = useState(false); // State to manage dropdown open/close
  const [selectedOption, setSelectedOption] = useState(priority || ''); // State to manage the selected option

  // Effect to update selectedOption when priority prop changes
  useEffect(() => {
    setSelectedOption(priority);
  }, [priority]);

  // Function to toggle dropdown open/close state
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Function to handle option selection
  const handleOptionClick = (option: string) => {
    setSelectedOption(option); // Update selected option
    onChange(option); // Trigger onChange callback with the new option
    setIsOpen(false); // Close the dropdown
  };

  // Function to determine button background color based on selected option
  const getButtonBgColor = () => {
    const index = options ? options.indexOf(selectedOption) : -1; // Find index of selected option
    switch (index) {
      case 0:
        return 'bg-red-500'; // Red for "Low"
      case 1:
        return 'bg-yellow-500'; // Yellow for "Medium"
      case 2:
        return 'bg-green-500'; // Green for "High"
      default:
        return 'bg-blue-500'; // Blue as default
    }
  };

  // Render the dropdown component
  return (
    <div className="relative dark:bg-gray-800 shadow-md rounded-md" >
      <button onClick={toggleDropdown} className={`px-2 py-1 w-20 text-[12px] hover:shadow-lg hover:bg-gray-400 ${getButtonBgColor()} text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-3000`}>
        {selectedOption} {/* Display the selected option */}
      </button>
      {isOpen && ( // Conditionally render dropdown options if isOpen is true
        <ul className={`z-10 absolute dark:bg-gray-900 left-0 right-0 mt-2 transition ease-in-out duration-1000 bg-white shadow-lg rounded-md ${isOpen ? 'overflow-auto' : 'overflow-hidden'}`}>
          {options.map((option, index) => (
            <li key={index} className="px-4 py-2 hover:rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer" onClick={() => handleOptionClick(option)}>
              {option} {/* Display each option */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropDown;
