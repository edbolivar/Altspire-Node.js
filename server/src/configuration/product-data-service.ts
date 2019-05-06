

import {inject, injectable} from "inversify";
import {JsUtil} from "../universal/JsUtil";
import {AppInfoService} from "../services/app-info.service";
import TYPES from "../server.types";
import {ProductDataRepository} from "./product-data-repository";
import {ValveAssignmentRepository} from "./valve-assignment-repository";
import * as _ from 'lodash';
import {
    BibItemModel,
    BibItemType,
    ButtonBehavior,
    ButtonModel,
    ButtonModelList,
    ButtonType,
    CountryLanguageCustomerModel,
    PourableDesign,
    ProductUIItemModel,
    RecipeItemModel,
    RecipeType,
    SkuToValveMapping,
    UIVisualsModel,
    ValveAssignment,
    ValveAssignmentState
} from "../universal/app.types";
import {DeviceInfo} from "../unitstate/device-info";

@injectable()
export class ProductDataService {
    objectId: number;

    valveAssignmentRepository: ValveAssignmentRepository;
    allBibItems: BibItemModel[] = [];
    dctSkuSets: { [ sku: string ] : string[] } = {};

    constructor(@inject(TYPES.AppInfo) private appInfo: AppInfoService,
                @inject(TYPES.ProductDataRepository) private productDataRepository: ProductDataRepository) {
        this.objectId = JsUtil.getObjectId();
        console.log("ctor.ProductDataService", this.objectId);

        this.afterPropertiesSet();
    }

    // return recipeItemModel[]
    getAllRecipes(): RecipeItemModel[] {
        return this.productDataRepository.getAllRecipeItems();
    }

    // return recipeItemModel[]
    getDispensableRecipesForCuratedMixes(valveAssignments: ValveAssignment): RecipeItemModel[] {
        const curatedRecipes = this.getDispensableRecipes(valveAssignments);

        return curatedRecipes;
    }

    getDriveThruData(): UIVisualsModel {
        // we're only getting the action buttons here
        return this.productDataRepository.getDriveThruData();
    }

