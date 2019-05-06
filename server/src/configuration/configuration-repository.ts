import {inject, injectable} from "inversify";
import {JsUtil} from "../universal/JsUtil";
import {AppInfoService} from "../services/app-info.service";
import TYPES, {FileLocations} from "../server.types";
import * as JSONFILE from "load-json-file";
import * as _ from 'lodash';
import {
    ButtonModel,
    Flavor,
    FlavorAnimation,
    FlavorDesign,
    IdleState,
    LegacyValveModel,
    MixologyStateModel,
    PermissionsModel,
    Role,
    TopCombinationModel,
    UICustomizationsModel,
    ResourceItem,
    PourableDesign,
    DesignAssets,
    DesignNode,
    DesignColors,
    DesignParticles,
    DesignAnimation,
    DesignSecondaryAnimation,
    CalorieCup,
    CalorieCountState,
    ConsumerUILocalizationModel,
    LocalizationResourceModel,
    OverrideModel,
    OverrideOptions,
    DesignParticlesBrand,
    PlatformModel, PlatformMenuLayout, PlatformCoordinate
} from "../universal/app.types";
import {UnitState} from "../unitstate/unit-state";
import {DeviceInfo} from "../unitstate/device-info";

const PATH = require("path");

@injectable()
export class ConfigurationRepository {

    objectId: number;

    // TODO figure out how to use deserializefromdisk
    constructor(@inject(TYPES.AppInfo) private appInfo: AppInfoService,
                @inject(TYPES.FileLocations) private fileLocations: FileLocations) {
        this.objectId = JsUtil.getObjectId();
        console.log("ctor.ConfigurationRepository", this.objectId);
    }

    // return LocalizationResourceModel
    getLocalizationResources(countrylanguagecode: string) {
        try {
            const fileName = PATH.join(this.appInfo.configDir_App, "localization." + countrylanguagecode + ".json");
            return JSONFILE.sync(fileName);
        } catch (err) {
            console.log("ERROR: FileNotFoundException on Country:" + countrylanguagecode);
            return null;
        }
    }

    async getPlatform(fileName: string): Promise<any> {
        const fullfileName = PATH.join(this.appInfo.designDir, fileName);
        return JSONFILE.sync(fullfileName);
    }

    async getPlatform2(): Promise<any> {

        // TODO what should the dirsegment be?
        const dirsegment = DeviceInfo.unitState.UnitType != "Spire5" ? "spire" : "spire5";
        const baseDir = PATH.join(this.appInfo.configDir_App, "design/platform", dirsegment);
        const platformFile = PATH.join(baseDir, "platform.json");

        const loadedPlatformFile = JSONFILE.sync(platformFile);
        const pModel = JsUtil.mapToNewObject(loadedPlatformFile, new PlatformModel());

        return pModel;
    }

    async getPlatformMenuLayout(itemCount: number): Promise<any> {

        const dirsegment = DeviceInfo.unitState.UnitType != "Spire5" ? "spire" : "spire5";
        const baseDir = PATH.join(this.appInfo.configDir_App, "design/platform", dirsegment);
        const layoutFile = PATH.join(baseDir, `layout${itemCount}.json`);

        const loadedLayoutFile = JSONFILE.sync(layoutFile);
        const pModel = JsUtil.mapToNewObject(loadedLayoutFile, new PlatformMenuLayout());

        return pModel;
    }

    // return ServiceUIModel
    async getServiceUI(): Promise<any> {
        return JSONFILE.sync(this.fileLocations.serviceUIState);
    }

    // returns ServiceUIPopupButtonsModel
    getServiceUIPopupButtons() {
        return JSONFILE.sync(this.fileLocations.serviceUIPopupButtonState);
    }

    // returns UICustomizationsModel
    // TODO find where it would get the customizations
    getUICustomizations() {
        return JsUtil.mapToNewObject(JSONFILE.sync(this.fileLocations.uiCustomizationsAvailable), new UICustomizationsModel());
    }

