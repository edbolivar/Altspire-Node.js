"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = {
    production: false,
    siteName: "AltSpire",
    envfile: "environment.altspire.ts",
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
    serverHost: "altspire"
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVudmlyb25tZW50cy9lbnZpcm9ubWVudC5hbHRzcGlyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNhLFFBQUEsV0FBVyxHQUFHO0lBQ3pCLFVBQVUsRUFBRSxLQUFLO0lBQ2pCLFFBQVEsRUFBRSxVQUFVO0lBQ3BCLE9BQU8sRUFBRSx5QkFBeUI7SUFDbEMsaUJBQWlCLEVBQUcsRUFBRTtJQUN0QixvQkFBb0IsRUFBRyxFQUFFO0lBQ3pCLFdBQVcsRUFBRyxFQUFFO0lBQ2hCLFlBQVksRUFBRSxFQUFFO0lBQ2hCLFlBQVksRUFBRSxFQUFFO0lBQ2hCLFVBQVUsRUFBRSxFQUFFO0lBQ2QsVUFBVSxFQUFFLElBQUk7SUFDaEIsVUFBVSxFQUFFLElBQUk7SUFDaEIsd0JBQXdCLEVBQUUsRUFBRTtJQUM1QixZQUFZLEVBQUcsZ0NBQWdDO0lBQy9DLE9BQU8sRUFBRTtRQUNQLE9BQU8sRUFBRSw2Q0FBNkM7UUFDdEQsU0FBUyxFQUFFLDRDQUE0QztRQUN2RCxRQUFRLEVBQUUsa0RBQWtEO1FBQzVELE9BQU8sRUFBRSxpREFBaUQ7UUFDMUQsT0FBTyxFQUFFLGlEQUFpRDtRQUMxRCxVQUFVLEVBQUUsb0RBQW9EO1FBQ2hFLFNBQVMsRUFBRSw0Q0FBNEM7S0FDeEQ7SUFDRCxVQUFVLEVBQUUsVUFBVTtDQUN2QixDQUFDIiwiZmlsZSI6ImVudmlyb25tZW50cy9lbnZpcm9ubWVudC5hbHRzcGlyZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuZXhwb3J0IGNvbnN0IGVudmlyb25tZW50ID0ge1xuICBwcm9kdWN0aW9uOiBmYWxzZSxcbiAgc2l0ZU5hbWU6IFwiQWx0U3BpcmVcIixcbiAgZW52ZmlsZTogXCJlbnZpcm9ubWVudC5hbHRzcGlyZS50c1wiLFxuICByZW1vdGVEYlVybFByZWZpeDogIFwiXCIsXG4gIHJlbW90ZURiVXNlckRiUHJlZml4OiAgXCJcIixcbiAgY29tbW9uRGJVcmw6ICBcIlwiLFxuICBjb21tb25EYk5hbWU6IFwiXCIsXG4gIHVzZXJEYlByZWZpeDogXCJcIixcbiAgdXNlckRiTmFtZTogXCJcIixcbiAgc2VydmVyUG9ydDogNDAwMCxcbiAgc29ja2V0UG9ydDogNDAwMSxcbiAgZGJCYWNrdXBBY2NvdW50VXJsUHJlZml4OiBcIlwiLFxuICBzaXRlSWNvblBhdGg6ICBcImFzc2V0cy9pY29ucy9hbHRzcGlyZS5sb2dvLnBuZ1wiLFxuICBhcGlVcmxzOiB7XG4gICAgdmlzdWFsczogXCJodHRwOi8vbG9jYWxob3N0OjQwMDAvYXBpL2NvbmZpZy9wb2N2aXN1YWxzXCIsXG4gICAgc2VydmljZVVJOiBcImh0dHA6Ly9sb2NhbGhvc3Q6NDAwMC9hcGkvY29uZmlnL3NlcnZpY2V1aVwiLFxuICAgIHBsYXRmb3JtOiBcImh0dHA6Ly9sb2NhbGhvc3Q6NDAwMC9hcGkvY29uZmlnL2Rlc2lnbi9wbGF0Zm9ybVwiLFxuICAgIGZsYXZvcnM6ICdodHRwOi8vbG9jYWxob3N0OjQwMDAvYXBpL2NvbmZpZy9kZXNpZ24vZmxhdm9ycycsXG4gICAgYnViYmxlczogJ2h0dHA6Ly9sb2NhbGhvc3Q6NDAwMC9hcGkvY29uZmlnL2Rlc2lnbi9idWJibGVzJyxcbiAgICBhbmltYXRpb25zOiAnaHR0cDovL2xvY2FsaG9zdDo0MDAwL2FwaS9jb25maWcvZGVzaWduL2FuaW1hdGlvbnMnLFxuICAgIG92ZXJyaWRlczogJ2h0dHA6Ly9sb2NhbGhvc3Q6NDAwMC9hcGkvY29uZmlnL292ZXJyaWRlcydcbiAgfSxcbiAgc2VydmVySG9zdDogXCJhbHRzcGlyZVwiXG59O1xuIl19
