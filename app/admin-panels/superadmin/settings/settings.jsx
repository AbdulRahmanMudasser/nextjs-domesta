'use client'

import React, { useState, useEffect } from "react";
import DsPageOuter from "@/templates/layouts/ds-page-outer";
import { ProfileTypes } from "@/data/globalKeys";
import Shimmer from "@/templates/misc/Shimmer";

const initialSettings = {
    id: 1,
    logo: null,
    favicon: null,
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
    const [settings, setSettings] = useState(null);
    const [formData, setFormData] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Simulate data loading
        const timer = setTimeout(() => {
            setSettings(initialSettings);
            setFormData({ ...initialSettings });
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (settings?.favicon) {
            const faviconLink = document.querySelector('link[rel="icon"]') || document.createElement('link');
            faviconLink.rel = 'icon';
            faviconLink.type = settings.favicon.type || 'image/x-icon';
            faviconLink.href = URL.createObjectURL(settings.favicon);
            if (!document.querySelector('link[rel="icon"]')) {
                document.head.appendChild(faviconLink);
            }
        }
    }, [settings?.favicon]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.homeTitle) newErrors.homeTitle = "Home Title is required";
        if (!formData.emailAddress || !/\S+@\S+\.\S+/.test(formData.emailAddress))
            newErrors.emailAddress = "Valid Email Address is required";
        if (!formData.address) newErrors.address = "Address is required";
        if (!formData.footerContent) newErrors.footerContent = "Footer Content is required";

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files[0]) {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setSettings({ ...formData, id: 1 });
            console.log("Settings updated:", formData);
            setErrors({});
        }
    };

    if (!settings || !formData) {
        return (
            <DsPageOuter headerType={ProfileTypes.SUPERADMIN}>
                <div style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", marginBottom: "2rem" }}>
                    <Shimmer width="200px" height="24px" style={{ marginBottom: "1rem" }} />
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                        {[...Array(7)].map((_, i) => (
                            <div key={i} style={{ flex: "1 1 300px" }}>
                                <Shimmer width="100px" height="14px" style={{ marginBottom: "0.5rem" }} />
                                <Shimmer width="100%" height="32px" />
                            </div>
                        ))}
                        <div style={{ flex: "1 1 300px" }}>
                            <Shimmer width="100px" height="14px" style={{ marginBottom: "0.5rem" }} />
                            <Shimmer width="100%" height="32px" />
                        </div>
                        <div style={{ flex: "1 1 300px" }}>
                            <Shimmer width="100px" height="14px" style={{ marginBottom: "0.5rem" }} />
                            <Shimmer width="100%" height="32px" />
                        </div>
                        <div style={{ flex: "1 1 100%" }}>
                            <Shimmer width="100px" height="14px" style={{ marginBottom: "0.5rem" }} />
                            <Shimmer width="100%" height="80px" />
                        </div>
                        <div style={{ flex: "1 1 100%", textAlign: "right" }}>
                            <Shimmer width="120px" height="32px" />
                        </div>
                    </div>
                </div>
            </DsPageOuter>
        );
    }

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

                    <div style={{ flex: "1 1 100%" }}>
                        <label
                            style={{
                                display: "block",
                                fontSize: "0.875rem",
                                color: "#555",
                                marginBottom: "0.5rem",
                            }}
                        >
                            Footer Content
                        </label>
                        <textarea
                            name="footerContent"
                            value={formData.footerContent || ""}
                            onChange={handleInputChange}
                            style={{
                                width: "100%",
                                padding: "0.5rem",
                                border: `1px solid ${errors.footerContent ? "#ff0000" : "#ddd"}`,
                                borderRadius: "4px",
                                fontSize: "0.875rem",
                                color: "#555",
                                backgroundColor: "#f9f9f9",
                                resize: "vertical",
                                minHeight: "80px",
                            }}
                            className="light-placeholder"
                        />
                        {errors.footerContent && (
                            <p style={{ color: "#ff0000", fontSize: "0.75rem", marginTop: "0.5rem" }}>
                                {errors.footerContent}
                            </p>
                        )}
                    </div>

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

export default SettingsList;

<style jsx>{`
  .light-placeholder::placeholder {
    color: #ccc;
  }
`}</style>