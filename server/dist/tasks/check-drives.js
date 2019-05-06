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
var Promise = require("bluebird");
var _ = require("lodash");
var CheckDrives = /** @class */ (function () {
    function CheckDrives(appInfo) {
        this.appInfo = appInfo;
        this.command = "checkdrives";
        this.objectId = JsUtil_1.JsUtil.getObjectId();
        console.log('ctor.checkdrives', this.objectId);
    }
    CheckDrives.prototype.verifyArguments = function (argv) {
        return true;
    };
    ;
    CheckDrives.prototype.usage = function () {
        return "getting all the docs";
    };
    ;
    CheckDrives.prototype.execute = function () {
        return true;
    };
    CheckDrives = __decorate([
        injectable(),
        __param(0, inject(server_types_1.default.AppInfo)),
        __metadata("design:paramtypes", [app_info_service_1.AppInfoService])
    ], CheckDrives);
    return CheckDrives;
}());
exports.CheckDrives = CheckDrives;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRhc2tzL2NoZWNrLWRyaXZlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNBLGlFQUE0RDtBQUM1RCxxQ0FBdUM7QUFDdkMsSUFBTyxNQUFNLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUNqQyxJQUFPLFVBQVUsR0FBRyxTQUFTLENBQUMsVUFBVSxDQUFDO0FBTXpDLGdEQUFvQztBQUNwQyw4Q0FBMkM7QUFFM0MsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2xDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUkxQjtJQU1JLHFCQUEyQyxPQUF1QjtRQUF2QixZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUxsRSxZQUFPLEdBQVcsYUFBYSxDQUFDO1FBTTVCLElBQUksQ0FBQyxRQUFRLEdBQUcsZUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRCxxQ0FBZSxHQUFmLFVBQWdCLElBQVM7UUFDckIsTUFBTSxDQUFDLElBQUksQ0FBRTtJQUNqQixDQUFDO0lBQUMsQ0FBQztJQUVILDJCQUFLLEdBQUw7UUFDSSxNQUFNLENBQUMsc0JBQXNCLENBQUM7SUFDbEMsQ0FBQztJQUFDLENBQUM7SUFFSCw2QkFBTyxHQUFQO1FBQ0csTUFBTSxDQUFDLElBQUksQ0FBRTtJQUNoQixDQUFDO0lBckJRLFdBQVc7UUFEdkIsVUFBVSxFQUFFO1FBT0ksV0FBQSxNQUFNLENBQUMsc0JBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTt5Q0FBa0IsaUNBQWM7T0FOekQsV0FBVyxDQXdCdkI7SUFBRCxrQkFBQztDQXhCRCxBQXdCQyxJQUFBO0FBeEJZLGtDQUFXIiwiZmlsZSI6InRhc2tzL2NoZWNrLWRyaXZlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SVRhc2t9IGZyb20gXCIuL3Rhc2stcnVubmVyXCI7XG5pbXBvcnQge0FwcEluZm9TZXJ2aWNlfSBmcm9tIFwiLi4vc2VydmljZXMvYXBwLWluZm8uc2VydmljZVwiO1xuaW1wb3J0ICogYXMgaW52ZXJzaWZ5IGZyb20gXCJpbnZlcnNpZnlcIjtcbmltcG9ydCBpbmplY3QgPSBpbnZlcnNpZnkuaW5qZWN0O1xuaW1wb3J0IGluamVjdGFibGUgPSBpbnZlcnNpZnkuaW5qZWN0YWJsZTtcbmltcG9ydCB7XG4gICAgQXBwQ29uZmlnXG5cbn0gZnJvbSBcIi4uL3VuaXZlcnNhbC9hcHAudHlwZXNcIjtcbmltcG9ydCBtb21lbnQgPSByZXF1aXJlKFwibW9tZW50XCIpO1xuaW1wb3J0IFRZUEVTIGZyb20gXCIuLi9zZXJ2ZXIudHlwZXNcIjtcbmltcG9ydCB7SnNVdGlsfSBmcm9tIFwiLi4vdW5pdmVyc2FsL0pzVXRpbFwiO1xuXG5sZXQgUHJvbWlzZSA9IHJlcXVpcmUoXCJibHVlYmlyZFwiKTtcbmxldCBfID0gcmVxdWlyZShcImxvZGFzaFwiKTtcblxuXG5AaW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ2hlY2tEcml2ZXMgaW1wbGVtZW50cyBJVGFzayB7XG4gICAgY29tbWFuZDogc3RyaW5nID0gXCJjaGVja2RyaXZlc1wiO1xuICAgIG9iamVjdElkOiBudW1iZXI7XG4gICAgdGFyZ2V0OiBzdHJpbmc7XG4gICAgdGFnOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihAaW5qZWN0KFRZUEVTLkFwcEluZm8pIHByaXZhdGUgYXBwSW5mbzogQXBwSW5mb1NlcnZpY2UpIHtcbiAgICAgICAgdGhpcy5vYmplY3RJZCA9IEpzVXRpbC5nZXRPYmplY3RJZCgpO1xuICAgICAgICBjb25zb2xlLmxvZygnY3Rvci5jaGVja2RyaXZlcycsIHRoaXMub2JqZWN0SWQpO1xuICAgIH1cblxuICAgIHZlcmlmeUFyZ3VtZW50cyhhcmd2OiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRydWUgO1xuICAgIH0gO1xuXG4gICAgdXNhZ2UoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIFwiZ2V0dGluZyBhbGwgdGhlIGRvY3NcIjtcbiAgICB9IDtcblxuICAgIGV4ZWN1dGUoKTogYm9vbGVhbiB7XG4gICAgICAgcmV0dXJuIHRydWUgO1xuICAgIH1cblxuXG59XG4iXX0=
