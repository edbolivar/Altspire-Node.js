"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var JsUtil_1 = require("../universal/JsUtil");
var server_types_1 = require("../server.types");
var app_info_service_1 = require("./app-info.service");
var AppDataService = /** @class */ (function () {
    function AppDataService(appInfo) {
        this.appInfo = appInfo;
        AppDataService_1.instance = this;
        this.objectId = JsUtil_1.JsUtil.getObjectId();
        console.log("ctor.AppDataService", this.objectId);
        this.ioc = global["kernel"];
    }
    AppDataService_1 = AppDataService;
    AppDataService = AppDataService_1 = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(server_types_1.default.AppInfo)),
        __metadata("design:paramtypes", [app_info_service_1.AppInfoService])
    ], AppDataService);
    return AppDataService;
    var AppDataService_1;
}());
exports.AppDataService = AppDataService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VzL2FwcC1kYXRhLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSx1Q0FBNkM7QUFDN0MsOENBQTJDO0FBTTNDLGdEQUFvQztBQUVwQyx1REFBa0Q7QUFJbEQ7SUFNSSx3QkFBMkMsT0FBdUI7UUFBdkIsWUFBTyxHQUFQLE9BQU8sQ0FBZ0I7UUFDOUQsZ0JBQWMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQy9CLElBQUksQ0FBQyxRQUFRLEdBQUcsZUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7dUJBWFEsY0FBYztJQUFkLGNBQWM7UUFEMUIsc0JBQVUsRUFBRTtRQU9JLFdBQUEsa0JBQU0sQ0FBQyxzQkFBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO3lDQUFrQixpQ0FBYztPQU56RCxjQUFjLENBYzFCO0lBQUQscUJBQUM7O0NBZEQsQUFjQyxJQUFBO0FBZFksd0NBQWMiLCJmaWxlIjoic2VydmljZXMvYXBwLWRhdGEuc2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aW5qZWN0LCBpbmplY3RhYmxlfSBmcm9tICdpbnZlcnNpZnknO1xuaW1wb3J0IHtKc1V0aWx9IGZyb20gXCIuLi91bml2ZXJzYWwvSnNVdGlsXCI7XG5pbXBvcnQgKiBhcyBpbnZlcnNpZnkgZnJvbSBcImludmVyc2lmeVwiO1xuaW1wb3J0IEtlcm5lbCA9IGludmVyc2lmeS5pbnRlcmZhY2VzLktlcm5lbDtcbmltcG9ydCB7IGVudmlyb25tZW50IH0gZnJvbSAnLi4vZW52aXJvbm1lbnRzL2Vudmlyb25tZW50JztcbmltcG9ydCB7QXBwQ29uZmlnfSBmcm9tIFwiLi4vdW5pdmVyc2FsL2FwcC50eXBlc1wiO1xuaW1wb3J0IHtQdWJTdWJTZXJ2aWNlfSBmcm9tIFwiLi4vdW5pdmVyc2FsL3B1Yi1zdWIuc2VydmljZVwiO1xuaW1wb3J0IFRZUEVTIGZyb20gXCIuLi9zZXJ2ZXIudHlwZXNcIjtcbmltcG9ydCB7RXZlbnREZXNjcmlwdG9yLCBQdWJsaXNoRXZlbnQsIFB1YlN1YkV2ZW50QXJncywgU3Vic2NyaWJlRXZlbnR9IGZyb20gXCIuLi91bml2ZXJzYWwvcHViLXN1Yi10eXBlc1wiO1xuaW1wb3J0IHtBcHBJbmZvU2VydmljZX0gZnJvbSBcIi4vYXBwLWluZm8uc2VydmljZVwiO1xuXG5cbkBpbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBBcHBEYXRhU2VydmljZSB7XG4gICAgb2JqZWN0SWQ6IG51bWJlcjtcbiAgICBzdGF0aWMgaW5zdGFuY2U6IEFwcERhdGFTZXJ2aWNlO1xuICAgIGlvYyA6IEtlcm5lbCA7XG4gICAgcmVzdWx0OiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcihAaW5qZWN0KFRZUEVTLkFwcEluZm8pIHByaXZhdGUgYXBwSW5mbzogQXBwSW5mb1NlcnZpY2UpIHtcbiAgICAgICAgQXBwRGF0YVNlcnZpY2UuaW5zdGFuY2UgPSB0aGlzO1xuICAgICAgICB0aGlzLm9iamVjdElkID0gSnNVdGlsLmdldE9iamVjdElkKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiY3Rvci5BcHBEYXRhU2VydmljZVwiLCB0aGlzLm9iamVjdElkKTtcbiAgICAgICAgdGhpcy5pb2MgPSBnbG9iYWxbXCJrZXJuZWxcIl07XG4gICAgfVxuXG5cbn0iXX0=
