import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import CustomSelect from "../misc/CustomSelect";

const WorkExperienceTable = ({ data, title, handleBulkDelete }) => {
  const [filters, setFilters] = useState({
    employer_name: "",
    designation: "",
    country: "",
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filterOptions = [
    { key: "employer_name", label: "Employer Name", type: "text" },
    { key: "designation", label: "Designation", type: "text" },
    {
      key: "country",
      label: "Country",
      type: "text",
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      employer_name: "",
      designation: "",
      country: "",
    });
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

  // Ensure data is always an array
  const safeData = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  const filteredData = useMemo(() => {
    if (!safeData || safeData.length === 0) return [];
    
    return safeData.filter((row) => {
      if (!row) return false;
      
      return Object.keys(filters).every((key) => {
        if (!filters[key]) return true;
        
        let cellValue = "";
        
        if (key === "country") {
          cellValue = row.country?.name?.toLowerCase() || "";
        } else {
          cellValue = row[key]?.toString().toLowerCase() || "";
        }
        
        return cellValue.includes(filters[key].toLowerCase());
      });
    });
  }, [safeData, filters]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    return filteredData.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [filteredData, currentPage, pageSize]);

  const fields = [
    {
      key: "employer_name",
      label: "Employer Name",
      render: (row) => row?.employer_name || "N/A",
    },
    {
      key: "employment_location",
      label: "Location",
      render: (row) => row?.employment_location || "N/A",
    },
    {
      key: "designation",
      label: "Designation",
      render: (row) => row?.designation || "N/A",
    },
    {
      key: "start_date",
      label: "Start Date",
      render: (row) => {
        if (!row?.start_date) return "N/A";
        try {
          return new Date(row.start_date).toLocaleDateString();
        } catch (e) {
          return "N/A";
        }
      },
    },
    {
      key: "end_date",
      label: "End Date",
      render: (row) => {
        if (!row?.end_date) return "N/A";
        try {
          return new Date(row.end_date).toLocaleDateString();
        } catch (e) {
          return "N/A";
        }
      },
    },
    {
      key: "previous_salary",
      label: "Salary",
      render: (row) => (row?.previous_salary ? `${row.previous_salary}` : "N/A"),
    },
    {
      key: "rating",
      label: "Rating",
      render: (row) => (row?.rating ? `${row.rating}/5` : "N/A"),
    },
    {
      key: "pets_experience",
      label: "Pets Experience",
      render: (row) => row?.pets_experience || "N/A",
    },
    {
      key: "comfortable_with_pets",
      label: "Comfortable with Pets",
      render: (row) => (row?.comfortable_with_pets ? "Yes" : "No"),
    },
    {
      key: "country",
      label: "Country",
      render: (row) => row?.country?.name || "N/A",
    },
  ];

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
        checked={selectedRows.includes(row?.id)}
        onChange={() => handleRowSelect(row?.id)}
        style={{
          cursor: "pointer",
          width: "14px",
          height: "14px",
          accentColor: "#747c4d",
          backgroundColor: selectedRows.includes(row?.id) ? "#747c4d" : "#fff",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      />
    ),
  };

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

  const actionColumn = {
    key: "actions",
    label: "Action",
    render: (row) => (
      <div className="option-box">
        <ul className="option-list" style={{ display: "flex", gap: "0.5rem" }}>
          <li>
            <Link
              href={`/website/employees/experience/${row?.id}`}
              title="View Experience"
              data-text="View Experience"
            >
              <span className="la la-eye"></span>
            </Link>
          </li>
          <li>
            <Link
              href={`/panels/employee/experience/edit/${row?.id}`}
              title="Edit Experience"
              data-text="Edit Experience"
            >
              <span className="la la-pencil"></span>
            </Link>
          </li>
          <li>
            <button
              title="Delete Experience"
              data-text="Delete Experience"
              onClick={() => handleBulkDelete([row?.id])}
            >
              <span className="la la-trash"></span>
            </button>
          </li>
        </ul>
      </div>
    ),
  };

  const allFields = [checkboxColumn, profileColumn, ...fields, actionColumn];

  const pageSizeOptions = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "50", label: "50" },
  ];

  // Debug logging
  console.log("Table data:", safeData);
  console.log("Filtered data:", filteredData);
  console.log("Paginated data:", paginatedData);

  return (
    <div style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", marginBottom: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "500", color: "#333", margin: 0 }}>
          {title}
        </h2>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
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
              opacity: selectedRows.length === 0 ? 0.6 : 1,
            }}
          >
            Bulk Delete ({selectedRows.length})
          </button>
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
                fontWeight: "500",
              }}
              title={option.label}
            >
              {option.label}
            </label>
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
                outline: "none",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#80bdff";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#dee2e6";
              }}
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        .light-placeholder::placeholder {
          color: #6c757d;
        }
      `}</style>

      <div className="table-outer" style={{ overflowX: "auto" }}>
        <table className="default-table manage-job-table" style={{ width: "100%", borderCollapse: "collapse" }}>
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
                    borderBottom: "2px solid #eee",
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
                  key={row?.id || rowIndex}
                  style={{
                    borderBottom: "1px solid #eee",
                    backgroundColor: selectedRows.includes(row?.id) ? "#f0f0f0" : "#fff",
                  }}
                >
                  {allFields.map((field, colIndex) => (
                    <td
                      key={colIndex}
                      className={field.className}
                      style={{
                        padding: "1rem",
                        color: "#555",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {field.render ? field.render(row) : row?.[field.key] || "N/A"}
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
                    padding: "2rem",
                    color: "#555",
                    fontStyle: "italic",
                  }}
                >
                  {safeData.length === 0 ? "No work experience records found" : "No records match your filters"}
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
          gap: "1rem",
        }}
      >
        <div>
          Showing {filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
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
              transition: "all 0.2s ease",
            }}
          >
            Previous
          </button>
          <span style={{ padding: "0.5rem", whiteSpace: "nowrap" }}>
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            style={{
              padding: "0 0.75rem",
              border: "1px solid #e1e5e9",
              borderRadius: "8px",
              backgroundColor: (currentPage === totalPages || totalPages === 0) ? "#f5f5f5" : "#fff",
              cursor: (currentPage === totalPages || totalPages === 0) ? "not-allowed" : "pointer",
              height: "36px",
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: (currentPage === totalPages || totalPages === 0) ? "#9ca3af" : "#333",
              transition: "all 0.2s ease",
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

WorkExperienceTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
  handleBulkDelete: PropTypes.func.isRequired,
};

WorkExperienceTable.defaultProps = {
  data: [],
};

export default WorkExperienceTable;