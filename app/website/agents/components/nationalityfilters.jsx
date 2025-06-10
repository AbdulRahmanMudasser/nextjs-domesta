'use client';

import { useDispatch, useSelector } from "react-redux";
import { addCategoryCheck, clearCategory } from "@/features/filter/candidateFilterSlice";

const NationalityFilter = () => {
  const { category } = useSelector((state) => state.candidate) || {};
  const dispatch = useDispatch();

  const nationalities = [
    { id: 1, name: "Filipino", count: 620, flag: "/images/icons/Flag-Philippines.webp" },
    { id: 2, name: "Indian", count: 171, flag: "/images/icons/Flag_of_India.svg" },
    { id: 3, name: "Nepali", count: 222, flag: "/images/icons/Flag-Nepal.webp" },
    { id: 4, name: "Sri Lankan", count: 169, flag: "/images/icons/Flag-Sri-Lanka.webp" },
    { id: 5, name: "Indonesian", count: 37, flag: "/images/icons/Flag_of_Indonesia.svg.png" },
  ];

  const handleCategoryFilter = (id) => {
    dispatch(addCategoryCheck(id));
  };

  const handleClearCategory = () => {
    dispatch(clearCategory());
  };

  return (
    <div className="nationality-filter-container" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      gap: '70px',
      marginBottom:'20px',
      padding: '12px 0', 
      backgroundColor: '#F5F7FC', 
      borderRadius: '10px', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
    }}>
      {nationalities.map((nat) => {
        const categoryItem = category.find((item) => item.id === nat.id);
        const isActive = categoryItem?.isChecked || false;

        return (
          <button
            key={nat.id}
            onClick={() => handleCategoryFilter(nat.id)}
            className={`nationality-button ${isActive ? 'active' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 12px', 
              border: '1px solid #ddd',
              backgroundColor: '#fff',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px', 
              color: '#333',
              transition: 'all 0.3s ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              minWidth: '110px', 
              height: '60px', 
            }}
          >
            <img
              src={nat.flag}
              alt={`${nat.name} flag`}
              style={{ width: '32px', height: '22px', borderRadius: '2px' }} 
            />
            <div>
              <span style={{ fontWeight: '500', display: 'block' }}>{nat.name}</span>
              <span style={{ color: '#666', fontSize: '12px', display: 'block' }}>{nat.count} Professionals</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default NationalityFilter;