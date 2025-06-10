"use client";
import Aos from "aos";
import "aos/dist/aos.css";
import "../styles/index.scss";
import { useEffect } from "react";
import ScrollToTop from "../components/common/ScrollTop";
import { Provider } from "react-redux";
import { store, persistor } from "../store/store";
import { PersistGate } from "redux-persist/integration/react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import dynamic from 'next/dynamic';

if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

const PersistGateComponent = dynamic(
  () => import('redux-persist/integration/react').then((mod) => mod.PersistGate),
  { ssr: false }
);

export default function RootLayout({ children }) {
  useEffect(() => {
    Aos.init({
      duration: 1400,
      once: true,
    });
  }, []);
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="keywords"
          content="	employees, career, employment, indeed, job board, job listing, job portal, job postings, job search, job seeker, jobs, recruiters, recruiting, recruitment, resume"
        />
        <meta name="description" content="Domesta  - Listing Board" />
        <meta name="ibthemes" content="ATFN" />

        <link rel="icon" href="./favicon.ico" />
      </head>

      <body>
        <Provider store={store}>
          <PersistGateComponent loading={null} persistor={persistor}>
            <div className="page-wrapper">
              {children}

              {/* Toastify */}
              <ToastContainer
                position="bottom-right"
                autoClose={500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
              {/* <!-- Scroll To Top --> */}
              <ScrollToTop />
            </div>
          </PersistGateComponent>
        </Provider>
      </body>
    </html>
  );
}
