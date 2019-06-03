import {
    ButtonModel,
    UnitConfigurationModel,
    DeviceDescriptor,
    ServiceUIPopupButtonsModel,
    ServiceUIModel,
    UICustomizationsModel,
    ValveAssignment,
    ValveAssignmentState,
    BibItemModel,
    ValveLabelPair,
    RecipeItemModel,
    ButtonModelList,
    RecipeType,
    ButtonType,
    BibItemType,
    SkuToValveMapping,
    InventoryMapping,
    Role,
    PourItem,
    UIVisualsModel,
    PourItemModel,
    PourableDesign,
    FlavorDesign, Flavor, UnitTypes, CalorieCountState, CalorieCup, SetCuratedMixItem, PlatformModel
} from '../universal/app.types';
import {Observable} from "rxjs/Observable";
import {AppProductdataService} from "../services/app-productdata.service";
import {AppInfoService} from "../services/app-info.service";
import {inject, injectable} from "inversify";
import {JsUtil} from "../universal/JsUtil";
import {DeviceInfo} from "../unitstate/device-info";
import {ProductDataService} from "./product-data-service";
import {ConfigurationRepository} from "./configuration-repository";
import * as JSONFILE from "load-json-file";
import * as _ from 'lodash';
import {ValveAssignmentRepository} from "./valve-assignment-repository";
import TYPES from "../server.types";
import SHORTID = require("shortid");
import { UnitState } from '../unitstate/unit-state';

const PATH = require("path");

@injectable()
export class ConfigurationService {
    objectId: number;

    serviceUI: ServiceUIModel;
    serviceUIPopupButtons: ServiceUIPopupButtonsModel;
    uiCustomizations: UICustomizationsModel;
    mixes: ButtonModel[];
    actionPermissions: string[];
    unitType: UnitTypes;
    pourItems: PourItemModel = new PourItemModel();
    valveAssignments: ValveAssignment = new ValveAssignment();
    // TODO the key is a KeyValuePair with valveRow and valve.valveNumber as the values
    valveAssignmentButtonModels: { [valverow: number]: ButtonModel };
    dctPourButtonModelsByPourId: {[id: string]: ButtonModel} = {};

    // UnitType: UnitTypes;

    constructor(@inject(TYPES.AppInfo) private appInfo: AppInfoService,
                @inject(TYPES.ValveAssignmentRepository) private valveAssignmentRepository: ValveAssignmentRepository,
                @inject(TYPES.ConfigurationRepository) private configurationRepository: ConfigurationRepository,
                @inject(TYPES.ProductDataService) private productDataService: ProductDataService) {
        this.objectId = JsUtil.getObjectId();
        console.log("ctor.ConfigurationService", this.objectId);
        this.loadData();
    }

    getPocVisuals() {
        // temporary anyway, ok to not put in configurationRepository
        const fileName = PATH.join(this.appInfo.configDir_App, "pocvisuals.json");
        return JSONFILE.sync(fileName);
    }

    public afterPropertiesSet() {
        this.loadData();

        this.actionPermissions = this.configurationRepository.getPermissions(4);
    }

    public reset() {
        this.productDataService.reset();
        // this.localizationService.reset();

        this.loadData();
    }

    public resetActionPermissions() {
        this.actionPermissions = this.configurationRepository.getPermissions(4);
    }

    // TODO add registrations?
    private loadData() {
        this.loadValveAssignments();
    }

    public getAvailableButtons(allButtons: ButtonModel[]): ButtonModel[] {
        const availableButtons: ButtonModel[] = [];

        for (const item of allButtons) {
            if (this.isSupportedOnUnitType(item)) {
                availableButtons.push(item);
            }
        }

        return availableButtons;
    }

    private isSupportedOnUnitType(button: ButtonModel): boolean {
        // TODO no idea how to solve this issue
        // this.unitType is one value, it needs to look into the MANY coming in on the button
        // the following is wrong at this point
        return this.unitType === button.UnitTypes ;
    }

    public getAvailableCuratedMixes(): ButtonModel[] {
        const recipesAsButtonModel: ButtonModel[] = [];
        const recipes = this.productDataService.getDispensableRecipesForCuratedMixes(this.valveAssignments);

        for (const recipe of recipes) {
            const buttonModel = this.convertRecipeToButtonModel(recipe);
            buttonModel.ActionId = "available.curated.mix";
            recipesAsButtonModel.push(buttonModel);
        }

        return recipesAsButtonModel;
    }

    // TODO finish
    public getActionPanelButtons(): ButtonModel[] {
        const buttonlist = this.hasPermissions(this.getAvailableButtons(this.serviceUI.ActionPanel));

        // TODO ApplicationEx.PubSub.GetEvent

        return buttonlist;
    }

    // TODO finish
    public getSystemPanelButtons(): ButtonModel[] {
        const buttonlist = this.hasPermissions(this.getAvailableButtons(this.serviceUI.SystemPanel));

        // TODO ApplicationEx.PubSub.GetEvent

        return buttonlist;
    }

    public getServiceLanguages(): ButtonModel[] {
        for (const button of this.serviceUIPopupButtons.ServiceLanguages) {
            button.IsSelected = (button.Id == DeviceInfo.unitState.CountryLanguageCode);
        }

        return this.serviceUIPopupButtons.ServiceLanguages;
    }

