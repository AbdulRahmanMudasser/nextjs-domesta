import React, { useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import CustomSelect from "../misc/CustomSelect";

const FancyTableV2 = ({ fields, data, title, filterOptions, rightOptionsHtml, handleBulkDelete, customActions, context }) => {
  const [filters, setFilters] = useState(
    filterOptions.reduce((acc, option) => {
      acc[option.key] = "";
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
        acc[option.key] = "";
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

  const handleStatusChange = (status) => {
    if (status) {
      console.log(`Changing status to ${status} for records: ${selectedRows.join(", ")}`);
      setSelectedRows([]);
    }
  };

  const filteredData = data.filter((row) =>
    Object.keys(filters).every((key) => {
      if (!filters[key]) return true;
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

  // Define route mappings based on context
  const routeMap = {
    employee: {
      viewProfile: (id) => `/website/employees/profile/${id}`,
      editProfile: (id) => `/panels/employee/profile`,
    },
    employer: {
      viewProfile: (id) => `/website/employers/profile/${id}`,
      editProfile: (id) => `/panels/employer/profile`,
    },
    agency: {
      viewProfile: (id) => `/website/agents/profile/${id}`,
      editProfile: (id) => `/panels/agency/profile`,
    },
  };

  // Get routes based on context or fall back to default
  const routes = routeMap[context] || routeMap.employee;

  const defaultActionColumn = {
    key: "actions",
    label: "Action",
    render: (row) => (
      <div className="option-box">
        <ul className="option-list" style={{ display: "flex", gap: "" }}>
          <li>
            <Link
              href={routes.viewProfile(row.id)}
              title="View Profile"
              data-text="View Profile"
            >
              <span className="la la-eye"></span>
            </Link>
          </li>
          <li>
            <Link
              href={routes.editProfile(row.id)}
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
        <ul className="option-list" style={{ display: "flex", gap: "" }}>
          <li>
            <Link
              href={routes.viewProfile(row.id)}
              title="View Profile"
              data-text="View Profile"
            >
              <span className="la la-eye"></span>
            </Link>
          </li>
          <li>
            <Link
              href={routes.editProfile(row.id)}
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

  // Status change options
  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending" }
  ];

  // Page size options
  const pageSizeOptions = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "50", label: "50" }
  ];

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
              backgroundColor: selectedRows.length === 0 ? "#dc3545" : "#dc3545",
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
          <div style={{ minWidth: "140px" }}>
            <CustomSelect
              value=""
              onChange={handleStatusChange}
              options={statusOptions}
              placeholder="Change Status"
              disabled={selectedRows.length === 0}
              style={{
                opacity: selectedRows.length === 0 ? 0.6 : 1
              }}
            />
          </div>
        </div>
      </div>

      <div className="d-flex flex-row flex-wrap gap-3 mb-4">
        {filterOptions.map((option, index) => (
          <div key={index} className="flex-fill" style={{ minWidth: "150px", maxWidth: "250px" }}>
            <label
              className="d-block text-truncate"
              style={{
                fontSize: "0.875rem",
                color: "#555",
                marginBottom: "0.5rem",
                maxWidth: "100%",
                fontWeight: "500"
              }}
              title={option.label}
            >
              {option.label}
            </label>
            {option.type === "text" ? (
              <input
                type="text"
                value={filters[option.key] || ""}
                onChange={(e) => handleFilterChange(option.key, e.target.value)}
                placeholder={`Filter by ${option.label.length > 12 ? `${option.label.slice(0, 9)}...` : option.label}`}
                className="form-control light-placeholder"
                style={{
                  height: "48px",
                  fontSize: "14px",
                  color: "#495057",
                  backgroundColor: "#f0f5f7",
                  border: "1px solid #dee2e6",
                  borderRadius: "6px",
                  padding: "12px 16px",
                  transition: "border-color 0.15s ease",
                  outline: "none"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#80bdff";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#dee2e6";
                }}
              />
            ) : option.type === "select" ? (
              <CustomSelect
                value={filters[option.key] || ""}
                onChange={(value) => handleFilterChange(option.key, value)}
                options={option.options}
                placeholder={`Select ${option.label}`}
                allowClear={true}
              />
            ) : null}
          </div>
        ))}
      </div>

      <style jsx>{`
        .light-placeholder::placeholder {
          color: #6c757d;
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
                      {field.render ? field.render(row, row) : row[field.key]}
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
          flexWrap: "wrap",
          gap: "1rem"
        }}
      >
        <div>
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
          {filteredData.length} records
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ marginRight: "0.5rem", whiteSpace: "nowrap" }}>Rows per page:</label>
          <div style={{ minWidth: "80px" }}>
            <CustomSelect
              value={pageSize.toString()}
              onChange={(value) => {
                setPageSize(Number(value));
                setCurrentPage(1);
              }}
              options={pageSizeOptions}
            />
          </div>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              padding: "0 0.75rem",
              border: "1px solid #e1e5e9",
              borderRadius: "8px",
              backgroundColor: currentPage === 1 ? "#f5f5f5" : "#fff",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              height: "36px",
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: currentPage === 1 ? "#9ca3af" : "#333",
              transition: "all 0.2s ease"
            }}
          >
            Previous
          </button>
          <span style={{ padding: "0.5rem", whiteSpace: "nowrap" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              padding: "0 0.75rem",
              border: "1px solid #e1e5e9",
              borderRadius: "8px",
              backgroundColor: currentPage === totalPages ? "#f5f5f5" : "#fff",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              height: "36px",
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: currentPage === totalPages ? "#9ca3af" : "#333",
              transition: "all 0.2s ease"
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
    })
  ).isRequired,
  rightOptionsHtml: PropTypes.string,
  handleBulkDelete: PropTypes.func,
  customActions: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    render: PropTypes.func.isRequired,
  }),
  context: PropTypes.oneOf(["employee", "employer", "agency"]),
};

FancyTableV2.defaultProps = {
  rightOptionsHtml: "",
  context: "employee",
};

export default FancyTableV2;