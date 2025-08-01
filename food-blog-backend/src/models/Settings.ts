import mongoose, { Document, Schema } from "mongoose";

interface ISettings extends Document {
  siteTitle: string;
  siteDescription: string;
  heroImage: string;
  profileData: {
    name: string;
    bio: string;
    photo: string;
    cv: string;
    experiences: Array<{
      title: string;
      period: string;
      description: string;
    }>;
  };
  socialLinks: Array<{
    platform: string;
    url: string;
    icon: string;
  }>;
  branding: {
    logo: string;
    favicon: string;
    hero: {
      backgroundImage: string;
      en: {
        title: string;
        subtitle: string;
        ctaText: string;
      };
      ar: {
        title: string;
        subtitle: string;
        ctaText: string;
      };
    };
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: Array<string>;
    ogImage: string;
    analytics: {
      googleAnalyticsId: string;
      facebookPixelId: string;
    };
  };
}

const settingsSchema = new Schema<ISettings>(
  {
    siteTitle: { type: String, required: true, default: "Food Blog" },
    siteDescription: { type: String, required: true },
    heroImage: { type: String },
    profileData: {
      name: { type: String, required: true },
      bio: { type: String },
      photo: { type: String },
      cv: { type: String },
      experiences: [
        {
          title: { type: String, required: true },
          period: { type: String },
          description: { type: String },
        },
      ],
    },
    socialLinks: [
      {
        platform: { type: String, required: true },
        url: { type: String, required: true },
        icon: { type: String, required: true },
      },
    ],
    branding: {
      logo: { type: String },
      favicon: { type: String },
      hero: {
        backgroundImage: { type: String },
        en: {
          title: { type: String },
          subtitle: { type: String },
          ctaText: { type: String },
        },
        ar: {
          title: { type: String },
          subtitle: { type: String },
          ctaText: { type: String },
        },
      },
    },
    seo: {
      metaTitle: { type: String, required: true },
      metaDescription: { type: String, required: true },
      keywords: [{ type: String }],
      ogImage: { type: String },
      analytics: {
        googleAnalyticsId: { type: String },
        facebookPixelId: { type: String },
      },
    },
  },
  { timestamps: true }
);

// Ensure only one settings document exists
settingsSchema.pre('save', async function(next) {
  const count = await mongoose.models.Settings.countDocuments();
  if (count === 0 || this._id) {
    return next();
  }
  const err = new Error('Only one settings document can exist');
  return next(err);
});

export default mongoose.model<ISettings>("Settings", settingsSchema); 