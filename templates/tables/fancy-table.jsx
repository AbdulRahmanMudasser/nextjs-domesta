import React, { useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Image from "next/image";

const FancyTable = ({ fields, data, title, filterOptions, rightOptionsHtml }) => {
  // Generic filter options for status (can be extended for other fields)
  const genericFilterOptions = [
    { value: "all", label: "All" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Pending", label: "Pending" }, // For interviews
    { value: "Confirmed", label: "Confirmed" }, // For interviews
    { value: "Upcoming", label: "Upcoming" }, // For interviews
    { value: "Past", label: "Past" }, // For interviews
  ];

  // Use provided filterOptions if available, otherwise use generic ones
  const activeFilterOptions = filterOptions.length > 0 ? filterOptions : genericFilterOptions;

  // State to manage selected filter
  const [selectedFilter, setSelectedFilter] = useState(activeFilterOptions[0].value);

  // Handle filter change
  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  // Filter data based on selected filter
  const filteredData = selectedFilter === "all"
    ? data
    : data.filter(row => 
        row.status === selectedFilter || 
        row.label === selectedFilter || 
        row.status === selectedFilter
      );

  return (
    <div className="ls-widget">
      <div className="tabs-box">
        {/* Table Header */}
        <div className="widget-title">
          <h4>{title}</h4>

          <div className="chosen-outer">
            {/* Filter Dropdown */}
            <select
              className="chosen-single form-select"
              value={selectedFilter}
              onChange={handleFilterChange}
            >
              {activeFilterOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <div dangerouslySetInnerHTML={{ __html: rightOptionsHtml }} />
          </div>
        </div>
        {/* End filter top bar */}

        {/* Start table widget content */}
        <div className="widget-content">
          <div className="table-outer">
            <table className="default-table manage-job-table">
              <thead>
                <tr>
                  {fields.map((field, index) => (
                    <th key={index}>{field.label}</th>
                  ))}
                  <th>Action</th> {/* Add Action column header */}
                </tr>
              </thead>

              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {fields.map((field, colIndex) => (
                        <td key={colIndex} className={field.className}>
                          {field.render ? field.render(row, row) : row[field.key]}
                        </td>
                      ))}
                      {/* Add Action column */}
                      <td>
                        <div className="option-box">
                          <ul className="option-list">
                            <li>
                              <button data-text="View Application">
                                <span className="la la-eye"></span>
                              </button>
                            </li>
                            <li>
                              <button data-text="Reject Application">
                                <span className="la la-pencil"></span>
                              </button>
                            </li>
                            <li>
                              <button data-text="Delete Application">
                                <span className="la la-trash"></span>
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={fields.length + 1} style={{ textAlign: "center", padding: "1rem" }}>
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* End table widget content */}
      </div>
    </div>
  );
};

FancyTable.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired, // The key in the data object
      label: PropTypes.string.isRequired, // The column header label
      className: PropTypes.string, // Optional class for the column
      render: PropTypes.func, // Optional custom render function
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired, // The table data
  title: PropTypes.string.isRequired, // The table title
  filterOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired, // Filter dropdown options
  rightOptionsHtml: PropTypes.string, // Optional HTML for right options
};

export default FancyTable;