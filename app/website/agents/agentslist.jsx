import WsPageOuter from "@/templates/layouts/ws-page-outer";
import FilterSidebar from "./filtersidebar";
import FilterTopBox from "./filtertopbox";
import NationalityFilter from "./components/nationalityfilters";
import HeaderSection from "./components/headersection";

const AgentsList = () => {
  return (
    <WsPageOuter>
        <HeaderSection/>
             <section className="ls-section">
                <div className="auto-container">
                    <NationalityFilter/>
                    <div className="row">
                        <div
                            className="offcanvas offcanvas-start"
                            tabIndex="-1"
                            id="filter-sidebar"
                            aria-labelledby="offcanvasLabel"
                        >
                            <div className="filters-column hide-left">
                                <FilterSidebar />
                            </div>
                        </div>
                        {/* End filter column for tablet and mobile devices */}

                        <div className="filters-column hidden-1023 col-lg-4 col-md-12 col-sm-12">
                            <FilterSidebar />
                        </div>
                        {/* <!-- End Filters Column for destop and laptop --> */}

                        <div className="content-column col-lg-8 col-md-12 col-sm-12">
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
    </WsPageOuter>
  );
};

export default AgentsList;
