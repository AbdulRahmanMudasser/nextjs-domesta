
'use client'

import React from "react";
import Link from "next/link";
import WsPageOuter from "@/templates/layouts/ws-page-outer";

const HowItWorks = () => {
  const buttonStyle = {
    backgroundColor: "#8C956B",
    color: "#fff",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "background-color 0.2s ease",
  };

  const labelStyle = {
    color: "#69697C",
    fontWeight: "450",
    fontSize: "0.875rem",
  };

  const cardStyle = {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    padding: "1.5rem",
    height: "100%",
  };

  const steps = [
    {
      title: "Create Employee Profiles",
      description: "Easily add and manage employee details using our intuitive form. Upload documents, set statuses, and keep everything organized.",
      icon: "la la-user-plus",
    },
    {
      title: "Track and Filter Data",
      description: "Use powerful tables to filter, sort, and manage employee records. Bulk actions like delete or status updates save you time.",
      icon: "la la-table",
    },
    {
      title: "Manage Interviews",
      description: "Schedule interviews, add notes, and track logs seamlessly. Custom actions ensure your workflow stays efficient.",
      icon: "la la-calendar-check",
    },
  ];

  return (
    <WsPageOuter>
      <>
        {/* Page Title Section */}
        <section className="page-title style-two">
          <div className="auto-container">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 text-center">
                <h1
                  className="mb-3"
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  How It Works
                </h1>
                <p
                  className="mb-4"
                  style={{
                    fontSize: "1.125rem",
                    color: "#69697C",
                    maxWidth: "600px",
                    margin: "0 auto",
                  }}
                >
                  Discover how our platform simplifies employee management with intuitive tools and powerful features.
                </p>
                <Link href="/website/get-started">
                  <button
                    className="btn"
                    style={buttonStyle}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#747c4d")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#8C956B")}
                  >
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="ls-section">
          <div className="auto-container">
            <div className="row">
              <div className="content-column col-lg-12 col-md-12 col-sm-12">
                <div className="ls-outer">
                  <h2
                    className="mb-4 text-center"
                    style={{
                      fontSize: "2rem",
                      fontWeight: "500",
                      color: "#333",
                    }}
                  >
                    Simple Steps to Success
                  </h2>
                  <div className="row">
                    {steps.map((step, index) => (
                      <div key={index} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                        <div style={cardStyle} className="h-100">
                          <div
                            style={{
                              fontSize: "2.5rem",
                              color: "#8C956B",
                              marginBottom: "1rem",
                            }}
                          >
                            <span className={step.icon}></span>
                          </div>
                          <h3
                            style={{
                              fontSize: "1.5rem",
                              fontWeight: "500",
                              color: "#333",
                              marginBottom: "0.75rem",
                            }}
                          >
                            {step.title}
                          </h3>
                          <p
                            style={{
                              fontSize: "1rem",
                              color: "#69697C",
                              lineHeight: "1.5",
                            }}
                          >
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="ls-section" style={{ backgroundColor: "#8C956B" }}>
          <div className="auto-container">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 text-center">
                <h2
                  className="mb-3"
                  style={{
                    fontSize: "2rem",
                    fontWeight: "500",
                    color: "#fff",
                  }}
                >
                  Ready to Streamline Your Workflow?
                </h2>
                <p
                  className="mb-4"
                  style={{
                    fontSize: "1.125rem",
                    color: "#fff",
                    maxWidth: "600px",
                    margin: "0 auto",
                  }}
                >
                  Join thousands of businesses managing their teams effortlessly with our platform.
                </p>
                <Link href="/website/signup">
                  <button
                    className="btn"
                    style={{
                      ...buttonStyle,
                      backgroundColor: "#fff",
                      color: "#8C956B",
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#f9fafb")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#fff")}
                  >
                    Sign Up Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    </WsPageOuter>
  );
};

export default HowItWorks;
