"use client";

import { useState, useEffect } from "react";
import CardForm from "@/templates/forms/card-form";
import { networkService } from "@/services/network.service";
import { notificationService } from "@/services/notification.service";

// Define inputStyle for file inputs (matching Document.jsx)
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
  });
  const [catOptions, setCatOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [religionOptions, setReligionOptions] = useState([]);
  const [nationalityOptions, setNationalityOptions] = useState([]);
  const [maritalStatusOptions, setMaritalStatusOptions] = useState([]);
  const [workAvailableOptions, setWorkAvailableOptions] = useState([]);
  
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

          // Set existing image previews
          setImagePreviews({
            profileImage: profileResponse.profile_media ? 
              `${profileResponse.profile_media.base_url}${profileResponse.profile_media.unique_name}` : "",
            passportCopy: profileResponse.passport_media ? 
              `${profileResponse.passport_media.base_url}${profileResponse.passport_media.unique_name}` : "",
            visaCopy: profileResponse.visa_media ? 
              `${profileResponse.visa_media.base_url}${profileResponse.visa_media.unique_name}` : "",
            cprCopy: profileResponse.cpr_media ? 
              `${profileResponse.cpr_media.base_url}${profileResponse.cpr_media.unique_name}` : "",
          });
        }

        // Fetch all dropdown options
        await Promise.all([
          fetchCatOptions(),
          fetchGenderOptions(),
          fetchReligionOptions(),
          fetchNationalityOptions(),
          fetchMaritalStatusOptions(),
          fetchWorkAvailableOptions()
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
        // Use hardcoded nationality options since API might not have this dropdown
        const staticNationalityOptions = [
          { value: "Bahraini", label: "Bahraini", id: 1 },
          { value: "Kuwaiti", label: "Kuwaiti", id: 2 },
          { value: "Omani", label: "Omani", id: 3 },
          { value: "Qatari", label: "Qatari", id: 4 },
          { value: "Saudi", label: "Saudi", id: 5 },
          { value: "Emirati", label: "Emirati", id: 6 },
          { value: "Egyptian", label: "Egyptian", id: 7 },
        ];
        setNationalityOptions(staticNationalityOptions);
      } catch (error) {
        console.error("Error setting nationality options:", error);
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

    fetchData();
  }, []);

  const gulfCountries = [
    { value: "Bahrain", label: "Bahrain" },
    { value: "Kuwait", label: "Kuwait" },
    { value: "Oman", label: "Oman" },
    { value: "Qatar", label: "Qatar" },
    { value: "Saudi Arabia", label: "Saudi Arabia" },
    { value: "United Arab Emirates", label: "United Arab Emirates" },
  ];

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
      colClass: "col-lg-3 col-md-12",
      required: true,
    },
    {
      type: "text",
      name: "middleName",
      label: "Middle Name",
      placeholder: "Michael",
      colClass: "col-lg-3 col-md-12",
      required: false,
    },
    {
      type: "text",
      name: "lastName",
      label: "Last Name",
      placeholder: "Doe",
      colClass: "col-lg-3 col-md-12",
      required: true,
    },
    {
      type: "text",
      name: "email",
      label: "Email",
      placeholder: "employee@gmail.com",
      colClass: "col-lg-3 col-md-12",
      readOnly: true,
    },
    {
      type: "text",
      name: "address",
      label: "Address",
      placeholder: "Enter your address",
      colClass: "col-lg-12 col-md-12",
      required: true,
    },
    {
      type: "select",
      name: "gender",
      label: "Gender",
      options: genderOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Gender",
      required: true,
    },
    {
      type: "number",
      name: "age",
      label: "Age",
      placeholder: "Enter age",
      colClass: "col-lg-3 col-md-12",
      min: "18",
      required: true,
    },
    {
      type: "date",
      name: "dob",
      label: "Date of Birth",
      colClass: "col-lg-3 col-md-12",
      required: true,
      style: inputStyle,
    },
    {
      type: "select",
      name: "catOptions",
      label: "Category",
      options: catOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select category",
      required: true,
    },
    {
      type: "select",
      name: "nationality",
      label: "Nationality",
      options: nationalityOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Nationality",
      required: true,
    },
    {
      type: "select",
      name: "religion",
      label: "Religion",
      options: religionOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Religion",
      required: true,
    },
    {
      type: "select",
      name: "maritalStatus",
      label: "Marital Status",
      options: maritalStatusOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Marital Status",
      required: true,
    },
    {
      type: "text",
      name: "childrenCount",
      label: "Number of Children",
      placeholder: "0",
      colClass: "col-lg-3 col-md-12",
      min: "0",
      required: true,
    },
    {
      type: "select",
      name: "in_bahrain",
      label: "Currently in Bahrain?",
      options: yesNoOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Option",
      required: true,
    },
    {
      type: "select",
      name: "outside_country",
      label: "If outside Bahrain, specify country",
      options: gulfCountries,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Country",
      required: true,
    },
    {
      type: "select",
      name: "work_available",
      label: "Work Available",
      options: workAvailableOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select availability",
      required: true,
    },
    {
      type: "text",
      name: "no_of_days_available",
      label: "Available after how many days?",
      placeholder: "Number of days",
      colClass: "col-lg-3 col-md-12",
      required: true,
    },
    {
      type: "select",
      name: "current_location",
      label: "Current Location",
      options: gulfCountries,
      colClass: "col-lg-6 col-md-12",
      placeholder: "Select Country",
      required: true,
    },
    {
      type: "file",
      name: "profileImage",
      label: "Profile Picture",
      accept: "image/*",
      colClass: "col-lg-6 col-md-12",
      required: true,
      style: inputStyle,
      preview: imagePreviews.profileImage,
    },
    {
      type: "file",
      name: "passportCopy",
      label: "Passport Copy",
      accept: ".pdf,.jpg,.png",
      colClass: "col-lg-6 col-md-12",
      required: true,
      style: inputStyle,
      preview: imagePreviews.passportCopy,
    },
    {
      type: "file",
      name: "visaCopy",
      label: "Visa Copy",
      accept: ".pdf,.jpg,.png",
      colClass: "col-lg-6 col-md-12",
      required: true,
      style: inputStyle,
      preview: imagePreviews.visaCopy,
    },
    {
      type: "file",
      name: "cprCopy",
      label: "CPR Copy",
      accept: ".pdf,.jpg,.png",
      colClass: "col-lg-6 col-md-12",
      required: true,
      style: inputStyle,
      preview: imagePreviews.cprCopy,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const employeeId = user?.id;
      if (!employeeId) {
        throw new Error("User ID not found in localStorage");
      }

      // Map form values to API expected IDs (similar to InterviewManagement)
      const getIdFromValue = (options, value) => {
        const option = options.find(opt => opt.value === value || opt.label === value);
        return option ? option.id : null;
      };

      // Get country ID from gulf countries (you might need to adjust this based on your API)
      const getCountryId = (countryName) => {
        const countryMap = {
          "Bahrain": 1,
          "Kuwait": 2, 
          "Oman": 3,
          "Qatar": 4,
          "Saudi Arabia": 5,
          "United Arab Emirates": 6
        };
        return countryMap[countryName] || null;
      };

      // Prepare data for API
      const data = {
        employee_id: employeeId,
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        address: formData.address,
        gender_id: getIdFromValue(genderOptions, formData.gender),
        age: parseInt(formData.age) || null,
        date_of_birth: formData.dob,
        cat_option_id: getIdFromValue(catOptions, formData.catOptions),
        nationality_id: getIdFromValue(nationalityOptions, formData.nationality),
        religion_id: getIdFromValue(religionOptions, formData.religion),
        marital_status_id: getIdFromValue(maritalStatusOptions, formData.maritalStatus),
        number_of_children: parseInt(formData.childrenCount) || 0,
        currently_in_bahrain: formData.in_bahrain === "true",
        outside_country_id: getCountryId(formData.outside_country),
        work_available_id: getIdFromValue(workAvailableOptions, formData.work_available),
        available_for_work_after_days: parseInt(formData.no_of_days_available) || null,
        current_location_id: getCountryId(formData.current_location),
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

  return (
    <CardForm
      fields={fields}
      formData={formData}
      handleChange={handleChange}
      handleSelectChange={handleSelectChange}
      handleFileChange={handleFileChange}
      onSubmit={handleSubmit}
    />
  );
};

export default MyProfile;