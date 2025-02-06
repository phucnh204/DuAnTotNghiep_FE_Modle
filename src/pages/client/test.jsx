import React, { useEffect } from "react";
import Swiper from "swiper";
import "../../assets/client/css/swiper-bundle.min.css";
import "../../assets/client/css/bootstrap.min.css";
import "../../assets/client/css/drift-basic.min.css";
import "../../assets/client/css/photoswipe.css";
import "../../assets/client/css/animate.css";
import Shop from "./Shop";

const DetailProduct = () => {
  useEffect(() => {
    const swiper = new Swiper(".tf-product-media-main", {
      loop: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      on: {
        init: function () {
          console.log("Swiper initialized");
        },
      },
    });

    // Cleanup khi component unmount
  }, []);

  return (
    <>
      <Shop />
    </>
  );
};

export default DetailProduct;
