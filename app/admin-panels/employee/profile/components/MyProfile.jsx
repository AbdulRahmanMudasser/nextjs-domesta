"use client";

import { useState, useEffect } from "react";
import ProfileCardForm from "@/templates/forms/ProfileCardForm";
import { networkService } from "@/services/network.service";
import { notificationService } from "@/services/notification.service";
import Modal from "./Modal";
import Select from "react-select";

// Define inputStyle for file inputs and textarea (matching Document.jsx)
const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "0.5rem",
  backgroundColor: "#F0F5F7",
  boxSizing: "border-box",
  height: "60px",
};

// Define preview image style
const previewImageStyle = {
  maxWidth: "100px",
  maxHeight: "100px",
  marginTop: "10px",
  borderRadius: "0.5rem",
  objectFit: "cover",
};

// Define preview button style for document buttons
const previewButtonStyle = {
  marginTop: "10px",
  backgroundColor: "#8C956B",
  color: "white",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "0.5rem",
  cursor: "pointer",
  fontSize: "14px",
};

// Define remove button style
const removeButtonStyle = {
  position: "absolute",
  top: "0px",
  right: "-1px",
  backgroundColor: "#8C956B",
  color: "white",
  borderRadius: "50%",
  width: "28px",
  height: "28px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: "18px",
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
  const [imagePreviews, setImagePreviews] = useState({
    profileImage: "",
    passportCopy: "",
    visaCopy: "",
    cprCopy: "",
  });
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state

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
        setLoading(true); // Set loading during file upload
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
      } finally {
        setLoading(false); // Reset loading after upload
      }
    }
  };

  const handleRemoveFile = (field) => () => {
    setFormData((prev) => ({
      ...prev,
      [field]: null,
      [`${field}Url`]: "",
      [`${field}Id`]: null,
    }));
    setImagePreviews((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handlePreviewClick = (field, url) => () => {
    if (url) {
      if (url.endsWith(".pdf")) {
        setModalContent(
          <iframe
            src={url}
            style={{ width: "100%", height: "80vh", border: "none" }}
            title={`${field} Preview`}
          />
        );
      } else {
        setModalContent(
          <img
            src={url}
            alt={`${field} Preview`}
            style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: "0.5rem" }}
          />
        );
      }
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
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

          // Fetch thumbnails for all media, falling
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
      component: Select,
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
      component: Select,
    },
    {
      type: "select",
      name: "nationality",
      label: "Nationality",
      options: nationalityOptions,
      colClass: "col-lg-4 col-md-12",
      placeholder: "Select Nationality",
      required: true,
      component: Select,
    },
    {
      type: "select",
      name: "religion",
      label: "Religion",
      options: religionOptions,
      colClass: "col-lg-4 col-md-12",
      placeholder: "Select Religion",
      required: true,
      component: Select,
    },
    {
      type: "select",
      name: "maritalStatus",
      label: "Marital Status",
      options: maritalStatusOptions,
      colClass: "col-lg-4 col-md-12",
      placeholder: "Select Marital Status",
      required: true,
      component: Select,
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
      component: Select,
    },
    {
      type: "select",
      name: "outside_country",
      label: "If outside Bahrain, specify country",
      options: countryOptions,
      colClass: "col-lg-4 col-md-12",
      placeholder: "Select Country",
      required: true,
      component: Select,
    },
    {
      type: "select",
      name: "work_available",
      label: "Work Available",
      options: workAvailableOptions,
      colClass: "col-lg-4 col-md-12",
      placeholder: "Select availability",
      required: true,
      component: Select,
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
      component: Select,
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
      previewComponent: (
        <div className="file-placeholder" style={{ position: "relative", cursor: "pointer" }}>
          {imagePreviews.profileImage ? (
            <>
              <img
                src={imagePreviews.profileImage}
                alt="Profile Picture Preview"
                style={previewImageStyle}
                onClick={handlePreviewClick("profileImage", formData.profileImageUrl)}
                onError={() => console.error('Error loading profile image')}
              />
              <button
                onClick={handleRemoveFile("profileImage")}
                style={removeButtonStyle}
                title="Remove Profile Picture"
              >
                ×
              </button>
            </>
          ) : (
            <div
              style={{ ...inputStyle, textAlign: "center", lineHeight: "60px" }}
              onClick={() => document.getElementById("profileImageInput").click()}
            >
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
      previewComponent: (
        <div className="file-placeholder" style={{ position: "relative", cursor: "pointer" }}>
          {imagePreviews.passportCopy ? (
            <>
              {formData.passportCopyUrl.endsWith('.pdf') ? (
                <button
                  onClick={handlePreviewClick("passportCopy", formData.passportCopyUrl)}
                  style={previewButtonStyle}
                >
                  View Document
                </button>
              ) : (
                <img
                  src={imagePreviews.passportCopy}
                  alt="Passport Copy Preview"
                  style={previewImageStyle}
                  onClick={handlePreviewClick("passportCopy", formData.passportCopyUrl)}
                  onError={() => console.error('Error loading passport image')}
                />
              )}
              <button
                onClick={handleRemoveFile("passportCopy")}
                style={removeButtonStyle}
                title="Remove Passport Copy"
              >
                ×
              </button>
            </>
          ) : (
            <div
              style={{ ...inputStyle, textAlign: "center", lineHeight: "60px" }}
              onClick={() => document.getElementById("passportCopyInput").click()}
            >
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
      previewComponent: (
        <div className="file-placeholder" style={{ position: "relative", cursor: "pointer" }}>
          {imagePreviews.visaCopy ? (
            <>
              {formData.visaCopyUrl.endsWith('.pdf') ? (
                <button
                  onClick={handlePreviewClick("visaCopy", formData.visaCopyUrl)}
                  style={previewButtonStyle}
                >
                  View Document
                </button>
              ) : (
                <img
                  src={imagePreviews.visaCopy}
                  alt="Visa Copy Preview"
                  style={previewImageStyle}
                  onClick={handlePreviewClick("visaCopy", formData.visaCopyUrl)}
                  onError={() => console.error('Error loading visa image')}
                />
              )}
              <button
                onClick={handleRemoveFile("visaCopy")}
                style={removeButtonStyle}
                title="Remove Visa Copy"
              >
                ×
              </button>
            </>
          ) : (
            <div
              style={{ ...inputStyle, textAlign: "center", lineHeight: "60px" }}
              onClick={() => document.getElementById("visaCopyInput").click()}
            >
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
      previewComponent: (
        <div className="file-placeholder" style={{ position: "relative", cursor: "pointer" }}>
          {imagePreviews.cprCopy ? (
            <>
              {formData.cprCopyUrl.endsWith('.pdf') ? (
                <button
                  onClick={handlePreviewClick("cprCopy", formData.cprCopyUrl)}
                  style={previewButtonStyle}
                >
                  View Document
                </button>
              ) : (
                <img
                  src={imagePreviews.cprCopy}
                  alt="CPR Copy Preview"
                  style={previewImageStyle}
                  onClick={handlePreviewClick("cprCopy", formData.cprCopyUrl)}
                  onError={() => console.error('Error loading CPR image')}
                />
              )}
              <button
                onClick={handleRemoveFile("cprCopy")}
                style={removeButtonStyle}
                title="Remove CPR Copy"
              >
                ×
              </button>
            </>
          ) : (
            <div
              style={{ ...inputStyle, textAlign: "center", lineHeight: "60px" }}
              onClick={() => document.getElementById("cprCopyInput").click()}
            >
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); // Set loading during submission
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
    } finally {
      setLoading(false); // Reset loading after submission
    }
  };

  return (
    <>
      <ProfileCardForm
        fields={fields}
        formData={formData}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
        handleFileChange={handleFileChange}
        onSubmit={handleSubmit}
        loading={loading} // Pass loading state
      />
      <Modal isOpen={isModalOpen} onClose={closeModal} isWide={modalContent?.type === "iframe"}>
        {modalContent}
      </Modal>
    </>
  );
};

export default MyProfile;