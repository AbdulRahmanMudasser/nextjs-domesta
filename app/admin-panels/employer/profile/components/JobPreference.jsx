'use client'

import Select from "react-select";
import { useState } from "react";
import CardForm from "@/templates/forms/card-form";

const JobPreference = () => {
    const [formData, setFormData] = useState({
        jobType: "",
        specificTasks: {
            cleaning: [],
            laundry: [],
            careAndEscortOfChildren: [],
            cooking: [],
            cookingType: "",
            childcareInfants: [],
            elderlyCare: [],
            driving: [],
            petCare: [],
            specialNeedsCare: [],
        },
        genderPreference: "",
        nationalityPreference: "",
        experienceLevel: "",
        requireReferences: "",
        expectTravel: "",
    });
    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };
    const handleSelectChange = (field) => (selectedOption) => {
        setFormData({ ...formData, [field]: selectedOption ? selectedOption.value : "" });
    };
    const handleTaskChange = (task) => (selectedOptions) => {
        const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setFormData({
            ...formData,
            specificTasks: {
                ...formData.specificTasks,
                [task]: values,
                ...(task === "cooking" && !values.includes("Must Have") && !values.includes("Nice to Have") ? { cookingType: "" } : {}),
            },
        });
    };
    const handleCookingTypeChange = (value) => {
        setFormData({
            ...formData,
            specificTasks: {
                ...formData.specificTasks,
                cookingType: value,
            },
        });
    };
    const handleFileChange = (field, file) => {
        setFormData({ ...formData, [field]: file });
    };

    const jobTypeOptions = [
        { value: "Full-Time", label: "Full-Time" },
        { value: "Part-Time", label: "Part-Time" },
        { value: "Live-in", label: "Live-in" },
        { value: "Live-out", label: "Live-out" },
        { value: "Temporary", label: "Temporary" },
        { value: "Monthly", label: "Monthly" },
        { value: "Newborn Nanny", label: "Newborn Nanny" },
    ];

    const specificTaskOptions = [
        { value: "Must Have", label: "Must Have" },
        { value: "Nice to Have", label: "Nice to Have" },
        { value: "Not Required", label: "Not Required" },
    ];

    const genderOptions = [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
        { value: "No Preference", label: "No Preference" },
    ];

    const nationalityOptions = [
        { value: "Bahrain", label: "Bahrain" },
        { value: "Kuwait", label: "Kuwait" },
        { value: "Oman", label: "Oman" },
        { value: "Qatar", label: "Qatar" },
        { value: "Saudi Arabia", label: "Saudi Arabia" },
        { value: "United Arab Emirates", label: "United Arab Emirates" },
    ];

    const experienceLevelOptions = [
        { value: "Beginner", label: "Beginner" },
        { value: "Intermediate", label: "Intermediate" },
        { value: "Expert", label: "Expert" },
    ];

    const yesNoOptions = [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
    ];

    const travelOptions = [
        { value: "Yes", label: "Yes" },
        { value: "Occasionally", label: "Occasionally" },
        { value: "No", label: "No" },
    ];
    const fields = [
        {
            type: "select",
            name: "jobType",
            label: "Job Type",
            options: jobTypeOptions,
            colClass: "col-lg-3 col-md-12",
            placeholder: "Select Job Type",
            required: true,
        },
        {
            type: "custom",
            name: "specificTasks",
            label: "Specific Tasks",
            colClass: "col-lg-12 col-md-12",
            render: () => (
                <div className="row">
                    {[
                        { name: "cleaning", label: "Cleaning" },
                        { name: "laundry", label: "Laundry" },
                        { name: "careAndEscortOfChildren", label: "Care and Escort of Children" },
                        { name: "cooking", label: "Cooking" },
                        { name: "childcareInfants", label: "Childcare (infants)" },
                        { name: "elderlyCare", label: "Elderly Care" },
                        { name: "driving", label: "Driving" },
                        { name: "petCare", label: "Care of Domestic Animals (Pet Care)" },
                        { name: "specialNeedsCare", label: "Care of People with Special Needs" },
                    ].map((task, idx) => (
                        <div
                            key={idx}
                            className="form-group col-lg-3 col-md-12"
                            style={{ display: "flex", flexDirection: "column", marginBottom: "1.5rem" }}
                        >
                            <label
                                style={{
                                    color: "#69697C",
                                    fontWeight: "500",
                                    minHeight: "2rem",
                                    whiteSpace: "normal",
                                    wordWrap: "break-word",
                                }}
                            >
                                {task.label} <span style={{ color: "red" }}>*</span>
                            </label>
                            <Select
                                isMulti
                                name={task.name}
                                options={specificTaskOptions}
                                value={specificTaskOptions.filter(option => formData.specificTasks[task.name].includes(option.value))}
                                onChange={handleTaskChange(task.name)}
                                placeholder={`Select ${task.label}`}
                                required
                            />
                            {task.name === "cooking" &&
                                (formData.specificTasks.cooking.includes("Must Have") ||
                                    formData.specificTasks.cooking.includes("Nice to Have")) && (
                                    <input
                                        type="text"
                                        placeholder="Specify cooking type"
                                        value={formData.specificTasks.cookingType}
                                        onChange={(e) => handleCookingTypeChange(e.target.value)}
                                        style={{ ...inputStyle, marginTop: "0.5rem" }}
                                    />
                                )}
                        </div>
                    ))}
                </div>
            ),
        },
        {
            type: "select",
            name: "genderPreference",
            label: "Gender Preference",
            options: genderOptions,
            colClass: "col-lg-3 col-md-12",
            placeholder: "Select Gender Preference",
            required: true,
        },
        {
            type: "select",
            name: "nationalityPreference",
            label: "Nationality Preference",
            options: nationalityOptions,
            colClass: "col-lg-3 col-md-12",
            placeholder: "Select Nationality Preference",
            required: true,
        },
        {
            type: "select",
            name: "experienceLevel",
            label: "Experience Level",
            options: experienceLevelOptions,
            colClass: "col-lg-3 col-md-12",
            placeholder: "Select Experience Level",
            required: true,
        },
        {
            type: "select",
            name: "requireReferences",
            label: "Do You Require References?",
            options: yesNoOptions,
            colClass: "col-lg-3 col-md-12",
            placeholder: "Select Option",
            required: true,
        },
        {
            type: "select",
            name: "expectTravel",
            label: "Do You Expect Employee to Travel?",
            options: travelOptions,
            colClass: "col-lg-3 col-md-12",
            placeholder: "Select Option",
            required: true,
        },
    ];

    
    const handleSubmit = (e) => {
        e.preventDefault();
        const specificTasks = formData.specificTasks;
        const tasks = [
            "cleaning",
            "laundry",
            "careAndEscortOfChildren",
            "cooking",
            "childcareInfants",
            "elderlyCare",
            "driving",
            "petCare",
            "specialNeedsCare",
        ];

        // Check if all specific tasks have at least one option selected
        const allTasksFilled = tasks.every(task => specificTasks[task].length > 0);

        if (!allTasksFilled) {
            alert("Please select at least one option for each Specific Task.");
            return;
        }

        console.log("Form submitted with data:", formData);
        // Add your form submission logic here, such as API calls
    };

    return (
        <CardForm
            fields={fields}
            formData={formData}
            onSubmit={handleSubmit}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            handleFileChange={handleFileChange}
        />
    );
};

export default JobPreference;