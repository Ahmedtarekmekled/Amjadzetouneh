import { motion } from 'framer-motion';
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { aboutService } from '@/services/aboutService';

interface ChefData {
  name: string;
  title: string;
  description: string;
  image: string;
  experience: string;
  skills: string[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
}

export default function ChefFeatured() {
  const [chefData, setChefData] = useState<ChefData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const data = await aboutService.getAbout();
        setChefData({
          name: data.content.en.description.split('\n')[0],
          title: data.content.en.description.split('\n')[1],
          description: data.content.en.description,
          image: data.profileImage || '/images/default-chef.jpg',
          experience: data.content.en.experience,
          skills: data.content.en.skills,
          education: data.content.en.education
        });
      } catch (error) {
        console.error('Error fetching chef data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (isLoading || !chefData) {
    return null; // Or a loading spinner
  }

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-w-4 aspect-h-5 rounded-2xl overflow-hidden mb-12 lg:mb-0"
          >
            <Image
              src={chefData.image}
              alt={`Chef ${chefData.name}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:pl-12"
          >
            <div className="text-culinary-gold mb-6">
              <StarIcon className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-culinary-charcoal mb-6">
              From Our Chef's Kitchen
            </h2>
            <blockquote className="text-lg text-gray-600 mb-8">
              {chefData.description}
            </blockquote>
            <div className="flex items-center">
              <div className="mr-4">
                <h3 className="font-display font-semibold text-culinary-charcoal">
                  Chef {chefData.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {chefData.title}
                </p>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <span className="flex-shrink-0 w-12 h-1 bg-culinary-gold rounded" />
                <p>{chefData.experience}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 