import React, { useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Image from "next/image";

const FancyTableV2 = ({ fields, data, title, filterOptions, rightOptionsHtml }) => {
  // State for filter values
  const [filters, setFilters] = useState(
    filterOptions.reduce((acc, option) => {
      acc[option.key] = "";
      return acc;
    }, {})
  );

  // Handle filter input changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Filter data based on all active filters
  const filteredData = data.filter((row) =>
    Object.keys(filters).every((key) => {
      if (!filters[key]) return true; // Skip empty filters
      const filterOption = filterOptions.find((opt) => opt.key === key);
      const cellValue = row[key]?.toString().toLowerCase() || "";
      if (filterOption.type === "text") {
        return cellValue.includes(filters[key].toLowerCase());
      } else if (filterOption.type === "select") {
        return cellValue === filters[key].toLowerCase();
      }
      return true;
    })
  );

  // Define profile icon column
  const profileColumn = {
    key: "profileIcon",
    label: "Profile",
    className: "profile-column",
    render: () => (
      <span className="la la-user" style={{ fontSize: "1.5rem", color: "#333" }}></span>
    ),
  };

  // Combine profile column with provided fields
  const allFields = [profileColumn, ...fields];

  return (
    <div style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h4 style={{ fontSize: "1.5rem", color: "#333", margin: 0 }}>{title}</h4>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }} dangerouslySetInnerHTML={{ __html: rightOptionsHtml }} />
      </div>

      {/* Filter Inputs */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        {filterOptions.map((option, index) => (
          <div key={index} style={{ flex: "1 1 200px" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                color: "#555",
                marginBottom: "0.25rem",
              }}
            >
              {option.label}
            </label>
            {option.type === "text" ? (
              <input
                type="text"
                value={filters[option.key] || ""}
                onChange={(e) => handleFilterChange(option.key, e.target.value)}
                placeholder={`Filter by ${option.label}`}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                  color: "#333",
                  backgroundColor: "#f9f9f9",
                }}
              />
            ) : option.type === "select" ? (
              <select
                value={filters[option.key] || ""}
                onChange={(e) => handleFilterChange(option.key, e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                  color: "#333",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <option value="">All {option.label}</option>
                {option.options.map((opt, idx) => (
                  <option key={idx} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : null}
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#fff",
            fontSize: "0.875rem",
          }}
        >
          <thead>
            <tr>
              {allFields.map((field, index) => (
                <th
                  key={index}
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    borderBottom: "2px solid #ddd",
                    color: "#333",
                    fontWeight: "600",
                  }}
                >
                  {field.label}
                </th>
              ))}
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "left",
                  borderBottom: "2px solid #ddd",
                  color: "#333",
                  fontWeight: "600",
                }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  style={{
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {allFields.map((field, colIndex) => (
                    <td
                      key={colIndex}
                      className={field.className}
                      style={{
                        padding: "0.75rem",
                        color: "#555",
                      }}
                    >
                      {field.render ? field.render(row, row) : row[field.key]}
                    </td>
                  ))}
                  <td style={{ padding: "0.75rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        title="View Application"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#333",
                          fontSize: "1rem",
                        }}
                      >
                        <span className="la la-eye"></span>
                      </button>
                      <button
                        title="Edit Application"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#333",
                          fontSize: "1rem",
                        }}
                      >
                        <span className="la la-pencil"></span>
                      </button>
                      <button
                        title="Delete Application"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#333",
                          fontSize: "1rem",
                        }}
                      >
                        <span className="la la-trash"></span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={allFields.length + 1}
                  style={{
                    textAlign: "center",
                    padding: "1rem",
                    color: "#555",
                  }}
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

FancyTableV2.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      className: PropTypes.string,
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
  filterOptions: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["text", "select"]).isRequired,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
  rightOptionsHtml: PropTypes.string,
};

export default FancyTableV2;