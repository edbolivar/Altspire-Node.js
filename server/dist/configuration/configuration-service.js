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
var app_types_1 = require("../universal/app.types");
var app_info_service_1 = require("../services/app-info.service");
var inversify_1 = require("inversify");
var JsUtil_1 = require("../universal/JsUtil");
var device_info_1 = require("../unitstate/device-info");
var product_data_service_1 = require("./product-data-service");
var configuration_repository_1 = require("./configuration-repository");
var JSONFILE = require("load-json-file");
var _ = require("lodash");
var valve_assignment_repository_1 = require("./valve-assignment-repository");
var server_types_1 = require("../server.types");
var SHORTID = require("shortid");
var PATH = require("path");
var ConfigurationService = /** @class */ (function () {
    // UnitType: UnitTypes;
    function ConfigurationService(appInfo, valveAssignmentRepository, configurationRepository, productDataService) {
        this.appInfo = appInfo;
        this.valveAssignmentRepository = valveAssignmentRepository;
        this.configurationRepository = configurationRepository;
        this.productDataService = productDataService;
        this.pourItems = new app_types_1.PourItemModel();
        this.valveAssignments = new app_types_1.ValveAssignment();
        this.dctPourButtonModelsByPourId = {};
        this.objectId = JsUtil_1.JsUtil.getObjectId();
        console.log("ctor.ConfigurationService", this.objectId);
        this.loadData();
    }
    ConfigurationService.prototype.getPocVisuals = function () {
        // temporary anyway, ok to not put in configurationRepository
        var fileName = PATH.join(this.appInfo.configDir_App, "pocvisuals.json");
        return JSONFILE.sync(fileName);
    };
    ConfigurationService.prototype.afterPropertiesSet = function () {
        this.loadData();
        this.actionPermissions = this.configurationRepository.getPermissions(4);
    };
    ConfigurationService.prototype.reset = function () {
        this.productDataService.reset();
        // this.localizationService.reset();
        this.loadData();
    };
    ConfigurationService.prototype.resetActionPermissions = function () {
        this.actionPermissions = this.configurationRepository.getPermissions(4);
    };
    // TODO add registrations?
    ConfigurationService.prototype.loadData = function () {
        this.loadValveAssignments();
    };
    ConfigurationService.prototype.getAvailableButtons = function (allButtons) {
        var availableButtons = [];
        for (var _i = 0, allButtons_1 = allButtons; _i < allButtons_1.length; _i++) {
            var item = allButtons_1[_i];
            if (this.isSupportedOnUnitType(item)) {
                availableButtons.push(item);
            }
        }
        return availableButtons;
    };
    ConfigurationService.prototype.isSupportedOnUnitType = function (button) {
        // TODO no idea how to solve this issue
        // this.unitType is one value, it needs to look into the MANY coming in on the button
        // the following is wrong at this point
        return this.unitType === button.UnitTypes;
    };
    ConfigurationService.prototype.getAvailableCuratedMixes = function () {
        var recipesAsButtonModel = [];
        var recipes = this.productDataService.getDispensableRecipesForCuratedMixes(this.valveAssignments);
        for (var _i = 0, recipes_1 = recipes; _i < recipes_1.length; _i++) {
            var recipe = recipes_1[_i];
            var buttonModel = this.convertRecipeToButtonModel(recipe);
            buttonModel.ActionId = "available.curated.mix";
            recipesAsButtonModel.push(buttonModel);
        }
        return recipesAsButtonModel;
    };
    // TODO finish
    ConfigurationService.prototype.getActionPanelButtons = function () {
        var buttonlist = this.hasPermissions(this.getAvailableButtons(this.serviceUI.ActionPanel));
        // TODO ApplicationEx.PubSub.GetEvent
        return buttonlist;
    };
    // TODO finish
    ConfigurationService.prototype.getSystemPanelButtons = function () {
        var buttonlist = this.hasPermissions(this.getAvailableButtons(this.serviceUI.SystemPanel));
        // TODO ApplicationEx.PubSub.GetEvent
        return buttonlist;
    };
    ConfigurationService.prototype.getServiceLanguages = function () {
        for (var _i = 0, _a = this.serviceUIPopupButtons.ServiceLanguages; _i < _a.length; _i++) {
            var button = _a[_i];
            button.IsSelected = (button.Id == device_info_1.DeviceInfo.unitState.CountryLanguageCode);
        }
        return this.serviceUIPopupButtons.ServiceLanguages;
    };
    // TODO this method in the c# code looks incomplete, is this being imported or discarded?
    ConfigurationService.prototype.getButtonsForConsumerUI = function () {
        var result = [];
        for (var _i = 0, _a = _.filter(this.valveAssignments.Assignments, function (list) {
            return list.IsAssigned;
        }); _i < _a.length; _i++) {
            var valve = _a[_i];
            var bibItem = valve.BibItemAsButtonModel.payload;
            var buttonModel = JsUtil_1.JsUtil.mapToNewObject({
                Id: bibItem.Name,
                Label: bibItem.Name,
                RecipeId: "",
            }, new app_types_1.ButtonModel());
        }
        return result;
    };
    ConfigurationService.prototype.getClearSelectionTimeoutButtons = function () {
        return this.serviceUIPopupButtons.ConfigureSelectionTimeout;
    };
    ConfigurationService.prototype.getUIData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var uiVisualsModel, recipes, curatedMixState, brands, _loop_1, this_1, _i, recipes_2, recipe;
            return __generator(this, function (_a) {
                uiVisualsModel = this.productDataService.getDriveThruData();
                uiVisualsModel.brands = [];
                uiVisualsModel.waters = [];
                uiVisualsModel.flavors = [];
                uiVisualsModel.curatedMixes = [];
                recipes = this.productDataService.getDispensableRecipes(this.valveAssignments);
                curatedMixState = this.getCuratedMixologyState2();
                brands = [];
                _loop_1 = function (recipe) {
                    var buttonModel = this_1.convertRecipeToButtonModel(recipe);
                    if (recipe.Type === app_types_1.RecipeType.Beverage) {
                        buttonModel.ButtonType = app_types_1.ButtonType.brand;
                        brands.push(buttonModel);
                    }
                    else if (recipe.Type === app_types_1.RecipeType.Water) {
                        buttonModel.ButtonType = app_types_1.ButtonType.water;
                        uiVisualsModel.waters.push(buttonModel);
                    }
                    else if (recipe.Type === app_types_1.RecipeType.Mix) {
                        var found = _.find(curatedMixState, function (setCuratedMixItem) {
                            return setCuratedMixItem.RecipeId === recipe.Id;
                        });
                        if (!found) {
                            return "continue";
                        }
                        buttonModel.ButtonType = app_types_1.ButtonType.mix;
                        if (buttonModel.payload.areAnyValvesLockedInRecipe) {
                            buttonModel.IsDisabled = true;
                        }
                        uiVisualsModel.curatedMixes.push(buttonModel);
                    }
                    else {
                        console.log("Unknown RecipeType: " + recipe.Name + " " + recipe.Type + " " + recipe.Id);
                    }
                    uiVisualsModel.brands = _.orderBy(brands, ['weighting'], ['asc']);
                    uiVisualsModel.flavors = this_1.getFlavorsForConsumerUI();
                    uiVisualsModel.topCombinations = this_1.getTopCombinationState(false, uiVisualsModel.flavors);
                };
                this_1 = this;
                for (_i = 0, recipes_2 = recipes; _i < recipes_2.length; _i++) {
                    recipe = recipes_2[_i];
                    _loop_1(recipe);
                }
                return [2 /*return*/, uiVisualsModel];
            });
        });
    };
    ConfigurationService.prototype.removeAssignedBibItemsFromList = function (availableBibItems, incomingValveButton) {
        var dctSkuList = this.productDataService.getSkuList();
        var valveAssignmentState = incomingValveButton.payload;
        var assignedValves = _.filter(this.valveAssignments.Assignments, function (item) {
            return item.isAssigned;
        });
        var _loop_2 = function (bibItem) {
            var bibItemModel = bibItem.payload;
            if (_.find(assignedValves, function (item) {
                return item.SKU == bibItemModel.SKU;
            })) {
                if (incomingValveButton.payload.SKU != bibItem.Id) {
                    if (bibItemModel.Type == app_types_1.BibItemType.syrup) {
                        var skuList = dctSkuList[bibItemModel.SKU];
                        var _loop_3 = function (sku) {
                            var item = _.find(availableBibItems, function (item) {
                                return item.payload.SKU == sku;
                            });
                            if (item != null) {
                                _.remove(availableBibItems, function (xitem) {
                                    return xitem.Id == item.Id;
                                });
                            }
                        };
                        for (var _i = 0, skuList_1 = skuList; _i < skuList_1.length; _i++) {
                            var sku = skuList_1[_i];
                            _loop_3(sku);
                        }
                    }
                    else {
                        _.remove(availableBibItems, function (item) {
                            return item.Id == bibItem.Id;
                        });
                    }
                }
            }
        };
        for (var _i = 0, availableBibItems_1 = availableBibItems; _i < availableBibItems_1.length; _i++) {
            var bibItem = availableBibItems_1[_i];
            _loop_2(bibItem);
        }
    };
    ConfigurationService.prototype.hasPermission = function (actionId) {
        if (_.find(this.actionPermissions, function (item) {
            return item.ActionId == actionId;
        })) {
            return true;
        }
        return false;
    };
    ConfigurationService.prototype.hasPermissions = function (allButtons) {
        var allowedButtons = [];
        var _loop_4 = function (item) {
            if (_.find(allowedButtons, function (buttonItem) {
                return buttonItem.Id == item.Id;
            })) {
                allowedButtons.push(item);
            }
        };
        for (var _i = 0, allButtons_2 = allButtons; _i < allButtons_2.length; _i++) {
            var item = allButtons_2[_i];
            _loop_4(item);
        }
        return allowedButtons;
    };
    ConfigurationService.prototype.getFlavorsForConsumerUI = function () {
        var valvesWithFlavors = _.filter(this.valveAssignments.Assignments, function (item) {
            if (!item.isAssigned) {
                return false;
            }
            item.BibItemAsButtonModel.payload == JsUtil_1.JsUtil.mapToNewObject(item.BibItemAsButtonModel.payload, new app_types_1.BibItemModel());
            return item.isAssigned && (item.BibItemAsButtonModel.payload.Type == app_types_1.BibItemType.flavorshot);
        });
        var flavorButtons = [];
        for (var _i = 0, valvesWithFlavors_1 = valvesWithFlavors; _i < valvesWithFlavors_1.length; _i++) {
            var valveAssignment = valvesWithFlavors_1[_i];
            var bibItem = new app_types_1.BibItemModel();
            bibItem = valveAssignment.BibItemAsButtonModel.payload;
            var recipe = JsUtil_1.JsUtil.mapToNewObject({
                Type: app_types_1.RecipeType.Flavor,
                Id: bibItem.Name,
                Name: bibItem.Name,
                BeverageId: bibItem.AltName
            }, new app_types_1.RecipeItemModel());
            var newSkuMapping = new app_types_1.SkuToValveMapping(valveAssignment.SKU, valveAssignment);
            recipe.SkuToValveMappings.push(newSkuMapping);
            var buttonModel = JsUtil_1.JsUtil.mapToNewObject({
                Id: valveAssignment.BibItemAsButtonModel.Id,
                Label: valveAssignment.BibItemAsButtonModel.Label,
                PathToImage: valveAssignment.BibItemAsButtonModel.PathToImage,
                BackgroundColor: valveAssignment.BibItemAsButtonModel.BackgroundColor,
                payload: recipe,
                ButtonType: app_types_1.ButtonType.flavor,
            }, new app_types_1.ButtonModel());
            if (recipe.areAnyValvesLockedInRecipe()) {
                console.log("A valve is locked. " + recipe.Name + " will not be dispensable");
                buttonModel.IsDisabled = true;
            }
            flavorButtons.push(buttonModel);
        }
        if (flavorButtons.length === 0) {
            console.log("There are no flavors configured on valves, so no flavors are available to UI");
        }
        return flavorButtons;
    };
    ConfigurationService.prototype.getBibItemTypes = function () {
        // TODO deselect each item
        return this.serviceUIPopupButtons.BibItemTypes;
    };
    // TODO implement; this uses GetEvent
    ConfigurationService.prototype.registerButtonListLocalization = function (topic, obj) {
        return;
    };
    ConfigurationService.prototype.dumpValveAssignments = function (headerMsg) {
        console.log("----- Valve Assignments: ", headerMsg);
    };
    ConfigurationService.prototype.getTopCombinationState = function (isForConfiguration, flavors) {
        var topCombinations = [];
        var topCombinationsRaw = this.configurationRepository.getTopCombinationState();
        var dispensableRecipes = this.productDataService.getDispensableRecipes(this.valveAssignments);
        var _loop_5 = function (combination) {
            combination.ButtonType = app_types_1.ButtonType.topCombination;
            combination.IsSelected = false;
            var recipe = _.find(dispensableRecipes, function (item) {
                return item.Id === combination.Id;
            });
            if (recipe == null && (combination.Label === "" || combination.Label === undefined) && !isForConfiguration) {
                console.log("Combination button is NOT configured: " + combination.Id + " Removing Combination Button");
                return "continue";
            }
            else {
                combination.payload = recipe;
                topCombinations.push(combination);
            }
            if (recipe != null && recipe.areAnyValvesLockedInRecipe()) {
                console.log("A valve is locked. " + recipe.Name + " will not be dispensable.");
                combination.IsDisabled = true;
            }
            var _loop_6 = function (flavor) {
                var availableFlavorOnValves = _.find(flavors, function (item) {
                    return item.Id == flavor.Id;
                });
                if (availableFlavorOnValves != null) {
                    flavor.payload = availableFlavorOnValves.payload;
                    var flavorrecipe = flavor.payload;
                    if (flavorrecipe.areAnyValvesLockedInRecipe()) {
                        console.log("A valve is locked. " + flavorrecipe.Name + " will not be dispensable.");
                        combination.IsDisabled = true;
                    }
                }
                else {
                    combination.IsDisabled;
                }
            };
            for (var _i = 0, _a = combination.ButtonModelList; _i < _a.length; _i++) {
                var flavor = _a[_i];
                _loop_6(flavor);
            }
            if (combination.IsDisabled) {
                var disabledButtonModels = [];
                for (var _b = 0, _c = combination.ButtonModelList; _b < _c.length; _b++) {
                    var button = _c[_b];
                    button.IsDisabled = true;
                    disabledButtonModels.push(button);
                }
                combination.ButtonModelList = disabledButtonModels;
            }
        };
        for (var _i = 0, topCombinationsRaw_1 = topCombinationsRaw; _i < topCombinationsRaw_1.length; _i++) {
            var combination = topCombinationsRaw_1[_i];
            _loop_5(combination);
        }
        return topCombinations;
    };
    ConfigurationService.prototype.writeTopCombinationState = function (combinations) {
        console.log("---- Writing TopCombination State ----");
        this.configurationRepository.writeTopCombinationState(combinations);
    };
    ConfigurationService.prototype.resetTopCombinations = function () {
        this.configurationRepository.resetTopCombinationState();
    };
    ConfigurationService.prototype.getCuratedMixologyState = function () {
        this.mixes = this.configurationRepository.getMixologyState();
        for (var _i = 0, _a = this.mixes; _i < _a.length; _i++) {
            var buttonModel = _a[_i];
            buttonModel.payload = this.productDataService.getRecipe(buttonModel.Id);
        }
        return this.mixes;
    };
    ConfigurationService.prototype.getCuratedMixologyState2 = function () {
        var setCuratedItemRaw = this.configurationRepository.getMixologyState2();
        var result = [];
        var self = this;
        _.forEach(setCuratedItemRaw, function (item) {
            result.push(JsUtil_1.JsUtil.mapToNewObject(item, new app_types_1.SetCuratedMixItem()));
        });
        return result;
    };
    ConfigurationService.prototype.writeMixologyState = function (mixes) {
        this.mixes = mixes;
        this.configurationRepository.writeMixologyState(mixes);
    };
    ConfigurationService.prototype.resetMixology = function () {
        this.configurationRepository.resetMixologyState();
    };
    ConfigurationService.prototype.loadValveAssignments = function () {
        // BibItem  - SKU; a syrup in a bag that's in a box; gets attached to a valve
        var bibitems = this.productDataService.getBibItems();
        // get current valve Assignments here
        var valveAssignmentsRaw = this.valveAssignmentRepository.getCurrentValveAssignments();
        // TEST
        this.valveAssignments = JsUtil_1.JsUtil.mapToNewObject(valveAssignmentsRaw, new app_types_1.ValveAssignment());
        var assignmentStates = this.valveAssignments.Assignments;
        this.valveAssignments.Assignments = [];
        for (var _i = 0, assignmentStates_1 = assignmentStates; _i < assignmentStates_1.length; _i++) {
            var assignment = assignmentStates_1[_i];
            this.valveAssignments.Assignments.push(JsUtil_1.JsUtil.mapToNewObject(assignment, new app_types_1.ValveAssignmentState()));
        }
        var assignedValves = _.filter(this.valveAssignments.Assignments, function (item) {
            return item.SKU && item.SKU !== '';
        });
        var _loop_7 = function (valveAssignment) {
            valveAssignment.BibItemAsButtonModel = _.find(bibitems.AllTypes, function (item) {
                return item.Id === valveAssignment.SKU;
            });
            if (valveAssignment.BibItemAsButtonModel === null) {
                console.log("=====BibItem not found for valve Assignment {0}, SKU: {1}", valveAssignment.ValveId, valveAssignment.SKU);
            }
        };
        for (var _a = 0, assignedValves_1 = assignedValves; _a < assignedValves_1.length; _a++) {
            var valveAssignment = assignedValves_1[_a];
            _loop_7(valveAssignment);
        }
        // does DeviceInfo.State.UnitType refer to the default UnitType? or something different?
        var unitconfig = this.valveAssignmentRepository.getConfigurationById("DriveThru");
        var _loop_8 = function (valveAssignment) {
            // TODO get AllValveLabelPairs
            valveAssignment.ValveLabelPair = _.find(unitconfig.AllValveLabelPairs, function (item) {
                return item.valveLabel === valveAssignment.ValveId;
            });
            if (valveAssignment.ValveLabelPair === null) {
                console.log("valve not found for ValveAssignment, valve:", valveAssignment.ValveId);
            }
        };
        for (var _b = 0, _c = this.valveAssignments.Assignments; _b < _c.length; _b++) {
            var valveAssignment = _c[_b];
            _loop_8(valveAssignment);
        }
    };
    ConfigurationService.prototype.getCurrentValveAssignmentsAsButtonModels = function () {
        var waterIds = ['0111', '0222', '0333', '0444'];
        var currentValveAssignmentsAsButtonModels = [];
        var configForThisUnit = this.valveAssignmentRepository.getConfigurationById(device_info_1.DeviceInfo.unitState.UnitType);
        for (var _i = 0, _a = configForThisUnit.ValveLayout; _i < _a.length; _i++) {
            var valveAssignmentRow = _a[_i];
            var _loop_9 = function (valve) {
                var buttonModel = _.find(this_2.valveAssignmentButtonModels, function (item) {
                    return item.key == valve.Row;
                });
                if (buttonModel == null) {
                    buttonModel = new app_types_1.ButtonModel();
                    this_2.valveAssignmentButtonModels[valve.Row] = buttonModel;
                }
                //buttonModel.ButtonType = ButtonType.ValveButton
                //buttonModel.ButtonBehavior
                buttonModel.ActionId = "popup.valve.assignment";
                //buttonModel.FooterText = valve.GetLabel
                buttonModel.Weighting = valve.Weighting;
                buttonModel.BackgroundColor = "White";
                buttonModel.RowNumber = valve.Row;
                var valveAssignmentState = _.find(this_2.valveAssignments.Assignments, function (item) {
                    return item.ValveId == valve.valveLabel;
                });
                if (valveAssignmentState == null) {
                    valveAssignmentState = new app_types_1.ValveAssignmentState();
                    valveAssignmentState.ValveId = valve.valveLabel;
                    valveAssignmentState.ValveLabelPair = valve;
                    this_2.valveAssignments.Assignments.push(valveAssignmentState);
                }
                buttonModel.payload = valveAssignmentState;
                if (valveAssignmentState.SKU === "" || valveAssignmentState.SKU === null) {
                    buttonModel.Label = "UnAssigned";
                    buttonModel.ResourceId = "not_in_use_id";
                }
                else {
                    buttonModel.Label = valveAssignmentState.BibItemAsButtonModel.Label;
                    if (waterIds.indexOf(valveAssignmentState.BibItemAsButtonModel.Id)) {
                        buttonModel.PathToImage = "";
                        switch (valveAssignmentState.BibItemAsButtonModel.Id) {
                            case "0111": {
                                buttonModel.ResourceId = "high_carb_id";
                                break;
                            }
                            case "0222": {
                                buttonModel.ResourceId = "high_still_id";
                                break;
                            }
                            case "0333": {
                                buttonModel.ResourceId = "low_carb_id";
                                break;
                            }
                            case "0444": {
                                buttonModel.ResourceId = "low_still_id";
                                break;
                            }
                        }
                    }
                    else {
                        buttonModel.BackgroundColor = valveAssignmentState.BibItemAsButtonModel.PathToImage;
                    }
                    buttonModel.BackgroundColor = valveAssignmentState.BibItemAsButtonModel.BackgroundColor;
                }
                currentValveAssignmentsAsButtonModels.push(buttonModel);
            };
            var this_2 = this;
            for (var _b = 0, _c = valveAssignmentRow.ValveLabelPair; _b < _c.length; _b++) {
                var valve = _c[_b];
                _loop_9(valve);
            }
        }
        // TODO implement
        this.verifyValveAssignmentState(configForThisUnit);
        var sortedValveAssignments = _.orderby(currentValveAssignmentsAsButtonModels, ['Weighting'], ['asc']);
        // TODO implement
        //this.registerButtonListLocalization("valveAssignments", sortedValveAssignments);
        return sortedValveAssignments;
    };
    // TODO test
    ConfigurationService.prototype.verifyCuratedMixState = function (valveState, newSku) {
        if (this.isReassignedValveAnEquivalentSku(valveState, newSku)) {
            return;
        }
        var curatedButtonsToRemove = [];
        var configuratedCuratedButtons = this.getCuratedMixologyState();
        var configuratedCuratedButtonsWithPayload = _.filter(configuratedCuratedButtons, function (item) {
            return item.payload !== null;
        });
        var _loop_10 = function (buttonModel) {
            var skuToValveMappingsAggregated = [];
            var recipe = buttonModel.payload;
            skuToValveMappingsAggregated.concat(recipe.SkuToValveMappings);
            for (var _i = 0, skuToValveMappingsAggregated_1 = skuToValveMappingsAggregated; _i < skuToValveMappingsAggregated_1.length; _i++) {
                var skuToValveMapping = skuToValveMappingsAggregated_1[_i];
                if (skuToValveMapping.valveAssignmentState == valveState) {
                    if (!_.find(curatedButtonsToRemove, function (item) {
                        return item == buttonModel;
                    })) {
                        curatedButtonsToRemove.push(buttonModel);
                    }
                    break;
                }
            }
        };
        for (var _i = 0, configuratedCuratedButtonsWithPayload_1 = configuratedCuratedButtonsWithPayload; _i < configuratedCuratedButtonsWithPayload_1.length; _i++) {
            var buttonModel = configuratedCuratedButtonsWithPayload_1[_i];
            _loop_10(buttonModel);
        }
        if (curatedButtonsToRemove.length > 0) {
            var buttonModelsFromSeed = this.configurationRepository.getCuratedMixSeed();
            for (var _a = 0, curatedButtonsToRemove_1 = curatedButtonsToRemove; _a < curatedButtonsToRemove_1.length; _a++) {
                var button = curatedButtonsToRemove_1[_a];
                var index = configuratedCuratedButtons.indexOf(button);
                configuratedCuratedButtons[index] = buttonModelsFromSeed[index];
            }
            this.writeMixologyState(configuratedCuratedButtons);
        }
    };
    // TODO finish
    ConfigurationService.prototype.isReassignedValveAnEquivalentSku = function (valveState, newSku) {
        if (newSku !== null && newSku !== "" && valveState.SKU !== null && valveState.SKU !== "") {
            var skuList = [];
            // this.productDataService.getSkuList().TryGetValue(valveState.SKU, out skuList);
            if (skuList != null && _.find(skuList, function (item) {
                return item == newSku;
            })) {
                return true;
            }
        }
        return false;
    };
    ConfigurationService.prototype.verifyTopCombinationState = function (valveState, newSku) {
        if (this.isReassignedValveAnEquivalentSku(valveState, newSku)) {
            return;
        }
        var combinationsToRemove = [];
        var combinationButtons = this.getTopCombinationState(true, this.getFlavorsForConsumerUI());
        var combinationButtonsWithPayload = _.filter(combinationButtons, function (item) {
            return item === item.payload !== null;
        });
        var _loop_11 = function (buttonModel) {
            var skuToValveMappingsAggregated = [];
            var recipe = buttonModel.payload;
            skuToValveMappingsAggregated.concat(recipe.SkuToValveMappings);
            for (var _i = 0, _a = buttonModel.ButtonModelList; _i < _a.length; _i++) {
                var flavorButton = _a[_i];
                recipe = flavorButton.payload;
                if (recipe !== null) {
                    skuToValveMappingsAggregated.concat(recipe.SkuToValveMappings);
                }
                else {
                    // console.log("Valve UnAssignment is incorrect with respect to verifying TopCombination");
                }
            }
            for (var _b = 0, skuToValveMappingsAggregated_2 = skuToValveMappingsAggregated; _b < skuToValveMappingsAggregated_2.length; _b++) {
                var skuToValveMapping = skuToValveMappingsAggregated_2[_b];
                if (skuToValveMapping.valveAssignmentState == valveState) {
                    if (!_.find(combinationsToRemove, function (item) {
                        return item == buttonModel;
                    })) {
                        combinationsToRemove.push(buttonModel);
                    }
                    break;
                }
            }
        };
        for (var _i = 0, combinationButtonsWithPayload_1 = combinationButtonsWithPayload; _i < combinationButtonsWithPayload_1.length; _i++) {
            var buttonModel = combinationButtonsWithPayload_1[_i];
            _loop_11(buttonModel);
        }
        if (combinationsToRemove.length > 0) {
            var buttonModelsFromSeed = this.configurationRepository.getTopCombinationSeed();
            for (var _a = 0, combinationsToRemove_1 = combinationsToRemove; _a < combinationsToRemove_1.length; _a++) {
                var button = combinationsToRemove_1[_a];
                var index = combinationButtons.indexOf(button);
                combinationButtons[index] = buttonModelsFromSeed[index];
            }
            this.writeTopCombinationState(combinationButtons);
        }
    };
    // TODO test
    ConfigurationService.prototype.verifyValveAssignmentState = function (unitConfig) {
        var anyBad = false;
        var _loop_12 = function (valveAssignment) {
            var unitValve = _.find(unitConfig.AllValveLabelPairs, function (item) {
                return item.valveLabel == valveAssignment.ValveId;
            });
            if (unitValve == null) {
                anyBad = true;
                // remove valveAssignment
                // TODO test, not sure if this is the correct way to remove in typescript
                var index = this_3.valveAssignments.Assignments.indexOf(valveAssignment);
                this_3.valveAssignments.Assignments.splice(index, 1);
                console.log("Fixing up ValveAssignmentState, existing config does not contain this valve: " + valveAssignment.ValveId);
            }
        };
        var this_3 = this;
        for (var _i = 0, _a = this.valveAssignments.Assignments; _i < _a.length; _i++) {
            var valveAssignment = _a[_i];
            _loop_12(valveAssignment);
        }
        if (anyBad) {
            //this.valveAssignmentRepository.writeValveAssignments(this.valveAssignments);
        }
    };
    // TODO finish
    ConfigurationService.prototype.writeValveAssignment = function (valveToConfigure, selectedBibItem) {
        this.dumpValveAssignments("Before");
        if (selectedBibItem == null) {
            console.log("No Selected BibItem, not changing valve assignment.");
            return;
        }
        var valveState = valveToConfigure.payload;
        if (!_.find(this.valveAssignments.Assignments, function (item) {
            return item == valveState;
        })) {
            console.log("Error in ValveConfiguration");
        }
        var newBibItem = selectedBibItem.payload;
        var newSku = newBibItem == null ? "" : newBibItem.SKU;
        var oldSku = valveState.SKU;
        this.verifyTopCombinationState(valveState, newSku);
        this.verifyCuratedMixState(valveState, newSku);
        var inventoryMappingEventInfo = new app_types_1.InventoryMapping();
        if (selectedBibItem == null || selectedBibItem.ActionId == "unassign") {
            /*inventoryMappingEventInfo.ValveActions.push( {
               SKU: valveState.SKU,
               ID: valveState.ValveLabelPair.ValveNumber,
               Type: ValveAction.ActionType.Removed
            } ); */
            valveState.unAssignValve();
            // TODO are we implementing localizationService?
            valveToConfigure.Label = "not_in_use_id";
            valveToConfigure.PathToImage = "";
            valveToConfigure.BackgroundColor = "";
            valveToConfigure.ResourceId = "not_in_use_id";
        }
        else {
            if (oldSku != null && oldSku != "") {
                //inventoryMappingEventInfo.ValveActions
            }
            var sku = selectedBibItem.payload.SKU;
            valveState.assignValve(sku, selectedBibItem);
            valveToConfigure.Label = selectedBibItem.payload.Name;
            valveToConfigure.PathToImage = selectedBibItem.PathToImage;
            valveToConfigure.BackgroundColor = selectedBibItem.BackgroundColor;
            // push inventoryMappingEventInfo
        }
        this.valveAssignmentRepository.writeValveAssignments(this.valveAssignments);
        this.updateEventValveAssignments(inventoryMappingEventInfo);
        // DBUtil.PostEventData
    };
    ConfigurationService.prototype.saveValveAssignments = function () {
        this.valveAssignmentRepository.writeValveAssignments(this.valveAssignments);
    };
    ConfigurationService.prototype.updateEventValveAssignments = function (inventoryMappingEventInfo) {
        for (var _i = 0, _a = _.filter(this.valveAssignments.Assignments, function (item) {
            return item.IsAssigned;
        }); _i < _a.length; _i++) {
            var valveAssignmentState = _a[_i];
            inventoryMappingEventInfo.ValveAssignments.push(JsUtil_1.JsUtil.mapToNewObject({
                ID: valveAssignmentState.ValveLabelPair.ValveNumber,
                SKU: valveAssignmentState.SKU
            }, new app_types_1.ValveAssignment()));
        }
    };
    ConfigurationService.prototype.getChangeValveMenuButtons = function () {
        return this.hasPermissions(this.serviceUIPopupButtons.ChangeValueMenuOptions);
    };
    ConfigurationService.prototype.getTopCombinationSeed = function () {
        return this.configurationRepository.getTopCombinationSeed();
    };
    ConfigurationService.prototype.getPrimingButtons = function () {
        return this.hasPermissions(this.serviceUIPopupButtons.Priming);
    };
    ConfigurationService.prototype.getPrimingValveButtons = function () {
        var primeButtons = this.getCurrentValveAssignmentsAsButtonModels();
        for (var button in primeButtons) {
            // button.ActionId = "";
            //button.ButtonBehavior
        }
        return primeButtons;
    };
    ConfigurationService.prototype.getValvePrimingButtons = function () {
        return this.hasPermissions(this.serviceUIPopupButtons.ValvePriming);
    };
    ConfigurationService.prototype.convertRecipeToButtonModel = function (recipe) {
        var visual = this.productDataService.getVisualForRecipe(recipe);
        // TODO currently the ButtonModel class is in a separate file in the C# app; should it get changed to
        var buttonModel = JsUtil_1.JsUtil.mapToNewObject({
            Id: recipe.Name,
            Label: recipe.Name,
            RecipeId: recipe.Id,
            PathToImage: visual ? (visual.design.assets.logoHome != null ? visual.design.assets.logoHome : visual.design.assets.logoBrand) : "",
            payload: recipe,
        }, new app_types_1.ButtonModel());
        if (recipe.areAnyValvesLockedInRecipe) {
            console.log("A valve is locked. " + recipe.Name + " will not be dispensable.");
        }
        return buttonModel;
    };
    ConfigurationService.prototype.getServiceUI = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // will need to filter by permissions and unittype
                return [2 /*return*/, this.configurationRepository.getServiceUI()];
            });
        });
    };
    ConfigurationService.prototype.getConfirmButtons = function () {
        return this.serviceUIPopupButtons.ConfirmButtons;
    };
    ConfigurationService.prototype.getConsumerLanguages = function () {
        return this.serviceUIPopupButtons.ConsumerLanguages;
    };
    ConfigurationService.prototype.getRecipePopupButtons = function () {
        return this.serviceUIPopupButtons.Recipes;
    };
    ConfigurationService.prototype.getFlowRateButtons = function () {
        return this.serviceUIPopupButtons.FlowRates;
    };
    ConfigurationService.prototype.getMachineStatusButtons = function () {
        return this.serviceUIPopupButtons.MachineStatus;
    };
    ConfigurationService.prototype.getUnitLocationButtons = function () {
        return this.serviceUIPopupButtons.UnitLocation;
    };
    ConfigurationService.prototype.getModemConnectivityButtons = function () {
        return this.serviceUIPopupButtons.ModemConnectivity;
    };
    ConfigurationService.prototype.getSystemShutdownButtons = function () {
        return this.hasPermissions(this.serviceUIPopupButtons.ShutdownOptions);
    };
    ConfigurationService.prototype.getDisplayOffButtons = function () {
        return this.hasPermissions(this.serviceUIPopupButtons.DisplayOffOptions);
    };
    ConfigurationService.prototype.getValveLockButtons = function () {
        return this.hasPermissions(this.serviceUIPopupButtons.ValveLockOptions);
    };
    ConfigurationService.prototype.getLegacyValvesState = function () {
        return this.configurationRepository.getLegacyValvesState();
    };
    ConfigurationService.prototype.getLegacyValvesSeed = function () {
        return this.configurationRepository.getLegacyValvesSeed();
    };
    ConfigurationService.prototype.resetLegacyValves = function () {
        this.configurationRepository.resetLegacyValvesState();
    };
    ConfigurationService.prototype.writeLegacyValvesState = function (legacyValves) {
        this.configurationRepository.writeLegacyValvesState(legacyValves);
        // AppInfo.IoC.GetObject
        // TODO implement LegacyValvesInventoryMapping
        //let mappingEvent = new Legacy
        var valveNumber = 0;
        for (var _i = 0, legacyValves_1 = legacyValves; _i < legacyValves_1.length; _i++) {
            var buttonModel = legacyValves_1[_i];
            // TODO add ValveAssignment2
            valveNumber++;
        }
        // DBUtil.PostEventData
    };
    // TODO implement
    ConfigurationService.prototype.resetValveAssignments = function () {
        // TODO implement fileLocations
        //let valveAssignmentModel = this.fileLocations.valveAssignmentSeed;
        // serialize to disk
    };
    ConfigurationService.prototype.getRoleByAuthId = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var permissionsModel, rolePermissions;
            return __generator(this, function (_a) {
                permissionsModel = this.configurationRepository.getUserPermissions();
                rolePermissions = _.find(permissionsModel.Roles, function (item) {
                    return item.AuthId == input;
                });
                if (rolePermissions == null) {
                    return [2 /*return*/, app_types_1.Role.None];
                }
                return [2 /*return*/, rolePermissions.Role];
            });
        });
    };
    ConfigurationService.prototype.getBrixButtons = function () {
        return this.hasPermissions(this.serviceUIPopupButtons.Brix);
    };
    ConfigurationService.prototype.getEquipmentStatusButton = function () {
        var allButtons = this.hasPermissions(this.serviceUIPopupButtons.EquipmentStatus);
        var availableButtons = [];
        for (var _i = 0, allButtons_3 = allButtons; _i < allButtons_3.length; _i++) {
            var item = allButtons_3[_i];
            if (this.isSupportedOnUnitType(item)) {
                availableButtons.push(item);
            }
        }
        return availableButtons;
    };
    ConfigurationService.prototype.getSENDiagnosticsButtons = function () {
        return this.hasPermissions(this.serviceUIPopupButtons.SENDiagnostics);
    };
    ConfigurationService.prototype.getSENDiagnosticsEquipmentSerialButton = function () {
        return this.hasPermissions(this.serviceUIPopupButtons.SENDiagnosticsEquipmentSerial);
    };
    ConfigurationService.prototype.getSENDiagnosticsRefreshButton = function () {
        return this.hasPermissions(this.serviceUIPopupButtons.SENDiagnosticsRefresh);
    };
    // TODO add ButtonBehavior and test
    ConfigurationService.prototype.getUICustomizationsAvailable = function (UnitLocation) {
        var buttonList = [];
        var listOverrides = _.filter(this.uiCustomizations.Overrides, function (item) {
            //return item.Countries
        });
        for (var _i = 0, listOverrides_1 = listOverrides; _i < listOverrides_1.length; _i++) {
            var overrideModel = listOverrides_1[_i];
            var buttonModel = JsUtil_1.JsUtil.mapToNewObject({
                ButtonType: app_types_1.ButtonType.statebutton,
                Id: overrideModel.Name,
                ActionId: "override",
                Label: overrideModel.Name,
                payload: overrideModel
            }, new app_types_1.ButtonModel());
            for (var _a = 0, _b = overrideModel.AttractLoops; _a < _b.length; _a++) {
                var attractLoop = _b[_a];
                var attractLoopButtonModel = JsUtil_1.JsUtil.mapToNewObject({
                    ButtonType: app_types_1.ButtonType.statebutton,
                    Id: attractLoop.Name,
                    Label: attractLoop.Name,
                    ActionId: "attractloop",
                    payload: attractLoop
                }, new app_types_1.ButtonModel());
                buttonModel.ButtonModelList.push(attractLoopButtonModel);
            }
            buttonList.push(buttonModel);
        }
        return buttonList;
    };
    ConfigurationService.prototype.getPlatform = function (fileTokenToReturn) {
        return __awaiter(this, void 0, void 0, function () {
            var platformFileName, contents;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        platformFileName = '';
                        if (fileTokenToReturn) {
                            platformFileName = fileTokenToReturn;
                        }
                        else {
                            // at this point, only one platform file available and it works
                            // on all configurations
                            platformFileName = 'platform_1080x1920.json';
                        }
                        return [4 /*yield*/, this.configurationRepository.getPlatform(platformFileName)];
                    case 1:
                        contents = _a.sent();
                        // const resultPromise = new Promise(function(resolve, reject) {
                        //     resolve(contents);
                        // });
                        return [2 /*return*/, contents];
                }
            });
        });
    };
    ConfigurationService.prototype.getPlatform2 = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.configurationRepository.getPlatform2()];
            });
        });
    };
    ConfigurationService.prototype.getDesignFlavor = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.configurationRepository.getDesignFlavors()];
            });
        });
    };
    ConfigurationService.prototype.getDesignPourables = function (country) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.configurationRepository.getDesignPourables(country)];
            });
        });
    };
    ConfigurationService.prototype.getDesignBubbles = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.configurationRepository.getDesignBubbles()];
            });
        });
    };
    ConfigurationService.prototype.getDesignAnimations = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.configurationRepository.getDesignAnimations()];
            });
        });
    };
    ConfigurationService.prototype.getIdleState = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.configurationRepository.getIdleState()];
            });
        });
    };
    ConfigurationService.prototype.getUnitState = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, device_info_1.DeviceInfo.unitState];
            });
        });
    };
    ConfigurationService.prototype.getLocalizationForConsumerUI = function () {
        return this.configurationRepository.getLocalizationForConsumerUI();
    };
    ConfigurationService.prototype.getPourItems = function () {
        return __awaiter(this, void 0, void 0, function () {
            var self, targetPourItemModel, pourablesDesignArray, flavorsDesignArray, uidata, _a, _b, itemCount, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        self = this;
                        this.dctPourButtonModelsByPourId = {};
                        targetPourItemModel = new app_types_1.PourItemModel();
                        return [4 /*yield*/, this.configurationRepository.getDesignPourables(device_info_1.DeviceInfo.unitState.CountryLanguageCode)];
                    case 1:
                        pourablesDesignArray = _d.sent();
                        return [4 /*yield*/, this.configurationRepository.getDesignFlavors()];
                    case 2:
                        flavorsDesignArray = _d.sent();
                        return [4 /*yield*/, this.getUIData()];
                    case 3:
                        uidata = _d.sent();
                        this.addToPourItemModel(uidata.brands, pourablesDesignArray, targetPourItemModel, "brands");
                        this.addFlavorsToPourItemModel(uidata.flavors, flavorsDesignArray, targetPourItemModel, "flavors");
                        this.addToPourItemModel(uidata.curatedMixes, pourablesDesignArray, targetPourItemModel, "curatedMixes");
                        this.addToPourItemModel(uidata.topCombinations, pourablesDesignArray, targetPourItemModel, "topCombinations");
                        this.addToPourItemModel(uidata.waters, pourablesDesignArray, targetPourItemModel, "waters");
                        _a = targetPourItemModel;
                        return [4 /*yield*/, this.addCalorieInfo(targetPourItemModel.brands)];
                    case 4:
                        _a.brands = _d.sent();
                        _b = targetPourItemModel;
                        return [4 /*yield*/, this.addCalorieInfo(targetPourItemModel.curatedMixes)];
                    case 5:
                        _b.curatedMixes = _d.sent();
                        itemCount = targetPourItemModel.brands.length + targetPourItemModel.curatedMixes.length;
                        _c = targetPourItemModel;
                        return [4 /*yield*/, this.configurationRepository.getPlatformMenuLayout(itemCount)];
                    case 6:
                        _c.homeMenu = _d.sent();
                        // // ================= TEST CODE ===============================
                        _.forEach(targetPourItemModel.curatedMixes, function (item) {
                            console.log('pourable.pouritem', item.pourItem);
                            item.pourItem.isDisabled = false;
                        });
                        // targetPourItemModel.brands[1].pourItem.isDisabled = true ;
                        // targetPourItemModel.brands[5].pourItem.isDisabled = true ;
                        // ===========================================================
                        return [2 /*return*/, targetPourItemModel];
                }
            });
        });
    };
    ConfigurationService.prototype.getOverrides = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.configurationRepository.getOverrides()];
            });
        });
    };
    ConfigurationService.prototype.getCalorieCountState = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.configurationRepository.getCalorieCountState()];
            });
        });
    };
    ConfigurationService.prototype.addCalorieInfo = function (pourables) {
        return __awaiter(this, void 0, void 0, function () {
            var calorieCountStateMaster, dctPourButtonModels;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCalorieCountState()];
                    case 1:
                        calorieCountStateMaster = _a.sent();
                        dctPourButtonModels = this.dctPourButtonModelsByPourId;
                        if (!calorieCountStateMaster.IsToggleButtonEnabled) {
                            return [2 /*return*/];
                        }
                        if (calorieCountStateMaster.CalorieCups.length === 0) {
                            console.log("No calorie cups defined.");
                            return [2 /*return*/];
                        }
                        _.forEach(pourables, function (item) {
                            var cups = JSON.parse(JSON.stringify(calorieCountStateMaster.CalorieCups));
                            item.CalorieCups = cups;
                            var pourButtonModel = dctPourButtonModels[item.pourItem.pourConfigurationId];
                            var skuMappingList = pourButtonModel.payload.SkuToValveMappings;
                            var skuMapping = _.find(skuMappingList, function (i) {
                                return i.sku.length > 4;
                            });
                            var bibItem = skuMapping.valveAssignmentState.BibItemAsButtonModel.payload;
                            _.forEach(cups, function (cup) {
                                var totalCalories = Math.round(cup.QtyInOunces * bibItem.CaloriesPerOz);
                                cup.Line1Label = totalCalories + " ${calorie}";
                                cup.QtyInMilliliters = Math.round(cup.QtyInMilliliters);
                                cup.QtyInOunces = Math.round(cup.QtyInOunces);
                                if (device_info_1.DeviceInfo.unitState.UnitLocation === "US") {
                                    cup.Line2Label = cup.CupName + " " + cup.QtyInOunces + " FL OZ";
                                }
                                else {
                                    cup.Line2Label = cup.QtyInMilliliters + "ML (" + cup.QtyInOunces + "OZ)";
                                }
                            });
                        });
                        return [2 /*return*/, pourables];
                }
            });
        });
    };
    ConfigurationService.prototype.addToPourItemModel = function (buttonModels, designs, targetPourItemModal, targetPropertyName) {
        var pourItems = this.convertButtonModelsToPourItems(buttonModels);
        var targetArray = [];
        _.forEach(pourItems, function (item) {
            var foundDesignItem = _.find(designs, function (designItem) {
                return item.id === designItem.id;
            });
            if (foundDesignItem) {
                foundDesignItem.pourItem = item;
                if (!foundDesignItem.Weighting) {
                    console.log("No Weighting on DesignItem", foundDesignItem.name);
                    foundDesignItem.Weighting = 20000;
                }
                else if (foundDesignItem.Weighting < 1) {
                    // foundDesignItem.Weighting = 19000;
                }
                targetArray.push(foundDesignItem);
            }
        });
        var orderedArray = _.sortBy(targetArray, [function (o) {
                return o.Weighting;
            }]);
        targetPourItemModal[targetPropertyName] = orderedArray;
    };
    ConfigurationService.prototype.addFlavorsToPourItemModel = function (buttonModels, designs, targetPourItemModal, targetPropertyName) {
        var flavorPourItems = this.convertButtonModelsToPourItems(buttonModels);
        _.forEach(flavorPourItems, function (item) {
            var foundFlavorItem = _.find(designs, function (designItem) {
                return item.id === designItem.id;
            });
            if (foundFlavorItem) {
                if (!item.isDisabled) {
                    foundFlavorItem.pourItem = item;
                    targetPourItemModal[targetPropertyName].push(foundFlavorItem);
                }
            }
        });
    };
    ConfigurationService.prototype.convertButtonModelsToPourItems = function (buttonModels) {
        var pourItems = [];
        var dctPourButtonModels = this.dctPourButtonModelsByPourId;
        _.forEach(buttonModels, function (item) {
            var pourItem = new app_types_1.PourItem();
            pourItem.pourConfigurationId = SHORTID.generate();
            // ToDo: topCombinations need a payload
            if (!item.payload) {
                pourItem.id = item.id;
            }
            else if (!item.payload.BeverageId) {
                console.log("missing beverageId on " + item.Label);
                pourItem.id = '~' + item.label;
            }
            else {
                pourItem.id = item.payload.BeverageId;
                pourItem.brandId = item.payload.BrandId;
                pourItem.flavorIds = item.payload.FlavorIds;
            }
            pourItem.isDisabled = item.IsDisabled;
            pourItem.label = item.Label;
            pourItems.push(pourItem);
            dctPourButtonModels[pourItem.pourConfigurationId] = item;
        });
        this.dctPourButtonModelsByPourId = dctPourButtonModels;
        return pourItems;
    };
    ConfigurationService.prototype.getHome = function (file) {
        var fileName = 'home_spire.json';
        if (file) {
            fileName = file;
        }
        else if (device_info_1.DeviceInfo.unitState.UnitType === app_types_1.UnitTypes.Spire5) {
            fileName = 'home_spire5.json';
        }
        else if (device_info_1.DeviceInfo.unitState.UnitType === app_types_1.UnitTypes.Spire5 && device_info_1.DeviceInfo.unitState.UnitLocation === "CA") {
            fileName = 'home_spire5_ca.json';
        }
        return this.configurationRepository.getHome(fileName);
    };
    ConfigurationService = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(server_types_1.default.AppInfo)),
        __param(1, inversify_1.inject(server_types_1.default.ValveAssignmentRepository)),
        __param(2, inversify_1.inject(server_types_1.default.ConfigurationRepository)),
        __param(3, inversify_1.inject(server_types_1.default.ProductDataService)),
        __metadata("design:paramtypes", [app_info_service_1.AppInfoService,
            valve_assignment_repository_1.ValveAssignmentRepository,
            configuration_repository_1.ConfigurationRepository,
            product_data_service_1.ProductDataService])
    ], ConfigurationService);
    return ConfigurationService;
}());
exports.ConfigurationService = ConfigurationService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpZ3VyYXRpb24vY29uZmlndXJhdGlvbi1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvREF3QmdDO0FBR2hDLGlFQUE0RDtBQUM1RCx1Q0FBNkM7QUFDN0MsOENBQTJDO0FBQzNDLHdEQUFvRDtBQUNwRCwrREFBMEQ7QUFDMUQsdUVBQW1FO0FBQ25FLHlDQUEyQztBQUMzQywwQkFBNEI7QUFDNUIsNkVBQXdFO0FBQ3hFLGdEQUFvQztBQUNwQyxpQ0FBb0M7QUFHcEMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRzdCO0lBZUksdUJBQXVCO0lBRXZCLDhCQUEyQyxPQUF1QixFQUNMLHlCQUFvRCxFQUN0RCx1QkFBZ0QsRUFDckQsa0JBQXNDO1FBSGpELFlBQU8sR0FBUCxPQUFPLENBQWdCO1FBQ0wsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUEyQjtRQUN0RCw0QkFBdUIsR0FBdkIsdUJBQXVCLENBQXlCO1FBQ3JELHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFYNUYsY0FBUyxHQUFrQixJQUFJLHlCQUFhLEVBQUUsQ0FBQztRQUMvQyxxQkFBZ0IsR0FBb0IsSUFBSSwyQkFBZSxFQUFFLENBQUM7UUFHMUQsZ0NBQTJCLEdBQWdDLEVBQUUsQ0FBQztRQVExRCxJQUFJLENBQUMsUUFBUSxHQUFHLGVBQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVELDRDQUFhLEdBQWI7UUFDSSw2REFBNkQ7UUFDN0QsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxp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QUMsdUJBQXVCLENBQUMsQ0FBQTtRQUNyQyxXQUFBLGtCQUFNLENBQUMsc0JBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO3lDQUhPLGlDQUFjO1lBQ3NCLHVEQUF5QjtZQUM3QixrREFBdUI7WUFDakMseUNBQWtCO09BcEJuRixvQkFBb0IsQ0FxckNoQztJQUFELDJCQUFDO0NBcnJDRCxBQXFyQ0MsSUFBQTtBQXJyQ1ksb0RBQW9CIiwiZmlsZSI6ImNvbmZpZ3VyYXRpb24vY29uZmlndXJhdGlvbi1zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBCdXR0b25Nb2RlbCxcbiAgICBVbml0Q29uZmlndXJhdGlvbk1vZGVsLFxuICAgIERldmljZURlc2NyaXB0b3IsXG4gICAgU2VydmljZVVJUG9wdXBCdXR0b25zTW9kZWwsXG4gICAgU2VydmljZVVJTW9kZWwsXG4gICAgVUlDdXN0b21pemF0aW9uc01vZGVsLFxuICAgIFZhbHZlQXNzaWdubWVudCxcbiAgICBWYWx2ZUFzc2lnbm1lbnRTdGF0ZSxcbiAgICBCaWJJdGVtTW9kZWwsXG4gICAgVmFsdmVMYWJlbFBhaXIsXG4gICAgUmVjaXBlSXRlbU1vZGVsLFxuICAgIEJ1dHRvbk1vZGVsTGlzdCxcbiAgICBSZWNpcGVUeXBlLFxuICAgIEJ1dHRvblR5cGUsXG4gICAgQmliSXRlbVR5cGUsXG4gICAgU2t1VG9WYWx2ZU1hcHBpbmcsXG4gICAgSW52ZW50b3J5TWFwcGluZyxcbiAgICBSb2xlLFxuICAgIFBvdXJJdGVtLFxuICAgIFVJVmlzdWFsc01vZGVsLFxuICAgIFBvdXJJdGVtTW9kZWwsXG4gICAgUG91cmFibGVEZXNpZ24sXG4gICAgRmxhdm9yRGVzaWduLCBGbGF2b3IsIFVuaXRUeXBlcywgQ2Fsb3JpZUNvdW50U3RhdGUsIENhbG9yaWVDdXAsIFNldEN1cmF0ZWRNaXhJdGVtLCBQbGF0Zm9ybU1vZGVsXG59IGZyb20gJy4uL3VuaXZlcnNhbC9hcHAudHlwZXMnO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tIFwicnhqcy9PYnNlcnZhYmxlXCI7XG5pbXBvcnQge0FwcFByb2R1Y3RkYXRhU2VydmljZX0gZnJvbSBcIi4uL3NlcnZpY2VzL2FwcC1wcm9kdWN0ZGF0YS5zZXJ2aWNlXCI7XG5pbXBvcnQge0FwcEluZm9TZXJ2aWNlfSBmcm9tIFwiLi4vc2VydmljZXMvYXBwLWluZm8uc2VydmljZVwiO1xuaW1wb3J0IHtpbmplY3QsIGluamVjdGFibGV9IGZyb20gXCJpbnZlcnNpZnlcIjtcbmltcG9ydCB7SnNVdGlsfSBmcm9tIFwiLi4vdW5pdmVyc2FsL0pzVXRpbFwiO1xuaW1wb3J0IHtEZXZpY2VJbmZvfSBmcm9tIFwiLi4vdW5pdHN0YXRlL2RldmljZS1pbmZvXCI7XG5pbXBvcnQge1Byb2R1Y3REYXRhU2VydmljZX0gZnJvbSBcIi4vcHJvZHVjdC1kYXRhLXNlcnZpY2VcIjtcbmltcG9ydCB7Q29uZmlndXJhdGlvblJlcG9zaXRvcnl9IGZyb20gXCIuL2NvbmZpZ3VyYXRpb24tcmVwb3NpdG9yeVwiO1xuaW1wb3J0ICogYXMgSlNPTkZJTEUgZnJvbSBcImxvYWQtanNvbi1maWxlXCI7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1ZhbHZlQXNzaWdubWVudFJlcG9zaXRvcnl9IGZyb20gXCIuL3ZhbHZlLWFzc2lnbm1lbnQtcmVwb3NpdG9yeVwiO1xuaW1wb3J0IFRZUEVTIGZyb20gXCIuLi9zZXJ2ZXIudHlwZXNcIjtcbmltcG9ydCBTSE9SVElEID0gcmVxdWlyZShcInNob3J0aWRcIik7XG5pbXBvcnQgeyBVbml0U3RhdGUgfSBmcm9tICcuLi91bml0c3RhdGUvdW5pdC1zdGF0ZSc7XG5cbmNvbnN0IFBBVEggPSByZXF1aXJlKFwicGF0aFwiKTtcblxuQGluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIENvbmZpZ3VyYXRpb25TZXJ2aWNlIHtcbiAgICBvYmplY3RJZDogbnVtYmVyO1xuXG4gICAgc2VydmljZVVJOiBTZXJ2aWNlVUlNb2RlbDtcbiAgICBzZXJ2aWNlVUlQb3B1cEJ1dHRvbnM6IFNlcnZpY2VVSVBvcHVwQnV0dG9uc01vZGVsO1xuICAgIHVpQ3VzdG9taXphdGlvbnM6IFVJQ3VzdG9taXphdGlvbnNNb2RlbDtcbiAgICBtaXhlczogQnV0dG9uTW9kZWxbXTtcbiAgICBhY3Rpb25QZXJtaXNzaW9uczogc3RyaW5nW107XG4gICAgdW5pdFR5cGU6IFVuaXRUeXBlcztcbiAgICBwb3VySXRlbXM6IFBvdXJJdGVtTW9kZWwgPSBuZXcgUG91ckl0ZW1Nb2RlbCgpO1xuICAgIHZhbHZlQXNzaWdubWVudHM6IFZhbHZlQXNzaWdubWVudCA9IG5ldyBWYWx2ZUFzc2lnbm1lbnQoKTtcbiAgICAvLyBUT0RPIHRoZSBrZXkgaXMgYSBLZXlWYWx1ZVBhaXIgd2l0aCB2YWx2ZVJvdyBhbmQgdmFsdmUudmFsdmVOdW1iZXIgYXMgdGhlIHZhbHVlc1xuICAgIHZhbHZlQXNzaWdubWVudEJ1dHRvbk1vZGVsczogeyBbdmFsdmVyb3c6IG51bWJlcl06IEJ1dHRvbk1vZGVsIH07XG4gICAgZGN0UG91ckJ1dHRvbk1vZGVsc0J5UG91cklkOiB7W2lkOiBzdHJpbmddOiBCdXR0b25Nb2RlbH0gPSB7fTtcblxuICAgIC8vIFVuaXRUeXBlOiBVbml0VHlwZXM7XG5cbiAgICBjb25zdHJ1Y3RvcihAaW5qZWN0KFRZUEVTLkFwcEluZm8pIHByaXZhdGUgYXBwSW5mbzogQXBwSW5mb1NlcnZpY2UsXG4gICAgICAgICAgICAgICAgQGluamVjdChUWVBFUy5WYWx2ZUFzc2lnbm1lbnRSZXBvc2l0b3J5KSBwcml2YXRlIHZhbHZlQXNzaWdubWVudFJlcG9zaXRvcnk6IFZhbHZlQXNzaWdubWVudFJlcG9zaXRvcnksXG4gICAgICAgICAgICAgICAgQGluamVjdChUWVBFUy5Db25maWd1cmF0aW9uUmVwb3NpdG9yeSkgcHJpdmF0ZSBjb25maWd1cmF0aW9uUmVwb3NpdG9yeTogQ29uZmlndXJhdGlvblJlcG9zaXRvcnksXG4gICAgICAgICAgICAgICAgQGluamVjdChUWVBFUy5Qcm9kdWN0RGF0YVNlcnZpY2UpIHByaXZhdGUgcHJvZHVjdERhdGFTZXJ2aWNlOiBQcm9kdWN0RGF0YVNlcnZpY2UpIHtcbiAgICAgICAgdGhpcy5vYmplY3RJZCA9IEpzVXRpbC5nZXRPYmplY3RJZCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcImN0b3IuQ29uZmlndXJhdGlvblNlcnZpY2VcIiwgdGhpcy5vYmplY3RJZCk7XG4gICAgICAgIHRoaXMubG9hZERhdGEoKTtcbiAgICB9XG5cbiAgICBnZXRQb2NWaXN1YWxzKCkge1xuICAgICAgICAvLyB0ZW1wb3JhcnkgYW55d2F5LCBvayB0byBub3QgcHV0IGluIGNvbmZpZ3VyYXRpb25SZXBvc2l0b3J5XG4gICAgICAgIGNvbnN0IGZpbGVOYW1lID0gUEFUSC5qb2luKHRoaXMuYXBwSW5mby5jb25maWdEaXJfQXBwLCBcInBvY3Zpc3VhbHMuanNvblwiKTtcbiAgICAgICAgcmV0dXJuIEpTT05GSUxFLnN5bmMoZmlsZU5hbWUpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhZnRlclByb3BlcnRpZXNTZXQoKSB7XG4gICAgICAgIHRoaXMubG9hZERhdGEoKTtcblxuICAgICAgICB0aGlzLmFjdGlvblBlcm1pc3Npb25zID0gdGhpcy5jb25maWd1cmF0aW9uUmVwb3NpdG9yeS5nZXRQZXJtaXNzaW9ucyg0KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMucHJvZHVjdERhdGFTZXJ2aWNlLnJlc2V0KCk7XG4gICAgICAgIC8vIHRoaXMubG9jYWxpemF0aW9uU2VydmljZS5yZXNldCgpO1xuXG4gICAgICAgIHRoaXMubG9hZERhdGEoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVzZXRBY3Rpb25QZXJtaXNzaW9ucygpIHtcbiAgICAgICAgdGhpcy5hY3Rpb25QZXJtaXNzaW9ucyA9IHRoaXMuY29uZmlndXJhdGlvblJlcG9zaXRvcnkuZ2V0UGVybWlzc2lvbnMoNCk7XG4gICAgfVxuXG4gICAgLy8gVE9ETyBhZGQgcmVnaXN0cmF0aW9ucz9cbiAgICBwcml2YXRlIGxvYWREYXRhKCkge1xuICAgICAgICB0aGlzLmxvYWRWYWx2ZUFzc2lnbm1lbnRzKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEF2YWlsYWJsZUJ1dHRvbnMoYWxsQnV0dG9uczogQnV0dG9uTW9kZWxbXSk6IEJ1dHRvbk1vZGVsW10ge1xuICAgICAgICBjb25zdCBhdmFpbGFibGVCdXR0b25zOiBCdXR0b25Nb2RlbFtdID0gW107XG5cbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGFsbEJ1dHRvbnMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzU3VwcG9ydGVkT25Vbml0VHlwZShpdGVtKSkge1xuICAgICAgICAgICAgICAgIGF2YWlsYWJsZUJ1dHRvbnMucHVzaChpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhdmFpbGFibGVCdXR0b25zO1xuICAgIH1cblxuICAgIHByaXZhdGUgaXNTdXBwb3J0ZWRPblVuaXRUeXBlKGJ1dHRvbjogQnV0dG9uTW9kZWwpOiBib29sZWFuIHtcbiAgICAgICAgLy8gVE9ETyBubyBpZGVhIGhvdyB0byBzb2x2ZSB0aGlzIGlzc3VlXG4gICAgICAgIC8vIHRoaXMudW5pdFR5cGUgaXMgb25lIHZhbHVlLCBpdCBuZWVkcyB0byBsb29rIGludG8gdGhlIE1BTlkgY29taW5nIGluIG9uIHRoZSBidXR0b25cbiAgICAgICAgLy8gdGhlIGZvbGxvd2luZyBpcyB3cm9uZyBhdCB0aGlzIHBvaW50XG4gICAgICAgIHJldHVybiB0aGlzLnVuaXRUeXBlID09PSBidXR0b24uVW5pdFR5cGVzIDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0QXZhaWxhYmxlQ3VyYXRlZE1peGVzKCk6IEJ1dHRvbk1vZGVsW10ge1xuICAgICAgICBjb25zdCByZWNpcGVzQXNCdXR0b25Nb2RlbDogQnV0dG9uTW9kZWxbXSA9IFtdO1xuICAgICAgICBjb25zdCByZWNpcGVzID0gdGhpcy5wcm9kdWN0RGF0YVNlcnZpY2UuZ2V0RGlzcGVuc2FibGVSZWNpcGVzRm9yQ3VyYXRlZE1peGVzKHRoaXMudmFsdmVBc3NpZ25tZW50cyk7XG5cbiAgICAgICAgZm9yIChjb25zdCByZWNpcGUgb2YgcmVjaXBlcykge1xuICAgICAgICAgICAgY29uc3QgYnV0dG9uTW9kZWwgPSB0aGlzLmNvbnZlcnRSZWNpcGVUb0J1dHRvbk1vZGVsKHJlY2lwZSk7XG4gICAgICAgICAgICBidXR0b25Nb2RlbC5BY3Rpb25JZCA9IFwiYXZhaWxhYmxlLmN1cmF0ZWQubWl4XCI7XG4gICAgICAgICAgICByZWNpcGVzQXNCdXR0b25Nb2RlbC5wdXNoKGJ1dHRvbk1vZGVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZWNpcGVzQXNCdXR0b25Nb2RlbDtcbiAgICB9XG5cbiAgICAvLyBUT0RPIGZpbmlzaFxuICAgIHB1YmxpYyBnZXRBY3Rpb25QYW5lbEJ1dHRvbnMoKTogQnV0dG9uTW9kZWxbXSB7XG4gICAgICAgIGNvbnN0IGJ1dHRvbmxpc3QgPSB0aGlzLmhhc1Blcm1pc3Npb25zKHRoaXMuZ2V0QXZhaWxhYmxlQnV0dG9ucyh0aGlzLnNlcnZpY2VVSS5BY3Rpb25QYW5lbCkpO1xuXG4gICAgICAgIC8vIFRPRE8gQXBwbGljYXRpb25FeC5QdWJTdWIuR2V0RXZlbnRcblxuICAgICAgICByZXR1cm4gYnV0dG9ubGlzdDtcbiAgICB9XG5cbiAgICAvLyBUT0RPIGZpbmlzaFxuICAgIHB1YmxpYyBnZXRTeXN0ZW1QYW5lbEJ1dHRvbnMoKTogQnV0dG9uTW9kZWxbXSB7XG4gICAgICAgIGNvbnN0IGJ1dHRvbmxpc3QgPSB0aGlzLmhhc1Blcm1pc3Npb25zKHRoaXMuZ2V0QXZhaWxhYmxlQnV0dG9ucyh0aGlzLnNlcnZpY2VVSS5TeXN0ZW1QYW5lbCkpO1xuXG4gICAgICAgIC8vIFRPRE8gQXBwbGljYXRpb25FeC5QdWJTdWIuR2V0RXZlbnRcblxuICAgICAgICByZXR1cm4gYnV0dG9ubGlzdDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0U2VydmljZUxhbmd1YWdlcygpOiBCdXR0b25Nb2RlbFtdIHtcbiAgICAgICAgZm9yIChjb25zdCBidXR0b24gb2YgdGhpcy5zZXJ2aWNlVUlQb3B1cEJ1dHRvbnMuU2VydmljZUxhbmd1YWdlcykge1xuICAgICAgICAgICAgYnV0dG9uLklzU2VsZWN0ZWQgPSAoYnV0dG9uLklkID09IERldmljZUluZm8udW5pdFN0YXRlLkNvdW50cnlMYW5ndWFnZUNvZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc2VydmljZVVJUG9wdXBCdXR0b25zLlNlcnZpY2VMYW5ndWFnZXM7XG4gICAgfVxuXG4gICAgLy8gVE9ETyB0aGlzIG1ldGhvZCBpbiB0aGUgYyMgY29kZSBsb29rcyBpbmNvbXBsZXRlLCBpcyB0aGlzIGJlaW5nIGltcG9ydGVkIG9yIGRpc2NhcmRlZD9cbiAgICBwdWJsaWMgZ2V0QnV0dG9uc0ZvckNvbnN1bWVyVUkoKTogQnV0dG9uTW9kZWxbXSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdDogQnV0dG9uTW9kZWxbXSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgdmFsdmUgb2YgXy5maWx0ZXIodGhpcy52YWx2ZUFzc2lnbm1lbnRzLkFzc2lnbm1lbnRzLCBmdW5jdGlvbiAobGlzdCkge1xuICAgICAgICAgICAgcmV0dXJuIGxpc3QuSXNBc3NpZ25lZDtcbiAgICAgICAgfSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGJpYkl0ZW0gPSB2YWx2ZS5CaWJJdGVtQXNCdXR0b25Nb2RlbC5wYXlsb2FkO1xuXG4gICAgICAgICAgICBjb25zdCBidXR0b25Nb2RlbCA9IEpzVXRpbC5tYXBUb05ld09iamVjdCh7XG4gICAgICAgICAgICAgICAgSWQ6IGJpYkl0ZW0uTmFtZSxcbiAgICAgICAgICAgICAgICBMYWJlbDogYmliSXRlbS5OYW1lLFxuICAgICAgICAgICAgICAgIFJlY2lwZUlkOiBcIlwiLFxuICAgICAgICAgICAgICAgIC8vIEJ1dHRvbkJlaGF2aW9yXG4gICAgICAgICAgICB9LCBuZXcgQnV0dG9uTW9kZWwoKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRDbGVhclNlbGVjdGlvblRpbWVvdXRCdXR0b25zKCk6IEJ1dHRvbk1vZGVsW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXJ2aWNlVUlQb3B1cEJ1dHRvbnMuQ29uZmlndXJlU2VsZWN0aW9uVGltZW91dDtcbiAgICB9XG5cbiAgICAgYXN5bmMgZ2V0VUlEYXRhKCkge1xuICAgICAgICAgLy8gd2VyZSBvbmx5IGdldHRpbmcgYWN0aW9uIGJ1dHRvbnMgb3V0IG9mIHRoaXMgY2FsbFxuICAgICAgICAgY29uc3QgdWlWaXN1YWxzTW9kZWwgPSB0aGlzLnByb2R1Y3REYXRhU2VydmljZS5nZXREcml2ZVRocnVEYXRhKCk7XG5cbiAgICAgICAgIHVpVmlzdWFsc01vZGVsLmJyYW5kcyA9IFtdO1xuICAgICAgICAgdWlWaXN1YWxzTW9kZWwud2F0ZXJzID0gW107XG4gICAgICAgICB1aVZpc3VhbHNNb2RlbC5mbGF2b3JzID0gW107XG4gICAgICAgICB1aVZpc3VhbHNNb2RlbC5jdXJhdGVkTWl4ZXMgPSBbXTtcblxuICAgICAgICAgY29uc3QgcmVjaXBlcyA9IHRoaXMucHJvZHVjdERhdGFTZXJ2aWNlLmdldERpc3BlbnNhYmxlUmVjaXBlcyh0aGlzLnZhbHZlQXNzaWdubWVudHMpO1xuXG4gICAgICAgICBjb25zdCBjdXJhdGVkTWl4U3RhdGU6IFNldEN1cmF0ZWRNaXhJdGVtW10gPSB0aGlzLmdldEN1cmF0ZWRNaXhvbG9neVN0YXRlMigpO1xuXG4gICAgICAgICBjb25zdCBicmFuZHM6IEJ1dHRvbk1vZGVsW10gPSBbXTtcblxuICAgICAgICAgZm9yIChjb25zdCByZWNpcGUgb2YgcmVjaXBlcykge1xuICAgICAgICAgICAgIGNvbnN0IGJ1dHRvbk1vZGVsID0gdGhpcy5jb252ZXJ0UmVjaXBlVG9CdXR0b25Nb2RlbChyZWNpcGUpO1xuXG4gICAgICAgICAgICAgaWYgKHJlY2lwZS5UeXBlID09PSBSZWNpcGVUeXBlLkJldmVyYWdlKSB7XG4gICAgICAgICAgICAgICAgIGJ1dHRvbk1vZGVsLkJ1dHRvblR5cGUgPSBCdXR0b25UeXBlLmJyYW5kO1xuICAgICAgICAgICAgICAgICBicmFuZHMucHVzaChidXR0b25Nb2RlbCk7XG4gICAgICAgICAgICAgfSBlbHNlIGlmIChyZWNpcGUuVHlwZSA9PT0gUmVjaXBlVHlwZS5XYXRlcikge1xuICAgICAgICAgICAgICAgICBidXR0b25Nb2RlbC5CdXR0b25UeXBlID0gQnV0dG9uVHlwZS53YXRlcjtcbiAgICAgICAgICAgICAgICAgdWlWaXN1YWxzTW9kZWwud2F0ZXJzLnB1c2goYnV0dG9uTW9kZWwpO1xuICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVjaXBlLlR5cGUgPT09IFJlY2lwZVR5cGUuTWl4KSB7XG4gICAgICAgICAgICAgICAgIGNvbnN0IGZvdW5kID0gXy5maW5kKGN1cmF0ZWRNaXhTdGF0ZSwgZnVuY3Rpb24oc2V0Q3VyYXRlZE1peEl0ZW06IFNldEN1cmF0ZWRNaXhJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZXRDdXJhdGVkTWl4SXRlbS5SZWNpcGVJZCA9PT0gcmVjaXBlLklkO1xuICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICAgY29udGludWUgO1xuICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgYnV0dG9uTW9kZWwuQnV0dG9uVHlwZSA9IEJ1dHRvblR5cGUubWl4O1xuICAgICAgICAgICAgICAgICBpZiAoYnV0dG9uTW9kZWwucGF5bG9hZC5hcmVBbnlWYWx2ZXNMb2NrZWRJblJlY2lwZSl7XG4gICAgICAgICAgICAgICAgICAgICBidXR0b25Nb2RlbC5Jc0Rpc2FibGVkID0gdHJ1ZSA7XG4gICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB1aVZpc3VhbHNNb2RlbC5jdXJhdGVkTWl4ZXMucHVzaChidXR0b25Nb2RlbCk7XG5cbiAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVua25vd24gUmVjaXBlVHlwZTogXCIgKyByZWNpcGUuTmFtZSArIFwiIFwiICsgcmVjaXBlLlR5cGUgKyBcIiBcIiArIHJlY2lwZS5JZCk7XG4gICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgdWlWaXN1YWxzTW9kZWwuYnJhbmRzID0gXy5vcmRlckJ5KGJyYW5kcywgWyd3ZWlnaHRpbmcnXSwgWydhc2MnXSk7XG4gICAgICAgICAgICAgdWlWaXN1YWxzTW9kZWwuZmxhdm9ycyA9IHRoaXMuZ2V0Rmxhdm9yc0ZvckNvbnN1bWVyVUkoKTtcbiAgICAgICAgICAgICB1aVZpc3VhbHNNb2RlbC50b3BDb21iaW5hdGlvbnMgPSB0aGlzLmdldFRvcENvbWJpbmF0aW9uU3RhdGUoZmFsc2UsIHVpVmlzdWFsc01vZGVsLmZsYXZvcnMpO1xuXG4gICAgICAgICB9XG5cbiAgICAgICAgIHJldHVybiB1aVZpc3VhbHNNb2RlbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVtb3ZlQXNzaWduZWRCaWJJdGVtc0Zyb21MaXN0KGF2YWlsYWJsZUJpYkl0ZW1zOiBCdXR0b25Nb2RlbFtdLCBpbmNvbWluZ1ZhbHZlQnV0dG9uOiBCdXR0b25Nb2RlbCkge1xuICAgICAgICBjb25zdCBkY3RTa3VMaXN0ID0gdGhpcy5wcm9kdWN0RGF0YVNlcnZpY2UuZ2V0U2t1TGlzdCgpO1xuICAgICAgICBjb25zdCB2YWx2ZUFzc2lnbm1lbnRTdGF0ZTogVmFsdmVBc3NpZ25tZW50U3RhdGUgPSBpbmNvbWluZ1ZhbHZlQnV0dG9uLnBheWxvYWQ7XG4gICAgICAgIGNvbnN0IGFzc2lnbmVkVmFsdmVzID0gXy5maWx0ZXIodGhpcy52YWx2ZUFzc2lnbm1lbnRzLkFzc2lnbm1lbnRzLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW0uaXNBc3NpZ25lZDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZm9yIChjb25zdCBiaWJJdGVtIG9mIGF2YWlsYWJsZUJpYkl0ZW1zKSB7XG4gICAgICAgICAgICBjb25zdCBiaWJJdGVtTW9kZWw6IEJpYkl0ZW1Nb2RlbCA9IGJpYkl0ZW0ucGF5bG9hZDtcblxuICAgICAgICAgICAgaWYgKF8uZmluZChhc3NpZ25lZFZhbHZlcywgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uU0tVID09IGJpYkl0ZW1Nb2RlbC5TS1U7XG4gICAgICAgICAgICAgICAgfSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5jb21pbmdWYWx2ZUJ1dHRvbi5wYXlsb2FkLlNLVSAhPSBiaWJJdGVtLklkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChiaWJJdGVtTW9kZWwuVHlwZSA9PSBCaWJJdGVtVHlwZS5zeXJ1cCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2t1TGlzdCA9IGRjdFNrdUxpc3RbYmliSXRlbU1vZGVsLlNLVV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgc2t1IG9mIHNrdUxpc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gXy5maW5kKGF2YWlsYWJsZUJpYkl0ZW1zLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5wYXlsb2FkLlNLVSA9PSBza3U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8ucmVtb3ZlKGF2YWlsYWJsZUJpYkl0ZW1zLCBmdW5jdGlvbiAoeGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB4aXRlbS5JZCA9PSBpdGVtLklkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8ucmVtb3ZlKGF2YWlsYWJsZUJpYkl0ZW1zLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLklkID09IGJpYkl0ZW0uSWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBoYXNQZXJtaXNzaW9uKGFjdGlvbklkOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKF8uZmluZCh0aGlzLmFjdGlvblBlcm1pc3Npb25zLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLkFjdGlvbklkID09IGFjdGlvbklkO1xuICAgICAgICAgICAgfSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgaGFzUGVybWlzc2lvbnMoYWxsQnV0dG9uczogQnV0dG9uTW9kZWxbXSk6IEJ1dHRvbk1vZGVsW10ge1xuICAgICAgICBjb25zdCBhbGxvd2VkQnV0dG9uczogQnV0dG9uTW9kZWxbXSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBhbGxCdXR0b25zKSB7XG4gICAgICAgICAgICBpZiAoXy5maW5kKGFsbG93ZWRCdXR0b25zLCBmdW5jdGlvbiAoYnV0dG9uSXRlbSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnV0dG9uSXRlbS5JZCA9PSBpdGVtLklkO1xuICAgICAgICAgICAgICAgIH0pKSB7XG4gICAgICAgICAgICAgICAgYWxsb3dlZEJ1dHRvbnMucHVzaChpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhbGxvd2VkQnV0dG9ucztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Rmxhdm9yc0ZvckNvbnN1bWVyVUkoKTogQnV0dG9uTW9kZWxbXSB7XG5cbiAgICAgICAgY29uc3QgdmFsdmVzV2l0aEZsYXZvcnMgPSBfLmZpbHRlcih0aGlzLnZhbHZlQXNzaWdubWVudHMuQXNzaWdubWVudHMsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIGlmICghaXRlbS5pc0Fzc2lnbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaXRlbS5CaWJJdGVtQXNCdXR0b25Nb2RlbC5wYXlsb2FkID09IEpzVXRpbC5tYXBUb05ld09iamVjdChpdGVtLkJpYkl0ZW1Bc0J1dHRvbk1vZGVsLnBheWxvYWQsIG5ldyBCaWJJdGVtTW9kZWwoKSk7XG4gICAgICAgICAgICByZXR1cm4gaXRlbS5pc0Fzc2lnbmVkICYmIChpdGVtLkJpYkl0ZW1Bc0J1dHRvbk1vZGVsLnBheWxvYWQuVHlwZSA9PSBCaWJJdGVtVHlwZS5mbGF2b3JzaG90KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgZmxhdm9yQnV0dG9uczogQnV0dG9uTW9kZWxbXSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgdmFsdmVBc3NpZ25tZW50IG9mIHZhbHZlc1dpdGhGbGF2b3JzKSB7XG4gICAgICAgICAgICBsZXQgYmliSXRlbSA9IG5ldyBCaWJJdGVtTW9kZWwoKTtcbiAgICAgICAgICAgIGJpYkl0ZW0gPSB2YWx2ZUFzc2lnbm1lbnQuQmliSXRlbUFzQnV0dG9uTW9kZWwucGF5bG9hZDtcblxuICAgICAgICAgICAgY29uc3QgcmVjaXBlID0gSnNVdGlsLm1hcFRvTmV3T2JqZWN0KHtcbiAgICAgICAgICAgICAgICBUeXBlOiBSZWNpcGVUeXBlLkZsYXZvcixcbiAgICAgICAgICAgICAgICBJZDogYmliSXRlbS5OYW1lLFxuICAgICAgICAgICAgICAgIE5hbWU6IGJpYkl0ZW0uTmFtZSxcbiAgICAgICAgICAgICAgICBCZXZlcmFnZUlkOiBiaWJJdGVtLkFsdE5hbWVcbiAgICAgICAgICAgIH0sIG5ldyBSZWNpcGVJdGVtTW9kZWwoKSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG5ld1NrdU1hcHBpbmcgPSBuZXcgU2t1VG9WYWx2ZU1hcHBpbmcodmFsdmVBc3NpZ25tZW50LlNLVSwgdmFsdmVBc3NpZ25tZW50KTtcbiAgICAgICAgICAgIHJlY2lwZS5Ta3VUb1ZhbHZlTWFwcGluZ3MucHVzaChuZXdTa3VNYXBwaW5nKTtcblxuICAgICAgICAgICAgY29uc3QgYnV0dG9uTW9kZWwgPSBKc1V0aWwubWFwVG9OZXdPYmplY3Qoe1xuICAgICAgICAgICAgICAgIElkOiB2YWx2ZUFzc2lnbm1lbnQuQmliSXRlbUFzQnV0dG9uTW9kZWwuSWQsXG4gICAgICAgICAgICAgICAgTGFiZWw6IHZhbHZlQXNzaWdubWVudC5CaWJJdGVtQXNCdXR0b25Nb2RlbC5MYWJlbCxcbiAgICAgICAgICAgICAgICBQYXRoVG9JbWFnZTogdmFsdmVBc3NpZ25tZW50LkJpYkl0ZW1Bc0J1dHRvbk1vZGVsLlBhdGhUb0ltYWdlLFxuICAgICAgICAgICAgICAgIEJhY2tncm91bmRDb2xvcjogdmFsdmVBc3NpZ25tZW50LkJpYkl0ZW1Bc0J1dHRvbk1vZGVsLkJhY2tncm91bmRDb2xvcixcbiAgICAgICAgICAgICAgICBwYXlsb2FkOiByZWNpcGUsXG4gICAgICAgICAgICAgICAgQnV0dG9uVHlwZTogQnV0dG9uVHlwZS5mbGF2b3IsXG4gICAgICAgICAgICB9LCBuZXcgQnV0dG9uTW9kZWwoKSk7XG5cbiAgICAgICAgICAgIGlmIChyZWNpcGUuYXJlQW55VmFsdmVzTG9ja2VkSW5SZWNpcGUoKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQSB2YWx2ZSBpcyBsb2NrZWQuIFwiICsgcmVjaXBlLk5hbWUgKyBcIiB3aWxsIG5vdCBiZSBkaXNwZW5zYWJsZVwiKTtcbiAgICAgICAgICAgICAgICBidXR0b25Nb2RlbC5Jc0Rpc2FibGVkID0gdHJ1ZSA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZsYXZvckJ1dHRvbnMucHVzaChidXR0b25Nb2RlbCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZmxhdm9yQnV0dG9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlcmUgYXJlIG5vIGZsYXZvcnMgY29uZmlndXJlZCBvbiB2YWx2ZXMsIHNvIG5vIGZsYXZvcnMgYXJlIGF2YWlsYWJsZSB0byBVSVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmbGF2b3JCdXR0b25zO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRCaWJJdGVtVHlwZXMoKTogQnV0dG9uTW9kZWxbXSB7XG4gICAgICAgIC8vIFRPRE8gZGVzZWxlY3QgZWFjaCBpdGVtXG4gICAgICAgIHJldHVybiB0aGlzLnNlcnZpY2VVSVBvcHVwQnV0dG9ucy5CaWJJdGVtVHlwZXM7XG4gICAgfVxuXG4gICAgLy8gVE9ETyBpbXBsZW1lbnQ7IHRoaXMgdXNlcyBHZXRFdmVudFxuICAgIHB1YmxpYyByZWdpc3RlckJ1dHRvbkxpc3RMb2NhbGl6YXRpb24odG9waWM6IHN0cmluZywgb2JqOiBvYmplY3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHByaXZhdGUgZHVtcFZhbHZlQXNzaWdubWVudHMoaGVhZGVyTXNnOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCItLS0tLSBWYWx2ZSBBc3NpZ25tZW50czogXCIsIGhlYWRlck1zZyk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFRvcENvbWJpbmF0aW9uU3RhdGUoaXNGb3JDb25maWd1cmF0aW9uOiBib29sZWFuLCBmbGF2b3JzOiBCdXR0b25Nb2RlbFtdKSB7XG4gICAgICAgIGNvbnN0IHRvcENvbWJpbmF0aW9uczogQnV0dG9uTW9kZWxbXSA9IFtdO1xuICAgICAgICBjb25zdCB0b3BDb21iaW5hdGlvbnNSYXc6IEJ1dHRvbk1vZGVsW10gPSB0aGlzLmNvbmZpZ3VyYXRpb25SZXBvc2l0b3J5LmdldFRvcENvbWJpbmF0aW9uU3RhdGUoKTtcblxuICAgICAgICBjb25zdCBkaXNwZW5zYWJsZVJlY2lwZXMgPSB0aGlzLnByb2R1Y3REYXRhU2VydmljZS5nZXREaXNwZW5zYWJsZVJlY2lwZXModGhpcy52YWx2ZUFzc2lnbm1lbnRzKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGNvbWJpbmF0aW9uIG9mIHRvcENvbWJpbmF0aW9uc1Jhdykge1xuXG4gICAgICAgICAgICBjb21iaW5hdGlvbi5CdXR0b25UeXBlID0gQnV0dG9uVHlwZS50b3BDb21iaW5hdGlvbjtcbiAgICAgICAgICAgIGNvbWJpbmF0aW9uLklzU2VsZWN0ZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgY29uc3QgcmVjaXBlID0gXy5maW5kKGRpc3BlbnNhYmxlUmVjaXBlcywgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLklkID09PSBjb21iaW5hdGlvbi5JZDtcbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgIGlmIChyZWNpcGUgPT0gbnVsbCAmJiAoY29tYmluYXRpb24uTGFiZWwgPT09IFwiXCIgfHwgY29tYmluYXRpb24uTGFiZWwgPT09IHVuZGVmaW5lZCkgJiYgIWlzRm9yQ29uZmlndXJhdGlvbikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ29tYmluYXRpb24gYnV0dG9uIGlzIE5PVCBjb25maWd1cmVkOiBcIiArIGNvbWJpbmF0aW9uLklkICsgXCIgUmVtb3ZpbmcgQ29tYmluYXRpb24gQnV0dG9uXCIpO1xuXG4gICAgICAgICAgICAgICAgLy8gd2lsbCBub3QgYWRkIHRvIHRhcmdldCBhcnJheVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlIDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29tYmluYXRpb24ucGF5bG9hZCA9IHJlY2lwZTtcbiAgICAgICAgICAgICAgICB0b3BDb21iaW5hdGlvbnMucHVzaChjb21iaW5hdGlvbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyZWNpcGUgIT0gbnVsbCAmJiByZWNpcGUuYXJlQW55VmFsdmVzTG9ja2VkSW5SZWNpcGUoKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQSB2YWx2ZSBpcyBsb2NrZWQuIFwiICsgcmVjaXBlLk5hbWUgKyBcIiB3aWxsIG5vdCBiZSBkaXNwZW5zYWJsZS5cIik7XG4gICAgICAgICAgICAgICAgY29tYmluYXRpb24uSXNEaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoY29uc3QgZmxhdm9yIG9mIGNvbWJpbmF0aW9uLkJ1dHRvbk1vZGVsTGlzdCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGF2YWlsYWJsZUZsYXZvck9uVmFsdmVzID0gXy5maW5kKGZsYXZvcnMsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLklkID09IGZsYXZvci5JZDtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmIChhdmFpbGFibGVGbGF2b3JPblZhbHZlcyAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGZsYXZvci5wYXlsb2FkID0gYXZhaWxhYmxlRmxhdm9yT25WYWx2ZXMucGF5bG9hZDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmxhdm9ycmVjaXBlOiBSZWNpcGVJdGVtTW9kZWwgPSBmbGF2b3IucGF5bG9hZDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZsYXZvcnJlY2lwZS5hcmVBbnlWYWx2ZXNMb2NrZWRJblJlY2lwZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkEgdmFsdmUgaXMgbG9ja2VkLiBcIiArIGZsYXZvcnJlY2lwZS5OYW1lICsgXCIgd2lsbCBub3QgYmUgZGlzcGVuc2FibGUuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tYmluYXRpb24uSXNEaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb21iaW5hdGlvbi5Jc0Rpc2FibGVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvbWJpbmF0aW9uLklzRGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkaXNhYmxlZEJ1dHRvbk1vZGVsczogQnV0dG9uTW9kZWxbXSA9IFtdO1xuXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBidXR0b24gb2YgY29tYmluYXRpb24uQnV0dG9uTW9kZWxMaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbi5Jc0Rpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWRCdXR0b25Nb2RlbHMucHVzaChidXR0b24pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbWJpbmF0aW9uLkJ1dHRvbk1vZGVsTGlzdCA9IGRpc2FibGVkQnV0dG9uTW9kZWxzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgICByZXR1cm4gdG9wQ29tYmluYXRpb25zO1xuICAgIH1cblxuICAgIHB1YmxpYyB3cml0ZVRvcENvbWJpbmF0aW9uU3RhdGUoY29tYmluYXRpb25zOiBCdXR0b25Nb2RlbFtdKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLSBXcml0aW5nIFRvcENvbWJpbmF0aW9uIFN0YXRlIC0tLS1cIik7XG5cbiAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uUmVwb3NpdG9yeS53cml0ZVRvcENvbWJpbmF0aW9uU3RhdGUoY29tYmluYXRpb25zKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVzZXRUb3BDb21iaW5hdGlvbnMoKSB7XG4gICAgICAgIHRoaXMuY29uZmlndXJhdGlvblJlcG9zaXRvcnkucmVzZXRUb3BDb21iaW5hdGlvblN0YXRlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEN1cmF0ZWRNaXhvbG9neVN0YXRlKCk6IEJ1dHRvbk1vZGVsW10ge1xuICAgICAgICB0aGlzLm1peGVzID0gdGhpcy5jb25maWd1cmF0aW9uUmVwb3NpdG9yeS5nZXRNaXhvbG9neVN0YXRlKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCBidXR0b25Nb2RlbCBvZiB0aGlzLm1peGVzKSB7XG4gICAgICAgICAgICBidXR0b25Nb2RlbC5wYXlsb2FkID0gdGhpcy5wcm9kdWN0RGF0YVNlcnZpY2UuZ2V0UmVjaXBlKGJ1dHRvbk1vZGVsLklkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLm1peGVzO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRDdXJhdGVkTWl4b2xvZ3lTdGF0ZTIoKTogU2V0Q3VyYXRlZE1peEl0ZW1bXSB7XG4gICAgICAgIGNvbnN0IHNldEN1cmF0ZWRJdGVtUmF3ID0gdGhpcy5jb25maWd1cmF0aW9uUmVwb3NpdG9yeS5nZXRNaXhvbG9neVN0YXRlMigpO1xuICAgICAgICBjb25zdCByZXN1bHQ6IFNldEN1cmF0ZWRNaXhJdGVtW10gPSBbXTtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgXy5mb3JFYWNoKHNldEN1cmF0ZWRJdGVtUmF3LCBmdW5jdGlvbihpdGVtKXtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKEpzVXRpbC5tYXBUb05ld09iamVjdChpdGVtLCBuZXcgU2V0Q3VyYXRlZE1peEl0ZW0oKSkpO1xuICAgICAgICB9KTtcblxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgcHVibGljIHdyaXRlTWl4b2xvZ3lTdGF0ZShtaXhlczogQnV0dG9uTW9kZWxbXSkge1xuICAgICAgICB0aGlzLm1peGVzID0gbWl4ZXM7XG4gICAgICAgIHRoaXMuY29uZmlndXJhdGlvblJlcG9zaXRvcnkud3JpdGVNaXhvbG9neVN0YXRlKG1peGVzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVzZXRNaXhvbG9neSgpIHtcbiAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uUmVwb3NpdG9yeS5yZXNldE1peG9sb2d5U3RhdGUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbG9hZFZhbHZlQXNzaWdubWVudHMoKSB7XG4gICAgICAgIC8vIEJpYkl0ZW0gIC0gU0tVOyBhIHN5cnVwIGluIGEgYmFnIHRoYXQncyBpbiBhIGJveDsgZ2V0cyBhdHRhY2hlZCB0byBhIHZhbHZlXG4gICAgICAgIGNvbnN0IGJpYml0ZW1zOiBCdXR0b25Nb2RlbExpc3QgPSB0aGlzLnByb2R1Y3REYXRhU2VydmljZS5nZXRCaWJJdGVtcygpO1xuXG4gICAgICAgIC8vIGdldCBjdXJyZW50IHZhbHZlIEFzc2lnbm1lbnRzIGhlcmVcbiAgICAgICAgY29uc3QgdmFsdmVBc3NpZ25tZW50c1JhdyA9IHRoaXMudmFsdmVBc3NpZ25tZW50UmVwb3NpdG9yeS5nZXRDdXJyZW50VmFsdmVBc3NpZ25tZW50cygpO1xuXG4gICAgICAgIC8vIFRFU1RcbiAgICAgICAgdGhpcy52YWx2ZUFzc2lnbm1lbnRzID0gSnNVdGlsLm1hcFRvTmV3T2JqZWN0KHZhbHZlQXNzaWdubWVudHNSYXcsIG5ldyBWYWx2ZUFzc2lnbm1lbnQoKSk7XG5cbiAgICAgICAgY29uc3QgYXNzaWdubWVudFN0YXRlczogVmFsdmVBc3NpZ25tZW50U3RhdGVbXSA9IHRoaXMudmFsdmVBc3NpZ25tZW50cy5Bc3NpZ25tZW50cztcbiAgICAgICAgdGhpcy52YWx2ZUFzc2lnbm1lbnRzLkFzc2lnbm1lbnRzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYXNzaWdubWVudCBvZiBhc3NpZ25tZW50U3RhdGVzKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHZlQXNzaWdubWVudHMuQXNzaWdubWVudHMucHVzaChKc1V0aWwubWFwVG9OZXdPYmplY3QoYXNzaWdubWVudCwgbmV3IFZhbHZlQXNzaWdubWVudFN0YXRlKCkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFzc2lnbmVkVmFsdmVzID0gXy5maWx0ZXIodGhpcy52YWx2ZUFzc2lnbm1lbnRzLkFzc2lnbm1lbnRzLCBmdW5jdGlvbiAoaXRlbTogVmFsdmVBc3NpZ25tZW50U3RhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLlNLVSAmJiBpdGVtLlNLVSAhPT0gJyc7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZvciAoY29uc3QgdmFsdmVBc3NpZ25tZW50IG9mIGFzc2lnbmVkVmFsdmVzKSB7XG4gICAgICAgICAgICB2YWx2ZUFzc2lnbm1lbnQuQmliSXRlbUFzQnV0dG9uTW9kZWwgPSBfLmZpbmQoYmliaXRlbXMuQWxsVHlwZXMsIGZ1bmN0aW9uIChpdGVtOiBCdXR0b25Nb2RlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLklkID09PSB2YWx2ZUFzc2lnbm1lbnQuU0tVO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICh2YWx2ZUFzc2lnbm1lbnQuQmliSXRlbUFzQnV0dG9uTW9kZWwgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIj09PT09QmliSXRlbSBub3QgZm91bmQgZm9yIHZhbHZlIEFzc2lnbm1lbnQgezB9LCBTS1U6IHsxfVwiLCB2YWx2ZUFzc2lnbm1lbnQuVmFsdmVJZCwgdmFsdmVBc3NpZ25tZW50LlNLVSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkb2VzIERldmljZUluZm8uU3RhdGUuVW5pdFR5cGUgcmVmZXIgdG8gdGhlIGRlZmF1bHQgVW5pdFR5cGU/IG9yIHNvbWV0aGluZyBkaWZmZXJlbnQ/XG4gICAgICAgIGNvbnN0IHVuaXRjb25maWc6IFVuaXRDb25maWd1cmF0aW9uTW9kZWwgPSB0aGlzLnZhbHZlQXNzaWdubWVudFJlcG9zaXRvcnkuZ2V0Q29uZmlndXJhdGlvbkJ5SWQoXCJEcml2ZVRocnVcIik7XG5cbiAgICAgICAgZm9yIChjb25zdCB2YWx2ZUFzc2lnbm1lbnQgb2YgdGhpcy52YWx2ZUFzc2lnbm1lbnRzLkFzc2lnbm1lbnRzKSB7XG5cbiAgICAgICAgICAgIC8vIFRPRE8gZ2V0IEFsbFZhbHZlTGFiZWxQYWlyc1xuICAgICAgICAgICAgdmFsdmVBc3NpZ25tZW50LlZhbHZlTGFiZWxQYWlyID0gXy5maW5kKHVuaXRjb25maWcuQWxsVmFsdmVMYWJlbFBhaXJzLCBmdW5jdGlvbiAoaXRlbTogVmFsdmVMYWJlbFBhaXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS52YWx2ZUxhYmVsID09PSB2YWx2ZUFzc2lnbm1lbnQuVmFsdmVJZDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAodmFsdmVBc3NpZ25tZW50LlZhbHZlTGFiZWxQYWlyID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJ2YWx2ZSBub3QgZm91bmQgZm9yIFZhbHZlQXNzaWdubWVudCwgdmFsdmU6XCIsIHZhbHZlQXNzaWdubWVudC5WYWx2ZUlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXRDdXJyZW50VmFsdmVBc3NpZ25tZW50c0FzQnV0dG9uTW9kZWxzKCk6IEJ1dHRvbk1vZGVsW10ge1xuICAgICAgICBjb25zdCB3YXRlcklkczogc3RyaW5nW10gPSBbJzAxMTEnLCAnMDIyMicsICcwMzMzJywgJzA0NDQnXTtcbiAgICAgICAgY29uc3QgY3VycmVudFZhbHZlQXNzaWdubWVudHNBc0J1dHRvbk1vZGVsczogQnV0dG9uTW9kZWxbXSA9IFtdO1xuXG4gICAgICAgIGNvbnN0IGNvbmZpZ0ZvclRoaXNVbml0ID0gdGhpcy52YWx2ZUFzc2lnbm1lbnRSZXBvc2l0b3J5LmdldENvbmZpZ3VyYXRpb25CeUlkKERldmljZUluZm8udW5pdFN0YXRlLlVuaXRUeXBlKTtcblxuICAgICAgICBmb3IgKGNvbnN0IHZhbHZlQXNzaWdubWVudFJvdyBvZiBjb25maWdGb3JUaGlzVW5pdC5WYWx2ZUxheW91dCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCB2YWx2ZSBvZiB2YWx2ZUFzc2lnbm1lbnRSb3cuVmFsdmVMYWJlbFBhaXIpIHtcbiAgICAgICAgICAgICAgICBsZXQgYnV0dG9uTW9kZWwgPSBfLmZpbmQodGhpcy52YWx2ZUFzc2lnbm1lbnRCdXR0b25Nb2RlbHMsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmtleSA9PSB2YWx2ZS5Sb3c7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoYnV0dG9uTW9kZWwgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBidXR0b25Nb2RlbCA9IG5ldyBCdXR0b25Nb2RlbCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHZlQXNzaWdubWVudEJ1dHRvbk1vZGVsc1t2YWx2ZS5Sb3ddID0gYnV0dG9uTW9kZWw7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy9idXR0b25Nb2RlbC5CdXR0b25UeXBlID0gQnV0dG9uVHlwZS5WYWx2ZUJ1dHRvblxuICAgICAgICAgICAgICAgIC8vYnV0dG9uTW9kZWwuQnV0dG9uQmVoYXZpb3JcbiAgICAgICAgICAgICAgICBidXR0b25Nb2RlbC5BY3Rpb25JZCA9IFwicG9wdXAudmFsdmUuYXNzaWdubWVudFwiO1xuICAgICAgICAgICAgICAgIC8vYnV0dG9uTW9kZWwuRm9vdGVyVGV4dCA9IHZhbHZlLkdldExhYmVsXG4gICAgICAgICAgICAgICAgYnV0dG9uTW9kZWwuV2VpZ2h0aW5nID0gdmFsdmUuV2VpZ2h0aW5nO1xuICAgICAgICAgICAgICAgIGJ1dHRvbk1vZGVsLkJhY2tncm91bmRDb2xvciA9IFwiV2hpdGVcIjtcbiAgICAgICAgICAgICAgICBidXR0b25Nb2RlbC5Sb3dOdW1iZXIgPSB2YWx2ZS5Sb3c7XG5cbiAgICAgICAgICAgICAgICBsZXQgdmFsdmVBc3NpZ25tZW50U3RhdGUgPSBfLmZpbmQodGhpcy52YWx2ZUFzc2lnbm1lbnRzLkFzc2lnbm1lbnRzLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5WYWx2ZUlkID09IHZhbHZlLnZhbHZlTGFiZWw7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdmVBc3NpZ25tZW50U3RhdGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB2YWx2ZUFzc2lnbm1lbnRTdGF0ZSA9IG5ldyBWYWx2ZUFzc2lnbm1lbnRTdGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB2YWx2ZUFzc2lnbm1lbnRTdGF0ZS5WYWx2ZUlkID0gdmFsdmUudmFsdmVMYWJlbDtcbiAgICAgICAgICAgICAgICAgICAgdmFsdmVBc3NpZ25tZW50U3RhdGUuVmFsdmVMYWJlbFBhaXIgPSB2YWx2ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YWx2ZUFzc2lnbm1lbnRzLkFzc2lnbm1lbnRzLnB1c2godmFsdmVBc3NpZ25tZW50U3RhdGUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGJ1dHRvbk1vZGVsLnBheWxvYWQgPSB2YWx2ZUFzc2lnbm1lbnRTdGF0ZTtcblxuICAgICAgICAgICAgICAgIGlmICh2YWx2ZUFzc2lnbm1lbnRTdGF0ZS5TS1UgPT09IFwiXCIgfHwgdmFsdmVBc3NpZ25tZW50U3RhdGUuU0tVID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbk1vZGVsLkxhYmVsID0gXCJVbkFzc2lnbmVkXCI7XG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbk1vZGVsLlJlc291cmNlSWQgPSBcIm5vdF9pbl91c2VfaWRcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBidXR0b25Nb2RlbC5MYWJlbCA9IHZhbHZlQXNzaWdubWVudFN0YXRlLkJpYkl0ZW1Bc0J1dHRvbk1vZGVsLkxhYmVsO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh3YXRlcklkcy5pbmRleE9mKHZhbHZlQXNzaWdubWVudFN0YXRlLkJpYkl0ZW1Bc0J1dHRvbk1vZGVsLklkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uTW9kZWwuUGF0aFRvSW1hZ2UgPSBcIlwiO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHZhbHZlQXNzaWdubWVudFN0YXRlLkJpYkl0ZW1Bc0J1dHRvbk1vZGVsLklkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIjAxMTFcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b25Nb2RlbC5SZXNvdXJjZUlkID0gXCJoaWdoX2NhcmJfaWRcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCIwMjIyXCI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uTW9kZWwuUmVzb3VyY2VJZCA9IFwiaGlnaF9zdGlsbF9pZFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIjAzMzNcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b25Nb2RlbC5SZXNvdXJjZUlkID0gXCJsb3dfY2FyYl9pZFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIjA0NDRcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b25Nb2RlbC5SZXNvdXJjZUlkID0gXCJsb3dfc3RpbGxfaWRcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uTW9kZWwuQmFja2dyb3VuZENvbG9yID0gdmFsdmVBc3NpZ25tZW50U3RhdGUuQmliSXRlbUFzQnV0dG9uTW9kZWwuUGF0aFRvSW1hZ2U7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBidXR0b25Nb2RlbC5CYWNrZ3JvdW5kQ29sb3IgPSB2YWx2ZUFzc2lnbm1lbnRTdGF0ZS5CaWJJdGVtQXNCdXR0b25Nb2RlbC5CYWNrZ3JvdW5kQ29sb3I7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY3VycmVudFZhbHZlQXNzaWdubWVudHNBc0J1dHRvbk1vZGVscy5wdXNoKGJ1dHRvbk1vZGVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPRE8gaW1wbGVtZW50XG4gICAgICAgIHRoaXMudmVyaWZ5VmFsdmVBc3NpZ25tZW50U3RhdGUoY29uZmlnRm9yVGhpc1VuaXQpO1xuXG4gICAgICAgIGNvbnN0IHNvcnRlZFZhbHZlQXNzaWdubWVudHMgPSBfLm9yZGVyYnkoY3VycmVudFZhbHZlQXNzaWdubWVudHNBc0J1dHRvbk1vZGVscywgWydXZWlnaHRpbmcnXSwgWydhc2MnXSk7XG5cbiAgICAgICAgLy8gVE9ETyBpbXBsZW1lbnRcbiAgICAgICAgLy90aGlzLnJlZ2lzdGVyQnV0dG9uTGlzdExvY2FsaXphdGlvbihcInZhbHZlQXNzaWdubWVudHNcIiwgc29ydGVkVmFsdmVBc3NpZ25tZW50cyk7XG5cbiAgICAgICAgcmV0dXJuIHNvcnRlZFZhbHZlQXNzaWdubWVudHM7XG4gICAgfVxuXG4gICAgLy8gVE9ETyB0ZXN0XG4gICAgcHVibGljIHZlcmlmeUN1cmF0ZWRNaXhTdGF0ZSh2YWx2ZVN0YXRlLCBuZXdTa3U6IHN0cmluZykge1xuICAgICAgICBpZiAodGhpcy5pc1JlYXNzaWduZWRWYWx2ZUFuRXF1aXZhbGVudFNrdSh2YWx2ZVN0YXRlLCBuZXdTa3UpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjdXJhdGVkQnV0dG9uc1RvUmVtb3ZlOiBCdXR0b25Nb2RlbFtdID0gW107XG4gICAgICAgIGNvbnN0IGNvbmZpZ3VyYXRlZEN1cmF0ZWRCdXR0b25zID0gdGhpcy5nZXRDdXJhdGVkTWl4b2xvZ3lTdGF0ZSgpO1xuXG4gICAgICAgIGNvbnN0IGNvbmZpZ3VyYXRlZEN1cmF0ZWRCdXR0b25zV2l0aFBheWxvYWQgPSBfLmZpbHRlcihjb25maWd1cmF0ZWRDdXJhdGVkQnV0dG9ucywgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLnBheWxvYWQgIT09IG51bGw7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZvciAoY29uc3QgYnV0dG9uTW9kZWwgb2YgY29uZmlndXJhdGVkQ3VyYXRlZEJ1dHRvbnNXaXRoUGF5bG9hZCkge1xuICAgICAgICAgICAgY29uc3Qgc2t1VG9WYWx2ZU1hcHBpbmdzQWdncmVnYXRlZDogU2t1VG9WYWx2ZU1hcHBpbmdbXSA9IFtdO1xuXG4gICAgICAgICAgICBjb25zdCByZWNpcGUgPSBidXR0b25Nb2RlbC5wYXlsb2FkO1xuXG4gICAgICAgICAgICBza3VUb1ZhbHZlTWFwcGluZ3NBZ2dyZWdhdGVkLmNvbmNhdChyZWNpcGUuU2t1VG9WYWx2ZU1hcHBpbmdzKTtcblxuICAgICAgICAgICAgZm9yIChjb25zdCBza3VUb1ZhbHZlTWFwcGluZyBvZiBza3VUb1ZhbHZlTWFwcGluZ3NBZ2dyZWdhdGVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNrdVRvVmFsdmVNYXBwaW5nLnZhbHZlQXNzaWdubWVudFN0YXRlID09IHZhbHZlU3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFfLmZpbmQoY3VyYXRlZEJ1dHRvbnNUb1JlbW92ZSwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbSA9PSBidXR0b25Nb2RlbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJhdGVkQnV0dG9uc1RvUmVtb3ZlLnB1c2goYnV0dG9uTW9kZWwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjdXJhdGVkQnV0dG9uc1RvUmVtb3ZlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGJ1dHRvbk1vZGVsc0Zyb21TZWVkID0gdGhpcy5jb25maWd1cmF0aW9uUmVwb3NpdG9yeS5nZXRDdXJhdGVkTWl4U2VlZCgpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBidXR0b24gb2YgY3VyYXRlZEJ1dHRvbnNUb1JlbW92ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gY29uZmlndXJhdGVkQ3VyYXRlZEJ1dHRvbnMuaW5kZXhPZihidXR0b24pO1xuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRlZEN1cmF0ZWRCdXR0b25zW2luZGV4XSA9IGJ1dHRvbk1vZGVsc0Zyb21TZWVkW2luZGV4XTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy53cml0ZU1peG9sb2d5U3RhdGUoY29uZmlndXJhdGVkQ3VyYXRlZEJ1dHRvbnMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVE9ETyBmaW5pc2hcbiAgICBwdWJsaWMgaXNSZWFzc2lnbmVkVmFsdmVBbkVxdWl2YWxlbnRTa3UodmFsdmVTdGF0ZTogVmFsdmVBc3NpZ25tZW50U3RhdGUsIG5ld1NrdTogc3RyaW5nKSB7XG4gICAgICAgIGlmIChuZXdTa3UgIT09IG51bGwgJiYgbmV3U2t1ICE9PSBcIlwiICYmIHZhbHZlU3RhdGUuU0tVICE9PSBudWxsICYmIHZhbHZlU3RhdGUuU0tVICE9PSBcIlwiKSB7XG4gICAgICAgICAgICBjb25zdCBza3VMaXN0OiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICAgICAgLy8gdGhpcy5wcm9kdWN0RGF0YVNlcnZpY2UuZ2V0U2t1TGlzdCgpLlRyeUdldFZhbHVlKHZhbHZlU3RhdGUuU0tVLCBvdXQgc2t1TGlzdCk7XG4gICAgICAgICAgICBpZiAoc2t1TGlzdCAhPSBudWxsICYmIF8uZmluZChza3VMaXN0LCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbSA9PSBuZXdTa3U7XG4gICAgICAgICAgICAgICAgfSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2ZXJpZnlUb3BDb21iaW5hdGlvblN0YXRlKHZhbHZlU3RhdGU6IFZhbHZlQXNzaWdubWVudFN0YXRlLCBuZXdTa3U6IHN0cmluZykge1xuXG4gICAgICAgIGlmICh0aGlzLmlzUmVhc3NpZ25lZFZhbHZlQW5FcXVpdmFsZW50U2t1KHZhbHZlU3RhdGUsIG5ld1NrdSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvbWJpbmF0aW9uc1RvUmVtb3ZlOiBCdXR0b25Nb2RlbFtdID0gW107XG4gICAgICAgIGNvbnN0IGNvbWJpbmF0aW9uQnV0dG9ucyA9IHRoaXMuZ2V0VG9wQ29tYmluYXRpb25TdGF0ZSh0cnVlLCB0aGlzLmdldEZsYXZvcnNGb3JDb25zdW1lclVJKCkpO1xuXG4gICAgICAgIGNvbnN0IGNvbWJpbmF0aW9uQnV0dG9uc1dpdGhQYXlsb2FkID0gXy5maWx0ZXIoY29tYmluYXRpb25CdXR0b25zLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW0gPT09IGl0ZW0ucGF5bG9hZCAhPT0gbnVsbDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZm9yIChjb25zdCBidXR0b25Nb2RlbCBvZiBjb21iaW5hdGlvbkJ1dHRvbnNXaXRoUGF5bG9hZCkge1xuICAgICAgICAgICAgY29uc3Qgc2t1VG9WYWx2ZU1hcHBpbmdzQWdncmVnYXRlZDogU2t1VG9WYWx2ZU1hcHBpbmdbXSA9IFtdO1xuXG4gICAgICAgICAgICBsZXQgcmVjaXBlID0gYnV0dG9uTW9kZWwucGF5bG9hZDtcblxuICAgICAgICAgICAgc2t1VG9WYWx2ZU1hcHBpbmdzQWdncmVnYXRlZC5jb25jYXQocmVjaXBlLlNrdVRvVmFsdmVNYXBwaW5ncyk7XG5cbiAgICAgICAgICAgIGZvciAoY29uc3QgZmxhdm9yQnV0dG9uIG9mIGJ1dHRvbk1vZGVsLkJ1dHRvbk1vZGVsTGlzdCkge1xuICAgICAgICAgICAgICAgIHJlY2lwZSA9IGZsYXZvckJ1dHRvbi5wYXlsb2FkO1xuICAgICAgICAgICAgICAgIGlmIChyZWNpcGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgc2t1VG9WYWx2ZU1hcHBpbmdzQWdncmVnYXRlZC5jb25jYXQocmVjaXBlLlNrdVRvVmFsdmVNYXBwaW5ncyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJWYWx2ZSBVbkFzc2lnbm1lbnQgaXMgaW5jb3JyZWN0IHdpdGggcmVzcGVjdCB0byB2ZXJpZnlpbmcgVG9wQ29tYmluYXRpb25cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHNrdVRvVmFsdmVNYXBwaW5nIG9mIHNrdVRvVmFsdmVNYXBwaW5nc0FnZ3JlZ2F0ZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2t1VG9WYWx2ZU1hcHBpbmcudmFsdmVBc3NpZ25tZW50U3RhdGUgPT0gdmFsdmVTdGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIV8uZmluZChjb21iaW5hdGlvbnNUb1JlbW92ZSwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbSA9PSBidXR0b25Nb2RlbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21iaW5hdGlvbnNUb1JlbW92ZS5wdXNoKGJ1dHRvbk1vZGVsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29tYmluYXRpb25zVG9SZW1vdmUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgYnV0dG9uTW9kZWxzRnJvbVNlZWQgPSB0aGlzLmNvbmZpZ3VyYXRpb25SZXBvc2l0b3J5LmdldFRvcENvbWJpbmF0aW9uU2VlZCgpO1xuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGJ1dHRvbiBvZiBjb21iaW5hdGlvbnNUb1JlbW92ZSkge1xuXG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBjb21iaW5hdGlvbkJ1dHRvbnMuaW5kZXhPZihidXR0b24pO1xuICAgICAgICAgICAgICAgIGNvbWJpbmF0aW9uQnV0dG9uc1tpbmRleF0gPSBidXR0b25Nb2RlbHNGcm9tU2VlZFtpbmRleF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMud3JpdGVUb3BDb21iaW5hdGlvblN0YXRlKGNvbWJpbmF0aW9uQnV0dG9ucyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUT0RPIHRlc3RcbiAgICBwcml2YXRlIHZlcmlmeVZhbHZlQXNzaWdubWVudFN0YXRlKHVuaXRDb25maWc6IFVuaXRDb25maWd1cmF0aW9uTW9kZWwpIHtcbiAgICAgICAgbGV0IGFueUJhZCA9IGZhbHNlO1xuICAgICAgICBmb3IgKGNvbnN0IHZhbHZlQXNzaWdubWVudCBvZiB0aGlzLnZhbHZlQXNzaWdubWVudHMuQXNzaWdubWVudHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHVuaXRWYWx2ZSA9IF8uZmluZCh1bml0Q29uZmlnLkFsbFZhbHZlTGFiZWxQYWlycywgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS52YWx2ZUxhYmVsID09IHZhbHZlQXNzaWdubWVudC5WYWx2ZUlkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAodW5pdFZhbHZlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBhbnlCYWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSB2YWx2ZUFzc2lnbm1lbnRcbiAgICAgICAgICAgICAgICAvLyBUT0RPIHRlc3QsIG5vdCBzdXJlIGlmIHRoaXMgaXMgdGhlIGNvcnJlY3Qgd2F5IHRvIHJlbW92ZSBpbiB0eXBlc2NyaXB0XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLnZhbHZlQXNzaWdubWVudHMuQXNzaWdubWVudHMuaW5kZXhPZih2YWx2ZUFzc2lnbm1lbnQpO1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdmVBc3NpZ25tZW50cy5Bc3NpZ25tZW50cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRml4aW5nIHVwIFZhbHZlQXNzaWdubWVudFN0YXRlLCBleGlzdGluZyBjb25maWcgZG9lcyBub3QgY29udGFpbiB0aGlzIHZhbHZlOiBcIiArIHZhbHZlQXNzaWdubWVudC5WYWx2ZUlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoYW55QmFkKSB7XG4gICAgICAgICAgICAvL3RoaXMudmFsdmVBc3NpZ25tZW50UmVwb3NpdG9yeS53cml0ZVZhbHZlQXNzaWdubWVudHModGhpcy52YWx2ZUFzc2lnbm1lbnRzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRPRE8gZmluaXNoXG4gICAgcHVibGljIHdyaXRlVmFsdmVBc3NpZ25tZW50KHZhbHZlVG9Db25maWd1cmU6IEJ1dHRvbk1vZGVsLCBzZWxlY3RlZEJpYkl0ZW06IEJ1dHRvbk1vZGVsKSB7XG4gICAgICAgIHRoaXMuZHVtcFZhbHZlQXNzaWdubWVudHMoXCJCZWZvcmVcIik7XG5cbiAgICAgICAgaWYgKHNlbGVjdGVkQmliSXRlbSA9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vIFNlbGVjdGVkIEJpYkl0ZW0sIG5vdCBjaGFuZ2luZyB2YWx2ZSBhc3NpZ25tZW50LlwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHZhbHZlU3RhdGUgPSB2YWx2ZVRvQ29uZmlndXJlLnBheWxvYWQ7XG5cbiAgICAgICAgaWYgKCFfLmZpbmQodGhpcy52YWx2ZUFzc2lnbm1lbnRzLkFzc2lnbm1lbnRzLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtID09IHZhbHZlU3RhdGU7XG4gICAgICAgICAgICB9KSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciBpbiBWYWx2ZUNvbmZpZ3VyYXRpb25cIik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXdCaWJJdGVtID0gc2VsZWN0ZWRCaWJJdGVtLnBheWxvYWQ7XG4gICAgICAgIGNvbnN0IG5ld1NrdSA9IG5ld0JpYkl0ZW0gPT0gbnVsbCA/IFwiXCIgOiBuZXdCaWJJdGVtLlNLVTtcbiAgICAgICAgY29uc3Qgb2xkU2t1ID0gdmFsdmVTdGF0ZS5TS1U7XG5cbiAgICAgICAgdGhpcy52ZXJpZnlUb3BDb21iaW5hdGlvblN0YXRlKHZhbHZlU3RhdGUsIG5ld1NrdSk7XG4gICAgICAgIHRoaXMudmVyaWZ5Q3VyYXRlZE1peFN0YXRlKHZhbHZlU3RhdGUsIG5ld1NrdSk7XG4gICAgICAgIGNvbnN0IGludmVudG9yeU1hcHBpbmdFdmVudEluZm8gPSBuZXcgSW52ZW50b3J5TWFwcGluZygpO1xuXG4gICAgICAgIGlmIChzZWxlY3RlZEJpYkl0ZW0gPT0gbnVsbCB8fCBzZWxlY3RlZEJpYkl0ZW0uQWN0aW9uSWQgPT0gXCJ1bmFzc2lnblwiKSB7XG4gICAgICAgICAgICAvKmludmVudG9yeU1hcHBpbmdFdmVudEluZm8uVmFsdmVBY3Rpb25zLnB1c2goIHtcbiAgICAgICAgICAgICAgIFNLVTogdmFsdmVTdGF0ZS5TS1UsXG4gICAgICAgICAgICAgICBJRDogdmFsdmVTdGF0ZS5WYWx2ZUxhYmVsUGFpci5WYWx2ZU51bWJlcixcbiAgICAgICAgICAgICAgIFR5cGU6IFZhbHZlQWN0aW9uLkFjdGlvblR5cGUuUmVtb3ZlZFxuICAgICAgICAgICAgfSApOyAqL1xuXG4gICAgICAgICAgICB2YWx2ZVN0YXRlLnVuQXNzaWduVmFsdmUoKTtcbiAgICAgICAgICAgIC8vIFRPRE8gYXJlIHdlIGltcGxlbWVudGluZyBsb2NhbGl6YXRpb25TZXJ2aWNlP1xuICAgICAgICAgICAgdmFsdmVUb0NvbmZpZ3VyZS5MYWJlbCA9IFwibm90X2luX3VzZV9pZFwiO1xuICAgICAgICAgICAgdmFsdmVUb0NvbmZpZ3VyZS5QYXRoVG9JbWFnZSA9IFwiXCI7XG4gICAgICAgICAgICB2YWx2ZVRvQ29uZmlndXJlLkJhY2tncm91bmRDb2xvciA9IFwiXCI7XG4gICAgICAgICAgICB2YWx2ZVRvQ29uZmlndXJlLlJlc291cmNlSWQgPSBcIm5vdF9pbl91c2VfaWRcIjtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG9sZFNrdSAhPSBudWxsICYmIG9sZFNrdSAhPSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgLy9pbnZlbnRvcnlNYXBwaW5nRXZlbnRJbmZvLlZhbHZlQWN0aW9uc1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBza3UgPSBzZWxlY3RlZEJpYkl0ZW0ucGF5bG9hZC5TS1U7XG4gICAgICAgICAgICB2YWx2ZVN0YXRlLmFzc2lnblZhbHZlKHNrdSwgc2VsZWN0ZWRCaWJJdGVtKTtcblxuICAgICAgICAgICAgdmFsdmVUb0NvbmZpZ3VyZS5MYWJlbCA9IHNlbGVjdGVkQmliSXRlbS5wYXlsb2FkLk5hbWU7XG4gICAgICAgICAgICB2YWx2ZVRvQ29uZmlndXJlLlBhdGhUb0ltYWdlID0gc2VsZWN0ZWRCaWJJdGVtLlBhdGhUb0ltYWdlO1xuICAgICAgICAgICAgdmFsdmVUb0NvbmZpZ3VyZS5CYWNrZ3JvdW5kQ29sb3IgPSBzZWxlY3RlZEJpYkl0ZW0uQmFja2dyb3VuZENvbG9yO1xuXG4gICAgICAgICAgICAvLyBwdXNoIGludmVudG9yeU1hcHBpbmdFdmVudEluZm9cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudmFsdmVBc3NpZ25tZW50UmVwb3NpdG9yeS53cml0ZVZhbHZlQXNzaWdubWVudHModGhpcy52YWx2ZUFzc2lnbm1lbnRzKTtcbiAgICAgICAgdGhpcy51cGRhdGVFdmVudFZhbHZlQXNzaWdubWVudHMoaW52ZW50b3J5TWFwcGluZ0V2ZW50SW5mbyk7XG5cbiAgICAgICAgLy8gREJVdGlsLlBvc3RFdmVudERhdGFcbiAgICB9XG5cbiAgICBwdWJsaWMgc2F2ZVZhbHZlQXNzaWdubWVudHMoKSB7XG4gICAgICAgIHRoaXMudmFsdmVBc3NpZ25tZW50UmVwb3NpdG9yeS53cml0ZVZhbHZlQXNzaWdubWVudHModGhpcy52YWx2ZUFzc2lnbm1lbnRzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUV2ZW50VmFsdmVBc3NpZ25tZW50cyhpbnZlbnRvcnlNYXBwaW5nRXZlbnRJbmZvOiBJbnZlbnRvcnlNYXBwaW5nKSB7XG4gICAgICAgIGZvciAoY29uc3QgdmFsdmVBc3NpZ25tZW50U3RhdGUgb2YgXy5maWx0ZXIodGhpcy52YWx2ZUFzc2lnbm1lbnRzLkFzc2lnbm1lbnRzLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW0uSXNBc3NpZ25lZDtcbiAgICAgICAgfSkpIHtcbiAgICAgICAgICAgIGludmVudG9yeU1hcHBpbmdFdmVudEluZm8uVmFsdmVBc3NpZ25tZW50cy5wdXNoKEpzVXRpbC5tYXBUb05ld09iamVjdCh7XG4gICAgICAgICAgICAgICAgSUQ6IHZhbHZlQXNzaWdubWVudFN0YXRlLlZhbHZlTGFiZWxQYWlyLlZhbHZlTnVtYmVyLFxuICAgICAgICAgICAgICAgIFNLVTogdmFsdmVBc3NpZ25tZW50U3RhdGUuU0tVXG4gICAgICAgICAgICB9LCBuZXcgVmFsdmVBc3NpZ25tZW50KCkpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBnZXRDaGFuZ2VWYWx2ZU1lbnVCdXR0b25zKCk6IEJ1dHRvbk1vZGVsW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5oYXNQZXJtaXNzaW9ucyh0aGlzLnNlcnZpY2VVSVBvcHVwQnV0dG9ucy5DaGFuZ2VWYWx1ZU1lbnVPcHRpb25zKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0VG9wQ29tYmluYXRpb25TZWVkKCk6IEJ1dHRvbk1vZGVsW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWd1cmF0aW9uUmVwb3NpdG9yeS5nZXRUb3BDb21iaW5hdGlvblNlZWQoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0UHJpbWluZ0J1dHRvbnMoKTogQnV0dG9uTW9kZWxbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhc1Blcm1pc3Npb25zKHRoaXMuc2VydmljZVVJUG9wdXBCdXR0b25zLlByaW1pbmcpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRQcmltaW5nVmFsdmVCdXR0b25zKCk6IEJ1dHRvbk1vZGVsW10ge1xuICAgICAgICBjb25zdCBwcmltZUJ1dHRvbnM6IEJ1dHRvbk1vZGVsW10gPSB0aGlzLmdldEN1cnJlbnRWYWx2ZUFzc2lnbm1lbnRzQXNCdXR0b25Nb2RlbHMoKTtcblxuICAgICAgICBmb3IgKGNvbnN0IGJ1dHRvbiBpbiBwcmltZUJ1dHRvbnMpIHtcbiAgICAgICAgICAgIC8vIGJ1dHRvbi5BY3Rpb25JZCA9IFwiXCI7XG4gICAgICAgICAgICAvL2J1dHRvbi5CdXR0b25CZWhhdmlvclxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHByaW1lQnV0dG9ucztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0VmFsdmVQcmltaW5nQnV0dG9ucygpOiBCdXR0b25Nb2RlbFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzUGVybWlzc2lvbnModGhpcy5zZXJ2aWNlVUlQb3B1cEJ1dHRvbnMuVmFsdmVQcmltaW5nKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbnZlcnRSZWNpcGVUb0J1dHRvbk1vZGVsKHJlY2lwZTogUmVjaXBlSXRlbU1vZGVsKTogQnV0dG9uTW9kZWwge1xuXG4gICAgICAgIGNvbnN0IHZpc3VhbCA9IHRoaXMucHJvZHVjdERhdGFTZXJ2aWNlLmdldFZpc3VhbEZvclJlY2lwZShyZWNpcGUpO1xuXG4gICAgICAgIC8vIFRPRE8gY3VycmVudGx5IHRoZSBCdXR0b25Nb2RlbCBjbGFzcyBpcyBpbiBhIHNlcGFyYXRlIGZpbGUgaW4gdGhlIEMjIGFwcDsgc2hvdWxkIGl0IGdldCBjaGFuZ2VkIHRvXG4gICAgICAgIGNvbnN0IGJ1dHRvbk1vZGVsOiBCdXR0b25Nb2RlbCA9IEpzVXRpbC5tYXBUb05ld09iamVjdCh7XG4gICAgICAgICAgICBJZDogcmVjaXBlLk5hbWUsXG4gICAgICAgICAgICBMYWJlbDogcmVjaXBlLk5hbWUsXG4gICAgICAgICAgICBSZWNpcGVJZDogcmVjaXBlLklkLFxuICAgICAgICAgICAgUGF0aFRvSW1hZ2U6IHZpc3VhbCA/ICh2aXN1YWwuZGVzaWduLmFzc2V0cy5sb2dvSG9tZSAhPSBudWxsID8gdmlzdWFsLmRlc2lnbi5hc3NldHMubG9nb0hvbWUgOiB2aXN1YWwuZGVzaWduLmFzc2V0cy5sb2dvQnJhbmQpIDogXCJcIixcbiAgICAgICAgICAgIHBheWxvYWQ6IHJlY2lwZSxcbiAgICAgICAgfSwgbmV3IEJ1dHRvbk1vZGVsKCkpO1xuXG4gICAgICAgIGlmIChyZWNpcGUuYXJlQW55VmFsdmVzTG9ja2VkSW5SZWNpcGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQSB2YWx2ZSBpcyBsb2NrZWQuIFwiICsgcmVjaXBlLk5hbWUgKyBcIiB3aWxsIG5vdCBiZSBkaXNwZW5zYWJsZS5cIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYnV0dG9uTW9kZWw7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0U2VydmljZVVJKCkge1xuICAgICAgICAvLyB3aWxsIG5lZWQgdG8gZmlsdGVyIGJ5IHBlcm1pc3Npb25zIGFuZCB1bml0dHlwZVxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWd1cmF0aW9uUmVwb3NpdG9yeS5nZXRTZXJ2aWNlVUkoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Q29uZmlybUJ1dHRvbnMoKTogQnV0dG9uTW9kZWxbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlcnZpY2VVSVBvcHVwQnV0dG9ucy5Db25maXJtQnV0dG9ucztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Q29uc3VtZXJMYW5ndWFnZXMoKTogQnV0dG9uTW9kZWxbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlcnZpY2VVSVBvcHVwQnV0dG9ucy5Db25zdW1lckxhbmd1YWdlcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0UmVjaXBlUG9wdXBCdXR0b25zKCk6IEJ1dHRvbk1vZGVsW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXJ2aWNlVUlQb3B1cEJ1dHRvbnMuUmVjaXBlcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0Rmxvd1JhdGVCdXR0b25zKCk6IEJ1dHRvbk1vZGVsW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5zZXJ2aWNlVUlQb3B1cEJ1dHRvbnMuRmxvd1JhdGVzO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRNYWNoaW5lU3RhdHVzQnV0dG9ucygpOiBCdXR0b25Nb2RlbFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VydmljZVVJUG9wdXBCdXR0b25zLk1hY2hpbmVTdGF0dXM7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFVuaXRMb2NhdGlvbkJ1dHRvbnMoKTogQnV0dG9uTW9kZWxbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlcnZpY2VVSVBvcHVwQnV0dG9ucy5Vbml0TG9jYXRpb247XG4gICAgfVxuXG4gICAgcHVibGljIGdldE1vZGVtQ29ubmVjdGl2aXR5QnV0dG9ucygpOiBCdXR0b25Nb2RlbFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VydmljZVVJUG9wdXBCdXR0b25zLk1vZGVtQ29ubmVjdGl2aXR5O1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRTeXN0ZW1TaHV0ZG93bkJ1dHRvbnMoKTogQnV0dG9uTW9kZWxbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhc1Blcm1pc3Npb25zKHRoaXMuc2VydmljZVVJUG9wdXBCdXR0b25zLlNodXRkb3duT3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldERpc3BsYXlPZmZCdXR0b25zKCk6IEJ1dHRvbk1vZGVsW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5oYXNQZXJtaXNzaW9ucyh0aGlzLnNlcnZpY2VVSVBvcHVwQnV0dG9ucy5EaXNwbGF5T2ZmT3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFZhbHZlTG9ja0J1dHRvbnMoKTogQnV0dG9uTW9kZWxbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhc1Blcm1pc3Npb25zKHRoaXMuc2VydmljZVVJUG9wdXBCdXR0b25zLlZhbHZlTG9ja09wdGlvbnMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRMZWdhY3lWYWx2ZXNTdGF0ZSgpOiBCdXR0b25Nb2RlbFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvblJlcG9zaXRvcnkuZ2V0TGVnYWN5VmFsdmVzU3RhdGUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0TGVnYWN5VmFsdmVzU2VlZCgpOiBCdXR0b25Nb2RlbFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvblJlcG9zaXRvcnkuZ2V0TGVnYWN5VmFsdmVzU2VlZCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyByZXNldExlZ2FjeVZhbHZlcygpIHtcbiAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uUmVwb3NpdG9yeS5yZXNldExlZ2FjeVZhbHZlc1N0YXRlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHdyaXRlTGVnYWN5VmFsdmVzU3RhdGUobGVnYWN5VmFsdmVzOiBCdXR0b25Nb2RlbFtdKSB7XG4gICAgICAgIHRoaXMuY29uZmlndXJhdGlvblJlcG9zaXRvcnkud3JpdGVMZWdhY3lWYWx2ZXNTdGF0ZShsZWdhY3lWYWx2ZXMpO1xuXG4gICAgICAgIC8vIEFwcEluZm8uSW9DLkdldE9iamVjdFxuXG4gICAgICAgIC8vIFRPRE8gaW1wbGVtZW50IExlZ2FjeVZhbHZlc0ludmVudG9yeU1hcHBpbmdcbiAgICAgICAgLy9sZXQgbWFwcGluZ0V2ZW50ID0gbmV3IExlZ2FjeVxuICAgICAgICBsZXQgdmFsdmVOdW1iZXIgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGJ1dHRvbk1vZGVsIG9mIGxlZ2FjeVZhbHZlcykge1xuICAgICAgICAgICAgLy8gVE9ETyBhZGQgVmFsdmVBc3NpZ25tZW50MlxuICAgICAgICAgICAgdmFsdmVOdW1iZXIrKztcbiAgICAgICAgfVxuICAgICAgICAvLyBEQlV0aWwuUG9zdEV2ZW50RGF0YVxuICAgIH1cblxuICAgIC8vIFRPRE8gaW1wbGVtZW50XG4gICAgcHVibGljIHJlc2V0VmFsdmVBc3NpZ25tZW50cygpIHtcbiAgICAgICAgLy8gVE9ETyBpbXBsZW1lbnQgZmlsZUxvY2F0aW9uc1xuICAgICAgICAvL2xldCB2YWx2ZUFzc2lnbm1lbnRNb2RlbCA9IHRoaXMuZmlsZUxvY2F0aW9ucy52YWx2ZUFzc2lnbm1lbnRTZWVkO1xuICAgICAgICAvLyBzZXJpYWxpemUgdG8gZGlza1xuICAgIH1cblxuICAgIGFzeW5jIGdldFJvbGVCeUF1dGhJZChpbnB1dDogc3RyaW5nKTogUHJvbWlzZTxSb2xlPiB7XG4gICAgICAgIGNvbnN0IHBlcm1pc3Npb25zTW9kZWwgPSB0aGlzLmNvbmZpZ3VyYXRpb25SZXBvc2l0b3J5LmdldFVzZXJQZXJtaXNzaW9ucygpO1xuICAgICAgICBjb25zdCByb2xlUGVybWlzc2lvbnMgPSBfLmZpbmQocGVybWlzc2lvbnNNb2RlbC5Sb2xlcywgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLkF1dGhJZCA9PSBpbnB1dDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHJvbGVQZXJtaXNzaW9ucyA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gUm9sZS5Ob25lO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJvbGVQZXJtaXNzaW9ucy5Sb2xlO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRCcml4QnV0dG9ucygpOiBCdXR0b25Nb2RlbFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzUGVybWlzc2lvbnModGhpcy5zZXJ2aWNlVUlQb3B1cEJ1dHRvbnMuQnJpeCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEVxdWlwbWVudFN0YXR1c0J1dHRvbigpOiBCdXR0b25Nb2RlbFtdIHtcbiAgICAgICAgY29uc3QgYWxsQnV0dG9uczogQnV0dG9uTW9kZWxbXSA9IHRoaXMuaGFzUGVybWlzc2lvbnModGhpcy5zZXJ2aWNlVUlQb3B1cEJ1dHRvbnMuRXF1aXBtZW50U3RhdHVzKTtcbiAgICAgICAgY29uc3QgYXZhaWxhYmxlQnV0dG9uczogQnV0dG9uTW9kZWxbXSA9IFtdO1xuXG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBhbGxCdXR0b25zKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc1N1cHBvcnRlZE9uVW5pdFR5cGUoaXRlbSkpIHtcbiAgICAgICAgICAgICAgICBhdmFpbGFibGVCdXR0b25zLnB1c2goaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGF2YWlsYWJsZUJ1dHRvbnM7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFNFTkRpYWdub3N0aWNzQnV0dG9ucygpOiBCdXR0b25Nb2RlbFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzUGVybWlzc2lvbnModGhpcy5zZXJ2aWNlVUlQb3B1cEJ1dHRvbnMuU0VORGlhZ25vc3RpY3MpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRTRU5EaWFnbm9zdGljc0VxdWlwbWVudFNlcmlhbEJ1dHRvbigpOiBCdXR0b25Nb2RlbFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzUGVybWlzc2lvbnModGhpcy5zZXJ2aWNlVUlQb3B1cEJ1dHRvbnMuU0VORGlhZ25vc3RpY3NFcXVpcG1lbnRTZXJpYWwpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRTRU5EaWFnbm9zdGljc1JlZnJlc2hCdXR0b24oKTogQnV0dG9uTW9kZWxbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmhhc1Blcm1pc3Npb25zKHRoaXMuc2VydmljZVVJUG9wdXBCdXR0b25zLlNFTkRpYWdub3N0aWNzUmVmcmVzaCk7XG4gICAgfVxuXG4gICAgLy8gVE9ETyBhZGQgQnV0dG9uQmVoYXZpb3IgYW5kIHRlc3RcbiAgICBwdWJsaWMgZ2V0VUlDdXN0b21pemF0aW9uc0F2YWlsYWJsZShVbml0TG9jYXRpb246IHN0cmluZyk6IEJ1dHRvbk1vZGVsW10ge1xuICAgICAgICBjb25zdCBidXR0b25MaXN0OiBCdXR0b25Nb2RlbFtdID0gW107XG4gICAgICAgIGNvbnN0IGxpc3RPdmVycmlkZXMgPSBfLmZpbHRlcih0aGlzLnVpQ3VzdG9taXphdGlvbnMuT3ZlcnJpZGVzLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgLy9yZXR1cm4gaXRlbS5Db3VudHJpZXNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZm9yIChjb25zdCBvdmVycmlkZU1vZGVsIG9mIGxpc3RPdmVycmlkZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGJ1dHRvbk1vZGVsID0gSnNVdGlsLm1hcFRvTmV3T2JqZWN0KHtcbiAgICAgICAgICAgICAgICBCdXR0b25UeXBlOiBCdXR0b25UeXBlLnN0YXRlYnV0dG9uLFxuICAgICAgICAgICAgICAgIElkOiBvdmVycmlkZU1vZGVsLk5hbWUsXG4gICAgICAgICAgICAgICAgQWN0aW9uSWQ6IFwib3ZlcnJpZGVcIixcbiAgICAgICAgICAgICAgICBMYWJlbDogb3ZlcnJpZGVNb2RlbC5OYW1lLFxuICAgICAgICAgICAgICAgIHBheWxvYWQ6IG92ZXJyaWRlTW9kZWxcbiAgICAgICAgICAgIH0sIG5ldyBCdXR0b25Nb2RlbCgpKTtcblxuICAgICAgICAgICAgZm9yIChjb25zdCBhdHRyYWN0TG9vcCBvZiBvdmVycmlkZU1vZGVsLkF0dHJhY3RMb29wcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGF0dHJhY3RMb29wQnV0dG9uTW9kZWwgPSBKc1V0aWwubWFwVG9OZXdPYmplY3Qoe1xuICAgICAgICAgICAgICAgICAgICBCdXR0b25UeXBlOiBCdXR0b25UeXBlLnN0YXRlYnV0dG9uLFxuICAgICAgICAgICAgICAgICAgICBJZDogYXR0cmFjdExvb3AuTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgTGFiZWw6IGF0dHJhY3RMb29wLk5hbWUsXG4gICAgICAgICAgICAgICAgICAgIEFjdGlvbklkOiBcImF0dHJhY3Rsb29wXCIsXG4gICAgICAgICAgICAgICAgICAgIHBheWxvYWQ6IGF0dHJhY3RMb29wXG4gICAgICAgICAgICAgICAgfSwgbmV3IEJ1dHRvbk1vZGVsKCkpO1xuICAgICAgICAgICAgICAgIGJ1dHRvbk1vZGVsLkJ1dHRvbk1vZGVsTGlzdC5wdXNoKGF0dHJhY3RMb29wQnV0dG9uTW9kZWwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBidXR0b25MaXN0LnB1c2goYnV0dG9uTW9kZWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJ1dHRvbkxpc3Q7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0UGxhdGZvcm0oZmlsZVRva2VuVG9SZXR1cm4pIHtcbiAgICAgICAgbGV0IHBsYXRmb3JtRmlsZU5hbWUgPSAnJztcbiAgICAgICAgaWYgKGZpbGVUb2tlblRvUmV0dXJuKSB7XG4gICAgICAgICAgICBwbGF0Zm9ybUZpbGVOYW1lID0gZmlsZVRva2VuVG9SZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBhdCB0aGlzIHBvaW50LCBvbmx5IG9uZSBwbGF0Zm9ybSBmaWxlIGF2YWlsYWJsZSBhbmQgaXQgd29ya3NcbiAgICAgICAgICAgIC8vIG9uIGFsbCBjb25maWd1cmF0aW9uc1xuICAgICAgICAgICAgcGxhdGZvcm1GaWxlTmFtZSA9ICdwbGF0Zm9ybV8xMDgweDE5MjAuanNvbic7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY29udGVudHMgPSBhd2FpdCB0aGlzLmNvbmZpZ3VyYXRpb25SZXBvc2l0b3J5LmdldFBsYXRmb3JtKHBsYXRmb3JtRmlsZU5hbWUpO1xuICAgICAgICAvLyBjb25zdCByZXN1bHRQcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIC8vICAgICByZXNvbHZlKGNvbnRlbnRzKTtcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIHJldHVybiBjb250ZW50cztcbiAgICB9XG5cbiAgICBhc3luYyBnZXRQbGF0Zm9ybTIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25SZXBvc2l0b3J5LmdldFBsYXRmb3JtMigpO1xuICAgIH1cblxuICAgIGFzeW5jIGdldERlc2lnbkZsYXZvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvblJlcG9zaXRvcnkuZ2V0RGVzaWduRmxhdm9ycygpO1xuICAgIH1cblxuICAgIGFzeW5jIGdldERlc2lnblBvdXJhYmxlcyhjb3VudHJ5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25SZXBvc2l0b3J5LmdldERlc2lnblBvdXJhYmxlcyhjb3VudHJ5KTtcbiAgICB9XG5cbiAgICBhc3luYyBnZXREZXNpZ25CdWJibGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWd1cmF0aW9uUmVwb3NpdG9yeS5nZXREZXNpZ25CdWJibGVzKCk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0RGVzaWduQW5pbWF0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvblJlcG9zaXRvcnkuZ2V0RGVzaWduQW5pbWF0aW9ucygpO1xuICAgIH1cblxuICAgIGFzeW5jIGdldElkbGVTdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvblJlcG9zaXRvcnkuZ2V0SWRsZVN0YXRlKCk7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0VW5pdFN0YXRlKCkge1xuICAgICAgICByZXR1cm4gRGV2aWNlSW5mby51bml0U3RhdGU7XG4gICAgfVxuXG4gICAgZ2V0TG9jYWxpemF0aW9uRm9yQ29uc3VtZXJVSSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvblJlcG9zaXRvcnkuZ2V0TG9jYWxpemF0aW9uRm9yQ29uc3VtZXJVSSgpO1xuICAgIH1cblxuXG5cbiAgICBhc3luYyBnZXRQb3VySXRlbXMoKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcyA7XG4gICAgICAgIHRoaXMuZGN0UG91ckJ1dHRvbk1vZGVsc0J5UG91cklkID0ge307XG5cbiAgICAgICAgY29uc3QgdGFyZ2V0UG91ckl0ZW1Nb2RlbCA9IG5ldyBQb3VySXRlbU1vZGVsKCk7XG4gICAgICAgIGNvbnN0IHBvdXJhYmxlc0Rlc2lnbkFycmF5ID0gYXdhaXQgdGhpcy5jb25maWd1cmF0aW9uUmVwb3NpdG9yeS5nZXREZXNpZ25Qb3VyYWJsZXMoRGV2aWNlSW5mby51bml0U3RhdGUuQ291bnRyeUxhbmd1YWdlQ29kZSk7XG4gICAgICAgIGNvbnN0IGZsYXZvcnNEZXNpZ25BcnJheSA9IGF3YWl0IHRoaXMuY29uZmlndXJhdGlvblJlcG9zaXRvcnkuZ2V0RGVzaWduRmxhdm9ycygpO1xuICAgICAgICBjb25zdCB1aWRhdGE6IFVJVmlzdWFsc01vZGVsID0gPFVJVmlzdWFsc01vZGVsPiBhd2FpdCB0aGlzLmdldFVJRGF0YSgpO1xuXG4gICAgICAgIHRoaXMuYWRkVG9Qb3VySXRlbU1vZGVsKHVpZGF0YS5icmFuZHMsIHBvdXJhYmxlc0Rlc2lnbkFycmF5LCB0YXJnZXRQb3VySXRlbU1vZGVsLCBcImJyYW5kc1wiKTtcbiAgICAgICAgdGhpcy5hZGRGbGF2b3JzVG9Qb3VySXRlbU1vZGVsKHVpZGF0YS5mbGF2b3JzLCBmbGF2b3JzRGVzaWduQXJyYXksIHRhcmdldFBvdXJJdGVtTW9kZWwsIFwiZmxhdm9yc1wiKTtcbiAgICAgICAgdGhpcy5hZGRUb1BvdXJJdGVtTW9kZWwodWlkYXRhLmN1cmF0ZWRNaXhlcywgcG91cmFibGVzRGVzaWduQXJyYXksIHRhcmdldFBvdXJJdGVtTW9kZWwsIFwiY3VyYXRlZE1peGVzXCIpO1xuICAgICAgICB0aGlzLmFkZFRvUG91ckl0ZW1Nb2RlbCh1aWRhdGEudG9wQ29tYmluYXRpb25zLCBwb3VyYWJsZXNEZXNpZ25BcnJheSwgdGFyZ2V0UG91ckl0ZW1Nb2RlbCwgXCJ0b3BDb21iaW5hdGlvbnNcIik7XG4gICAgICAgIHRoaXMuYWRkVG9Qb3VySXRlbU1vZGVsKHVpZGF0YS53YXRlcnMsIHBvdXJhYmxlc0Rlc2lnbkFycmF5LCB0YXJnZXRQb3VySXRlbU1vZGVsLCBcIndhdGVyc1wiKTtcblxuICAgICAgICBcbiAgICAgICAgdGFyZ2V0UG91ckl0ZW1Nb2RlbC5icmFuZHMgPSBhd2FpdCB0aGlzLmFkZENhbG9yaWVJbmZvKHRhcmdldFBvdXJJdGVtTW9kZWwuYnJhbmRzKTtcbiAgICAgICAgdGFyZ2V0UG91ckl0ZW1Nb2RlbC5jdXJhdGVkTWl4ZXMgPSBhd2FpdCB0aGlzLmFkZENhbG9yaWVJbmZvKHRhcmdldFBvdXJJdGVtTW9kZWwuY3VyYXRlZE1peGVzKTtcblxuICAgICAgICAvLyBUT0RPIGlmIHlvdSB0cnkgdG8gbW92ZSB0aGUgYWRhIGJ1dHRvbnMgdG8gdGhlIGxlZnQgaW5kaXZpZHVhbGx5IGluIHRoZSBsYXlvdXQgZmlsZXMsIHRoZSBjb2RlIHdpbGwgYXV0b21hdGljYWxseVxuICAgICAgICAvLyBtb3ZlIHRoZW0gYmFjayB0byB0aGUgcmlnaHRcbiAgICAgICAgLy8gPT09PT09PT09IG1vcmUgdGVzdCBjb2RlXG4gICAgICAgIC8vIHRhcmdldFBvdXJJdGVtTW9kZWwuYnJhbmRzID0gdGFyZ2V0UG91ckl0ZW1Nb2RlbC5icmFuZHMuY29uY2F0KHRhcmdldFBvdXJJdGVtTW9kZWwuYnJhbmRzKTtcbiAgICAgICAgLy8gdGFyZ2V0UG91ckl0ZW1Nb2RlbC5icmFuZHMgPSB0YXJnZXRQb3VySXRlbU1vZGVsLmJyYW5kcy5zbGljZSgwLDEyKTtcbiAgICAgICAgLy8gLy8gdGFyZ2V0UG91ckl0ZW1Nb2RlbC5jdXJhdGVkTWl4ZXMgPSB0YXJnZXRQb3VySXRlbU1vZGVsLmJyYW5kcy5zbGljZSgwLDEyKTtcbiAgICAgICAgLy90YXJnZXRQb3VySXRlbU1vZGVsLmN1cmF0ZWRNaXhlcyA9IHRhcmdldFBvdXJJdGVtTW9kZWwuY3VyYXRlZE1peGVzLnNsaWNlKDAsMyk7XG4gICAgICAgIC8vIHRhcmdldFBvdXJJdGVtTW9kZWwuY3VyYXRlZE1peGVzID0gdGFyZ2V0UG91ckl0ZW1Nb2RlbC5icmFuZHMuc2xpY2UoMCwzKTtcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAgICAgY29uc3QgaXRlbUNvdW50ID0gdGFyZ2V0UG91ckl0ZW1Nb2RlbC5icmFuZHMubGVuZ3RoICsgdGFyZ2V0UG91ckl0ZW1Nb2RlbC5jdXJhdGVkTWl4ZXMubGVuZ3RoO1xuXG4gICAgICAgIHRhcmdldFBvdXJJdGVtTW9kZWwuaG9tZU1lbnUgPSBhd2FpdCB0aGlzLmNvbmZpZ3VyYXRpb25SZXBvc2l0b3J5LmdldFBsYXRmb3JtTWVudUxheW91dChpdGVtQ291bnQpO1xuXG5cblxuICAgICAgICAvLyAvLyA9PT09PT09PT09PT09PT09PSBURVNUIENPREUgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgICAgICBfLmZvckVhY2godGFyZ2V0UG91ckl0ZW1Nb2RlbC5jdXJhdGVkTWl4ZXMsIGZ1bmN0aW9uKGl0ZW06IFBvdXJhYmxlRGVzaWduKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwb3VyYWJsZS5wb3VyaXRlbScsaXRlbS5wb3VySXRlbSk7XG4gICAgICAgICAgIGl0ZW0ucG91ckl0ZW0uaXNEaXNhYmxlZCA9IGZhbHNlIDtcbiAgICAgICAgfSkgO1xuICAgICAgICAvLyB0YXJnZXRQb3VySXRlbU1vZGVsLmJyYW5kc1sxXS5wb3VySXRlbS5pc0Rpc2FibGVkID0gdHJ1ZSA7XG4gICAgICAgIC8vIHRhcmdldFBvdXJJdGVtTW9kZWwuYnJhbmRzWzVdLnBvdXJJdGVtLmlzRGlzYWJsZWQgPSB0cnVlIDtcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICAgICByZXR1cm4gdGFyZ2V0UG91ckl0ZW1Nb2RlbDtcbiAgICB9XG5cbiAgICBhc3luYyBnZXRPdmVycmlkZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25SZXBvc2l0b3J5LmdldE92ZXJyaWRlcygpO1xuICAgIH1cblxuICAgIGFzeW5jIGdldENhbG9yaWVDb3VudFN0YXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWd1cmF0aW9uUmVwb3NpdG9yeS5nZXRDYWxvcmllQ291bnRTdGF0ZSgpO1xuICAgIH1cblxuICAgIGFzeW5jIGFkZENhbG9yaWVJbmZvKHBvdXJhYmxlczogUG91cmFibGVEZXNpZ25bXSkge1xuICAgICAgICBjb25zdCBjYWxvcmllQ291bnRTdGF0ZU1hc3RlcjogQ2Fsb3JpZUNvdW50U3RhdGUgPSBhd2FpdCB0aGlzLmdldENhbG9yaWVDb3VudFN0YXRlKCk7XG4gICAgICAgIGNvbnN0IGRjdFBvdXJCdXR0b25Nb2RlbHMgPSB0aGlzLmRjdFBvdXJCdXR0b25Nb2RlbHNCeVBvdXJJZDtcblxuICAgICAgICBpZiAoIWNhbG9yaWVDb3VudFN0YXRlTWFzdGVyLklzVG9nZ2xlQnV0dG9uRW5hYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNhbG9yaWVDb3VudFN0YXRlTWFzdGVyLkNhbG9yaWVDdXBzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJObyBjYWxvcmllIGN1cHMgZGVmaW5lZC5cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBfLmZvckVhY2gocG91cmFibGVzLCBmdW5jdGlvbihpdGVtOiBQb3VyYWJsZURlc2lnbikge1xuICAgICAgICAgICAgY29uc3QgY3VwczogQ2Fsb3JpZUN1cFtdID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShjYWxvcmllQ291bnRTdGF0ZU1hc3Rlci5DYWxvcmllQ3VwcykpO1xuICAgICAgICAgICAgaXRlbS5DYWxvcmllQ3VwcyA9IGN1cHM7XG5cbiAgICAgICAgICAgIGNvbnN0IHBvdXJCdXR0b25Nb2RlbCA9IGRjdFBvdXJCdXR0b25Nb2RlbHNbaXRlbS5wb3VySXRlbS5wb3VyQ29uZmlndXJhdGlvbklkXTtcblxuICAgICAgICAgICAgY29uc3Qgc2t1TWFwcGluZ0xpc3Q6IFNrdVRvVmFsdmVNYXBwaW5nID0gcG91ckJ1dHRvbk1vZGVsLnBheWxvYWQuU2t1VG9WYWx2ZU1hcHBpbmdzO1xuXG4gICAgICAgICAgICBjb25zdCBza3VNYXBwaW5nOiBTa3VUb1ZhbHZlTWFwcGluZyA9IF8uZmluZChza3VNYXBwaW5nTGlzdCwgZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpLnNrdS5sZW5ndGggPiA0O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGJpYkl0ZW06IEJpYkl0ZW1Nb2RlbCA9IHNrdU1hcHBpbmcudmFsdmVBc3NpZ25tZW50U3RhdGUuQmliSXRlbUFzQnV0dG9uTW9kZWwucGF5bG9hZDtcblxuICAgICAgICAgICAgXy5mb3JFYWNoKGN1cHMsIGZ1bmN0aW9uKGN1cCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRvdGFsQ2Fsb3JpZXM6IG51bWJlciA9IE1hdGgucm91bmQoY3VwLlF0eUluT3VuY2VzICogYmliSXRlbS5DYWxvcmllc1Blck96KTtcblxuICAgICAgICAgICAgICAgIGN1cC5MaW5lMUxhYmVsID0gdG90YWxDYWxvcmllcyArIFwiICR7Y2Fsb3JpZX1cIjtcblxuICAgICAgICAgICAgICAgIGN1cC5RdHlJbk1pbGxpbGl0ZXJzID0gTWF0aC5yb3VuZChjdXAuUXR5SW5NaWxsaWxpdGVycyk7XG4gICAgICAgICAgICAgICAgY3VwLlF0eUluT3VuY2VzID0gTWF0aC5yb3VuZChjdXAuUXR5SW5PdW5jZXMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKERldmljZUluZm8udW5pdFN0YXRlLlVuaXRMb2NhdGlvbiA9PT0gXCJVU1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cC5MaW5lMkxhYmVsID0gY3VwLkN1cE5hbWUgKyBcIiBcIiArIGN1cC5RdHlJbk91bmNlcyArIFwiIEZMIE9aXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY3VwLkxpbmUyTGFiZWwgPSBjdXAuUXR5SW5NaWxsaWxpdGVycyArIFwiTUwgKFwiICsgY3VwLlF0eUluT3VuY2VzICsgXCJPWilcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBwb3VyYWJsZXM7XG4gICAgfVxuXG4gICAgYWRkVG9Qb3VySXRlbU1vZGVsKGJ1dHRvbk1vZGVsczogQnV0dG9uTW9kZWxbXSwgZGVzaWduczogUG91cmFibGVEZXNpZ25bXSxcbiAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0UG91ckl0ZW1Nb2RhbDogUG91ckl0ZW1Nb2RlbCwgdGFyZ2V0UHJvcGVydHlOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3QgcG91ckl0ZW1zID0gdGhpcy5jb252ZXJ0QnV0dG9uTW9kZWxzVG9Qb3VySXRlbXMoYnV0dG9uTW9kZWxzKTtcbiAgICAgICAgY29uc3QgdGFyZ2V0QXJyYXk6IFBvdXJhYmxlRGVzaWduW10gPSBbXTtcblxuICAgICAgICBfLmZvckVhY2gocG91ckl0ZW1zLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICBjb25zdCBmb3VuZERlc2lnbkl0ZW0gPSBfLmZpbmQoZGVzaWducywgZnVuY3Rpb24oZGVzaWduSXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLmlkID09PSBkZXNpZ25JdGVtLmlkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoZm91bmREZXNpZ25JdGVtKSB7XG4gICAgICAgICAgICAgICAgZm91bmREZXNpZ25JdGVtLnBvdXJJdGVtID0gaXRlbSA7XG4gICAgICAgICAgICAgICAgaWYgKCFmb3VuZERlc2lnbkl0ZW0uV2VpZ2h0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm8gV2VpZ2h0aW5nIG9uIERlc2lnbkl0ZW1cIiwgZm91bmREZXNpZ25JdGVtLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBmb3VuZERlc2lnbkl0ZW0uV2VpZ2h0aW5nID0gMjAwMDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmb3VuZERlc2lnbkl0ZW0uV2VpZ2h0aW5nIDwgIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZm91bmREZXNpZ25JdGVtLldlaWdodGluZyA9IDE5MDAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0YXJnZXRBcnJheS5wdXNoKGZvdW5kRGVzaWduSXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBvcmRlcmVkQXJyYXkgPSBfLnNvcnRCeSh0YXJnZXRBcnJheSwgW2Z1bmN0aW9uKG86IFBvdXJhYmxlRGVzaWduKSB7XG4gICAgICAgICAgICByZXR1cm4gby5XZWlnaHRpbmc7XG4gICAgICAgIH1dKTtcbiAgICAgICAgdGFyZ2V0UG91ckl0ZW1Nb2RhbFt0YXJnZXRQcm9wZXJ0eU5hbWVdID0gb3JkZXJlZEFycmF5O1xuICAgIH1cblxuICAgIGFkZEZsYXZvcnNUb1BvdXJJdGVtTW9kZWwoYnV0dG9uTW9kZWxzOiBCdXR0b25Nb2RlbFtdLCBkZXNpZ25zOiBGbGF2b3JbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0UG91ckl0ZW1Nb2RhbDogUG91ckl0ZW1Nb2RlbCwgdGFyZ2V0UHJvcGVydHlOYW1lOiBzdHJpbmcpIHtcblxuICAgICAgICBjb25zdCBmbGF2b3JQb3VySXRlbXMgPSB0aGlzLmNvbnZlcnRCdXR0b25Nb2RlbHNUb1BvdXJJdGVtcyhidXR0b25Nb2RlbHMpO1xuXG4gICAgICAgIF8uZm9yRWFjaChmbGF2b3JQb3VySXRlbXMsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIGNvbnN0IGZvdW5kRmxhdm9ySXRlbTogRmxhdm9yID0gXy5maW5kKGRlc2lnbnMsIGZ1bmN0aW9uKGRlc2lnbkl0ZW0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5pZCA9PT0gZGVzaWduSXRlbS5pZDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoZm91bmRGbGF2b3JJdGVtKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEgaXRlbS5pc0Rpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvdW5kRmxhdm9ySXRlbS5wb3VySXRlbSA9IGl0ZW07XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFBvdXJJdGVtTW9kYWxbdGFyZ2V0UHJvcGVydHlOYW1lXS5wdXNoKGZvdW5kRmxhdm9ySXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnZlcnRCdXR0b25Nb2RlbHNUb1BvdXJJdGVtcyhidXR0b25Nb2RlbHM6IEJ1dHRvbk1vZGVsW10pOiBQb3VySXRlbVtdIHtcbiAgICAgICAgY29uc3QgcG91ckl0ZW1zOiBQb3VySXRlbVtdID0gW107XG5cbiAgICAgICAgY29uc3QgZGN0UG91ckJ1dHRvbk1vZGVscyA9IHRoaXMuZGN0UG91ckJ1dHRvbk1vZGVsc0J5UG91cklkO1xuXG4gICAgICAgIF8uZm9yRWFjaChidXR0b25Nb2RlbHMsIGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgICAgY29uc3QgcG91ckl0ZW0gPSBuZXcgUG91ckl0ZW0oKTtcbiAgICAgICAgICAgIHBvdXJJdGVtLnBvdXJDb25maWd1cmF0aW9uSWQgPSBTSE9SVElELmdlbmVyYXRlKCk7XG5cbiAgICAgICAgICAgIC8vIFRvRG86IHRvcENvbWJpbmF0aW9ucyBuZWVkIGEgcGF5bG9hZFxuICAgICAgICAgICAgaWYgKCFpdGVtLnBheWxvYWQpIHtcbiAgICAgICAgICAgICAgICBwb3VySXRlbS5pZCA9IGl0ZW0uaWQgO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghaXRlbS5wYXlsb2FkLkJldmVyYWdlSWQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgbWlzc2luZyBiZXZlcmFnZUlkIG9uICR7aXRlbS5MYWJlbH1gKTtcbiAgICAgICAgICAgICAgICBwb3VySXRlbS5pZCA9ICd+JyArIGl0ZW0ubGFiZWw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBvdXJJdGVtLmlkID0gaXRlbS5wYXlsb2FkLkJldmVyYWdlSWQ7XG4gICAgICAgICAgICAgICAgcG91ckl0ZW0uYnJhbmRJZCA9IGl0ZW0ucGF5bG9hZC5CcmFuZElkO1xuICAgICAgICAgICAgICAgIHBvdXJJdGVtLmZsYXZvcklkcyA9IGl0ZW0ucGF5bG9hZC5GbGF2b3JJZHM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBvdXJJdGVtLmlzRGlzYWJsZWQgPSBpdGVtLklzRGlzYWJsZWQ7XG4gICAgICAgICAgICBwb3VySXRlbS5sYWJlbCA9IGl0ZW0uTGFiZWw7XG5cbiAgICAgICAgICAgIHBvdXJJdGVtcy5wdXNoKHBvdXJJdGVtKTtcblxuICAgICAgICAgICAgZGN0UG91ckJ1dHRvbk1vZGVsc1twb3VySXRlbS5wb3VyQ29uZmlndXJhdGlvbklkXSA9IGl0ZW07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZGN0UG91ckJ1dHRvbk1vZGVsc0J5UG91cklkID0gZGN0UG91ckJ1dHRvbk1vZGVscztcbiAgICAgICAgcmV0dXJuIHBvdXJJdGVtcztcbiAgICB9XG5cbiAgICBnZXRIb21lKGZpbGU6IHN0cmluZykge1xuICAgICAgICBsZXQgZmlsZU5hbWUgPSAnaG9tZV9zcGlyZS5qc29uJztcblxuICAgICAgICBpZihmaWxlKXtcbiAgICAgICAgICAgIGZpbGVOYW1lID0gZmlsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVsc2UgaWYoRGV2aWNlSW5mby51bml0U3RhdGUuVW5pdFR5cGUgPT09IFVuaXRUeXBlcy5TcGlyZTUpIHtcbiAgICAgICAgICAgIGZpbGVOYW1lID0gJ2hvbWVfc3BpcmU1Lmpzb24nO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoRGV2aWNlSW5mby51bml0U3RhdGUuVW5pdFR5cGUgPT09IFVuaXRUeXBlcy5TcGlyZTUgJiYgRGV2aWNlSW5mby51bml0U3RhdGUuVW5pdExvY2F0aW9uID09PSBcIkNBXCIpIHtcbiAgICAgICAgICAgIGZpbGVOYW1lID0gJ2hvbWVfc3BpcmU1X2NhLmpzb24nO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvblJlcG9zaXRvcnkuZ2V0SG9tZShmaWxlTmFtZSk7XG4gICAgfVxuXG59XG4iXX0=
