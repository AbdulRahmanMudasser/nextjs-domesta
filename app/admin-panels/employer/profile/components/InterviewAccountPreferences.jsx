'use client'

import Select from "react-select";
import { useState } from "react";
import CardForm from "@/templates/forms/card-form";
import FancyTable from "@/templates/tables/fancy-table";

// Define inputStyle for inputs
const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "0.5rem",
  backgroundColor: "#F0F5F7",
  boxSizing: "border-box",
};

const InterviewAccountPreferences = () => {
    // State to manage form data
    const [formData, setFormData] = useState({
        salaryRangeFlexible: "",
        incentiveBasedHiring: "",
    });

    // Dummy data for interviews and hirings
    const [interviews, setInterviews] = useState([
        { id: 1, label: "Upcoming", title: "Interview with John", date: "2025-05-01", status: "Pending" },
        { id: 2, label: "Upcoming", title: "Interview with Sarah", date: "2025-05-03", status: "Confirmed" },
        { id: 3, label: "Past", title: "Interview with Mike", date: "2025-04-20", status: "Confirmed" },
    ]);

    const [hirings, setHirings] = useState([
        { id: 1, name: "Alice Smith", position: "Nanny", hireDate: "2024-12-15" },
        { id: 2, name: "Bob Johnson", position: "Driver", hireDate: "2024-10-10" },
    ]);

    // Handle input changes
    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    // Handle select changes for react-select
    const handleSelectChange = (field) => (selectedOption) => {
        setFormData({ ...formData, [field]: selectedOption ? selectedOption.value : "" });
    };

    // Handle file changes (required by CardForm, even if unused)
    const handleFileChange = (field, file) => {
        setFormData({ ...formData, [field]: file });
    };

    // Handle Confirm and Cancel for Interviews
    const handleConfirm = (id) => {
        setInterviews(interviews.map(interview =>
            interview.id === id ? { ...interview, status: "Confirmed" } : interview
        ));
    };

    const handleCancel = (id) => {
        setInterviews(interviews.filter(interview => interview.id !== id));
    };

    // Handle Contact and Remove for Hirings
    const handleContact = (id) => {
        console.log(`Contact employee with ID: ${id}`);
    };

    const handleRemove = (id) => {
        setHirings(hirings.filter(hiring => hiring.id !== id));
    };

    // Dropdown options for react-select
    const yesNoOptions = [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
    ];

    // Field configurations for interviews table
    const interviewFields = [
        { key: "title", label: "Title" },
        { key: "date", label: "Date" },
        { key: "label", label: "Label" },
        { key: "status", label: "Status" },
    ];

    // Field configurations for hirings table
    const hiringFields = [
        { key: "name", label: "Name" },
        { key: "position", label: "Position" },
        { key: "hireDate", label: "Hire Date" },
    ];

    // Form field configurations
    const fields = [
        {
            type: "select",
            name: "salaryRangeFlexible",
            label: "Is your salary range flexible?",
            options: yesNoOptions,
            colClass: "col-lg-3 col-md-12",
            placeholder: "Select Option",
            required: true,
        },
        {
            type: "select",
            name: "incentiveBasedHiring",
            label: "Consider incentive hiring?",
            options: yesNoOptions,
            colClass: "col-lg-3 col-md-12",
            placeholder: "Select Option",
            required: true,
        },
    ];

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted with data:", formData);
        // Add your form submission logic here, such as API calls
    };

    return (
        <div>
            <FancyTable
                fields={interviewFields}
                data={interviews}
                title="Interviews"
                filterOptions={[]}
            />
            <FancyTable
                fields={hiringFields}
                data={hirings}
                title="Hirings"
                filterOptions={[]}
            />
            <CardForm
                fields={fields}
                formData={formData}
                onSubmit={handleSubmit}
                handleChange={handleChange}
                handleSelectChange={handleSelectChange}
                handleFileChange={handleFileChange}
            />
        </div>
    );
};

export default InterviewAccountPreferences;