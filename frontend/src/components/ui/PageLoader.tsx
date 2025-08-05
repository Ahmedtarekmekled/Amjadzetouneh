import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";

interface PageLoaderProps {
  text?: string;
  showBackground?: boolean;
}

export default function PageLoader({ 
  text = "Loading...", 
  showBackground = true 
}: PageLoaderProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <LoadingSpinner size="lg" color="primary" />
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6 text-lg text-gray-600 font-medium"
      >
        {text}
      </motion.p>
      
      {/* Animated dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex justify-center mt-4 space-x-1"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-amber-500 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );

  if (showBackground) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
} 