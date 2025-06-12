import React, { useState } from "react";
import PropTypes from "prop-types";

const FancyTableV2 = ({ fields, data, title, subtitle, filterOptions, rightOptionsHtml }) => {
  // State for filter values
  const [filters, setFilters] = useState(
    filterOptions.reduce((acc, option) => {
      acc[option.key] = "";
      return acc;
    }, {})
  );

  // State for selected rows
  const [selectedRows, setSelectedRows] = useState([]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Handle filter input changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters(
      filterOptions.reduce((acc, option) => {
        acc[option.key] = "";
        return acc;
      }, {})
    );
    setCurrentPage(1);
  };

  // Handle row selection
  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map((row) => row.id));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    console.log(`Deleting records: ${selectedRows.join(", ")}`);
    // Implement actual delete logic here (e.g., API call)
    setSelectedRows([]);
  };

  // Handle mark as paid
  const handleMarkAsPaid = () => {
    console.log(`Marking as paid: ${selectedRows.join(", ")}`);
    // Implement actual mark as paid logic here
    setSelectedRows([]);
  };

  // Handle status change
  const handleStatusChange = (e) => {
    const status = e.target.value;
    console.log(`Changing status to ${status} for records: ${selectedRows.join(", ")}`);
    // Implement actual status change logic here
    setSelectedRows([]);
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

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
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

  // Define checkbox column
  const checkboxColumn = {
    key: "checkbox",
    label: (
      <input
        type="checkbox"
        checked={selectedRows.length === filteredData.length && filteredData.length > 0}
        onChange={handleSelectAll}
        style={{
          cursor: "pointer",
          width: "16px",
          height: "16px",
          accentColor: "#000",
          backgroundColor: selectedRows.length === filteredData.length && filteredData.length > 0 ? "#000" : "#fff",
          border: "1px solid #ddd",
          borderRadius: "5px", // Rounded corners
        }}
      />
    ),
    className: "checkbox-column",
    render: (row) => (
      <input
        type="checkbox"
        checked={selectedRows.includes(row.id)}
        onChange={() => handleRowSelect(row.id)}
        style={{
          cursor: "pointer",
          width: "16px",
          height: "16px",
          accentColor: "#000",
          backgroundColor: selectedRows.includes(row.id) ? "#000" : "#fff",
          border: "1px solid #ddd",
          borderRadius: "5px", // Rounded corners
        }}
      />
    ),
  };

  // Combine columns
  const allFields = [checkboxColumn, profileColumn, ...fields];

  return (
    <div style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#333", margin: 0 }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: "1rem", color: "#555", margin: "0.25rem 0 1rem" }}>
          {subtitle}
        </p>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
        <div dangerouslySetInnerHTML={{ __html: rightOptionsHtml }} />
        <button
          onClick={handleClearFilters}
          title="Clear Filters"
          style={{
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "0.5rem",
            cursor: "pointer",
            color: "#333",
            fontSize: "1.25rem",
            display: "flex",
            alignItems: "center",
            width: "36px",
            height: "36px",
            justifyContent: "center",
          }}
        >
          <span className="la la-refresh"></span>
        </button>
        <button
          onClick={handleBulkDelete}
          disabled={selectedRows.length === 0}
          style={{
            backgroundColor: selectedRows.length === 0 ? "#676767" : "#000000",
            color: "#fff",
            padding: "0.3rem 1rem",
            border: "none",
            borderRadius: "4px",
            cursor: selectedRows.length === 0 ? "not-allowed" : "pointer",
            fontSize: "0.875rem",
          }}
        >
          Bulk Delete ({selectedRows.length})
        </button>
        <button
          onClick={handleMarkAsPaid}
          disabled={selectedRows.length === 0}
          style={{
            backgroundColor: selectedRows.length === 0 ? "#676767" : "#000000",
            color: "#fff",
            padding: "0.3rem 1rem",
            border: "none",
            borderRadius: "4px",
            cursor: selectedRows.length === 0 ? "not-allowed" : "pointer",
            fontSize: "0.875rem",
          }}
        >
          Mark as Paid ({selectedRows.length})
        </button>
        <select
          onChange={handleStatusChange}
          disabled={selectedRows.length === 0}
          style={{
            padding: "0.5rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "0.875rem",
            color: selectedRows.length === 0 ? "#aaa" : "#333",
            backgroundColor: "#f9f9f9",
            cursor: selectedRows.length === 0 ? "not-allowed" : "pointer",
          }}
        >
          <option value="">Change Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
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
                <option value="">-All {option.label}-</option>
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
            borderCollapse: "separate",
            borderSpacing: 0,
            backgroundColor: "#fff",
            fontSize: "0.875rem",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr>
              {allFields.map((field, index) => (
                <th
                  key={index}
                  style={{
                    padding: "1rem",
                    textAlign: "left",
                    color: "#333",
                    fontWeight: "600",
                  }}
                >
                  {field.label}
                </th>
              ))}
              <th
                style={{
                  padding: "1rem",
                  textAlign: "left",
                  color: "#333",
                  fontWeight: "600",
                }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  style={{
                    borderBottom: "1px solid #eee",
                    backgroundColor: selectedRows.includes(row.id) ? "#f0f0f0" : "#fff",
                  }}
                >
                  {allFields.map((field, colIndex) => (
                    <td
                      key={colIndex}
                      className={field.className}
                      style={{
                        padding: "1rem",
                        color: "#555",
                      }}
                    >
                      {field.render ? field.render(row, row) : row[field.key]}
                    </td>
                  ))}
                  <td style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", gap: "0.75rem" }}>
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

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1.5rem",
          fontSize: "0.875rem",
          color: "#555",
        }}
      >
        <div>
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} records
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <label style={{ marginRight: "0.5rem" }}>Rows per page:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            style={{
              padding: "0.25rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              padding: "0.25rem 0.75rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: currentPage === 1 ? "#f0f0f0" : "#fff",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            Previous
          </button>
          <span style={{ padding: "0.5rem" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              padding: "0.25rem 0.75rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: currentPage === totalPages ? "#f0f0f0" : "#fff",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

FancyTableV2.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
      className: PropTypes.string,
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
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

FancyTableV2.defaultProps = {
  subtitle: "",
  rightOptionsHtml: "",
};

export default FancyTableV2;