    // TODO this method in the c# code looks incomplete, is this being imported or discarded?
    public getButtonsForConsumerUI(): ButtonModel[] {
        const result: ButtonModel[] = [];

        for (const valve of _.filter(this.valveAssignments.Assignments, function (list) {
            return list.IsAssigned;
        })) {
            const bibItem = valve.BibItemAsButtonModel.payload;

            const buttonModel = JsUtil.mapToNewObject({
                Id: bibItem.Name,
                Label: bibItem.Name,
                RecipeId: "",
                // ButtonBehavior
            }, new ButtonModel());
        }

        return result;
    }

    public getClearSelectionTimeoutButtons(): ButtonModel[] {
        return this.serviceUIPopupButtons.ConfigureSelectionTimeout;
    }

     async getUIData() {
         // were only getting action buttons out of this call
         const uiVisualsModel = this.productDataService.getDriveThruData();

         uiVisualsModel.brands = [];
         uiVisualsModel.waters = [];
         uiVisualsModel.flavors = [];
         uiVisualsModel.curatedMixes = [];

         const recipes = this.productDataService.getDispensableRecipes(this.valveAssignments);

         const curatedMixState: SetCuratedMixItem[] = this.getCuratedMixologyState2();

         const brands: ButtonModel[] = [];

         for (const recipe of recipes) {
             const buttonModel = this.convertRecipeToButtonModel(recipe);

             if (recipe.Type === RecipeType.Beverage) {
                 buttonModel.ButtonType = ButtonType.brand;
                 brands.push(buttonModel);
             } else if (recipe.Type === RecipeType.Water) {
                 buttonModel.ButtonType = ButtonType.water;
                 uiVisualsModel.waters.push(buttonModel);
             } else if (recipe.Type === RecipeType.Mix) {
                 const found = _.find(curatedMixState, function(setCuratedMixItem: SetCuratedMixItem) {
                    return setCuratedMixItem.RecipeId === recipe.Id;
                 });
                 if (!found) {
                     continue ;
                 }

                 buttonModel.ButtonType = ButtonType.mix;
                 if (buttonModel.payload.areAnyValvesLockedInRecipe){
                     buttonModel.IsDisabled = true ;
                 }
                uiVisualsModel.curatedMixes.push(buttonModel);

             } else {
                 console.log("Unknown RecipeType: " + recipe.Name + " " + recipe.Type + " " + recipe.Id);
             }

             uiVisualsModel.brands = _.orderBy(brands, ['weighting'], ['asc']);
             uiVisualsModel.flavors = this.getFlavorsForConsumerUI();
             uiVisualsModel.topCombinations = this.getTopCombinationState(false, uiVisualsModel.flavors);

         }

         return uiVisualsModel;
    }

    public removeAssignedBibItemsFromList(availableBibItems: ButtonModel[], incomingValveButton: ButtonModel) {
        const dctSkuList = this.productDataService.getSkuList();
        const valveAssignmentState: ValveAssignmentState = incomingValveButton.payload;
        const assignedValves = _.filter(this.valveAssignments.Assignments, function (item) {
            return item.isAssigned;
        });

        for (const bibItem of availableBibItems) {
            const bibItemModel: BibItemModel = bibItem.payload;

            if (_.find(assignedValves, function (item) {
                    return item.SKU == bibItemModel.SKU;
                })) {
                if (incomingValveButton.payload.SKU != bibItem.Id) {
                    if (bibItemModel.Type == BibItemType.syrup) {
                        const skuList = dctSkuList[bibItemModel.SKU];

                        for (const sku of skuList) {
                            const item = _.find(availableBibItems, function (item) {
                                return item.payload.SKU == sku;
                            });

                            if (item != null) {
                                _.remove(availableBibItems, function (xitem) {
                                    return xitem.Id == item.Id;
                                });
                            }
                        }

                    } else {
                        _.remove(availableBibItems, function (item) {
                            return item.Id == bibItem.Id;
                        });
                    }
                }
            }
        }
    }

    public hasPermission(actionId: string): boolean {
        if (_.find(this.actionPermissions, function (item) {
                return item.ActionId == actionId;
            })) {
            return true;
        }
        return false;
    }

    public hasPermissions(allButtons: ButtonModel[]): ButtonModel[] {
        const allowedButtons: ButtonModel[] = [];

        for (const item of allButtons) {
            if (_.find(allowedButtons, function (buttonItem) {
                    return buttonItem.Id == item.Id;
                })) {
                allowedButtons.push(item);
            }
        }

        return allowedButtons;
    }

