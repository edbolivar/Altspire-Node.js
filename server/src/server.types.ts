import * as PATH from "path";
import {AppInfoService} from "./services/app-info.service";
import {inject, injectable} from "inversify";

const TYPES = {
    AppInfo : Symbol('AppInfoService'),
    TaskRunner : Symbol('TaskRunner'),
    Task : Symbol('Task'),
    SocketService: Symbol('SocketService'),
    ValveControllerService: Symbol('ValveControllerService'),
    PubSubService: Symbol('PubSubService'),
    AppDataService : Symbol('AppDataService'),
    AppProductdataService : Symbol('AppProductdataService'),
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

export default TYPES;

export class DeviceInfo {

}

@injectable()
export class FileLocations {
    unitState: string;
    valveAssignmentState: string;
    valveAssignmentSeed: string;
    valveConfigurationState: string;
    valveConfigurationSeed: string;
    uiCustomizationsAvailable: string;
    userPermissions: string;
    mixologyState: string;
    mixologyState2: string;
    legacyOverrideFilePath: string;
    legacyUICustomizationsConfig: string;
    topCombinationState: string;
    topCombinationSeed: string;
    curatedMixologySeed: string;
    legacyValveState: string;
    legacyValveSeed: string;
    driveThruButtons: string;
    serviceUIState: string;
    serviceUIPopupButtonState: string;
    productUIItemState: string;
    recipeItemsFile: string;
    recipeFolder: string ;
    bibItemFolder: string ;
    bibItemsFile: string;
    designFolder: string;
    designFlavorFolder: string;
    idleState: string ;
    senEquipmentSerial: string;
    senAutoReg: string;
    homeFolder: string;
    calorieCountState: string;
    overrideSeed: string;
    overrideState: string;

    constructor(@inject(TYPES.AppInfo) private appInfo: AppInfoService) {
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

    applySeedFileIfNecessary(fullyQualifiedFileName: string) {
        var fs = require('fs');
        if (fs.existsSync(fullyQualifiedFileName)) {
            return;
        }


        var seedfilename = PATH.join(this.appInfo.configDir_App, "SeedFiles", PATH.basename(fullyQualifiedFileName));

        if (!fs.existsSync(seedfilename)) {
            console.log("Required Seed File is missing: ", seedfilename);
            return;
        }

        try
        {
            fs.createReadStream(seedfilename).pipe(fs.createWriteStream(fullyQualifiedFileName));
        }
        catch (err)
        {
            console.log(`ERROR Unable to apply seed file ${seedfilename} to ${fullyQualifiedFileName}`);
            return false;
        }
    }

}