    // return recipeItemModel
    getDispensableRecipes(valveAssignments: ValveAssignment): RecipeItemModel[] {

        this.getSkuList();

        const dispensibleRecipes: RecipeItemModel[] = [];
        var dctMountedSkus: { [id: string]: ValveAssignmentState } = {};

        var assignedValves = _.filter(valveAssignments.Assignments, function(assignment) {
            return assignment.isAssigned;
        });

        var altNameForFlavors: String[] = [];

        for (const valve of assignedValves) {
            const bibItemModel: BibItemModel = valve.BibItemAsButtonModel.payload;

            if (bibItemModel.Type === BibItemType.flavorshot) {
                altNameForFlavors.push(bibItemModel.AltName);
            }
            // what's a javascript equivalent to a c# dictionary
            if (dctMountedSkus[valve.SKU] === undefined) {
                dctMountedSkus[valve.SKU] = valve;
            } else {
                console.log("SKU is mounted multiple times");
            }
        }

        const recipes = this.productDataRepository.getAllRecipeItems();

        for (const recipe of recipes) {
            var foundAllSkus = false;

            recipe.SkuToValveMappings = [];

            for (let skuItem of recipe.SyrupSkus) {
                if (dctMountedSkus[skuItem.Sku] !== undefined) {
                    foundAllSkus = true;

                    var availableSkuMappings = _.find(recipe.SkuToValveMappings, function(item) {
                        return item.Sku === skuItem.Sku;
                    });

                    if (!availableSkuMappings) {
                        recipe.SkuToValveMappings.push(new SkuToValveMapping(skuItem.Sku, dctMountedSkus[skuItem.Sku]));
                    } else {
                        console.log("");
                    }

                    // for the moment, we're going to ignore the notion that a compatible syrup SKU might be mapped on multiple valves

                    break;
                }
            }

            if (recipe.SyrupSkus.length > 0 && recipe.SkuToValveMappings.length == 0) {
                continue;
            }

            if (recipe.SyrupSkus.length === 0) {
                foundAllSkus = true;
            }

            var waterSkus: string[] = [];

            for (let waterRecipe of recipe.WaterSkus) {
                waterSkus.push(waterRecipe);
            }

            for (let sku of waterSkus) {
                if (dctMountedSkus[sku] === undefined) {
                    foundAllSkus = false;
                    break;
                } else {
                    if (!recipe.SkuToValveMappings[sku]) {
                        recipe.SkuToValveMappings[sku] = new SkuToValveMapping(sku, dctMountedSkus[sku]);
                    }
                }
            }

            if (recipe.FlavorSkus.length > 0) {
                // console.log("Curated Mix: ", recipe.Name);
            }

            for (let sku of recipe.FlavorSkus) {
                var compatibleSkus = this.dctSkuSets[sku.Sku];
                var flavorValveAssignment = null; // ValveAssignmentState

                if (compatibleSkus) {
                    for (let altSku of compatibleSkus) {
                        if (dctMountedSkus[altSku]) {

                            flavorValveAssignment = dctMountedSkus[altSku];

                            var existingSku = _.find(recipe.SkuToValveMappings, function (item) {
                                return item.SKU == altSku;
                            });

                            if (!existingSku) {
                                if (!_.find(recipe.SkuToValveMappings, function (item) {
                                        return item.ValveAssignmentState == flavorValveAssignment
                                    })) {
                                    //console.log("Compatible SKU Found sku:" + sku + " altsku " + altSku);
                                    recipe.SkuToValveMappings.push(new SkuToValveMapping(altSku, flavorValveAssignment));
                                } else {
                                    //console.log("Compatible SKU ALREADY LOADED sku:" + sku + " altsku:" + altSku);
                                }
                            }
                            break;
                        }
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
    }

    // void
    afterPropertiesSet() {
        this.allBibItems = this.productDataRepository.getAllBibItems();

        this.getSkuList();
    }

    // void
    reset() {
        this.productDataRepository.reset();
    }

    // return dictionary
    getSkuList(): { [ sku: string ] : string[] } {

        if (Object.keys(this.dctSkuSets).length > 0) {
            return this.dctSkuSets;
        }

        var recipeItems: RecipeItemModel[] = this.productDataRepository.getAllRecipeItems();

        for (const recipe of _.filter(recipeItems, function(recipeItem) { return recipeItem.Type !== RecipeType.Mix; } )) {

            var skuList = recipe.SyrupSkus;
            for (let sku of skuList) {
                if (!this.dctSkuSets.hasOwnProperty(sku)) {
                    this.dctSkuSets[sku] = skuList;
                }
            }
        }

        var flavorNames: string[] = [];

        var mixSkus = _.filter(this.allBibItems, function(bibitem) { return bibitem.Type === BibItemType.flavorshot } );

        for (let bibItem of mixSkus) {

            if (bibItem.AltName === undefined || bibItem.AltName === "") {
                console.log("BibItem FlavorShot must be configured with an AltName");
                continue;
            }

            flavorNames.push( bibItem.AltName);

            if (!this.dctSkuSets.hasOwnProperty(bibItem.AltName)) {
                this.dctSkuSets[bibItem.AltName] = [];
            }

            var skuList = this.dctSkuSets[bibItem.AltName];

            if (_.find(skuList, function(sku) { return sku === bibItem.SKU } ) === undefined) {
                skuList.push(bibItem.SKU);
            }

        }

        for (let flavor of flavorNames) {
            var list = this.dctSkuSets[flavor];
            for (let sku of list) {
                this.dctSkuSets[sku] = list;
            }
        }

        return this.dctSkuSets;
    }

    // return string
    getRecipeVersion() {
        return this.productDataRepository.getRecipeItemsVersion();
    }

    // TODO syntax
    // return ButtonModelList
    getBibItems(): ButtonModelList {

        var buttons: ButtonModelList = new ButtonModelList();

        for (let bibItem of this.allBibItems) {

            var buttonModel: ButtonModel = new ButtonModel();
            buttonModel.Id = bibItem.SKU;
            buttonModel.Label = bibItem.Name;
            buttonModel.ActionId = "BibItem";
            buttonModel.payload = bibItem;
            buttonModel.behaviors = [ButtonBehavior.tap, ButtonBehavior.checkable, ButtonBehavior.longpress, ButtonBehavior.status];
            buttonModel.ButtonType = ButtonType.valveAssignment;
            buttonModel.FooterText = bibItem.SKU; // TODO not footertext?

            buttons.AllTypes.push(buttonModel);

            this.getVisualForBibItem(buttonModel, bibItem);

            switch (bibItem.Type) {
                case BibItemType.carbwater:
                case BibItemType.stillwater:
                    buttons.WaterType.push(buttonModel);
                    break;

                case BibItemType.flavorshot:
                    buttons.FlavorType.push(buttonModel);
                    break;

                case BibItemType.syrup:
                    buttons.SyrupType.push(buttonModel);
                    break;
            }
        }
        return buttons;
    }

    // return bibItemModel[]
    getAllBibItems(): BibItemModel[] {
        return this.allBibItems;
    }

    // TODO ServiceUI function
    // return ButtonModel
    getUnassignedButtonForValveAssignment(bibItemType: BibItemType): ButtonModel {
        var bibItemModel = new BibItemModel();
        bibItemModel.Type = bibItemType;

        var unassignButton = new ButtonModel();
        // Localization service
        //unassignButton.Label =
        unassignButton.ResourceId = "not_in_use_id";
        unassignButton.ActionId = "unassign";
        //unassignButton.buttonBehavior
        // TODO is buttonBehavior being copied over?
        unassignButton.payload = bibItemModel;
        unassignButton.ButtonType = ButtonType.valveAssignment;
        unassignButton.Weighting = -1;

        return unassignButton;
    }

    // TODO ServiceUI function
    // void
    addUnassignedButtonsForUIToClearAssignment(allButtons: ButtonModelList) {
        var unassignButton = this.getUnassignedButtonForValveAssignment(BibItemType.carbwater);

        allButtons.WaterType.push(unassignButton);

        unassignButton = this.getUnassignedButtonForValveAssignment(BibItemType.syrup);
        allButtons.SyrupType.push(unassignButton);

        unassignButton = this.getUnassignedButtonForValveAssignment(BibItemType.flavorshot);
        allButtons.FlavorType.push(unassignButton);
    }

    // TODO ServiceUi function
    // productUiItemModel
    getVisualForRecipe(recipe: RecipeItemModel): PourableDesign {
        var potentiallyAvailable = _.filter(this.productDataRepository.getAllProductUIItems(), function(item) {
            return item.recipeId == recipe.Id;
        });

        if (potentiallyAvailable.length == 0) {
            console.log("No visual for recipe");
        }

        var selectedVisual = potentiallyAvailable[0];

        // TODO - need to consider country / language / customer
        return selectedVisual;
    }

    // TODO ServiceUI function
    // void
    getVisualForBibItem(buttonmodel: ButtonModel, bibitem: BibItemModel) {
        var allRecipeItems = this.productDataRepository.getAllRecipeItems();
        var allProductUIItems = this.productDataRepository.getAllProductUIItems();

        var recipeItem = new RecipeItemModel;
        var recipeItems = new Array<RecipeItemModel>();

        switch (bibitem.Type) {
            case BibItemType.carbwater:
            case BibItemType.stillwater:

                recipeItems = _.filter(allRecipeItems, function(recipeItem) { return recipeItem.WaterSkus != null && recipeItem.WaterSkus.indexOf(bibitem.SKU) >= 0 && recipeItem.Type == RecipeType.Water } );

                if (recipeItems.length > 1) {
                    var recipeItemsByName = _.filter(recipeItems, function(recipeItem) { return recipeItem.Name.indexOf(bibitem.Name) >= 0 } );

                    if (recipeItemsByName.length == 1) {
                        recipeItem = recipeItemsByName[0];
                    } else {
                        //console.log("could not resolve recipeItem for BibItem");
                    }
                } else {
                    if (recipeItems.length == 1) {
                        recipeItem = recipeItems[0];
                    } else {
                        //console.log("could not resolve recipeItem for BibItem");
                    }
                }

                // get the image for the water in productUiItems
                let recipePUiItem = _.find(allProductUIItems, function (pItem) { return pItem.recipeId === recipeItem.Id } );

                if (recipePUiItem && recipePUiItem.design.assets.logoHome != '' && recipePUiItem.design.assets.logoHome != null) {
                    buttonmodel.PathToImage = recipePUiItem.design.assets.logoHome;
                }

                break;
            case BibItemType.flavorshot:

                recipeItems = _.filter(allRecipeItems, function(recipeItem) { return recipeItem.FlavorSkus != null && recipeItem.FlavorSkus.indexOf(bibitem.SKU) >= 0 && recipeItem.Type == RecipeType.Mix } );

                if (recipeItems.length > 1) {
                    var pUiItem = _.find(allProductUIItems, function(pItem) { return pItem.id === bibitem.Name } );

                    if (pUiItem != null) {

                        //console.log("PUITEM: ", pUiItem);

                        //buttonmodel.BackgroundColor = pUiItem.ColorBackground;
                        buttonmodel.PathToImage = pUiItem.design.assets.logoHome;

                        //console.log("New Button Model:", buttonmodel);
                        return;
                    } else {
                        //console.log("could not resolve recipeItem for BibItem");
                        return;
                    }
                } else {
                    if (recipeItems.length == 1) {
                        recipeItem = recipeItems[0];
                    } else {

                        // FirstOrDefault
                        var pUiItem = _.find(allProductUIItems, function(pItem) { return pItem.id === bibitem.Name } );
                        if (pUiItem != null) {
                            //buttonmodel.BackgroundColor = pUiItem.ColorBackground;
                            buttonmodel.PathToImage = pUiItem.design.assets.logoHome;
                            return;
                        } else {
                            //console.log("could not resolve recipeItem for BibItem");
                            return;
                        }
                    }
                }

                break;
            case BibItemType.syrup:

                recipeItems = _.filter(allRecipeItems, function(recipeItem) { return recipeItem.SyrupSkus != null && recipeItem.SyrupSkus.indexOf(bibitem.SKU) >= 0 && recipeItem.Type === RecipeType.Beverage } );

                if (recipeItems.length > 1) {

                    recipeItemsByName = _.filter(recipeItems, function(recipeItem) { return recipeItem.Name.indexOf(bibitem.Name) >= 0 } );

                    if (recipeItemsByName.length == 1) {
                        recipeItem = recipeItemsByName[0];
                    } else {
                        //console.log("could not resolve recipeItem for BibItem");
                    }
                } else {
                    if (recipeItems.length == 1) {
                        recipeItem = recipeItems[0];
                    } else {
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
                } else {
                    country = bibitem.CountryLanguageCustomers[0].Country;
                }

                // TODO need a way to call isSameCountry from this function
                var productUIItem = _.find(allProductUIItems, function (recipeItem) {
                    return recipeItem.CountryLanguageCustomer != null && recipeItem.recipeId && recipeItem.recipeId.indexOf(recipeId) >= 0
                });

                if (productUIItem != null) {
                    //buttonmodel.BackgroundColor = productUIItem.ColorBackground;
                    buttonmodel.PathToImage = productUIItem.design.assets.logoHome;
                } else {
                    //console.log("productUIItem is null for BibItem");
                }
            }
        } else {
            //console.log("recipeItem is null for BibItem");
        }
    }

    // return boolean
    isSameCountry(countryList: CountryLanguageCustomerModel[], country: string): boolean {
        for (const clc of countryList) {
            if (clc.Country === country) {
                return true;
            }
        }
        return false;
    }

    // return ButtonModel
    toButtonModel(recipeItem: RecipeItemModel): ButtonModel {
        const toReturn = new ButtonModel;

        toReturn.ButtonType = ButtonType.statebutton;
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
    }

    // return RecipeItemModel
    getRecipe(recipeId: string): RecipeItemModel {
        var recipe = _.find(this.productDataRepository.getAllRecipeItems(), function(item) {
            return item.Id == recipeId;
        });

        return recipe;
    }
}