    public getFlavorsForConsumerUI(): ButtonModel[] {

        const valvesWithFlavors = _.filter(this.valveAssignments.Assignments, function(item) {
            if (!item.isAssigned) {
                return false;
            }
            item.BibItemAsButtonModel.payload == JsUtil.mapToNewObject(item.BibItemAsButtonModel.payload, new BibItemModel());
            return item.isAssigned && (item.BibItemAsButtonModel.payload.Type == BibItemType.flavorshot);
        });

        const flavorButtons: ButtonModel[] = [];

        for (const valveAssignment of valvesWithFlavors) {
            let bibItem = new BibItemModel();
            bibItem = valveAssignment.BibItemAsButtonModel.payload;

            const recipe = JsUtil.mapToNewObject({
                Type: RecipeType.Flavor,
                Id: bibItem.Name,
                Name: bibItem.Name,
                BeverageId: bibItem.AltName
            }, new RecipeItemModel());

            const newSkuMapping = new SkuToValveMapping(valveAssignment.SKU, valveAssignment);
            recipe.SkuToValveMappings.push(newSkuMapping);

            const buttonModel = JsUtil.mapToNewObject({
                Id: valveAssignment.BibItemAsButtonModel.Id,
                Label: valveAssignment.BibItemAsButtonModel.Label,
                PathToImage: valveAssignment.BibItemAsButtonModel.PathToImage,
                BackgroundColor: valveAssignment.BibItemAsButtonModel.BackgroundColor,
                payload: recipe,
                ButtonType: ButtonType.flavor,
            }, new ButtonModel());

            if (recipe.areAnyValvesLockedInRecipe()) {
                console.log("A valve is locked. " + recipe.Name + " will not be dispensable");
                buttonModel.IsDisabled = true ;
            }

            flavorButtons.push(buttonModel);
        }

        if (flavorButtons.length === 0) {
            console.log("There are no flavors configured on valves, so no flavors are available to UI");
        }

        return flavorButtons;
    }

    public getBibItemTypes(): ButtonModel[] {
        // TODO deselect each item
        return this.serviceUIPopupButtons.BibItemTypes;
    }

    // TODO implement; this uses GetEvent
    public registerButtonListLocalization(topic: string, obj: object) {
        return;
    }

    private dumpValveAssignments(headerMsg: string) {
        console.log("----- Valve Assignments: ", headerMsg);
    }

    public getTopCombinationState(isForConfiguration: boolean, flavors: ButtonModel[]) {
        const topCombinations: ButtonModel[] = [];
        const topCombinationsRaw: ButtonModel[] = this.configurationRepository.getTopCombinationState();

        const dispensableRecipes = this.productDataService.getDispensableRecipes(this.valveAssignments);

        for (const combination of topCombinationsRaw) {

            combination.ButtonType = ButtonType.topCombination;
            combination.IsSelected = false;

            const recipe = _.find(dispensableRecipes, function(item) {
                return item.Id === combination.Id;
            });


            if (recipe == null && (combination.Label === "" || combination.Label === undefined) && !isForConfiguration) {
                console.log("Combination button is NOT configured: " + combination.Id + " Removing Combination Button");

                // will not add to target array
                continue ;
            } else {
                combination.payload = recipe;
                topCombinations.push(combination);
            }

            if (recipe != null && recipe.areAnyValvesLockedInRecipe()) {
                console.log("A valve is locked. " + recipe.Name + " will not be dispensable.");
                combination.IsDisabled = true;
            }

            for (const flavor of combination.ButtonModelList) {
                const availableFlavorOnValves = _.find(flavors, function (item) {
                    return item.Id == flavor.Id;
                });

                if (availableFlavorOnValves != null) {
                    flavor.payload = availableFlavorOnValves.payload;
                    const flavorrecipe: RecipeItemModel = flavor.payload;
                    if (flavorrecipe.areAnyValvesLockedInRecipe()) {
                        console.log("A valve is locked. " + flavorrecipe.Name + " will not be dispensable.");
                        combination.IsDisabled = true;
                    }
                } else {
                    combination.IsDisabled;
                }
            }

            if (combination.IsDisabled) {
                const disabledButtonModels: ButtonModel[] = [];

                for (const button of combination.ButtonModelList) {
                    button.IsDisabled = true;
                    disabledButtonModels.push(button);
                }

                combination.ButtonModelList = disabledButtonModels;
            }
        }


        return topCombinations;
    }

    public writeTopCombinationState(combinations: ButtonModel[]) {
        console.log("---- Writing TopCombination State ----");

        this.configurationRepository.writeTopCombinationState(combinations);
    }

    public resetTopCombinations() {
        this.configurationRepository.resetTopCombinationState();
    }

    public getCuratedMixologyState(): ButtonModel[] {
        this.mixes = this.configurationRepository.getMixologyState();

        for (const buttonModel of this.mixes) {
            buttonModel.payload = this.productDataService.getRecipe(buttonModel.Id);
        }

        return this.mixes;
    }

    public getCuratedMixologyState2(): SetCuratedMixItem[] {
        const setCuratedItemRaw = this.configurationRepository.getMixologyState2();
        const result: SetCuratedMixItem[] = [];
        const self = this;

        _.forEach(setCuratedItemRaw, function(item){
            result.push(JsUtil.mapToNewObject(item, new SetCuratedMixItem()));
        });


        return result;
    }

    public writeMixologyState(mixes: ButtonModel[]) {
        this.mixes = mixes;
        this.configurationRepository.writeMixologyState(mixes);
    }

    public resetMixology() {
        this.configurationRepository.resetMixologyState();
    }

