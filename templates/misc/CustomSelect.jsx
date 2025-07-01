import React, { useState, useRef, useEffect } from 'react';

const CustomSelect = ({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select an option",
  className = "",
  style = {},
  disabled = false,
  allowClear = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [hoveredOption, setHoveredOption] = useState(null);
  const selectRef = useRef(null);

  useEffect(() => {
    // Find the selected option label
    const selectedOption = options.find(option => option.value === value);
    setSelectedLabel(selectedOption ? selectedOption.label : '');
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionSelect = (optionValue, optionLabel) => {
    onChange(optionValue);
    setSelectedLabel(optionLabel);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setSelectedLabel('');
    setIsOpen(false);
  };

  return (
    <div 
      ref={selectRef}
      className={`custom-select ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        ...style
      }}
    >
      {/* Select Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        style={{
          width: '100%',
          height: '48px',
          padding: '12px 16px',
          backgroundColor: disabled ? '#f0f5f7' : '#f0f5f7',
          border: '1px solid #dee2e6',
          borderRadius: '6px',
          fontSize: '14px',
          color: selectedLabel ? '#495057' : '#6c757d',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s ease',
          outline: 'none',
          boxShadow: 'none',
          borderColor: isOpen ? '#80bdff' : '#dee2e6'
        }}
        onMouseEnter={(e) => {
          if (!disabled && !isOpen) {
            e.target.style.borderColor = '#adb5bd';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !isOpen) {
            e.target.style.borderColor = '#dee2e6';
          }
        }}
      >
        <span style={{ 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          whiteSpace: 'nowrap',
          flex: 1
        }}>
          {selectedLabel || placeholder}
        </span>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Clear Button */}
          {(allowClear || selectedLabel) && selectedLabel && (
            <>
              <button
                type="button"
                onClick={handleClear}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px',
                  borderRadius: '2px',
                  color: '#6c757d'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e9ecef';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              
              {/* Vertical Divider */}
              <div style={{
                width: '1px',
                height: '20px',
                backgroundColor: '#dee2e6',
                flexShrink: 0
              }} />
            </>
          )}
          
          {/* Dropdown Arrow */}
          <svg
            style={{
              width: '16px',
              height: '16px',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.15s ease',
              color: '#6c757d'
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: '#ffffff',
            border: '1px solid #dee2e6',
            borderRadius: '6px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            marginTop: '2px',
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          {options.map((option, index) => {
            const isSelected = value === option.value;
            const isHovered = hoveredOption === index;
            
            return (
              <button
                key={option.value || index}
                type="button"
                onClick={() => handleOptionSelect(option.value, option.label)}
                onMouseEnter={() => setHoveredOption(index)}
                onMouseLeave={() => setHoveredOption(null)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: isSelected ? '#007bff' : isHovered ? '#e7f3ff' : 'transparent',
                  border: 'none',
                  borderBottom: index < options.length - 1 ? '1px solid #f1f3f4' : 'none',
                  textAlign: 'left',
                  fontSize: '14px',
                  color: isSelected ? '#ffffff' : '#495057',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'block'
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;