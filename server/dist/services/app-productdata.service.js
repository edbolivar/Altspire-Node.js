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
var jsonfile = require("load-json-file");
var app_info_service_1 = require("./app-info.service");
var JsUtil_1 = require("../universal/JsUtil");
var server_types_1 = require("../server.types");
var AppProductdataService = /** @class */ (function () {
    function AppProductdataService(appInfo) {
        this.appInfo = appInfo;
        this.path = "../src/config/appData/CrewUIVisuals.json";
        this.serviceuipath = "../src/config/ServiceUI.json";
        AppProductdataService_1.instance = this;
        this.objectId = JsUtil_1.JsUtil.getObjectId();
        console.log("ctor.AppProductdataService", this.objectId);
        this.ioc = global["kernel"];
    }
    AppProductdataService_1 = AppProductdataService;
    AppProductdataService.prototype.GetData = function () {
        return jsonfile.sync(this.path);
    };
    AppProductdataService.prototype.getServiceUIData = function () {
        return jsonfile.sync(this.serviceuipath);
    };
    AppProductdataService = AppProductdataService_1 = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(server_types_1.default.AppInfo)),
        __metadata("design:paramtypes", [app_info_service_1.AppInfoService])
    ], AppProductdataService);
    return AppProductdataService;
    var AppProductdataService_1;
}());
exports.AppProductdataService = AppProductdataService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VzL2FwcC1wcm9kdWN0ZGF0YS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdUNBQTZDO0FBRzdDLHlDQUEyQztBQUMzQyx1REFBa0Q7QUFDbEQsOENBQTJDO0FBQzNDLGdEQUFrRDtBQUdsRDtJQU9JLCtCQUEyQyxPQUF1QjtRQUF2QixZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUhsRSxTQUFJLEdBQUcsMENBQTBDLENBQUM7UUFDbEQsa0JBQWEsR0FBRyw4QkFBOEIsQ0FBQztRQUczQyx1QkFBcUIsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxRQUFRLEdBQUcsZUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFFO0lBRWpDLENBQUM7OEJBYlEscUJBQXFCO0lBZTlCLHVDQUFPLEdBQVA7UUFDSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELGdEQUFnQixHQUFoQjtRQUNJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBckJRLHFCQUFxQjtRQURqQyxzQkFBVSxFQUFFO1FBUUksV0FBQSxrQkFBTSxDQUFDLHNCQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7eUNBQWtCLGlDQUFjO09BUHpELHFCQUFxQixDQXVCakM7SUFBRCw0QkFBQzs7Q0F2QkQsQUF1QkMsSUFBQTtBQXZCWSxzREFBcUIiLCJmaWxlIjoic2VydmljZXMvYXBwLXByb2R1Y3RkYXRhLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2luamVjdCwgaW5qZWN0YWJsZX0gZnJvbSAnaW52ZXJzaWZ5JztcbmltcG9ydCAqIGFzIGludmVyc2lmeSBmcm9tIFwiaW52ZXJzaWZ5XCI7XG5pbXBvcnQgS2VybmVsID0gaW52ZXJzaWZ5LmludGVyZmFjZXMuS2VybmVsO1xuaW1wb3J0ICogYXMganNvbmZpbGUgZnJvbSBcImxvYWQtanNvbi1maWxlXCI7XG5pbXBvcnQge0FwcEluZm9TZXJ2aWNlfSBmcm9tIFwiLi9hcHAtaW5mby5zZXJ2aWNlXCI7XG5pbXBvcnQge0pzVXRpbH0gZnJvbSBcIi4uL3VuaXZlcnNhbC9Kc1V0aWxcIjtcbmltcG9ydCBUWVBFUywge0RldmljZUluZm99IGZyb20gXCIuLi9zZXJ2ZXIudHlwZXNcIjtcblxuQGluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEFwcFByb2R1Y3RkYXRhU2VydmljZSB7XG4gICAgb2JqZWN0SWQ6IG51bWJlcjtcbiAgICBzdGF0aWMgaW5zdGFuY2U6IEFwcFByb2R1Y3RkYXRhU2VydmljZTtcbiAgICBpb2MgOiBLZXJuZWwgO1xuICAgIHBhdGggPSBcIi4uL3NyYy9jb25maWcvYXBwRGF0YS9DcmV3VUlWaXN1YWxzLmpzb25cIjtcbiAgICBzZXJ2aWNldWlwYXRoID0gXCIuLi9zcmMvY29uZmlnL1NlcnZpY2VVSS5qc29uXCI7XG5cbiAgICBjb25zdHJ1Y3RvcihAaW5qZWN0KFRZUEVTLkFwcEluZm8pIHByaXZhdGUgYXBwSW5mbzogQXBwSW5mb1NlcnZpY2UpIHtcbiAgICAgICAgQXBwUHJvZHVjdGRhdGFTZXJ2aWNlLmluc3RhbmNlID0gdGhpcztcbiAgICAgICAgdGhpcy5vYmplY3RJZCA9IEpzVXRpbC5nZXRPYmplY3RJZCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcImN0b3IuQXBwUHJvZHVjdGRhdGFTZXJ2aWNlXCIsIHRoaXMub2JqZWN0SWQpO1xuICAgICAgICB0aGlzLmlvYyA9IGdsb2JhbFtcImtlcm5lbFwiXSA7XG5cbiAgICB9XG5cbiAgICBHZXREYXRhKCkge1xuICAgICAgICByZXR1cm4ganNvbmZpbGUuc3luYyh0aGlzLnBhdGgpO1xuICAgIH1cblxuICAgIGdldFNlcnZpY2VVSURhdGEoKSB7XG4gICAgICAgIHJldHVybiBqc29uZmlsZS5zeW5jKHRoaXMuc2VydmljZXVpcGF0aCk7XG4gICAgfVxuXG59Il19
