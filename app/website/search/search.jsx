
import WsPageOuter from "@/templates/layouts/ws-page-outer";
import JobSearchForm from "./components/JobSearchForm";
import FilterTopBox from "../employees/filtertopbox";

const Search = () => {
    return (
        <WsPageOuter>
            <>

                <section className="page-title style-two">
                    <div className="auto-container">
                        <JobSearchForm />
                        {/* <!-- Job Search Form --> */}
                    </div>
                </section>
                {/* <!--End Page Title--> */}

                <section className="ls-section">
                    <div className="auto-container">
                        <div className="row">
                            <div className="content-column col-lg-12 col-md-12 col-sm-12">
                                <div className="ls-outer">
                                    <FilterTopBox />
                                    {/* <!-- ls Switcher --> */}
                                </div>
                            </div>
                            {/* <!-- End Content Column --> */}
                        </div>
                        {/* End row */}
                    </div>
                    {/* End container */}
                </section>
                {/* <!--End Listing Page Section --> */}

            </>
        </WsPageOuter>
    );
};

export default Search;
