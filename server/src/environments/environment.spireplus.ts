
export const environment = {
  production: false,
  siteName: "SpirePlus",
  envfile: "environment.spireplus.ts",
  remoteDbUrlPrefix:  "",
  remoteDbUserDbPrefix:  "",
  commonDbUrl:  "",
  commonDbName: "",
  userDbPrefix: "",
  userDbName: "",
  serverPort: 4000,
  socketPort: 4001,
  dbBackupAccountUrlPrefix: "",
  siteIconPath:  "assets/icons/altspire.logo.png",
  apiUrls: {
    visuals: "http://localhost:4000/api/config/pocvisuals",
    serviceUI: "http://localhost:4000/api/config/serviceui",
    platform: "http://localhost:4000/api/config/design/platform",
    flavors: 'http://localhost:4000/api/config/design/flavors',
    bubbles: 'http://localhost:4000/api/config/design/bubbles',
    animations: 'http://localhost:4000/api/config/design/animations',
    overrides: 'http://localhost:4000/api/config/overrides'
  },
  serverHost: "spireplus"
};
