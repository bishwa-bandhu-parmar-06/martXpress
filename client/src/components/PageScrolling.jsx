import React from "react";
import { motion, useScroll } from "framer-motion";
const PageScrolling = () => {
  const scrollYprogress = useScroll().scrollYProgress;
  return (
    <>
      <motion.div
        style={{ scaleX: scrollYprogress }}
        className="fixed top-20 left-0 right-0 h-1 origin-left bg-[#F37324] z-50"
      ></motion.div>
    </>
  );
};

export default PageScrolling;
