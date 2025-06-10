
const InterviewAvailability = () => {
    const [formData, setFormData] = useState({
      interviewTime: "",
    });
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Form Data:", formData);
    };
  
    const handleChange = (field, value) => {
      setFormData({ ...formData, [field]: value });
    };
  
    const fields = [
      {
        type: "text",
        name: "interviewTime",
        label: "Preferred Interview Time",
        placeholder: "E.g., 10 AM - 12 PM",
        colClass: "col-lg-6 col-md-12",
        required: true,
      },
    ];
  
    return (
      <form className="default-form" onSubmit={handleSubmit}>
        <div className="row">
          {fields.map((field, index) => (
            <div
              key={index}
              className={`form-group ${field.colClass}`}
            >
              <label>
                {field.label} {field.required && <span style={{ color: "red" }}>*</span>}
              </label>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={(e) => handleChange(field.name, e.target.value)}
                required={field.required}
              />
            </div>
          ))}
  
          {/* Submit Button */}
          <div
            className="form-group col-lg-12 col-md-12"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <button type="submit" style={buttonStyle}>
              Save Availability
            </button>
          </div>
        </div>
      </form>
    );
  };

  export default InterviewAvailability;