import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.probiz.erp',
  appName: 'ProBiz ERP',
  webDir: 'build',
  server: {
    // Allow mixed HTTP/HTTPS for local dev; production uses pythonanywhere
    allowNavigation: ['raees1989.pythonanywhere.com'],
    cleartext: true,
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#ffffff',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1e40af',
      showSpinner: false,
    },
  },
};

export default config;
