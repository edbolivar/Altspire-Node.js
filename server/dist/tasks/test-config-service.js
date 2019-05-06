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
var app_info_service_1 = require("../services/app-info.service");
var inversify = require("inversify");
var inject = inversify.inject;
var injectable = inversify.injectable;
var server_types_1 = require("../server.types");
var JsUtil_1 = require("../universal/JsUtil");
var configuration_service_1 = require("../configuration/configuration-service");
var Promise = require("bluebird");
var _ = require("lodash");
var TestConfigService = /** @class */ (function () {
    function TestConfigService(appInfo, configurationService) {
        this.appInfo = appInfo;
        this.configurationService = configurationService;
        this.command = "testconfigservice";
        this.objectId = JsUtil_1.JsUtil.getObjectId();
        console.log('ctor.testconfigservice', this.objectId);
    }
    TestConfigService.prototype.verifyArguments = function (argv) {
        return true;
    };
    ;
    TestConfigService.prototype.usage = function () {
        return "exercise the ConfigurationService";
    };
    ;
    TestConfigService.prototype.execute = function () {
        return true;
    };
    TestConfigService = __decorate([
        injectable(),
        __param(0, inject(server_types_1.default.AppInfo)),
        __metadata("design:paramtypes", [app_info_service_1.AppInfoService, configuration_service_1.ConfigurationService])
    ], TestConfigService);
    return TestConfigService;
}());
exports.TestConfigService = TestConfigService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRhc2tzL3Rlc3QtY29uZmlnLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpRUFBNEQ7QUFDNUQscUNBQXVDO0FBQ3ZDLElBQU8sTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFDakMsSUFBTyxVQUFVLEdBQUcsU0FBUyxDQUFDLFVBQVUsQ0FBQztBQU16QyxnREFBb0M7QUFDcEMsOENBQTJDO0FBQzNDLGdGQUE0RTtBQUU1RSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDbEMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRzFCO0lBTUksMkJBQTJDLE9BQXVCLEVBQVUsb0JBQTBDO1FBQTNFLFlBQU8sR0FBUCxPQUFPLENBQWdCO1FBQVUseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQUx0SCxZQUFPLEdBQVcsbUJBQW1CLENBQUM7UUFNbEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxlQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELDJDQUFlLEdBQWYsVUFBZ0IsSUFBUztRQUNyQixNQUFNLENBQUMsSUFBSSxDQUFFO0lBQ2pCLENBQUM7SUFBQyxDQUFDO0lBRUgsaUNBQUssR0FBTDtRQUNJLE1BQU0sQ0FBQyxtQ0FBbUMsQ0FBQztJQUMvQyxDQUFDO0lBQUMsQ0FBQztJQUVILG1DQUFPLEdBQVA7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFFO0lBQ2pCLENBQUM7SUFyQlEsaUJBQWlCO1FBRDdCLFVBQVUsRUFBRTtRQU9JLFdBQUEsTUFBTSxDQUFDLHNCQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7eUNBQWtCLGlDQUFjLEVBQWdDLDRDQUFvQjtPQU43RyxpQkFBaUIsQ0FzQjdCO0lBQUQsd0JBQUM7Q0F0QkQsQUFzQkMsSUFBQTtBQXRCWSw4Q0FBaUIiLCJmaWxlIjoidGFza3MvdGVzdC1jb25maWctc2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SVRhc2t9IGZyb20gXCIuL3Rhc2stcnVubmVyXCI7XG5pbXBvcnQge0FwcEluZm9TZXJ2aWNlfSBmcm9tIFwiLi4vc2VydmljZXMvYXBwLWluZm8uc2VydmljZVwiO1xuaW1wb3J0ICogYXMgaW52ZXJzaWZ5IGZyb20gXCJpbnZlcnNpZnlcIjtcbmltcG9ydCBpbmplY3QgPSBpbnZlcnNpZnkuaW5qZWN0O1xuaW1wb3J0IGluamVjdGFibGUgPSBpbnZlcnNpZnkuaW5qZWN0YWJsZTtcbmltcG9ydCB7XG4gICAgQXBwQ29uZmlnXG5cbn0gZnJvbSBcIi4uL3VuaXZlcnNhbC9hcHAudHlwZXNcIjtcbmltcG9ydCBtb21lbnQgPSByZXF1aXJlKFwibW9tZW50XCIpO1xuaW1wb3J0IFRZUEVTIGZyb20gXCIuLi9zZXJ2ZXIudHlwZXNcIjtcbmltcG9ydCB7SnNVdGlsfSBmcm9tIFwiLi4vdW5pdmVyc2FsL0pzVXRpbFwiO1xuaW1wb3J0IHtDb25maWd1cmF0aW9uU2VydmljZX0gZnJvbSBcIi4uL2NvbmZpZ3VyYXRpb24vY29uZmlndXJhdGlvbi1zZXJ2aWNlXCI7XG5cbmxldCBQcm9taXNlID0gcmVxdWlyZShcImJsdWViaXJkXCIpO1xubGV0IF8gPSByZXF1aXJlKFwibG9kYXNoXCIpO1xuXG5AaW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVGVzdENvbmZpZ1NlcnZpY2UgaW1wbGVtZW50cyBJVGFzayB7XG4gICAgY29tbWFuZDogc3RyaW5nID0gXCJ0ZXN0Y29uZmlnc2VydmljZVwiO1xuICAgIG9iamVjdElkOiBudW1iZXI7XG4gICAgdGFyZ2V0OiBzdHJpbmc7XG4gICAgdGFnOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihAaW5qZWN0KFRZUEVTLkFwcEluZm8pIHByaXZhdGUgYXBwSW5mbzogQXBwSW5mb1NlcnZpY2UsIHByaXZhdGUgY29uZmlndXJhdGlvblNlcnZpY2U6IENvbmZpZ3VyYXRpb25TZXJ2aWNlKSB7XG4gICAgICAgIHRoaXMub2JqZWN0SWQgPSBKc1V0aWwuZ2V0T2JqZWN0SWQoKTtcbiAgICAgICAgY29uc29sZS5sb2coJ2N0b3IudGVzdGNvbmZpZ3NlcnZpY2UnLCB0aGlzLm9iamVjdElkKTtcbiAgICB9XG5cbiAgICB2ZXJpZnlBcmd1bWVudHMoYXJndjogYW55KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0cnVlIDtcbiAgICB9IDtcblxuICAgIHVzYWdlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBcImV4ZXJjaXNlIHRoZSBDb25maWd1cmF0aW9uU2VydmljZVwiO1xuICAgIH0gO1xuXG4gICAgZXhlY3V0ZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRydWUgO1xuICAgIH1cbn0iXX0=