    getUnitState() {
        // TODO create the UnitState model in issue 49
        const result = JsUtil.mapToNewObject(JSONFILE.sync(this.fileLocations.unitState), new UnitState());
        return result ;
    }

    // TODO find code that saves it to disk
    saveUnitState(unitState: UnitState) {
        //JSONFILE.save()
    }

    //TODO test;
    getPermissions(userRole: Role): string[] {
        // get userpermissions from the file location basedon the user Role
        var userPermissions = JsUtil.mapToNewObject(JSONFILE.sync(this.fileLocations.userPermissions), new PermissionsModel());

        var correctPermissions = _.find(userPermissions.Roles, function (item) {
            return item.Role == userRole;
        });

        return correctPermissions.ActionPermissions;
    }

    // TODO file deletion
    getMixologyState(): ButtonModel[] {
        // create a MixologyStateModel from the mixology file location
        var mixologyStateModel_dirty = JSONFILE.sync(this.fileLocations.mixologyState);

        var mixologyStateModel = new MixologyStateModel();
        mixologyStateModel.Version = mixologyStateModel_dirty.Version;

        for (let mixologyState of mixologyStateModel_dirty.Mixes) {
            mixologyStateModel.Mixes.push(JsUtil.mapToNewObject(mixologyState, new ButtonModel()));
        }

        return mixologyStateModel.Mixes;
    }

    getMixologyState2(): any {
        // create a MixologyStateModel from the mixology file location
        var mixologyStateModel_dirty = JSONFILE.sync(this.fileLocations.mixologyState2);

        return mixologyStateModel_dirty;

    }


    writeMixologyState(mixes: ButtonModel[]) {
        var mixologyStateModel = new MixologyStateModel();
        mixologyStateModel.Mixes = mixes;

        // serialize to disk
    }

    resetMixologyState() {
        var mixologyStateModel = JSONFILE.sync(this.fileLocations.curatedMixologySeed);
        // serialize to disk
    }

    getTopCombinationState(): ButtonModel[] {
        var topcombinationmodel = JSONFILE.sync(this.fileLocations.topCombinationState);
        // ToDo: umm.. not really
        topcombinationmodel.topCombinations.forEach(x => x.IsDisabled = false);
        return topcombinationmodel.topCombinations;
    }

    // TODO test
    getTopCombinationSeed(): ButtonModel[] {
        var topCombinationModel_dirty = JSONFILE.sync(this.fileLocations.topCombinationSeed);

        var topCombinationModel = new Array<ButtonModel>();

        for (let button in topCombinationModel_dirty) {
            topCombinationModel.push(JsUtil.mapToNewObject(button, new ButtonModel()));
        }

        return topCombinationModel;
    }

    // TODO test
    getCuratedMixSeed(): ButtonModel[] {
        var mixologyStateModel_dirty = JSONFILE.sync(this.fileLocations.curatedMixologySeed);

        var mixologyStateModel = new Array<ButtonModel>();

        for (let button in mixologyStateModel_dirty) {
            mixologyStateModel.push(JsUtil.mapToNewObject(button, new ButtonModel()));
        }

        return mixologyStateModel;
    }

    // takes ButtonModel[] as input
    writeTopCombinationState(combinations: ButtonModel[]) {
        var topCombinationModel = new TopCombinationModel();
        topCombinationModel.TopCombinations = combinations;

        // serialize to disk
    }

    resetTopCombinationState() {
        var topCombinationModel = JSONFILE.sync(this.fileLocations.topCombinationSeed);

        // serialize to disk
    }

    getLegacyValvesState(): ButtonModel[] {
        var legacyValveModel = JsUtil.mapToNewObject(JSONFILE.sync(this.fileLocations.legacyValveState), new LegacyValveModel());
        return legacyValveModel.LegacyValves;
    }

    // returns an IList of ButtonModels
    getLegacyValvesSeed(): ButtonModel[] {
        var legacyValveModel = JsUtil.mapToNewObject(JSONFILE.sync(this.fileLocations.legacyValveSeed), new LegacyValveModel());
        return legacyValveModel.LegacyValves;
    }

