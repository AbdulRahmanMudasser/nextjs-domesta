
'use client'

import React, { useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import InputField from "@/templates/inputs/input-field";
import SelectField from "@/templates/inputs/select-field";

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "0.25rem",
  backgroundColor: "#F0F5F7",
  boxSizing: "border-box",
  height: "41.5px",
  minHeight: "41.5px",
  border: "1px solid #ddd",
  fontSize: "0.875rem",
  color: "#333",
};

const selectStyle = {
  width: "100%",
  borderRadius: "0.5rem",
  backgroundColor: "#f0f5f7",
  height: "41.5px",
  minHeight: "41.5px",
  border: "1px solid #ddd",
  fontSize: "0.875rem",
  color: "#333",
};

const FancyTableV2 = ({ fields, data, title, filterOptions, rightOptionsHtml, handleBulkDelete, customActions }) => {
  const [filters, setFilters] = useState(
    filterOptions.reduce((acc, option) => {
      acc[option.key] = option.type === "select" && option.isMulti ? [] : "";
      return acc;
    }, {})
  );
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters(
      filterOptions.reduce((acc, option) => {
        acc[option.key] = option.type === "select" && option.isMulti ? [] : "";
        return acc;
      }, {})
    );
    setCurrentPage(1);
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map((row) => row.id));
    }
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    console.log(`Changing status to ${status} for records: ${selectedRows.join(", ")}`);
    setSelectedRows([]);
  };

  const filteredData = data.filter((row) =>
    Object.keys(filters).every((key) => {
      if (!filters[key] && filters[key] !== 0) return true;
      const filterOption = filterOptions.find((opt) => opt.key === key);
      const cellValue = row[key]?.toString().toLowerCase() || "";
      if (filterOption.type === "text") {
        return cellValue.includes(filters[key].toLowerCase());
      } else if (filterOption.type === "select") {
        if (filterOption.isMulti && Array.isArray(filters[key])) {
          return filters[key].length === 0 || filters[key].includes(cellValue);
        }
        return filters[key] === "" || cellValue === filters[key].toLowerCase();
      }
      return true;
    })
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const profileColumn = {
    key: "profileIcon",
    label: "Profile",
    className: "profile-column",
    render: () => (
      <img
        src="/images/demo-profile.jpg"
        alt="Profile"
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
    ),
  };

  const checkboxColumn = {
    key: "checkbox",
    label: (
      <input
        type="checkbox"
        checked={selectedRows.length === filteredData.length && filteredData.length > 0}
        onChange={handleSelectAll}
        style={{
          cursor: "pointer",
          width: "14px",
          height: "14px",
          accentColor: "#747c4d",
          backgroundColor: selectedRows.length === filteredData.length && filteredData.length > 0 ? "#747c4d" : "#fff",
          border: "1px solid #ddd",
          borderRadius: "4px",
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
          width: "14px",
          height: "14px",
          accentColor: "#747c4d",
          backgroundColor: selectedRows.includes(row.id) ? "#747c4d" : "#fff",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      />
    ),
  };

  const defaultActionColumn = {
    key: "actions",
    label: "Action",
    render: (row) => (
      <div className="option-box">
        <ul className="option-list" style={{ display: "flex", gap: "0.5rem" }}>
          <li>
            <Link
              href={`/website/employees/profile/${row.id}`}
              title="View Profile"
              data-text="View Profile"
            >
              <span className="la la-eye"></span>
            </Link>
          </li>
          <li>
            <Link
              href={`/website/employees/edit/${row.id}`}
              title="Edit Profile"
              data-text="Edit Profile"
            >
              <span className="la la-pencil"></span>
            </Link>
          </li>
          <li>
            <Link
              href={`/website/employees/documents/${row.id}`}
              title="View Documents"
              data-text="View Documents"
            >
              <span className="la la-file-alt"></span>
            </Link>
          </li>
          <li>
            <button
              title="Delete Record"
              data-text="Delete Record"
              onClick={() => handleBulkDelete([row.id])}
            >
              <span className="la la-trash"></span>
            </button>
          </li>
        </ul>
      </div>
    ),
  };

  const interviewActionColumn = {
    key: "actions",
    label: "Action",
    render: (row) => (
      <div className="option-box">
        <ul className="option-list" style={{ display: "flex", gap: "0.5rem" }}>
          <li>
            <Link
              href={`/website/employees/profile/${row.id}`}
              title="View Profile"
              data-text="View Profile"
            >
              <span className="la la-eye"></span>
            </Link>
          </li>
          <li>
            <Link
              href={`/website/employees/edit/${row.id}`}
              title="Edit Profile"
              data-text="Edit Profile"
            >
              <span className="la la-pencil"></span>
            </Link>
          </li>
          <li>
            <Link
              href={`/website/employees/documents/${row.id}`}
              title="View Documents"
              data-text="View Documents"
            >
              <span className="la la-file-alt"></span>
            </Link>
          </li>
          <li>
            <button
              title="Delete Record"
              data-text="Delete Record"
              onClick={() => handleBulkDelete([row.id])}
            >
              <span className="la la-trash"></span>
            </button>
          </li>
          <li>
            <Link
              href={`/website/interviews/notes/${row.id}`}
              title="Notes"
              data-text="Notes"
            >
              <span className="la la-sticky-note"></span>
            </Link>
          </li>
          <li>
            <Link
              href={`/website/interviews/logs/${row.id}`}
              title="Logs"
              data-text="Logs"
            >
              <span className="la la-history"></span>
            </Link>
          </li>
          <li>
            <button
              title="Change Status"
              data-text="Change Status"
              onClick={() => row.handleChangeStatus(row.id)}
            >
              <span className="la la-exchange-alt"></span>
            </button>
            </li>
        </ul>
      </div>
    ),
  };

  const allFields = [
    checkboxColumn,
    profileColumn,
    ...fields,
    customActions ? interviewActionColumn : defaultActionColumn,
  ];

  const getColClass = (filterCount) => {
    if (filterCount <= 1) return "col-lg-12";
    if (filterCount === 2) return "col-lg-6";
    if (filterCount === 3) return "col-lg-4";
    if (filterCount === 4) return "col-lg-3";
    if (filterCount <= 6) return "col-lg-2";
    return "col-lg-2";
  };

  return (
    <div style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "500", color: "#333", margin: 0 }}>
          {title}
        </h2>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
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
            onClick={() => handleBulkDelete(selectedRows)}
            disabled={selectedRows.length === 0}
            style={{
              backgroundColor: selectedRows.length === 0 ? "#dc354580" : "#dc3545",
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
              height: "36px",
            }}
          >
            <option value="">Change Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="row" style={{ marginBottom: "1.5rem" }}>
        {filterOptions.map((option, index) => (
          <div key={index} className={`form-group ${getColClass(filterOptions.length)} col-md-6 col-sm-12 mb-3`}>
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
              <InputField
                field={{
                  type: "text",
                  name: option.key,
                  placeholder: `Filter by ${option.label}`,
                  style: inputStyle,
                }}
                value={filters[option.key] || ""}
                handleChange={(value) => handleFilterChange(option.key, value)}
              />
            ) : option.type === "select" ? (
              <SelectField
                field={{
                  name: option.key,
                  options: option.options || [{ value: "", label: `All ${option.label}` }],
                  placeholder: `Filter by ${option.label}`,
                  isMulti: option.isMulti || false,
                  style: selectStyle,
                }}
                value={filters[option.key] || (option.isMulti ? [] : "")}
                handleSelectChange={(value) => handleFilterChange(option.key, value)}
              />
            ) : null}
          </div>
        ))}
      </div>

      <style jsx>{`
        .light-placeholder::placeholder {
          color: #bbb;
        }
        .react-select__control {
          height: 60px !important;
          min-height: 60px !important;
          border-radius: 0.5rem !important;
          background-color: #F0F5F7 !important;
          border: 1px solid #ddd !important;
          font-size: 0.875rem !important;
          color: #333 !important;
        }
        .react-select__value-container {
          padding: 0.75rem !important;
        }
        .react-select__menu {
          border-radius: 0.5rem !important;
          background-color: #fff !important;
          border: 1px solid #ddd !important;
        }
        .react-select__option {
          font-size: 0.875rem !important;
          color: #333 !important;
        }
      `}</style>

      <div className="table-outer" style={{ overflowX: "auto" }}>
        <table className="default-table manage-job-table">
          <thead>
            <tr>
              {allFields.map((field, index) => (
                <th
                  key={index}
                  className={field.className}
                  style={{
                    padding: "1rem",
                    textAlign: "left",
                    color: "#747c4d",
                    fontWeight: "500",
                  }}
                >
                  {field.label}
                </th>
              ))}
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
                      {field.render ? field.render(row) : row[field.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={allFields.length}
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
          {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
          {filteredData.length} records
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
              padding: "0.5rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: "#f9f9f9",
              height: "36px",
              fontSize: "0.875rem",
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
              padding: "0 0.75rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: currentPage === 1 ? "#f0f0f0" : "#fff",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              height: "36px",
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
              padding: "0 0.75rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: currentPage === totalPages ? "#f0f0f0" : "#fff",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              height: "36px",
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
      isMulti: PropTypes.bool,
    })
  ).isRequired,
  rightOptionsHtml: PropTypes.string,
  handleBulkDelete: PropTypes.func,
  customActions: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    render: PropTypes.func.isRequired,
  }),
};

FancyTableV2.defaultProps = {
  rightOptionsHtml: "",
};

export default FancyTableV2;
