'use client'

import { useRouter } from "next/navigation";



const SearchForm5 = () => {
    const router = useRouter()
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <form onClick={handleSubmit}>
      <div className="row justify-content-center justify-content-md-between">
        {/* <!-- Form Group --> */}
        <div className="form-group col-lg-9">
          <span className="icon flaticon-search-1"></span>
          <input
            type="text"
            name="field_name"
            placeholder="Job title, keywords, or company"
          />
        </div>

        {/* <!-- Form Group --> */}
        <div className="form-group col-auto">
          <button
            type="submit"
            className="theme-btn btn-style-two"
            onClick={() => router.push("/job-list-v9")}
            
          >
            Find Listings
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm5;
