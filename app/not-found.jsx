import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Page Not Found || Domesta - Listing Board",
  description: "Domesta - Listing Board",
};

const index = () => {
  return (
    <>
      <div
        className="error-page-wrapper "
        style={{
          backgroundImage: `url(/images/404.jpg)`,
        }}
        data-aos="fade"
      >
        <div className="content">
          <div className="logo">
            <Link href="/" style={{ display: "flex", gap: "10px" }}>
              <Image
                alt="brand"
                src="/images/domesta_icon_2.png"
                width={50}
                height={50}
                priority
              />
              <Image
                alt="brand"
                src="/images/retro-icon-text.png"
                width={150}
                height={50}
                priority
              />
            </Link>
          </div>
          {/* End logo */}

          <h1>404!</h1>
          <p>The page you are looking for could not be found.</p>

          <Link className="theme-btn btn-style-three call-modal" href="/">
            BACK TO HOME
          </Link>
        </div>
        {/* End .content */}
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
