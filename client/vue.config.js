const path = require("path");
module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    disableHostCheck: true,
    proxy: {
      "/api": {
        target: "http://localhost:4000"
      }
    }
  },
  publicPath: "./",
  outputDir: path.resolve(__dirname, "../server/public")
};
