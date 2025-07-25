'use client'

import React from 'react';
import Link from "next/link";

const ListingCategories = ({ categories = [], editAction, deleteAction }) => {
  if (!Array.isArray(categories) || categories.length === 0) {
    return <p style={{ color: "#555", fontSize: "1rem", textAlign: "center" }}>No categories available.</p>;
  }

  return (
    <>
      {categories.map((item) => (
        <div
          className="category-block col-lg-4 col-md-6 col-sm-12"
          key={item.id}
          style={{ marginBottom: "1rem" }}
        >
          <div className="inner-box">
            <div className="content">
              <span className={`icon ${item.icon}`}></span>
              <h4>
                <Link href="/candidates">{item.catTitle}</Link>
              </h4>
              <p>{item.jobDescription}</p>
              {/* <p className="mt-2">
                <strong>({item.jobNumber} open positions)</strong>
              </p> */}
              {(editAction || deleteAction) && (
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                  {editAction && (
                    <button
                      onClick={() => editAction(item)}
                      style={{
                        padding: "0.25rem 0.75rem",
                        backgroundColor: "#8C956B",
                        color: "white",
                        border: "none",
                        borderRadius: "0.25rem",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                      }}
                    >
                      Edit
                    </button>
                  )}
                  {deleteAction && (
                    <button
                      onClick={() => deleteAction(item.id)}
                      style={{
                        padding: "0.25rem 0.75rem",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "0.25rem",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ListingCategories;
