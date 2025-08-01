import type { AppProps } from "next/app";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import MainLayout from "@/components/layouts/MainLayout";
import "@/styles/globals.css";

export default function MyApp({ Component, pageProps, router }: AppProps) {
  const isDashboard = router.pathname.startsWith('/dashboard');

  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <LanguageWrapper>
            {isDashboard ? (
              <Component {...pageProps} />
            ) : (
              <MainLayout>
                <Component {...pageProps} />
              </MainLayout>
            )}
          </LanguageWrapper>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

// Separate component to use language context after provider is mounted
import { useLanguage } from "@/contexts/LanguageContext";

function LanguageWrapper({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  
  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {children}
    </div>
  );
}
