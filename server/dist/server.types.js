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
var PATH = require("path");
var app_info_service_1 = require("./services/app-info.service");
var inversify_1 = require("inversify");
var TYPES = {
    AppInfo: Symbol('AppInfoService'),
    TaskRunner: Symbol('TaskRunner'),
    Task: Symbol('Task'),
    SocketService: Symbol('SocketService'),
    ValveControllerService: Symbol('ValveControllerService'),
    PubSubService: Symbol('PubSubService'),
    AppDataService: Symbol('AppDataService'),
    AppProductdataService: Symbol('AppProductdataService'),
    PourControllerService: Symbol('PourControllerService'),
    FunctionDriver: Symbol('FunctionDriver'),
    ConfigurationService: Symbol('ConfigurationService'),
    ConfigurationRepository: Symbol('ConfigurationRepository'),
    ProductDataRepository: Symbol('ProductDataRepository'),
    ProductDataService: Symbol('ProductDataService'),
    DeviceInfo: Symbol('DeviceInfo'),
    UnitState: Symbol('UnitState'),
    ValveAssignmentRepository: Symbol('ValveAssignmentRepository'),
    FileLocations: Symbol('FileLocations')
};
exports.default = TYPES;
var DeviceInfo = /** @class */ (function () {
    function DeviceInfo() {
    }
    return DeviceInfo;
}());
exports.DeviceInfo = DeviceInfo;
var FileLocations = /** @class */ (function () {
    function FileLocations(appInfo) {
        this.appInfo = appInfo;
        this.uiCustomizationsAvailable = PATH.join(this.appInfo.configDir_App, "UICustomizations.json");
        this.userPermissions = PATH.join(this.appInfo.configDir_App, "UserPermissions.json");
        this.driveThruButtons = PATH.join(this.appInfo.configDir_App, "DriveThruButtons.json");
        this.unitState = PATH.join(this.appInfo.configDir_AppData, "UnitState.json");
        this.applySeedFileIfNecessary(this.unitState);
        this.idleState = PATH.join(this.appInfo.configDir_AppData, "idlestate.json");
        this.applySeedFileIfNecessary(this.idleState);
        this.valveAssignmentState = PATH.join(this.appInfo.configDir_AppData, "ValveAssignmentState.json");
        console.log(this.valveAssignmentState);
        this.applySeedFileIfNecessary(this.valveAssignmentState);
        this.valveAssignmentSeed = PATH.join(this.appInfo.configDir_App, "seedfiles", "ValveAssignmentState.json");
        this.valveConfigurationState = PATH.join(this.appInfo.configDir_App, "ValveConfigurations.json");
        this.applySeedFileIfNecessary(this.valveConfigurationState);
        this.valveConfigurationSeed = PATH.join(this.appInfo.configDir_App, "seedfiles", "ValveConfiguraions.json");
        this.mixologyState = PATH.join(this.appInfo.configDir_AppData, "MixologyState.json");
        this.applySeedFileIfNecessary(this.mixologyState);
        this.curatedMixologySeed = PATH.join(this.appInfo.configDir_App, "seedfiles", "MixologyState.json");
        this.mixologyState2 = PATH.join(this.appInfo.configDir_AppData, "MixologyState2.json");
        this.applySeedFileIfNecessary(this.mixologyState2);
        this.topCombinationSeed = PATH.join(this.appInfo.configDir_App, "seedfiles", "TopCombinationState.json");
        this.topCombinationState = PATH.join(this.appInfo.configDir_AppData, "TopCombinationState.json");
        this.applySeedFileIfNecessary(this.topCombinationState);
        this.legacyValveSeed = PATH.join(this.appInfo.configDir_App, "seedfiles", "LegacyValveState.json");
        this.legacyValveState = PATH.join(this.appInfo.configDir_AppData, "LegacyValveState.json");
        this.applySeedFileIfNecessary(this.legacyValveState);
        this.serviceUIState = PATH.join(this.appInfo.configDir_App, "ServiceUI.json");
        this.serviceUIPopupButtonState = PATH.join(this.appInfo.configDir_App, "ServiceUIPopupButtons.json");
        this.productUIItemState = PATH.join(this.appInfo.configDir_App, "ProductUIItems.json");
        this.designFolder = PATH.join(this.appInfo.configDir_App, "design/");
        this.designFlavorFolder = PATH.join(this.appInfo.configDir_App, "design/flavors/");
        this.homeFolder = PATH.join(this.appInfo.configDir_App, "design/homes/");
        this.recipeFolder = PATH.join(this.appInfo.configDir_App, 'recipe');
        this.bibItemFolder = PATH.join(this.appInfo.configDir_App, 'bibItems');
        this.calorieCountState = PATH.join(this.appInfo.configDir_AppData, "CalorieCountState.json");
        this.overrideSeed = PATH.join(this.appInfo.configDir_App, 'seedfiles', "override.json");
        this.overrideState = PATH.join(this.appInfo.configDir_AppData, "override.json");
    }
    FileLocations.prototype.applySeedFileIfNecessary = function (fullyQualifiedFileName) {
        var fs = require('fs');
        if (fs.existsSync(fullyQualifiedFileName)) {
            return;
        }
        var seedfilename = PATH.join(this.appInfo.configDir_App, "SeedFiles", PATH.basename(fullyQualifiedFileName));
        if (!fs.existsSync(seedfilename)) {
            console.log("Required Seed File is missing: ", seedfilename);
            return;
        }
        try {
            fs.createReadStream(seedfilename).pipe(fs.createWriteStream(fullyQualifiedFileName));
        }
        catch (err) {
            console.log("ERROR Unable to apply seed file " + seedfilename + " to " + fullyQualifiedFileName);
            return false;
        }
    };
    FileLocations = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(TYPES.AppInfo)),
        __metadata("design:paramtypes", [app_info_service_1.AppInfoService])
    ], FileLocations);
    return FileLocations;
}());
exports.FileLocations = FileLocations;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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Q0FBQztRQUNYLENBQUM7UUFFRCxJQUNBLENBQUM7WUFDRyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7UUFDekYsQ0FBQztRQUNELEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUNYLENBQUM7WUFDRyxPQUFPLENBQUMsR0FBRyxDQUFDLHFDQUFtQyxZQUFZLFlBQU8sc0JBQXdCLENBQUMsQ0FBQztZQUM1RixNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2pCLENBQUM7SUFDTCxDQUFDO0lBN0dRLGFBQWE7UUFEekIsc0JBQVUsRUFBRTtRQW9DSSxXQUFBLGtCQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO3lDQUFrQixpQ0FBYztPQW5DekQsYUFBYSxDQStHekI7SUFBRCxvQkFBQztDQS9HRCxBQStHQyxJQUFBO0FBL0dZLHNDQUFhIiwiZmlsZSI6InNlcnZlci50eXBlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFBBVEggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7QXBwSW5mb1NlcnZpY2V9IGZyb20gXCIuL3NlcnZpY2VzL2FwcC1pbmZvLnNlcnZpY2VcIjtcbmltcG9ydCB7aW5qZWN0LCBpbmplY3RhYmxlfSBmcm9tIFwiaW52ZXJzaWZ5XCI7XG5cbmNvbnN0IFRZUEVTID0ge1xuICAgIEFwcEluZm8gOiBTeW1ib2woJ0FwcEluZm9TZXJ2aWNlJyksXG4gICAgVGFza1J1bm5lciA6IFN5bWJvbCgnVGFza1J1bm5lcicpLFxuICAgIFRhc2sgOiBTeW1ib2woJ1Rhc2snKSxcbiAgICBTb2NrZXRTZXJ2aWNlOiBTeW1ib2woJ1NvY2tldFNlcnZpY2UnKSxcbiAgICBWYWx2ZUNvbnRyb2xsZXJTZXJ2aWNlOiBTeW1ib2woJ1ZhbHZlQ29udHJvbGxlclNlcnZpY2UnKSxcbiAgICBQdWJTdWJTZXJ2aWNlOiBTeW1ib2woJ1B1YlN1YlNlcnZpY2UnKSxcbiAgICBBcHBEYXRhU2VydmljZSA6IFN5bWJvbCgnQXBwRGF0YVNlcnZpY2UnKSxcbiAgICBBcHBQcm9kdWN0ZGF0YVNlcnZpY2UgOiBTeW1ib2woJ0FwcFByb2R1Y3RkYXRhU2VydmljZScpLFxuICAgIFBvdXJDb250cm9sbGVyU2VydmljZTogU3ltYm9sKCdQb3VyQ29udHJvbGxlclNlcnZpY2UnKSxcbiAgICBGdW5jdGlvbkRyaXZlcjogU3ltYm9sKCdGdW5jdGlvbkRyaXZlcicpLFxuICAgIENvbmZpZ3VyYXRpb25TZXJ2aWNlOiBTeW1ib2woJ0NvbmZpZ3VyYXRpb25TZXJ2aWNlJyksXG4gICAgQ29uZmlndXJhdGlvblJlcG9zaXRvcnk6IFN5bWJvbCgnQ29uZmlndXJhdGlvblJlcG9zaXRvcnknKSxcbiAgICBQcm9kdWN0RGF0YVJlcG9zaXRvcnk6IFN5bWJvbCgnUHJvZHVjdERhdGFSZXBvc2l0b3J5JyksXG4gICAgUHJvZHVjdERhdGFTZXJ2aWNlOiBTeW1ib2woJ1Byb2R1Y3REYXRhU2VydmljZScpLFxuICAgIERldmljZUluZm86IFN5bWJvbCgnRGV2aWNlSW5mbycpLFxuICAgIFVuaXRTdGF0ZTogU3ltYm9sKCdVbml0U3RhdGUnKSxcbiAgICBWYWx2ZUFzc2lnbm1lbnRSZXBvc2l0b3J5OiBTeW1ib2woJ1ZhbHZlQXNzaWdubWVudFJlcG9zaXRvcnknKSxcbiAgICBGaWxlTG9jYXRpb25zOiBTeW1ib2woJ0ZpbGVMb2NhdGlvbnMnKVxufTtcblxuZXhwb3J0IGRlZmF1bHQgVFlQRVM7XG5cbmV4cG9ydCBjbGFzcyBEZXZpY2VJbmZvIHtcblxufVxuXG5AaW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRmlsZUxvY2F0aW9ucyB7XG4gICAgdW5pdFN0YXRlOiBzdHJpbmc7XG4gICAgdmFsdmVBc3NpZ25tZW50U3RhdGU6IHN0cmluZztcbiAgICB2YWx2ZUFzc2lnbm1lbnRTZWVkOiBzdHJpbmc7XG4gICAgdmFsdmVDb25maWd1cmF0aW9uU3RhdGU6IHN0cmluZztcbiAgICB2YWx2ZUNvbmZpZ3VyYXRpb25TZWVkOiBzdHJpbmc7XG4gICAgdWlDdXN0b21pemF0aW9uc0F2YWlsYWJsZTogc3RyaW5nO1xuICAgIHVzZXJQZXJtaXNzaW9uczogc3RyaW5nO1xuICAgIG1peG9sb2d5U3RhdGU6IHN0cmluZztcbiAgICBtaXhvbG9neVN0YXRlMjogc3RyaW5nO1xuICAgIGxlZ2FjeU92ZXJyaWRlRmlsZVBhdGg6IHN0cmluZztcbiAgICBsZWdhY3lVSUN1c3RvbWl6YXRpb25zQ29uZmlnOiBzdHJpbmc7XG4gICAgdG9wQ29tYmluYXRpb25TdGF0ZTogc3RyaW5nO1xuICAgIHRvcENvbWJpbmF0aW9uU2VlZDogc3RyaW5nO1xuICAgIGN1cmF0ZWRNaXhvbG9neVNlZWQ6IHN0cmluZztcbiAgICBsZWdhY3lWYWx2ZVN0YXRlOiBzdHJpbmc7XG4gICAgbGVnYWN5VmFsdmVTZWVkOiBzdHJpbmc7XG4gICAgZHJpdmVUaHJ1QnV0dG9uczogc3RyaW5nO1xuICAgIHNlcnZpY2VVSVN0YXRlOiBzdHJpbmc7XG4gICAgc2VydmljZVVJUG9wdXBCdXR0b25TdGF0ZTogc3RyaW5nO1xuICAgIHByb2R1Y3RVSUl0ZW1TdGF0ZTogc3RyaW5nO1xuICAgIHJlY2lwZUl0ZW1zRmlsZTogc3RyaW5nO1xuICAgIHJlY2lwZUZvbGRlcjogc3RyaW5nIDtcbiAgICBiaWJJdGVtRm9sZGVyOiBzdHJpbmcgO1xuICAgIGJpYkl0ZW1zRmlsZTogc3RyaW5nO1xuICAgIGRlc2lnbkZvbGRlcjogc3RyaW5nO1xuICAgIGRlc2lnbkZsYXZvckZvbGRlcjogc3RyaW5nO1xuICAgIGlkbGVTdGF0ZTogc3RyaW5nIDtcbiAgICBzZW5FcXVpcG1lbnRTZXJpYWw6IHN0cmluZztcbiAgICBzZW5BdXRvUmVnOiBzdHJpbmc7XG4gICAgaG9tZUZvbGRlcjogc3RyaW5nO1xuICAgIGNhbG9yaWVDb3VudFN0YXRlOiBzdHJpbmc7XG4gICAgb3ZlcnJpZGVTZWVkOiBzdHJpbmc7XG4gICAgb3ZlcnJpZGVTdGF0ZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoQGluamVjdChUWVBFUy5BcHBJbmZvKSBwcml2YXRlIGFwcEluZm86IEFwcEluZm9TZXJ2aWNlKSB7XG4gICAgICAgIHRoaXMudWlDdXN0b21pemF0aW9uc0F2YWlsYWJsZSA9IFBBVEguam9pbih0aGlzLmFwcEluZm8uY29uZmlnRGlyX0FwcCwgXCJVSUN1c3RvbWl6YXRpb25zLmpzb25cIik7XG4gICAgICAgIHRoaXMudXNlclBlcm1pc3Npb25zID0gUEFUSC5qb2luKHRoaXMuYXBwSW5mby5jb25maWdEaXJfQXBwLCBcIlVzZXJQZXJtaXNzaW9ucy5qc29uXCIpO1xuICAgICAgICB0aGlzLmRyaXZlVGhydUJ1dHRvbnMgPSBQQVRILmpvaW4odGhpcy5hcHBJbmZvLmNvbmZpZ0Rpcl9BcHAsIFwiRHJpdmVUaHJ1QnV0dG9ucy5qc29uXCIpO1xuXG4gICAgICAgIHRoaXMudW5pdFN0YXRlID0gUEFUSC5qb2luKHRoaXMuYXBwSW5mby5jb25maWdEaXJfQXBwRGF0YSwgXCJVbml0U3RhdGUuanNvblwiKTtcbiAgICAgICAgdGhpcy5hcHBseVNlZWRGaWxlSWZOZWNlc3NhcnkodGhpcy51bml0U3RhdGUpO1xuICAgICAgICB0aGlzLmlkbGVTdGF0ZSA9IFBBVEguam9pbih0aGlzLmFwcEluZm8uY29uZmlnRGlyX0FwcERhdGEsIFwiaWRsZXN0YXRlLmpzb25cIik7XG4gICAgICAgIHRoaXMuYXBwbHlTZWVkRmlsZUlmTmVjZXNzYXJ5KHRoaXMuaWRsZVN0YXRlKTtcblxuICAgICAgICB0aGlzLnZhbHZlQXNzaWdubWVudFN0YXRlID0gUEFUSC5qb2luKHRoaXMuYXBwSW5mby5jb25maWdEaXJfQXBwRGF0YSwgXCJWYWx2ZUFzc2lnbm1lbnRTdGF0ZS5qc29uXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnZhbHZlQXNzaWdubWVudFN0YXRlKTtcbiAgICAgICAgdGhpcy5hcHBseVNlZWRGaWxlSWZOZWNlc3NhcnkodGhpcy52YWx2ZUFzc2lnbm1lbnRTdGF0ZSk7XG4gICAgICAgIHRoaXMudmFsdmVBc3NpZ25tZW50U2VlZCA9IFBBVEguam9pbih0aGlzLmFwcEluZm8uY29uZmlnRGlyX0FwcCwgXCJzZWVkZmlsZXNcIiwgXCJWYWx2ZUFzc2lnbm1lbnRTdGF0ZS5qc29uXCIpO1xuXG4gICAgICAgIHRoaXMudmFsdmVDb25maWd1cmF0aW9uU3RhdGUgPSBQQVRILmpvaW4odGhpcy5hcHBJbmZvLmNvbmZpZ0Rpcl9BcHAsIFwiVmFsdmVDb25maWd1cmF0aW9ucy5qc29uXCIpO1xuICAgICAgICB0aGlzLmFwcGx5U2VlZEZpbGVJZk5lY2Vzc2FyeSh0aGlzLnZhbHZlQ29uZmlndXJhdGlvblN0YXRlKTtcbiAgICAgICAgdGhpcy52YWx2ZUNvbmZpZ3VyYXRpb25TZWVkID0gUEFUSC5qb2luKHRoaXMuYXBwSW5mby5jb25maWdEaXJfQXBwLCBcInNlZWRmaWxlc1wiLCBcIlZhbHZlQ29uZmlndXJhaW9ucy5qc29uXCIpO1xuXG4gICAgICAgIHRoaXMubWl4b2xvZ3lTdGF0ZSA9IFBBVEguam9pbih0aGlzLmFwcEluZm8uY29uZmlnRGlyX0FwcERhdGEsIFwiTWl4b2xvZ3lTdGF0ZS5qc29uXCIpO1xuICAgICAgICB0aGlzLmFwcGx5U2VlZEZpbGVJZk5lY2Vzc2FyeSh0aGlzLm1peG9sb2d5U3RhdGUpO1xuICAgICAgICB0aGlzLmN1cmF0ZWRNaXhvbG9neVNlZWQgPSBQQVRILmpvaW4odGhpcy5hcHBJbmZvLmNvbmZpZ0Rpcl9BcHAsIFwic2VlZGZpbGVzXCIsIFwiTWl4b2xvZ3lTdGF0ZS5qc29uXCIpO1xuXG4gICAgICAgIHRoaXMubWl4b2xvZ3lTdGF0ZTIgPSBQQVRILmpvaW4odGhpcy5hcHBJbmZvLmNvbmZpZ0Rpcl9BcHBEYXRhLCBcIk1peG9sb2d5U3RhdGUyLmpzb25cIik7XG4gICAgICAgIHRoaXMuYXBwbHlTZWVkRmlsZUlmTmVjZXNzYXJ5KHRoaXMubWl4b2xvZ3lTdGF0ZTIpO1xuXG4gICAgICAgIHRoaXMudG9wQ29tYmluYXRpb25TZWVkID0gUEFUSC5qb2luKHRoaXMuYXBwSW5mby5jb25maWdEaXJfQXBwLCBcInNlZWRmaWxlc1wiLCBcIlRvcENvbWJpbmF0aW9uU3RhdGUuanNvblwiKTtcbiAgICAgICAgdGhpcy50b3BDb21iaW5hdGlvblN0YXRlID0gUEFUSC5qb2luKHRoaXMuYXBwSW5mby5jb25maWdEaXJfQXBwRGF0YSwgXCJUb3BDb21iaW5hdGlvblN0YXRlLmpzb25cIik7XG4gICAgICAgIHRoaXMuYXBwbHlTZWVkRmlsZUlmTmVjZXNzYXJ5KHRoaXMudG9wQ29tYmluYXRpb25TdGF0ZSk7XG5cbiAgICAgICAgdGhpcy5sZWdhY3lWYWx2ZVNlZWQgPSBQQVRILmpvaW4odGhpcy5hcHBJbmZvLmNvbmZpZ0Rpcl9BcHAsIFwic2VlZGZpbGVzXCIsIFwiTGVnYWN5VmFsdmVTdGF0ZS5qc29uXCIpO1xuICAgICAgICB0aGlzLmxlZ2FjeVZhbHZlU3RhdGUgPSBQQVRILmpvaW4odGhpcy5hcHBJbmZvLmNvbmZpZ0Rpcl9BcHBEYXRhLCBcIkxlZ2FjeVZhbHZlU3RhdGUuanNvblwiKTtcbiAgICAgICAgdGhpcy5hcHBseVNlZWRGaWxlSWZOZWNlc3NhcnkodGhpcy5sZWdhY3lWYWx2ZVN0YXRlKTtcblxuICAgICAgICB0aGlzLnNlcnZpY2VVSVN0YXRlID0gUEFUSC5qb2luKHRoaXMuYXBwSW5mby5jb25maWdEaXJfQXBwLCBcIlNlcnZpY2VVSS5qc29uXCIpO1xuICAgICAgICB0aGlzLnNlcnZpY2VVSVBvcHVwQnV0dG9uU3RhdGUgPSBQQVRILmpvaW4odGhpcy5hcHBJbmZvLmNvbmZpZ0Rpcl9BcHAsIFwiU2VydmljZVVJUG9wdXBCdXR0b25zLmpzb25cIik7XG4gICAgICAgIHRoaXMucHJvZHVjdFVJSXRlbVN0YXRlID0gUEFUSC5qb2luKHRoaXMuYXBwSW5mby5jb25maWdEaXJfQXBwLCBcIlByb2R1Y3RVSUl0ZW1zLmpzb25cIik7XG5cbiAgICAgICAgdGhpcy5kZXNpZ25Gb2xkZXIgPSBQQVRILmpvaW4odGhpcy5hcHBJbmZvLmNvbmZpZ0Rpcl9BcHAsIFwiZGVzaWduL1wiKTtcbiAgICAgICAgdGhpcy5kZXNpZ25GbGF2b3JGb2xkZXIgPSBQQVRILmpvaW4odGhpcy5hcHBJbmZvLmNvbmZpZ0Rpcl9BcHAsIFwiZGVzaWduL2ZsYXZvcnMvXCIpO1xuICAgICAgICB0aGlzLmhvbWVGb2xkZXIgPSBQQVRILmpvaW4odGhpcy5hcHBJbmZvLmNvbmZpZ0Rpcl9BcHAsIFwiZGVzaWduL2hvbWVzL1wiKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMucmVjaXBlRm9sZGVyID0gUEFUSC5qb2luKHRoaXMuYXBwSW5mby5jb25maWdEaXJfQXBwLCAncmVjaXBlJyk7XG4gICAgICAgIHRoaXMuYmliSXRlbUZvbGRlciA9IFBBVEguam9pbih0aGlzLmFwcEluZm8uY29uZmlnRGlyX0FwcCwgJ2JpYkl0ZW1zJyk7XG5cbiAgICAgICAgdGhpcy5jYWxvcmllQ291bnRTdGF0ZSA9IFBBVEguam9pbih0aGlzLmFwcEluZm8uY29uZmlnRGlyX0FwcERhdGEsIFwiQ2Fsb3JpZUNvdW50U3RhdGUuanNvblwiKTtcblxuICAgICAgICB0aGlzLm92ZXJyaWRlU2VlZCA9IFBBVEguam9pbih0aGlzLmFwcEluZm8uY29uZmlnRGlyX0FwcCwgJ3NlZWRmaWxlcycsIFwib3ZlcnJpZGUuanNvblwiKTtcbiAgICAgICAgdGhpcy5vdmVycmlkZVN0YXRlID0gUEFUSC5qb2luKHRoaXMuYXBwSW5mby5jb25maWdEaXJfQXBwRGF0YSwgXCJvdmVycmlkZS5qc29uXCIpO1xuICAgIH1cblxuICAgIGFwcGx5U2VlZEZpbGVJZk5lY2Vzc2FyeShmdWxseVF1YWxpZmllZEZpbGVOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgdmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcbiAgICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoZnVsbHlRdWFsaWZpZWRGaWxlTmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgdmFyIHNlZWRmaWxlbmFtZSA9IFBBVEguam9pbih0aGlzLmFwcEluZm8uY29uZmlnRGlyX0FwcCwgXCJTZWVkRmlsZXNcIiwgUEFUSC5iYXNlbmFtZShmdWxseVF1YWxpZmllZEZpbGVOYW1lKSk7XG5cbiAgICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKHNlZWRmaWxlbmFtZSkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVxdWlyZWQgU2VlZCBGaWxlIGlzIG1pc3Npbmc6IFwiLCBzZWVkZmlsZW5hbWUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5XG4gICAgICAgIHtcbiAgICAgICAgICAgIGZzLmNyZWF0ZVJlYWRTdHJlYW0oc2VlZGZpbGVuYW1lKS5waXBlKGZzLmNyZWF0ZVdyaXRlU3RyZWFtKGZ1bGx5UXVhbGlmaWVkRmlsZU5hbWUpKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgRVJST1IgVW5hYmxlIHRvIGFwcGx5IHNlZWQgZmlsZSAke3NlZWRmaWxlbmFtZX0gdG8gJHtmdWxseVF1YWxpZmllZEZpbGVOYW1lfWApO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG59XG4iXX0=
