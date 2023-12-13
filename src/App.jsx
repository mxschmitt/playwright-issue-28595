import { useState, useCallback, useRef } from "react";
import "./styles.css";

export const useHoverOrFocus = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Wrap in useCallback so we can use in dependencies below
  const handleMouseEnter = useCallback(() => {
    console.log("handleMouseEnter");
    setIsHovered(true);
  }, []);
  const handleMouseLeave = useCallback(() => {
    console.log("handleMouseLeave");
    setIsHovered(false);
  }, []);
  const handleFocus = useCallback(() => {
    console.log("handleFocus");
    setIsFocused(true);
  }, []);
  const handleBlur = useCallback(() => {
    console.log("handleBlur");
    setIsFocused(false);
  }, []);

  // Keep track of the last node passed to callbackRef
  // so we can remove its event listeners.
  const ref = useRef();

  // Use a callback ref instead of useEffect so that event listeners
  // get changed in the case that the returned ref gets added to
  // a different element later. With useEffect, changes to ref.current
  // wouldn't cause a rerender and thus the effect would run again.
  const callbackRef = useCallback(
    (node) => {
      if (ref.current) {
        ref.current.removeEventListener("mouseenter", handleMouseEnter);
        ref.current.removeEventListener("mouseleave", handleMouseLeave);
        ref.current.removeEventListener("focus", handleFocus);
        ref.current.removeEventListener("blur", handleBlur);
      }

      ref.current = node;

      if (ref.current) {
        if (document.activeElement !== ref.current) {
          setIsFocused(false);
        }
        ref.current.addEventListener("mouseenter", handleMouseEnter);
        ref.current.addEventListener("mouseleave", handleMouseLeave);
        ref.current.addEventListener("focus", handleFocus);
        ref.current.addEventListener("blur", handleBlur);
      }
    },
    [handleMouseEnter, handleMouseLeave, handleFocus, handleBlur]
  );

  return [isHovered || isFocused, callbackRef];
};

const A = () => {
  return <span onClick={() => console.log("a click")}>A (on hover)</span>;
};
const B = () => {
  return <span onClick={() => console.log("b click")}>B</span>;
};

export default function App() {
  const [pauseButtonHovered, pauseButtonHoveredRef] = useHoverOrFocus(false);
  const [title, setTitle] = useState("");
  const handleClick = useCallback(() => {
    console.log("onClick (button)");
    setTitle("playwright bug" + Math.random());
  }, []);
  return (
    <div className="App">
      <h1 id="title">{`React18.2, ${title}`}</h1>
      <button
        ref={pauseButtonHoveredRef}
        key="foo"
        id="btnTest"
        onClick={handleClick}
        style={{ width: "500px", height: "500px" }}
      >
        {pauseButtonHovered ? <A /> : <B />}
      </button>
    </div>
  );
}
