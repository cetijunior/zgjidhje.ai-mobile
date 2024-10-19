module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // Keep only babel-preset-expo for Expo projects
    plugins: [
      [
        'module:react-native-dotenv', // For loading environment variables from .env file
        {
          moduleName: '@env',
          path: '.env',
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
      'react-native-reanimated/plugin', // Ensure this is the last plugin
    ],
  };
};
