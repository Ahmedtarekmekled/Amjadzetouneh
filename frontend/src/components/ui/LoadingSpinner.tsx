import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white" | "gold";
  text?: string;
}

export default function LoadingSpinner({ 
  size = "md", 
  color = "primary",
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  const colorClasses = {
    primary: "border-amber-500",
    white: "border-white",
    gold: "border-yellow-500"
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full ${colorClasses[color]} border-t-transparent`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      {text && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-gray-600 font-medium text-center"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}
