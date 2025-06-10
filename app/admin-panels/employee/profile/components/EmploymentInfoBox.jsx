import React, { useState } from "react";

// Define buttonStyle at the top level for consistent styling
const buttonStyle = {
  padding: "0.75rem 1.5rem",
  border: "none",
  borderRadius: "0.5rem",
  backgroundColor: "#1a73e8",
  color: "white",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "600",
};

// Define inputStyle for date input (matching Document.jsx)
const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  // border: "1px solid #ccc",
  borderRadius: "0.5rem",
  backgroundColor: "#F0F5F7",
  boxSizing: "border-box",
};

const EmploymentInfoBox = () => {
  const [visaExpiryDate, setVisaExpiryDate] = useState("");

  return (
    <form className="default-form">
      <div className="row">
        {/* Work Experience (Years) */}
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Work Experience (Years) <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="number"
            name="experience"
            placeholder="5"
            min="0"
            required
          />
        </div>

        {/* Availability */}
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Availability <span style={{ color: "red" }}>*</span>
          </label>
          <select name="availability" className="chosen-single form-select" required>
            <option value="">Select Availability</option>
            <option value="available">Available</option>
            <option value="not_available">Not Available</option>
          </select>
        </div>

        {/* Preferred Interview Timings */}
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Preferred Interview Timings <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="interview_timings"
            placeholder="3 - 5 PM"
            required
          />
        </div>

        {/* Document Verification Status */}
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Document Verification Status <span style={{ color: "red" }}>*</span>
          </label>
          <select name="verification_status" className="chosen-single form-select" required>
            <option value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Expected Salary (BHD) */}
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Expected Salary (BHD) <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="number"
            name="expected_salary"
            placeholder="Expected salary"
            step="0.01"
            required
          />
        </div>

        {/* Notice Period */}
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Notice Period <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="notice_period"
            placeholder="Notice period duration"
            required
          />
        </div>

        {/* Need Air Ticket? */}
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Need Air Ticket? <span style={{ color: "red" }}>*</span>
          </label>
          <select name="need_air_ticket" className="chosen-single form-select" required>
            <option value="">Select Option</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        {/* Employee Type */}
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Employee Type <span style={{ color: "red" }}>*</span>
          </label>
          <select name="employee_type" className="chosen-single form-select" required>
            <option value="">Select Type</option>
            <option value="Independent">Independent</option>
            <option value="Agency Managed">Agency Managed</option>
          </select>
        </div>

        {/* Employee Category */}
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Employee Category <span style={{ color: "red" }}>*</span>
          </label>
          <select name="employee_category" className="chosen-single form-select" required>
            <option value="">Select Category</option>
            <option value="Driver">Driver</option>
            <option value="Cook">Cook</option>
            <option value="Maid">Maid</option>
            <option value="Nanny">Nanny</option>
            <option value="Elderly Care">Elderly Care</option>
          </select>
        </div>

        {/* Visa Status */}
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Visa Status <span style={{ color: "red" }}>*</span>
          </label>
          <select name="visa_status" className="chosen-single form-select" required>
            <option value="">Select Status</option>
            <option value="Own Visa">Own Visa</option>
            <option value="Needs Sponsorship">Needs Sponsorship</option>
          </select>
        </div>

        {/* Visa Expiry Date */}
        <div className="form-group col-lg-3 col-md-12">
          <label>
            Visa Expiry Date <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="date"
            value={visaExpiryDate}
            onChange={(e) => setVisaExpiryDate(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        {/* Willing to Live-in? */}
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Willing to Live-in? <span style={{ color: "red" }}>*</span>
          </label>
          <select name="willing_to_livein" className="chosen-single form-select" required>
            <option value="">Select Option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Conditional">Conditional</option>
          </select>
        </div>

        {/* Max Work Hours/Day */}
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Max Work Hours/Day <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="number"
            name="max_work_hours"
            placeholder="8"
            min="1"
            max="24"
            required
          />
        </div>

        {/* Flexible with Weekends? */}
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Flexible with Weekends? <span style={{ color: "red" }}>*</span>
          </label>
          <select name="flexible_weekends" className="chosen-single form-select" required>
            <option value="">Select Option</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        {/* Other Benefits Requirements */}
        <div className="form-group col-lg-12 col-md-12">
          <label>
            Other Benefits Requirements <span style={{ color: "red" }}>*</span>
          </label>
          <textarea
            name="other_benefits"
            className="form-control"
            placeholder="List any other benefits you require"
            required
          />
        </div>

        {/* Save Button */}
        <div
          className="form-group col-lg-12 col-md-12"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <button type="submit" style={buttonStyle}>
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default EmploymentInfoBox;