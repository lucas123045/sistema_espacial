import React from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

export default function StarsBackground() {
  return (
    <Canvas
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
      }}
      camera={{ position: [0, 0, 1] }}
    >
      <Stars
        radius={100}
        depth={50}
        count={6000}
        factor={4}
        fade
        speed={1}
      />
    </Canvas>
  );
}