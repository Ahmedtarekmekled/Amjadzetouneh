import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  SunIcon, 
  MoonIcon, 
  CakeIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const MEAL_CATEGORIES = [
  {
    name: 'Breakfast',
    icon: SunIcon,
    description: 'Start your day right',
    color: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    iconColor: 'text-amber-500',
    href: '/recipes?mealTime=breakfast'
  },
  {
    name: 'Lunch',
    icon: SparklesIcon,
    description: 'Midday favorites',
    color: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    iconColor: 'text-emerald-500',
    href: '/recipes?mealTime=lunch'
  },
  {
    name: 'Dinner',
    icon: MoonIcon,
    description: 'Evening delights',
    color: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-200',
    iconColor: 'text-indigo-500',
    href: '/recipes?mealTime=dinner'
  },
  {
    name: 'Desserts',
    icon: CakeIcon,
    description: 'Sweet endings',
    color: 'bg-rose-50',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-200',
    iconColor: 'text-rose-500',
    href: '/recipes?mealTime=dessert'
  },
];

export default function MealTimesGrid() {
  return (
    <section className="py-20 bg-culinary-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-display font-bold text-culinary-charcoal mb-4"
          >
            Explore by Meal Time
          </motion.h2>
          <p className="text-lg text-gray-600">
            Find the perfect recipe for any time of day
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MEAL_CATEGORIES.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={category.href}
                  className={`block h-full rounded-2xl border-2 ${category.borderColor} ${category.color} p-6 transition-transform hover:scale-105`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`p-3 rounded-full ${category.color} mb-4`}>
                      <Icon className={`w-8 h-8 ${category.iconColor}`} />
                    </div>
                    <h3 className={`text-xl font-display font-semibold ${category.textColor} mb-2`}>
                      {category.name}
                    </h3>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
} 