    public loadValveAssignments() {
        // BibItem  - SKU; a syrup in a bag that's in a box; gets attached to a valve
        const bibitems: ButtonModelList = this.productDataService.getBibItems();

        // get current valve Assignments here
        const valveAssignmentsRaw = this.valveAssignmentRepository.getCurrentValveAssignments();

        // TEST
        this.valveAssignments = JsUtil.mapToNewObject(valveAssignmentsRaw, new ValveAssignment());

        const assignmentStates: ValveAssignmentState[] = this.valveAssignments.Assignments;
        this.valveAssignments.Assignments = [];
        for (const assignment of assignmentStates) {
            this.valveAssignments.Assignments.push(JsUtil.mapToNewObject(assignment, new ValveAssignmentState()));
        }

        const assignedValves = _.filter(this.valveAssignments.Assignments, function (item: ValveAssignmentState) {
            return item.SKU && item.SKU !== '';
        });

        for (const valveAssignment of assignedValves) {
            valveAssignment.BibItemAsButtonModel = _.find(bibitems.AllTypes, function (item: ButtonModel) {
                return item.Id === valveAssignment.SKU;
            });

            if (valveAssignment.BibItemAsButtonModel === null) {
                console.log("=====BibItem not found for valve Assignment {0}, SKU: {1}", valveAssignment.ValveId, valveAssignment.SKU);
            }
        }

        // does DeviceInfo.State.UnitType refer to the default UnitType? or something different?
        const unitconfig: UnitConfigurationModel = this.valveAssignmentRepository.getConfigurationById("DriveThru");

        for (const valveAssignment of this.valveAssignments.Assignments) {

            // TODO get AllValveLabelPairs
            valveAssignment.ValveLabelPair = _.find(unitconfig.AllValveLabelPairs, function (item: ValveLabelPair) {
                return item.valveLabel === valveAssignment.ValveId;
            });

            if (valveAssignment.ValveLabelPair === null) {
                console.log("valve not found for ValveAssignment, valve:", valveAssignment.ValveId);
            }
        }
    }

    public getCurrentValveAssignmentsAsButtonModels(): ButtonModel[] {
        const waterIds: string[] = ['0111', '0222', '0333', '0444'];
        const currentValveAssignmentsAsButtonModels: ButtonModel[] = [];

        const configForThisUnit = this.valveAssignmentRepository.getConfigurationById(DeviceInfo.unitState.UnitType);

        for (const valveAssignmentRow of configForThisUnit.ValveLayout) {
            for (const valve of valveAssignmentRow.ValveLabelPair) {
                let buttonModel = _.find(this.valveAssignmentButtonModels, function (item) {
                    return item.key == valve.Row;
                });

                if (buttonModel == null) {
                    buttonModel = new ButtonModel();
                    this.valveAssignmentButtonModels[valve.Row] = buttonModel;
                }

                //buttonModel.ButtonType = ButtonType.ValveButton
                //buttonModel.ButtonBehavior
                buttonModel.ActionId = "popup.valve.assignment";
                //buttonModel.FooterText = valve.GetLabel
                buttonModel.Weighting = valve.Weighting;
                buttonModel.BackgroundColor = "White";
                buttonModel.RowNumber = valve.Row;

                let valveAssignmentState = _.find(this.valveAssignments.Assignments, function (item) {
                    return item.ValveId == valve.valveLabel;
                });

                if (valveAssignmentState == null) {
                    valveAssignmentState = new ValveAssignmentState();
                    valveAssignmentState.ValveId = valve.valveLabel;
                    valveAssignmentState.ValveLabelPair = valve;
                    this.valveAssignments.Assignments.push(valveAssignmentState);
                }

                buttonModel.payload = valveAssignmentState;

                if (valveAssignmentState.SKU === "" || valveAssignmentState.SKU === null) {
                    buttonModel.Label = "UnAssigned";
                    buttonModel.ResourceId = "not_in_use_id";
                } else {
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
                    } else {
                        buttonModel.BackgroundColor = valveAssignmentState.BibItemAsButtonModel.PathToImage;
                    }

                    buttonModel.BackgroundColor = valveAssignmentState.BibItemAsButtonModel.BackgroundColor;
                }

                currentValveAssignmentsAsButtonModels.push(buttonModel);
            }
        }

        // TODO implement
        this.verifyValveAssignmentState(configForThisUnit);

        const sortedValveAssignments = _.orderby(currentValveAssignmentsAsButtonModels, ['Weighting'], ['asc']);

        // TODO implement
        //this.registerButtonListLocalization("valveAssignments", sortedValveAssignments);

