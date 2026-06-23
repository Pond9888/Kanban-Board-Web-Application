import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.kanbanai.app',
  appName: 'Kanban AI',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    cleartext: false,
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
    minWebViewVersion: 55,
    backgroundColor: '#080810',
  },
  plugins: {
    StatusBar: {
      style: 'Dark',
      backgroundColor: '#080810',
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#080810',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true,
    },
  },
}

export default config
