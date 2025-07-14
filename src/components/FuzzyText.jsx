import React, { useEffect, useRef } from "react";
import { useTheme } from "./ThemeContext"; // adjust path

const FuzzyText = ({
  children,
  fontSize, // optional
  fontWeight = 900,
  fontFamily = "inherit",
  color, // optional
  enableHover = true,
  baseIntensity = 0.18,
  hoverIntensity = 0.5,
  className = "",
}) => {

  const theme = useTheme(); // 👈 this triggers rerender on theme change
  
  const canvasRef = useRef(null);

  useEffect(() => {
  let animationFrameId;
  let isCancelled = false;
  const canvas = canvasRef.current;
  if (!canvas) return;

  let lastColor = "";
  let lastFontSize = "";

  const drawText = async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    if (isCancelled) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const computedStyle = window.getComputedStyle(canvas);
    const resolvedFontSize = fontSize ?? computedStyle.fontSize;
    const resolvedColor = color ?? computedStyle.color;
    const resolvedFontFamily =
      fontFamily === "inherit"
        ? computedStyle.fontFamily || "sans-serif"
        : fontFamily;

    const fontSizeStr =
      typeof resolvedFontSize === "number"
        ? `${resolvedFontSize}px`
        : resolvedFontSize;

    let numericFontSize;
    if (typeof resolvedFontSize === "number") {
      numericFontSize = resolvedFontSize;
    } else {
      const temp = document.createElement("span");
      temp.style.fontSize = resolvedFontSize;
      document.body.appendChild(temp);
      const computedSize = window.getComputedStyle(temp).fontSize;
      numericFontSize = parseFloat(computedSize);
      document.body.removeChild(temp);
    }

    const text = React.Children.toArray(children).join("");

    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d");
    if (!offCtx) return;

    offCtx.font = `${fontWeight} ${fontSizeStr} ${resolvedFontFamily}`;
    offCtx.textBaseline = "alphabetic";
    const metrics = offCtx.measureText(text);

    const actualLeft = metrics.actualBoundingBoxLeft ?? 0;
    const actualRight = metrics.actualBoundingBoxRight ?? metrics.width;
    const actualAscent = metrics.actualBoundingBoxAscent ?? numericFontSize;
    const actualDescent =
      metrics.actualBoundingBoxDescent ?? numericFontSize * 0.2;

    const textBoundingWidth = Math.ceil(actualLeft + actualRight);
    const tightHeight = Math.ceil(actualAscent + actualDescent);

    const extraWidthBuffer = 10;
    const offscreenWidth = textBoundingWidth + extraWidthBuffer;

    offscreen.width = offscreenWidth;
    offscreen.height = tightHeight;

    const xOffset = extraWidthBuffer / 2;
    offCtx.font = `${fontWeight} ${fontSizeStr} ${resolvedFontFamily}`;
    offCtx.textBaseline = "alphabetic";
    offCtx.fillStyle = resolvedColor;
    offCtx.fillText(text, xOffset - actualLeft, actualAscent);

    const horizontalMargin = 50;
    const verticalMargin = 0;
    canvas.width = offscreenWidth + horizontalMargin * 2;
    canvas.height = tightHeight + verticalMargin * 2;
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
    ctx.translate(horizontalMargin, verticalMargin);

    const interactiveLeft = horizontalMargin + xOffset;
    const interactiveTop = verticalMargin;
    const interactiveRight = interactiveLeft + textBoundingWidth;
    const interactiveBottom = interactiveTop + tightHeight;

    let isHovering = false;
    const fuzzRange = 30;

    const run = () => {
      if (isCancelled) return;
      ctx.clearRect(
        -fuzzRange,
        -fuzzRange,
        offscreenWidth + 2 * fuzzRange,
        tightHeight + 2 * fuzzRange
      );
      const intensity = isHovering ? hoverIntensity : baseIntensity;
      for (let j = 0; j < tightHeight; j++) {
        const dx = Math.floor(intensity * (Math.random() - 0.5) * fuzzRange);
        ctx.drawImage(
          offscreen,
          0,
          j,
          offscreenWidth,
          1,
          dx,
          j,
          offscreenWidth,
          1
        );
      }
      animationFrameId = window.requestAnimationFrame(run);
    };

    run();

    // Hover interactions
    const isInsideTextArea = (x, y) =>
      x >= interactiveLeft &&
      x <= interactiveRight &&
      y >= interactiveTop &&
      y <= interactiveBottom;

    const handleMouseMove = (e) => {
      if (!enableHover) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      isHovering = isInsideTextArea(x, y);
    };

    const handleMouseLeave = () => {
      isHovering = false;
    };

    const handleTouchMove = (e) => {
      if (!enableHover) return;
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      isHovering = isInsideTextArea(x, y);
    };

    const handleTouchEnd = () => {
      isHovering = false;
    };

    if (enableHover) {
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseleave", handleMouseLeave);
      canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
      canvas.addEventListener("touchend", handleTouchEnd);
    }

    const cleanup = () => {
      window.cancelAnimationFrame(animationFrameId);
      if (enableHover) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
        canvas.removeEventListener("touchmove", handleTouchMove);
        canvas.removeEventListener("touchend", handleTouchEnd);
      }
    };

    canvas.cleanupFuzzyText = cleanup;
    lastColor = resolvedColor;
    lastFontSize = fontSizeStr;
  };

  drawText();

  

  return () => {
    isCancelled = true;
    window.cancelAnimationFrame(animationFrameId);
    // observer.disconnect();
    if (canvas && canvas.cleanupFuzzyText) {
      canvas.cleanupFuzzyText();
    }
  };
}, [
  children,
  fontSize,
  fontWeight,
  fontFamily,
  color,
  enableHover,
  baseIntensity,
  hoverIntensity,
  theme, // 👈 re-trigger when theme changes
]);


  return <canvas ref={canvasRef} className={className} />;
};

export default FuzzyText;