        return sortedValveAssignments;
    }

    // TODO test
    public verifyCuratedMixState(valveState, newSku: string) {
        if (this.isReassignedValveAnEquivalentSku(valveState, newSku)) {
            return;
        }

        const curatedButtonsToRemove: ButtonModel[] = [];
        const configuratedCuratedButtons = this.getCuratedMixologyState();

        const configuratedCuratedButtonsWithPayload = _.filter(configuratedCuratedButtons, function (item) {
            return item.payload !== null;
        });

        for (const buttonModel of configuratedCuratedButtonsWithPayload) {
            const skuToValveMappingsAggregated: SkuToValveMapping[] = [];

            const recipe = buttonModel.payload;

            skuToValveMappingsAggregated.concat(recipe.SkuToValveMappings);

            for (const skuToValveMapping of skuToValveMappingsAggregated) {
                if (skuToValveMapping.valveAssignmentState == valveState) {
                    if (!_.find(curatedButtonsToRemove, function (item) {
                            return item == buttonModel;
                        })) {
                        curatedButtonsToRemove.push(buttonModel);
                    }
                    break;
                }
            }
        }

        if (curatedButtonsToRemove.length > 0) {
            const buttonModelsFromSeed = this.configurationRepository.getCuratedMixSeed();
            for (const button of curatedButtonsToRemove) {
                const index = configuratedCuratedButtons.indexOf(button);
                configuratedCuratedButtons[index] = buttonModelsFromSeed[index];
            }

            this.writeMixologyState(configuratedCuratedButtons);
        }
    }

    // TODO finish
    public isReassignedValveAnEquivalentSku(valveState: ValveAssignmentState, newSku: string) {
        if (newSku !== null && newSku !== "" && valveState.SKU !== null && valveState.SKU !== "") {
            const skuList: string[] = [];
            // this.productDataService.getSkuList().TryGetValue(valveState.SKU, out skuList);
            if (skuList != null && _.find(skuList, function (item) {
                    return item == newSku;
                })) {
                return true;
            }
        }
        return false;
    }

    private verifyTopCombinationState(valveState: ValveAssignmentState, newSku: string) {

        if (this.isReassignedValveAnEquivalentSku(valveState, newSku)) {
            return;
        }

        const combinationsToRemove: ButtonModel[] = [];
        const combinationButtons = this.getTopCombinationState(true, this.getFlavorsForConsumerUI());

        const combinationButtonsWithPayload = _.filter(combinationButtons, function (item) {
            return item === item.payload !== null;
        });

        for (const buttonModel of combinationButtonsWithPayload) {
            const skuToValveMappingsAggregated: SkuToValveMapping[] = [];

            let recipe = buttonModel.payload;

            skuToValveMappingsAggregated.concat(recipe.SkuToValveMappings);

            for (const flavorButton of buttonModel.ButtonModelList) {
                recipe = flavorButton.payload;
                if (recipe !== null) {
                    skuToValveMappingsAggregated.concat(recipe.SkuToValveMappings);
                } else {
                    // console.log("Valve UnAssignment is incorrect with respect to verifying TopCombination");
                }
            }

            for (const skuToValveMapping of skuToValveMappingsAggregated) {
                if (skuToValveMapping.valveAssignmentState == valveState) {
                    if (!_.find(combinationsToRemove, function (item) {
                            return item == buttonModel;
                        })) {
                        combinationsToRemove.push(buttonModel);
                    }
                    break;
                }
            }
        }

        if (combinationsToRemove.length > 0) {
            const buttonModelsFromSeed = this.configurationRepository.getTopCombinationSeed();

            for (const button of combinationsToRemove) {

                const index = combinationButtons.indexOf(button);
                combinationButtons[index] = buttonModelsFromSeed[index];
            }

            this.writeTopCombinationState(combinationButtons);
        }
    }

    // TODO test
    private verifyValveAssignmentState(unitConfig: UnitConfigurationModel) {
        let anyBad = false;
        for (const valveAssignment of this.valveAssignments.Assignments) {
            const unitValve = _.find(unitConfig.AllValveLabelPairs, function (item) {
                return item.valveLabel == valveAssignment.ValveId;
            });
            if (unitValve == null) {
                anyBad = true;
                // remove valveAssignment
                // TODO test, not sure if this is the correct way to remove in typescript
                const index = this.valveAssignments.Assignments.indexOf(valveAssignment);
                this.valveAssignments.Assignments.splice(index, 1);
                console.log("Fixing up ValveAssignmentState, existing config does not contain this valve: " + valveAssignment.ValveId);
            }
        }
        if (anyBad) {
            //this.valveAssignmentRepository.writeValveAssignments(this.valveAssignments);
        }
    }

    // TODO finish
    public writeValveAssignment(valveToConfigure: ButtonModel, selectedBibItem: ButtonModel) {
        this.dumpValveAssignments("Before");

        if (selectedBibItem == null) {
            console.log("No Selected BibItem, not changing valve assignment.");
            return;
        }

        const valveState = valveToConfigure.payload;

        if (!_.find(this.valveAssignments.Assignments, function (item) {
                return item == valveState;
            })) {
            console.log("Error in ValveConfiguration");
        }

        const newBibItem = selectedBibItem.payload;
        const newSku = newBibItem == null ? "" : newBibItem.SKU;
        const oldSku = valveState.SKU;

        this.verifyTopCombinationState(valveState, newSku);
        this.verifyCuratedMixState(valveState, newSku);
        const inventoryMappingEventInfo = new InventoryMapping();

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

        } else {
            if (oldSku != null && oldSku != "") {
                //inventoryMappingEventInfo.ValveActions
            }

            const sku = selectedBibItem.payload.SKU;
            valveState.assignValve(sku, selectedBibItem);

            valveToConfigure.Label = selectedBibItem.payload.Name;
            valveToConfigure.PathToImage = selectedBibItem.PathToImage;
            valveToConfigure.BackgroundColor = selectedBibItem.BackgroundColor;

            // push inventoryMappingEventInfo
        }

        this.valveAssignmentRepository.writeValveAssignments(this.valveAssignments);
        this.updateEventValveAssignments(inventoryMappingEventInfo);

        // DBUtil.PostEventData
    }

    public saveValveAssignments() {
        this.valveAssignmentRepository.writeValveAssignments(this.valveAssignments);
    }

    private updateEventValveAssignments(inventoryMappingEventInfo: InventoryMapping) {
        for (const valveAssignmentState of _.filter(this.valveAssignments.Assignments, function (item) {
            return item.IsAssigned;
        })) {
            inventoryMappingEventInfo.ValveAssignments.push(JsUtil.mapToNewObject({
                ID: valveAssignmentState.ValveLabelPair.ValveNumber,
                SKU: valveAssignmentState.SKU
            }, new ValveAssignment()));
        }
    }

    public getChangeValveMenuButtons(): ButtonModel[] {
        return this.hasPermissions(this.serviceUIPopupButtons.ChangeValueMenuOptions);
    }

    public getTopCombinationSeed(): ButtonModel[] {
        return this.configurationRepository.getTopCombinationSeed();
    }

    public getPrimingButtons(): ButtonModel[] {
        return this.hasPermissions(this.serviceUIPopupButtons.Priming);
    }

    public getPrimingValveButtons(): ButtonModel[] {
        const primeButtons: ButtonModel[] = this.getCurrentValveAssignmentsAsButtonModels();

        for (const button in primeButtons) {
            // button.ActionId = "";
            //button.ButtonBehavior
        }

        return primeButtons;
    }

    public getValvePrimingButtons(): ButtonModel[] {
        return this.hasPermissions(this.serviceUIPopupButtons.ValvePriming);
    }

    private convertRecipeToButtonModel(recipe: RecipeItemModel): ButtonModel {

        const visual = this.productDataService.getVisualForRecipe(recipe);

        // TODO currently the ButtonModel class is in a separate file in the C# app; should it get changed to
        const buttonModel: ButtonModel = JsUtil.mapToNewObject({
            Id: recipe.Name,
            Label: recipe.Name,
            RecipeId: recipe.Id,
            PathToImage: visual ? (visual.design.assets.logoHome != null ? visual.design.assets.logoHome : visual.design.assets.logoBrand) : "",
            payload: recipe,
        }, new ButtonModel());

        if (recipe.areAnyValvesLockedInRecipe) {
            console.log("A valve is locked. " + recipe.Name + " will not be dispensable.");
        }

        return buttonModel;
    }

    async getServiceUI() {
        // will need to filter by permissions and unittype
        return this.configurationRepository.getServiceUI();
    }

    public getConfirmButtons(): ButtonModel[] {
        return this.serviceUIPopupButtons.ConfirmButtons;
    }

    public getConsumerLanguages(): ButtonModel[] {
        return this.serviceUIPopupButtons.ConsumerLanguages;
    }

    public getRecipePopupButtons(): ButtonModel[] {
        return this.serviceUIPopupButtons.Recipes;
    }

    public getFlowRateButtons(): ButtonModel[] {
        return this.serviceUIPopupButtons.FlowRates;
    }

    public getMachineStatusButtons(): ButtonModel[] {
        return this.serviceUIPopupButtons.MachineStatus;
    }

    public getUnitLocationButtons(): ButtonModel[] {
        return this.serviceUIPopupButtons.UnitLocation;
    }

    public getModemConnectivityButtons(): ButtonModel[] {
        return this.serviceUIPopupButtons.ModemConnectivity;
    }

    public getSystemShutdownButtons(): ButtonModel[] {
        return this.hasPermissions(this.serviceUIPopupButtons.ShutdownOptions);
    }

    public getDisplayOffButtons(): ButtonModel[] {
        return this.hasPermissions(this.serviceUIPopupButtons.DisplayOffOptions);
    }

    public getValveLockButtons(): ButtonModel[] {
        return this.hasPermissions(this.serviceUIPopupButtons.ValveLockOptions);
    }

    public getLegacyValvesState(): ButtonModel[] {
        return this.configurationRepository.getLegacyValvesState();
    }

    public getLegacyValvesSeed(): ButtonModel[] {
        return this.configurationRepository.getLegacyValvesSeed();
    }

    public resetLegacyValves() {
        this.configurationRepository.resetLegacyValvesState();
    }

    public writeLegacyValvesState(legacyValves: ButtonModel[]) {
        this.configurationRepository.writeLegacyValvesState(legacyValves);

        // AppInfo.IoC.GetObject

        // TODO implement LegacyValvesInventoryMapping
        //let mappingEvent = new Legacy
        let valveNumber = 0;
        for (const buttonModel of legacyValves) {
            // TODO add ValveAssignment2
            valveNumber++;
        }
        // DBUtil.PostEventData
    }

    // TODO implement
    public resetValveAssignments() {
        // TODO implement fileLocations
        //let valveAssignmentModel = this.fileLocations.valveAssignmentSeed;
        // serialize to disk
    }

    async getRoleByAuthId(input: string): Promise<Role> {
        const permissionsModel = this.configurationRepository.getUserPermissions();
        const rolePermissions = _.find(permissionsModel.Roles, function (item) {
            return item.AuthId == input;
        });

        if (rolePermissions == null) {
            return Role.None;
        }

        return rolePermissions.Role;
    }

    public getBrixButtons(): ButtonModel[] {
        return this.hasPermissions(this.serviceUIPopupButtons.Brix);
    }

    public getEquipmentStatusButton(): ButtonModel[] {
        const allButtons: ButtonModel[] = this.hasPermissions(this.serviceUIPopupButtons.EquipmentStatus);
        const availableButtons: ButtonModel[] = [];

        for (const item of allButtons) {
            if (this.isSupportedOnUnitType(item)) {
                availableButtons.push(item);
            }
        }
        return availableButtons;
    }

    public getSENDiagnosticsButtons(): ButtonModel[] {
        return this.hasPermissions(this.serviceUIPopupButtons.SENDiagnostics);
    }

    public getSENDiagnosticsEquipmentSerialButton(): ButtonModel[] {
        return this.hasPermissions(this.serviceUIPopupButtons.SENDiagnosticsEquipmentSerial);
    }

    public getSENDiagnosticsRefreshButton(): ButtonModel[] {
        return this.hasPermissions(this.serviceUIPopupButtons.SENDiagnosticsRefresh);
    }

    // TODO add ButtonBehavior and test
    public getUICustomizationsAvailable(UnitLocation: string): ButtonModel[] {
        const buttonList: ButtonModel[] = [];
        const listOverrides = _.filter(this.uiCustomizations.Overrides, function (item) {
            //return item.Countries
        });

        for (const overrideModel of listOverrides) {
            const buttonModel = JsUtil.mapToNewObject({
                ButtonType: ButtonType.statebutton,
                Id: overrideModel.Name,
                ActionId: "override",
                Label: overrideModel.Name,
                payload: overrideModel
            }, new ButtonModel());

            for (const attractLoop of overrideModel.AttractLoops) {
                const attractLoopButtonModel = JsUtil.mapToNewObject({
                    ButtonType: ButtonType.statebutton,
                    Id: attractLoop.Name,
                    Label: attractLoop.Name,
                    ActionId: "attractloop",
                    payload: attractLoop
                }, new ButtonModel());
                buttonModel.ButtonModelList.push(attractLoopButtonModel);
            }

            buttonList.push(buttonModel);
        }

        return buttonList;
    }

    async getPlatform(fileTokenToReturn) {
        let platformFileName = '';
        if (fileTokenToReturn) {
            platformFileName = fileTokenToReturn;
        } else {
            // at this point, only one platform file available and it works
            // on all configurations
            platformFileName = 'platform_1080x1920.json';
        }
        const contents = await this.configurationRepository.getPlatform(platformFileName);
        // const resultPromise = new Promise(function(resolve, reject) {
        //     resolve(contents);
        // });
        return contents;
    }

    async getPlatform2() {
        return this.configurationRepository.getPlatform2();
    }

    async getDesignFlavor() {
        return this.configurationRepository.getDesignFlavors();
    }

    async getDesignPourables(country) {
        return this.configurationRepository.getDesignPourables(country);
    }

    async getDesignBubbles() {
        return this.configurationRepository.getDesignBubbles();
    }

    async getDesignAnimations() {
        return this.configurationRepository.getDesignAnimations();
    }

    async getIdleState() {
        return this.configurationRepository.getIdleState();
    }

    async getUnitState() {
        return DeviceInfo.unitState;
    }

    getLocalizationForConsumerUI() {
        return this.configurationRepository.getLocalizationForConsumerUI();
    }



    async getPourItems() {
        let self = this ;
        this.dctPourButtonModelsByPourId = {};

        const targetPourItemModel = new PourItemModel();
        const pourablesDesignArray = await this.configurationRepository.getDesignPourables(DeviceInfo.unitState.CountryLanguageCode);
        const flavorsDesignArray = await this.configurationRepository.getDesignFlavors();
        const uidata: UIVisualsModel = <UIVisualsModel> await this.getUIData();

        this.addToPourItemModel(uidata.brands, pourablesDesignArray, targetPourItemModel, "brands");
        this.addFlavorsToPourItemModel(uidata.flavors, flavorsDesignArray, targetPourItemModel, "flavors");
        this.addToPourItemModel(uidata.curatedMixes, pourablesDesignArray, targetPourItemModel, "curatedMixes");
        this.addToPourItemModel(uidata.topCombinations, pourablesDesignArray, targetPourItemModel, "topCombinations");
        this.addToPourItemModel(uidata.waters, pourablesDesignArray, targetPourItemModel, "waters");


        targetPourItemModel.brands = await this.addCalorieInfo(targetPourItemModel.brands);
        targetPourItemModel.curatedMixes = await this.addCalorieInfo(targetPourItemModel.curatedMixes);

        // TODO if you try to move the ada buttons to the left individually in the layout files, the code will automatically
        // move them back to the right
        // ========= more test code
        // targetPourItemModel.brands = targetPourItemModel.brands.concat(targetPourItemModel.brands);
        // targetPourItemModel.brands = targetPourItemModel.brands.slice(0,12);
        // // targetPourItemModel.curatedMixes = targetPourItemModel.brands.slice(0,12);
        //targetPourItemModel.curatedMixes = targetPourItemModel.curatedMixes.slice(0,3);
        // targetPourItemModel.curatedMixes = targetPourItemModel.brands.slice(0,3);
        // ========================

        const itemCount = targetPourItemModel.brands.length + targetPourItemModel.curatedMixes.length;

        targetPourItemModel.homeMenu = await this.configurationRepository.getPlatformMenuLayout(itemCount);



        // // ================= TEST CODE ===============================
        _.forEach(targetPourItemModel.curatedMixes, function(item: PourableDesign){
            console.log('pourable.pouritem',item.pourItem);
           item.pourItem.isDisabled = false ;
        }) ;
        // targetPourItemModel.brands[1].pourItem.isDisabled = true ;
        // targetPourItemModel.brands[5].pourItem.isDisabled = true ;
        // ===========================================================

        return targetPourItemModel;
    }

    async getOverrides() {
        return this.configurationRepository.getOverrides();
    }

    async getCalorieCountState() {
        return this.configurationRepository.getCalorieCountState();
    }

    async addCalorieInfo(pourables: PourableDesign[]) {
        const calorieCountStateMaster: CalorieCountState = await this.getCalorieCountState();
        const dctPourButtonModels = this.dctPourButtonModelsByPourId;

        if (!calorieCountStateMaster.IsToggleButtonEnabled) {
            return;
        }

        if (calorieCountStateMaster.CalorieCups.length === 0) {
            console.log("No calorie cups defined.");
            return;
        }

        _.forEach(pourables, function(item: PourableDesign) {
            const cups: CalorieCup[] = JSON.parse(JSON.stringify(calorieCountStateMaster.CalorieCups));
            item.CalorieCups = cups;

            const pourButtonModel = dctPourButtonModels[item.pourItem.pourConfigurationId];

            const skuMappingList: SkuToValveMapping = pourButtonModel.payload.SkuToValveMappings;

            const skuMapping: SkuToValveMapping = _.find(skuMappingList, function(i) {
                return i.sku.length > 4;
            });

            const bibItem: BibItemModel = skuMapping.valveAssignmentState.BibItemAsButtonModel.payload;

            _.forEach(cups, function(cup) {
                const totalCalories: number = Math.round(cup.QtyInOunces * bibItem.CaloriesPerOz);

                cup.Line1Label = totalCalories + " ${calorie}";

                cup.QtyInMilliliters = Math.round(cup.QtyInMilliliters);
                cup.QtyInOunces = Math.round(cup.QtyInOunces);

                if (DeviceInfo.unitState.UnitLocation === "US") {
                    cup.Line2Label = cup.CupName + " " + cup.QtyInOunces + " FL OZ";
                } else {
                    cup.Line2Label = cup.QtyInMilliliters + "ML (" + cup.QtyInOunces + "OZ)";
                }
            });
        });
        return pourables;
    }

    addToPourItemModel(buttonModels: ButtonModel[], designs: PourableDesign[],
                       targetPourItemModal: PourItemModel, targetPropertyName: string) {
        const pourItems = this.convertButtonModelsToPourItems(buttonModels);
        const targetArray: PourableDesign[] = [];

        _.forEach(pourItems, function(item) {
            const foundDesignItem = _.find(designs, function(designItem) {
                return item.id === designItem.id;
            });
            if (foundDesignItem) {
                foundDesignItem.pourItem = item ;
                if (!foundDesignItem.Weighting) {
                    console.log("No Weighting on DesignItem", foundDesignItem.name);
                    foundDesignItem.Weighting = 20000;
                } else if (foundDesignItem.Weighting <  1) {
                    // foundDesignItem.Weighting = 19000;
                }
                targetArray.push(foundDesignItem);
            }
        });
        const orderedArray = _.sortBy(targetArray, [function(o: PourableDesign) {
            return o.Weighting;
        }]);
        targetPourItemModal[targetPropertyName] = orderedArray;
    }

    addFlavorsToPourItemModel(buttonModels: ButtonModel[], designs: Flavor[],
                             targetPourItemModal: PourItemModel, targetPropertyName: string) {

        const flavorPourItems = this.convertButtonModelsToPourItems(buttonModels);

        _.forEach(flavorPourItems, function(item) {
            const foundFlavorItem: Flavor = _.find(designs, function(designItem) {
                return item.id === designItem.id;
            });

            if (foundFlavorItem) {
                if (! item.isDisabled) {
                    foundFlavorItem.pourItem = item;
                    targetPourItemModal[targetPropertyName].push(foundFlavorItem);
                }
            }

        });
    }

    convertButtonModelsToPourItems(buttonModels: ButtonModel[]): PourItem[] {
        const pourItems: PourItem[] = [];

        const dctPourButtonModels = this.dctPourButtonModelsByPourId;

        _.forEach(buttonModels, function(item){
            const pourItem = new PourItem();
            pourItem.pourConfigurationId = SHORTID.generate();

            // ToDo: topCombinations need a payload
            if (!item.payload) {
                pourItem.id = item.id ;
            } else if (!item.payload.BeverageId) {
                console.log(`missing beverageId on ${item.Label}`);
                pourItem.id = '~' + item.label;
            } else {
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
    }

    getHome(file: string) {
        let fileName = 'home_spire.json';

        if(file){
            fileName = file;
        }

        else if(DeviceInfo.unitState.UnitType === UnitTypes.Spire5) {
            fileName = 'home_spire5.json';
        }
        else if(DeviceInfo.unitState.UnitType === UnitTypes.Spire5 && DeviceInfo.unitState.UnitLocation === "CA") {
            fileName = 'home_spire5_ca.json';
        }

        return this.configurationRepository.getHome(fileName);
    }

}
