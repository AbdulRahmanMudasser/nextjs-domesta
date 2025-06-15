'use client'

import React, { useState, useEffect } from "react";
import DsPageOuter from "@/templates/layouts/ds-page-outer";
import { ProfileTypes } from "@/data/globalKeys";
import FancyTableV2 from "@/templates/tables/fancy-table-v2";

// Mock initial settings data (replace with API fetch in production)
const initialSettings = {
    id: 1,
    logo: null, // File object or URL
    favicon: null, // File object or URL
    homeTitle: "Domesta - Listing Board",
    emailAddress: "contact@domesta.com",
    address: "123 Listing St, Board City, BC 45678",
    footerContent: "© 2025 Domesta. All rights reserved.",
    facebookLink: "https://facebook.com/domesta",
    twitterLink: "https://twitter.com/domesta",
    linkedinLink: "https://linkedin.com/company/domesta",
    instagramLink: "https://instagram.com/domesta",
};

const SettingsList = () => {
    // State for settings
    const [settings, setSettings] = useState(initialSettings);
    // State for form inputs
    const [formData, setFormData] = useState({ ...initialSettings });
    // State for form errors
    const [errors, setErrors] = useState({});

    // Update favicon in <head> when favicon changes
    useEffect(() => {
        if (settings.favicon) {
            const faviconLink = document.querySelector('link[rel="icon"]') || document.createElement('link');
            faviconLink.rel = 'icon';
            faviconLink.type = settings.favicon.type || 'image/x-icon';
            faviconLink.href = URL.createObjectURL(settings.favicon);
            if (!document.querySelector('link[rel="icon"]')) {
                document.head.appendChild(faviconLink);
            }
        }
    }, [settings.favicon]);

    // Validate form inputs
    const validateForm = () => {
        const newErrors = {};
        if (!formData.homeTitle) newErrors.homeTitle = "Home Title is required";
        if (!formData.emailAddress || !/\S+@\S+\.\S+/.test(formData.emailAddress))
            newErrors.emailAddress = "Valid Email Address is required";
        if (!formData.address) newErrors.address = "Address is required";
        if (!formData.footerContent) newErrors.footerContent = "Footer Content is required";

        // Validate social media links as URLs (optional)
        const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
        if (formData.facebookLink && !urlRegex.test(formData.facebookLink))
            newErrors.facebookLink = "Invalid Facebook URL";
        if (formData.twitterLink && !urlRegex.test(formData.twitterLink))
            newErrors.twitterLink = "Invalid Twitter URL";
        if (formData.linkedinLink && !urlRegex.test(formData.linkedinLink))
            newErrors.linkedinLink = "Invalid LinkedIn URL";
        if (formData.instagramLink && !urlRegex.test(formData.instagramLink))
            newErrors.instagramLink = "Invalid Instagram URL";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle text input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle file input changes
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files[0]) {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Update settings state (replace with API call in production)
            setSettings({ ...formData, id: 1 });
            console.log("Settings updated:", formData);
            // Reset errors
            setErrors({});
        }
    };

    return (
        <DsPageOuter
            headerType={ProfileTypes.SUPERADMIN}
        >
            <div style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#333", margin: "0 0 1rem" }}>
                    Domesta Settings
                </h2>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                    {[
                        { name: "homeTitle", label: "Home Title", type: "text" },
                        { name: "emailAddress", label: "Email Address", type: "email" },
                        { name: "address", label: "Address", type: "text" },
                        { name: "footerContent", label: "Footer Content", type: "textarea" },
                        { name: "facebookLink", label: "Facebook Link", type: "url" },
                        { name: "twitterLink", label: "Twitter Link", type: "url" },
                        { name: "linkedinLink", label: "LinkedIn Link", type: "url" },
                        { name: "instagramLink", label: "Instagram Link", type: "url" },
                    ].map((field) => (
                        <div key={field.name} style={{ flex: "1 1 300px" }}>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: "0.875rem",
                                    color: "#555",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                {field.label}
                            </label>
                            {field.type === "textarea" ? (
                                <textarea
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    onChange={handleInputChange}
                                    style={{
                                        width: "100%",
                                        padding: "0.5rem",
                                        border: `1px solid ${errors[field.name] ? "#ff0000" : "#ddd"}`,
                                        borderRadius: "4px",
                                        fontSize: "0.875rem",
                                        color: "#555",
                                        backgroundColor: "#f9f9f9",
                                        resize: "vertical",
                                        minHeight: "80px",
                                    }}
                                    className="light-placeholder"
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    onChange={handleInputChange}
                                    placeholder={`Enter ${field.label}`}
                                    style={{
                                        width: "100%",
                                        padding: "0.4rem 0.5rem",
                                        height: "32px",
                                        border: `1px solid ${errors[field.name] ? "#ff0000" : "#ddd"}`,
                                        borderRadius: "4px",
                                        fontSize: "0.875rem",
                                        color: "#555",
                                        backgroundColor: "#f9f9f9",
                                    }}
                                    className="light-placeholder"
                                />
                            )}
                            {errors[field.name] && (
                                <p style={{ color: "#ff0000", fontSize: "0.75rem", marginTop: "0.5rem" }}>
                                    {errors[field.name]}
                                </p>
                            )}
                        </div>
                    ))}

                    {[
                        { name: "logo", label: "Logo", accept: "image/png,image/jpeg,image/svg+xml" },
                        { name: "favicon", label: "Favicon", accept: "image/x-icon,image/png,image/jpeg" },
                    ].map((field) => (
                        <div key={field.name} style={{ flex: "1 1 300px" }}>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: "0.875rem",
                                    color: "#555",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                {field.label}
                            </label>
                            <input
                                type="file"
                                name={field.name}
                                accept={field.accept}
                                onChange={handleFileChange}
                                style={{
                                    width: "100%",
                                    padding: "0.4rem",
                                    border: `1px solid ${errors[field.name] ? "#ff0000" : "#ddd"}`,
                                    borderRadius: "4px",
                                    fontSize: "0.875rem",
                                    color: "#555",
                                    backgroundColor: "#f9f9f9",
                                }}
                            />
                            {formData[field.name] && (
                                <div style={{ marginTop: "0.5rem" }}>
                                    <img
                                        src={URL.createObjectURL(formData[field.name])}
                                        alt={`${field.label} Preview`}
                                        style={{ maxWidth: "100px", maxHeight: "100px", borderRadius: "4px" }}
                                    />
                                    <p style={{ fontSize: "0.75rem", color: "#555" }}>{formData[field.name].name}</p>
                                </div>
                            )}
                        </div>
                    ))}

                    <div style={{ flex: "1 1 100%", textAlign: "right", marginTop: "1rem" }}>
                        <button
                            type="submit"
                            style={{
                                backgroundColor: "#8c956b",
                                color: "#fff",
                                padding: "0.5rem 1rem",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "0.875rem",
                            }}
                        >
                            Save Settings
                        </button>
                    </div>
                </form>
            </div>
        </DsPageOuter>
    );
};

export const metadata = {
    title: "Domesta Settings || Domesta - Listing Board",
    description: "Manage website configuration for Domesta - Listing Board",
};

export default SettingsList;

<style jsx>{`
  .light-placeholder::placeholder {
    color: #ccc;
  }
`}</style>