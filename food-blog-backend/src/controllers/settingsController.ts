import { Request, Response } from "express";
import Settings from "../models/Settings";
import About from "../models/About";

const DEFAULT_SETTINGS = {
  siteTitle: "Food Blog",
  siteDescription: "Discover delicious recipes and culinary adventures",
  heroImage: "/images/default-hero.jpg",
  profileData: {
    name: "Chef",
    bio: "Welcome to my food blog",
    photo: "/images/default-profile.jpg",
    cv: "",
    experiences: [],
  },
  socialLinks: [],
  branding: {
    logo: "/images/logo.png",
    favicon: "/images/default-favicon.png",
    hero: {
      backgroundImage: "/images/default-hero.jpg",
      en: {
        title: "Culinary Adventures Await",
        subtitle:
          "Discover mouthwatering recipes, cooking tips, and culinary stories that will inspire your next kitchen masterpiece",
        ctaText: "Explore Recipes",
      },
      ar: {
        title: "مغامرات الطهي تنتظرك",
        subtitle:
          "اكتشف وصفات شهية ونصائح طهي وقصص طهي ستلهمك لتحضير تحفة طهي جديدة",
        ctaText: "استكشف الوصفات",
      },
    },
  },
  seo: {
    metaTitle: "Food Blog - Home",
    metaDescription: "Welcome to our Food Blog",
  },
};

export const settingsController = {
  getAllSettings: async (_req: Request, res: Response) => {
    try {
      const [settings, about] = await Promise.all([
        Settings.findOne().lean(),
        About.findOne().lean(),
      ]);

      console.log("🔍 Settings data:", JSON.stringify(settings, null, 2));
      console.log("🔍 About data:", JSON.stringify(about, null, 2));

      if (!settings) {
        // If about data exists, use its profile image
        const defaultWithAbout = {
          ...DEFAULT_SETTINGS,
          profileData: {
            ...DEFAULT_SETTINGS.profileData,
            photo: about?.profileImage || DEFAULT_SETTINGS.profileData.photo,
            cv: about?.cvFile || DEFAULT_SETTINGS.profileData.cv,
          },
        };
        console.log(
          "🔍 Returning default settings:",
          JSON.stringify(defaultWithAbout, null, 2)
        );
        return res.json(defaultWithAbout);
      }

      // If settings exist but we want to use about data for profile
      const settingsWithAbout = {
        ...settings,
        branding: {
          logo: settings.branding?.logo || DEFAULT_SETTINGS.branding.logo,
          favicon: settings.branding?.favicon || DEFAULT_SETTINGS.branding.favicon,
          hero: {
            backgroundImage: settings.branding?.hero?.backgroundImage || DEFAULT_SETTINGS.branding.hero.backgroundImage,
            en: settings.branding?.hero?.en || DEFAULT_SETTINGS.branding.hero.en,
            ar: settings.branding?.hero?.ar || DEFAULT_SETTINGS.branding.hero.ar,
          },
        },
        profileData: {
          ...settings.profileData,
          photo: about?.profileImage || settings.profileData.photo,
          cv: about?.cvFile || settings.profileData.cv,
        },
      };

      console.log(
        "🔍 Returning settings with about:",
        JSON.stringify(settingsWithAbout, null, 2)
      );

      // Ensure we're returning a plain object
      const plainSettings = JSON.parse(JSON.stringify(settingsWithAbout));
      res.json(plainSettings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Error fetching settings" });
    }
  },

  updateSettings: async (req: Request, res: Response) => {
    try {
      const settings = await Settings.findOneAndUpdate({}, req.body, {
        new: true,
        upsert: true,
      }).lean();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Error updating settings" });
    }
  },

  exportSettings: async (req: Request, res: Response) => {
    try {
      const settings = await Settings.findOne().lean();
      if (!settings) {
        return res.status(404).json({ message: "No settings found" });
      }
      res.json(settings);
    } catch (error) {
      console.error("Error in exportSettings:", error);
      res.status(500).json({ message: "Error exporting settings" });
    }
  },

  importSettings: async (req: Request, res: Response) => {
    try {
      let settings = await Settings.findOne();

      if (settings) {
        Object.assign(settings, req.body);
        await settings.save();
        res.json({
          message: "Settings imported successfully",
          settings: settings.toObject(),
        });
      } else {
        settings = await Settings.create(req.body);
        res.json({
          message: "Settings imported successfully",
          settings: settings.toObject(),
        });
      }
    } catch (error) {
      console.error("Error in importSettings:", error);
      res.status(400).json({ message: "Error importing settings" });
    }
  },

  resetSettings: async (req: Request, res: Response) => {
    try {
      await Settings.deleteOne({});
      const newSettings = await Settings.create({});
      res.json(newSettings.toObject());
    } catch (error) {
      console.error("Error in resetSettings:", error);
      res.status(500).json({ message: "Error resetting settings" });
    }
  },
};
