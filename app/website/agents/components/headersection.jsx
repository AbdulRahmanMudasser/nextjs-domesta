const HeaderSection = () => {
  return (
    <section className="header-section" style={{ backgroundImage: 'url("/images/background/bg.png")', backgroundSize: 'cover', padding: '20px 0', textAlign: 'center' }}>
      <h1 className="header-title">All Agencies are in The UAE Now</h1>
      <CustomSearchBar />
    </section>
  );
};

const CustomSearchBar = () => {
  return (
    <div className="custom-search-container" style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
      <div className="custom-search-box" style={{ position: 'relative', maxWidth: '500px', width: '100%' }}>
        <input
          type="text"
          placeholder="Search by type e.g. Self"
          style={{
            width: '100%',
            padding: '10px 40px 10px 15px',
            border: '1px solid #ccc',
            borderRadius: '30px',
            fontSize: '1rem',
            outline: 'none',
          }}
        />
        <button
          type="button"
          className="custom-search-button"
          style={{
            position: 'absolute',
            right: '0',
            top: '0',
            height: '100%',
            backgroundColor: '#6E7A48',
            color: 'white',
            border: 'none',
            padding: '0 20px',
            borderRadius: '0 30px 30px 0',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default HeaderSection;