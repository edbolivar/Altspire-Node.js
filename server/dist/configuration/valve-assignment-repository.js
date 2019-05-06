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
var app_info_service_1 = require("../services/app-info.service");
var server_types_1 = require("../server.types");
var JSONFILE = require("load-json-file");
var JsUtil_1 = require("../universal/JsUtil");
var app_types_1 = require("../universal/app.types");
var PATH = require("path");
var _ = require("lodash");
var ValveAssignmentRepository = /** @class */ (function () {
    function ValveAssignmentRepository(appInfo, fileLocations) {
        this.appInfo = appInfo;
        this.fileLocations = fileLocations;
        this.allunits = [];
        this.objectId = JsUtil_1.JsUtil.getObjectId();
        console.log("ctor.ValveAssignmentRepository", this.objectId);
        this.initializeValveConfigurations();
    }
    ValveAssignmentRepository.prototype.initializeValveConfigurations = function () {
        var valveConfigFile = JSONFILE.sync(this.fileLocations.valveConfigurationState);
        var allunits_dirty = valveConfigFile.Units;
        for (var _i = 0, allunits_dirty_1 = allunits_dirty; _i < allunits_dirty_1.length; _i++) {
            var unit = allunits_dirty_1[_i];
            this.allunits.push(JsUtil_1.JsUtil.mapToNewObject(unit, new app_types_1.UnitConfigurationModel(unit.ValveLayout, [])));
        }
        this.fixUpAllLabelPairs();
        this.applyWeightingForSubsequentOrderBy();
    };
    // TODO figure out why it's not taking these
    ValveAssignmentRepository.prototype.fixUpAllLabelPairs = function () {
        for (var _i = 0, _a = this.allunits; _i < _a.length; _i++) {
            var eachUnit = _a[_i];
            for (var _b = 0, _c = eachUnit.ValveLayout; _b < _c.length; _b++) {
                var valveAssignmentRow = _c[_b];
                for (var _d = 0, _e = valveAssignmentRow.ValveLabelPair; _d < _e.length; _d++) {
                    var valve = _e[_d];
                    valve.Row = valveAssignmentRow.RowNumber;
                    eachUnit.AllValveLabelPairs.push(JsUtil_1.JsUtil.mapToNewObject(valve, new app_types_1.ValveLabelPair()));
                }
            }
        }
    };
    ValveAssignmentRepository.prototype.applyWeightingForSubsequentOrderBy = function () {
        // foreach allunits
        for (var _i = 0, _a = this.allunits; _i < _a.length; _i++) {
            var eachUnit = _a[_i];
            for (var _b = 0, _c = eachUnit.ValveLayout; _b < _c.length; _b++) {
                var valveAssignmentRow = _c[_b];
                for (var _d = 0, _e = valveAssignmentRow.ValveLabelPair; _d < _e.length; _d++) {
                    var valve = _e[_d];
                    if (valve.Label === "CW-R" || valve.Label === "CW" || valve.Label === "HC") {
                        valve.Weighting = 10;
                    }
                    else if (valve.Label == "PW-R" || valve.Label == "PW" || valve.Label == "HS") {
                        valve.Weighting = 20;
                    }
                    else if (valve.Label == "CW-L" || valve.Label == "LC") {
                        valve.Weighting = 30;
                    }
                    else if (valve.Label == "PW-L" || valve.Label == "LS") {
                        valve.Weighting = 40;
                    }
                    else {
                        var valveNumberAsString = valve.Label.substr(1);
                        var nval = +valveNumberAsString;
                        if (nval === NaN) {
                            console.log("Error: Invalid ValveNumber inside of Label " + eachUnit.Id + " row:" + valveAssignmentRow.RowNumber + " Label:" + valve.Label);
                        }
                        if (valve.Label.startsWith("S")) {
                            valve.Weighting = 100 * nval;
                        }
                        else if (valve.Label.startsWith("F")) {
                            valve.Weighting = 5000 * nval;
                        }
                        else {
                            console.log("Error: Invalid Label inside of Label " + eachUnit.Id + " row:" + valveAssignmentRow.RowNumber + " Label:" + valve.Label);
                        }
                    }
                }
            }
        }
    };
    ValveAssignmentRepository.prototype.getAvailableConfiguration = function () {
        return this.allunits;
    };
    // TODO make allunits a real object
    ValveAssignmentRepository.prototype.getConfiguration = function (unitName) {
        var item = _.find(this.allunits, function (unit) { unit.UnitName === unitName; });
        if (item == null) {
            console.log("Unit configuration not found.");
            return;
        }
        return item;
    };
    ValveAssignmentRepository.prototype.getConfigurationById = function (id) {
        var item = _.find(this.allunits, function (unit) { return unit.Id === id; });
        if (item == null) {
            console.log("Unit configuration not found.");
            return;
        }
        return item;
    };
    ValveAssignmentRepository.prototype.getCurrentValveAssignments = function () {
        var valveAssignmentsFile = this.fileLocations.valveAssignmentState;
        console.log(valveAssignmentsFile);
        return JSONFILE.sync(valveAssignmentsFile);
    };
    // TODO implement serializetodisk
    ValveAssignmentRepository.prototype.writeValveAssignments = function (valveAssignments) {
        var valveAssignmentsFile = this.fileLocations.valveAssignmentState;
        // serializetodisk
    };
    ValveAssignmentRepository = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(server_types_1.default.AppInfo)),
        __param(1, inversify_1.inject(server_types_1.default.FileLocations)),
        __metadata("design:paramtypes", [app_info_service_1.AppInfoService,
            server_types_1.FileLocations])
    ], ValveAssignmentRepository);
    return ValveAssignmentRepository;
}());
exports.ValveAssignmentRepository = ValveAssignmentRepository;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpZ3VyYXRpb24vdmFsdmUtYXNzaWdubWVudC1yZXBvc2l0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdUNBQTZDO0FBQzdDLGlFQUE0RDtBQUU1RCxnREFBcUQ7QUFDckQseUNBQTJDO0FBQzNDLDhDQUEyQztBQUUzQyxvREFHZ0M7QUFFaEMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUcxQjtJQUlJLG1DQUEyQyxPQUF1QixFQUNqQixhQUE0QjtRQURsQyxZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUNqQixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUg3RSxhQUFRLEdBQTZCLEVBQUUsQ0FBQztRQUlwQyxJQUFJLENBQUMsUUFBUSxHQUFHLGVBQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUU3RCxJQUFJLENBQUMsNkJBQTZCLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBRUQsaUVBQTZCLEdBQTdCO1FBQ0ksSUFBSSxlQUFlLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDaEYsSUFBSSxjQUFjLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQztRQUUzQyxHQUFHLENBQUMsQ0FBYSxVQUFjLEVBQWQsaUNBQWMsRUFBZCw0QkFBYyxFQUFkLElBQWM7WUFBMUIsSUFBSSxJQUFJLHVCQUFBO1lBQ1QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxrQ0FBc0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNy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Z25tZW50LXJlcG9zaXRvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2luamVjdCwgaW5qZWN0YWJsZX0gZnJvbSBcImludmVyc2lmeVwiO1xuaW1wb3J0IHtBcHBJbmZvU2VydmljZX0gZnJvbSBcIi4uL3NlcnZpY2VzL2FwcC1pbmZvLnNlcnZpY2VcIjtcbmltcG9ydCB7UHJvZHVjdERhdGFTZXJ2aWNlfSBmcm9tIFwiLi9wcm9kdWN0LWRhdGEtc2VydmljZVwiO1xuaW1wb3J0IFRZUEVTLCB7RmlsZUxvY2F0aW9uc30gZnJvbSBcIi4uL3NlcnZlci50eXBlc1wiO1xuaW1wb3J0ICogYXMgSlNPTkZJTEUgZnJvbSBcImxvYWQtanNvbi1maWxlXCI7XG5pbXBvcnQge0pzVXRpbH0gZnJvbSBcIi4uL3VuaXZlcnNhbC9Kc1V0aWxcIjtcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7XG4gICAgQnV0dG9uTW9kZWwsIFVuaXRDb25maWd1cmF0aW9uTW9kZWwsIFZhbHZlQXNzaWdubWVudCwgVmFsdmVDb25maWd1cmF0aW9uUm93LFxuICAgIFZhbHZlTGFiZWxQYWlyXG59IGZyb20gXCIuLi91bml2ZXJzYWwvYXBwLnR5cGVzXCI7XG5cbmNvbnN0IFBBVEggPSByZXF1aXJlKFwicGF0aFwiKTtcbmxldCBfID0gcmVxdWlyZShcImxvZGFzaFwiKTtcblxuQGluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFZhbHZlQXNzaWdubWVudFJlcG9zaXRvcnkge1xuICAgIG9iamVjdElkOiBudW1iZXI7XG4gICAgYWxsdW5pdHM6IFVuaXRDb25maWd1cmF0aW9uTW9kZWxbXSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IoQGluamVjdChUWVBFUy5BcHBJbmZvKSBwcml2YXRlIGFwcEluZm86IEFwcEluZm9TZXJ2aWNlLFxuICAgICAgICAgICAgICAgIEBpbmplY3QoVFlQRVMuRmlsZUxvY2F0aW9ucykgcHJpdmF0ZSBmaWxlTG9jYXRpb25zOiBGaWxlTG9jYXRpb25zKSB7XG4gICAgICAgIHRoaXMub2JqZWN0SWQgPSBKc1V0aWwuZ2V0T2JqZWN0SWQoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJjdG9yLlZhbHZlQXNzaWdubWVudFJlcG9zaXRvcnlcIiwgdGhpcy5vYmplY3RJZCk7XG5cbiAgICAgICAgdGhpcy5pbml0aWFsaXplVmFsdmVDb25maWd1cmF0aW9ucygpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVWYWx2ZUNvbmZpZ3VyYXRpb25zKCkge1xuICAgICAgICB2YXIgdmFsdmVDb25maWdGaWxlID0gSlNPTkZJTEUuc3luYyh0aGlzLmZpbGVMb2NhdGlvbnMudmFsdmVDb25maWd1cmF0aW9uU3RhdGUpO1xuICAgICAgICB2YXIgYWxsdW5pdHNfZGlydHkgPSB2YWx2ZUNvbmZpZ0ZpbGUuVW5pdHM7XG5cbiAgICAgICAgZm9yIChsZXQgdW5pdCBvZiBhbGx1bml0c19kaXJ0eSkge1xuICAgICAgICAgICAgdGhpcy5hbGx1bml0cy5wdXNoKEpzVXRpbC5tYXBUb05ld09iamVjdCh1bml0LCBuZXcgVW5pdENvbmZpZ3VyYXRpb25Nb2RlbCh1bml0LlZhbHZlTGF5b3V0LCBbXSkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZml4VXBBbGxMYWJlbFBhaXJzKCk7XG4gICAgICAgIHRoaXMuYXBwbHlXZWlnaHRpbmdGb3JTdWJzZXF1ZW50T3JkZXJCeSgpO1xuICAgIH1cblxuICAgIC8vIFRPRE8gZmlndXJlIG91dCB3aHkgaXQncyBub3QgdGFraW5nIHRoZXNlXG4gICAgZml4VXBBbGxMYWJlbFBhaXJzKCkge1xuICAgICAgICBmb3IgKGxldCBlYWNoVW5pdCBvZiB0aGlzLmFsbHVuaXRzKSB7XG4gICAgICAgICAgICBmb3IgKGxldCB2YWx2ZUFzc2lnbm1lbnRSb3cgb2YgZWFjaFVuaXQuVmFsdmVMYXlvdXQpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB2YWx2ZSBvZiB2YWx2ZUFzc2lnbm1lbnRSb3cuVmFsdmVMYWJlbFBhaXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdmUuUm93ID0gdmFsdmVBc3NpZ25tZW50Um93LlJvd051bWJlcjtcbiAgICAgICAgICAgICAgICAgICAgZWFjaFVuaXQuQWxsVmFsdmVMYWJlbFBhaXJzLnB1c2goSnNVdGlsLm1hcFRvTmV3T2JqZWN0KHZhbHZlLCBuZXcgVmFsdmVMYWJlbFBhaXIoKSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFwcGx5V2VpZ2h0aW5nRm9yU3Vic2VxdWVudE9yZGVyQnkoKSB7XG4gICAgICAgIC8vIGZvcmVhY2ggYWxsdW5pdHNcbiAgICAgICAgZm9yIChsZXQgZWFjaFVuaXQgb2YgdGhpcy5hbGx1bml0cykge1xuICAgICAgICAgICAgZm9yIChsZXQgdmFsdmVBc3NpZ25tZW50Um93IG9mIGVhY2hVbml0LlZhbHZlTGF5b3V0KSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgdmFsdmUgb2YgdmFsdmVBc3NpZ25tZW50Um93LlZhbHZlTGFiZWxQYWlyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx2ZS5MYWJlbCA9PT0gXCJDVy1SXCIgfHwgdmFsdmUuTGFiZWwgPT09IFwiQ1dcIiB8fCB2YWx2ZS5MYWJlbCA9PT0gXCJIQ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx2ZS5XZWlnaHRpbmcgPSAxMDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx2ZS5MYWJlbCA9PSBcIlBXLVJcIiB8fCB2YWx2ZS5MYWJlbCA9PSBcIlBXXCIgfHwgdmFsdmUuTGFiZWwgPT0gXCJIU1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx2ZS5XZWlnaHRpbmcgPSAyMDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx2ZS5MYWJlbCA9PSBcIkNXLUxcIiB8fCB2YWx2ZS5MYWJlbCA9PSBcIkxDXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHZlLldlaWdodGluZyA9IDMwO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHZlLkxhYmVsID09IFwiUFctTFwiIHx8IHZhbHZlLkxhYmVsID09IFwiTFNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdmUuV2VpZ2h0aW5nID0gNDA7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdmVOdW1iZXJBc1N0cmluZyA9IHZhbHZlLkxhYmVsLnN1YnN0cigxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBudmFsID0gK3ZhbHZlTnVtYmVyQXNTdHJpbmc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChudmFsID09PSBOYU4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiBJbnZhbGlkIFZhbHZlTnVtYmVyIGluc2lkZSBvZiBMYWJlbCBcIiArIGVhY2hVbml0LklkICsgXCIgcm93OlwiICsgdmFsdmVBc3NpZ25tZW50Um93LlJvd051bWJlciArIFwiIExhYmVsOlwiICsgdmFsdmUuTGFiZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdmUuTGFiZWwuc3RhcnRzV2l0aChcIlNcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx2ZS5XZWlnaHRpbmcgPSAxMDAgKiBudmFsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx2ZS5MYWJlbC5zdGFydHNXaXRoKFwiRlwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHZlLldlaWdodGluZyA9IDUwMDAgKiBudmFsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiBJbnZhbGlkIExhYmVsIGluc2lkZSBvZiBMYWJlbCBcIiArIGVhY2hVbml0LklkICsgXCIgcm93OlwiICsgdmFsdmVBc3NpZ25tZW50Um93LlJvd051bWJlciArIFwiIExhYmVsOlwiICsgdmFsdmUuTGFiZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0QXZhaWxhYmxlQ29uZmlndXJhdGlvbigpOiBVbml0Q29uZmlndXJhdGlvbk1vZGVsW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5hbGx1bml0cztcbiAgICB9XG5cbiAgICAvLyBUT0RPIG1ha2UgYWxsdW5pdHMgYSByZWFsIG9iamVjdFxuICAgIGdldENvbmZpZ3VyYXRpb24odW5pdE5hbWU6IHN0cmluZyk6IFVuaXRDb25maWd1cmF0aW9uTW9kZWwge1xuICAgICAgICBjb25zdCBpdGVtID0gXy5maW5kKHRoaXMuYWxsdW5pdHMsIGZ1bmN0aW9uKHVuaXQpIHsgdW5pdC5Vbml0TmFtZSA9PT0gdW5pdE5hbWUgfSApO1xuICAgICAgICBpZiAoaXRlbSA9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVuaXQgY29uZmlndXJhdGlvbiBub3QgZm91bmQuXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cblxuICAgIGdldENvbmZpZ3VyYXRpb25CeUlkKGlkOiBzdHJpbmcpOiBVbml0Q29uZmlndXJhdGlvbk1vZGVsIHtcbiAgICAgICAgY29uc3QgaXRlbTogVW5pdENvbmZpZ3VyYXRpb25Nb2RlbCA9IF8uZmluZCh0aGlzLmFsbHVuaXRzLCBmdW5jdGlvbih1bml0KSB7IHJldHVybiB1bml0LklkID09PSBpZCB9ICk7XG4gICAgICAgIGlmIChpdGVtID09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5pdCBjb25maWd1cmF0aW9uIG5vdCBmb3VuZC5cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG5cbiAgICBnZXRDdXJyZW50VmFsdmVBc3NpZ25tZW50cygpOiBWYWx2ZUFzc2lnbm1lbnQge1xuICAgICAgICB2YXIgdmFsdmVBc3NpZ25tZW50c0ZpbGUgPSB0aGlzLmZpbGVMb2NhdGlvbnMudmFsdmVBc3NpZ25tZW50U3RhdGU7XG4gICAgICAgIGNvbnNvbGUubG9nKHZhbHZlQXNzaWdubWVudHNGaWxlKTtcbiAgICAgICAgcmV0dXJuIEpTT05GSUxFLnN5bmModmFsdmVBc3NpZ25tZW50c0ZpbGUpO1xuICAgIH1cblxuICAgIC8vIFRPRE8gaW1wbGVtZW50IHNlcmlhbGl6ZXRvZGlza1xuICAgIHdyaXRlVmFsdmVBc3NpZ25tZW50cyh2YWx2ZUFzc2lnbm1lbnRzOiBWYWx2ZUFzc2lnbm1lbnQpIHtcbiAgICAgICAgdmFyIHZhbHZlQXNzaWdubWVudHNGaWxlID0gdGhpcy5maWxlTG9jYXRpb25zLnZhbHZlQXNzaWdubWVudFN0YXRlO1xuICAgICAgICAvLyBzZXJpYWxpemV0b2Rpc2tcbiAgICB9XG5cbn0iXX0=
