import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { notificationService } from "@/services/notification.service";
import { userService } from "@/services/user.service";
import ConfirmationDialog from "../forms/ConfirmationDialog";

const UploadDocumentTable = ({ data, title, handleBulkDelete, onDataRefresh, onEditDocument }) => {
  const [filters, setFilters] = useState({
    document_type: "",
    document_status: "",
    issuing_country: "",
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // CONFIRMATION DIALOG STATE
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: "single" | "bulk", ids: number[] }

  // UPDATED handleDelete method with confirmation dialog
  const handleDelete = async (ids) => {
    console.log("handleDelete called with:", ids);
    
    if (!ids || ids.length === 0) {
      await notificationService.showToast("No items selected for deletion", "warning");
      return;
    }

    // Filter out any undefined or null IDs and ensure they're numbers
    const validIds = ids.filter(id => id != null && !isNaN(id)).map(id => Number(id));
    console.log("Valid IDs after filtering:", validIds);
    
    if (validIds.length === 0) {
      await notificationService.showToast("Invalid items selected", "error");
      return;
    }

    // Show confirmation dialog instead of proceeding directly
    setDeleteTarget({
      type: validIds.length === 1 ? "single" : "bulk",
      ids: validIds
    });
    setShowDeleteDialog(true);
  };

  // NEW method to handle confirmed deletion
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      console.log("Calling userService.deleteDocuments with IDs:", deleteTarget.ids);

      const response = await userService.deleteDocuments(deleteTarget.ids);
      
      if (response && response.status === true) {
        // Clear selected rows
        setSelectedRows([]);
        
        // Refresh data if callback provided
        if (onDataRefresh && typeof onDataRefresh === 'function') {
          await onDataRefresh();
        }
        
        // Reset to first page if current page becomes empty
        const remainingItems = filteredData.length - deleteTarget.ids.length;
        const maxPage = Math.ceil(remainingItems / pageSize);
        if (currentPage > maxPage && maxPage > 0) {
          setCurrentPage(maxPage);
        }
      } else {
        console.log("Delete operation failed - unexpected response:", response);
        throw new Error("Delete operation failed - unexpected response from server");
      }
    } catch (err) {
      console.error("Delete error:", err);
      // Error handling is already done in userService.deleteDocuments
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setDeleteTarget(null);
    }
  };

  // NEW method to handle dialog cancellation
  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setDeleteTarget(null);
  };

  const filterOptions = [
    { key: "document_type", label: "Document Type", type: "text" },
    { key: "document_status", label: "Status", type: "text" },
    { key: "issuing_country", label: "Issuing Country", type: "text" },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      document_type: "",
      document_status: "",
      issuing_country: "",
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
        
        if (key === "document_type") {
          cellValue = row.document_type?.value?.toLowerCase() || "";
        } else if (key === "document_status") {
          cellValue = row.document_status?.value?.toLowerCase() || "";
        } else if (key === "issuing_country") {
          cellValue = row.issuing_country?.name?.toLowerCase() || "";
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
      key: "document_type",
      label: "Document Type",
      render: (row) => (
        <div style={{ fontWeight: "600", color: "#2d3748" }}>
          {row?.document_type?.value || "N/A"}
        </div>
      ),
    },
    {
      key: "expiry_date",
      label: "Expiry Date",
      render: (row) => {
        if (!row?.expiry_date) return "N/A";
        try {
          return new Date(row.expiry_date).toLocaleDateString();
        } catch (e) {
          return "N/A";
        }
      },
    },
    {
      key: "document_status",
      label: "Status",
      render: (row) => (
        <span style={{
          display: "inline-block",
          padding: "0.25rem 0.75rem",
          backgroundColor: row?.document_status?.value === "rejected" ? "#fed7d7" : "#d4f4dd",
          color: row?.document_status?.value === "rejected" ? "#9b2c2c" : "#276749",
          borderRadius: "6px",
          fontSize: "0.875rem",
          fontWeight: "500",
          border: `1px solid ${row?.document_status?.value === "rejected" ? "#feb2b2" : "#9ae6b4"}`,
        }}>
          {row?.document_status?.value || "N/A"}
        </span>
      ),
    },
    {
      key: "issuing_country",
      label: "Issuing Country",
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <span className="la la-map-marker" style={{ color: "#8C956B" }}></span>
          {row?.issuing_country?.name || "N/A"}
        </div>
      ),
    },
    {
      key: "current_location",
      label: "Current Location",
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <span className="la la-map-marker" style={{ color: "#8C956B" }}></span>
          {row?.current_location?.name || "N/A"}
        </div>
      ),
    },
    {
      key: "work_available_immediately",
      label: "Work Available",
      render: (row) => (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "0.25rem 0.75rem",
          borderRadius: "20px",
          fontSize: "0.75rem",
          fontWeight: "500",
          backgroundColor: row?.work_available_immediately ? "#d4f4dd" : "#fed7d7",
          color: row?.work_available_immediately ? "#276749" : "#9b2c2c",
          border: `1px solid ${row?.work_available_immediately ? "#9ae6b4" : "#feb2b2"}`,
        }}>
          <span className={`la la-${row?.work_available_immediately ? 'check' : 'times'}`} style={{ marginRight: "0.25rem", fontSize: "0.75rem" }}></span>
          {row?.work_available_immediately ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "number_of_days",
      label: "Days to Availability",
      render: (row) => row?.number_of_days || "N/A",
    },
    {
      key: "file",
      label: "Document",
      render: (row) => (
        <button
          onClick={() => {
            const url = row?.media ? `${row.media.base_url}${row.media.unique_name}` : row?.fileUrl;
            if (url) {
              if (url.endsWith(".pdf")) {
                window.open(url, '_blank');
              } else {
                const img = new Image();
                img.src = url;
                img.onload = () => window.open(url, '_blank');
                img.onerror = () => console.error("Error loading document preview");
              }
            }
          }}
          style={{
            backgroundColor: "#8C956B",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          View Document
        </button>
      ),
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
          width: "16px",
          height: "16px",
          accentColor: "#8C956B",
          backgroundColor: selectedRows.length === filteredData.length && filteredData.length > 0 ? "#8C956B" : "#fff",
          border: "2px solid #e2e8f0",
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
          width: "16px",
          height: "16px",
          accentColor: "#8C956B",
          backgroundColor: selectedRows.includes(row?.id) ? "#8C956B" : "#fff",
          border: "2px solid #e2e8f0",
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img
          src="/images/demo-profile.jpg"
          alt="Profile"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        />
      </div>
    ),
  };

  const actionColumn = {
    key: "actions",
    label: "Action",
    render: (row) => (
      <div className="option-box">
        <div className="option-list" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <button
            title="Edit Document"
            className="action-button edit-btn"
            onClick={() => {
              console.log("Edit button clicked for row:", row);
              console.log("Row ID being sent for edit:", row?.id);
              if (onEditDocument && typeof onEditDocument === 'function') {
                onEditDocument(row?.id);
              }
            }}
            disabled={isDeleting}
            style={{ 
              opacity: isDeleting ? 0.6 : 1,
              textDecoration: "none",
              border: "none"
            }}
          >
            <span className="la la-pencil"></span>
          </button>
          <button
            title="Delete Document"
            className="action-button delete-btn"
            onClick={() => {
              console.log("Delete button clicked for row:", row);
              console.log("Row ID being sent:", row?.id);
              handleDelete([row?.id]);
            }}
            disabled={isDeleting}
            style={{ opacity: isDeleting ? 0.6 : 1 }}
          >
            <span className="la la-trash"></span>
          </button>
        </div>
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
  
  if (paginatedData.length > 0) {
    console.log("First row structure:", paginatedData[0]);
    console.log("First row ID:", paginatedData[0]?.id);
  }

  return (
    <div style={{ backgroundColor: "#fff", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)", marginBottom: "2rem", border: "1px solid #f1f5f9" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#2d3748", margin: 0 }}>
          {title}
        </h2>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button
            onClick={handleClearFilters}
            title="Clear Filters"
            style={{
              background: "#f7fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              color: "#4a5568",
              fontSize: "0.875rem",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "40px",
              transition: "all 0.2s ease",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              minWidth: "100px",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#edf2f7";
              e.target.style.borderColor = "#cbd5e0";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#f7fafc";
              e.target.style.borderColor = "#e2e8f0";
            }}
          >
            <span className="la la-refresh" style={{ marginRight: "0.5rem" }}></span>
            Clear Filters
          </button>
          <button
            onClick={() => handleDelete(selectedRows)}
            disabled={selectedRows.length === 0 || isDeleting}
            style={{
              backgroundColor: selectedRows.length === 0 || isDeleting ? "#fed7d7" : "#e53e3e",
              color: selectedRows.length === 0 || isDeleting ? "#9b2c2c" : "#fff",
              padding: "0.5rem 1.25rem",
              border: "none",
              borderRadius: "6px",
              cursor: selectedRows.length === 0 || isDeleting ? "not-allowed" : "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
              height: "40px",
              display: "flex",
              alignItems: "center",
              transition: "all 0.2s ease",
              boxShadow: selectedRows.length === 0 || isDeleting ? "none" : "0 1px 3px rgba(0, 0, 0, 0.1)",
              opacity: isDeleting ? 0.7 : 1,
            }}
            onMouseOver={(e) => {
              if (selectedRows.length > 0 && !isDeleting) {
                e.target.style.backgroundColor = "#c53030";
              }
            }}
            onMouseOut={(e) => {
              if (selectedRows.length > 0 && !isDeleting) {
                e.target.style.backgroundColor = "#e53e3e";
              }
            }}
          >
            <span className={`la la-${isDeleting ? 'spinner la-spin' : 'trash'}`} style={{ marginRight: "0.5rem" }}></span>
            {isDeleting ? "Deleting..." : `Delete (${selectedRows.length})`}
          </button>
        </div>
      </div>

      <div className="d-flex flex-row flex-wrap gap-3 mb-4">
        {filterOptions.map((option, index) => (
          <div key={index} className="flex-fill" style={{ minWidth: "180px", maxWidth: "280px" }}>
            <label
              className="d-block text-truncate"
              style={{
                fontSize: "0.875rem",
                color: "#4a5568",
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
                height: "44px",
                fontSize: "14px",
                color: "#2d3748",
                backgroundColor: "#f7fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "12px 16px",
                transition: "all 0.2s ease",
                outline: "none",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#8C956B";
                e.target.style.boxShadow = "0 0 0 3px rgba(140, 149, 107, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
              }}
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        .light-placeholder::placeholder {
          color: #a0aec0;
          font-weight: 400;
        }
        .table-container {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .action-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          transition: all 0.2s ease;
          text-decoration: none;
          border: none;
          cursor: pointer;
        }
        .action-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .edit-btn {
          background-color: #8C956B;
          color: white;
        }
        .edit-btn:hover {
          background-color: #7a815d;
        }
        .delete-btn {
          background-color: #e53e3e;
          color: white;
        }
        .delete-btn:hover {
          background-color: #c53030;
        }
      `}</style>

      <div className="table-outer table-container" style={{ overflowX: "auto" }}>
        <table className="default-table manage-job-table" style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc" }}>
              {allFields.map((field, index) => (
                <th
                  key={index}
                  className={field.className}
                  style={{
                    padding: "1.25rem 1rem",
                    textAlign: "left",
                    color: "#4a5568",
                    fontWeight: "600",
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.025em",
                    borderBottom: "2px solid #e2e8f0",
                    whiteSpace: "nowrap",
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
                    borderBottom: "1px solid #f1f5f9",
                    backgroundColor: selectedRows.includes(row?.id) ? "#f0fff4" : "#fff",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    if (!selectedRows.includes(row?.id)) {
                      e.currentTarget.style.backgroundColor = "#f8fafc";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!selectedRows.includes(row?.id)) {
                      e.currentTarget.style.backgroundColor = "#fff";
                    }
                  }}
                >
                  {allFields.map((field, colIndex) => (
                    <td
                      key={colIndex}
                      className={field.className}
                      style={{
                        padding: "1rem",
                        color: "#2d3748",
                        fontSize: "0.875rem",
                        borderBottom: "1px solid #f1f5f9",
                        verticalAlign: "middle",
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
                    padding: "3rem 2rem",
                    color: "#718096",
                    fontSize: "1rem",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                    <span className="la la-inbox" style={{ fontSize: "3rem", color: "#cbd5e0" }}></span>
                    <span>{safeData.length === 0 ? "No document records found" : "No records match your filters"}</span>
                  </div>
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
          color: "#718096",
          flexWrap: "wrap",
          gap: "1rem",
          padding: "1rem 0",
          borderTop: "1px solid #f1f5f9",
        }}
      >
        <div style={{ fontWeight: "500" }}>
          Showing {filteredData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
          {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
          {filteredData.length} records
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ marginRight: "0.5rem", whiteSpace: "nowrap", fontWeight: "500", color: "#4a5568" }}>
            Rows per page:
          </label>
          <div style={{ minWidth: "100px" }}>
            <select
              value={pageSize.toString()}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                height: "40px",
                padding: "0 2.5rem 0 0.75rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#4a5568",
                backgroundColor: "#fff",
                cursor: "pointer",
                outline: "none",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23718096' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.5rem center",
                backgroundSize: "1rem",
                transition: "all 0.2s ease",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                width: "100%",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#8C956B";
                e.target.style.boxShadow = "0 0 0 3px rgba(140, 149, 107, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
              }}
              onMouseOver={(e) => {
                e.target.style.borderColor = "#cbd5e0";
              }}
              onMouseOut={(e) => {
                e.target.style.borderColor = "#e2e8f0";
              }}
            >
              {pageSizeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: "0 1.25rem",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                backgroundColor: currentPage === 1 ? "#f7fafc" : "#fff",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                height: "40px",
                fontSize: "0.875rem",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: currentPage === 1 ? "#a0aec0" : "#4a5568",
                transition: "all 0.2s ease",
                boxShadow: currentPage === 1 ? "none" : "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
              onMouseOver={(e) => {
                if (currentPage !== 1) {
                  e.target.style.backgroundColor = "#f7fafc";
                  e.target.style.borderColor = "#cbd5e0";
                }
              }}
              onMouseOut={(e) => {
                if (currentPage !== 1) {
                  e.target.style.backgroundColor = "#fff";
                  e.target.style.borderColor = "#e2e8f0";
                }
              }}
            >
              Previous
            </button>
            <div style={{ 
              padding: "0 1.25rem", 
              fontWeight: "600", 
              color: "#2d3748",
              display: "flex",
              alignItems: "center",
              height: "40px",
              backgroundColor: "#f7fafc",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              justifyContent: "center",
              fontSize: "0.875rem",
            }}>
              Page {currentPage} of {totalPages || 1}
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              style={{
                padding: "0 1.25rem",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                backgroundColor: (currentPage === totalPages || totalPages === 0) ? "#f7fafc" : "#fff",
                cursor: (currentPage === totalPages || totalPages === 0) ? "not-allowed" : "pointer",
                height: "40px",
                fontSize: "0.875rem",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: (currentPage === totalPages || totalPages === 0) ? "#a0aec0" : "#4a5568",
                transition: "all 0.2s ease",
                boxShadow: (currentPage === totalPages || totalPages === 0) ? "none" : "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
              onMouseOver={(e) => {
                if (currentPage !== totalPages && totalPages !== 0) {
                  e.target.style.backgroundColor = "#f7fafc";
                  e.target.style.borderColor = "#cbd5e0";
                }
              }}
              onMouseOut={(e) => {
                if (currentPage !== totalPages && totalPages !== 0) {
                  e.target.style.backgroundColor = "#fff";
                  e.target.style.borderColor = "#e2e8f0";
                }
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRMATION DIALOG */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        title={deleteTarget?.type === "single" ? "Delete Document" : "Delete Documents"}
        message={
          deleteTarget?.type === "single" 
            ? "Are you sure you want to delete this document? This action cannot be undone."
            : `Are you sure you want to delete ${deleteTarget?.ids?.length || 0} documents? This action cannot be undone.`
        }
        confirmText={deleteTarget?.type === "single" ? "Delete Document" : "Delete Documents"}
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isDeleting}
        type="danger"
      />
    </div>
  );
};

UploadDocumentTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
  handleBulkDelete: PropTypes.func.isRequired,
  onDataRefresh: PropTypes.func,
  onEditDocument: PropTypes.func,
};

UploadDocumentTable.defaultProps = {
  data: [],
  onDataRefresh: null,
  onEditDocument: null,
};

export default UploadDocumentTable;