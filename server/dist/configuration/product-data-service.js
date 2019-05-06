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
var app_info_service_1 = require("../services/app-info.service");
var server_types_1 = require("../server.types");
var product_data_repository_1 = require("./product-data-repository");
var _ = require("lodash");
var app_types_1 = require("../universal/app.types");
var ProductDataService = /** @class */ (function () {
    function ProductDataService(appInfo, productDataRepository) {
        this.appInfo = appInfo;
        this.productDataRepository = productDataRepository;
        this.allBibItems = [];
        this.dctSkuSets = {};
        this.objectId = JsUtil_1.JsUtil.getObjectId();
        console.log("ctor.ProductDataService", this.objectId);
        this.afterPropertiesSet();
    }
    // return recipeItemModel[]
    ProductDataService.prototype.getAllRecipes = function () {
        return this.productDataRepository.getAllRecipeItems();
    };
    // return recipeItemModel[]
    ProductDataService.prototype.getDispensableRecipesForCuratedMixes = function (valveAssignments) {
        var curatedRecipes = this.getDispensableRecipes(valveAssignments);
        return curatedRecipes;
    };
    ProductDataService.prototype.getDriveThruData = function () {
        // we're only getting the action buttons here
        return this.productDataRepository.getDriveThruData();
    };
    // return recipeItemModel
    ProductDataService.prototype.getDispensableRecipes = function (valveAssignments) {
        this.getSkuList();
        var dispensibleRecipes = [];
        var dctMountedSkus = {};
        var assignedValves = _.filter(valveAssignments.Assignments, function (assignment) {
            return assignment.isAssigned;
        });
        var altNameForFlavors = [];
        for (var _i = 0, assignedValves_1 = assignedValves; _i < assignedValves_1.length; _i++) {
            var valve = assignedValves_1[_i];
            var bibItemModel = valve.BibItemAsButtonModel.payload;
            if (bibItemModel.Type === app_types_1.BibItemType.flavorshot) {
                altNameForFlavors.push(bibItemModel.AltName);
            }
            // what's a javascript equivalent to a c# dictionary
            if (dctMountedSkus[valve.SKU] === undefined) {
                dctMountedSkus[valve.SKU] = valve;
            }
            else {
                console.log("SKU is mounted multiple times");
            }
        }
        var recipes = this.productDataRepository.getAllRecipeItems();
        for (var _a = 0, recipes_1 = recipes; _a < recipes_1.length; _a++) {
            var recipe = recipes_1[_a];
            var foundAllSkus = false;
            recipe.SkuToValveMappings = [];
            var _loop_1 = function (skuItem) {
                if (dctMountedSkus[skuItem.Sku] !== undefined) {
                    foundAllSkus = true;
                    availableSkuMappings = _.find(recipe.SkuToValveMappings, function (item) {
                        return item.Sku === skuItem.Sku;
                    });
                    if (!availableSkuMappings) {
                        recipe.SkuToValveMappings.push(new app_types_1.SkuToValveMapping(skuItem.Sku, dctMountedSkus[skuItem.Sku]));
                    }
                    else {
                        console.log("");
                    }
                    return "break";
                }
            };
            var availableSkuMappings;
            for (var _b = 0, _c = recipe.SyrupSkus; _b < _c.length; _b++) {
                var skuItem = _c[_b];
                var state_1 = _loop_1(skuItem);
                if (state_1 === "break")
                    break;
            }
            if (recipe.SyrupSkus.length > 0 && recipe.SkuToValveMappings.length == 0) {
                continue;
            }
            if (recipe.SyrupSkus.length === 0) {
                foundAllSkus = true;
            }
            var waterSkus = [];
            for (var _d = 0, _e = recipe.WaterSkus; _d < _e.length; _d++) {
                var waterRecipe = _e[_d];
                waterSkus.push(waterRecipe);
            }
            for (var _f = 0, waterSkus_1 = waterSkus; _f < waterSkus_1.length; _f++) {
                var sku = waterSkus_1[_f];
                if (dctMountedSkus[sku] === undefined) {
                    foundAllSkus = false;
                    break;
                }
                else {
                    if (!recipe.SkuToValveMappings[sku]) {
                        recipe.SkuToValveMappings[sku] = new app_types_1.SkuToValveMapping(sku, dctMountedSkus[sku]);
                    }
                }
            }
            if (recipe.FlavorSkus.length > 0) {
                // console.log("Curated Mix: ", recipe.Name);
            }
            for (var _g = 0, _h = recipe.FlavorSkus; _g < _h.length; _g++) {
                var sku = _h[_g];
                var compatibleSkus = this.dctSkuSets[sku.Sku];
                var flavorValveAssignment = null; // ValveAssignmentState
                if (compatibleSkus) {
                    var _loop_2 = function (altSku) {
                        if (dctMountedSkus[altSku]) {
                            flavorValveAssignment = dctMountedSkus[altSku];
                            existingSku = _.find(recipe.SkuToValveMappings, function (item) {
                                return item.SKU == altSku;
                            });
                            if (!existingSku) {
                                if (!_.find(recipe.SkuToValveMappings, function (item) {
                                    return item.ValveAssignmentState == flavorValveAssignment;
                                })) {
                                    //console.log("Compatible SKU Found sku:" + sku + " altsku " + altSku);
                                    recipe.SkuToValveMappings.push(new app_types_1.SkuToValveMapping(altSku, flavorValveAssignment));
                                }
                                else {
                                    //console.log("Compatible SKU ALREADY LOADED sku:" + sku + " altsku:" + altSku);
                                }
                            }
                            return "break";
                        }
                    };
                    var existingSku;
                    for (var _j = 0, compatibleSkus_1 = compatibleSkus; _j < compatibleSkus_1.length; _j++) {
                        var altSku = compatibleSkus_1[_j];
                        var state_2 = _loop_2(altSku);
                        if (state_2 === "break")
                            break;
                    }
                }
                if (flavorValveAssignment == null) {
                    // no SKU mapping found
                    //console.log("No flavor SKU Mapping Found for: ", sku);
                    foundAllSkus = false;
                }
            }
            if (foundAllSkus) {
                dispensibleRecipes.push(recipe);
            }
        }
        return dispensibleRecipes;
    };
    // void
    ProductDataService.prototype.afterPropertiesSet = function () {
        this.allBibItems = this.productDataRepository.getAllBibItems();
        this.getSkuList();
    };
    // void
    ProductDataService.prototype.reset = function () {
        this.productDataRepository.reset();
    };
    // return dictionary
    ProductDataService.prototype.getSkuList = function () {
        if (Object.keys(this.dctSkuSets).length > 0) {
            return this.dctSkuSets;
        }
        var recipeItems = this.productDataRepository.getAllRecipeItems();
        for (var _i = 0, _a = _.filter(recipeItems, function (recipeItem) { return recipeItem.Type !== app_types_1.RecipeType.Mix; }); _i < _a.length; _i++) {
            var recipe = _a[_i];
            var skuList = recipe.SyrupSkus;
            for (var _b = 0, skuList_1 = skuList; _b < skuList_1.length; _b++) {
                var sku = skuList_1[_b];
                if (!this.dctSkuSets.hasOwnProperty(sku)) {
                    this.dctSkuSets[sku] = skuList;
                }
            }
        }
        var flavorNames = [];
        var mixSkus = _.filter(this.allBibItems, function (bibitem) { return bibitem.Type === app_types_1.BibItemType.flavorshot; });
        var _loop_3 = function (bibItem) {
            if (bibItem.AltName === undefined || bibItem.AltName === "") {
                console.log("BibItem FlavorShot must be configured with an AltName");
                return "continue";
            }
            flavorNames.push(bibItem.AltName);
            if (!this_1.dctSkuSets.hasOwnProperty(bibItem.AltName)) {
                this_1.dctSkuSets[bibItem.AltName] = [];
            }
            skuList = this_1.dctSkuSets[bibItem.AltName];
            if (_.find(skuList, function (sku) { return sku === bibItem.SKU; }) === undefined) {
                skuList.push(bibItem.SKU);
            }
        };
        var this_1 = this, skuList;
        for (var _c = 0, mixSkus_1 = mixSkus; _c < mixSkus_1.length; _c++) {
            var bibItem = mixSkus_1[_c];
            _loop_3(bibItem);
        }
        for (var _d = 0, flavorNames_1 = flavorNames; _d < flavorNames_1.length; _d++) {
            var flavor = flavorNames_1[_d];
            var list = this.dctSkuSets[flavor];
            for (var _e = 0, list_1 = list; _e < list_1.length; _e++) {
                var sku = list_1[_e];
                this.dctSkuSets[sku] = list;
            }
        }
        return this.dctSkuSets;
    };
    // return string
    ProductDataService.prototype.getRecipeVersion = function () {
        return this.productDataRepository.getRecipeItemsVersion();
    };
    // TODO syntax
    // return ButtonModelList
    ProductDataService.prototype.getBibItems = function () {
        var buttons = new app_types_1.ButtonModelList();
        for (var _i = 0, _a = this.allBibItems; _i < _a.length; _i++) {
            var bibItem = _a[_i];
            var buttonModel = new app_types_1.ButtonModel();
            buttonModel.Id = bibItem.SKU;
            buttonModel.Label = bibItem.Name;
            buttonModel.ActionId = "BibItem";
            buttonModel.payload = bibItem;
            buttonModel.behaviors = [app_types_1.ButtonBehavior.tap, app_types_1.ButtonBehavior.checkable, app_types_1.ButtonBehavior.longpress, app_types_1.ButtonBehavior.status];
            buttonModel.ButtonType = app_types_1.ButtonType.valveAssignment;
            buttonModel.FooterText = bibItem.SKU; // TODO not footertext?
            buttons.AllTypes.push(buttonModel);
            this.getVisualForBibItem(buttonModel, bibItem);
            switch (bibItem.Type) {
                case app_types_1.BibItemType.carbwater:
                case app_types_1.BibItemType.stillwater:
                    buttons.WaterType.push(buttonModel);
                    break;
                case app_types_1.BibItemType.flavorshot:
                    buttons.FlavorType.push(buttonModel);
                    break;
                case app_types_1.BibItemType.syrup:
                    buttons.SyrupType.push(buttonModel);
                    break;
            }
        }
        return buttons;
    };
    // return bibItemModel[]
    ProductDataService.prototype.getAllBibItems = function () {
        return this.allBibItems;
    };
    // TODO ServiceUI function
    // return ButtonModel
    ProductDataService.prototype.getUnassignedButtonForValveAssignment = function (bibItemType) {
        var bibItemModel = new app_types_1.BibItemModel();
        bibItemModel.Type = bibItemType;
        var unassignButton = new app_types_1.ButtonModel();
        // Localization service
        //unassignButton.Label =
        unassignButton.ResourceId = "not_in_use_id";
        unassignButton.ActionId = "unassign";
        //unassignButton.buttonBehavior
        // TODO is buttonBehavior being copied over?
        unassignButton.payload = bibItemModel;
        unassignButton.ButtonType = app_types_1.ButtonType.valveAssignment;
        unassignButton.Weighting = -1;
        return unassignButton;
    };
    // TODO ServiceUI function
    // void
    ProductDataService.prototype.addUnassignedButtonsForUIToClearAssignment = function (allButtons) {
        var unassignButton = this.getUnassignedButtonForValveAssignment(app_types_1.BibItemType.carbwater);
        allButtons.WaterType.push(unassignButton);
        unassignButton = this.getUnassignedButtonForValveAssignment(app_types_1.BibItemType.syrup);
        allButtons.SyrupType.push(unassignButton);
        unassignButton = this.getUnassignedButtonForValveAssignment(app_types_1.BibItemType.flavorshot);
        allButtons.FlavorType.push(unassignButton);
    };
    // TODO ServiceUi function
    // productUiItemModel
    ProductDataService.prototype.getVisualForRecipe = function (recipe) {
        var potentiallyAvailable = _.filter(this.productDataRepository.getAllProductUIItems(), function (item) {
            return item.recipeId == recipe.Id;
        });
        if (potentiallyAvailable.length == 0) {
            console.log("No visual for recipe");
        }
        var selectedVisual = potentiallyAvailable[0];
        // TODO - need to consider country / language / customer
        return selectedVisual;
    };
    // TODO ServiceUI function
    // void
    ProductDataService.prototype.getVisualForBibItem = function (buttonmodel, bibitem) {
        var allRecipeItems = this.productDataRepository.getAllRecipeItems();
        var allProductUIItems = this.productDataRepository.getAllProductUIItems();
        var recipeItem = new app_types_1.RecipeItemModel;
        var recipeItems = new Array();
        switch (bibitem.Type) {
            case app_types_1.BibItemType.carbwater:
            case app_types_1.BibItemType.stillwater:
                recipeItems = _.filter(allRecipeItems, function (recipeItem) { return recipeItem.WaterSkus != null && recipeItem.WaterSkus.indexOf(bibitem.SKU) >= 0 && recipeItem.Type == app_types_1.RecipeType.Water; });
                if (recipeItems.length > 1) {
                    var recipeItemsByName = _.filter(recipeItems, function (recipeItem) { return recipeItem.Name.indexOf(bibitem.Name) >= 0; });
                    if (recipeItemsByName.length == 1) {
                        recipeItem = recipeItemsByName[0];
                    }
                    else {
                        //console.log("could not resolve recipeItem for BibItem");
                    }
                }
                else {
                    if (recipeItems.length == 1) {
                        recipeItem = recipeItems[0];
                    }
                    else {
                        //console.log("could not resolve recipeItem for BibItem");
                    }
                }
                // get the image for the water in productUiItems
                var recipePUiItem = _.find(allProductUIItems, function (pItem) { return pItem.recipeId === recipeItem.Id; });
                if (recipePUiItem && recipePUiItem.design.assets.logoHome != '' && recipePUiItem.design.assets.logoHome != null) {
                    buttonmodel.PathToImage = recipePUiItem.design.assets.logoHome;
                }
                break;
            case app_types_1.BibItemType.flavorshot:
                recipeItems = _.filter(allRecipeItems, function (recipeItem) { return recipeItem.FlavorSkus != null && recipeItem.FlavorSkus.indexOf(bibitem.SKU) >= 0 && recipeItem.Type == app_types_1.RecipeType.Mix; });
                if (recipeItems.length > 1) {
                    var pUiItem = _.find(allProductUIItems, function (pItem) { return pItem.id === bibitem.Name; });
                    if (pUiItem != null) {
                        //console.log("PUITEM: ", pUiItem);
                        //buttonmodel.BackgroundColor = pUiItem.ColorBackground;
                        buttonmodel.PathToImage = pUiItem.design.assets.logoHome;
                        //console.log("New Button Model:", buttonmodel);
                        return;
                    }
                    else {
                        //console.log("could not resolve recipeItem for BibItem");
                        return;
                    }
                }
                else {
                    if (recipeItems.length == 1) {
                        recipeItem = recipeItems[0];
                    }
                    else {
                        // FirstOrDefault
                        var pUiItem = _.find(allProductUIItems, function (pItem) { return pItem.id === bibitem.Name; });
                        if (pUiItem != null) {
                            //buttonmodel.BackgroundColor = pUiItem.ColorBackground;
                            buttonmodel.PathToImage = pUiItem.design.assets.logoHome;
                            return;
                        }
                        else {
                            //console.log("could not resolve recipeItem for BibItem");
                            return;
                        }
                    }
                }
                break;
            case app_types_1.BibItemType.syrup:
                recipeItems = _.filter(allRecipeItems, function (recipeItem) { return recipeItem.SyrupSkus != null && recipeItem.SyrupSkus.indexOf(bibitem.SKU) >= 0 && recipeItem.Type === app_types_1.RecipeType.Beverage; });
                if (recipeItems.length > 1) {
                    recipeItemsByName = _.filter(recipeItems, function (recipeItem) { return recipeItem.Name.indexOf(bibitem.Name) >= 0; });
                    if (recipeItemsByName.length == 1) {
                        recipeItem = recipeItemsByName[0];
                    }
                    else {
                        //console.log("could not resolve recipeItem for BibItem");
                    }
                }
                else {
                    if (recipeItems.length == 1) {
                        recipeItem = recipeItems[0];
                    }
                    else {
                        //console.log("could not resolve recipeItem for BibItem");
                    }
                }
                break;
        }
        if (recipeItem != null) {
            if (bibitem.CountryLanguageCustomers.length > 0) {
                var recipeId = recipeItem.Id;
                var country = "";
                if (bibitem.CountryLanguageCustomers[0].Country == "CA") {
                    country = "Canada";
                }
                else {
                    country = bibitem.CountryLanguageCustomers[0].Country;
                }
                // TODO need a way to call isSameCountry from this function
                var productUIItem = _.find(allProductUIItems, function (recipeItem) {
                    return recipeItem.CountryLanguageCustomer != null && recipeItem.recipeId && recipeItem.recipeId.indexOf(recipeId) >= 0;
                });
                if (productUIItem != null) {
                    //buttonmodel.BackgroundColor = productUIItem.ColorBackground;
                    buttonmodel.PathToImage = productUIItem.design.assets.logoHome;
                }
                else {
                    //console.log("productUIItem is null for BibItem");
                }
            }
        }
        else {
            //console.log("recipeItem is null for BibItem");
        }
    };
    // return boolean
    ProductDataService.prototype.isSameCountry = function (countryList, country) {
        for (var _i = 0, countryList_1 = countryList; _i < countryList_1.length; _i++) {
            var clc = countryList_1[_i];
            if (clc.Country === country) {
                return true;
            }
        }
        return false;
    };
    // return ButtonModel
    ProductDataService.prototype.toButtonModel = function (recipeItem) {
        var toReturn = new app_types_1.ButtonModel;
        toReturn.ButtonType = app_types_1.ButtonType.statebutton;
        toReturn.RecipeId = recipeItem.Id;
        toReturn.Label = recipeItem.Name;
        toReturn.BackgroundColor = "#3681C4";
        toReturn.TextColor = "black";
        toReturn.IsDisabled = true;
        toReturn.FooterColor = "yellow";
        toReturn.FooterFontColor = "black";
        toReturn.FooterText = "Disabled";
        toReturn.ActionId = "enable.mixology";
        return toReturn;
    };
    // return RecipeItemModel
    ProductDataService.prototype.getRecipe = function (recipeId) {
        var recipe = _.find(this.productDataRepository.getAllRecipeItems(), function (item) {
            return item.Id == recipeId;
        });
        return recipe;
    };
    ProductDataService = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(server_types_1.default.AppInfo)),
        __param(1, inversify_1.inject(server_types_1.default.ProductDataRepository)),
        __metadata("design:paramtypes", [app_info_service_1.AppInfoService,
            product_data_repository_1.ProductDataRepository])
    ], ProductDataService);
    return ProductDataService;
}());
exports.ProductDataService = ProductDataService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpZ3VyYXRpb24vcHJvZHVjdC1kYXRhLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFFQSx1Q0FBNkM7QUFDN0MsOENBQTJDO0FBQzNDLGlFQUE0RDtBQUM1RCxnREFBb0M7QUFDcEMscUVBQWdFO0FBRWhFLDBCQUE0QjtBQUM1QixvREFnQmdDO0FBSWhDO0lBT0ksNEJBQTJDLE9BQXVCLEVBQ1QscUJBQTRDO1FBRDFELFlBQU8sR0FBUCxPQUFPLENBQWdCO1FBQ1QsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQUpyRyxnQkFBVyxHQUFtQixFQUFFLENBQUM7UUFDakMsZUFBVSxHQUFtQyxFQUFFLENBQUM7UUFJNUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxlQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFdEQsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVELDJCQUEyQjtJQUMzQiwwQ0FBYSxHQUFiO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzFELENBQUM7SUFFRCwyQkFBMkI7SUFDM0IsaUVBQW9DLEdBQXBDLFVBQXFDLGdCQUFpQztRQUNsRSxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUVwRSxNQUFNLENBQUMsY0FBYyxDQUFDO0lBQzFCLENBQUM7SUFFRCw2Q0FBZ0IsR0FBaEI7UUFDSSw2Q0FBNkM7UUFDN0MsTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQ3pELENBQUM7SUFFRCx5QkFBeUI7SUFDekIsa0RBQXFCLEdBQXJCLFVBQXNCLGdCQUFpQztRQUVuRCxJQUFJLENBQUMsVUFBVSxFQUFF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QUFxQixDQUFDLENBQUE7eUNBREksaUNBQWM7WUFDYywrQ0FBcUI7T0FSNUYsa0JBQWtCLENBMmU5QjtJQUFELHlCQUFDO0NBM2VELEFBMmVDLElBQUE7QUEzZVksZ0RBQWtCIiwiZmlsZSI6ImNvbmZpZ3VyYXRpb24vcHJvZHVjdC1kYXRhLXNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcblxuaW1wb3J0IHtpbmplY3QsIGluamVjdGFibGV9IGZyb20gXCJpbnZlcnNpZnlcIjtcbmltcG9ydCB7SnNVdGlsfSBmcm9tIFwiLi4vdW5pdmVyc2FsL0pzVXRpbFwiO1xuaW1wb3J0IHtBcHBJbmZvU2VydmljZX0gZnJvbSBcIi4uL3NlcnZpY2VzL2FwcC1pbmZvLnNlcnZpY2VcIjtcbmltcG9ydCBUWVBFUyBmcm9tIFwiLi4vc2VydmVyLnR5cGVzXCI7XG5pbXBvcnQge1Byb2R1Y3REYXRhUmVwb3NpdG9yeX0gZnJvbSBcIi4vcHJvZHVjdC1kYXRhLXJlcG9zaXRvcnlcIjtcbmltcG9ydCB7VmFsdmVBc3NpZ25tZW50UmVwb3NpdG9yeX0gZnJvbSBcIi4vdmFsdmUtYXNzaWdubWVudC1yZXBvc2l0b3J5XCI7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQge1xuICAgIEJpYkl0ZW1Nb2RlbCxcbiAgICBCaWJJdGVtVHlwZSxcbiAgICBCdXR0b25CZWhhdmlvcixcbiAgICBCdXR0b25Nb2RlbCxcbiAgICBCdXR0b25Nb2RlbExpc3QsXG4gICAgQnV0dG9uVHlwZSxcbiAgICBDb3VudHJ5TGFuZ3VhZ2VDdXN0b21lck1vZGVsLFxuICAgIFBvdXJhYmxlRGVzaWduLFxuICAgIFByb2R1Y3RVSUl0ZW1Nb2RlbCxcbiAgICBSZWNpcGVJdGVtTW9kZWwsXG4gICAgUmVjaXBlVHlwZSxcbiAgICBTa3VUb1ZhbHZlTWFwcGluZyxcbiAgICBVSVZpc3VhbHNNb2RlbCxcbiAgICBWYWx2ZUFzc2lnbm1lbnQsXG4gICAgVmFsdmVBc3NpZ25tZW50U3RhdGVcbn0gZnJvbSBcIi4uL3VuaXZlcnNhbC9hcHAudHlwZXNcIjtcbmltcG9ydCB7RGV2aWNlSW5mb30gZnJvbSBcIi4uL3VuaXRzdGF0ZS9kZXZpY2UtaW5mb1wiO1xuXG5AaW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUHJvZHVjdERhdGFTZXJ2aWNlIHtcbiAgICBvYmplY3RJZDogbnVtYmVyO1xuXG4gICAgdmFsdmVBc3NpZ25tZW50UmVwb3NpdG9yeTogVmFsdmVBc3NpZ25tZW50UmVwb3NpdG9yeTtcbiAgICBhbGxCaWJJdGVtczogQmliSXRlbU1vZGVsW10gPSBbXTtcbiAgICBkY3RTa3VTZXRzOiB7IFsgc2t1OiBzdHJpbmcgXSA6IHN0cmluZ1tdIH0gPSB7fTtcblxuICAgIGNvbnN0cnVjdG9yKEBpbmplY3QoVFlQRVMuQXBwSW5mbykgcHJpdmF0ZSBhcHBJbmZvOiBBcHBJbmZvU2VydmljZSxcbiAgICAgICAgICAgICAgICBAaW5qZWN0KFRZUEVTLlByb2R1Y3REYXRhUmVwb3NpdG9yeSkgcHJpdmF0ZSBwcm9kdWN0RGF0YVJlcG9zaXRvcnk6IFByb2R1Y3REYXRhUmVwb3NpdG9yeSkge1xuICAgICAgICB0aGlzLm9iamVjdElkID0gSnNVdGlsLmdldE9iamVjdElkKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiY3Rvci5Qcm9kdWN0RGF0YVNlcnZpY2VcIiwgdGhpcy5vYmplY3RJZCk7XG5cbiAgICAgICAgdGhpcy5hZnRlclByb3BlcnRpZXNTZXQoKTtcbiAgICB9XG5cbiAgICAvLyByZXR1cm4gcmVjaXBlSXRlbU1vZGVsW11cbiAgICBnZXRBbGxSZWNpcGVzKCk6IFJlY2lwZUl0ZW1Nb2RlbFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvZHVjdERhdGFSZXBvc2l0b3J5LmdldEFsbFJlY2lwZUl0ZW1zKCk7XG4gICAgfVxuXG4gICAgLy8gcmV0dXJuIHJlY2lwZUl0ZW1Nb2RlbFtdXG4gICAgZ2V0RGlzcGVuc2FibGVSZWNpcGVzRm9yQ3VyYXRlZE1peGVzKHZhbHZlQXNzaWdubWVudHM6IFZhbHZlQXNzaWdubWVudCk6IFJlY2lwZUl0ZW1Nb2RlbFtdIHtcbiAgICAgICAgY29uc3QgY3VyYXRlZFJlY2lwZXMgPSB0aGlzLmdldERpc3BlbnNhYmxlUmVjaXBlcyh2YWx2ZUFzc2lnbm1lbnRzKTtcblxuICAgICAgICByZXR1cm4gY3VyYXRlZFJlY2lwZXM7XG4gICAgfVxuXG4gICAgZ2V0RHJpdmVUaHJ1RGF0YSgpOiBVSVZpc3VhbHNNb2RlbCB7XG4gICAgICAgIC8vIHdlJ3JlIG9ubHkgZ2V0dGluZyB0aGUgYWN0aW9uIGJ1dHRvbnMgaGVyZVxuICAgICAgICByZXR1cm4gdGhpcy5wcm9kdWN0RGF0YVJlcG9zaXRvcnkuZ2V0RHJpdmVUaHJ1RGF0YSgpO1xuICAgIH1cblxuICAgIC8vIHJldHVybiByZWNpcGVJdGVtTW9kZWxcbiAgICBnZXREaXNwZW5zYWJsZVJlY2lwZXModmFsdmVBc3NpZ25tZW50czogVmFsdmVBc3NpZ25tZW50KTogUmVjaXBlSXRlbU1vZGVsW10ge1xuXG4gICAgICAgIHRoaXMuZ2V0U2t1TGlzdCgpO1xuXG4gICAgICAgIGNvbnN0IGRpc3BlbnNpYmxlUmVjaXBlczogUmVjaXBlSXRlbU1vZGVsW10gPSBbXTtcbiAgICAgICAgdmFyIGRjdE1vdW50ZWRTa3VzOiB7IFtpZDogc3RyaW5nXTogVmFsdmVBc3NpZ25tZW50U3RhdGUgfSA9IHt9O1xuXG4gICAgICAgIHZhciBhc3NpZ25lZFZhbHZlcyA9IF8uZmlsdGVyKHZhbHZlQXNzaWdubWVudHMuQXNzaWdubWVudHMsIGZ1bmN0aW9uKGFzc2lnbm1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBhc3NpZ25tZW50LmlzQXNzaWduZWQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBhbHROYW1lRm9yRmxhdm9yczogU3RyaW5nW10gPSBbXTtcblxuICAgICAgICBmb3IgKGNvbnN0IHZhbHZlIG9mIGFzc2lnbmVkVmFsdmVzKSB7XG4gICAgICAgICAgICBjb25zdCBiaWJJdGVtTW9kZWw6IEJpYkl0ZW1Nb2RlbCA9IHZhbHZlLkJpYkl0ZW1Bc0J1dHRvbk1vZGVsLnBheWxvYWQ7XG5cbiAgICAgICAgICAgIGlmIChiaWJJdGVtTW9kZWwuVHlwZSA9PT0gQmliSXRlbVR5cGUuZmxhdm9yc2hvdCkge1xuICAgICAgICAgICAgICAgIGFsdE5hbWVGb3JGbGF2b3JzLnB1c2goYmliSXRlbU1vZGVsLkFsdE5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gd2hhdCdzIGEgamF2YXNjcmlwdCBlcXVpdmFsZW50IHRvIGEgYyMgZGljdGlvbmFyeVxuICAgICAgICAgICAgaWYgKGRjdE1vdW50ZWRTa3VzW3ZhbHZlLlNLVV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGRjdE1vdW50ZWRTa3VzW3ZhbHZlLlNLVV0gPSB2YWx2ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTS1UgaXMgbW91bnRlZCBtdWx0aXBsZSB0aW1lc1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlY2lwZXMgPSB0aGlzLnByb2R1Y3REYXRhUmVwb3NpdG9yeS5nZXRBbGxSZWNpcGVJdGVtcygpO1xuXG4gICAgICAgIGZvciAoY29uc3QgcmVjaXBlIG9mIHJlY2lwZXMpIHtcbiAgICAgICAgICAgIHZhciBmb3VuZEFsbFNrdXMgPSBmYWxzZTtcblxuICAgICAgICAgICAgcmVjaXBlLlNrdVRvVmFsdmVNYXBwaW5ncyA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBza3VJdGVtIG9mIHJlY2lwZS5TeXJ1cFNrdXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGN0TW91bnRlZFNrdXNbc2t1SXRlbS5Ta3VdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZm91bmRBbGxTa3VzID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgYXZhaWxhYmxlU2t1TWFwcGluZ3MgPSBfLmZpbmQocmVjaXBlLlNrdVRvVmFsdmVNYXBwaW5ncywgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uU2t1ID09PSBza3VJdGVtLlNrdTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFhdmFpbGFibGVTa3VNYXBwaW5ncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVjaXBlLlNrdVRvVmFsdmVNYXBwaW5ncy5wdXNoKG5ldyBTa3VUb1ZhbHZlTWFwcGluZyhza3VJdGVtLlNrdSwgZGN0TW91bnRlZFNrdXNbc2t1SXRlbS5Ta3VdKSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGZvciB0aGUgbW9tZW50LCB3ZSdyZSBnb2luZyB0byBpZ25vcmUgdGhlIG5vdGlvbiB0aGF0IGEgY29tcGF0aWJsZSBzeXJ1cCBTS1UgbWlnaHQgYmUgbWFwcGVkIG9uIG11bHRpcGxlIHZhbHZlc1xuXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJlY2lwZS5TeXJ1cFNrdXMubGVuZ3RoID4gMCAmJiByZWNpcGUuU2t1VG9WYWx2ZU1hcHBpbmdzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyZWNpcGUuU3lydXBTa3VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGZvdW5kQWxsU2t1cyA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB3YXRlclNrdXM6IHN0cmluZ1tdID0gW107XG5cbiAgICAgICAgICAgIGZvciAobGV0IHdhdGVyUmVjaXBlIG9mIHJlY2lwZS5XYXRlclNrdXMpIHtcbiAgICAgICAgICAgICAgICB3YXRlclNrdXMucHVzaCh3YXRlclJlY2lwZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAobGV0IHNrdSBvZiB3YXRlclNrdXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGN0TW91bnRlZFNrdXNbc2t1XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvdW5kQWxsU2t1cyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlY2lwZS5Ta3VUb1ZhbHZlTWFwcGluZ3Nbc2t1XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVjaXBlLlNrdVRvVmFsdmVNYXBwaW5nc1tza3VdID0gbmV3IFNrdVRvVmFsdmVNYXBwaW5nKHNrdSwgZGN0TW91bnRlZFNrdXNbc2t1XSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyZWNpcGUuRmxhdm9yU2t1cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJDdXJhdGVkIE1peDogXCIsIHJlY2lwZS5OYW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChsZXQgc2t1IG9mIHJlY2lwZS5GbGF2b3JTa3VzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbXBhdGlibGVTa3VzID0gdGhpcy5kY3RTa3VTZXRzW3NrdS5Ta3VdO1xuICAgICAgICAgICAgICAgIHZhciBmbGF2b3JWYWx2ZUFzc2lnbm1lbnQgPSBudWxsOyAvLyBWYWx2ZUFzc2lnbm1lbnRTdGF0ZVxuXG4gICAgICAgICAgICAgICAgaWYgKGNvbXBhdGlibGVTa3VzKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGFsdFNrdSBvZiBjb21wYXRpYmxlU2t1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRjdE1vdW50ZWRTa3VzW2FsdFNrdV0pIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsYXZvclZhbHZlQXNzaWdubWVudCA9IGRjdE1vdW50ZWRTa3VzW2FsdFNrdV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXhpc3RpbmdTa3UgPSBfLmZpbmQocmVjaXBlLlNrdVRvVmFsdmVNYXBwaW5ncywgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uU0tVID09IGFsdFNrdTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZXhpc3RpbmdTa3UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFfLmZpbmQocmVjaXBlLlNrdVRvVmFsdmVNYXBwaW5ncywgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbS5WYWx2ZUFzc2lnbm1lbnRTdGF0ZSA9PSBmbGF2b3JWYWx2ZUFzc2lnbm1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiQ29tcGF0aWJsZSBTS1UgRm91bmQgc2t1OlwiICsgc2t1ICsgXCIgYWx0c2t1IFwiICsgYWx0U2t1KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlY2lwZS5Ta3VUb1ZhbHZlTWFwcGluZ3MucHVzaChuZXcgU2t1VG9WYWx2ZU1hcHBpbmcoYWx0U2t1LCBmbGF2b3JWYWx2ZUFzc2lnbm1lbnQpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJDb21wYXRpYmxlIFNLVSBBTFJFQURZIExPQURFRCBza3U6XCIgKyBza3UgKyBcIiBhbHRza3U6XCIgKyBhbHRTa3UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChmbGF2b3JWYWx2ZUFzc2lnbm1lbnQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBubyBTS1UgbWFwcGluZyBmb3VuZFxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiTm8gZmxhdm9yIFNLVSBNYXBwaW5nIEZvdW5kIGZvcjogXCIsIHNrdSk7XG4gICAgICAgICAgICAgICAgICAgIGZvdW5kQWxsU2t1cyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGZvdW5kQWxsU2t1cykge1xuICAgICAgICAgICAgICAgIGRpc3BlbnNpYmxlUmVjaXBlcy5wdXNoKHJlY2lwZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGlzcGVuc2libGVSZWNpcGVzO1xuICAgIH1cblxuICAgIC8vIHZvaWRcbiAgICBhZnRlclByb3BlcnRpZXNTZXQoKSB7XG4gICAgICAgIHRoaXMuYWxsQmliSXRlbXMgPSB0aGlzLnByb2R1Y3REYXRhUmVwb3NpdG9yeS5nZXRBbGxCaWJJdGVtcygpO1xuXG4gICAgICAgIHRoaXMuZ2V0U2t1TGlzdCgpO1xuICAgIH1cblxuICAgIC8vIHZvaWRcbiAgICByZXNldCgpIHtcbiAgICAgICAgdGhpcy5wcm9kdWN0RGF0YVJlcG9zaXRvcnkucmVzZXQoKTtcbiAgICB9XG5cbiAgICAvLyByZXR1cm4gZGljdGlvbmFyeVxuICAgIGdldFNrdUxpc3QoKTogeyBbIHNrdTogc3RyaW5nIF0gOiBzdHJpbmdbXSB9IHtcblxuICAgICAgICBpZiAoT2JqZWN0LmtleXModGhpcy5kY3RTa3VTZXRzKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kY3RTa3VTZXRzO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJlY2lwZUl0ZW1zOiBSZWNpcGVJdGVtTW9kZWxbXSA9IHRoaXMucHJvZHVjdERhdGFSZXBvc2l0b3J5LmdldEFsbFJlY2lwZUl0ZW1zKCk7XG5cbiAgICAgICAgZm9yIChjb25zdCByZWNpcGUgb2YgXy5maWx0ZXIocmVjaXBlSXRlbXMsIGZ1bmN0aW9uKHJlY2lwZUl0ZW0pIHsgcmV0dXJuIHJlY2lwZUl0ZW0uVHlwZSAhPT0gUmVjaXBlVHlwZS5NaXg7IH0gKSkge1xuXG4gICAgICAgICAgICB2YXIgc2t1TGlzdCA9IHJlY2lwZS5TeXJ1cFNrdXM7XG4gICAgICAgICAgICBmb3IgKGxldCBza3Ugb2Ygc2t1TGlzdCkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5kY3RTa3VTZXRzLmhhc093blByb3BlcnR5KHNrdSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kY3RTa3VTZXRzW3NrdV0gPSBza3VMaXN0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmbGF2b3JOYW1lczogc3RyaW5nW10gPSBbXTtcblxuICAgICAgICB2YXIgbWl4U2t1cyA9IF8uZmlsdGVyKHRoaXMuYWxsQmliSXRlbXMsIGZ1bmN0aW9uKGJpYml0ZW0pIHsgcmV0dXJuIGJpYml0ZW0uVHlwZSA9PT0gQmliSXRlbVR5cGUuZmxhdm9yc2hvdCB9ICk7XG5cbiAgICAgICAgZm9yIChsZXQgYmliSXRlbSBvZiBtaXhTa3VzKSB7XG5cbiAgICAgICAgICAgIGlmIChiaWJJdGVtLkFsdE5hbWUgPT09IHVuZGVmaW5lZCB8fCBiaWJJdGVtLkFsdE5hbWUgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJpYkl0ZW0gRmxhdm9yU2hvdCBtdXN0IGJlIGNvbmZpZ3VyZWQgd2l0aCBhbiBBbHROYW1lXCIpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmbGF2b3JOYW1lcy5wdXNoKCBiaWJJdGVtLkFsdE5hbWUpO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuZGN0U2t1U2V0cy5oYXNPd25Qcm9wZXJ0eShiaWJJdGVtLkFsdE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kY3RTa3VTZXRzW2JpYkl0ZW0uQWx0TmFtZV0gPSBbXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHNrdUxpc3QgPSB0aGlzLmRjdFNrdVNldHNbYmliSXRlbS5BbHROYW1lXTtcblxuICAgICAgICAgICAgaWYgKF8uZmluZChza3VMaXN0LCBmdW5jdGlvbihza3UpIHsgcmV0dXJuIHNrdSA9PT0gYmliSXRlbS5TS1UgfSApID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBza3VMaXN0LnB1c2goYmliSXRlbS5TS1UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBmbGF2b3Igb2YgZmxhdm9yTmFtZXMpIHtcbiAgICAgICAgICAgIHZhciBsaXN0ID0gdGhpcy5kY3RTa3VTZXRzW2ZsYXZvcl07XG4gICAgICAgICAgICBmb3IgKGxldCBza3Ugb2YgbGlzdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGN0U2t1U2V0c1tza3VdID0gbGlzdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmRjdFNrdVNldHM7XG4gICAgfVxuXG4gICAgLy8gcmV0dXJuIHN0cmluZ1xuICAgIGdldFJlY2lwZVZlcnNpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnByb2R1Y3REYXRhUmVwb3NpdG9yeS5nZXRSZWNpcGVJdGVtc1ZlcnNpb24oKTtcbiAgICB9XG5cbiAgICAvLyBUT0RPIHN5bnRheFxuICAgIC8vIHJldHVybiBCdXR0b25Nb2RlbExpc3RcbiAgICBnZXRCaWJJdGVtcygpOiBCdXR0b25Nb2RlbExpc3Qge1xuXG4gICAgICAgIHZhciBidXR0b25zOiBCdXR0b25Nb2RlbExpc3QgPSBuZXcgQnV0dG9uTW9kZWxMaXN0KCk7XG5cbiAgICAgICAgZm9yIChsZXQgYmliSXRlbSBvZiB0aGlzLmFsbEJpYkl0ZW1zKSB7XG5cbiAgICAgICAgICAgIHZhciBidXR0b25Nb2RlbDogQnV0dG9uTW9kZWwgPSBuZXcgQnV0dG9uTW9kZWwoKTtcbiAgICAgICAgICAgIGJ1dHRvbk1vZGVsLklkID0gYmliSXRlbS5TS1U7XG4gICAgICAgICAgICBidXR0b25Nb2RlbC5MYWJlbCA9IGJpYkl0ZW0uTmFtZTtcbiAgICAgICAgICAgIGJ1dHRvbk1vZGVsLkFjdGlvbklkID0gXCJCaWJJdGVtXCI7XG4gICAgICAgICAgICBidXR0b25Nb2RlbC5wYXlsb2FkID0gYmliSXRlbTtcbiAgICAgICAgICAgIGJ1dHRvbk1vZGVsLmJlaGF2aW9ycyA9IFtCdXR0b25CZWhhdmlvci50YXAsIEJ1dHRvbkJlaGF2aW9yLmNoZWNrYWJsZSwgQnV0dG9uQmVoYXZpb3IubG9uZ3ByZXNzLCBCdXR0b25CZWhhdmlvci5zdGF0dXNdO1xuICAgICAgICAgICAgYnV0dG9uTW9kZWwuQnV0dG9uVHlwZSA9IEJ1dHRvblR5cGUudmFsdmVBc3NpZ25tZW50O1xuICAgICAgICAgICAgYnV0dG9uTW9kZWwuRm9vdGVyVGV4dCA9IGJpYkl0ZW0uU0tVOyAvLyBUT0RPIG5vdCBmb290ZXJ0ZXh0P1xuXG4gICAgICAgICAgICBidXR0b25zLkFsbFR5cGVzLnB1c2goYnV0dG9uTW9kZWwpO1xuXG4gICAgICAgICAgICB0aGlzLmdldFZpc3VhbEZvckJpYkl0ZW0oYnV0dG9uTW9kZWwsIGJpYkl0ZW0pO1xuXG4gICAgICAgICAgICBzd2l0Y2ggKGJpYkl0ZW0uVHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgQmliSXRlbVR5cGUuY2FyYndhdGVyOlxuICAgICAgICAgICAgICAgIGNhc2UgQmliSXRlbVR5cGUuc3RpbGx3YXRlcjpcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9ucy5XYXRlclR5cGUucHVzaChidXR0b25Nb2RlbCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSBCaWJJdGVtVHlwZS5mbGF2b3JzaG90OlxuICAgICAgICAgICAgICAgICAgICBidXR0b25zLkZsYXZvclR5cGUucHVzaChidXR0b25Nb2RlbCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSBCaWJJdGVtVHlwZS5zeXJ1cDpcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9ucy5TeXJ1cFR5cGUucHVzaChidXR0b25Nb2RlbCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBidXR0b25zO1xuICAgIH1cblxuICAgIC8vIHJldHVybiBiaWJJdGVtTW9kZWxbXVxuICAgIGdldEFsbEJpYkl0ZW1zKCk6IEJpYkl0ZW1Nb2RlbFtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWxsQmliSXRlbXM7XG4gICAgfVxuXG4gICAgLy8gVE9ETyBTZXJ2aWNlVUkgZnVuY3Rpb25cbiAgICAvLyByZXR1cm4gQnV0dG9uTW9kZWxcbiAgICBnZXRVbmFzc2lnbmVkQnV0dG9uRm9yVmFsdmVBc3NpZ25tZW50KGJpYkl0ZW1UeXBlOiBCaWJJdGVtVHlwZSk6IEJ1dHRvbk1vZGVsIHtcbiAgICAgICAgdmFyIGJpYkl0ZW1Nb2RlbCA9IG5ldyBCaWJJdGVtTW9kZWwoKTtcbiAgICAgICAgYmliSXRlbU1vZGVsLlR5cGUgPSBiaWJJdGVtVHlwZTtcblxuICAgICAgICB2YXIgdW5hc3NpZ25CdXR0b24gPSBuZXcgQnV0dG9uTW9kZWwoKTtcbiAgICAgICAgLy8gTG9jYWxpemF0aW9uIHNlcnZpY2VcbiAgICAgICAgLy91bmFzc2lnbkJ1dHRvbi5MYWJlbCA9XG4gICAgICAgIHVuYXNzaWduQnV0dG9uLlJlc291cmNlSWQgPSBcIm5vdF9pbl91c2VfaWRcIjtcbiAgICAgICAgdW5hc3NpZ25CdXR0b24uQWN0aW9uSWQgPSBcInVuYXNzaWduXCI7XG4gICAgICAgIC8vdW5hc3NpZ25CdXR0b24uYnV0dG9uQmVoYXZpb3JcbiAgICAgICAgLy8gVE9ETyBpcyBidXR0b25CZWhhdmlvciBiZWluZyBjb3BpZWQgb3Zlcj9cbiAgICAgICAgdW5hc3NpZ25CdXR0b24ucGF5bG9hZCA9IGJpYkl0ZW1Nb2RlbDtcbiAgICAgICAgdW5hc3NpZ25CdXR0b24uQnV0dG9uVHlwZSA9IEJ1dHRvblR5cGUudmFsdmVBc3NpZ25tZW50O1xuICAgICAgICB1bmFzc2lnbkJ1dHRvbi5XZWlnaHRpbmcgPSAtMTtcblxuICAgICAgICByZXR1cm4gdW5hc3NpZ25CdXR0b247XG4gICAgfVxuXG4gICAgLy8gVE9ETyBTZXJ2aWNlVUkgZnVuY3Rpb25cbiAgICAvLyB2b2lkXG4gICAgYWRkVW5hc3NpZ25lZEJ1dHRvbnNGb3JVSVRvQ2xlYXJBc3NpZ25tZW50KGFsbEJ1dHRvbnM6IEJ1dHRvbk1vZGVsTGlzdCkge1xuICAgICAgICB2YXIgdW5hc3NpZ25CdXR0b24gPSB0aGlzLmdldFVuYXNzaWduZWRCdXR0b25Gb3JWYWx2ZUFzc2lnbm1lbnQoQmliSXRlbVR5cGUuY2FyYndhdGVyKTtcblxuICAgICAgICBhbGxCdXR0b25zLldhdGVyVHlwZS5wdXNoKHVuYXNzaWduQnV0dG9uKTtcblxuICAgICAgICB1bmFzc2lnbkJ1dHRvbiA9IHRoaXMuZ2V0VW5hc3NpZ25lZEJ1dHRvbkZvclZhbHZlQXNzaWdubWVudChCaWJJdGVtVHlwZS5zeXJ1cCk7XG4gICAgICAgIGFsbEJ1dHRvbnMuU3lydXBUeXBlLnB1c2godW5hc3NpZ25CdXR0b24pO1xuXG4gICAgICAgIHVuYXNzaWduQnV0dG9uID0gdGhpcy5nZXRVbmFzc2lnbmVkQnV0dG9uRm9yVmFsdmVBc3NpZ25tZW50KEJpYkl0ZW1UeXBlLmZsYXZvcnNob3QpO1xuICAgICAgICBhbGxCdXR0b25zLkZsYXZvclR5cGUucHVzaCh1bmFzc2lnbkJ1dHRvbik7XG4gICAgfVxuXG4gICAgLy8gVE9ETyBTZXJ2aWNlVWkgZnVuY3Rpb25cbiAgICAvLyBwcm9kdWN0VWlJdGVtTW9kZWxcbiAgICBnZXRWaXN1YWxGb3JSZWNpcGUocmVjaXBlOiBSZWNpcGVJdGVtTW9kZWwpOiBQb3VyYWJsZURlc2lnbiB7XG4gICAgICAgIHZhciBwb3RlbnRpYWxseUF2YWlsYWJsZSA9IF8uZmlsdGVyKHRoaXMucHJvZHVjdERhdGFSZXBvc2l0b3J5LmdldEFsbFByb2R1Y3RVSUl0ZW1zKCksIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLnJlY2lwZUlkID09IHJlY2lwZS5JZDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHBvdGVudGlhbGx5QXZhaWxhYmxlLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vIHZpc3VhbCBmb3IgcmVjaXBlXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNlbGVjdGVkVmlzdWFsID0gcG90ZW50aWFsbHlBdmFpbGFibGVbMF07XG5cbiAgICAgICAgLy8gVE9ETyAtIG5lZWQgdG8gY29uc2lkZXIgY291bnRyeSAvIGxhbmd1YWdlIC8gY3VzdG9tZXJcbiAgICAgICAgcmV0dXJuIHNlbGVjdGVkVmlzdWFsO1xuICAgIH1cblxuICAgIC8vIFRPRE8gU2VydmljZVVJIGZ1bmN0aW9uXG4gICAgLy8gdm9pZFxuICAgIGdldFZpc3VhbEZvckJpYkl0ZW0oYnV0dG9ubW9kZWw6IEJ1dHRvbk1vZGVsLCBiaWJpdGVtOiBCaWJJdGVtTW9kZWwpIHtcbiAgICAgICAgdmFyIGFsbFJlY2lwZUl0ZW1zID0gdGhpcy5wcm9kdWN0RGF0YVJlcG9zaXRvcnkuZ2V0QWxsUmVjaXBlSXRlbXMoKTtcbiAgICAgICAgdmFyIGFsbFByb2R1Y3RVSUl0ZW1zID0gdGhpcy5wcm9kdWN0RGF0YVJlcG9zaXRvcnkuZ2V0QWxsUHJvZHVjdFVJSXRlbXMoKTtcblxuICAgICAgICB2YXIgcmVjaXBlSXRlbSA9IG5ldyBSZWNpcGVJdGVtTW9kZWw7XG4gICAgICAgIHZhciByZWNpcGVJdGVtcyA9IG5ldyBBcnJheTxSZWNpcGVJdGVtTW9kZWw+KCk7XG5cbiAgICAgICAgc3dpdGNoIChiaWJpdGVtLlR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgQmliSXRlbVR5cGUuY2FyYndhdGVyOlxuICAgICAgICAgICAgY2FzZSBCaWJJdGVtVHlwZS5zdGlsbHdhdGVyOlxuXG4gICAgICAgICAgICAgICAgcmVjaXBlSXRlbXMgPSBfLmZpbHRlcihhbGxSZWNpcGVJdGVtcywgZnVuY3Rpb24ocmVjaXBlSXRlbSkgeyByZXR1cm4gcmVjaXBlSXRlbS5XYXRlclNrdXMgIT0gbnVsbCAmJiByZWNpcGVJdGVtLldhdGVyU2t1cy5pbmRleE9mKGJpYml0ZW0uU0tVKSA+PSAwICYmIHJlY2lwZUl0ZW0uVHlwZSA9PSBSZWNpcGVUeXBlLldhdGVyIH0gKTtcblxuICAgICAgICAgICAgICAgIGlmIChyZWNpcGVJdGVtcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZWNpcGVJdGVtc0J5TmFtZSA9IF8uZmlsdGVyKHJlY2lwZUl0ZW1zLCBmdW5jdGlvbihyZWNpcGVJdGVtKSB7IHJldHVybiByZWNpcGVJdGVtLk5hbWUuaW5kZXhPZihiaWJpdGVtLk5hbWUpID49IDAgfSApO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWNpcGVJdGVtc0J5TmFtZS5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVjaXBlSXRlbSA9IHJlY2lwZUl0ZW1zQnlOYW1lWzBdO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImNvdWxkIG5vdCByZXNvbHZlIHJlY2lwZUl0ZW0gZm9yIEJpYkl0ZW1cIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVjaXBlSXRlbXMubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY2lwZUl0ZW0gPSByZWNpcGVJdGVtc1swXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJjb3VsZCBub3QgcmVzb2x2ZSByZWNpcGVJdGVtIGZvciBCaWJJdGVtXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gZ2V0IHRoZSBpbWFnZSBmb3IgdGhlIHdhdGVyIGluIHByb2R1Y3RVaUl0ZW1zXG4gICAgICAgICAgICAgICAgbGV0IHJlY2lwZVBVaUl0ZW0gPSBfLmZpbmQoYWxsUHJvZHVjdFVJSXRlbXMsIGZ1bmN0aW9uIChwSXRlbSkgeyByZXR1cm4gcEl0ZW0ucmVjaXBlSWQgPT09IHJlY2lwZUl0ZW0uSWQgfSApO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlY2lwZVBVaUl0ZW0gJiYgcmVjaXBlUFVpSXRlbS5kZXNpZ24uYXNzZXRzLmxvZ29Ib21lICE9ICcnICYmIHJlY2lwZVBVaUl0ZW0uZGVzaWduLmFzc2V0cy5sb2dvSG9tZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbm1vZGVsLlBhdGhUb0ltYWdlID0gcmVjaXBlUFVpSXRlbS5kZXNpZ24uYXNzZXRzLmxvZ29Ib21lO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBCaWJJdGVtVHlwZS5mbGF2b3JzaG90OlxuXG4gICAgICAgICAgICAgICAgcmVjaXBlSXRlbXMgPSBfLmZpbHRlcihhbGxSZWNpcGVJdGVtcywgZnVuY3Rpb24ocmVjaXBlSXRlbSkgeyByZXR1cm4gcmVjaXBlSXRlbS5GbGF2b3JTa3VzICE9IG51bGwgJiYgcmVjaXBlSXRlbS5GbGF2b3JTa3VzLmluZGV4T2YoYmliaXRlbS5TS1UpID49IDAgJiYgcmVjaXBlSXRlbS5UeXBlID09IFJlY2lwZVR5cGUuTWl4IH0gKTtcblxuICAgICAgICAgICAgICAgIGlmIChyZWNpcGVJdGVtcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwVWlJdGVtID0gXy5maW5kKGFsbFByb2R1Y3RVSUl0ZW1zLCBmdW5jdGlvbihwSXRlbSkgeyByZXR1cm4gcEl0ZW0uaWQgPT09IGJpYml0ZW0uTmFtZSB9ICk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBVaUl0ZW0gIT0gbnVsbCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiUFVJVEVNOiBcIiwgcFVpSXRlbSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vYnV0dG9ubW9kZWwuQmFja2dyb3VuZENvbG9yID0gcFVpSXRlbS5Db2xvckJhY2tncm91bmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25tb2RlbC5QYXRoVG9JbWFnZSA9IHBVaUl0ZW0uZGVzaWduLmFzc2V0cy5sb2dvSG9tZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIk5ldyBCdXR0b24gTW9kZWw6XCIsIGJ1dHRvbm1vZGVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJjb3VsZCBub3QgcmVzb2x2ZSByZWNpcGVJdGVtIGZvciBCaWJJdGVtXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlY2lwZUl0ZW1zLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWNpcGVJdGVtID0gcmVjaXBlSXRlbXNbMF07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZpcnN0T3JEZWZhdWx0XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcFVpSXRlbSA9IF8uZmluZChhbGxQcm9kdWN0VUlJdGVtcywgZnVuY3Rpb24ocEl0ZW0pIHsgcmV0dXJuIHBJdGVtLmlkID09PSBiaWJpdGVtLk5hbWUgfSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBVaUl0ZW0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vYnV0dG9ubW9kZWwuQmFja2dyb3VuZENvbG9yID0gcFVpSXRlbS5Db2xvckJhY2tncm91bmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9ubW9kZWwuUGF0aFRvSW1hZ2UgPSBwVWlJdGVtLmRlc2lnbi5hc3NldHMubG9nb0hvbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiY291bGQgbm90IHJlc29sdmUgcmVjaXBlSXRlbSBmb3IgQmliSXRlbVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQmliSXRlbVR5cGUuc3lydXA6XG5cbiAgICAgICAgICAgICAgICByZWNpcGVJdGVtcyA9IF8uZmlsdGVyKGFsbFJlY2lwZUl0ZW1zLCBmdW5jdGlvbihyZWNpcGVJdGVtKSB7IHJldHVybiByZWNpcGVJdGVtLlN5cnVwU2t1cyAhPSBudWxsICYmIHJlY2lwZUl0ZW0uU3lydXBTa3VzLmluZGV4T2YoYmliaXRlbS5TS1UpID49IDAgJiYgcmVjaXBlSXRlbS5UeXBlID09PSBSZWNpcGVUeXBlLkJldmVyYWdlIH0gKTtcblxuICAgICAgICAgICAgICAgIGlmIChyZWNpcGVJdGVtcy5sZW5ndGggPiAxKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgcmVjaXBlSXRlbXNCeU5hbWUgPSBfLmZpbHRlcihyZWNpcGVJdGVtcywgZnVuY3Rpb24ocmVjaXBlSXRlbSkgeyByZXR1cm4gcmVjaXBlSXRlbS5OYW1lLmluZGV4T2YoYmliaXRlbS5OYW1lKSA+PSAwIH0gKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocmVjaXBlSXRlbXNCeU5hbWUubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlY2lwZUl0ZW0gPSByZWNpcGVJdGVtc0J5TmFtZVswXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJjb3VsZCBub3QgcmVzb2x2ZSByZWNpcGVJdGVtIGZvciBCaWJJdGVtXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlY2lwZUl0ZW1zLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWNpcGVJdGVtID0gcmVjaXBlSXRlbXNbMF07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiY291bGQgbm90IHJlc29sdmUgcmVjaXBlSXRlbSBmb3IgQmliSXRlbVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJlY2lwZUl0ZW0gIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGJpYml0ZW0uQ291bnRyeUxhbmd1YWdlQ3VzdG9tZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVjaXBlSWQgPSByZWNpcGVJdGVtLklkO1xuICAgICAgICAgICAgICAgIHZhciBjb3VudHJ5ID0gXCJcIjtcblxuICAgICAgICAgICAgICAgIGlmIChiaWJpdGVtLkNvdW50cnlMYW5ndWFnZUN1c3RvbWVyc1swXS5Db3VudHJ5ID09IFwiQ0FcIikge1xuICAgICAgICAgICAgICAgICAgICBjb3VudHJ5ID0gXCJDYW5hZGFcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb3VudHJ5ID0gYmliaXRlbS5Db3VudHJ5TGFuZ3VhZ2VDdXN0b21lcnNbMF0uQ291bnRyeTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBUT0RPIG5lZWQgYSB3YXkgdG8gY2FsbCBpc1NhbWVDb3VudHJ5IGZyb20gdGhpcyBmdW5jdGlvblxuICAgICAgICAgICAgICAgIHZhciBwcm9kdWN0VUlJdGVtID0gXy5maW5kKGFsbFByb2R1Y3RVSUl0ZW1zLCBmdW5jdGlvbiAocmVjaXBlSXRlbSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVjaXBlSXRlbS5Db3VudHJ5TGFuZ3VhZ2VDdXN0b21lciAhPSBudWxsICYmIHJlY2lwZUl0ZW0ucmVjaXBlSWQgJiYgcmVjaXBlSXRlbS5yZWNpcGVJZC5pbmRleE9mKHJlY2lwZUlkKSA+PSAwXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAocHJvZHVjdFVJSXRlbSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vYnV0dG9ubW9kZWwuQmFja2dyb3VuZENvbG9yID0gcHJvZHVjdFVJSXRlbS5Db2xvckJhY2tncm91bmQ7XG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbm1vZGVsLlBhdGhUb0ltYWdlID0gcHJvZHVjdFVJSXRlbS5kZXNpZ24uYXNzZXRzLmxvZ29Ib21lO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJwcm9kdWN0VUlJdGVtIGlzIG51bGwgZm9yIEJpYkl0ZW1cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInJlY2lwZUl0ZW0gaXMgbnVsbCBmb3IgQmliSXRlbVwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJldHVybiBib29sZWFuXG4gICAgaXNTYW1lQ291bnRyeShjb3VudHJ5TGlzdDogQ291bnRyeUxhbmd1YWdlQ3VzdG9tZXJNb2RlbFtdLCBjb3VudHJ5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgZm9yIChjb25zdCBjbGMgb2YgY291bnRyeUxpc3QpIHtcbiAgICAgICAgICAgIGlmIChjbGMuQ291bnRyeSA9PT0gY291bnRyeSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyByZXR1cm4gQnV0dG9uTW9kZWxcbiAgICB0b0J1dHRvbk1vZGVsKHJlY2lwZUl0ZW06IFJlY2lwZUl0ZW1Nb2RlbCk6IEJ1dHRvbk1vZGVsIHtcbiAgICAgICAgY29uc3QgdG9SZXR1cm4gPSBuZXcgQnV0dG9uTW9kZWw7XG5cbiAgICAgICAgdG9SZXR1cm4uQnV0dG9uVHlwZSA9IEJ1dHRvblR5cGUuc3RhdGVidXR0b247XG4gICAgICAgIHRvUmV0dXJuLlJlY2lwZUlkID0gcmVjaXBlSXRlbS5JZDtcbiAgICAgICAgdG9SZXR1cm4uTGFiZWwgPSByZWNpcGVJdGVtLk5hbWU7XG4gICAgICAgIHRvUmV0dXJuLkJhY2tncm91bmRDb2xvciA9IFwiIzM2ODFDNFwiO1xuICAgICAgICB0b1JldHVybi5UZXh0Q29sb3IgPSBcImJsYWNrXCI7XG4gICAgICAgIHRvUmV0dXJuLklzRGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICB0b1JldHVybi5Gb290ZXJDb2xvciA9IFwieWVsbG93XCI7XG4gICAgICAgIHRvUmV0dXJuLkZvb3RlckZvbnRDb2xvciA9IFwiYmxhY2tcIjtcbiAgICAgICAgdG9SZXR1cm4uRm9vdGVyVGV4dCA9IFwiRGlzYWJsZWRcIjtcbiAgICAgICAgdG9SZXR1cm4uQWN0aW9uSWQgPSBcImVuYWJsZS5taXhvbG9neVwiO1xuXG4gICAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICB9XG5cbiAgICAvLyByZXR1cm4gUmVjaXBlSXRlbU1vZGVsXG4gICAgZ2V0UmVjaXBlKHJlY2lwZUlkOiBzdHJpbmcpOiBSZWNpcGVJdGVtTW9kZWwge1xuICAgICAgICB2YXIgcmVjaXBlID0gXy5maW5kKHRoaXMucHJvZHVjdERhdGFSZXBvc2l0b3J5LmdldEFsbFJlY2lwZUl0ZW1zKCksIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLklkID09IHJlY2lwZUlkO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcmVjaXBlO1xuICAgIH1cbn0iXX0=
