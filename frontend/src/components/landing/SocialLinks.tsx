import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface SocialLinksProps {
  links: SocialLink[];
}

export default function SocialLinks({ links = [] }: SocialLinksProps) {
  const { language } = useLanguage();

  if (!links || links.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-culinary-beige dark:bg-culinary-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-display font-bold text-culinary-charcoal dark:text-culinary-gold mb-4">
            {language === "ar" ? "تواصل معي" : "Connect With Me"}
          </h2>
          <p className="text-culinary-brown dark:text-culinary-beige">
            {language === "ar"
              ? "تابعني على وسائل التواصل الاجتماعي للحصول على أحدث الوصفات والنصائح"
              : "Follow me on social media for the latest recipes and tips"}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {links.map((link, index) => (
            <motion.a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group flex flex-col items-center p-6 bg-white dark:bg-culinary-brown rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
            >
              <div
                className="w-8 h-8 mb-4 text-culinary-charcoal dark:text-culinary-gold transition-transform group-hover:scale-110"
                dangerouslySetInnerHTML={{ __html: link.icon }}
              />
              <span className="text-culinary-charcoal dark:text-culinary-gold font-medium">
                {link.platform}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
