'use client'

import React from "react";
import PropTypes from "prop-types";

const SimpleTable = ({ fields, data, title }) => {
  const limitedData = data.slice(-3);

  return (
    <div style={{ backgroundColor: "#fff", padding: "1rem 1.25rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      <h2 style={{ fontSize: "1.125rem", fontWeight: "500", color: "#333", margin: "0.5rem 0 1.5rem" }}>
        {title}
      </h2>
      <div className="table-outer" style={{ overflowX: "auto" }}>
        <table className="default-table manage-job-table" style={{ width: "100%", tableLayout: "fixed" }}>
          <thead>
            <tr>
              {fields.map((field, index) => (
                <th
                  key={index}
                  className={field.className}
                  style={{
                    padding: "0.75rem 0.5rem",
                    textAlign: "left",
                    color: "#747c4d",
                    fontWeight: "500",
                    whiteSpace: "nowrap",
                    minWidth: "60px",
                  }}
                >
                  {field.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {limitedData.length > 0 ? (
              limitedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  style={{
                    borderBottom: "1px solid #eee",
                    backgroundColor: "#fff",
                  }}
                >
                  {fields.map((field, colIndex) => (
                    <td
                      key={colIndex}
                      className={field.className}
                      style={{
                        padding: "0.75rem 0.5rem",
                        color: "#555",
                        maxWidth: "25vw",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        minWidth: "60px",
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
                  colSpan={fields.length}
                  style={{
                    textAlign: "center",
                    padding: "0.75rem 0.5rem",
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
      <style jsx>{`
        .table-outer {
          -ms-overflow-style: none; /* Edge */
          scrollbar-width: none; /* Firefox */
        }
        .table-outer::-webkit-scrollbar {
          display: none; /* Chrome, Safari */
        }
        @media (max-width: 768px) {
          .default-table td,
          .default-table th {
            max-width: 100px !important;
            min-width: 50px !important;
          }
        }
        @media (min-width: 1200px) {
          .default-table td,
          .default-table th {
            max-width: 30vw !important;
          }
        }
      `}</style>
    </div>
  );
};

SimpleTable.propTypes = {
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
};

export default SimpleTable;