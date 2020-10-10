import React from "react";
import { motion } from "framer-motion";

export default function Card({ item, handleFlip }) {
  const cardwidth = window.innerWidth > 900 ? 300 : window.innerWidth / 4;
  const cardheight = window.innerWidth > 900 ? 300 : window.innerWidth / 4;
  return (
    <div
      key={item.id}
      style={{
        position: "relative",
        width: cardwidth,
        height: cardheight,
        margin: 5
      }}
    >
      {!item.solved ? (
        <>
          <motion.div
            initial={{ rotateY: -180 }}
            animate={item.flipped ? { rotateY: 0 } : { rotateY: -180 }}
            transition={{ duration: 0.5 }}
            key={item.src + "a"}
            onClick={() => handleFlip(item.id)}
            style={{
              width: "100%",
              height: "100%",
              backgroundImage: `url(${item.src})`,
              backgroundColor: "#acd9e3",
              backgroundSize: "cover",
              borderRadius: 20,
              WebkitBackfaceVisibility: "hidden",
              position: "absolute"
            }}
          ></motion.div>
          <motion.div
            initial={{ rotateY: 0 }}
            animate={item.flipped ? { rotateY: -180 } : { rotateY: 0 }}
            transition={{ duration: 0.5 }}
            key={item.src + "b"}
            onClick={() => handleFlip(item.id)}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#acd9e3",
              borderRadius: 20,
              WebkitBackfaceVisibility: "hidden",
              position: "absolute"
            }}
          ></motion.div>
        </>
      ) : (
        <motion.div
          animate={{ scale: [1, 0.8, 1] }}
          transition={{ duration: 0.5 }}
          key={item.src + "c"}
          style={{
            width: "100%",
            height: "100%",
            backgroundImage: `url(${item.src})`,
            backgroundSize: "cover",
            borderRadius: 20,
            position: "absolute"
          }}
        ></motion.div>
      )}
    </div>
  );
}
