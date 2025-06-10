import React from "react";
import PropTypes from "prop-types";

const SimpleTable = ({ fields, data }) => {
  return (
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
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {fields.map((field, colIndex) => (
              <td key={colIndex} className={field.className}>
                {field.render ? field.render(row[field.key], row) : row[field.key]}
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
        ))}
      </tbody>
    </table>
  );
};

SimpleTable.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired, // The key in the data object
      label: PropTypes.string.isRequired, // The column header label
      className: PropTypes.string, // Optional class for the column
      render: PropTypes.func, // Optional custom render function
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired, // The table data
};

export default SimpleTable;
