const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: "Style POS",
        appId: 'com.stylepos.app',
        win: {
          "target": [
            "nsis"
          ],
          icon: './public/logo.ico',
          "requestedExecutionLevel": "requireAdministrator"
        },
        "nsis": {
          "installerIcon": "./public/logo.ico",
          "uninstallerIcon": "./public/logo.ico",
          "uninstallDisplayName": "Style POS",
          "license": "license.txt",
          "oneClick": false,
          "allowToChangeInstallationDirectory": true
        }
      },
    },
  },
  transpileDependencies: [
    'vuetify'
  ]
})

