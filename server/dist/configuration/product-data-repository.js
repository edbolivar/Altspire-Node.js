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
var JSONFILE = require("load-json-file");
var _ = require("lodash");
var app_types_1 = require("../universal/app.types");
var PATH = require("path");
var ProductDataRepository = /** @class */ (function () {
    function ProductDataRepository(appInfo, fileLocations) {
        this.appInfo = appInfo;
        this.fileLocations = fileLocations;
        this.visualsmodel = new app_types_1.UIVisualsModel;
        this.allBibItems = [];
        this.allProductUIItems = [];
        this.allRecipeItems = [];
        this.recipeItemsOwner = { Version: '1.0', Recipes: [] };
        this.objectId = JsUtil_1.JsUtil.getObjectId();
        console.log("ctor.ProductDataRepository", this.objectId);
        this.loadData();
    }
    ProductDataRepository.prototype.getRecipeItemsVersion = function () {
        return this.recipeItemsOwner.Version;
    };
    ProductDataRepository.prototype.getDriveThruData = function () {
        return this.visualsmodel;
    };
    ProductDataRepository.prototype.getAllProductUIItems = function () {
        // return productuiitemmodel list
        return this.allProductUIItems;
    };
    ProductDataRepository.prototype.getAllRecipeItems = function () {
        return this.allRecipeItems;
    };
    ProductDataRepository.prototype.getRecipeItemById = function (guid) {
        return _.find(this.allRecipeItems, function (recipeItem) { return recipeItem.Id.indexOf(guid) >= 0; });
    };
    ProductDataRepository.prototype.getRecipeItemByName = function (name) {
        // return this.allRecipeItems.where
        return _.filter(this.allRecipeItems, function (recipeItem) { return recipeItem.Name.indexOf(name) >= 0; });
    };
    // bibitemmodel[]
    // TODO the actual syntax is CountryLanguageCustomers.Select(c => c.Country), implying we're looking for CountryLanguageCustomers with the variable Country
    // do we need this check for TypeScript?
    ProductDataRepository.prototype.getBibItemsByCountry = function (country) {
        return _.find(this.allRecipeItems, function (recipeItem) { return recipeItem.CountryLanguageCustomers.Country.indexOf(country) >= 0; });
    };
    // bibitemmodel
    ProductDataRepository.prototype.getAllBibItems = function () {
        return this.allBibItems;
    };
    // TODO is this method not being used? it returns null in the C# app...
    // countrylanguagecustomermodel[]
    ProductDataRepository.prototype.getAllCountryLanguageCustomers = function () {
        return null;
    };
    ProductDataRepository.prototype.loadProductUIItemsNEW = function () {
        var glob = require('glob');
        var filenames = glob.sync(this.fileLocations.designFolder + "pourables/**/*.json");
        var pourables = [];
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
            }
            pourables.push(pourable);
        });
        this.allProductUIItems = pourables;
    };
    // void
    ProductDataRepository.prototype.loadProductUIItems = function () {
        this.allProductUIItems = JSONFILE.sync(this.fileLocations.productUIItemState);
        /*var missingLogos = [];

        var imagefilename = "";

        for (var productItem of this.allProductUIItems) {

            if (productItem.ImageLogo !== null && productItem.ImageLogo !== "") {

                // TODO where is the correct location of the image files?

                // skip it for now

                /*imagefilename = PATH.join(this.appInfo.appRootDir, productItem.ImageLogo);

                if (!fs.existsSync(imagefilename)) {
                    if (!_.find(productItem, imagefilename)) {
                        // TODO - how to handle references between client and server (images exist in client but not server)
                        //console.log("Image file not found at:", imagefilename);
                        missingLogos.push(productItem.ImageLogo);
                    }
                    productItem.ImageLogo = "";
                }*/
        //}
        //}
    };
    // void
    ProductDataRepository.prototype.loadDriveThruVisuals = function () {
        var visualsModel = JSONFILE.sync(this.fileLocations.driveThruButtons);
        // we have the actions before the rest of the objects so convert the actions json to buttonmodels
        for (var _i = 0, _a = visualsModel.actions; _i < _a.length; _i++) {
            var vmodel_action = _a[_i];
            // make new buttonModels
            this.visualsmodel.actions.push(JsUtil_1.JsUtil.mapToNewObject({
                ActionId: vmodel_action.actionId,
                Label: vmodel_action.label,
                PathToImage: vmodel_action.pathToImage,
                PathToBackgroundImage: vmodel_action.pathToBackgroundImage,
                TextColor: vmodel_action.textColor,
                TextSelectedColor: vmodel_action.textSelectedColor,
                BackgroundColor: vmodel_action.backgroundColor,
                ButtonType: vmodel_action.buttonType,
                IsSelected: vmodel_action.isSelected,
                behaviors: vmodel_action.behaviors
            }, new app_types_1.ButtonModel()));
        }
    };
    ProductDataRepository.prototype.loadRecipeItems = function () {
        console.log('loading recipes');
        this.allRecipeItems = [];
        var fs = require('fs');
        var glob = require('glob');
        var files = glob.sync(this.fileLocations.recipeFolder + "**/*.json");
        var _loop_1 = function (file) {
            var recipeRaw = JSONFILE.sync(file);
            var recipe = JsUtil_1.JsUtil.mapToNewObject(recipeRaw, new app_types_1.RecipeItemModel());
            // fix up syrup skus
            var recipeSkus = [];
            _.forEach(recipe.SyrupSkus, function (item) {
                recipeSkus.push(JsUtil_1.JsUtil.mapToNewObject(item, new app_types_1.RecipeSku()));
            });
            recipe.SyrupSkus = recipeSkus;
            // fix up flavor skus
            recipeSkus = [];
            _.forEach(recipe.FlavorSkus, function (item) {
                recipeSkus.push(JsUtil_1.JsUtil.mapToNewObject(item, new app_types_1.RecipeSku()));
            });
            recipe.FlavorSkus = recipeSkus;
            this_1.allRecipeItems.push(recipe);
        };
        var this_1 = this;
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            _loop_1(file);
        }
    };
    ProductDataRepository.prototype.loadRecipeItemsOLD = function () {
        var recipeItemsOwner = JSONFILE.sync(this.fileLocations.recipeItemsFile);
        this.recipeItemsOwner.Version = recipeItemsOwner.Version;
        for (var _i = 0, _a = recipeItemsOwner.Recipes; _i < _a.length; _i++) {
            var recipe = _a[_i];
            var recipeitemmodel = new app_types_1.RecipeItemModel();
            if (recipe.Type === "Water") {
                //let waterProduct = _.find(productUIItems, function(item) { return item.RecipeId == recipe.Id });
                // console.log("Proper water product", waterProduct);
                // get image location from the ProductUIItems
                //recipe.PathToImage = waterProduct.ImageLogo;
            }
            this.recipeItemsOwner.Recipes.push(JsUtil_1.JsUtil.mapToNewObject(recipe, recipeitemmodel));
        }
        this.allRecipeItems = this.recipeItemsOwner.Recipes;
    };
    // void
    ProductDataRepository.prototype.loadBibItems = function () {
        var fs = require('fs');
        var glob = require('glob');
        // get all json files in the consumer ui pourables folder
        var filenames = glob.sync(this.fileLocations.bibItemFolder + "/**/*");
        var bibItems = [];
        _.forEach(filenames, function (file) {
            var bibItemRaw = JSONFILE.sync(file);
            _.forEach(bibItemRaw.bibItems, function (newBibItem) {
                var bibItem = JsUtil_1.JsUtil.mapToNewObject(newBibItem, new app_types_1.BibItemModel());
                bibItems.push(bibItem);
            });
        });
        this.allBibItems = bibItems;
        // TODO figure out if we need to mark high-yield SKUS
    };
    ProductDataRepository.prototype.loadData = function () {
        this.loadBibItems();
        this.loadRecipeItems();
        this.loadDriveThruVisuals();
        this.loadProductUIItemsNEW();
        //this.loadProductUIItems();
    };
    ProductDataRepository.prototype.reset = function () {
        this.loadData();
    };
    ProductDataRepository = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(server_types_1.default.AppInfo)),
        __param(1, inversify_1.inject(server_types_1.default.FileLocations)),
        __metadata("design:paramtypes", [app_info_service_1.AppInfoService,
            server_types_1.FileLocations])
    ], ProductDataRepository);
    return ProductDataRepository;
}());
exports.ProductDataRepository = ProductDataRepository;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpZ3VyYXRpb24vcHJvZHVjdC1kYXRhLXJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFDQSx1Q0FBNkM7QUFDN0MsOENBQTJDO0FBQzNDLGlFQUE0RDtBQUM1RCxnREFBcUQ7QUFDckQseUNBQTJDO0FBQzNDLDBCQUE0QjtBQUU1QixvREFTZ0M7QUFDaEMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRzdCO0lBUUksK0JBQTJDLE9BQXVCLEVBQ2pCLGFBQTRCO1FBRGxDLFlBQU8sR0FBUCxPQUFPLENBQWdCO1FBQ2pCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBUDdFLGlCQUFZLEdBQW1CLElBQUksMEJBQWMsQ0FBQztRQUNsRCxnQkFBVyxHQUFtQixFQUFFLENBQUM7UUFDakMsc0JBQWlCLEdBQXFCLEVBQUUsQ0FBQztRQUN6QyxtQkFBYyxHQUFzQixFQUFFLENBQUM7UUFDdkMscUJBQWdCLEdBQXFCLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLENBQUM7UUFJakUsSUFBSSxDQUFDLFFBQVEsR0FBRyxlQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxxREFBcUIsR0FBckI7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQztJQUN6QyxDQUFDO0lBRUQsZ0RBQWdCLEdBQWhCO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDN0IsQ0FBQztJQUVELG9EQUFvQixHQUFwQjtRQUNJLGlDQUFpQztRQUNqQyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDO0lBQ2xDLENBQUM7SUFFRCxpREFBaUIsR0FBakI7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUMvQixDQUFDO0lBRUQsaURBQWlCLEdBQWpCLFVBQWtCLElBQVk7UUFDMUIsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxVQUFTLFVBQVUsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFFLENBQUM7SUFDMUcsQ0FBQztJQUVELG1EQUFtQixHQUFuQixVQUFvQixJQUFZO1FBQzVCLG1DQUFtQztRQUNuQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLFVBQVMsVUFBVSxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUUsQ0FBQztJQUM5RyxDQUFDO0lBRUQsaUJBQWlCO0lBQ2pCLDJKQUEySjtJQUMzSix3Q0FBd0M7SUFDeEMsb0RBQW9CLEdBQXBCLFVBQXFCLE9BQWU7UUFDaEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxVQUFTLFVBQVUsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLHdCQUF3QixDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFFLENBQUM7SUFDM0ksQ0FBQztJQUVELGVBQWU7SUFDZiw4Q0FBYyxHQUFkO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDNUIsQ0FBQztJQUVELHVFQUF1RTtJQUN2RSxpQ0FBaUM7SUFDakMsOERBQThCLEdBQTlCO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQscURBQXFCLEdBQXJCO1FBQ0ksSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTdCLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLEdBQUcscUJBQXFCLENBQUMsQ0FBQztRQUVyRixJQUFNLFNBQVMsR0FBcUIsRUFBRSxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLFVBQVMsSUFBSTtZQUM5Qix5R0FBeUc7WUFDekcsSUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4QyxJQUFNLFFBQVEsR0FBbUIsZUFBTSxDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUUsSUFBSSwwQkFBYyxFQUFFLENBQUMsQ0FBQztZQUUxRixFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDckIsUUFBUSxDQUFDLE1BQU0sR0FBRyxlQUFNLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxzQkFBVSxFQUFFLENBQUMsQ0FBQztnQkFDOUUsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUM1QixRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxlQUFNLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksd0JBQVksRUFBRSxDQUFDLENBQUM7Z0JBQ2xHLENBQUM7Z0JBQ0QsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUM1QixRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxlQUFNLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksd0JBQVksRUFBRSxDQUFDLENBQUM7Z0JBQ2xHLENBQUM7Z0JBQ0QsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUNuQyxRQUFRLENBQUMsTUFBTSxDQUFDLGFBQWEsR0FBRyxlQUFNLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLElBQUksMkJBQWUsRUFBRSxDQUFDLENBQUM7Z0JBQ25ILENBQUM7WUFDTCxDQUFDO1lBRUQsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM3QixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxpQkFBaUIsR0FBRyxTQUFTLENBQUM7SUFDdkMsQ0FBQztJQUVELE9BQU87SUFDUCxrREFBa0IsR0FBbEI7UUFDSSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFFOUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzttQkFxQlc7UUFFUCxHQUFHO1FBQ1AsR0FBRztJQUNQLENBQUM7SUFFRCxPQUFPO0lBQ1Asb0RBQW9CLEdBQXBCO1FBQ0ksSUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFFdEUsaUdBQWlHO1FBQ2pHLEdBQUcsQ0FBQyxDQUFzQixVQUFvQixFQUFwQixLQUFBLFlBQVksQ0FBQyxPQUFPLEVBQXBCLGNBQW9CLEVBQXBCLElBQW9CO1lBQXpDLElBQUksYUFBYSxTQUFBO1lBQ2xCLHdCQUF3QjtZQUN4QixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQzFCLGVBQU0sQ0FBQyxjQUFjLENBQUM7Z0JBQ2xCLFFBQVEsRUFBRSxhQUFhLENBQUMsUUFBUTtnQkFDaEMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxLQUFLO2dCQUMxQixXQUFXLEVBQUUsYUFBYSxDQUFDLFdBQVc7Z0JBQ3RDLHFCQUFxQixFQUFFLGFBQWEsQ0FBQyxxQkFBcUI7Z0JBQzFELFNBQVMsRUFBRSxhQUFhLENBQUMsU0FBUztnQkFDbEMsaUJBQWlCLEVBQUUsYUFBYSxDQUFDLGlCQUFpQjtnQkFDbEQsZUFBZSxFQUFFLGFBQWEsQ0FBQyxlQUFlO2dCQUM5QyxVQUFVLEVBQUUsYUFBYSxDQUFDLFVBQVU7Z0JBQ3BDLFVBQVUsRUFBRSxhQUFhLENBQUMsVUFBVTtnQkFDcEMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxTQUFTO2FBQ3JDLEVBQUUsSUFBSSx1QkFBVyxFQUFFLENBQUMsQ0FDeEIsQ0FBQztTQUNMO0lBRUwsQ0FBQztJQUVELCtDQUFlLEdBQWY7UUFDSSxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFFL0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7UUFDekIsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pCLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU3QixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQyxDQUFDO2dDQUM1RCxJQUFJO1lBQ1gsSUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QyxJQUFNLE1BQU0sR0FBb0IsZUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsSUFBSSwyQkFBZSxFQUFFLENBQUMsQ0FBQztZQUV4RixvQkFBb0I7WUFDcEIsSUFBSSxVQUFVLEdBQWdCLEVBQUUsQ0FBQztZQUNqQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsVUFBUyxJQUFJO2dCQUNyQyxVQUFVLENBQUMsSUFBSSxDQUFDLGVBQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUkscUJBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNsRSxDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFFO1lBRS9CLHFCQUFxQjtZQUNyQixVQUFVLEdBQUcsRUFBRSxDQUFFO1lBQ2pCLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxVQUFTLElBQUk7Z0JBQ3RDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxxQkFBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUU7WUFFaEMsT0FBSyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JDLENBQUM7O1FBbkJELEdBQUcsQ0FBQyxDQUFlLFVBQUssRUFBTCxlQUFLLEVBQUwsbUJBQUssRUFBTCxJQUFLO1lBQW5CLElBQU0sSUFBSSxjQUFBO29CQUFKLElBQUk7U0FtQmQ7SUFDTCxDQUFDO0lBR0Qsa0RBQWtCLEdBQWxCO1FBQ0ksSUFBTSxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFM0UsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUM7UUFFekQsR0FBRyxDQUFDLENBQWlCLFVBQXdCLEVBQXhCLEtBQUEsZ0JBQWdCLENBQUMsT0FBTyxFQUF4QixjQUF3QixFQUF4QixJQUF3QjtZQUF4QyxJQUFNLE1BQU0sU0FBQTtZQUNiLElBQUksZUFBZSxHQUFHLElBQUksMkJBQWUsRUFBRSxDQUFDO1lBRTVDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFFMUIsa0dBQWtHO2dCQUVuRyxxREFBcUQ7Z0JBQ3BELDZDQUE2QztnQkFFN0MsOENBQThDO1lBRWxELENBQUM7WUFFRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxlQUFNLENBQUMsY0FBYyxDQUFFLE1BQU0sRUFBRSxlQUFlLENBQUUsQ0FBQyxDQUFDO1NBQ3hGO1FBRUQsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDO0lBR3hELENBQUM7SUFFRCxPQUFPO0lBQ1AsNENBQVksR0FBWjtRQUNJLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFN0IseURBQXlEO1FBQ3pELElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLENBQUM7UUFFeEUsSUFBSSxRQUFRLEdBQW1CLEVBQUUsQ0FBQztRQUVsQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxVQUFTLElBQUk7WUFDOUIsSUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUV2QyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsVUFBUyxVQUFVO2dCQUM5QyxJQUFNLE9BQU8sR0FBaUIsZUFBTSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsSUFBSSx3QkFBWSxFQUFFLENBQUMsQ0FBQztnQkFFcEYsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMzQixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUM7UUFFNUIscURBQXFEO0lBQ3pELENBQUM7SUFFRCx3Q0FBUSxHQUFSO1FBQ0ksSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUM3Qiw0QkFBNEI7SUFDaEMsQ0FBQztJQUVELHFDQUFLLEdBQUw7UUFDSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQTlPUSxxQkFBcUI7UUFEakMsc0JBQVUsRUFBRTtRQVNJLFdBQUEsa0JBQU0sQ0FBQyxzQkFBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ3JCLFdBQUEsa0JBQU0sQ0FBQyxzQkFBSyxDQUFDLGFBQWEsQ0FBQyxDQUFBO3lDQURZLGlDQUFjO1lBQ0YsNEJBQWE7T0FUcEUscUJBQXFCLENBK09qQztJQUFELDRCQUFDO0NBL09ELEFBK09DLElBQUE7QUEvT1ksc0RBQXFCIiwiZmlsZSI6ImNvbmZpZ3VyYXRpb24vcHJvZHVjdC1kYXRhLXJlcG9zaXRvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7aW5qZWN0LCBpbmplY3RhYmxlfSBmcm9tIFwiaW52ZXJzaWZ5XCI7XG5pbXBvcnQge0pzVXRpbH0gZnJvbSBcIi4uL3VuaXZlcnNhbC9Kc1V0aWxcIjtcbmltcG9ydCB7QXBwSW5mb1NlcnZpY2V9IGZyb20gXCIuLi9zZXJ2aWNlcy9hcHAtaW5mby5zZXJ2aWNlXCI7XG5pbXBvcnQgVFlQRVMsIHtGaWxlTG9jYXRpb25zfSBmcm9tIFwiLi4vc2VydmVyLnR5cGVzXCI7XG5pbXBvcnQgKiBhcyBKU09ORklMRSBmcm9tIFwibG9hZC1qc29uLWZpbGVcIjtcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCB7XG4gICAgQmliSXRlbU1vZGVsLFxuICAgIEJ1dHRvbk1vZGVsLFxuICAgIENvdW50cnlMYW5ndWFnZUN1c3RvbWVyTW9kZWwsIERlc2lnbkFzc2V0cywgRGVzaWduQ29sb3JzLCBEZXNpZ25Ob2RlLCBEZXNpZ25QYXJ0aWNsZXMsXG4gICAgRmxhdm9yLCBQb3VyYWJsZURlc2lnbixcbiAgICBQcm9kdWN0VUlJdGVtTW9kZWwsXG4gICAgUmVjaXBlSXRlbU1vZGVsLFxuICAgIFJlY2lwZUl0ZW1zT3duZXIsIFJlY2lwZVNrdSxcbiAgICBVSVZpc3VhbHNNb2RlbFxufSBmcm9tIFwiLi4vdW5pdmVyc2FsL2FwcC50eXBlc1wiO1xuY29uc3QgUEFUSCA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuXG5AaW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUHJvZHVjdERhdGFSZXBvc2l0b3J5IHtcbiAgICBvYmplY3RJZDogbnVtYmVyO1xuICAgIHZpc3VhbHNtb2RlbDogVUlWaXN1YWxzTW9kZWwgPSBuZXcgVUlWaXN1YWxzTW9kZWw7XG4gICAgYWxsQmliSXRlbXM6IEJpYkl0ZW1Nb2RlbFtdID0gW107XG4gICAgYWxsUHJvZHVjdFVJSXRlbXM6IFBvdXJhYmxlRGVzaWduW10gPSBbXTtcbiAgICBhbGxSZWNpcGVJdGVtczogUmVjaXBlSXRlbU1vZGVsW10gPSBbXTtcbiAgICByZWNpcGVJdGVtc093bmVyOiBSZWNpcGVJdGVtc093bmVyID0geyBWZXJzaW9uOiAnMS4wJywgUmVjaXBlczogW10gfTtcblxuICAgIGNvbnN0cnVjdG9yKEBpbmplY3QoVFlQRVMuQXBwSW5mbykgcHJpdmF0ZSBhcHBJbmZvOiBBcHBJbmZvU2VydmljZSxcbiAgICAgICAgICAgICAgICBAaW5qZWN0KFRZUEVTLkZpbGVMb2NhdGlvbnMpIHByaXZhdGUgZmlsZUxvY2F0aW9uczogRmlsZUxvY2F0aW9ucykge1xuICAgICAgICB0aGlzLm9iamVjdElkID0gSnNVdGlsLmdldE9iamVjdElkKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiY3Rvci5Qcm9kdWN0RGF0YVJlcG9zaXRvcnlcIiwgdGhpcy5vYmplY3RJZCk7XG4gICAgICAgIHRoaXMubG9hZERhdGEoKTtcbiAgICB9XG5cbiAgICBnZXRSZWNpcGVJdGVtc1ZlcnNpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlY2lwZUl0ZW1zT3duZXIuVmVyc2lvbjtcbiAgICB9XG5cbiAgICBnZXREcml2ZVRocnVEYXRhKCk6IFVJVmlzdWFsc01vZGVsIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmlzdWFsc21vZGVsO1xuICAgIH1cblxuICAgIGdldEFsbFByb2R1Y3RVSUl0ZW1zKCk6IFBvdXJhYmxlRGVzaWduW10ge1xuICAgICAgICAvLyByZXR1cm4gcHJvZHVjdHVpaXRlbW1vZGVsIGxpc3RcbiAgICAgICAgcmV0dXJuIHRoaXMuYWxsUHJvZHVjdFVJSXRlbXM7XG4gICAgfVxuXG4gICAgZ2V0QWxsUmVjaXBlSXRlbXMoKTogUmVjaXBlSXRlbU1vZGVsW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5hbGxSZWNpcGVJdGVtcztcbiAgICB9XG5cbiAgICBnZXRSZWNpcGVJdGVtQnlJZChndWlkOiBzdHJpbmcpOiBSZWNpcGVJdGVtTW9kZWwge1xuICAgICAgICByZXR1cm4gXy5maW5kKHRoaXMuYWxsUmVjaXBlSXRlbXMsIGZ1bmN0aW9uKHJlY2lwZUl0ZW0pIHsgcmV0dXJuIHJlY2lwZUl0ZW0uSWQuaW5kZXhPZihndWlkKSA+PSAwIH0gKTtcbiAgICB9XG5cbiAgICBnZXRSZWNpcGVJdGVtQnlOYW1lKG5hbWU6IHN0cmluZyk6IFJlY2lwZUl0ZW1Nb2RlbFtdIHtcbiAgICAgICAgLy8gcmV0dXJuIHRoaXMuYWxsUmVjaXBlSXRlbXMud2hlcmVcbiAgICAgICAgcmV0dXJuIF8uZmlsdGVyKHRoaXMuYWxsUmVjaXBlSXRlbXMsIGZ1bmN0aW9uKHJlY2lwZUl0ZW0pIHsgcmV0dXJuIHJlY2lwZUl0ZW0uTmFtZS5pbmRleE9mKG5hbWUpID49IDAgfSApO1xuICAgIH1cblxuICAgIC8vIGJpYml0ZW1tb2RlbFtdXG4gICAgLy8gVE9ETyB0aGUgYWN0dWFsIHN5bnRheCBpcyBDb3VudHJ5TGFuZ3VhZ2VDdXN0b21lcnMuU2VsZWN0KGMgPT4gYy5Db3VudHJ5KSwgaW1wbHlpbmcgd2UncmUgbG9va2luZyBmb3IgQ291bnRyeUxhbmd1YWdlQ3VzdG9tZXJzIHdpdGggdGhlIHZhcmlhYmxlIENvdW50cnlcbiAgICAvLyBkbyB3ZSBuZWVkIHRoaXMgY2hlY2sgZm9yIFR5cGVTY3JpcHQ/XG4gICAgZ2V0QmliSXRlbXNCeUNvdW50cnkoY291bnRyeTogc3RyaW5nKTogQmliSXRlbU1vZGVsW10ge1xuICAgICAgICByZXR1cm4gXy5maW5kKHRoaXMuYWxsUmVjaXBlSXRlbXMsIGZ1bmN0aW9uKHJlY2lwZUl0ZW0pIHsgcmV0dXJuIHJlY2lwZUl0ZW0uQ291bnRyeUxhbmd1YWdlQ3VzdG9tZXJzLkNvdW50cnkuaW5kZXhPZihjb3VudHJ5KSA+PSAwIH0gKTtcbiAgICB9XG5cbiAgICAvLyBiaWJpdGVtbW9kZWxcbiAgICBnZXRBbGxCaWJJdGVtcygpOiBCaWJJdGVtTW9kZWxbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFsbEJpYkl0ZW1zO1xuICAgIH1cblxuICAgIC8vIFRPRE8gaXMgdGhpcyBtZXRob2Qgbm90IGJlaW5nIHVzZWQ/IGl0IHJldHVybnMgbnVsbCBpbiB0aGUgQyMgYXBwLi4uXG4gICAgLy8gY291bnRyeWxhbmd1YWdlY3VzdG9tZXJtb2RlbFtdXG4gICAgZ2V0QWxsQ291bnRyeUxhbmd1YWdlQ3VzdG9tZXJzKCk6IENvdW50cnlMYW5ndWFnZUN1c3RvbWVyTW9kZWxbXSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxvYWRQcm9kdWN0VUlJdGVtc05FVygpIHtcbiAgICAgICAgY29uc3QgZ2xvYiA9IHJlcXVpcmUoJ2dsb2InKTtcblxuICAgICAgICBjb25zdCBmaWxlbmFtZXMgPSBnbG9iLnN5bmModGhpcy5maWxlTG9jYXRpb25zLmRlc2lnbkZvbGRlciArIFwicG91cmFibGVzLyoqLyouanNvblwiKTtcblxuICAgICAgICBjb25zdCBwb3VyYWJsZXM6IFBvdXJhYmxlRGVzaWduW10gPSBbXTtcbiAgICAgICAgXy5mb3JFYWNoKGZpbGVuYW1lcywgZnVuY3Rpb24oZmlsZSkge1xuICAgICAgICAgICAgLy8gcmVhZCB0aGUgZmlsZSBvZmYgdGhlIGRpc2ssIGVhY2ggb2JqZWN0L3N1Ym9iamVjdCBtYXkgb3IgbWF5IG5vdCBoYXZlIGFsbCB0aGUgcHJvcGVydGllcyBvbiB0aGUgb2JqZWN0XG4gICAgICAgICAgICBjb25zdCBwb3VyYWJsZVJhdyA9IEpTT05GSUxFLnN5bmMoZmlsZSk7XG4gICAgICAgICAgICBjb25zdCBwb3VyYWJsZTogUG91cmFibGVEZXNpZ24gPSBKc1V0aWwubWFwVG9OZXdPYmplY3QocG91cmFibGVSYXcsIG5ldyBQb3VyYWJsZURlc2lnbigpKTtcblxuICAgICAgICAgICAgaWYgKHBvdXJhYmxlUmF3LmRlc2lnbikge1xuICAgICAgICAgICAgICAgIHBvdXJhYmxlLmRlc2lnbiA9IEpzVXRpbC5tYXBUb05ld09iamVjdChwb3VyYWJsZVJhdy5kZXNpZ24sIG5ldyBEZXNpZ25Ob2RlKCkpO1xuICAgICAgICAgICAgICAgIGlmIChwb3VyYWJsZVJhdy5kZXNpZ24uYXNzZXRzKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvdXJhYmxlLmRlc2lnbi5hc3NldHMgPSBKc1V0aWwubWFwVG9OZXdPYmplY3QocG91cmFibGVSYXcuZGVzaWduLmFzc2V0cywgbmV3IERlc2lnbkFzc2V0cygpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBvdXJhYmxlUmF3LmRlc2lnbi5jb2xvcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgcG91cmFibGUuZGVzaWduLmNvbG9ycyA9IEpzVXRpbC5tYXBUb05ld09iamVjdChwb3VyYWJsZVJhdy5kZXNpZ24uY29sb3JzLCBuZXcgRGVzaWduQ29sb3JzKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocG91cmFibGVSYXcuZGVzaWduLnBhcnRpY2xlc0hvbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcG91cmFibGUuZGVzaWduLnBhcnRpY2xlc0hvbWUgPSBKc1V0aWwubWFwVG9OZXdPYmplY3QocG91cmFibGVSYXcuZGVzaWduLnBhcnRpY2xlc0hvbWUsIG5ldyBEZXNpZ25QYXJ0aWNsZXMoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwb3VyYWJsZXMucHVzaChwb3VyYWJsZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuYWxsUHJvZHVjdFVJSXRlbXMgPSBwb3VyYWJsZXM7XG4gICAgfVxuXG4gICAgLy8gdm9pZFxuICAgIGxvYWRQcm9kdWN0VUlJdGVtcygpIHtcbiAgICAgICAgdGhpcy5hbGxQcm9kdWN0VUlJdGVtcyA9IEpTT05GSUxFLnN5bmModGhpcy5maWxlTG9jYXRpb25zLnByb2R1Y3RVSUl0ZW1TdGF0ZSk7XG5cbiAgICAgICAgLyp2YXIgbWlzc2luZ0xvZ29zID0gW107XG5cbiAgICAgICAgdmFyIGltYWdlZmlsZW5hbWUgPSBcIlwiO1xuXG4gICAgICAgIGZvciAodmFyIHByb2R1Y3RJdGVtIG9mIHRoaXMuYWxsUHJvZHVjdFVJSXRlbXMpIHtcblxuICAgICAgICAgICAgaWYgKHByb2R1Y3RJdGVtLkltYWdlTG9nbyAhPT0gbnVsbCAmJiBwcm9kdWN0SXRlbS5JbWFnZUxvZ28gIT09IFwiXCIpIHtcblxuICAgICAgICAgICAgICAgIC8vIFRPRE8gd2hlcmUgaXMgdGhlIGNvcnJlY3QgbG9jYXRpb24gb2YgdGhlIGltYWdlIGZpbGVzP1xuXG4gICAgICAgICAgICAgICAgLy8gc2tpcCBpdCBmb3Igbm93XG5cbiAgICAgICAgICAgICAgICAvKmltYWdlZmlsZW5hbWUgPSBQQVRILmpvaW4odGhpcy5hcHBJbmZvLmFwcFJvb3REaXIsIHByb2R1Y3RJdGVtLkltYWdlTG9nbyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIWZzLmV4aXN0c1N5bmMoaW1hZ2VmaWxlbmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFfLmZpbmQocHJvZHVjdEl0ZW0sIGltYWdlZmlsZW5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUT0RPIC0gaG93IHRvIGhhbmRsZSByZWZlcmVuY2VzIGJldHdlZW4gY2xpZW50IGFuZCBzZXJ2ZXIgKGltYWdlcyBleGlzdCBpbiBjbGllbnQgYnV0IG5vdCBzZXJ2ZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiSW1hZ2UgZmlsZSBub3QgZm91bmQgYXQ6XCIsIGltYWdlZmlsZW5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWlzc2luZ0xvZ29zLnB1c2gocHJvZHVjdEl0ZW0uSW1hZ2VMb2dvKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwcm9kdWN0SXRlbS5JbWFnZUxvZ28gPSBcIlwiO1xuICAgICAgICAgICAgICAgIH0qL1xuXG4gICAgICAgICAgICAvL31cbiAgICAgICAgLy99XG4gICAgfVxuXG4gICAgLy8gdm9pZFxuICAgIGxvYWREcml2ZVRocnVWaXN1YWxzKCkge1xuICAgICAgICB2YXIgdmlzdWFsc01vZGVsID0gSlNPTkZJTEUuc3luYyh0aGlzLmZpbGVMb2NhdGlvbnMuZHJpdmVUaHJ1QnV0dG9ucyk7XG5cbiAgICAgICAgLy8gd2UgaGF2ZSB0aGUgYWN0aW9ucyBiZWZvcmUgdGhlIHJlc3Qgb2YgdGhlIG9iamVjdHMgc28gY29udmVydCB0aGUgYWN0aW9ucyBqc29uIHRvIGJ1dHRvbm1vZGVsc1xuICAgICAgICBmb3IgKGxldCB2bW9kZWxfYWN0aW9uIG9mIHZpc3VhbHNNb2RlbC5hY3Rpb25zKSB7XG4gICAgICAgICAgICAvLyBtYWtlIG5ldyBidXR0b25Nb2RlbHNcbiAgICAgICAgICAgIHRoaXMudmlzdWFsc21vZGVsLmFjdGlvbnMucHVzaChcbiAgICAgICAgICAgICAgICBKc1V0aWwubWFwVG9OZXdPYmplY3Qoe1xuICAgICAgICAgICAgICAgICAgICBBY3Rpb25JZDogdm1vZGVsX2FjdGlvbi5hY3Rpb25JZCxcbiAgICAgICAgICAgICAgICAgICAgTGFiZWw6IHZtb2RlbF9hY3Rpb24ubGFiZWwsXG4gICAgICAgICAgICAgICAgICAgIFBhdGhUb0ltYWdlOiB2bW9kZWxfYWN0aW9uLnBhdGhUb0ltYWdlLFxuICAgICAgICAgICAgICAgICAgICBQYXRoVG9CYWNrZ3JvdW5kSW1hZ2U6IHZtb2RlbF9hY3Rpb24ucGF0aFRvQmFja2dyb3VuZEltYWdlLFxuICAgICAgICAgICAgICAgICAgICBUZXh0Q29sb3I6IHZtb2RlbF9hY3Rpb24udGV4dENvbG9yLFxuICAgICAgICAgICAgICAgICAgICBUZXh0U2VsZWN0ZWRDb2xvcjogdm1vZGVsX2FjdGlvbi50ZXh0U2VsZWN0ZWRDb2xvcixcbiAgICAgICAgICAgICAgICAgICAgQmFja2dyb3VuZENvbG9yOiB2bW9kZWxfYWN0aW9uLmJhY2tncm91bmRDb2xvcixcbiAgICAgICAgICAgICAgICAgICAgQnV0dG9uVHlwZTogdm1vZGVsX2FjdGlvbi5idXR0b25UeXBlLFxuICAgICAgICAgICAgICAgICAgICBJc1NlbGVjdGVkOiB2bW9kZWxfYWN0aW9uLmlzU2VsZWN0ZWQsXG4gICAgICAgICAgICAgICAgICAgIGJlaGF2aW9yczogdm1vZGVsX2FjdGlvbi5iZWhhdmlvcnNcbiAgICAgICAgICAgICAgICB9LCBuZXcgQnV0dG9uTW9kZWwoKSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGxvYWRSZWNpcGVJdGVtcygpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2xvYWRpbmcgcmVjaXBlcycpO1xuXG4gICAgICAgIHRoaXMuYWxsUmVjaXBlSXRlbXMgPSBbXTtcbiAgICAgICAgY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuICAgICAgICBjb25zdCBnbG9iID0gcmVxdWlyZSgnZ2xvYicpO1xuXG4gICAgICAgIGNvbnN0IGZpbGVzID0gZ2xvYi5zeW5jKHRoaXMuZmlsZUxvY2F0aW9ucy5yZWNpcGVGb2xkZXIgKyBcIioqLyouanNvblwiKTtcbiAgICAgICAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgICAgICAgICBjb25zdCByZWNpcGVSYXcgPSBKU09ORklMRS5zeW5jKGZpbGUpO1xuICAgICAgICAgICAgY29uc3QgcmVjaXBlOiBSZWNpcGVJdGVtTW9kZWwgPSBKc1V0aWwubWFwVG9OZXdPYmplY3QocmVjaXBlUmF3LCBuZXcgUmVjaXBlSXRlbU1vZGVsKCkpO1xuXG4gICAgICAgICAgICAvLyBmaXggdXAgc3lydXAgc2t1c1xuICAgICAgICAgICAgbGV0IHJlY2lwZVNrdXM6IFJlY2lwZVNrdVtdID0gW107XG4gICAgICAgICAgICBfLmZvckVhY2gocmVjaXBlLlN5cnVwU2t1cywgZnVuY3Rpb24oaXRlbSl7XG4gICAgICAgICAgICAgICAgcmVjaXBlU2t1cy5wdXNoKEpzVXRpbC5tYXBUb05ld09iamVjdChpdGVtLCBuZXcgUmVjaXBlU2t1KCkpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmVjaXBlLlN5cnVwU2t1cyA9IHJlY2lwZVNrdXMgO1xuXG4gICAgICAgICAgICAvLyBmaXggdXAgZmxhdm9yIHNrdXNcbiAgICAgICAgICAgIHJlY2lwZVNrdXMgPSBbXSA7XG4gICAgICAgICAgICBfLmZvckVhY2gocmVjaXBlLkZsYXZvclNrdXMsIGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICAgICAgICAgIHJlY2lwZVNrdXMucHVzaChKc1V0aWwubWFwVG9OZXdPYmplY3QoaXRlbSwgbmV3IFJlY2lwZVNrdSgpKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlY2lwZS5GbGF2b3JTa3VzID0gcmVjaXBlU2t1cyA7XG5cbiAgICAgICAgICAgIHRoaXMuYWxsUmVjaXBlSXRlbXMucHVzaChyZWNpcGUpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBsb2FkUmVjaXBlSXRlbXNPTEQoKSB7XG4gICAgICAgIGNvbnN0IHJlY2lwZUl0ZW1zT3duZXIgPSBKU09ORklMRS5zeW5jKHRoaXMuZmlsZUxvY2F0aW9ucy5yZWNpcGVJdGVtc0ZpbGUpO1xuXG4gICAgICAgIHRoaXMucmVjaXBlSXRlbXNPd25lci5WZXJzaW9uID0gcmVjaXBlSXRlbXNPd25lci5WZXJzaW9uO1xuXG4gICAgICAgIGZvciAoY29uc3QgcmVjaXBlIG9mIHJlY2lwZUl0ZW1zT3duZXIuUmVjaXBlcykge1xuICAgICAgICAgICAgdmFyIHJlY2lwZWl0ZW1tb2RlbCA9IG5ldyBSZWNpcGVJdGVtTW9kZWwoKTtcblxuICAgICAgICAgICAgaWYgKHJlY2lwZS5UeXBlID09PSBcIldhdGVyXCIpIHtcblxuICAgICAgICAgICAgICAgIC8vbGV0IHdhdGVyUHJvZHVjdCA9IF8uZmluZChwcm9kdWN0VUlJdGVtcywgZnVuY3Rpb24oaXRlbSkgeyByZXR1cm4gaXRlbS5SZWNpcGVJZCA9PSByZWNpcGUuSWQgfSk7XG5cbiAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiUHJvcGVyIHdhdGVyIHByb2R1Y3RcIiwgd2F0ZXJQcm9kdWN0KTtcbiAgICAgICAgICAgICAgICAvLyBnZXQgaW1hZ2UgbG9jYXRpb24gZnJvbSB0aGUgUHJvZHVjdFVJSXRlbXNcblxuICAgICAgICAgICAgICAgIC8vcmVjaXBlLlBhdGhUb0ltYWdlID0gd2F0ZXJQcm9kdWN0LkltYWdlTG9nbztcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnJlY2lwZUl0ZW1zT3duZXIuUmVjaXBlcy5wdXNoKEpzVXRpbC5tYXBUb05ld09iamVjdCggcmVjaXBlLCByZWNpcGVpdGVtbW9kZWwgKSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFsbFJlY2lwZUl0ZW1zID0gdGhpcy5yZWNpcGVJdGVtc093bmVyLlJlY2lwZXM7XG5cblxuICAgIH1cblxuICAgIC8vIHZvaWRcbiAgICBsb2FkQmliSXRlbXMoKSB7XG4gICAgICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcbiAgICAgICAgY29uc3QgZ2xvYiA9IHJlcXVpcmUoJ2dsb2InKTtcblxuICAgICAgICAvLyBnZXQgYWxsIGpzb24gZmlsZXMgaW4gdGhlIGNvbnN1bWVyIHVpIHBvdXJhYmxlcyBmb2xkZXJcbiAgICAgICAgY29uc3QgZmlsZW5hbWVzID0gZ2xvYi5zeW5jKHRoaXMuZmlsZUxvY2F0aW9ucy5iaWJJdGVtRm9sZGVyICsgYC8qKi8qYCk7XG5cbiAgICAgICAgbGV0IGJpYkl0ZW1zOiBCaWJJdGVtTW9kZWxbXSA9IFtdO1xuXG4gICAgICAgIF8uZm9yRWFjaChmaWxlbmFtZXMsIGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGJpYkl0ZW1SYXcgPSBKU09ORklMRS5zeW5jKGZpbGUpO1xuXG4gICAgICAgICAgICBfLmZvckVhY2goYmliSXRlbVJhdy5iaWJJdGVtcywgZnVuY3Rpb24obmV3QmliSXRlbSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGJpYkl0ZW06IEJpYkl0ZW1Nb2RlbCA9IEpzVXRpbC5tYXBUb05ld09iamVjdChuZXdCaWJJdGVtLCBuZXcgQmliSXRlbU1vZGVsKCkpO1xuXG4gICAgICAgICAgICAgICAgYmliSXRlbXMucHVzaChiaWJJdGVtKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmFsbEJpYkl0ZW1zID0gYmliSXRlbXM7XG5cbiAgICAgICAgLy8gVE9ETyBmaWd1cmUgb3V0IGlmIHdlIG5lZWQgdG8gbWFyayBoaWdoLXlpZWxkIFNLVVNcbiAgICB9XG5cbiAgICBsb2FkRGF0YSgpIHtcbiAgICAgICAgdGhpcy5sb2FkQmliSXRlbXMoKTtcbiAgICAgICAgdGhpcy5sb2FkUmVjaXBlSXRlbXMoKTtcbiAgICAgICAgdGhpcy5sb2FkRHJpdmVUaHJ1VmlzdWFscygpO1xuICAgICAgICB0aGlzLmxvYWRQcm9kdWN0VUlJdGVtc05FVygpO1xuICAgICAgICAvL3RoaXMubG9hZFByb2R1Y3RVSUl0ZW1zKCk7XG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMubG9hZERhdGEoKTtcbiAgICB9XG59Il19
