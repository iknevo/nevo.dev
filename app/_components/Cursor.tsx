import AnimatedCursor from "react-animated-cursor";

export default function Cursor() {
  return (
    <AnimatedCursor
      innerSize={10}
      outerSize={50}
      color="216, 78, 44"
      outerAlpha={1}
      innerScale={1.25}
      outerScale={2.5}
      trailingSpeed={10}
      clickables={[".cursor", "a", "button"]}
      outerStyle={{ mixBlendMode: "exclusion" }}
      innerStyle={{ mixBlendMode: "exclusion", backgroundColor: "#ffffff" }}
    />
  );
}
