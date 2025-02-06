import React from "react";
import "../assets/client/css/bootstrap.min.css";
import "../assets/client/css/bootstrap-select.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Header from "../components/client/Header";
import Footer from "../components/client/Footer";
import "../assets/client/css/bootstrap.min.css";
import "../assets/client/css/bootstrap-select.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../index.css";
import "../styles.css";
const ClientLayout = ({ children }) => {
  return (
    <div className="client-layout-wrapper">
      <Header />

      <section className="">
        <div className="container">
          <div className="row">{children}</div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ClientLayout;