    writeLegacyValvesState(legacyValves: ButtonModel[]) {
        var legacyValveModel = new LegacyValveModel();
        legacyValveModel.LegacyValves = legacyValves;
        // serialize to disk
    }

    resetLegacyValvesState() {
        var legacyValveModel = JSONFILE.sync(this.fileLocations.legacyValveSeed);
        // serialize to disk
    }

    getUserPermissions(): PermissionsModel {
        return JsUtil.mapToNewObject(JSONFILE.sync(this.fileLocations.userPermissions), new PermissionsModel());
    }

    getHome(fileName: string): Promise<any> {
        return JSONFILE.sync(PATH.join(this.fileLocations.homeFolder, fileName));
    }

    async getDesignFlavors(): Promise<Flavor[]> {
        // read the disc for all files
        // combine the elements into one strongly typed collection

        const fs = require('fs');
        const glob = require('glob');

        let designFlavors: Flavor[] = [];

        // get all json files in the consumer ui flavor folder
        let filenames = glob.sync(this.fileLocations.designFlavorFolder + "**/*.json");

        for (let filename of filenames) {

            let current_file = JSONFILE.sync(filename);
            let designFlavor: Flavor = JsUtil.mapToNewObject(current_file, new Flavor());

            if (current_file.design) {
                designFlavor.design = JsUtil.mapToNewObject(current_file.design, new FlavorDesign());
            }

            if (current_file.select) {
                designFlavor.select = JsUtil.mapToNewObject(current_file.select, new FlavorAnimation());
            }

            if (current_file.spin) {
                designFlavor.spin = JsUtil.mapToNewObject(current_file.spin, new FlavorAnimation());
            }

            designFlavors.push(designFlavor);
        }

        return designFlavors;
    }

    async getDesignPourables(country: string): Promise<PourableDesign[]> {
        const fs = require('fs');
        const glob = require('glob');

        // ToDo Bug, we read en-us, then override for the specific (HERE WE ARE HARDCODING the folder)
        // see C# code for reference

        // get all json files in the consumer ui pourables folder
        let filenames = glob.sync(this.fileLocations.designFolder + `pourables/en-us/*.json`);

        // iterate and load all of the en-us first (en-us will have an entry
        // the id, will be the property name

        // next iterate and over-lay, using the id as the key, any language-country combination
        // this will be some entries

        if (country != "en-us") {
            const country_filenames = glob.sync(this.fileLocations.designFolder + `pourables/` + country + `/*.json`);

            filenames = filenames.concat(country_filenames);
        }

        // if we decide to include a customer specific overlay, then there would be another
        // iteration. perhaps, rather than naming, just a different folder design/pourables/customer

        // now we have the proper list of files to parse and get the design of pourables
        // so read the files
        const pourables: PourableDesign[] = [];
        _.forEach(filenames, function (file) {
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

                if (pourableRaw.design.secondaryAnimation) {
                    pourable.design.secondaryAnimation = JsUtil.mapToNewObject(
                        pourableRaw.design.secondaryAnimation,
                        new DesignSecondaryAnimation()
                    );
                }
                if (pourableRaw.design.secondaryAnimationAda) {
                    pourable.design.secondaryAnimationAda = JsUtil.mapToNewObject(
                        pourableRaw.design.secondaryAnimationAda,
                        new DesignSecondaryAnimation()
                    );
                }

                if (pourableRaw.design.secondaryAnimation_5) {
                    pourable.design.secondaryAnimation_5 = JsUtil.mapToNewObject(
                        pourableRaw.design.secondaryAnimation_5,
                        new DesignSecondaryAnimation()
                    );
                }
                if (pourableRaw.design.secondaryAnimationAda_5) {
                    pourable.design.secondaryAnimationAda_5 = JsUtil.mapToNewObject(
                        pourableRaw.design.secondaryAnimationAda_5,
                        new DesignSecondaryAnimation()
                    );
                }

                if (pourableRaw.design.particlesBrand) {
                    _.forEach(pourableRaw.design.particlesBrand, function(particleBrand){
                        const newItem = JsUtil.mapToNewObject(particleBrand, new DesignParticlesBrand());
                        pourable.design.particlesBrand.push(newItem);
                        console.log('==============>', file, newItem);
                    });

                    // pourable.design.particlesHome = JsUtil.mapToNewObject(pourableRaw.design.particlesBrand, new DesignParticlesBrand[]()]);
                }
                if (pourableRaw.CalorieCups) {
                    const calorieCups: CalorieCup[] = [];
                    _.forEach(pourable.CalorieCups, function (item) {
                        calorieCups.push(JsUtil.mapToNewObject(item, new CalorieCup()));
                    });

                    pourable.CalorieCups = calorieCups;
                }
            }

            pourables.push(pourable);
        });


