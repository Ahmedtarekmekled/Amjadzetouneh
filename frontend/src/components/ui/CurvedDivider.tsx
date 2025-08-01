import { motion } from "framer-motion";

interface CurvedDividerProps {
  type?: "wave" | "curve" | "angled";
  direction?: "up" | "down";
  color?: string;
  className?: string;
}

export default function CurvedDivider({
  type = "wave",
  direction = "down",
  color = "#fef3c7", // yellow-100
  className = "",
}: CurvedDividerProps) {
  const isUp = direction === "up";

  const wavePath = isUp
    ? "M0,32L48,37.3C96,43,192,53,288,90.7C384,128,480,192,576,197.3C672,203,768,149,864,128C960,107,1056,117,1152,128C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
    : "M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,181.3C672,192,768,160,864,144C960,128,1056,128,1152,144C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z";

  const curvePath = isUp
    ? "M0,100 Q720,50 1440,100 L1440,320 L0,320 Z"
    : "M0,220 Q720,270 1440,220 L1440,320 L0,320 Z";

  const angledPath = isUp
    ? "M0,80 L1440,120 L1440,320 L0,320 Z"
    : "M0,240 L1440,200 L1440,320 L0,320 Z";

  const getPath = () => {
    switch (type) {
      case "wave":
        return wavePath;
      case "curve":
        return curvePath;
      case "angled":
        return angledPath;
      default:
        return wavePath;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0 }}
      whileInView={{ opacity: 1, scaleY: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`w-full ${className}`}
      style={{ height: "80px" }}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        fill={color}
      >
        <path d={getPath()} />
      </svg>
    </motion.div>
  );
}
