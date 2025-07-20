"use client";

import { useState, useEffect } from "react";
import ProfileCardForm from "@/templates/forms/ProfileCardForm";
import { networkService } from "@/services/network.service";
import { notificationService } from "@/services/notification.service";
import Modal from "./Modal";
import Select from "react-select";
import Loader from "@/globals/Loader";
import FilePicker from "@/templates/inputs/FilePicker";

// Define inputStyle for file inputs and textarea
const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "0.5rem",
  backgroundColor: "#F0F5F7",
  boxSizing: "border-box",
  height: "60px",
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
    aboutMe: "",
  });

  // Separate state for file data
  const [fileData, setFileData] = useState({
    profileImage: {
      file: null,
      previewUrl: "",
      fullUrl: "",
      mediaId: null,
    },
    passportCopy: {
      file: null,
      previewUrl: "",
      fullUrl: "",
      mediaId: null,
    },
    visaCopy: {
      file: null,
      previewUrl: "",
      fullUrl: "",
      mediaId: null,
    },
    cprCopy: {
      file: null,
      previewUrl: "",
      fullUrl: "",
      mediaId: null,
    },
  });

  const [formErrors, setFormErrors] = useState({});
  const [catOptions, setCatOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [religionOptions, setReligionOptions] = useState([]);
  const [nationalityOptions, setNationalityOptions] = useState([]);
  const [maritalStatusOptions, setMaritalStatusOptions] = useState([]);
  const [workAvailableOptions, setWorkAvailableOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSelectChange = (field) => (selectedOption) => {
    setFormData({
      ...formData,
      [field]: selectedOption ? selectedOption.value : "",
    });
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Handle file data changes from FilePicker components
  const handleFileDataChange = (fieldName, data) => {
    setFileData(prev => ({
      ...prev,
      [fieldName]: data,
    }));
  };

  // Handle clearing form errors
  const handleClearError = (fieldName) => {
    setFormErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const handlePreviewClick = (field, url) => {
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

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Create a mapping of field names to their display labels
    const fieldLabels = fields.reduce((acc, field) => ({
      ...acc,
      [field.name]: field.label,
    }), {});

    // Validate required fields
    const requiredFields = fields.filter((f) => f.required).map((f) => f.name);
    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field] === "") {
        errors[field] = `${fieldLabels[field]} is required`;
        isValid = false;
      }
    });

    // Specific validations
    if (formData.age && (isNaN(formData.age) || formData.age < 18)) {
      errors.age = `${fieldLabels.age} must be a number greater than or equal to 18`;
      isValid = false;
    }

    if (formData.childrenCount && (isNaN(formData.childrenCount) || formData.childrenCount < 0)) {
      errors.childrenCount = `${fieldLabels.childrenCount} must be a non-negative number`;
      isValid = false;
    }

    if (formData.no_of_days_available && (isNaN(formData.no_of_days_available) || formData.no_of_days_available < 0)) {
      errors.no_of_days_available = `${fieldLabels.no_of_days_available} must be a non-negative number`;
      isValid = false;
    }

    if (formData.dob && !/^\d{4}-\d{2}-\d{2}$/.test(formData.dob)) {
      errors.dob = `Please enter a valid ${fieldLabels.dob.toLowerCase()} (YYYY-MM-DD)`;
      isValid = false;
    }

    // File fields validation
    if (!fileData.profileImage.file && !fileData.profileImage.fullUrl) {
      errors.profileImage = `Profile Picture is required`;
      isValid = false;
    }
    if (!fileData.passportCopy.file && !fileData.passportCopy.fullUrl) {
      errors.passportCopy = `Passport Copy is required`;
      isValid = false;
    }
    if (!fileData.visaCopy.file && !fileData.visaCopy.fullUrl) {
      errors.visaCopy = `Visa Copy is required`;
      isValid = false;
    }
    if (!fileData.cprCopy.file && !fileData.cprCopy.fullUrl) {
      errors.cprCopy = `CPR Copy is required`;
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsInitialLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));
        const employeeId = user?.id;
        if (!employeeId) {
          throw new Error("User ID not found in localStorage");
        }

        console.log("Fetching profile data...");
        const profileResponse = await networkService.get(`/employee/profile-single/${employeeId}`);
        if (profileResponse) {
          const getValue = (obj, fallback = "") => obj?.value || obj?.name || fallback;
          const formatDate = (dateString) => {
            if (!dateString) return "";
            return new Date(dateString).toISOString().split("T")[0];
          };

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

          const [profileThumb, passportThumb, visaThumb, cprThumb] = await Promise.all([
            fetchMediaThumbnail(
              profileResponse.profile_media_id,
              profileResponse.profile_media
                ? `${profileResponse.profile_media.base_url}${profileResponse.profile_media.unique_name}`
                : ""
            ),
            fetchMediaThumbnail(
              profileResponse.passport_media_id,
              profileResponse.passport_media
                ? `${profileResponse.passport_media.base_url}${profileResponse.passport_media.unique_name}`
                : ""
            ),
            fetchMediaThumbnail(
              profileResponse.visa_media_id,
              profileResponse.visa_media
                ? `${profileResponse.visa_media.base_url}${profileResponse.visa_media.unique_name}`
                : ""
            ),
            fetchMediaThumbnail(
              profileResponse.cpr_media_id,
              profileResponse.cpr_media
                ? `${profileResponse.cpr_media.base_url}${profileResponse.cpr_media.unique_name}`
                : ""
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
            aboutMe: profileResponse.about_me || "",
          });

          // Set file data separately
          setFileData({
            profileImage: {
              file: null,
              previewUrl: profileThumb,
              fullUrl: profileResponse.profile_media
                ? `${profileResponse.profile_media.base_url}${profileResponse.profile_media.unique_name}`
                : "",
              mediaId: profileResponse.profile_media?.id || null,
            },
            passportCopy: {
              file: null,
              previewUrl: passportThumb,
              fullUrl: profileResponse.passport_media
                ? `${profileResponse.passport_media.base_url}${profileResponse.passport_media.unique_name}`
                : "",
              mediaId: profileResponse.passport_media?.id || null,
            },
            visaCopy: {
              file: null,
              previewUrl: visaThumb,
              fullUrl: profileResponse.visa_media
                ? `${profileResponse.visa_media.base_url}${profileResponse.visa_media.unique_name}`
                : "",
              mediaId: profileResponse.visa_media?.id || null,
            },
            cprCopy: {
              file: null,
              previewUrl: cprThumb,
              fullUrl: profileResponse.cpr_media
                ? `${profileResponse.cpr_media.base_url}${profileResponse.cpr_media.unique_name}`
                : "",
              mediaId: profileResponse.cpr_media?.id || null,
            },
          });
        }

        await Promise.all([
          fetchCatOptions(),
          fetchGenderOptions(),
          fetchReligionOptions(),
          fetchNationalityOptions(),
          fetchMaritalStatusOptions(),
          fetchWorkAvailableOptions(),
          fetchCountryOptions(),
        ]);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        await notificationService.showToast(error.message || "Failed to load profile data.", "error");
      } finally {
        setTimeout(() => {
          setIsInitialLoading(false);
        }, 500);
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
          const nationalityOptions = countryResponse.map((item) => ({
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
          const countryOptions = countryResponse.map((item) => ({
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
      required: true,
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
      style: inputStyle,
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
      label: "Work Availability",
      options: workAvailableOptions,
      colClass: "col-lg-4 col-md-12",
      placeholder: "Select availability",
      required: true,
      component: Select,
    },
    {
      type: "text",
      name: "no_of_days_available",
      label: "Days Until Available",
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
      required: !fileData.profileImage.fullUrl,
      style: inputStyle,
      previewComponent: (
        <FilePicker
          fieldName="profileImage"
          label="Profile Picture"
          accept="image/*"
          initialPreview={fileData.profileImage.previewUrl}
          initialFileUrl={fileData.profileImage.fullUrl}
          initialFileId={fileData.profileImage.mediaId}
          formError={formErrors.profileImage}
          onFileDataChange={handleFileDataChange}
          onPreviewClick={handlePreviewClick}
          onClearError={handleClearError}
          isGlobalSubmitting={isSubmitting}
          isGlobalLoading={isInitialLoading}
        />
      ),
    },
    {
      type: "file",
      name: "passportCopy",
      label: "Passport Copy",
      accept: ".pdf,.jpg,.png",
      colClass: "col-lg-6 col-md-12",
      required: !fileData.passportCopy.fullUrl,
      style: inputStyle,
      previewComponent: (
        <FilePicker
          fieldName="passportCopy"
          label="Passport Copy"
          accept=".pdf,.jpg,.png"
          initialPreview={fileData.passportCopy.previewUrl}
          initialFileUrl={fileData.passportCopy.fullUrl}
          initialFileId={fileData.passportCopy.mediaId}
          formError={formErrors.passportCopy}
          onFileDataChange={handleFileDataChange}
          onPreviewClick={handlePreviewClick}
          onClearError={handleClearError}
          isGlobalSubmitting={isSubmitting}
          isGlobalLoading={isInitialLoading}
        />
      ),
    },
    {
      type: "file",
      name: "visaCopy",
      label: "Visa Copy",
      accept: ".pdf,.jpg,.png",
      colClass: "col-lg-6 col-md-12",
      required: !fileData.visaCopy.fullUrl,
      style: inputStyle,
      previewComponent: (
        <FilePicker
          fieldName="visaCopy"
          label="Visa Copy"
          accept=".pdf,.jpg,.png"
          initialPreview={fileData.visaCopy.previewUrl}
          initialFileUrl={fileData.visaCopy.fullUrl}
          initialFileId={fileData.visaCopy.mediaId}
          formError={formErrors.visaCopy}
          onFileDataChange={handleFileDataChange}
          onPreviewClick={handlePreviewClick}
          onClearError={handleClearError}
          isGlobalSubmitting={isSubmitting}
          isGlobalLoading={isInitialLoading}
        />
      ),
    },
    {
      type: "file",
      name: "cprCopy",
      label: "CPR Copy",
      accept: ".pdf,.jpg,.png",
      colClass: "col-lg-6 col-md-12",
      required: !fileData.cprCopy.fullUrl,
      style: inputStyle,
      previewComponent: (
        <FilePicker
          fieldName="cprCopy"
          label="CPR Copy"
          accept=".pdf,.jpg,.png"
          initialPreview={fileData.cprCopy.previewUrl}
          initialFileUrl={fileData.cprCopy.fullUrl}
          initialFileId={fileData.cprCopy.mediaId}
          formError={formErrors.cprCopy}
          onFileDataChange={handleFileDataChange}
          onPreviewClick={handlePreviewClick}
          onClearError={handleClearError}
          isGlobalSubmitting={isSubmitting}
          isGlobalLoading={isInitialLoading}
        />
      ),
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    if (!validateForm()) {
      const firstError = Object.values(formErrors)[0] || "Please fill in all required fields";
      await notificationService.showToast(firstError, "error");
      return;
    }

    try {
      console.log("Submitting form, isSubmitting: true");
      setIsSubmitting(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const employeeId = user?.id;
      if (!employeeId) {
        throw new Error("User ID not found in localStorage");
      }

      const getIdFromValue = (options, value) => {
        const option = options.find((opt) => opt.value === value || opt.label === value);
        return option ? option.id : null;
      };

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
        profile_media_id: fileData.profileImage.mediaId,
        passport_media_id: fileData.passportCopy.mediaId,
        visa_media_id: fileData.visaCopy.mediaId,
        cpr_media_id: fileData.cprCopy.mediaId,
      };

      console.log("Profile data to submit:", data);

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
      setTimeout(() => {
        setIsSubmitting(false);
        console.log("Submission complete, isSubmitting: false");
      }, 500);
    }
  };

  console.log("Rendering MyProfile, isInitialLoading:", isInitialLoading, "isSubmitting:", isSubmitting);

  return (
    <div className="relative min-h-screen">
      <style>
        {`
          .is-invalid {
            border: 1px solid #dc3545 !important;
          }
          .invalid-feedback {
            display: block;
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.25rem;
          }
        `}
      </style>
      {(isInitialLoading || isSubmitting) && (
        <Loader text={isInitialLoading ? "Loading..." : "Saving..."} />
      )}
      <ProfileCardForm
        fields={fields}
        formData={formData}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
        handleFileChange={() => {}} // Not used anymore, handled by FilePicker
        onSubmit={handleSubmit}
        loading={isSubmitting || isInitialLoading}
        formErrors={formErrors}
      />
      <Modal isOpen={isModalOpen} onClose={closeModal} isWide={modalContent?.type === "iframe"}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default MyProfile;