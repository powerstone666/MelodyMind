import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import arjith from "../assets/arjith.jpg";
import armaan from "../assets/armaan.png";
import atif from "../assets/atif.jpg";
import villain from "../assets/villain.jpg";
import bj from "../assets/bj.jpg";
import mar from "../assets/mar.jpg";
import bro from "../assets/bro.jfif";
// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";

function Swipe() {
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img src={arjith} />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <img src={armaan} />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <img src={atif} />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <img src={villain} />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <img src={bj} />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <img src={bro} />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <img src={mar} />
        </SwiperSlide>
      </Swiper>
    </>
  );
}
export default Swipe;
