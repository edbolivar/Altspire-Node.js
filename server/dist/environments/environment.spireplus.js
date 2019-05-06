"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = {
    production: false,
    siteName: "SpirePlus",
    envfile: "environment.spireplus.ts",
    remoteDbUrlPrefix: "",
    remoteDbUserDbPrefix: "",
    commonDbUrl: "",
    commonDbName: "",
    userDbPrefix: "",
    userDbName: "",
    serverPort: 4000,
    socketPort: 4001,
    dbBackupAccountUrlPrefix: "",
    siteIconPath: "assets/icons/altspire.logo.png",
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVudmlyb25tZW50cy9lbnZpcm9ubWVudC5zcGlyZXBsdXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDYSxRQUFBLFdBQVcsR0FBRztJQUN6QixVQUFVLEVBQUUsS0FBSztJQUNqQixRQUFRLEVBQUUsV0FBVztJQUNyQixPQUFPLEVBQUUsMEJBQTBCO0lBQ25DLGlCQUFpQixFQUFHLEVBQUU7SUFDdEIsb0JBQW9CLEVBQUcsRUFBRTtJQUN6QixXQUFXLEVBQUcsRUFBRTtJQUNoQixZQUFZLEVBQUUsRUFBRTtJQUNoQixZQUFZLEVBQUUsRUFBRTtJQUNoQixVQUFVLEVBQUUsRUFBRTtJQUNkLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLHdCQUF3QixFQUFFLEVBQUU7SUFDNUIsWUFBWSxFQUFHLGdDQUFnQztJQUMvQyxPQUFPLEVBQUU7UUFDUCxPQUFPLEVBQUUsNkNBQTZDO1FBQ3RELFNBQVMsRUFBRSw0Q0FBNEM7UUFDdkQsUUFBUSxFQUFFLGtEQUFrRDtRQUM1RCxPQUFPLEVBQUUsaURBQWlEO1FBQzFELE9BQU8sRUFBRSxpREFBaUQ7UUFDMUQsVUFBVSxFQUFFLG9EQUFvRDtRQUNoRSxTQUFTLEVBQUUsNENBQTRDO0tBQ3hEO0lBQ0QsVUFBVSxFQUFFLFdBQVc7Q0FDeEIsQ0FBQyIsImZpbGUiOiJlbnZpcm9ubWVudHMvZW52aXJvbm1lbnQuc3BpcmVwbHVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5leHBvcnQgY29uc3QgZW52aXJvbm1lbnQgPSB7XG4gIHByb2R1Y3Rpb246IGZhbHNlLFxuICBzaXRlTmFtZTogXCJTcGlyZVBsdXNcIixcbiAgZW52ZmlsZTogXCJlbnZpcm9ubWVudC5zcGlyZXBsdXMudHNcIixcbiAgcmVtb3RlRGJVcmxQcmVmaXg6ICBcIlwiLFxuICByZW1vdGVEYlVzZXJEYlByZWZpeDogIFwiXCIsXG4gIGNvbW1vbkRiVXJsOiAgXCJcIixcbiAgY29tbW9uRGJOYW1lOiBcIlwiLFxuICB1c2VyRGJQcmVmaXg6IFwiXCIsXG4gIHVzZXJEYk5hbWU6IFwiXCIsXG4gIHNlcnZlclBvcnQ6IDQwMDAsXG4gIHNvY2tldFBvcnQ6IDQwMDEsXG4gIGRiQmFja3VwQWNjb3VudFVybFByZWZpeDogXCJcIixcbiAgc2l0ZUljb25QYXRoOiAgXCJhc3NldHMvaWNvbnMvYWx0c3BpcmUubG9nby5wbmdcIixcbiAgYXBpVXJsczoge1xuICAgIHZpc3VhbHM6IFwiaHR0cDovL2xvY2FsaG9zdDo0MDAwL2FwaS9jb25maWcvcG9jdmlzdWFsc1wiLFxuICAgIHNlcnZpY2VVSTogXCJodHRwOi8vbG9jYWxob3N0OjQwMDAvYXBpL2NvbmZpZy9zZXJ2aWNldWlcIixcbiAgICBwbGF0Zm9ybTogXCJodHRwOi8vbG9jYWxob3N0OjQwMDAvYXBpL2NvbmZpZy9kZXNpZ24vcGxhdGZvcm1cIixcbiAgICBmbGF2b3JzOiAnaHR0cDovL2xvY2FsaG9zdDo0MDAwL2FwaS9jb25maWcvZGVzaWduL2ZsYXZvcnMnLFxuICAgIGJ1YmJsZXM6ICdodHRwOi8vbG9jYWxob3N0OjQwMDAvYXBpL2NvbmZpZy9kZXNpZ24vYnViYmxlcycsXG4gICAgYW5pbWF0aW9uczogJ2h0dHA6Ly9sb2NhbGhvc3Q6NDAwMC9hcGkvY29uZmlnL2Rlc2lnbi9hbmltYXRpb25zJyxcbiAgICBvdmVycmlkZXM6ICdodHRwOi8vbG9jYWxob3N0OjQwMDAvYXBpL2NvbmZpZy9vdmVycmlkZXMnXG4gIH0sXG4gIHNlcnZlckhvc3Q6IFwic3BpcmVwbHVzXCJcbn07XG4iXX0=
