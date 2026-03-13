"use client";
import React from "react";

interface SpinnerProps {
  size?: number | string;
  thickness?: number | string;
  color?: string;
  ringColor?: string;
  speed?: number;
  className?: string;
  label?: string;
}

export default function Spinner({
  size = 50,
  thickness = 3,
  color = "#0e7490",
  ringColor,
  speed = 600,
  className = "",
  label = "Loading...",
}: SpinnerProps) {
  const toPx = (v: number | string) =>
    typeof v === "number" ? `${v}px` : v;

  const style = {
    "--sp-size": toPx(size),
    "--sp-thickness": toPx(thickness),
    "--sp-color": color,
    "--sp-ring": ringColor || color,
    "--sp-speed": `${speed}ms`,
  } as React.CSSProperties;

  return (
    <div
      className={`spinner ${className}`}
      style={style}
      role="status"
      aria-label={label}
      aria-live="polite"
    />
  );
}