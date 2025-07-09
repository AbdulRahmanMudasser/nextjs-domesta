"use client";

import { useState, useEffect } from "react";
import UploadCardForm from "@/templates/forms/UploadCardForm";
import InputField from "@/templates/inputs/input-field";
import SelectField from "@/templates/inputs/select-field";
import { networkService } from "@/services/network.service";
import { notificationService } from "@/services/notification.service";

// Define inputStyle for file inputs and textarea (matching provided MyProfile.jsx)
const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "0.5rem",
  backgroundColor: "#F0F5F7",
  boxSizing: "border-box",
  height: "60px",
};

// Define preview image style (matching provided MyProfile.jsx)
const previewImageStyle = {
  maxWidth: "100px",
  maxHeight: "100px",
  marginTop: "10px",
  borderRadius: "0.5rem",
  objectFit: "cover",
};

// Define preview link style for PDFs (matching provided MyProfile.jsx)
const previewLinkStyle = {
  marginTop: "10px",
  color: "#1a73e8",
  textDecoration: "underline",
  fontSize: "14px",
};

// Define common input style for non-file fields (matching provided ProfileCardForm.jsx)
const commonInputStyle = {
  border: "1px solid #d1d5db",
  borderRadius: "0.5rem",
  padding: "0.75rem",
  width: "100%",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

// Define label style (matching provided ProfileCardForm.jsx)
const labelStyle = {
  color: "#69697C",
  fontWeight: "450",
  marginBottom: "0.5rem",
  display: "block",
};

// Define input container style (matching provided ProfileCardForm.jsx)
const inputContainerStyle = {
  marginBottom: "1rem",
};

// Define submit button style (matching provided ProfileCardForm.jsx)
const buttonStyle = {
  backgroundColor: "#8C956B",
  color: "#fff",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "4px",
  cursor: "pointer",
  transition: "background-color 0.2s",
};

const MyProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    role: "",
    age: "",
    childrenCount: "",
    no_of_days_available: "",
    profileImage: null,
    passportCopy: null,
    visaCopy: null,
    cprCopy: null,
    dob: "",
    gender: "",
    address: "",
    catOptions: "",
    nationality: "",
    religion: "",
    maritalStatus: "",
    in_bahrain: "",
    outside_country: "",
    work_available: "",
    current_location: "",
    profileImageUrl: "",
    passportCopyUrl: "",
    visaCopyUrl: "",
    cprCopyUrl: "",
    aboutMe: "",
  });
  const [catOptions, setCatOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [religionOptions, setReligionOptions] = useState([]);
  const [nationalityOptions, setNationalityOptions] = useState([]);
  const [maritalStatusOptions, setMaritalStatusOptions] = useState([]);
  const [workAvailableOptions, setWorkAvailableOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  
  // State for image previews
  const [imagePreviews, setImagePreviews] = useState({
    profileImage: "",
    passportCopy: "",
    visaCopy: "",
    cprCopy: "",
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSelectChange = (field) => (selectedOption) => {
    setFormData({
      ...formData,
      [field]: selectedOption ? selectedOption.value : "",
    });
  };

  const handleFileChange = (field) => async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, [field]: file });
      
      // Upload file and get preview image
      try {
        const response = await networkService.uploadMedia(file);
        if (response && response[0]?.base_url && response[0]?.thumb_size) {
          const previewUrl = `${response[0].base_url}${response[0].thumb_size}`;
          setImagePreviews(prev => ({
            ...prev,
            [field]: previewUrl
          }));
          
          // Also update the main URL for saving
          setFormData(prev => ({
            ...prev,
            [`${field}Url`]: `${response[0].base_url}${response[0].unique_name}`,
            [`${field}Id`]: response[0].id
          }));
        }
      } catch (error) {
        console.error(`Error uploading ${field}:`, error);
        await notificationService.showToast(
          `Failed to upload ${field}. Please try again.`,
          "error"
        );
      }
    }
  };

  // Handler to remove files
  const handleRemoveFile = (field) => () => {
    setFormData(prev => ({
      ...prev,
      [field]: null,
      [`${field}Url`]: "",
      [`${field}Id`]: null,
    }));
    setImagePreviews(prev => ({
      ...prev,
      [field]: "",
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const employeeId = user?.id;
        if (!employeeId) {
          throw new Error("User ID not found in localStorage");
        }

        // Fetch profile data first
        const profileResponse = await networkService.get(`/employee/profile-single/${employeeId}`);
        if (profileResponse) {
          // Helper function to get value from nested object
          const getValue = (obj, fallback = "") => obj?.value || obj?.name || fallback;
          
          // Format date for input field
          const formatDate = (dateString) => {
            if (!dateString) return "";
            return new Date(dateString).toISOString().split('T')[0];
          };

          // Fetch thumbnail URLs for media
          const fetchMediaThumbnail = async (mediaId, originalUrl) => {
            if (!mediaId) return "";
            try {
              const mediaResponse = await networkService.get(`/media/single/${mediaId}`);
              if (mediaResponse?.data?.base_url && mediaResponse?.data?.thumb_size) {
                return `${mediaResponse.data.base_url}${mediaResponse.data.thumb_size}`;
              }
              return originalUrl || "";
            } catch (error) {
              console.error(`Error fetching media ${mediaId}:`, error);
              return originalUrl || "";
            }
          };

          // Fetch thumbnails for all media, falling back to original URL if thumbnail fails
          const [profileThumb, passportThumb, visaThumb, cprThumb] = await Promise.all([
            fetchMediaThumbnail(
              profileResponse.profile_media_id,
              profileResponse.profile_media ? `${profileResponse.profile_media.base_url}${profileResponse.profile_media.unique_name}` : ""
            ),
            fetchMediaThumbnail(
              profileResponse.passport_media_id,
              profileResponse.passport_media ? `${profileResponse.passport_media.base_url}${profileResponse.passport_media.unique_name}` : ""
            ),
            fetchMediaThumbnail(
              profileResponse.visa_media_id,
              profileResponse.visa_media ? `${profileResponse.visa_media.base_url}${profileResponse.visa_media.unique_name}` : ""
            ),
            fetchMediaThumbnail(
              profileResponse.cpr_media_id,
              profileResponse.cpr_media ? `${profileResponse.cpr_media.base_url}${profileResponse.cpr_media.unique_name}` : ""
            ),
          ]);

          setFormData({
            firstName: profileResponse.user?.first_name || "",
            middleName: profileResponse.user?.middle_name || "",
            lastName: profileResponse.user?.last_name || "",
            email: profileResponse.user?.email || "",
            age: profileResponse.age || "",
            childrenCount: profileResponse.number_of_children || "",
            no_of_days_available: profileResponse.available_for_work_after_days || "",
            dob: formatDate(profileResponse.date_of_birth),
            gender: getValue(profileResponse.gender),
            address: profileResponse.address || "",
            catOptions: getValue(profileResponse.cat_option),
            nationality: getValue(profileResponse.nationality),
            religion: getValue(profileResponse.religion),
            maritalStatus: getValue(profileResponse.marital_status),
            in_bahrain: profileResponse.currently_in_bahrain ? "true" : "false",
            outside_country: getValue(profileResponse.outside_country),
            work_available: getValue(profileResponse.work_available),
            current_location: getValue(profileResponse.current_location),
            profileImageUrl: profileResponse.profile_media ? 
              `${profileResponse.profile_media.base_url}${profileResponse.profile_media.unique_name}` : "",
            passportCopyUrl: profileResponse.passport_media ? 
              `${profileResponse.passport_media.base_url}${profileResponse.passport_media.unique_name}` : "",
            visaCopyUrl: profileResponse.visa_media ? 
              `${profileResponse.visa_media.base_url}${profileResponse.visa_media.unique_name}` : "",
            cprCopyUrl: profileResponse.cpr_media ? 
              `${profileResponse.cpr_media.base_url}${profileResponse.cpr_media.unique_name}` : "",
            aboutMe: profileResponse.about_me || "",
            // Store media IDs for API calls
            profileImageId: profileResponse.profile_media?.id || null,
            passportCopyId: profileResponse.passport_media?.id || null,
            visaCopyId: profileResponse.visa_media?.id || null,
            cprCopyId: profileResponse.cpr_media?.id || null,
            // Keep file fields as null since we only show existing files, don't pre-populate file inputs
            profileImage: null,
            passportCopy: null,
            visaCopy: null,
            cprCopy: null,
          });

          // Set existing image previews with thumbnails
          setImagePreviews({
            profileImage: profileThumb,
            passportCopy: passportThumb,
            visaCopy: visaThumb,
            cprCopy: cprThumb,
          });
        }

        // Fetch all dropdown options
        await Promise.all([
          fetchCatOptions(),
          fetchGenderOptions(),
          fetchReligionOptions(),
          fetchNationalityOptions(),
          fetchMaritalStatusOptions(),
          fetchWorkAvailableOptions(),
          fetchCountryOptions()
        ]);

      } catch (error) {
        console.error("Error fetching profile data:", error);
        await notificationService.showToast(
          error.message || "Failed to load profile data.",
          "error"
        );
      }
    };

    const fetchCatOptions = async () => {
      try {
        const catResponse = await networkService.getDropdowns("cat_options");
        if (catResponse?.cat_options) {
          const catOptions = catResponse.cat_options.map((item) => ({
            value: item.value,
            label: item.value,
            id: item.id,
          }));
          setCatOptions(catOptions);
        }
      } catch (error) {
        console.error("Error fetching cat options:", error);
      }
    };

    const fetchGenderOptions = async () => {
      try {
        const genderResponse = await networkService.getDropdowns("gender");
        if (genderResponse?.gender) {
          const genderOptions = genderResponse.gender.map((item) => ({
            value: item.value,
            label: item.value,
            id: item.id,
          }));
          setGenderOptions(genderOptions);
        }
      } catch (error) {
        console.error("Error fetching gender options:", error);
      }
    };

    const fetchReligionOptions = async () => {
      try {
        const religionResponse = await networkService.getDropdowns("religion");
        if (religionResponse?.religion) {
          const religionOptions = religionResponse.religion.map((item) => ({
            value: item.value,
            label: item.value,
            id: item.id,
          }));
          setReligionOptions(religionOptions);
        }
      } catch (error) {
        console.error("Error fetching religion options:", error);
      }
    };

    const fetchNationalityOptions = async () => {
      try {
        const countryResponse = await networkService.get("/country");
        if (countryResponse) {
          const nationalityOptions = countryResponse.map(item => ({
            value: item.name,
            label: item.name,
            id: item.id,
          }));
          setNationalityOptions(nationalityOptions);
        } else {
          throw new Error("No nationality options returned");
        }
      } catch (error) {
        console.error("Error fetching nationality options:", error);
      }
    };

    const fetchMaritalStatusOptions = async () => {
      try {
        const maritalResponse = await networkService.getDropdowns("marital_status");
        if (maritalResponse?.marital_status) {
          const maritalStatusOptions = maritalResponse.marital_status.map((item) => ({
            value: item.value,
            label: item.value,
            id: item.id,
          }));
          setMaritalStatusOptions(maritalStatusOptions);
        }
      } catch (error) {
        console.error("Error fetching marital status options:", error);
      }
    };

    const fetchWorkAvailableOptions = async () => {
      try {
        const workResponse = await networkService.getDropdowns("work_available");
        if (workResponse?.work_available) {
          const workAvailableOptions = workResponse.work_available.map((item) => ({
            value: item.value,
            label: item.value,
            id: item.id,
          }));
          setWorkAvailableOptions(workAvailableOptions);
        }
      } catch (error) {
        console.error("Error fetching work available options:", error);
      }
    };

    const fetchCountryOptions = async () => {
      try {
        const countryResponse = await networkService.get("/country");
        if (countryResponse) {
          const countryOptions = countryResponse.map(item => ({
            value: item.name,
            label: item.name,
            id: item.id,
          }));
          setCountryOptions(countryOptions);
        } else {
          throw new Error("No country options returned");
        }
      } catch (error) {
        console.error("Error fetching country options:", error);
      }
    };

    fetchData();
  }, []);

  const yesNoOptions = [
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
  ];

  const fields = [
    {
      type: "text",
      name: "firstName",
      label: "First Name",
      placeholder: "John",
      colClass: "col-lg-4 col-md-12",
      required: true,
    },
    {
      type: "text",
      name: "middleName",
      label: "Middle Name",
      placeholder: "Michael",
      colClass: "col-lg-4 col-md-12",
      required: false,
    },
    {
      type: "text",
      name: "lastName",
      label: "Last Name",
      placeholder: "Doe",
      colClass: "col-lg-4 col-md-12",
      required: true,
    },
    {
      type: "textarea",
      name: "aboutMe",
      label: "About Me",
      placeholder: "Tell us about yourself",
      colClass: "col-lg-12 col-md-12",
      required: false,
      style: { ...inputStyle, height: "120px" },
    },  
    {
      type: "text",
      name: "email",
      label: "Email",
      placeholder: "employee@gmail.com",
      colClass: "col-lg-4 col-md-12",
      readOnly: true,
    },
    {
      type: "text",
      name: "address",
      label: "Address",
      placeholder: "Enter your address",
      colClass: "col-lg-4 col-md-12",
      required: true,
    },
    {
      type: "select",
      name: "gender",
      label: "Gender",
      options: genderOptions,
      colClass: "col-lg-4 col-md-12",
      placeholder: "Select Gender",
      required: true,
    },
    {
      type: "number",
      name: "age",
      label: "Age",
      placeholder: "Enter age",
      colClass: "col-lg-4 col-md-12",
      min: "18",
      required: true,
    },
    {
      type: "date",
      name: "dob",
      label: "Date of Birth",
      colClass: "col-lg-4 col-md-12",
      required: true,
      style: inputStyle,
    },
    {
      type: "select",
      name: "catOptions",
      label: "Category",
      options: catOptions,
      colClass: "col-lg-4 col-md-12",
      placeholder: "Select category",
      required: true,
    },
    {
      type: "select",
      name: "nationality",
      label: "Nationality",
      options: nationalityOptions,
      colClass: "col-lg-4 col-md-12",
      placeholder: "Select Nationality",
      required: true,
    },
    {
      type: "select",
      name: "religion",
      label: "Religion",
      options: religionOptions,
      colClass: "col-lg-4 col-md-12",
      placeholder: "Select Religion",
      required: true,
    },
    {
      type: "select",
      name: "maritalStatus",
      label: "Marital Status",
      options: maritalStatusOptions,
      colClass: "col-lg-4 col-md-12",
      placeholder: "Select Marital Status",
      required: true,
    },
    {
      type: "text",
      name: "childrenCount",
      label: "Number of Children",
      placeholder: "0",
      colClass: "col-lg-4 col-md-12",
      min: "0",
      required: true,
    },
    {
      type: "select",
      name: "in_bahrain",
      label: "Currently in Bahrain?",
      options: yesNoOptions,
      colClass: "col-lg-4 col-md-12",
      placeholder: "Select Option",
      required: true,
    },
    {
      type: "select",
      name: "outside_country",
      label: "If outside Bahrain, specify country",
      options: countryOptions,
      colClass: "col-lg-4 col-md-12",
      placeholder: "Select Country",
      required: true,
    },
    {
      type: "select",
      name: "work_available",
      label: "Work Available",
      options: workAvailableOptions,
      colClass: "col-lg-4 col-md-12",
      placeholder: "Select availability",
      required: true,
    },
    {
      type: "text",
      name: "no_of_days_available",
      label: "Available after how many days?",
      placeholder: "Number of days",
      colClass: "col-lg-4 col-md-12",
      required: true,
    },
    {
      type: "select",
      name: "current_location",
      label: "Current Location",
      options: countryOptions,
      colClass: "col-lg-4 col-md-12",
      placeholder: "Select Country",
      required: true,
    },
    {
      type: "file",
      name: "profileImage",
      label: "Profile Picture",
      accept: "image/*",
      colClass: "col-lg-6 col-md-12",
      required: !formData.profileImageUrl,
      style: inputStyle,
      preview: imagePreviews.profileImage,
      previewComponent: ({ openViewer }) => (
        <div className="file-placeholder" style={{ cursor: "pointer" }} onClick={() => document.getElementById("profileImageInput").click()}>
          {imagePreviews.profileImage ? (
            <>
              <img
                src={imagePreviews.profileImage}
                alt="Profile Picture Preview"
                style={previewImageStyle}
                onError={() => console.error('Error loading profile image')}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile("profileImage")();
                }}
                style={{ color: "red", marginLeft: "10px" }}
                title="Remove Profile Picture"
              >
                ×
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openViewer(imagePreviews.profileImage, false);
                }}
                style={previewLinkStyle}
              >
                View Profile Picture
              </button>
            </>
          ) : (
            <div className="file-placeholder" style={{ ...inputStyle }}>
              Choose Profile Picture
            </div>
          )}
          <input
            type="file"
            id="profileImageInput"
            name="profileImage"
            accept="image/*"
            onChange={handleFileChange("profileImage")}
            style={{ display: "none" }}
          />
        </div>
      ),
    },
    {
      type: "file",
      name: "passportCopy",
      label: "Passport Copy",
      accept: ".pdf,.jpg,.png",
      colClass: "col-lg-6 col-md-12",
      required: !formData.passportCopyUrl,
      style: inputStyle,
      preview: imagePreviews.passportCopy,
      previewComponent: ({ openViewer }) => (
        <div className="file-placeholder" style={{ cursor: "pointer" }} onClick={() => document.getElementById("passportCopyInput").click()}>
          {imagePreviews.passportCopy ? (
            <>
              {formData.passportCopyUrl.endsWith('.pdf') ? (
                <>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openViewer(formData.passportCopyUrl, true);
                    }}
                    style={previewLinkStyle}
                  >
                    View Passport Copy (PDF)
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile("passportCopy")();
                    }}
                    style={{ color: "red", marginLeft: "10px" }}
                    title="Remove Passport Copy"
                  >
                    ×
                  </button>
                </>
              ) : (
                <>
                  <img
                    src={imagePreviews.passportCopy}
                    alt="Passport Copy Preview"
                    style={previewImageStyle}
                    onError={() => console.error('Error loading passport image')}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile("passportCopy")();
                    }}
                    style={{ color: "red", marginLeft: "10px" }}
                    title="Remove Passport Copy"
                  >
                    ×
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openViewer(imagePreviews.passportCopy, false);
                    }}
                    style={previewLinkStyle}
                  >
                    View Passport Copy
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="file-placeholder" style={{ ...inputStyle }}>
              Choose Passport Copy
            </div>
          )}
          <input
            type="file"
            id="passportCopyInput"
            name="passportCopy"
            accept=".pdf,.jpg,.png"
            onChange={handleFileChange("passportCopy")}
            style={{ display: "none" }}
          />
        </div>
      ),
    },
    {
      type: "file",
      name: "visaCopy",
      label: "Visa Copy",
      accept: ".pdf,.jpg,.png",
      colClass: "col-lg-6 col-md-12",
      required: !formData.visaCopyUrl,
      style: inputStyle,
      preview: imagePreviews.visaCopy,
      previewComponent: ({ openViewer }) => (
        <div className="file-placeholder" style={{ cursor: "pointer" }} onClick={() => document.getElementById("visaCopyInput").click()}>
          {imagePreviews.visaCopy ? (
            <>
              {formData.visaCopyUrl.endsWith('.pdf') ? (
                <>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openViewer(formData.visaCopyUrl, true);
                    }}
                    style={previewLinkStyle}
                  >
                    View Visa Copy (PDF)
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile("visaCopy")();
                    }}
                    style={{ color: "red", marginLeft: "10px" }}
                    title="Remove Visa Copy"
                  >
                    ×
                  </button>
                </>
              ) : (
                <>
                  <img
                    src={imagePreviews.visaCopy}
                    alt="Visa Copy Preview"
                    style={previewImageStyle}
                    onError={() => console.error('Error loading visa image')}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile("visaCopy")();
                    }}
                    style={{ color: "red", marginLeft: "10px" }}
                    title="Remove Visa Copy"
                  >
                    ×
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openViewer(imagePreviews.visaCopy, false);
                    }}
                    style={previewLinkStyle}
                  >
                    View Visa Copy
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="file-placeholder" style={{ ...inputStyle }}>
              Choose Visa Copy
            </div>
          )}
          <input
            type="file"
            id="visaCopyInput"
            name="visaCopy"
            accept=".pdf,.jpg,.png"
            onChange={handleFileChange("visaCopy")}
            style={{ display: "none" }}
          />
        </div>
      ),
    },
    {
      type: "file",
      name: "cprCopy",
      label: "CPR Copy",
      accept: ".pdf,.jpg,.png",
      colClass: "col-lg-6 col-md-12",
      required: !formData.cprCopyUrl,
      style: inputStyle,
      preview: imagePreviews.cprCopy,
      previewComponent: ({ openViewer }) => (
        <div className="file-placeholder" style={{ cursor: "pointer" }} onClick={() => document.getElementById("cprCopyInput").click()}>
          {imagePreviews.cprCopy ? (
            <>
              {formData.cprCopyUrl.endsWith('.pdf') ? (
                <>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openViewer(formData.cprCopyUrl, true);
                    }}
                    style={previewLinkStyle}
                  >
                    View CPR Copy (PDF)
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile("cprCopy")();
                    }}
                    style={{ color: "red", marginLeft: "10px" }}
                    title="Remove CPR Copy"
                  >
                    ×
                  </button>
                </>
              ) : (
                <>
                  <img
                    src={imagePreviews.cprCopy}
                    alt="CPR Copy Preview"
                    style={previewImageStyle}
                    onError={() => console.error('Error loading CPR image')}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile("cprCopy")();
                    }}
                    style={{ color: "red", marginLeft: "10px" }}
                    title="Remove CPR Copy"
                  >
                    ×
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openViewer(imagePreviews.cprCopy, false);
                    }}
                    style={previewLinkStyle}
                  >
                    View CPR Copy
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="file-placeholder" style={{ ...inputStyle }}>
              Choose CPR Copy
            </div>
          )}
          <input
            type="file"
            id="cprCopyInput"
            name="cprCopy"
            accept=".pdf,.jpg,.png"
            onChange={handleFileChange("cprCopy")}
            style={{ display: "none" }}
          />
        </div>
      ),
    },
  ];

  const uploadFields = fields.filter(field => field.type === "file");
  const nonUploadFields = fields.filter(field => field.type !== "file");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const employeeId = user?.id;
      if (!employeeId) {
        throw new Error("User ID not found in localStorage");
      }

      // Map form values to API expected IDs
      const getIdFromValue = (options, value) => {
        const option = options.find(opt => opt.value === value || opt.label === value);
        return option ? option.id : null;
      };

      // Prepare data for API
      const data = {
        employee_id: employeeId,
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        address: formData.address,
        about_me: formData.aboutMe,
        gender_id: getIdFromValue(genderOptions, formData.gender),
        age: parseInt(formData.age) || null,
        date_of_birth: formData.dob,
        cat_option_id: getIdFromValue(catOptions, formData.catOptions),
        nationality_id: getIdFromValue(nationalityOptions, formData.nationality),
        religion_id: getIdFromValue(religionOptions, formData.religion),
        marital_status_id: getIdFromValue(maritalStatusOptions, formData.maritalStatus),
        number_of_children: parseInt(formData.childrenCount) || 0,
        currently_in_bahrain: formData.in_bahrain === "true",
        outside_country_id: getIdFromValue(countryOptions, formData.outside_country),
        work_available_id: getIdFromValue(workAvailableOptions, formData.work_available),
        available_for_work_after_days: parseInt(formData.no_of_days_available) || null,
        current_location_id: getIdFromValue(countryOptions, formData.current_location),
        // Add media IDs (use existing ones if no new files uploaded)
        profile_media_id: formData.profileImageId,
        passport_media_id: formData.passportCopyId,
        visa_media_id: formData.visaCopyId,
        cpr_media_id: formData.cprCopyId,
      };

      console.log("Profile data to submit:", data);

      // Call the profile update API endpoint
      const response = await networkService.post("/employee/profile-edit", data);
      if (response) {
        await notificationService.showToast("Profile updated successfully!", "success");
      }

    } catch (error) {
      console.error("Form submission error:", error);
      await notificationService.showToast(
        error.message || "Failed to update profile. Please try again.",
        "error"
      );
    }
  };

  const renderNonUploadField = (field) => {
    return (
      <>
        {field.type === "text" || field.type === "number" || field.type === "date" || field.type === "email" || field.type === "tel" ? (
          <InputField
            field={{ ...field, style: { ...field.style, ...commonInputStyle } }}
            value={formData[field.name] || ""}
            handleChange={handleChange}
          />
        ) : field.type === "textarea" ? (
          <textarea
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
            readOnly={field.readOnly}
            style={{ ...field.style, ...commonInputStyle }}
          />
        ) : field.type === "select" ? (
          <SelectField
            field={{ ...field, style: { ...field.style, ...commonInputStyle }, isMulti: field.isMulti || false }}
            value={formData[field.name]}
            handleSelectChange={(name) => (option) => {
              handleSelectChange(name)(option);
            }}
          />
        ) : field.type === "custom" && field.render ? (
          field.render()
        ) : null}
      </>
    );
  };

  return (
    <form
      className="default-form card p-4"
      onSubmit={handleSubmit}
      style={{
        padding: "1rem",
        backgroundColor: "#F0F5F7",
      }}
    >
      <div className="row">
        {nonUploadFields.map((field, index) => (
          <div
            key={index}
            className={`form-group ${field.colClass}`}
            style={inputContainerStyle}
          >
            <label style={labelStyle}>
              {field.label} {field.required && <span style={{ color: "red" }}>*</span>}
            </label>
            {renderNonUploadField(field)}
          </div>
        ))}
        <UploadCardForm
          fields={uploadFields}
          formData={formData}
          handleFileChange={handleFileChange}
        />
        <div
          className="form-group col-lg-12 col-md-12"
          style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}
        >
          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#7a815d")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#8C956B")}
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default MyProfile;