import 'dotenv/config';

export default {
  expo: {
    name: "padel-mate",
    slug: "padel-mate",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "padelmate",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anonymous.padelmate",
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.anonymous.padelmate",
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: { backgroundColor: "#000000" },
        },
      ],
      "@react-native-community/datetimepicker",
      "expo-font",
      "expo-image",
      "expo-status-bar",
      "expo-web-browser",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      cognitoRegion: process.env.COGNITO_REGION,
      cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
      cognitoClientId: process.env.COGNITO_CLIENT_ID,
      cognitoDomain: process.env.COGNITO_DOMAIN,
      apiBaseUrl: process.env.API_BASE_URL,
    },
  },
};
