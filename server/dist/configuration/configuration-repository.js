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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var JsUtil_1 = require("../universal/JsUtil");
var app_info_service_1 = require("../services/app-info.service");
var server_types_1 = require("../server.types");
var JSONFILE = require("load-json-file");
var _ = require("lodash");
var app_types_1 = require("../universal/app.types");
var unit_state_1 = require("../unitstate/unit-state");
var device_info_1 = require("../unitstate/device-info");
var PATH = require("path");
var ConfigurationRepository = /** @class */ (function () {
    // TODO figure out how to use deserializefromdisk
    function ConfigurationRepository(appInfo, fileLocations) {
        this.appInfo = appInfo;
        this.fileLocations = fileLocations;
        this.objectId = JsUtil_1.JsUtil.getObjectId();
        console.log("ctor.ConfigurationRepository", this.objectId);
    }
    // return LocalizationResourceModel
    ConfigurationRepository.prototype.getLocalizationResources = function (countrylanguagecode) {
        try {
            var fileName = PATH.join(this.appInfo.configDir_App, "localization." + countrylanguagecode + ".json");
            return JSONFILE.sync(fileName);
        }
        catch (err) {
            console.log("ERROR: FileNotFoundException on Country:" + countrylanguagecode);
            return null;
        }
    };
    ConfigurationRepository.prototype.getPlatform = function (fileName) {
        return __awaiter(this, void 0, void 0, function () {
            var fullfileName;
            return __generator(this, function (_a) {
                fullfileName = PATH.join(this.appInfo.designDir, fileName);
                return [2 /*return*/, JSONFILE.sync(fullfileName)];
            });
        });
    };
    ConfigurationRepository.prototype.getPlatform2 = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dirsegment, baseDir, platformFile, loadedPlatformFile, pModel;
            return __generator(this, function (_a) {
                dirsegment = device_info_1.DeviceInfo.unitState.UnitType != "Spire5" ? "spire" : "spire5";
                baseDir = PATH.join(this.appInfo.configDir_App, "design/platform", dirsegment);
                platformFile = PATH.join(baseDir, "platform.json");
                loadedPlatformFile = JSONFILE.sync(platformFile);
                pModel = JsUtil_1.JsUtil.mapToNewObject(loadedPlatformFile, new app_types_1.PlatformModel());
                return [2 /*return*/, pModel];
            });
        });
    };
    ConfigurationRepository.prototype.getPlatformMenuLayout = function (itemCount) {
        return __awaiter(this, void 0, void 0, function () {
            var dirsegment, baseDir, layoutFile, loadedLayoutFile, pModel;
            return __generator(this, function (_a) {
                dirsegment = device_info_1.DeviceInfo.unitState.UnitType != "Spire5" ? "spire" : "spire5";
                baseDir = PATH.join(this.appInfo.configDir_App, "design/platform", dirsegment);
                layoutFile = PATH.join(baseDir, "layout" + itemCount + ".json");
                loadedLayoutFile = JSONFILE.sync(layoutFile);
                pModel = JsUtil_1.JsUtil.mapToNewObject(loadedLayoutFile, new app_types_1.PlatformMenuLayout());
                return [2 /*return*/, pModel];
            });
        });
    };
    // return ServiceUIModel
    ConfigurationRepository.prototype.getServiceUI = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, JSONFILE.sync(this.fileLocations.serviceUIState)];
            });
        });
    };
    // returns ServiceUIPopupButtonsModel
    ConfigurationRepository.prototype.getServiceUIPopupButtons = function () {
        return JSONFILE.sync(this.fileLocations.serviceUIPopupButtonState);
    };
    // returns UICustomizationsModel
    // TODO find where it would get the customizations
    ConfigurationRepository.prototype.getUICustomizations = function () {
        return JsUtil_1.JsUtil.mapToNewObject(JSONFILE.sync(this.fileLocations.uiCustomizationsAvailable), new app_types_1.UICustomizationsModel());
    };
    ConfigurationRepository.prototype.getUnitState = function () {
        // TODO create the UnitState model in issue 49
        var result = JsUtil_1.JsUtil.mapToNewObject(JSONFILE.sync(this.fileLocations.unitState), new unit_state_1.UnitState());
        return result;
    };
    // TODO find code that saves it to disk
    ConfigurationRepository.prototype.saveUnitState = function (unitState) {
        //JSONFILE.save()
    };
    //TODO test;
    ConfigurationRepository.prototype.getPermissions = function (userRole) {
        // get userpermissions from the file location basedon the user Role
        var userPermissions = JsUtil_1.JsUtil.mapToNewObject(JSONFILE.sync(this.fileLocations.userPermissions), new app_types_1.PermissionsModel());
        var correctPermissions = _.find(userPermissions.Roles, function (item) {
            return item.Role == userRole;
        });
        return correctPermissions.ActionPermissions;
    };
    // TODO file deletion
    ConfigurationRepository.prototype.getMixologyState = function () {
        // create a MixologyStateModel from the mixology file location
        var mixologyStateModel_dirty = JSONFILE.sync(this.fileLocations.mixologyState);
        var mixologyStateModel = new app_types_1.MixologyStateModel();
        mixologyStateModel.Version = mixologyStateModel_dirty.Version;
        for (var _i = 0, _a = mixologyStateModel_dirty.Mixes; _i < _a.length; _i++) {
            var mixologyState = _a[_i];
            mixologyStateModel.Mixes.push(JsUtil_1.JsUtil.mapToNewObject(mixologyState, new app_types_1.ButtonModel()));
        }
        return mixologyStateModel.Mixes;
    };
    ConfigurationRepository.prototype.getMixologyState2 = function () {
        // create a MixologyStateModel from the mixology file location
        var mixologyStateModel_dirty = JSONFILE.sync(this.fileLocations.mixologyState2);
        return mixologyStateModel_dirty;
    };
    ConfigurationRepository.prototype.writeMixologyState = function (mixes) {
        var mixologyStateModel = new app_types_1.MixologyStateModel();
        mixologyStateModel.Mixes = mixes;
        // serialize to disk
    };
    ConfigurationRepository.prototype.resetMixologyState = function () {
        var mixologyStateModel = JSONFILE.sync(this.fileLocations.curatedMixologySeed);
        // serialize to disk
    };
    ConfigurationRepository.prototype.getTopCombinationState = function () {
        var topcombinationmodel = JSONFILE.sync(this.fileLocations.topCombinationState);
        // ToDo: umm.. not really
        topcombinationmodel.topCombinations.forEach(function (x) { return x.IsDisabled = false; });
        return topcombinationmodel.topCombinations;
    };
    // TODO test
    ConfigurationRepository.prototype.getTopCombinationSeed = function () {
        var topCombinationModel_dirty = JSONFILE.sync(this.fileLocations.topCombinationSeed);
        var topCombinationModel = new Array();
        for (var button in topCombinationModel_dirty) {
            topCombinationModel.push(JsUtil_1.JsUtil.mapToNewObject(button, new app_types_1.ButtonModel()));
        }
        return topCombinationModel;
    };
    // TODO test
    ConfigurationRepository.prototype.getCuratedMixSeed = function () {
        var mixologyStateModel_dirty = JSONFILE.sync(this.fileLocations.curatedMixologySeed);
        var mixologyStateModel = new Array();
        for (var button in mixologyStateModel_dirty) {
            mixologyStateModel.push(JsUtil_1.JsUtil.mapToNewObject(button, new app_types_1.ButtonModel()));
        }
        return mixologyStateModel;
    };
    // takes ButtonModel[] as input
    ConfigurationRepository.prototype.writeTopCombinationState = function (combinations) {
        var topCombinationModel = new app_types_1.TopCombinationModel();
        topCombinationModel.TopCombinations = combinations;
        // serialize to disk
    };
    ConfigurationRepository.prototype.resetTopCombinationState = function () {
        var topCombinationModel = JSONFILE.sync(this.fileLocations.topCombinationSeed);
        // serialize to disk
    };
    ConfigurationRepository.prototype.getLegacyValvesState = function () {
        var legacyValveModel = JsUtil_1.JsUtil.mapToNewObject(JSONFILE.sync(this.fileLocations.legacyValveState), new app_types_1.LegacyValveModel());
        return legacyValveModel.LegacyValves;
    };
    // returns an IList of ButtonModels
    ConfigurationRepository.prototype.getLegacyValvesSeed = function () {
        var legacyValveModel = JsUtil_1.JsUtil.mapToNewObject(JSONFILE.sync(this.fileLocations.legacyValveSeed), new app_types_1.LegacyValveModel());
        return legacyValveModel.LegacyValves;
    };
    ConfigurationRepository.prototype.writeLegacyValvesState = function (legacyValves) {
        var legacyValveModel = new app_types_1.LegacyValveModel();
        legacyValveModel.LegacyValves = legacyValves;
        // serialize to disk
    };
    ConfigurationRepository.prototype.resetLegacyValvesState = function () {
        var legacyValveModel = JSONFILE.sync(this.fileLocations.legacyValveSeed);
        // serialize to disk
    };
    ConfigurationRepository.prototype.getUserPermissions = function () {
        return JsUtil_1.JsUtil.mapToNewObject(JSONFILE.sync(this.fileLocations.userPermissions), new app_types_1.PermissionsModel());
    };
    ConfigurationRepository.prototype.getHome = function (fileName) {
        return JSONFILE.sync(PATH.join(this.fileLocations.homeFolder, fileName));
    };
    ConfigurationRepository.prototype.getDesignFlavors = function () {
        return __awaiter(this, void 0, void 0, function () {
            var fs, glob, designFlavors, filenames, _i, filenames_1, filename, current_file, designFlavor;
            return __generator(this, function (_a) {
                fs = require('fs');
                glob = require('glob');
                designFlavors = [];
                filenames = glob.sync(this.fileLocations.designFlavorFolder + "**/*.json");
                for (_i = 0, filenames_1 = filenames; _i < filenames_1.length; _i++) {
                    filename = filenames_1[_i];
                    current_file = JSONFILE.sync(filename);
                    designFlavor = JsUtil_1.JsUtil.mapToNewObject(current_file, new app_types_1.Flavor());
                    if (current_file.design) {
                        designFlavor.design = JsUtil_1.JsUtil.mapToNewObject(current_file.design, new app_types_1.FlavorDesign());
                    }
                    if (current_file.select) {
                        designFlavor.select = JsUtil_1.JsUtil.mapToNewObject(current_file.select, new app_types_1.FlavorAnimation());
                    }
                    if (current_file.spin) {
                        designFlavor.spin = JsUtil_1.JsUtil.mapToNewObject(current_file.spin, new app_types_1.FlavorAnimation());
                    }
                    designFlavors.push(designFlavor);
                }
                return [2 /*return*/, designFlavors];
            });
        });
    };
    ConfigurationRepository.prototype.getDesignPourables = function (country) {
        return __awaiter(this, void 0, void 0, function () {
            var fs, glob, filenames, country_filenames, pourables;
            return __generator(this, function (_a) {
                fs = require('fs');
                glob = require('glob');
                filenames = glob.sync(this.fileLocations.designFolder + "pourables/en-us/*.json");
                // iterate and load all of the en-us first (en-us will have an entry
                // the id, will be the property name
                // next iterate and over-lay, using the id as the key, any language-country combination
                // this will be some entries
                if (country != "en-us") {
                    country_filenames = glob.sync(this.fileLocations.designFolder + "pourables/" + country + "/*.json");
                    filenames = filenames.concat(country_filenames);
                }
                pourables = [];
                _.forEach(filenames, function (file) {
                    // read the file off the disk, each object/subobject may or may not have all the properties on the object
                    var pourableRaw = JSONFILE.sync(file);
                    var pourable = JsUtil_1.JsUtil.mapToNewObject(pourableRaw, new app_types_1.PourableDesign());
                    if (pourableRaw.design) {
                        pourable.design = JsUtil_1.JsUtil.mapToNewObject(pourableRaw.design, new app_types_1.DesignNode());
                        if (pourableRaw.design.assets) {
                            pourable.design.assets = JsUtil_1.JsUtil.mapToNewObject(pourableRaw.design.assets, new app_types_1.DesignAssets());
                        }
                        if (pourableRaw.design.colors) {
                            pourable.design.colors = JsUtil_1.JsUtil.mapToNewObject(pourableRaw.design.colors, new app_types_1.DesignColors());
                        }
                        if (pourableRaw.design.particlesHome) {
                            pourable.design.particlesHome = JsUtil_1.JsUtil.mapToNewObject(pourableRaw.design.particlesHome, new app_types_1.DesignParticles());
                        }
                        if (pourableRaw.design.secondaryAnimation) {
                            pourable.design.secondaryAnimation = JsUtil_1.JsUtil.mapToNewObject(pourableRaw.design.secondaryAnimation, new app_types_1.DesignSecondaryAnimation());
                        }
                        if (pourableRaw.design.secondaryAnimationAda) {
                            pourable.design.secondaryAnimationAda = JsUtil_1.JsUtil.mapToNewObject(pourableRaw.design.secondaryAnimationAda, new app_types_1.DesignSecondaryAnimation());
                        }
                        if (pourableRaw.design.secondaryAnimation_5) {
                            pourable.design.secondaryAnimation_5 = JsUtil_1.JsUtil.mapToNewObject(pourableRaw.design.secondaryAnimation_5, new app_types_1.DesignSecondaryAnimation());
                        }
                        if (pourableRaw.design.secondaryAnimationAda_5) {
                            pourable.design.secondaryAnimationAda_5 = JsUtil_1.JsUtil.mapToNewObject(pourableRaw.design.secondaryAnimationAda_5, new app_types_1.DesignSecondaryAnimation());
                        }
                        if (pourableRaw.design.particlesBrand) {
                            _.forEach(pourableRaw.design.particlesBrand, function (particleBrand) {
                                var newItem = JsUtil_1.JsUtil.mapToNewObject(particleBrand, new app_types_1.DesignParticlesBrand());
                                pourable.design.particlesBrand.push(newItem);
                                console.log('==============>', file, newItem);
                            });
                            // pourable.design.particlesHome = JsUtil.mapToNewObject(pourableRaw.design.particlesBrand, new DesignParticlesBrand[]()]);
                        }
                        if (pourableRaw.CalorieCups) {
                            var calorieCups_1 = [];
                            _.forEach(pourable.CalorieCups, function (item) {
                                calorieCups_1.push(JsUtil_1.JsUtil.mapToNewObject(item, new app_types_1.CalorieCup()));
                            });
                            pourable.CalorieCups = calorieCups_1;
                        }
                    }
                    pourables.push(pourable);
                });
                return [2 /*return*/, pourables];
            });
        });
    };
    ConfigurationRepository.prototype.getDesignBubbles = function () {
        return __awaiter(this, void 0, void 0, function () {
            var bubbles_file;
            return __generator(this, function (_a) {
                bubbles_file = JSONFILE.sync(this.fileLocations.designFolder + "bubbles.json");
                return [2 /*return*/, bubbles_file];
            });
        });
    };
    ConfigurationRepository.prototype.getDesignAnimations = function () {
        return __awaiter(this, void 0, void 0, function () {
            var fs, glob, filenames, animationsArray, _i, filenames_2, filename, contents;
            return __generator(this, function (_a) {
                fs = require('fs');
                glob = require('glob');
                filenames = glob.sync(this.fileLocations.designFolder + "animations/**/*.json");
                animationsArray = [];
                for (_i = 0, filenames_2 = filenames; _i < filenames_2.length; _i++) {
                    filename = filenames_2[_i];
                    contents = JSONFILE.sync(filename);
                    animationsArray.push(JsUtil_1.JsUtil.mapToNewObject(contents, new app_types_1.DesignAnimation()));
                }
                return [2 /*return*/, animationsArray];
            });
        });
    };
    ConfigurationRepository.prototype.getIdleState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var idleStateRaw, idlestate, videoitems, _i, _a, video, videoitem;
            return __generator(this, function (_b) {
                idleStateRaw = JSONFILE.sync(this.fileLocations.idleState);
                idlestate = JsUtil_1.JsUtil.mapToNewObject(idleStateRaw, new app_types_1.IdleState());
                videoitems = [];
                if (idleStateRaw.videos) {
                    for (_i = 0, _a = idleStateRaw.videos; _i < _a.length; _i++) {
                        video = _a[_i];
                        videoitem = JsUtil_1.JsUtil.mapToNewObject(video, new app_types_1.ResourceItem());
                        videoitems.push(videoitem);
                    }
                    idlestate.videos = videoitems;
                }
                return [2 /*return*/, idlestate];
            });
        });
    };
    ConfigurationRepository.prototype.getDeviceInfoUnitState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var unitState;
            return __generator(this, function (_a) {
                unitState = JSONFILE.sync(this.fileLocations.unitState);
                return [2 /*return*/, unitState];
            });
        });
    };
    ConfigurationRepository.prototype.getOverrides = function () {
        return __awaiter(this, void 0, void 0, function () {
            var overrides;
            return __generator(this, function (_a) {
                overrides = JSONFILE.sync(this.fileLocations.overrideState);
                return [2 /*return*/, overrides];
            });
        });
    };
    ConfigurationRepository.prototype.getCalorieCountState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var calorieCountState;
            return __generator(this, function (_a) {
                calorieCountState = JSONFILE.sync(this.fileLocations.calorieCountState);
                return [2 /*return*/, calorieCountState];
            });
        });
    };
    ConfigurationRepository.prototype.getLocalizationForConsumerUI = function () {
        var consumerUILocalizationModel = new app_types_1.ConsumerUILocalizationModel();
        if (device_info_1.DeviceInfo.unitState.PrimaryConsumerLanguage == "none") {
            consumerUILocalizationModel.primaryLocalization = this.getLocalizationResourcesForConsumerUI("en-us");
        }
        else {
            consumerUILocalizationModel.primaryLocalization = this.getLocalizationResourcesForConsumerUI(device_info_1.DeviceInfo.unitState.PrimaryConsumerLanguage);
        }
        console.log("-----secondary", device_info_1.DeviceInfo.unitState.SecondaryConsumerLanguage, device_info_1.DeviceInfo.unitState);
        if (device_info_1.DeviceInfo.unitState.SecondaryConsumerLanguage == "none") {
            consumerUILocalizationModel.secondaryLocalization = this.getLocalizationResourcesForConsumerUI("es-mx");
        }
        else {
            consumerUILocalizationModel.secondaryLocalization = this.getLocalizationResourcesForConsumerUI(device_info_1.DeviceInfo.unitState.SecondaryConsumerLanguage);
            consumerUILocalizationModel.secondaryLocalization.ResourceStrings["home.secondary.language"] =
                consumerUILocalizationModel.primaryLocalization.ResourceStrings["home.pour.language.title"];
            consumerUILocalizationModel.primaryLocalization.ResourceStrings["home.secondary.language"] =
                consumerUILocalizationModel.secondaryLocalization.ResourceStrings["home.pour.language.title"];
        }
        // ToDo: Fix the cheat ARGH
        // consumerUILocalizationModel.secondaryLocalization = this.getLocalizationResourcesForConsumerUI(DeviceInfo.unitState._secondaryConsumerLanguage);
        consumerUILocalizationModel.secondaryLocalization.ResourceStrings["home.secondary.language"] =
            consumerUILocalizationModel.primaryLocalization.ResourceStrings["home.pour.language.title"];
        consumerUILocalizationModel.primaryLocalization.ResourceStrings["home.secondary.language"] =
            consumerUILocalizationModel.secondaryLocalization.ResourceStrings["home.pour.language.title"];
        return consumerUILocalizationModel;
    };
    ConfigurationRepository.prototype.getLocalizationResourcesForConsumerUI = function (countryLanguageCode) {
        try {
            var localizationFilePath = PATH.join(this.appInfo.configDir_App, "Localization", "consumerui." + countryLanguageCode + ".json");
            return JSONFILE.sync(localizationFilePath);
        }
        catch (Exception) {
            console.log("Error reading ConsumerUI Localization for Country: ", countryLanguageCode);
        }
        return new app_types_1.LocalizationResourceModel();
    };
    ConfigurationRepository = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(server_types_1.default.AppInfo)),
        __param(1, inversify_1.inject(server_types_1.default.FileLocations)),
        __metadata("design:paramtypes", [app_info_service_1.AppInfoService,
            server_types_1.FileLocations])
    ], ConfigurationRepository);
    return ConfigurationRepository;
}());
exports.ConfigurationRepository = ConfigurationRepository;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpZ3VyYXRpb24vY29uZmlndXJhdGlvbi1yZXBvc2l0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx1Q0FBNkM7QUFDN0MsOENBQTJDO0FBQzNDLGlFQUE0RDtBQUM1RCxnREFBcUQ7QUFDckQseUNBQTJDO0FBQzNDLDBCQUE0QjtBQUM1QixvREE0QmdDO0FBQ2hDLHNEQUFrRDtBQUNsRCx3REFBb0Q7QUFFcEQsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRzdCO0lBSUksaURBQWlEO0lBQ2pELGlDQUEyQyxPQUF1QixFQUNqQixhQUE0QjtRQURsQyxZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUNqQixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUN6RSxJQUFJLENBQUMsUUFBUSxHQUFHLGVBQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUQsbUNBQW1DO0lBQ25DLDBEQUF3QixHQUF4QixVQUF5QixtQkFBMkI7UUFDaEQsSUFBSSxDQUFDO1lBQ0QsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxlQUFlLEdBQUcsbUJBQW1CLEdBQUcsT0FBTyxDQUFDLENBQUM7WUFDeEcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbkMsQ0FBQztRQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLDBDQUEwQyxHQUFHLG1CQUFtQixDQUFDLENBQUM7WUFDOUUsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO0lBQ0wsQ0FB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RyxNQUFNLENBQUMsMkJBQTJCLENBQUM7SUFDdkMsQ0FBQztJQUVELHVFQUFxQyxHQUFyQyxVQUFzQyxtQkFBMkI7UUFDN0QsSUFBSSxDQUFDO1lBQ0QsSUFBTSxvQkFBb0IsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLGNBQWMsRUFBRSxhQUFhLEdBQUcsbUJBQW1CLEdBQUcsT0FBTyxDQUFDLENBQUM7WUFDbEksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztRQUMvQyxDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLHFEQUFxRCxFQUFFLG1CQUFtQixDQUFDLENBQUM7UUFDNUYsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLHFDQUF5QixFQUFFLENBQUM7SUFDM0MsQ0FBQztJQXJiUSx1QkFBdUI7UUFEbkMsc0JBQVUsRUFBRTtRQU1JLFdBQUEsa0JBQU0sQ0FBQyxzQkFBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ3JCLFdBQUEsa0JBQU0sQ0FBQyxzQkFBSyxDQUFDLGFBQWEsQ0FBQyxDQUFBO3lDQURZLGlDQUFjO1lBQ0YsNEJBQWE7T0FOcEUsdUJBQXVCLENBc2JuQztJQUFELDhCQUFDO0NBdGJELEFBc2JDLElBQUE7QUF0YlksMERBQXVCIiwiZmlsZSI6ImNvbmZpZ3VyYXRpb24vY29uZmlndXJhdGlvbi1yZXBvc2l0b3J5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpbmplY3QsIGluamVjdGFibGV9IGZyb20gXCJpbnZlcnNpZnlcIjtcbmltcG9ydCB7SnNVdGlsfSBmcm9tIFwiLi4vdW5pdmVyc2FsL0pzVXRpbFwiO1xuaW1wb3J0IHtBcHBJbmZvU2VydmljZX0gZnJvbSBcIi4uL3NlcnZpY2VzL2FwcC1pbmZvLnNlcnZpY2VcIjtcbmltcG9ydCBUWVBFUywge0ZpbGVMb2NhdGlvbnN9IGZyb20gXCIuLi9zZXJ2ZXIudHlwZXNcIjtcbmltcG9ydCAqIGFzIEpTT05GSUxFIGZyb20gXCJsb2FkLWpzb24tZmlsZVwiO1xuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHtcbiAgICBCdXR0b25Nb2RlbCxcbiAgICBGbGF2b3IsXG4gICAgRmxhdm9yQW5pbWF0aW9uLFxuICAgIEZsYXZvckRlc2lnbixcbiAgICBJZGxlU3RhdGUsXG4gICAgTGVnYWN5VmFsdmVNb2RlbCxcbiAgICBNaXhvbG9neVN0YXRlTW9kZWwsXG4gICAgUGVybWlzc2lvbnNNb2RlbCxcbiAgICBSb2xlLFxuICAgIFRvcENvbWJpbmF0aW9uTW9kZWwsXG4gICAgVUlDdXN0b21pemF0aW9uc01vZGVsLFxuICAgIFJlc291cmNlSXRlbSxcbiAgICBQb3VyYWJsZURlc2lnbixcbiAgICBEZXNpZ25Bc3NldHMsXG4gICAgRGVzaWduTm9kZSxcbiAgICBEZXNpZ25Db2xvcnMsXG4gICAgRGVzaWduUGFydGljbGVzLFxuICAgIERlc2lnbkFuaW1hdGlvbixcbiAgICBEZXNpZ25TZWNvbmRhcnlBbmltYXRpb24sXG4gICAgQ2Fsb3JpZUN1cCxcbiAgICBDYWxvcmllQ291bnRTdGF0ZSxcbiAgICBDb25zdW1lclVJTG9jYWxpemF0aW9uTW9kZWwsXG4gICAgTG9jYWxpemF0aW9uUmVzb3VyY2VNb2RlbCxcbiAgICBPdmVycmlkZU1vZGVsLFxuICAgIE92ZXJyaWRlT3B0aW9ucyxcbiAgICBEZXNpZ25QYXJ0aWNsZXNCcmFuZCxcbiAgICBQbGF0Zm9ybU1vZGVsLCBQbGF0Zm9ybU1lbnVMYXlvdXQsIFBsYXRmb3JtQ29vcmRpbmF0ZVxufSBmcm9tIFwiLi4vdW5pdmVyc2FsL2FwcC50eXBlc1wiO1xuaW1wb3J0IHtVbml0U3RhdGV9IGZyb20gXCIuLi91bml0c3RhdGUvdW5pdC1zdGF0ZVwiO1xuaW1wb3J0IHtEZXZpY2VJbmZvfSBmcm9tIFwiLi4vdW5pdHN0YXRlL2RldmljZS1pbmZvXCI7XG5cbmNvbnN0IFBBVEggPSByZXF1aXJlKFwicGF0aFwiKTtcblxuQGluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENvbmZpZ3VyYXRpb25SZXBvc2l0b3J5IHtcblxuICAgIG9iamVjdElkOiBudW1iZXI7XG5cbiAgICAvLyBUT0RPIGZpZ3VyZSBvdXQgaG93IHRvIHVzZSBkZXNlcmlhbGl6ZWZyb21kaXNrXG4gICAgY29uc3RydWN0b3IoQGluamVjdChUWVBFUy5BcHBJbmZvKSBwcml2YXRlIGFwcEluZm86IEFwcEluZm9TZXJ2aWNlLFxuICAgICAgICAgICAgICAgIEBpbmplY3QoVFlQRVMuRmlsZUxvY2F0aW9ucykgcHJpdmF0ZSBmaWxlTG9jYXRpb25zOiBGaWxlTG9jYXRpb25zKSB7XG4gICAgICAgIHRoaXMub2JqZWN0SWQgPSBKc1V0aWwuZ2V0T2JqZWN0SWQoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJjdG9yLkNvbmZpZ3VyYXRpb25SZXBvc2l0b3J5XCIsIHRoaXMub2JqZWN0SWQpO1xuICAgIH1cblxuICAgIC8vIHJldHVybiBMb2NhbGl6YXRpb25SZXNvdXJjZU1vZGVsXG4gICAgZ2V0TG9jYWxpemF0aW9uUmVzb3VyY2VzKGNvdW50cnlsYW5ndWFnZWNvZGU6IHN0cmluZykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBQQVRILmpvaW4odGhpcy5hcHBJbmZvLmNvbmZpZ0Rpcl9BcHAsIFwibG9jYWxpemF0aW9uLlwiICsgY291bnRyeWxhbmd1YWdlY29kZSArIFwiLmpzb25cIik7XG4gICAgICAgICAgICByZXR1cm4gSlNPTkZJTEUuc3luYyhmaWxlTmFtZSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFUlJPUjogRmlsZU5vdEZvdW5kRXhjZXB0aW9uIG9uIENvdW50cnk6XCIgKyBjb3VudHJ5bGFuZ3VhZ2Vjb2RlKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0UGxhdGZvcm0oZmlsZU5hbWU6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnN0IGZ1bGxmaWxlTmFtZSA9IFBBVEguam9pbih0aGlzLmFwcEluZm8uZGVzaWduRGlyLCBmaWxlTmFtZSk7XG4gICAgICAgIHJldHVybiBKU09ORklMRS5zeW5jKGZ1bGxmaWxlTmFtZSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0UGxhdGZvcm0yKCk6IFByb21pc2U8YW55PiB7XG5cbiAgICAgICAgLy8gVE9ETyB3aGF0IHNob3VsZCB0aGUgZGlyc2VnbWVudCBiZT9cbiAgICAgICAgY29uc3QgZGlyc2VnbWVudCA9IERldmljZUluZm8udW5pdFN0YXRlLlVuaXRUeXBlICE9IFwiU3BpcmU1XCIgPyBcInNwaXJlXCIgOiBcInNwaXJlNVwiO1xuICAgICAgICBjb25zdCBiYXNlRGlyID0gUEFUSC5qb2luKHRoaXMuYXBwSW5mby5jb25maWdEaXJfQXBwLCBcImRlc2lnbi9wbGF0Zm9ybVwiLCBkaXJzZWdtZW50KTtcbiAgICAgICAgY29uc3QgcGxhdGZvcm1GaWxlID0gUEFUSC5qb2luKGJhc2VEaXIsIFwicGxhdGZvcm0uanNvblwiKTtcblxuICAgICAgICBjb25zdCBsb2FkZWRQbGF0Zm9ybUZpbGUgPSBKU09ORklMRS5zeW5jKHBsYXRmb3JtRmlsZSk7XG4gICAgICAgIGNvbnN0IHBNb2RlbCA9IEpzVXRpbC5tYXBUb05ld09iamVjdChsb2FkZWRQbGF0Zm9ybUZpbGUsIG5ldyBQbGF0Zm9ybU1vZGVsKCkpO1xuXG4gICAgICAgIHJldHVybiBwTW9kZWw7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0UGxhdGZvcm1NZW51TGF5b3V0KGl0ZW1Db3VudDogbnVtYmVyKTogUHJvbWlzZTxhbnk+IHtcblxuICAgICAgICBjb25zdCBkaXJzZWdtZW50ID0gRGV2aWNlSW5mby51bml0U3RhdGUuVW5pdFR5cGUgIT0gXCJTcGlyZTVcIiA/IFwic3BpcmVcIiA6IFwic3BpcmU1XCI7XG4gICAgICAgIGNvbnN0IGJhc2VEaXIgPSBQQVRILmpvaW4odGhpcy5hcHBJbmZvLmNvbmZpZ0Rpcl9BcHAsIFwiZGVzaWduL3BsYXRmb3JtXCIsIGRpcnNlZ21lbnQpO1xuICAgICAgICBjb25zdCBsYXlvdXRGaWxlID0gUEFUSC5qb2luKGJhc2VEaXIsIGBsYXlvdXQke2l0ZW1Db3VudH0uanNvbmApO1xuXG4gICAgICAgIGNvbnN0IGxvYWRlZExheW91dEZpbGUgPSBKU09ORklMRS5zeW5jKGxheW91dEZpbGUpO1xuICAgICAgICBjb25zdCBwTW9kZWwgPSBKc1V0aWwubWFwVG9OZXdPYmplY3QobG9hZGVkTGF5b3V0RmlsZSwgbmV3IFBsYXRmb3JtTWVudUxheW91dCgpKTtcblxuICAgICAgICByZXR1cm4gcE1vZGVsO1xuICAgIH1cblxuICAgIC8vIHJldHVybiBTZXJ2aWNlVUlNb2RlbFxuICAgIGFzeW5jIGdldFNlcnZpY2VVSSgpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICByZXR1cm4gSlNPTkZJTEUuc3luYyh0aGlzLmZpbGVMb2NhdGlvbnMuc2VydmljZVVJU3RhdGUpO1xuICAgIH1cblxuICAgIC8vIHJldHVybnMgU2VydmljZVVJUG9wdXBCdXR0b25zTW9kZWxcbiAgICBnZXRTZXJ2aWNlVUlQb3B1cEJ1dHRvbnMoKSB7XG4gICAgICAgIHJldHVybiBKU09ORklMRS5zeW5jKHRoaXMuZmlsZUxvY2F0aW9ucy5zZXJ2aWNlVUlQb3B1cEJ1dHRvblN0YXRlKTtcbiAgICB9XG5cbiAgICAvLyByZXR1cm5zIFVJQ3VzdG9taXphdGlvbnNNb2RlbFxuICAgIC8vIFRPRE8gZmluZCB3aGVyZSBpdCB3b3VsZCBnZXQgdGhlIGN1c3RvbWl6YXRpb25zXG4gICAgZ2V0VUlDdXN0b21pemF0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIEpzVXRpbC5tYXBUb05ld09iamVjdChKU09ORklMRS5zeW5jKHRoaXMuZmlsZUxvY2F0aW9ucy51aUN1c3RvbWl6YXRpb25zQXZhaWxhYmxlKSwgbmV3IFVJQ3VzdG9taXphdGlvbnNNb2RlbCgpKTtcbiAgICB9XG5cbiAgICBnZXRVbml0U3RhdGUoKSB7XG4gICAgICAgIC8vIFRPRE8gY3JlYXRlIHRoZSBVbml0U3RhdGUgbW9kZWwgaW4gaXNzdWUgNDlcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gSnNVdGlsLm1hcFRvTmV3T2JqZWN0KEpTT05GSUxFLnN5bmModGhpcy5maWxlTG9jYXRpb25zLnVuaXRTdGF0ZSksIG5ldyBVbml0U3RhdGUoKSk7XG4gICAgICAgIHJldHVybiByZXN1bHQgO1xuICAgIH1cblxuICAgIC8vIFRPRE8gZmluZCBjb2RlIHRoYXQgc2F2ZXMgaXQgdG8gZGlza1xuICAgIHNhdmVVbml0U3RhdGUodW5pdFN0YXRlOiBVbml0U3RhdGUpIHtcbiAgICAgICAgLy9KU09ORklMRS5zYXZlKClcbiAgICB9XG5cbiAgICAvL1RPRE8gdGVzdDtcbiAgICBnZXRQZXJtaXNzaW9ucyh1c2VyUm9sZTogUm9sZSk6IHN0cmluZ1tdIHtcbiAgICAgICAgLy8gZ2V0IHVzZXJwZXJtaXNzaW9ucyBmcm9tIHRoZSBmaWxlIGxvY2F0aW9uIGJhc2Vkb24gdGhlIHVzZXIgUm9sZVxuICAgICAgICB2YXIgdXNlclBlcm1pc3Npb25zID0gSnNVdGlsLm1hcFRvTmV3T2JqZWN0KEpTT05GSUxFLnN5bmModGhpcy5maWxlTG9jYXRpb25zLnVzZXJQZXJtaXNzaW9ucyksIG5ldyBQZXJtaXNzaW9uc01vZGVsKCkpO1xuXG4gICAgICAgIHZhciBjb3JyZWN0UGVybWlzc2lvbnMgPSBfLmZpbmQodXNlclBlcm1pc3Npb25zLlJvbGVzLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW0uUm9sZSA9PSB1c2VyUm9sZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGNvcnJlY3RQZXJtaXNzaW9ucy5BY3Rpb25QZXJtaXNzaW9ucztcbiAgICB9XG5cbiAgICAvLyBUT0RPIGZpbGUgZGVsZXRpb25cbiAgICBnZXRNaXhvbG9neVN0YXRlKCk6IEJ1dHRvbk1vZGVsW10ge1xuICAgICAgICAvLyBjcmVhdGUgYSBNaXhvbG9neVN0YXRlTW9kZWwgZnJvbSB0aGUgbWl4b2xvZ3kgZmlsZSBsb2NhdGlvblxuICAgICAgICB2YXIgbWl4b2xvZ3lTdGF0ZU1vZGVsX2RpcnR5ID0gSlNPTkZJTEUuc3luYyh0aGlzLmZpbGVMb2NhdGlvbnMubWl4b2xvZ3lTdGF0ZSk7XG5cbiAgICAgICAgdmFyIG1peG9sb2d5U3RhdGVNb2RlbCA9IG5ldyBNaXhvbG9neVN0YXRlTW9kZWwoKTtcbiAgICAgICAgbWl4b2xvZ3lTdGF0ZU1vZGVsLlZlcnNpb24gPSBtaXhvbG9neVN0YXRlTW9kZWxfZGlydHkuVmVyc2lvbjtcblxuICAgICAgICBmb3IgKGxldCBtaXhvbG9neVN0YXRlIG9mIG1peG9sb2d5U3RhdGVNb2RlbF9kaXJ0eS5NaXhlcykge1xuICAgICAgICAgICAgbWl4b2xvZ3lTdGF0ZU1vZGVsLk1peGVzLnB1c2goSnNVdGlsLm1hcFRvTmV3T2JqZWN0KG1peG9sb2d5U3RhdGUsIG5ldyBCdXR0b25Nb2RlbCgpKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWl4b2xvZ3lTdGF0ZU1vZGVsLk1peGVzO1xuICAgIH1cblxuICAgIGdldE1peG9sb2d5U3RhdGUyKCk6IGFueSB7XG4gICAgICAgIC8vIGNyZWF0ZSBhIE1peG9sb2d5U3RhdGVNb2RlbCBmcm9tIHRoZSBtaXhvbG9neSBmaWxlIGxvY2F0aW9uXG4gICAgICAgIHZhciBtaXhvbG9neVN0YXRlTW9kZWxfZGlydHkgPSBKU09ORklMRS5zeW5jKHRoaXMuZmlsZUxvY2F0aW9ucy5taXhvbG9neVN0YXRlMik7XG5cbiAgICAgICAgcmV0dXJuIG1peG9sb2d5U3RhdGVNb2RlbF9kaXJ0eTtcblxuICAgIH1cblxuXG4gICAgd3JpdGVNaXhvbG9neVN0YXRlKG1peGVzOiBCdXR0b25Nb2RlbFtdKSB7XG4gICAgICAgIHZhciBtaXhvbG9neVN0YXRlTW9kZWwgPSBuZXcgTWl4b2xvZ3lTdGF0ZU1vZGVsKCk7XG4gICAgICAgIG1peG9sb2d5U3RhdGVNb2RlbC5NaXhlcyA9IG1peGVzO1xuXG4gICAgICAgIC8vIHNlcmlhbGl6ZSB0byBkaXNrXG4gICAgfVxuXG4gICAgcmVzZXRNaXhvbG9neVN0YXRlKCkge1xuICAgICAgICB2YXIgbWl4b2xvZ3lTdGF0ZU1vZGVsID0gSlNPTkZJTEUuc3luYyh0aGlzLmZpbGVMb2NhdGlvbnMuY3VyYXRlZE1peG9sb2d5U2VlZCk7XG4gICAgICAgIC8vIHNlcmlhbGl6ZSB0byBkaXNrXG4gICAgfVxuXG4gICAgZ2V0VG9wQ29tYmluYXRpb25TdGF0ZSgpOiBCdXR0b25Nb2RlbFtdIHtcbiAgICAgICAgdmFyIHRvcGNvbWJpbmF0aW9ubW9kZWwgPSBKU09ORklMRS5zeW5jKHRoaXMuZmlsZUxvY2F0aW9ucy50b3BDb21iaW5hdGlvblN0YXRlKTtcbiAgICAgICAgLy8gVG9EbzogdW1tLi4gbm90IHJlYWxseVxuICAgICAgICB0b3Bjb21iaW5hdGlvbm1vZGVsLnRvcENvbWJpbmF0aW9ucy5mb3JFYWNoKHggPT4geC5Jc0Rpc2FibGVkID0gZmFsc2UpO1xuICAgICAgICByZXR1cm4gdG9wY29tYmluYXRpb25tb2RlbC50b3BDb21iaW5hdGlvbnM7XG4gICAgfVxuXG4gICAgLy8gVE9ETyB0ZXN0XG4gICAgZ2V0VG9wQ29tYmluYXRpb25TZWVkKCk6IEJ1dHRvbk1vZGVsW10ge1xuICAgICAgICB2YXIgdG9wQ29tYmluYXRpb25Nb2RlbF9kaXJ0eSA9IEpTT05GSUxFLnN5bmModGhpcy5maWxlTG9jYXRpb25zLnRvcENvbWJpbmF0aW9uU2VlZCk7XG5cbiAgICAgICAgdmFyIHRvcENvbWJpbmF0aW9uTW9kZWwgPSBuZXcgQXJyYXk8QnV0dG9uTW9kZWw+KCk7XG5cbiAgICAgICAgZm9yIChsZXQgYnV0dG9uIGluIHRvcENvbWJpbmF0aW9uTW9kZWxfZGlydHkpIHtcbiAgICAgICAgICAgIHRvcENvbWJpbmF0aW9uTW9kZWwucHVzaChKc1V0aWwubWFwVG9OZXdPYmplY3QoYnV0dG9uLCBuZXcgQnV0dG9uTW9kZWwoKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRvcENvbWJpbmF0aW9uTW9kZWw7XG4gICAgfVxuXG4gICAgLy8gVE9ETyB0ZXN0XG4gICAgZ2V0Q3VyYXRlZE1peFNlZWQoKTogQnV0dG9uTW9kZWxbXSB7XG4gICAgICAgIHZhciBtaXhvbG9neVN0YXRlTW9kZWxfZGlydHkgPSBKU09ORklMRS5zeW5jKHRoaXMuZmlsZUxvY2F0aW9ucy5jdXJhdGVkTWl4b2xvZ3lTZWVkKTtcblxuICAgICAgICB2YXIgbWl4b2xvZ3lTdGF0ZU1vZGVsID0gbmV3IEFycmF5PEJ1dHRvbk1vZGVsPigpO1xuXG4gICAgICAgIGZvciAobGV0IGJ1dHRvbiBpbiBtaXhvbG9neVN0YXRlTW9kZWxfZGlydHkpIHtcbiAgICAgICAgICAgIG1peG9sb2d5U3RhdGVNb2RlbC5wdXNoKEpzVXRpbC5tYXBUb05ld09iamVjdChidXR0b24sIG5ldyBCdXR0b25Nb2RlbCgpKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWl4b2xvZ3lTdGF0ZU1vZGVsO1xuICAgIH1cblxuICAgIC8vIHRha2VzIEJ1dHRvbk1vZGVsW10gYXMgaW5wdXRcbiAgICB3cml0ZVRvcENvbWJpbmF0aW9uU3RhdGUoY29tYmluYXRpb25zOiBCdXR0b25Nb2RlbFtdKSB7XG4gICAgICAgIHZhciB0b3BDb21iaW5hdGlvbk1vZGVsID0gbmV3IFRvcENvbWJpbmF0aW9uTW9kZWwoKTtcbiAgICAgICAgdG9wQ29tYmluYXRpb25Nb2RlbC5Ub3BDb21iaW5hdGlvbnMgPSBjb21iaW5hdGlvbnM7XG5cbiAgICAgICAgLy8gc2VyaWFsaXplIHRvIGRpc2tcbiAgICB9XG5cbiAgICByZXNldFRvcENvbWJpbmF0aW9uU3RhdGUoKSB7XG4gICAgICAgIHZhciB0b3BDb21iaW5hdGlvbk1vZGVsID0gSlNPTkZJTEUuc3luYyh0aGlzLmZpbGVMb2NhdGlvbnMudG9wQ29tYmluYXRpb25TZWVkKTtcblxuICAgICAgICAvLyBzZXJpYWxpemUgdG8gZGlza1xuICAgIH1cblxuICAgIGdldExlZ2FjeVZhbHZlc1N0YXRlKCk6IEJ1dHRvbk1vZGVsW10ge1xuICAgICAgICB2YXIgbGVnYWN5VmFsdmVNb2RlbCA9IEpzVXRpbC5tYXBUb05ld09iamVjdChKU09ORklMRS5zeW5jKHRoaXMuZmlsZUxvY2F0aW9ucy5sZWdhY3lWYWx2ZVN0YXRlKSwgbmV3IExlZ2FjeVZhbHZlTW9kZWwoKSk7XG4gICAgICAgIHJldHVybiBsZWdhY3lWYWx2ZU1vZGVsLkxlZ2FjeVZhbHZlcztcbiAgICB9XG5cbiAgICAvLyByZXR1cm5zIGFuIElMaXN0IG9mIEJ1dHRvbk1vZGVsc1xuICAgIGdldExlZ2FjeVZhbHZlc1NlZWQoKTogQnV0dG9uTW9kZWxbXSB7XG4gICAgICAgIHZhciBsZWdhY3lWYWx2ZU1vZGVsID0gSnNVdGlsLm1hcFRvTmV3T2JqZWN0KEpTT05GSUxFLnN5bmModGhpcy5maWxlTG9jYXRpb25zLmxlZ2FjeVZhbHZlU2VlZCksIG5ldyBMZWdhY3lWYWx2ZU1vZGVsKCkpO1xuICAgICAgICByZXR1cm4gbGVnYWN5VmFsdmVNb2RlbC5MZWdhY3lWYWx2ZXM7XG4gICAgfVxuXG4gICAgd3JpdGVMZWdhY3lWYWx2ZXNTdGF0ZShsZWdhY3lWYWx2ZXM6IEJ1dHRvbk1vZGVsW10pIHtcbiAgICAgICAgdmFyIGxlZ2FjeVZhbHZlTW9kZWwgPSBuZXcgTGVnYWN5VmFsdmVNb2RlbCgpO1xuICAgICAgICBsZWdhY3lWYWx2ZU1vZGVsLkxlZ2FjeVZhbHZlcyA9IGxlZ2FjeVZhbHZlcztcbiAgICAgICAgLy8gc2VyaWFsaXplIHRvIGRpc2tcbiAgICB9XG5cbiAgICByZXNldExlZ2FjeVZhbHZlc1N0YXRlKCkge1xuICAgICAgICB2YXIgbGVnYWN5VmFsdmVNb2RlbCA9IEpTT05GSUxFLnN5bmModGhpcy5maWxlTG9jYXRpb25zLmxlZ2FjeVZhbHZlU2VlZCk7XG4gICAgICAgIC8vIHNlcmlhbGl6ZSB0byBkaXNrXG4gICAgfVxuXG4gICAgZ2V0VXNlclBlcm1pc3Npb25zKCk6IFBlcm1pc3Npb25zTW9kZWwge1xuICAgICAgICByZXR1cm4gSnNVdGlsLm1hcFRvTmV3T2JqZWN0KEpTT05GSUxFLnN5bmModGhpcy5maWxlTG9jYXRpb25zLnVzZXJQZXJtaXNzaW9ucyksIG5ldyBQZXJtaXNzaW9uc01vZGVsKCkpO1xuICAgIH1cblxuICAgIGdldEhvbWUoZmlsZU5hbWU6IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHJldHVybiBKU09ORklMRS5zeW5jKFBBVEguam9pbih0aGlzLmZpbGVMb2NhdGlvbnMuaG9tZUZvbGRlciwgZmlsZU5hbWUpKTtcbiAgICB9XG5cbiAgICBhc3luYyBnZXREZXNpZ25GbGF2b3JzKCk6IFByb21pc2U8Rmxhdm9yW10+IHtcbiAgICAgICAgLy8gcmVhZCB0aGUgZGlzYyBmb3IgYWxsIGZpbGVzXG4gICAgICAgIC8vIGNvbWJpbmUgdGhlIGVsZW1lbnRzIGludG8gb25lIHN0cm9uZ2x5IHR5cGVkIGNvbGxlY3Rpb25cblxuICAgICAgICBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG4gICAgICAgIGNvbnN0IGdsb2IgPSByZXF1aXJlKCdnbG9iJyk7XG5cbiAgICAgICAgbGV0IGRlc2lnbkZsYXZvcnM6IEZsYXZvcltdID0gW107XG5cbiAgICAgICAgLy8gZ2V0IGFsbCBqc29uIGZpbGVzIGluIHRoZSBjb25zdW1lciB1aSBmbGF2b3IgZm9sZGVyXG4gICAgICAgIGxldCBmaWxlbmFtZXMgPSBnbG9iLnN5bmModGhpcy5maWxlTG9jYXRpb25zLmRlc2lnbkZsYXZvckZvbGRlciArIFwiKiovKi5qc29uXCIpO1xuXG4gICAgICAgIGZvciAobGV0IGZpbGVuYW1lIG9mIGZpbGVuYW1lcykge1xuXG4gICAgICAgICAgICBsZXQgY3VycmVudF9maWxlID0gSlNPTkZJTEUuc3luYyhmaWxlbmFtZSk7XG4gICAgICAgICAgICBsZXQgZGVzaWduRmxhdm9yOiBGbGF2b3IgPSBKc1V0aWwubWFwVG9OZXdPYmplY3QoY3VycmVudF9maWxlLCBuZXcgRmxhdm9yKCkpO1xuXG4gICAgICAgICAgICBpZiAoY3VycmVudF9maWxlLmRlc2lnbikge1xuICAgICAgICAgICAgICAgIGRlc2lnbkZsYXZvci5kZXNpZ24gPSBKc1V0aWwubWFwVG9OZXdPYmplY3QoY3VycmVudF9maWxlLmRlc2lnbiwgbmV3IEZsYXZvckRlc2lnbigpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGN1cnJlbnRfZmlsZS5zZWxlY3QpIHtcbiAgICAgICAgICAgICAgICBkZXNpZ25GbGF2b3Iuc2VsZWN0ID0gSnNVdGlsLm1hcFRvTmV3T2JqZWN0KGN1cnJlbnRfZmlsZS5zZWxlY3QsIG5ldyBGbGF2b3JBbmltYXRpb24oKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjdXJyZW50X2ZpbGUuc3Bpbikge1xuICAgICAgICAgICAgICAgIGRlc2lnbkZsYXZvci5zcGluID0gSnNVdGlsLm1hcFRvTmV3T2JqZWN0KGN1cnJlbnRfZmlsZS5zcGluLCBuZXcgRmxhdm9yQW5pbWF0aW9uKCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkZXNpZ25GbGF2b3JzLnB1c2goZGVzaWduRmxhdm9yKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZXNpZ25GbGF2b3JzO1xuICAgIH1cblxuICAgIGFzeW5jIGdldERlc2lnblBvdXJhYmxlcyhjb3VudHJ5OiBzdHJpbmcpOiBQcm9taXNlPFBvdXJhYmxlRGVzaWduW10+IHtcbiAgICAgICAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuICAgICAgICBjb25zdCBnbG9iID0gcmVxdWlyZSgnZ2xvYicpO1xuXG4gICAgICAgIC8vIFRvRG8gQnVnLCB3ZSByZWFkIGVuLXVzLCB0aGVuIG92ZXJyaWRlIGZvciB0aGUgc3BlY2lmaWMgKEhFUkUgV0UgQVJFIEhBUkRDT0RJTkcgdGhlIGZvbGRlcilcbiAgICAgICAgLy8gc2VlIEMjIGNvZGUgZm9yIHJlZmVyZW5jZVxuXG4gICAgICAgIC8vIGdldCBhbGwganNvbiBmaWxlcyBpbiB0aGUgY29uc3VtZXIgdWkgcG91cmFibGVzIGZvbGRlclxuICAgICAgICBsZXQgZmlsZW5hbWVzID0gZ2xvYi5zeW5jKHRoaXMuZmlsZUxvY2F0aW9ucy5kZXNpZ25Gb2xkZXIgKyBgcG91cmFibGVzL2VuLXVzLyouanNvbmApO1xuXG4gICAgICAgIC8vIGl0ZXJhdGUgYW5kIGxvYWQgYWxsIG9mIHRoZSBlbi11cyBmaXJzdCAoZW4tdXMgd2lsbCBoYXZlIGFuIGVudHJ5XG4gICAgICAgIC8vIHRoZSBpZCwgd2lsbCBiZSB0aGUgcHJvcGVydHkgbmFtZVxuXG4gICAgICAgIC8vIG5leHQgaXRlcmF0ZSBhbmQgb3Zlci1sYXksIHVzaW5nIHRoZSBpZCBhcyB0aGUga2V5LCBhbnkgbGFuZ3VhZ2UtY291bnRyeSBjb21iaW5hdGlvblxuICAgICAgICAvLyB0aGlzIHdpbGwgYmUgc29tZSBlbnRyaWVzXG5cbiAgICAgICAgaWYgKGNvdW50cnkgIT0gXCJlbi11c1wiKSB7XG4gICAgICAgICAgICBjb25zdCBjb3VudHJ5X2ZpbGVuYW1lcyA9IGdsb2Iuc3luYyh0aGlzLmZpbGVMb2NhdGlvbnMuZGVzaWduRm9sZGVyICsgYHBvdXJhYmxlcy9gICsgY291bnRyeSArIGAvKi5qc29uYCk7XG5cbiAgICAgICAgICAgIGZpbGVuYW1lcyA9IGZpbGVuYW1lcy5jb25jYXQoY291bnRyeV9maWxlbmFtZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgd2UgZGVjaWRlIHRvIGluY2x1ZGUgYSBjdXN0b21lciBzcGVjaWZpYyBvdmVybGF5LCB0aGVuIHRoZXJlIHdvdWxkIGJlIGFub3RoZXJcbiAgICAgICAgLy8gaXRlcmF0aW9uLiBwZXJoYXBzLCByYXRoZXIgdGhhbiBuYW1pbmcsIGp1c3QgYSBkaWZmZXJlbnQgZm9sZGVyIGRlc2lnbi9wb3VyYWJsZXMvY3VzdG9tZXJcblxuICAgICAgICAvLyBub3cgd2UgaGF2ZSB0aGUgcHJvcGVyIGxpc3Qgb2YgZmlsZXMgdG8gcGFyc2UgYW5kIGdldCB0aGUgZGVzaWduIG9mIHBvdXJhYmxlc1xuICAgICAgICAvLyBzbyByZWFkIHRoZSBmaWxlc1xuICAgICAgICBjb25zdCBwb3VyYWJsZXM6IFBvdXJhYmxlRGVzaWduW10gPSBbXTtcbiAgICAgICAgXy5mb3JFYWNoKGZpbGVuYW1lcywgZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgICAgIC8vIHJlYWQgdGhlIGZpbGUgb2ZmIHRoZSBkaXNrLCBlYWNoIG9iamVjdC9zdWJvYmplY3QgbWF5IG9yIG1heSBub3QgaGF2ZSBhbGwgdGhlIHByb3BlcnRpZXMgb24gdGhlIG9iamVjdFxuICAgICAgICAgICAgY29uc3QgcG91cmFibGVSYXcgPSBKU09ORklMRS5zeW5jKGZpbGUpO1xuXG4gICAgICAgICAgICBjb25zdCBwb3VyYWJsZTogUG91cmFibGVEZXNpZ24gPSBKc1V0aWwubWFwVG9OZXdPYmplY3QocG91cmFibGVSYXcsIG5ldyBQb3VyYWJsZURlc2lnbigpKTtcblxuICAgICAgICAgICAgaWYgKHBvdXJhYmxlUmF3LmRlc2lnbikge1xuICAgICAgICAgICAgICAgIHBvdXJhYmxlLmRlc2lnbiA9IEpzVXRpbC5tYXBUb05ld09iamVjdChwb3VyYWJsZVJhdy5kZXNpZ24sIG5ldyBEZXNpZ25Ob2RlKCkpO1xuICAgICAgICAgICAgICAgIGlmIChwb3VyYWJsZVJhdy5kZXNpZ24uYXNzZXRzKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvdXJhYmxlLmRlc2lnbi5hc3NldHMgPSBKc1V0aWwubWFwVG9OZXdPYmplY3QocG91cmFibGVSYXcuZGVzaWduLmFzc2V0cywgbmV3IERlc2lnbkFzc2V0cygpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBvdXJhYmxlUmF3LmRlc2lnbi5jb2xvcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgcG91cmFibGUuZGVzaWduLmNvbG9ycyA9IEpzVXRpbC5tYXBUb05ld09iamVjdChwb3VyYWJsZVJhdy5kZXNpZ24uY29sb3JzLCBuZXcgRGVzaWduQ29sb3JzKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocG91cmFibGVSYXcuZGVzaWduLnBhcnRpY2xlc0hvbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcG91cmFibGUuZGVzaWduLnBhcnRpY2xlc0hvbWUgPSBKc1V0aWwubWFwVG9OZXdPYmplY3QocG91cmFibGVSYXcuZGVzaWduLnBhcnRpY2xlc0hvbWUsIG5ldyBEZXNpZ25QYXJ0aWNsZXMoKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHBvdXJhYmxlUmF3LmRlc2lnbi5zZWNvbmRhcnlBbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcG91cmFibGUuZGVzaWduLnNlY29uZGFyeUFuaW1hdGlvbiA9IEpzVXRpbC5tYXBUb05ld09iamVjdChcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvdXJhYmxlUmF3LmRlc2lnbi5zZWNvbmRhcnlBbmltYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgRGVzaWduU2Vjb25kYXJ5QW5pbWF0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBvdXJhYmxlUmF3LmRlc2lnbi5zZWNvbmRhcnlBbmltYXRpb25BZGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcG91cmFibGUuZGVzaWduLnNlY29uZGFyeUFuaW1hdGlvbkFkYSA9IEpzVXRpbC5tYXBUb05ld09iamVjdChcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvdXJhYmxlUmF3LmRlc2lnbi5zZWNvbmRhcnlBbmltYXRpb25BZGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgRGVzaWduU2Vjb25kYXJ5QW5pbWF0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocG91cmFibGVSYXcuZGVzaWduLnNlY29uZGFyeUFuaW1hdGlvbl81KSB7XG4gICAgICAgICAgICAgICAgICAgIHBvdXJhYmxlLmRlc2lnbi5zZWNvbmRhcnlBbmltYXRpb25fNSA9IEpzVXRpbC5tYXBUb05ld09iamVjdChcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvdXJhYmxlUmF3LmRlc2lnbi5zZWNvbmRhcnlBbmltYXRpb25fNSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBEZXNpZ25TZWNvbmRhcnlBbmltYXRpb24oKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocG91cmFibGVSYXcuZGVzaWduLnNlY29uZGFyeUFuaW1hdGlvbkFkYV81KSB7XG4gICAgICAgICAgICAgICAgICAgIHBvdXJhYmxlLmRlc2lnbi5zZWNvbmRhcnlBbmltYXRpb25BZGFfNSA9IEpzVXRpbC5tYXBUb05ld09iamVjdChcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvdXJhYmxlUmF3LmRlc2lnbi5zZWNvbmRhcnlBbmltYXRpb25BZGFfNSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBEZXNpZ25TZWNvbmRhcnlBbmltYXRpb24oKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChwb3VyYWJsZVJhdy5kZXNpZ24ucGFydGljbGVzQnJhbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgXy5mb3JFYWNoKHBvdXJhYmxlUmF3LmRlc2lnbi5wYXJ0aWNsZXNCcmFuZCwgZnVuY3Rpb24ocGFydGljbGVCcmFuZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdJdGVtID0gSnNVdGlsLm1hcFRvTmV3T2JqZWN0KHBhcnRpY2xlQnJhbmQsIG5ldyBEZXNpZ25QYXJ0aWNsZXNCcmFuZCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvdXJhYmxlLmRlc2lnbi5wYXJ0aWNsZXNCcmFuZC5wdXNoKG5ld0l0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJz09PT09PT09PT09PT09PicsIGZpbGUsIG5ld0l0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvLyBwb3VyYWJsZS5kZXNpZ24ucGFydGljbGVzSG9tZSA9IEpzVXRpbC5tYXBUb05ld09iamVjdChwb3VyYWJsZVJhdy5kZXNpZ24ucGFydGljbGVzQnJhbmQsIG5ldyBEZXNpZ25QYXJ0aWNsZXNCcmFuZFtdKCldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBvdXJhYmxlUmF3LkNhbG9yaWVDdXBzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhbG9yaWVDdXBzOiBDYWxvcmllQ3VwW10gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgXy5mb3JFYWNoKHBvdXJhYmxlLkNhbG9yaWVDdXBzLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2Fsb3JpZUN1cHMucHVzaChKc1V0aWwubWFwVG9OZXdPYmplY3QoaXRlbSwgbmV3IENhbG9yaWVDdXAoKSkpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBwb3VyYWJsZS5DYWxvcmllQ3VwcyA9IGNhbG9yaWVDdXBzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcG91cmFibGVzLnB1c2gocG91cmFibGUpO1xuICAgICAgICB9KTtcblxuXG4gICAgICAgIHJldHVybiBwb3VyYWJsZXM7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0RGVzaWduQnViYmxlcygpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICBjb25zdCBidWJibGVzX2ZpbGUgPSBKU09ORklMRS5zeW5jKHRoaXMuZmlsZUxvY2F0aW9ucy5kZXNpZ25Gb2xkZXIgKyBcImJ1YmJsZXMuanNvblwiKTtcblxuICAgICAgICByZXR1cm4gYnViYmxlc19maWxlO1xuICAgIH1cblxuICAgIGFzeW5jIGdldERlc2lnbkFuaW1hdGlvbnMoKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuICAgICAgICBjb25zdCBnbG9iID0gcmVxdWlyZSgnZ2xvYicpO1xuXG4gICAgICAgIC8vIGdldCBhbGwganNvbiBmaWxlcyBpbiB0aGUgY29uc3VtZXIgdWkgcG91cmFibGVzIGZvbGRlclxuICAgICAgICBjb25zdCBmaWxlbmFtZXMgPSBnbG9iLnN5bmModGhpcy5maWxlTG9jYXRpb25zLmRlc2lnbkZvbGRlciArIFwiYW5pbWF0aW9ucy8qKi8qLmpzb25cIik7XG5cbiAgICAgICAgY29uc3QgYW5pbWF0aW9uc0FycmF5OiBEZXNpZ25BbmltYXRpb25bXSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgZmlsZW5hbWUgb2YgZmlsZW5hbWVzKSB7XG4gICAgICAgICAgICBjb25zdCBjb250ZW50cyA9IEpTT05GSUxFLnN5bmMoZmlsZW5hbWUpO1xuXG4gICAgICAgICAgICBhbmltYXRpb25zQXJyYXkucHVzaChKc1V0aWwubWFwVG9OZXdPYmplY3QoY29udGVudHMsIG5ldyBEZXNpZ25BbmltYXRpb24oKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFuaW1hdGlvbnNBcnJheTtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRJZGxlU3RhdGUoKTogUHJvbWlzZTxJZGxlU3RhdGU+IHtcblxuICAgICAgICAvLyBUb0RvOiBzaG91bGQgYmUgYSBzZWVkIGZpbGUgb2JqZWN0XG4gICAgICAgIGNvbnN0IGlkbGVTdGF0ZVJhdyA9IEpTT05GSUxFLnN5bmModGhpcy5maWxlTG9jYXRpb25zLmlkbGVTdGF0ZSk7XG5cbiAgICAgICAgY29uc3QgaWRsZXN0YXRlID0gSnNVdGlsLm1hcFRvTmV3T2JqZWN0KGlkbGVTdGF0ZVJhdywgbmV3IElkbGVTdGF0ZSgpKTtcbiAgICAgICAgY29uc3QgdmlkZW9pdGVtczogUmVzb3VyY2VJdGVtW10gPSBbXTtcblxuICAgICAgICBpZiAoaWRsZVN0YXRlUmF3LnZpZGVvcykge1xuICAgICAgICAgICAgZm9yIChsZXQgdmlkZW8gb2YgaWRsZVN0YXRlUmF3LnZpZGVvcykge1xuICAgICAgICAgICAgICAgIGxldCB2aWRlb2l0ZW0gPSBKc1V0aWwubWFwVG9OZXdPYmplY3QodmlkZW8sIG5ldyBSZXNvdXJjZUl0ZW0oKSk7XG5cbiAgICAgICAgICAgICAgICB2aWRlb2l0ZW1zLnB1c2godmlkZW9pdGVtKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWRsZXN0YXRlLnZpZGVvcyA9IHZpZGVvaXRlbXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaWRsZXN0YXRlO1xuICAgIH1cblxuICAgIGFzeW5jIGdldERldmljZUluZm9Vbml0U3RhdGUoKTogUHJvbWlzZTxVbml0U3RhdGU+IHtcbiAgICAgICAgY29uc3QgdW5pdFN0YXRlID0gSlNPTkZJTEUuc3luYyh0aGlzLmZpbGVMb2NhdGlvbnMudW5pdFN0YXRlKTtcbiAgICAgICAgcmV0dXJuIHVuaXRTdGF0ZTtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRPdmVycmlkZXMoKTogUHJvbWlzZTxPdmVycmlkZU9wdGlvbnM+IHtcbiAgICAgICAgY29uc3Qgb3ZlcnJpZGVzID0gSlNPTkZJTEUuc3luYyh0aGlzLmZpbGVMb2NhdGlvbnMub3ZlcnJpZGVTdGF0ZSk7XG4gICAgICAgIHJldHVybiBvdmVycmlkZXM7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0Q2Fsb3JpZUNvdW50U3RhdGUoKTogUHJvbWlzZTxDYWxvcmllQ291bnRTdGF0ZT4ge1xuICAgICAgICBjb25zdCBjYWxvcmllQ291bnRTdGF0ZSA9IEpTT05GSUxFLnN5bmModGhpcy5maWxlTG9jYXRpb25zLmNhbG9yaWVDb3VudFN0YXRlKTtcbiAgICAgICAgcmV0dXJuIGNhbG9yaWVDb3VudFN0YXRlO1xuICAgIH1cblxuICAgIGdldExvY2FsaXphdGlvbkZvckNvbnN1bWVyVUkoKTogYW55IHtcbiAgICAgICAgY29uc3QgY29uc3VtZXJVSUxvY2FsaXphdGlvbk1vZGVsID0gbmV3IENvbnN1bWVyVUlMb2NhbGl6YXRpb25Nb2RlbCgpO1xuXG4gICAgICAgIGlmIChEZXZpY2VJbmZvLnVuaXRTdGF0ZS5QcmltYXJ5Q29uc3VtZXJMYW5ndWFnZSA9PSBcIm5vbmVcIikge1xuICAgICAgICAgICAgY29uc3VtZXJVSUxvY2FsaXphdGlvbk1vZGVsLnByaW1hcnlMb2NhbGl6YXRpb24gPSB0aGlzLmdldExvY2FsaXphdGlvblJlc291cmNlc0ZvckNvbnN1bWVyVUkoXCJlbi11c1wiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN1bWVyVUlMb2NhbGl6YXRpb25Nb2RlbC5wcmltYXJ5TG9jYWxpemF0aW9uID0gdGhpcy5nZXRMb2NhbGl6YXRpb25SZXNvdXJjZXNGb3JDb25zdW1lclVJKERldmljZUluZm8udW5pdFN0YXRlLlByaW1hcnlDb25zdW1lckxhbmd1YWdlKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tc2Vjb25kYXJ5XCIsIERldmljZUluZm8udW5pdFN0YXRlLlNlY29uZGFyeUNvbnN1bWVyTGFuZ3VhZ2UsIERldmljZUluZm8udW5pdFN0YXRlKTtcbiAgICAgICAgaWYgKERldmljZUluZm8udW5pdFN0YXRlLlNlY29uZGFyeUNvbnN1bWVyTGFuZ3VhZ2UgPT0gXCJub25lXCIpIHtcbiAgICAgICAgICAgIGNvbnN1bWVyVUlMb2NhbGl6YXRpb25Nb2RlbC5zZWNvbmRhcnlMb2NhbGl6YXRpb24gPSB0aGlzLmdldExvY2FsaXphdGlvblJlc291cmNlc0ZvckNvbnN1bWVyVUkoXCJlcy1teFwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN1bWVyVUlMb2NhbGl6YXRpb25Nb2RlbC5zZWNvbmRhcnlMb2NhbGl6YXRpb24gPSB0aGlzLmdldExvY2FsaXphdGlvblJlc291cmNlc0ZvckNvbnN1bWVyVUkoRGV2aWNlSW5mby51bml0U3RhdGUuU2Vjb25kYXJ5Q29uc3VtZXJMYW5ndWFnZSk7XG4gICAgICAgICAgICBjb25zdW1lclVJTG9jYWxpemF0aW9uTW9kZWwuc2Vjb25kYXJ5TG9jYWxpemF0aW9uLlJlc291cmNlU3RyaW5nc1tcImhvbWUuc2Vjb25kYXJ5Lmxhbmd1YWdlXCJdID1cbiAgICAgICAgICAgICAgICBjb25zdW1lclVJTG9jYWxpemF0aW9uTW9kZWwucHJpbWFyeUxvY2FsaXphdGlvbi5SZXNvdXJjZVN0cmluZ3NbXCJob21lLnBvdXIubGFuZ3VhZ2UudGl0bGVcIl07XG5cbiAgICAgICAgICAgIGNvbnN1bWVyVUlMb2NhbGl6YXRpb25Nb2RlbC5wcmltYXJ5TG9jYWxpemF0aW9uLlJlc291cmNlU3RyaW5nc1tcImhvbWUuc2Vjb25kYXJ5Lmxhbmd1YWdlXCJdID1cbiAgICAgICAgICAgICAgICBjb25zdW1lclVJTG9jYWxpemF0aW9uTW9kZWwuc2Vjb25kYXJ5TG9jYWxpemF0aW9uLlJlc291cmNlU3RyaW5nc1tcImhvbWUucG91ci5sYW5ndWFnZS50aXRsZVwiXTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy8gVG9EbzogRml4IHRoZSBjaGVhdCBBUkdIXG4gICAgICAgIC8vIGNvbnN1bWVyVUlMb2NhbGl6YXRpb25Nb2RlbC5zZWNvbmRhcnlMb2NhbGl6YXRpb24gPSB0aGlzLmdldExvY2FsaXphdGlvblJlc291cmNlc0ZvckNvbnN1bWVyVUkoRGV2aWNlSW5mby51bml0U3RhdGUuX3NlY29uZGFyeUNvbnN1bWVyTGFuZ3VhZ2UpO1xuICAgICAgICBjb25zdW1lclVJTG9jYWxpemF0aW9uTW9kZWwuc2Vjb25kYXJ5TG9jYWxpemF0aW9uLlJlc291cmNlU3RyaW5nc1tcImhvbWUuc2Vjb25kYXJ5Lmxhbmd1YWdlXCJdID1cbiAgICAgICAgICAgIGNvbnN1bWVyVUlMb2NhbGl6YXRpb25Nb2RlbC5wcmltYXJ5TG9jYWxpemF0aW9uLlJlc291cmNlU3RyaW5nc1tcImhvbWUucG91ci5sYW5ndWFnZS50aXRsZVwiXTtcblxuICAgICAgICBjb25zdW1lclVJTG9jYWxpemF0aW9uTW9kZWwucHJpbWFyeUxvY2FsaXphdGlvbi5SZXNvdXJjZVN0cmluZ3NbXCJob21lLnNlY29uZGFyeS5sYW5ndWFnZVwiXSA9XG4gICAgICAgICAgICBjb25zdW1lclVJTG9jYWxpemF0aW9uTW9kZWwuc2Vjb25kYXJ5TG9jYWxpemF0aW9uLlJlc291cmNlU3RyaW5nc1tcImhvbWUucG91ci5sYW5ndWFnZS50aXRsZVwiXTtcblxuICAgICAgICByZXR1cm4gY29uc3VtZXJVSUxvY2FsaXphdGlvbk1vZGVsO1xuICAgIH1cblxuICAgIGdldExvY2FsaXphdGlvblJlc291cmNlc0ZvckNvbnN1bWVyVUkoY291bnRyeUxhbmd1YWdlQ29kZTogc3RyaW5nKTogTG9jYWxpemF0aW9uUmVzb3VyY2VNb2RlbCB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBsb2NhbGl6YXRpb25GaWxlUGF0aCA9IFBBVEguam9pbih0aGlzLmFwcEluZm8uY29uZmlnRGlyX0FwcCwgXCJMb2NhbGl6YXRpb25cIiwgXCJjb25zdW1lcnVpLlwiICsgY291bnRyeUxhbmd1YWdlQ29kZSArIFwiLmpzb25cIik7XG4gICAgICAgICAgICByZXR1cm4gSlNPTkZJTEUuc3luYyhsb2NhbGl6YXRpb25GaWxlUGF0aCk7XG4gICAgICAgIH0gY2F0Y2ggKEV4Y2VwdGlvbikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciByZWFkaW5nIENvbnN1bWVyVUkgTG9jYWxpemF0aW9uIGZvciBDb3VudHJ5OiBcIiwgY291bnRyeUxhbmd1YWdlQ29kZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBMb2NhbGl6YXRpb25SZXNvdXJjZU1vZGVsKCk7XG4gICAgfVxufVxuIl19
