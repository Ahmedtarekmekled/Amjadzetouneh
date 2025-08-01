import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { EnvelopeIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export default function NewsletterForm() {
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const translations = {
    en: {
      title: "Stay Updated with Our Latest Recipes",
      subtitle:
        "Get exclusive recipes, cooking tips, and culinary stories delivered to your inbox",
      placeholder: "Enter your email address",
      button: "Subscribe Now",
      loading: "Subscribing...",
      success:
        "Thank you for subscribing! You'll receive our latest recipes soon.",
      error: "Something went wrong. Please try again.",
    },
    ar: {
      title: "ابق على اطلاع بأحدث وصفاتنا",
      subtitle:
        "احصل على وصفات حصرية ونصائح طهي وقصص طهي تُرسل إلى بريدك الإلكتروني",
      placeholder: "أدخل عنوان بريدك الإلكتروني",
      button: "اشترك الآن",
      loading: "جاري الاشتراك...",
      success: "شكراً لك على الاشتراك! ستتلقى أحدث وصفاتنا قريباً.",
      error: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
    },
  };

  const t = translations[language as "en" | "ar"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // Add your newsletter subscription logic here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
      setStatus("success");
      setMessage(t.success);
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(t.error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-full text-sm font-semibold mb-6">
          📧 {language === "ar" ? "النشرة الإخبارية" : "Newsletter"}
        </div>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          dir={language === "ar" ? "rtl" : "ltr"}
        >
          {t.title}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
          dir={language === "ar" ? "rtl" : "ltr"}
        >
          {t.subtitle}
        </motion.p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        onSubmit={handleSubmit}
        className="max-w-md mx-auto"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.placeholder}
            className={`w-full pl-10 pr-4 py-4 border-2 border-gray-300 rounded-full focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:ring-yellow-400 dark:focus:border-yellow-400 transition-all duration-300 ${
              language === "ar" ? "text-right" : "text-left"
            }`}
            required
          />
        </div>

        <motion.button
          type="submit"
          disabled={status === "loading"}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full mt-4 px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center justify-center">
            {status === "loading" ? t.loading : t.button}
            {status !== "loading" && (
              <ArrowRightIcon
                className={`w-5 h-5 ${
                  language === "ar" ? "mr-2 rotate-180" : "ml-2"
                }`}
              />
            )}
          </span>
        </motion.button>

        {message && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-sm mt-4 ${
              status === "success"
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
            dir={language === "ar" ? "rtl" : "ltr"}
          >
            {message}
          </motion.p>
        )}
      </motion.form>
    </div>
  );
}
