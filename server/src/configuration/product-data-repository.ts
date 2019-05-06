
import {inject, injectable} from "inversify";
import {JsUtil} from "../universal/JsUtil";
import {AppInfoService} from "../services/app-info.service";
import TYPES, {FileLocations} from "../server.types";
import * as JSONFILE from "load-json-file";
import * as _ from 'lodash';
import * as fs from 'fs';
import {
    BibItemModel,
    ButtonModel,
    CountryLanguageCustomerModel, DesignAssets, DesignColors, DesignNode, DesignParticles,
    Flavor, PourableDesign,
    ProductUIItemModel,
    RecipeItemModel,
    RecipeItemsOwner, RecipeSku,
    UIVisualsModel
} from "../universal/app.types";
const PATH = require("path");

@injectable()
export class ProductDataRepository {
    objectId: number;
    visualsmodel: UIVisualsModel = new UIVisualsModel;
    allBibItems: BibItemModel[] = [];
    allProductUIItems: PourableDesign[] = [];
    allRecipeItems: RecipeItemModel[] = [];
    recipeItemsOwner: RecipeItemsOwner = { Version: '1.0', Recipes: [] };

    constructor(@inject(TYPES.AppInfo) private appInfo: AppInfoService,
                @inject(TYPES.FileLocations) private fileLocations: FileLocations) {
        this.objectId = JsUtil.getObjectId();
        console.log("ctor.ProductDataRepository", this.objectId);
        this.loadData();
    }

    getRecipeItemsVersion() {
        return this.recipeItemsOwner.Version;
    }

    getDriveThruData(): UIVisualsModel {
        return this.visualsmodel;
    }

    getAllProductUIItems(): PourableDesign[] {
        // return productuiitemmodel list
        return this.allProductUIItems;
    }

    getAllRecipeItems(): RecipeItemModel[] {
        return this.allRecipeItems;
    }

    getRecipeItemById(guid: string): RecipeItemModel {
        return _.find(this.allRecipeItems, function(recipeItem) { return recipeItem.Id.indexOf(guid) >= 0 } );
    }

    getRecipeItemByName(name: string): RecipeItemModel[] {
        // return this.allRecipeItems.where
        return _.filter(this.allRecipeItems, function(recipeItem) { return recipeItem.Name.indexOf(name) >= 0 } );
    }

    // bibitemmodel[]
    // TODO the actual syntax is CountryLanguageCustomers.Select(c => c.Country), implying we're looking for CountryLanguageCustomers with the variable Country
    // do we need this check for TypeScript?
    getBibItemsByCountry(country: string): BibItemModel[] {
        return _.find(this.allRecipeItems, function(recipeItem) { return recipeItem.CountryLanguageCustomers.Country.indexOf(country) >= 0 } );
    }

    // bibitemmodel
    getAllBibItems(): BibItemModel[] {
        return this.allBibItems;
    }

    // TODO is this method not being used? it returns null in the C# app...
    // countrylanguagecustomermodel[]
    getAllCountryLanguageCustomers(): CountryLanguageCustomerModel[] {
        return null;
    }

    loadProductUIItemsNEW() {
        const glob = require('glob');

        const filenames = glob.sync(this.fileLocations.designFolder + "pourables/**/*.json");

        const pourables: PourableDesign[] = [];
        _.forEach(filenames, function(file) {
            // read the file off the disk, each object/subobject may or may not have all the properties on the object
            const pourableRaw = JSONFILE.sync(file);
            const pourable: PourableDesign = JsUtil.mapToNewObject(pourableRaw, new PourableDesign());

            if (pourableRaw.design) {
                pourable.design = JsUtil.mapToNewObject(pourableRaw.design, new DesignNode());
                if (pourableRaw.design.assets) {
                    pourable.design.assets = JsUtil.mapToNewObject(pourableRaw.design.assets, new DesignAssets());
                }
                if (pourableRaw.design.colors) {
                    pourable.design.colors = JsUtil.mapToNewObject(pourableRaw.design.colors, new DesignColors());
                }
                if (pourableRaw.design.particlesHome) {
                    pourable.design.particlesHome = JsUtil.mapToNewObject(pourableRaw.design.particlesHome, new DesignParticles());
                }
            }

            pourables.push(pourable);
        });

        this.allProductUIItems = pourables;
    }

    // void
    loadProductUIItems() {
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
    }

    // void
    loadDriveThruVisuals() {
        var visualsModel = JSONFILE.sync(this.fileLocations.driveThruButtons);

        // we have the actions before the rest of the objects so convert the actions json to buttonmodels
        for (let vmodel_action of visualsModel.actions) {
            // make new buttonModels
            this.visualsmodel.actions.push(
                JsUtil.mapToNewObject({
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
                }, new ButtonModel())
            );
        }

    }

    loadRecipeItems() {
        console.log('loading recipes');

        this.allRecipeItems = [];
        const fs = require('fs');
        const glob = require('glob');

        const files = glob.sync(this.fileLocations.recipeFolder + "**/*.json");
        for (const file of files) {
            const recipeRaw = JSONFILE.sync(file);
            const recipe: RecipeItemModel = JsUtil.mapToNewObject(recipeRaw, new RecipeItemModel());

            // fix up syrup skus
            let recipeSkus: RecipeSku[] = [];
            _.forEach(recipe.SyrupSkus, function(item){
                recipeSkus.push(JsUtil.mapToNewObject(item, new RecipeSku()));
            });
            recipe.SyrupSkus = recipeSkus ;

            // fix up flavor skus
            recipeSkus = [] ;
            _.forEach(recipe.FlavorSkus, function(item){
                recipeSkus.push(JsUtil.mapToNewObject(item, new RecipeSku()));
            });
            recipe.FlavorSkus = recipeSkus ;

            this.allRecipeItems.push(recipe);
        }
    }


    loadRecipeItemsOLD() {
        const recipeItemsOwner = JSONFILE.sync(this.fileLocations.recipeItemsFile);

        this.recipeItemsOwner.Version = recipeItemsOwner.Version;

        for (const recipe of recipeItemsOwner.Recipes) {
            var recipeitemmodel = new RecipeItemModel();

            if (recipe.Type === "Water") {

                //let waterProduct = _.find(productUIItems, function(item) { return item.RecipeId == recipe.Id });

               // console.log("Proper water product", waterProduct);
                // get image location from the ProductUIItems

                //recipe.PathToImage = waterProduct.ImageLogo;

            }

            this.recipeItemsOwner.Recipes.push(JsUtil.mapToNewObject( recipe, recipeitemmodel ));
        }

        this.allRecipeItems = this.recipeItemsOwner.Recipes;


    }

    // void
    loadBibItems() {
        const fs = require('fs');
        const glob = require('glob');

        // get all json files in the consumer ui pourables folder
        const filenames = glob.sync(this.fileLocations.bibItemFolder + `/**/*`);

        let bibItems: BibItemModel[] = [];

        _.forEach(filenames, function(file) {
            const bibItemRaw = JSONFILE.sync(file);

            _.forEach(bibItemRaw.bibItems, function(newBibItem) {
                const bibItem: BibItemModel = JsUtil.mapToNewObject(newBibItem, new BibItemModel());

                bibItems.push(bibItem);
            });
        });

        this.allBibItems = bibItems;

        // TODO figure out if we need to mark high-yield SKUS
    }

    loadData() {
        this.loadBibItems();
        this.loadRecipeItems();
        this.loadDriveThruVisuals();
        this.loadProductUIItemsNEW();
        //this.loadProductUIItems();
    }

    reset() {
        this.loadData();
    }
}