        return pourables;
    }

    async getDesignBubbles(): Promise<any> {
        const bubbles_file = JSONFILE.sync(this.fileLocations.designFolder + "bubbles.json");

        return bubbles_file;
    }

    async getDesignAnimations(): Promise<any> {
        const fs = require('fs');
        const glob = require('glob');

        // get all json files in the consumer ui pourables folder
        const filenames = glob.sync(this.fileLocations.designFolder + "animations/**/*.json");

        const animationsArray: DesignAnimation[] = [];

        for (const filename of filenames) {
            const contents = JSONFILE.sync(filename);

            animationsArray.push(JsUtil.mapToNewObject(contents, new DesignAnimation()));
        }

        return animationsArray;
    }

    async getIdleState(): Promise<IdleState> {

        // ToDo: should be a seed file object
        const idleStateRaw = JSONFILE.sync(this.fileLocations.idleState);

        const idlestate = JsUtil.mapToNewObject(idleStateRaw, new IdleState());
        const videoitems: ResourceItem[] = [];

        if (idleStateRaw.videos) {
            for (let video of idleStateRaw.videos) {
                let videoitem = JsUtil.mapToNewObject(video, new ResourceItem());

                videoitems.push(videoitem);
            }

            idlestate.videos = videoitems;
        }

        return idlestate;
    }

    async getDeviceInfoUnitState(): Promise<UnitState> {
        const unitState = JSONFILE.sync(this.fileLocations.unitState);
        return unitState;
    }

    async getOverrides(): Promise<OverrideOptions> {
        const overrides = JSONFILE.sync(this.fileLocations.overrideState);
        return overrides;
    }

    async getCalorieCountState(): Promise<CalorieCountState> {
        const calorieCountState = JSONFILE.sync(this.fileLocations.calorieCountState);
        return calorieCountState;
    }

    getLocalizationForConsumerUI(): any {
        const consumerUILocalizationModel = new ConsumerUILocalizationModel();

        if (DeviceInfo.unitState.PrimaryConsumerLanguage == "none") {
            consumerUILocalizationModel.primaryLocalization = this.getLocalizationResourcesForConsumerUI("en-us");
        } else {
            consumerUILocalizationModel.primaryLocalization = this.getLocalizationResourcesForConsumerUI(DeviceInfo.unitState.PrimaryConsumerLanguage);
        }
        console.log("-----secondary", DeviceInfo.unitState.SecondaryConsumerLanguage, DeviceInfo.unitState);
        if (DeviceInfo.unitState.SecondaryConsumerLanguage == "none") {
            consumerUILocalizationModel.secondaryLocalization = this.getLocalizationResourcesForConsumerUI("es-mx");
        } else {
            consumerUILocalizationModel.secondaryLocalization = this.getLocalizationResourcesForConsumerUI(DeviceInfo.unitState.SecondaryConsumerLanguage);
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
    }

    getLocalizationResourcesForConsumerUI(countryLanguageCode: string): LocalizationResourceModel {
        try {
            const localizationFilePath = PATH.join(this.appInfo.configDir_App, "Localization", "consumerui." + countryLanguageCode + ".json");
            return JSONFILE.sync(localizationFilePath);
        } catch (Exception) {
            console.log("Error reading ConsumerUI Localization for Country: ", countryLanguageCode);
        }
        return new LocalizationResourceModel();
    }
}
