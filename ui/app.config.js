const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, process.env.APP_ENV === 'prod' ? '.env.prod' : '.env'),
});

module.exports = {
  expo: {
    name: "Padel Mate",
    slug: "padel-mate",
    version: "1.0.10",
    orientation: "portrait",
    icon: "./assets/images/padel-mate-icon.png",
    scheme: "padelmate",
    userInterfaceStyle: "automatic",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anonymous.padelmate",
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/padel-mate-icon.png",
        monochromeImage: "./assets/images/padel-mate-icon.png",
      },
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
          image: "./assets/images/padel-mate-icon.png",
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
      newArchEnabled: true,
      edgeToEdgeEnabled: true,
    },
    extra: {
      cognitoRegion: process.env.COGNITO_REGION,
      cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
      cognitoClientId: process.env.COGNITO_CLIENT_ID,
      cognitoDomain: process.env.COGNITO_DOMAIN,
      apiBaseUrl: process.env.API_BASE_URL,
      eas: {
        projectId: "ecbeebd1-e218-4b4a-9bf7-b389d44abeb0",
      },
    },
  },
};
