"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
// harvested from server side USB package
var DeviceDescriptor = /** @class */ (function () {
    function DeviceDescriptor() {
    }
    return DeviceDescriptor;
}());
exports.DeviceDescriptor = DeviceDescriptor;
var SystemDrive = /** @class */ (function () {
    function SystemDrive() {
    }
    return SystemDrive;
}());
exports.SystemDrive = SystemDrive;
/*export class PubSubTopic {

  static startPour: string = 'start.pour';
  static cancelPour: string = 'cancel.pour';
  static pourComplete: string = 'pour.complete';

  static leftNavToggleVisibility: string = 'leftnav.toggle.visibility' ;
  static onLogin: string  = 'user.login'    ;
  static onLogout: string  = 'user.logout' ;
  static testEvent: string  = 'test.event' ;

  static testSocketSend: string  = 'test.socket.send' ;

  static buttonGesture: string  = 'button.gesture' ;
  static buttonSelect: string  = 'button.select' ;
  static pourStart: string  = 'pour.start' ;

  static pdmDataReady: string  = 'product.datamodel.ready' ;
  static logToScreen: string  = 'log.to.screen' ;

  static start: string  = 'start' ;
  static stop: string  = 'stop' ;

  static updatedScreenMetrics: string  = 'updated.screen.metrics' ;

  static serviceUIDataReady: string = 'serviceui.data.ready' ;
  static testIODriver = "test.iodriver.event";
  static popupDialog = "popup.dialog";

  static unitStateChange = "unitstate.changed";
}*/
// obsolete
var Message = /** @class */ (function () {
    function Message() {
    }
    return Message;
}());
exports.Message = Message;
var DbRecordTypes = /** @class */ (function () {
    function DbRecordTypes() {
    }
    DbRecordTypes.recipe = '~';
    return DbRecordTypes;
}());
exports.DbRecordTypes = DbRecordTypes;
var AvailableRoles = /** @class */ (function () {
    function AvailableRoles() {
    }
    return AvailableRoles;
}());
exports.AvailableRoles = AvailableRoles;
// want to simplfy what you see in the debugger to what we think
// the user profile should be
var UserProfile = /** @class */ (function () {
    function UserProfile() {
    }
    return UserProfile;
}());
exports.UserProfile = UserProfile;
var MenuItem = /** @class */ (function () {
    function MenuItem(name, id) {
        this.name = name;
        this.id = id;
    }
    return MenuItem;
}());
exports.MenuItem = MenuItem;
var SimpleUser = /** @class */ (function () {
    function SimpleUser(userId, userHandle, roles, userName) {
        this.userId = userId;
        this.userHandle = userHandle;
        this.roles = roles;
        this.userName = userName;
    }
    return SimpleUser;
}());
exports.SimpleUser = SimpleUser;
var ButtonType = /** @class */ (function () {
    function ButtonType() {
    }
    ButtonType.brand = 'brand';
    ButtonType.flavor = 'flavor';
    ButtonType.ice = 'ice';
    ButtonType.water = 'water';
    ButtonType.topCombination = 'topcombination';
    ButtonType.action = 'action';
    ButtonType.mix = 'mix';
    ButtonType.valveAssignment = 'valveAssignment';
    ButtonType.actionpanel = 'ActionPanel';
    ButtonType.systempanel = 'SystemPanel';
    ButtonType.manualIce = 'manualice';
    ButtonType.autoPour = 'autopour';
    ButtonType.manualPour = 'manualpour';
    ButtonType.statebutton = 'statebutton';
    return ButtonType;
}());
exports.ButtonType = ButtonType;
var ButtonState = /** @class */ (function () {
    function ButtonState() {
    }
    ButtonState.selected = 'selected';
    ButtonState.available = 'available';
    ButtonState.disabled = 'disabled';
    ButtonState.hidden = 'hidden';
    return ButtonState;
}());
exports.ButtonState = ButtonState;
// TODO why are they numbers in the C# app?
var ButtonBehavior = /** @class */ (function () {
    function ButtonBehavior() {
    }
    /*static none = 1;
    static tap = 2;
    static longpress = 4;
    static checkable = 8;
    static status = 16;
    static mousedownup = 32;*/
    ButtonBehavior.none = "none";
    ButtonBehavior.tap = "tap";
    ButtonBehavior.longpress = "longpress";
    ButtonBehavior.checkable = "checkable";
    ButtonBehavior.status = "status";
    ButtonBehavior.mousedownup = "mousedownup";
    return ButtonBehavior;
}());
exports.ButtonBehavior = ButtonBehavior;
var Gestures = /** @class */ (function () {
    function Gestures() {
    }
    Gestures.singletap = 'singletap';
    Gestures.doubletap = 'doubletap';
    Gestures.press = 'press';
    Gestures.pressUp = 'pressup';
    Gestures.allGestures = 'singletap doubletap press pressup';
    return Gestures;
}());
exports.Gestures = Gestures;
var PourEventArgs = /** @class */ (function () {
    function PourEventArgs(brand, flavors, sender) {
        this.brand = brand;
        this.flavors = flavors;
        this.sender = sender;
        this.flavors = [];
    }
    return PourEventArgs;
}());
exports.PourEventArgs = PourEventArgs;
var ButtonActions = /** @class */ (function () {
    function ButtonActions() {
    }
    ButtonActions.manualIce = 'manual.ice';
    ButtonActions.autoPour = 'auto.pour';
    ButtonActions.manualPour = 'manual.pour';
    ButtonActions.clearSelections = 'clear.selections';
    return ButtonActions;
}());
exports.ButtonActions = ButtonActions;
var ButtonModel = /** @class */ (function () {
    function ButtonModel() {
        this.Id = '';
        this.ActionId = '';
        this.Weighting = 0;
        this.ButtonState = ButtonState.available;
        this.BibItem = BibItemModel;
        this.RecipeId = '';
        this.Label = '';
        this.ResourceId = "";
        this.PathToImage = '';
        this.PathToBackgroundImage = '';
        this.TextColor = '';
        this.TextSelectedColor = '';
        this.BackgroundColor = '';
        this.ButtonType = '';
        this.IsSelected = false;
        this.IsVisible = true;
        this.IsDisabled = false;
        this.pressOnly = false;
        this.gesture = '';
        this.payload = "";
        this.flavors = [];
        this.ButtonModelList = [];
        this.behaviors = [];
        this.FooterColor = "";
        this.FooterFontColor = "";
        this.FooterText = "";
        this.FooterIcon = "";
        this.RowNumber = "";
        this.LegacyValves = "";
        this.UnitTypes = "";
    }
    Object.defineProperty(ButtonModel.prototype, "pathToBackGroundImageAsUrl", {
        get: function () {
            var outline = 'url(' + this.PathToBackgroundImage + ')';
            return outline;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ButtonModel.prototype, "isTapOnly", {
        get: function () {
            return (this.behaviors.indexOf('tap') > -1 && this.behaviors.length == 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ButtonModel.prototype, "isPressOnly", {
        get: function () {
            return (this.behaviors.indexOf('press') > -1 && this.behaviors.length == 1);
        },
        enumerable: true,
        configurable: true
    });
    return ButtonModel;
}());
exports.ButtonModel = ButtonModel;
var ButtonModelList = /** @class */ (function () {
    function ButtonModelList() {
        this.WaterType = [];
        this.FlavorType = [];
        this.SyrupType = [];
        this.AllTypes = [];
    }
    return ButtonModelList;
}());
exports.ButtonModelList = ButtonModelList;
var UnitConfigurationModel = /** @class */ (function () {
    function UnitConfigurationModel(ValveLayout, AllValveLabelPairs) {
        this.ValveLayout = ValveLayout;
        this.AllValveLabelPairs = AllValveLabelPairs;
        this.Id = '';
        this.UnitName = '';
    }
    return UnitConfigurationModel;
}());
exports.UnitConfigurationModel = UnitConfigurationModel;
var UnitTypes = /** @class */ (function () {
    function UnitTypes() {
    }
    UnitTypes.Spire2 = "Spire2";
    UnitTypes.Spire2Crew = "Spire2Crew";
    UnitTypes.Spire3 = "Spire3";
    UnitTypes.Spire41 = "Spire41";
    UnitTypes.Spire5 = "Spire5";
    UnitTypes.DriveThru = "Spire6";
    return UnitTypes;
}());
exports.UnitTypes = UnitTypes;
var ValveConfigurationRow = /** @class */ (function () {
    function ValveConfigurationRow() {
        this.RowNumber = -1;
        this.ValveLabelPair = [];
    }
    return ValveConfigurationRow;
}());
exports.ValveConfigurationRow = ValveConfigurationRow;
var ValveLabelPair = /** @class */ (function () {
    function ValveLabelPair() {
        this.ValveNumber = -1;
        this.SortValveNumber = 0;
        this.Label = '';
        this.Bank = 0;
        this.Weighting = 0;
        this.Row = 0;
    }
    Object.defineProperty(ValveLabelPair.prototype, "valveLabel", {
        get: function () {
            var vlabel = this.Label + " - V" + this.ValveNumber;
            return vlabel;
        },
        enumerable: true,
        configurable: true
    });
    return ValveLabelPair;
}());
exports.ValveLabelPair = ValveLabelPair;
var PDMDataArg = /** @class */ (function () {
    function PDMDataArg(pdmtype, data) {
        this.pdmtype = pdmtype;
        this.data = data;
    }
    return PDMDataArg;
}());
exports.PDMDataArg = PDMDataArg;
var PDMDataType = /** @class */ (function () {
    function PDMDataType() {
    }
    PDMDataType.driveThruData = 'driveThruData';
    PDMDataType.serviceUIData = 'serviceUIData';
    return PDMDataType;
}());
exports.PDMDataType = PDMDataType;
var ButtonEventArgs = /** @class */ (function () {
    function ButtonEventArgs(gesture, buttonModel, consumerObjectId) {
        this.gesture = gesture;
        this.buttonModel = buttonModel;
        this.consumerObjectId = consumerObjectId;
    }
    return ButtonEventArgs;
}());
exports.ButtonEventArgs = ButtonEventArgs;
var PourData = /** @class */ (function () {
    function PourData() {
        this.qty = 0;
    }
    return PourData;
}());
exports.PourData = PourData;
var ButtonSet = /** @class */ (function () {
    function ButtonSet() {
    }
    ButtonSet.topCombination = 'topCombination';
    ButtonSet.brand = 'brand';
    ButtonSet.flavor = 'flavor';
    ButtonSet.water = 'water';
    ButtonSet.ice = 'ice';
    ButtonSet.action = 'action';
    ButtonSet.mix = 'mix';
    return ButtonSet;
}());
exports.ButtonSet = ButtonSet;
var ScreenMetrics = /** @class */ (function () {
    function ScreenMetrics() {
    }
    return ScreenMetrics;
}());
exports.ScreenMetrics = ScreenMetrics;
var ButtonEventData = /** @class */ (function () {
    // var data = {Type:e.Type, buttonModel:this.buttonModel, Tag:e} ;
    function ButtonEventData(type, buttonModel, viewModelObjectId, tag) {
        this.type = type;
        this.buttonModel = buttonModel;
        this.viewModelObjectId = viewModelObjectId;
        this.tag = tag;
    }
    return ButtonEventData;
}());
exports.ButtonEventData = ButtonEventData;
var AppConfig = /** @class */ (function () {
    function AppConfig() {
        this.production = false;
        this.siteName = "";
        this.envfile = "";
        this.dbBackupAccountUrlPrefix = "";
        this.remoteDbUrlPrefix = "";
        this.remoteDbUserDbPrefix = "";
        this.commonDbUrl = "";
        this.userDbUrl = "";
        // these are built
        this.commonDbName = "";
        this.userDbName = "";
        this.userDbPrefix = "";
        this.serverPort = "";
        this.socketPort = "";
        this.siteIconPath = "";
        this.version = "V1";
        this.contactUsAtEmail = "jeff@oldprogrammer.io";
        this.apiUrls = {};
        this.serverHost = "";
    }
    return AppConfig;
}());
exports.AppConfig = AppConfig;
var PourEventData = /** @class */ (function () {
    function PourEventData() {
    }
    return PourEventData;
}());
exports.PourEventData = PourEventData;
var PourMode = /** @class */ (function () {
    function PourMode() {
    }
    PourMode.optifill = "optifill";
    PourMode.timedPour = 'timedPour';
    PourMode.isBrix = 'isBrix';
    PourMode.manualPour = 'manualPour';
    return PourMode;
}());
exports.PourMode = PourMode;
var UICustomizationState = /** @class */ (function () {
    function UICustomizationState() {
        this.OverrideName = "";
        this.AttractLoopName = "";
    }
    return UICustomizationState;
}());
exports.UICustomizationState = UICustomizationState;
var ValveFlowRatesState = /** @class */ (function () {
    function ValveFlowRatesState() {
        this.HighStillFlowRate = 0.0;
        this.LowStillFlowRate = 0.0;
        this.HighCarbFlowRate = 0.0;
        this.LowCarbFlowRate = 0.0;
        this.FlavorShotFlowRate = 0.0;
    }
    return ValveFlowRatesState;
}());
exports.ValveFlowRatesState = ValveFlowRatesState;
var ValveAssignment = /** @class */ (function () {
    function ValveAssignment() {
        this.Assignments = [];
    }
    return ValveAssignment;
}());
exports.ValveAssignment = ValveAssignment;
var ValveAssignmentState = /** @class */ (function () {
    function ValveAssignmentState() {
        this.ValveId = "";
        this.SKU = "";
        this.IsLocked = false;
        this.IsHighYield = false;
        this.ValveLabelPair = new ValveLabelPair();
    }
    Object.defineProperty(ValveAssignmentState.prototype, "isAssigned", {
        get: function () {
            return this.SKU.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    ValveAssignmentState.prototype.unAssignValve = function () {
        this.BibItemAsButtonModel = null;
        this.SKU = "";
    };
    ValveAssignmentState.prototype.assignValve = function (sku, bibItem) {
        this.SKU = sku;
        this.BibItemAsButtonModel = bibItem;
    };
    return ValveAssignmentState;
}());
exports.ValveAssignmentState = ValveAssignmentState;
var MixologyStateModel = /** @class */ (function () {
    function MixologyStateModel() {
        this.Mixes = [];
    }
    return MixologyStateModel;
}());
exports.MixologyStateModel = MixologyStateModel;
var BibItemType = /** @class */ (function () {
    function BibItemType() {
    }
    BibItemType.flavorshot = "FlavorShot";
    BibItemType.carbwater = "CarbWater";
    BibItemType.stillwater = "StillWater";
    BibItemType.syrup = "Syrup";
    return BibItemType;
}());
exports.BibItemType = BibItemType;
var CountryLanguageCustomerModel = /** @class */ (function () {
    function CountryLanguageCustomerModel() {
    }
    return CountryLanguageCustomerModel;
}());
exports.CountryLanguageCustomerModel = CountryLanguageCustomerModel;
var BibItemModel = /** @class */ (function () {
    function BibItemModel() {
        this.Bibsize = '';
        this.Description = '';
        this.MixRatio = '';
        this.Name = '';
        this.AltName = '';
        this.SKU = '';
        this.CaloriesPerOz = 0;
        this.Type = new BibItemType();
        this.CountryLanguageCustomers = [];
        this.IsLocked = false;
        this.IsHighYield = false;
        this.IsAssigned = true;
    }
    Object.defineProperty(BibItemModel.prototype, "toString", {
        get: function () {
            var vlabel = this.SKU + " - " + this.Description;
            return vlabel;
        },
        enumerable: true,
        configurable: true
    });
    return BibItemModel;
}());
exports.BibItemModel = BibItemModel;
var ServiceUIModel = /** @class */ (function () {
    function ServiceUIModel() {
        this.ActionPanel = [];
        this.SystemPanel = [];
    }
    return ServiceUIModel;
}());
exports.ServiceUIModel = ServiceUIModel;
var ServiceUIPopupButtonsModel = /** @class */ (function () {
    function ServiceUIPopupButtonsModel() {
        this.ServiceLanguages = [];
        this.ConsumerLanguages = [];
        this.MachineStatus = [];
        this.UnitType = [];
        this.UnitLocation = [];
        this.ModemConnectivity = [];
        this.ShutdownOptions = [];
        this.Recipes = [];
        this.BibItemTypes = [];
        this.DisplayOffOptions = [];
        this.CleanDisplayOptions = [];
        this.FlowRates = [];
        this.ValveLockOptions = [];
        this.ChangeValueMenuOptions = [];
        this.Priming = [];
        this.ValvePriming = [];
        this.Brix = [];
        this.ConfigureSelectionTimeout = [];
        this.EquipmentStatus = [];
        this.SENDiagnostics = [];
        this.SENDiagnosticsEquipmentSerial = [];
        this.SENDiagnosticsRefresh = [];
        this.ConfirmButtons = [];
    }
    return ServiceUIPopupButtonsModel;
}());
exports.ServiceUIPopupButtonsModel = ServiceUIPopupButtonsModel;
var LegacyValveModel = /** @class */ (function () {
    function LegacyValveModel() {
        this.LegacyValves = [];
    }
    return LegacyValveModel;
}());
exports.LegacyValveModel = LegacyValveModel;
var PermissionsModel = /** @class */ (function () {
    function PermissionsModel() {
        this.Roles = [];
    }
    return PermissionsModel;
}());
exports.PermissionsModel = PermissionsModel;
var RolePermission = /** @class */ (function () {
    function RolePermission() {
        this.ActionPermissions = [];
    }
    return RolePermission;
}());
exports.RolePermission = RolePermission;
var Role;
(function (Role) {
    Role[Role["None"] = 0] = "None";
    Role[Role["Crew"] = 1] = "Crew";
    Role[Role["MEM"] = 2] = "MEM";
    Role[Role["Manager"] = 3] = "Manager";
    Role[Role["Support"] = 4] = "Support";
    Role[Role["Super"] = 5] = "Super";
})(Role = exports.Role || (exports.Role = {}));
var UICustomizationsModel = /** @class */ (function () {
    function UICustomizationsModel() {
    }
    return UICustomizationsModel;
}());
exports.UICustomizationsModel = UICustomizationsModel;
var OverrideModel = /** @class */ (function () {
    function OverrideModel(AttractLoopsAsButtonModel) {
        this.AttractLoopsAsButtonModel = AttractLoopsAsButtonModel;
    }
    return OverrideModel;
}());
exports.OverrideModel = OverrideModel;
var PlatformModel = /** @class */ (function () {
    function PlatformModel() {
        this.width = 0;
        this.height = 0;
        this.frameRate = 0;
        this.homeMenu = new PlatformMenuLayout;
        this.flavorDirection = '';
        this.brandFlavorsInfo = new BrandFlavorsInfo();
        this.layout = {};
    }
    return PlatformModel;
}());
exports.PlatformModel = PlatformModel;
var BrandFlavorsInfo = /** @class */ (function () {
    function BrandFlavorsInfo() {
        this.flavorTitle = 0;
        this.itemFontSize = 0;
        this.itemCount = 0;
        this.titleFontSize = 0;
        this.preTitleFontSize = 0;
        this.itemHeight = 0;
    }
    return BrandFlavorsInfo;
}());
exports.BrandFlavorsInfo = BrandFlavorsInfo;
var PlatformMenuLayout = /** @class */ (function () {
    function PlatformMenuLayout() {
        this.top = "";
        this.left = "";
        this.right = "";
        this.bottom = "";
        this.items = [];
        this.adaItems = [];
        this.adaLeft = 0;
    }
    return PlatformMenuLayout;
}());
exports.PlatformMenuLayout = PlatformMenuLayout;
var PlatformMenuCoordinate = /** @class */ (function () {
    function PlatformMenuCoordinate() {
        this.x = 0;
        this.y = 0;
        this.radius = 0;
    }
    return PlatformMenuCoordinate;
}());
exports.PlatformMenuCoordinate = PlatformMenuCoordinate;
var PlatformCoordinate = /** @class */ (function () {
    function PlatformCoordinate() {
        this.top = "";
        this.left = "";
        this.right = "";
        this.bottom = "";
        this.width = "";
        this.height = "";
    }
    return PlatformCoordinate;
}());
exports.PlatformCoordinate = PlatformCoordinate;
var OverrideOptions = /** @class */ (function () {
    function OverrideOptions() {
    }
    return OverrideOptions;
}());
exports.OverrideOptions = OverrideOptions;
var UIVisualsModel = /** @class */ (function () {
    function UIVisualsModel() {
        this.brands = [];
        this.unusedFlavors = [];
        this.flavors = [];
        this.waters = [];
        this.topCombinations = [];
        this.curatedMixes = [];
        this.ice = [];
        this.actions = [];
        this.valve = [];
        this.selectable = [];
    }
    Object.defineProperty(UIVisualsModel.prototype, "toString", {
        get: function () {
            var vlabel = "version:" + this.version + " brands:" + this.brands.length + " flavors:" + this.flavors.length + " waters:" + this.waters.length;
            return vlabel;
        },
        enumerable: true,
        configurable: true
    });
    return UIVisualsModel;
}());
exports.UIVisualsModel = UIVisualsModel;
var AttractLoopModel = /** @class */ (function () {
    function AttractLoopModel() {
    }
    return AttractLoopModel;
}());
exports.AttractLoopModel = AttractLoopModel;
var TopCombinationModel = /** @class */ (function () {
    function TopCombinationModel() {
    }
    return TopCombinationModel;
}());
exports.TopCombinationModel = TopCombinationModel;
var ConsumerUILocalizationModel = /** @class */ (function () {
    function ConsumerUILocalizationModel() {
        this.primaryLocalization = new LocalizationResourceModel();
        this.secondaryLocalization = new LocalizationResourceModel();
    }
    return ConsumerUILocalizationModel;
}());
exports.ConsumerUILocalizationModel = ConsumerUILocalizationModel;
var LocalizationResourceModel = /** @class */ (function () {
    function LocalizationResourceModel() {
        this.Version = "";
        this.CountryLanguageCode = "";
        this.ResourceStrings = new LocalizedItems();
    }
    LocalizationResourceModel.prototype.getHasItems = function () {
        return Object.keys(this.ResourceStrings).length > 0;
    };
    return LocalizationResourceModel;
}());
exports.LocalizationResourceModel = LocalizationResourceModel;
var LocalizedItems = /** @class */ (function () {
    function LocalizedItems() {
    }
    return LocalizedItems;
}());
exports.LocalizedItems = LocalizedItems;
var ProductItemTypeEnum;
(function (ProductItemTypeEnum) {
    ProductItemTypeEnum[ProductItemTypeEnum["Flavor"] = 0] = "Flavor";
    ProductItemTypeEnum[ProductItemTypeEnum["Brand"] = 1] = "Brand";
    ProductItemTypeEnum[ProductItemTypeEnum["Mix"] = 2] = "Mix";
    ProductItemTypeEnum[ProductItemTypeEnum["Water"] = 3] = "Water";
})(ProductItemTypeEnum = exports.ProductItemTypeEnum || (exports.ProductItemTypeEnum = {}));
var UIItemOverride;
(function (UIItemOverride) {
    UIItemOverride[UIItemOverride["None"] = 1] = "None";
    UIItemOverride[UIItemOverride["ImageLogo"] = 2] = "ImageLogo";
    UIItemOverride[UIItemOverride["ImageLogoBrand"] = 4] = "ImageLogoBrand";
    UIItemOverride[UIItemOverride["MixBeverage"] = 8] = "MixBeverage";
    UIItemOverride[UIItemOverride["InheritFlavors"] = 16] = "InheritFlavors";
})(UIItemOverride = exports.UIItemOverride || (exports.UIItemOverride = {}));
var ProductUIItemModel = /** @class */ (function () {
    function ProductUIItemModel() {
    }
    return ProductUIItemModel;
}());
exports.ProductUIItemModel = ProductUIItemModel;
var RecipeType = /** @class */ (function () {
    function RecipeType() {
    }
    RecipeType.Water = "Water";
    RecipeType.Beverage = "Beverage";
    RecipeType.Mix = "Mix";
    RecipeType.Flavor = "Flavor";
    return RecipeType;
}());
exports.RecipeType = RecipeType;
var RecipeItemsOwner = /** @class */ (function () {
    function RecipeItemsOwner() {
    }
    return RecipeItemsOwner;
}());
exports.RecipeItemsOwner = RecipeItemsOwner;
var RecipeSku = /** @class */ (function () {
    function RecipeSku() {
        this.Sku = '';
        this.Name = '';
    }
    return RecipeSku;
}());
exports.RecipeSku = RecipeSku;
var SkuToValveMapping = /** @class */ (function () {
    function SkuToValveMapping(sku, valveAssignmentState) {
        this.sku = sku;
        this.valveAssignmentState = valveAssignmentState;
    }
    return SkuToValveMapping;
}());
exports.SkuToValveMapping = SkuToValveMapping;
var ActionType = /** @class */ (function () {
    function ActionType() {
    }
    return ActionType;
}());
exports.ActionType = ActionType;
var ValveAction = /** @class */ (function () {
    function ValveAction() {
    }
    return ValveAction;
}());
exports.ValveAction = ValveAction;
var InventoryMapping = /** @class */ (function () {
    function InventoryMapping() {
        this.ValveActions = [];
        this.ValveAssignments = [];
    }
    return InventoryMapping;
}());
exports.InventoryMapping = InventoryMapping;
var RecipeItemModel = /** @class */ (function () {
    function RecipeItemModel() {
        this.Id = '';
        this.Name = '';
        this.Type = '';
        this.BeverageId = '';
        this.BrandId = '';
        this.FlavorIds = [];
        this.WaterSkus = [];
        this.SyrupSkus = [];
        this.FlavorSkus = [];
        this.UnAllowedFlavors = [];
        this.TopOffDelay = 0;
        this.SkuToValveMappings = [];
    }
    RecipeItemModel.prototype.areAnyValvesLockedInRecipe = function () {
        return _.find(this.SkuToValveMappings, function (item) {
            return item.valveAssignmentState.IsLocked;
        }) !== undefined;
    };
    Object.defineProperty(RecipeItemModel.prototype, "toString", {
        get: function () {
            var vlabel = "recipe:" + this.Name + "  " + this.Id;
            return vlabel;
        },
        enumerable: true,
        configurable: true
    });
    return RecipeItemModel;
}());
exports.RecipeItemModel = RecipeItemModel;
var StringKeyValuePair = /** @class */ (function () {
    function StringKeyValuePair() {
        this.key = "";
        this.value = "";
    }
    return StringKeyValuePair;
}());
exports.StringKeyValuePair = StringKeyValuePair;
var Flavor = /** @class */ (function () {
    function Flavor() {
        this.id = "";
        this.resourceId = "";
        this.name = "";
        this.pourItem = new PourItem();
        this.design = new FlavorDesign();
        this.select = new FlavorAnimation();
        this.spin = new FlavorAnimation();
    }
    return Flavor;
}());
exports.Flavor = Flavor;
var FlavorAnimation = /** @class */ (function () {
    function FlavorAnimation() {
        this.asset = "";
        this.width = 0;
        this.height = 0;
        this.frames = 0;
        this.fps = 0;
        this.scale = 0;
    }
    return FlavorAnimation;
}());
exports.FlavorAnimation = FlavorAnimation;
var FlavorDesign = /** @class */ (function () {
    function FlavorDesign() {
        this.textColor = "";
        this.textSelectedColor = "";
        this.backgroundColor = "";
        this.alphaDisabled = "";
        this.pourItem = new PourItem();
    }
    return FlavorDesign;
}());
exports.FlavorDesign = FlavorDesign;
var ResourceItem = /** @class */ (function () {
    function ResourceItem() {
        this.name = "";
        this.url = "";
    }
    return ResourceItem;
}());
exports.ResourceItem = ResourceItem;
var IdleState = /** @class */ (function () {
    function IdleState() {
        this.videos = [];
        this.loop = false;
        this.delayHome = 0;
        this.delayBrand = 0;
        this.colorLight = "";
    }
    return IdleState;
}());
exports.IdleState = IdleState;
var PourableDesign = /** @class */ (function () {
    function PourableDesign() {
        this.id = '';
        this.pourItem = new PourItem();
        this.recipeId = '';
        this.name = '';
        this.flavors = [];
        this.group = '';
        this.design = new DesignNode();
        this.CalorieCups = [];
        this.Weighting = 0;
    }
    return PourableDesign;
}());
exports.PourableDesign = PourableDesign;
var ApiResult = /** @class */ (function () {
    function ApiResult() {
        this.success = true;
        this.message = "";
        this.details = [];
        this.url = "";
    }
    return ApiResult;
}());
exports.ApiResult = ApiResult;
var DesignSecondaryAnimation = /** @class */ (function () {
    function DesignSecondaryAnimation() {
        this.animationId = "";
        this.alpha = 1;
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
    }
    return DesignSecondaryAnimation;
}());
exports.DesignSecondaryAnimation = DesignSecondaryAnimation;
var DesignNode = /** @class */ (function () {
    function DesignNode() {
        this.assets = new DesignAssets();
        this.alphaCarbonation = 0;
        this.colors = new DesignColors();
        this.particlesHome = new DesignParticles();
        this.particlesBrand = [];
        this.secondaryAnimation = new DesignSecondaryAnimation();
        this.secondaryAnimationAda = new DesignSecondaryAnimation();
        this.secondaryAnimation_5 = new DesignSecondaryAnimation();
        this.secondaryAnimationAda_5 = new DesignSecondaryAnimation();
    }
    return DesignNode;
}());
exports.DesignNode = DesignNode;
var DesignAssets = /** @class */ (function () {
    function DesignAssets() {
        this.logoHome = '';
        this.logoBrand = '';
        this.gradient = '';
        this.liquidIntro = '';
        this.liquidIdle = '';
        this.liquidBackground = '';
    }
    return DesignAssets;
}());
exports.DesignAssets = DesignAssets;
var DesignColors = /** @class */ (function () {
    function DesignColors() {
        this.strokeHome = '';
        this.animationLight = '';
        this.animationDark = '';
        this.messageTitle = '#99ffffff';
        this.messageSubtitle = '#99000000';
    }
    return DesignColors;
}());
exports.DesignColors = DesignColors;
var DesignParticles = /** @class */ (function () {
    function DesignParticles() {
        this.colors = [];
        this.opacity = new DesignOpacity();
    }
    return DesignParticles;
}());
exports.DesignParticles = DesignParticles;
var DesignParticlesBrand = /** @class */ (function () {
    function DesignParticlesBrand() {
        this.color = '';
        this.opacityMin = 0;
        this.opacityMax = 0;
        this.frequency = 1;
        this.colorVariation = 0;
    }
    return DesignParticlesBrand;
}());
exports.DesignParticlesBrand = DesignParticlesBrand;
var DesignOpacity = /** @class */ (function () {
    function DesignOpacity() {
        this.from = 0;
        this.to = 0;
    }
    return DesignOpacity;
}());
exports.DesignOpacity = DesignOpacity;
var PourItemModel = /** @class */ (function () {
    function PourItemModel() {
        this.brands = [];
        this.waters = [];
        this.topCombinations = [];
        this.flavors = [];
        this.curatedMixes = [];
        this.homeMenu = [];
    }
    return PourItemModel;
}());
exports.PourItemModel = PourItemModel;
var PourItem = /** @class */ (function () {
    function PourItem() {
        this.id = '';
        this.pourConfigurationId = '';
        this.label = '';
        this.isDisabled = false;
        this.brandId = '';
        this.flavorIds = [];
    }
    return PourItem;
}());
exports.PourItem = PourItem;
var Bubbles = /** @class */ (function () {
    function Bubbles() {
        this.asset = '';
        this.width = 0;
        this.height = 0;
        this.frames = 0;
        this.fps = 0;
        this.scale = 1;
    }
    return Bubbles;
}());
exports.Bubbles = Bubbles;
var CalorieCountState = /** @class */ (function () {
    function CalorieCountState() {
        this.IsToggleButtonEnabled = false;
        this.CalorieCups = [];
    }
    return CalorieCountState;
}());
exports.CalorieCountState = CalorieCountState;
var CalorieCup = /** @class */ (function () {
    function CalorieCup() {
        this.CupName = '';
        this.QtyInOunces = 0;
        this.QtyInMilliliters = 0;
        this.MetricLabel = '';
        this.NonMetricLabel = '';
        this.Line1Label = '';
        this.Line2Label = '';
    }
    return CalorieCup;
}());
exports.CalorieCup = CalorieCup;
var DesignAnimation = /** @class */ (function () {
    function DesignAnimation() {
        this.id = '';
        this.image = '';
        this.frameWidth = 0;
        this.frameHeight = 0;
        this.frames = 0;
        this.smoothing = '';
        this.fps = 0;
        this.scale = 1;
        this.format = 0;
    }
    return DesignAnimation;
}());
exports.DesignAnimation = DesignAnimation;
var ItemStateInfo = /** @class */ (function () {
    function ItemStateInfo() {
        this.ItemType = '';
        this.Description = '';
    }
    return ItemStateInfo;
}());
exports.ItemStateInfo = ItemStateInfo;
var OutOfOrderEventArgs = /** @class */ (function () {
    function OutOfOrderEventArgs() {
        this.Items = [];
        this.isOutOfOrder = false;
    }
    return OutOfOrderEventArgs;
}());
exports.OutOfOrderEventArgs = OutOfOrderEventArgs;
var SetCuratedMixItem = /** @class */ (function () {
    function SetCuratedMixItem() {
        this.Id = '';
        this.RecipeId = '';
    }
    return SetCuratedMixItem;
}());
exports.SetCuratedMixItem = SetCuratedMixItem;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVuaXZlcnNhbC9hcHAudHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSwwQkFBNEI7QUFHNUIseUNBQXlDO0FBQ3pDO0lBQUE7SUFlQSxDQUFDO0lBQUQsdUJBQUM7QUFBRCxDQWZBLEFBZUMsSUFBQTtBQWZZLDRDQUFnQjtBQWtCN0I7SUFBQTtJQVNBLENBQUM7SUFBRCxrQkFBQztBQUFELENBVEEsQUFTQyxJQUFBO0FBVFksa0NBQVc7QUF1QnhCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E4Qkc7QUFFSCxXQUFXO0FBQ1g7SUFBQTtJQUdBLENBQUM7SUFBRCxjQUFDO0FBQUQsQ0FIQSxBQUdDLElBQUE7QUFIWSwwQkFBTztBQVFwQjtJQUFBO0lBRUEsQ0FBQztJQURRLG9CQUFNLEdBQUcsR0FBRyxDQUFFO0lBQ3ZCLG9CQUFDO0NBRkQsQUFFQyxJQUFBO0FBRlksc0NBQWE7QUFPMUI7SUFBQTtJQUVBLENBQUM7SUFBRCxxQkFBQztBQUFELENBRkEsQUFFQyxJQUFBO0FBRlksd0NBQWM7QUFnQjNCLGdFQUFnRTtBQUNoRSw2QkFBNkI7QUFDN0I7SUFBQTtJQVFBLENBQUM7SUFBRCxrQkFBQztBQUFELENBUkEsQUFRQyxJQUFBO0FBUlksa0NBQVc7QUFVeEI7SUFLRSxrQkFBWSxJQUFZLEVBQUUsRUFBVTtRQUNsQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBRTtRQUNsQixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBRTtJQUNoQixDQUFDO0lBQ0gsZUFBQztBQUFELENBVEEsQUFTQyxJQUFBO0FBVFksNEJBQVE7QUFZckI7SUFDRSxvQkFBbUIsTUFBYyxFQUFTLFVBQWtCLEVBQVMsS0FBZ0IsRUFBUyxRQUFpQjtRQUE1RixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVMsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUFTLFVBQUssR0FBTCxLQUFLLENBQVc7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFTO0lBQy9HLENB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LEdBQUcsRUFBRSxDQUFDO0lBQ2xCLENBQUM7SUFBRCxpQkFBQztBQUFELENBUkEsQUFRQyxJQUFBO0FBUlksZ0NBQVU7QUFVdkI7SUFBQTtRQUNFLE9BQUUsR0FBRyxFQUFFLENBQUU7UUFDVCxVQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ1gsZUFBVSxHQUFHLENBQUMsQ0FBQztRQUNmLGdCQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLFdBQU0sR0FBRyxDQUFDLENBQUM7UUFDWCxjQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ2YsUUFBRyxHQUFHLENBQUMsQ0FBQztRQUNSLFVBQUssR0FBRyxDQUFDLENBQUM7UUFDVixXQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUFELHNCQUFDO0FBQUQsQ0FWQSxBQVVDLElBQUE7QUFWWSwwQ0FBZTtBQVk1QjtJQUFBO1FBQ0UsYUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNkLGdCQUFXLEdBQUcsRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFBRCxvQkFBQztBQUFELENBSEEsQUFHQyxJQUFBO0FBSFksc0NBQWE7QUFLMUI7SUFBQTtRQUNFLFVBQUssR0FBcUIsRUFBRSxDQUFDO1FBQzdCLGlCQUFZLEdBQUcsS0FBSyxDQUFFO0lBQ3hCLENBQUM7SUFBRCwwQkFBQztBQUFELENBSEEsQUFHQyxJQUFBO0FBSFksa0RBQW1CO0FBS2hDO0lBQUE7UUFDRSxPQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ1IsYUFBUSxHQUFHLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBQUQsd0JBQUM7QUFBRCxDQUhBLEFBR0MsSUFBQTtBQUhZLDhDQUFpQiIsImZpbGUiOiJ1bml2ZXJzYWwvYXBwLnR5cGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtPYnNlcnZlcn0gZnJvbSAncnhqcy9PYnNlcnZlcic7XG5pbXBvcnQge0pzVXRpbH0gZnJvbSAnLi9Kc1V0aWwnO1xuaW1wb3J0ICogYXMgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5cblxuLy8gaGFydmVzdGVkIGZyb20gc2VydmVyIHNpZGUgVVNCIHBhY2thZ2VcbmV4cG9ydCBjbGFzcyBEZXZpY2VEZXNjcmlwdG9yIHtcbiAgYkxlbmd0aDogbnVtYmVyO1xuICBiRGVzY3JpcHRvclR5cGU6IG51bWJlcjtcbiAgYmNkVVNCOiBudW1iZXI7XG4gIGJEZXZpY2VDbGFzczogbnVtYmVyO1xuICBiRGV2aWNlU3ViQ2xhc3M6IG51bWJlcjtcbiAgYkRldmljZVByb3RvY29sOiBudW1iZXI7XG4gIGJNYXhQYWNrZXRTaXplOiBudW1iZXI7XG4gIGlkVmVuZG9yOiBudW1iZXI7XG4gIGlkUHJvZHVjdDogbnVtYmVyO1xuICBiY2REZXZpY2U6IG51bWJlcjtcbiAgaU1hbnVmYWN0dXJlcjogbnVtYmVyO1xuICBpUHJvZHVjdDogbnVtYmVyO1xuICBpU2VyaWFsTnVtYmVyOiBudW1iZXI7XG4gIGJOdW1Db25maWd1cmF0aW9uczogbnVtYmVyO1xufVxuXG5cbmV4cG9ydCBjbGFzcyBTeXN0ZW1Ecml2ZVxue1xuICBkZXZpY2U6IHN0cmluZztcbiAgZGlzcGxheU5hbWU6IHN0cmluZztcbiAgZGVzY3JpcHRpb246IHN0cmluZztcbiAgcGF0aDogc3RyaW5nO1xuICByYXc6IHN0cmluZztcbiAgcHJvdGVjdGVkOiBib29sZWFuO1xuICBzeXN0ZW06IGJvb2xlYW47XG59XG5cblxuXG5leHBvcnQgaW50ZXJmYWNlIEFsbERvY0l0ZW0ge1xuICBpZDogc3RyaW5nIDtcbiAga2V5OiBzdHJpbmcgO1xuICB2YWx1ZToge1xuICAgIHJldjogc3RyaW5nO1xuICB9O1xufVxuXG5cblxuLypleHBvcnQgY2xhc3MgUHViU3ViVG9waWMge1xuXG4gIHN0YXRpYyBzdGFydFBvdXI6IHN0cmluZyA9ICdzdGFydC5wb3VyJztcbiAgc3RhdGljIGNhbmNlbFBvdXI6IHN0cmluZyA9ICdjYW5jZWwucG91cic7XG4gIHN0YXRpYyBwb3VyQ29tcGxldGU6IHN0cmluZyA9ICdwb3VyLmNvbXBsZXRlJztcblxuICBzdGF0aWMgbGVmdE5hdlRvZ2dsZVZpc2liaWxpdHk6IHN0cmluZyA9ICdsZWZ0bmF2LnRvZ2dsZS52aXNpYmlsaXR5JyA7XG4gIHN0YXRpYyBvbkxvZ2luOiBzdHJpbmcgID0gJ3VzZXIubG9naW4nICAgIDtcbiAgc3RhdGljIG9uTG9nb3V0OiBzdHJpbmcgID0gJ3VzZXIubG9nb3V0JyA7XG4gIHN0YXRpYyB0ZXN0RXZlbnQ6IHN0cmluZyAgPSAndGVzdC5ldmVudCcgO1xuXG4gIHN0YXRpYyB0ZXN0U29ja2V0U2VuZDogc3RyaW5nICA9ICd0ZXN0LnNvY2tldC5zZW5kJyA7XG5cbiAgc3RhdGljIGJ1dHRvbkdlc3R1cmU6IHN0cmluZyAgPSAnYnV0dG9uLmdlc3R1cmUnIDtcbiAgc3RhdGljIGJ1dHRvblNlbGVjdDogc3RyaW5nICA9ICdidXR0b24uc2VsZWN0JyA7XG4gIHN0YXRpYyBwb3VyU3RhcnQ6IHN0cmluZyAgPSAncG91ci5zdGFydCcgO1xuXG4gIHN0YXRpYyBwZG1EYXRhUmVhZHk6IHN0cmluZyAgPSAncHJvZHVjdC5kYXRhbW9kZWwucmVhZHknIDtcbiAgc3RhdGljIGxvZ1RvU2NyZWVuOiBzdHJpbmcgID0gJ2xvZy50by5zY3JlZW4nIDtcblxuICBzdGF0aWMgc3RhcnQ6IHN0cmluZyAgPSAnc3RhcnQnIDtcbiAgc3RhdGljIHN0b3A6IHN0cmluZyAgPSAnc3RvcCcgO1xuXG4gIHN0YXRpYyB1cGRhdGVkU2NyZWVuTWV0cmljczogc3RyaW5nICA9ICd1cGRhdGVkLnNjcmVlbi5tZXRyaWNzJyA7XG5cbiAgc3RhdGljIHNlcnZpY2VVSURhdGFSZWFkeTogc3RyaW5nID0gJ3NlcnZpY2V1aS5kYXRhLnJlYWR5JyA7XG4gIHN0YXRpYyB0ZXN0SU9Ecml2ZXIgPSBcInRlc3QuaW9kcml2ZXIuZXZlbnRcIjtcbiAgc3RhdGljIHBvcHVwRGlhbG9nID0gXCJwb3B1cC5kaWFsb2dcIjtcblxuICBzdGF0aWMgdW5pdFN0YXRlQ2hhbmdlID0gXCJ1bml0c3RhdGUuY2hhbmdlZFwiO1xufSovXG5cbi8vIG9ic29sZXRlXG5leHBvcnQgY2xhc3MgTWVzc2FnZSB7XG4gIGNvbW1hbmQ6IHN0cmluZyA7XG4gIFRpbWU6IERhdGU7XG59XG5cblxuXG5cbmV4cG9ydCBjbGFzcyBEYlJlY29yZFR5cGVzIHtcbiAgc3RhdGljIHJlY2lwZSA9ICd+JyA7XG59XG5cblxuXG5cbmV4cG9ydCBjbGFzcyBBdmFpbGFibGVSb2xlcyB7XG4gIHJvbGVzIDogc3RyaW5nW10gO1xufVxuXG4vLyB1c2VyX2lkLCBOYW1lLCBuaWNrbmFtZSwgYW5kIHBpY3R1cmVcbmV4cG9ydCBpbnRlcmZhY2UgSVVzZXJQcm9maWxlIHtcbiAgdXNlcl9pZCA6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nIDtcbiAgbmlja25hbWUgOiBzdHJpbmcgO1xuICBwaWN0dXJlIDogc3RyaW5nIDtcbiAgZW1haWwgOiBzdHJpbmcgO1xuICBnbG9iYWxfY2xpZW50X2lkIDogc3RyaW5nIDtcbiAgcm9sZXMgOiBzdHJpbmdbXSA7XG4gIHVzZXJIYW5kbGU6IHN0cmluZyA7IC8vIHN0b3JlZCBhdCBhdXRoMCwgdXNlcl9tZXRhZGF0YVxufVxuXG4vLyB3YW50IHRvIHNpbXBsZnkgd2hhdCB5b3Ugc2VlIGluIHRoZSBkZWJ1Z2dlciB0byB3aGF0IHdlIHRoaW5rXG4vLyB0aGUgdXNlciBwcm9maWxlIHNob3VsZCBiZVxuZXhwb3J0IGNsYXNzIFVzZXJQcm9maWxlIHtcbiAgdXNlcl9pZCA6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nIDtcbiAgcGljdHVyZSA6IHN0cmluZyA7XG4gIGVtYWlsIDogc3RyaW5nIDtcbiAgZ2xvYmFsX2NsaWVudF9pZCA6IHN0cmluZyA7XG4gIHJvbGVzIDogc3RyaW5nW10gO1xuICB1c2VySGFuZGxlOiBzdHJpbmcgOyAvLyBzdG9yZWQgYXQgYXV0aDAsIGFwcF9tZXRhZGF0YVxufVxuXG5leHBvcnQgY2xhc3MgTWVudUl0ZW0ge1xuICBuYW1lIDogc3RyaW5nO1xuICBpZCA6IHN0cmluZztcbiAgYWN0aW9uQ2FsbGJhY2s6IChyZXNwb25zZSkgPT4gdm9pZDtcblxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGlkOiBzdHJpbmcpe1xuICAgIHRoaXMubmFtZSA9IG5hbWUgO1xuICAgIHRoaXMuaWQgPSBpZCA7XG4gIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgU2ltcGxlVXNlciB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB1c2VySWQ6IHN0cmluZywgcHVibGljIHVzZXJIYW5kbGU6IHN0cmluZywgcHVibGljIHJvbGVzIDogc3RyaW5nW10sIHB1YmxpYyB1c2VyTmFtZSA6IHN0cmluZykge1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIEJ1dHRvblR5cGUge1xuICBzdGF0aWMgYnJhbmQgPSAnYnJhbmQnIDtcbiAgc3RhdGljIGZsYXZvciA9ICdmbGF2b3InIDtcbiAgc3RhdGljIGljZSA9ICdpY2UnIDtcbiAgc3RhdGljIHdhdGVyID0gJ3dhdGVyJyA7XG4gIHN0YXRpYyB0b3BDb21iaW5hdGlvbiA9ICd0b3Bjb21iaW5hdGlvbicgO1xuICBzdGF0aWMgYWN0aW9uID0gJ2FjdGlvbicgO1xuICBzdGF0aWMgbWl4ID0gJ21peCc7XG4gIHN0YXRpYyB2YWx2ZUFzc2lnbm1lbnQgPSAndmFsdmVBc3NpZ25tZW50JztcbiAgc3RhdGljIGFjdGlvbnBhbmVsID0gJ0FjdGlvblBhbmVsJztcbiAgc3RhdGljIHN5c3RlbXBhbmVsID0gJ1N5c3RlbVBhbmVsJztcbiAgc3RhdGljIG1hbnVhbEljZSA9ICdtYW51YWxpY2UnIDtcbiAgc3RhdGljIGF1dG9Qb3VyID0gJ2F1dG9wb3VyJyA7XG4gIHN0YXRpYyBtYW51YWxQb3VyID0gJ21hbnVhbHBvdXInIDtcbiAgc3RhdGljIHN0YXRlYnV0dG9uID0gJ3N0YXRlYnV0dG9uJyA7XG59XG5cbmV4cG9ydCBjbGFzcyBCdXR0b25TdGF0ZSB7XG4gIHN0YXRpYyBzZWxlY3RlZCA9ICdzZWxlY3RlZCcgO1xuICBzdGF0aWMgYXZhaWxhYmxlID0gJ2F2YWlsYWJsZScgO1xuICBzdGF0aWMgZGlzYWJsZWQgPSAnZGlzYWJsZWQnIDtcbiAgc3RhdGljIGhpZGRlbiA9ICdoaWRkZW4nIDtcbn1cblxuLy8gVE9ETyB3aHkgYXJlIHRoZXkgbnVtYmVycyBpbiB0aGUgQyMgYXBwP1xuZXhwb3J0IGNsYXNzIEJ1dHRvbkJlaGF2aW9yIHtcbiAgLypzdGF0aWMgbm9uZSA9IDE7XG4gIHN0YXRpYyB0YXAgPSAyO1xuICBzdGF0aWMgbG9uZ3ByZXNzID0gNDtcbiAgc3RhdGljIGNoZWNrYWJsZSA9IDg7XG4gIHN0YXRpYyBzdGF0dXMgPSAxNjtcbiAgc3RhdGljIG1vdXNlZG93bnVwID0gMzI7Ki9cbiAgc3RhdGljIG5vbmUgPSBcIm5vbmVcIjtcbiAgc3RhdGljIHRhcCA9IFwidGFwXCI7XG4gIHN0YXRpYyBsb25ncHJlc3MgPSBcImxvbmdwcmVzc1wiO1xuICBzdGF0aWMgY2hlY2thYmxlID0gXCJjaGVja2FibGVcIjtcbiAgc3RhdGljIHN0YXR1cyA9IFwic3RhdHVzXCI7XG4gIHN0YXRpYyBtb3VzZWRvd251cCA9IFwibW91c2Vkb3dudXBcIjtcbn1cblxuZXhwb3J0IGNsYXNzIEdlc3R1cmVzIHtcbiAgc3RhdGljIHNpbmdsZXRhcCA9ICdzaW5nbGV0YXAnIDtcbiAgc3RhdGljIGRvdWJsZXRhcCA9ICdkb3VibGV0YXAnIDtcbiAgc3RhdGljIHByZXNzID0gJ3ByZXNzJyA7XG4gIHN0YXRpYyBwcmVzc1VwID0gJ3ByZXNzdXAnIDtcbiAgc3RhdGljIGFsbEdlc3R1cmVzID0gJ3NpbmdsZXRhcCBkb3VibGV0YXAgcHJlc3MgcHJlc3N1cCcgO1xufVxuXG5leHBvcnQgY2xhc3MgUG91ckV2ZW50QXJncyB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBicmFuZDogQnV0dG9uTW9kZWwsIHB1YmxpYyBmbGF2b3JzIDogQnV0dG9uTW9kZWxbXSwgcHVibGljIHNlbmRlcjogbnVtYmVyKSB7XG4gICAgdGhpcy5mbGF2b3JzID0gW10gO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCdXR0b25BY3Rpb25zIHtcbiAgc3RhdGljIG1hbnVhbEljZSA9ICdtYW51YWwuaWNlJyA7XG4gIHN0YXRpYyBhdXRvUG91ciA9ICdhdXRvLnBvdXInIDtcbiAgc3RhdGljIG1hbnVhbFBvdXIgPSAnbWFudWFsLnBvdXInIDtcbiAgc3RhdGljIGNsZWFyU2VsZWN0aW9ucyA9ICdjbGVhci5zZWxlY3Rpb25zJyA7XG59XG5cbmV4cG9ydCBjbGFzcyBCdXR0b25Nb2RlbCB7XG4gIElkID0gJyc7XG4gIEFjdGlvbklkID0gJycgO1xuICBPYmplY3RJZDogbnVtYmVyIDtcbiAgV2VpZ2h0aW5nID0gMCA7XG4gIEJ1dHRvblN0YXRlIDogc3RyaW5nID0gQnV0dG9uU3RhdGUuYXZhaWxhYmxlIDtcbiAgQmliSXRlbSA9IEJpYkl0ZW1Nb2RlbCA7XG4gIFJlY2lwZUlkID0gJycgO1xuICBMYWJlbCA9ICcnIDtcbiAgUmVzb3VyY2VJZCA9IFwiXCI7XG4gIFBhdGhUb0ltYWdlID0gJycgO1xuICBQYXRoVG9CYWNrZ3JvdW5kSW1hZ2UgPSAnJyA7XG4gIFRleHRDb2xvciA9ICcnO1xuICBUZXh0U2VsZWN0ZWRDb2xvciA9ICcnO1xuICBCYWNrZ3JvdW5kQ29sb3IgPSAnJztcbiAgQnV0dG9uVHlwZSA9ICcnIDtcbiAgSXNTZWxlY3RlZCA9IGZhbHNlIDtcbiAgSXNWaXNpYmxlID0gdHJ1ZTtcbiAgSXNEaXNhYmxlZCA9IGZhbHNlO1xuICBwcmVzc09ubHkgPSBmYWxzZSA7XG4gIGdlc3R1cmUgPSAnJztcbiAgcGF5bG9hZDogYW55ID0gXCJcIjtcbiAgZmxhdm9yczogQnV0dG9uTW9kZWxbXSA9IFtdIDtcbiAgQnV0dG9uTW9kZWxMaXN0OiBCdXR0b25Nb2RlbFtdID0gW107XG4gIGJlaGF2aW9yczogc3RyaW5nW10gPSBbXSA7XG4gIFRhZzogYW55IDtcbiAgRm9vdGVyQ29sb3IgPSBcIlwiO1xuICBGb290ZXJGb250Q29sb3IgPSBcIlwiO1xuICBGb290ZXJUZXh0ID0gXCJcIjtcbiAgRm9vdGVySWNvbiA9IFwiXCI7XG4gIFJvd051bWJlciA9IFwiXCI7XG4gIExlZ2FjeVZhbHZlcyA9IFwiXCI7XG4gIFVuaXRUeXBlcyA9IFwiXCI7XG4gIGdldCBwYXRoVG9CYWNrR3JvdW5kSW1hZ2VBc1VybCgpIHtcbiAgICBjb25zdCBvdXRsaW5lID0gJ3VybCgnICsgdGhpcy5QYXRoVG9CYWNrZ3JvdW5kSW1hZ2UgKyAnKScgO1xuICAgIHJldHVybiBvdXRsaW5lIDtcbiAgfVxuICBnZXQgaXNUYXBPbmx5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAodGhpcy5iZWhhdmlvcnMuaW5kZXhPZigndGFwJykgPiAtMSAmJiB0aGlzLmJlaGF2aW9ycy5sZW5ndGggPT0gMSkgO1xuICB9XG4gIGdldCBpc1ByZXNzT25seSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKHRoaXMuYmVoYXZpb3JzLmluZGV4T2YoJ3ByZXNzJykgPiAtMSAmJiB0aGlzLmJlaGF2aW9ycy5sZW5ndGggPT0gMSkgO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCdXR0b25Nb2RlbExpc3Qge1xuICBXYXRlclR5cGU6IEJ1dHRvbk1vZGVsW10gPSBbXTtcbiAgRmxhdm9yVHlwZTogQnV0dG9uTW9kZWxbXSA9IFtdO1xuICBTeXJ1cFR5cGU6IEJ1dHRvbk1vZGVsW10gPSBbXTtcbiAgQWxsVHlwZXM6IEJ1dHRvbk1vZGVsW10gPSBbXTtcbn1cblxuZXhwb3J0IGNsYXNzIFVuaXRDb25maWd1cmF0aW9uTW9kZWwge1xuICBJZDogc3RyaW5nID0gJyc7XG4gIFVuaXROYW1lOiBzdHJpbmcgPSAnJztcbiAgVW51c2VkVmFsdWVzOiBudW1iZXJbXTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgVmFsdmVMYXlvdXQ6IFZhbHZlQ29uZmlndXJhdGlvblJvd1tdLCBwdWJsaWMgQWxsVmFsdmVMYWJlbFBhaXJzOiBWYWx2ZUxhYmVsUGFpcltdKSB7XG5cbiAgfVxufVxuZXhwb3J0IGNsYXNzIFVuaXRUeXBlcyB7XG4gIHN0YXRpYyBTcGlyZTIgPSBcIlNwaXJlMlwiO1xuICBzdGF0aWMgU3BpcmUyQ3JldyA9IFwiU3BpcmUyQ3Jld1wiO1xuICBzdGF0aWMgU3BpcmUzID0gXCJTcGlyZTNcIjtcbiAgc3RhdGljIFNwaXJlNDEgPSBcIlNwaXJlNDFcIjtcbiAgc3RhdGljIFNwaXJlNSA9IFwiU3BpcmU1XCI7XG4gIHN0YXRpYyBEcml2ZVRocnUgPSBcIlNwaXJlNlwiO1xufVxuZXhwb3J0IGNsYXNzIFZhbHZlQ29uZmlndXJhdGlvblJvdyB7XG4gIFJvd051bWJlcjogbnVtYmVyID0gLTE7XG4gIFZhbHZlTGFiZWxQYWlyOiBWYWx2ZUxhYmVsUGFpcltdID0gW107XG59XG5cbmV4cG9ydCBjbGFzcyBWYWx2ZUxhYmVsUGFpciB7XG4gIFZhbHZlTnVtYmVyOiBudW1iZXIgPSAtMTtcbiAgU29ydFZhbHZlTnVtYmVyOiBudW1iZXIgPSAwO1xuICBMYWJlbDogc3RyaW5nID0gJyc7XG4gIEJhbms6IG51bWJlciA9IDA7XG4gIFdlaWdodGluZzogbnVtYmVyID0gMDtcbiAgUm93OiBudW1iZXIgPSAwO1xuXG4gIGdldCB2YWx2ZUxhYmVsKCkge1xuICAgIGNvbnN0IHZsYWJlbCA9IHRoaXMuTGFiZWwgKyBcIiAtIFZcIiArIHRoaXMuVmFsdmVOdW1iZXI7XG5cbiAgICByZXR1cm4gdmxhYmVsO1xuICB9XG59XG5cbi8vIHVzZXJfaWQsIE5hbWUsIG5pY2tuYW1lLCBhbmQgcGljdHVyZVxuZXhwb3J0IGludGVyZmFjZSBEcml2ZVRocnVEYXRhIHtcbiAgb2JqZWN0SWQgOiBudW1iZXIgO1xuICBicmFuZHMgOiBCdXR0b25Nb2RlbFtdO1xuICBmbGF2b3JzOiBCdXR0b25Nb2RlbFtdO1xuICB3YXRlcnM6ICBCdXR0b25Nb2RlbFtdO1xuICB0b3BDb21iaW5hdGlvbnM6IEJ1dHRvbk1vZGVsW10gO1xuICBhY3Rpb25zOiBCdXR0b25Nb2RlbFtdIDtcbiAgY3VyYXRlZE1peGVzOiBCdXR0b25Nb2RlbFtdO1xufVxuXG5leHBvcnQgY2xhc3MgUERNRGF0YUFyZyB7XG4gIGNvbnN0cnVjdG9yIChwdWJsaWMgcGRtdHlwZTogc3RyaW5nLCBwdWJsaWMgZGF0YTogYW55KSB7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBETURhdGFUeXBlIHtcbiAgc3RhdGljIGRyaXZlVGhydURhdGEgPSAnZHJpdmVUaHJ1RGF0YSc7XG4gIHN0YXRpYyBzZXJ2aWNlVUlEYXRhID0gJ3NlcnZpY2VVSURhdGEnO1xufVxuXG5leHBvcnQgY2xhc3MgQnV0dG9uRXZlbnRBcmdzIHtcbiAgY29uc3RydWN0b3IocHVibGljIGdlc3R1cmU6IHN0cmluZywgcHVibGljIGJ1dHRvbk1vZGVsOiBCdXR0b25Nb2RlbCwgcHVibGljIGNvbnN1bWVyT2JqZWN0SWQ6IG51bWJlcikge1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQb3VyRGF0YSB7XG4gIC8vIE9iamVjdElkIG9mIHNlbmRlclxuICBzZW5kZXIgOiBudW1iZXIgO1xuXG4gIHJlY2lwZUlkIDogc3RyaW5nICA7XG4gIHF0eSA9IDAgO1xuICBwb3VyRXZlbnRBcmdzIDogUG91ckV2ZW50QXJncyA7XG59XG5cblxuZXhwb3J0IGNsYXNzIEJ1dHRvblNldCB7XG4gIHN0YXRpYyB0b3BDb21iaW5hdGlvbiA9ICd0b3BDb21iaW5hdGlvbicgO1xuICBzdGF0aWMgYnJhbmQgPSAnYnJhbmQnIDtcbiAgc3RhdGljIGZsYXZvciA9ICdmbGF2b3InIDtcbiAgc3RhdGljIHdhdGVyID0gJ3dhdGVyJyA7XG4gIHN0YXRpYyBpY2UgPSAnaWNlJyA7XG4gIHN0YXRpYyBhY3Rpb24gPSAnYWN0aW9uJyA7XG4gIHN0YXRpYyBtaXggPSAnbWl4Jztcbn1cblxuZXhwb3J0IGNsYXNzIFNjcmVlbk1ldHJpY3Mge1xuICBzaXplOiBudW1iZXIgO1xuICBhc3BlY3Q6IHN0cmluZyA7XG4gIHJlc29sdXRpb246IHN0cmluZyA7XG4gIGhlaWdodEluY2g6IG51bWJlciA7XG4gIHdpZHRoSW5jaDogbnVtYmVyIDtcbiAgaGVpZ2h0UHg6IG51bWJlciA7XG4gIHdpZHRoUHg6IG51bWJlciA7XG4gIGhlaWdodFB4QXNDU1M6IHN0cmluZyA7XG4gIHdpZHRoUHhBc0NTUzogc3RyaW5nIDtcbiAgZmFjdG9yUHg6IG51bWJlciA7XG4gIHNob3dTZWN0aW9uVGl0bGVzIDogYm9vbGVhbiA7XG4gIHRvcENvbWJpbmF0aW9uV2lkdGggOiBzdHJpbmcgO1xuICB0b3BDb21iaW5hdGlvbkhlaWdodCA6IHN0cmluZyA7XG4gIG1peFdpZHRoIDogc3RyaW5nO1xuICBtaXhIZWlnaHQgOiBzdHJpbmc7XG4gIGJyYW5kUGFuZWxXaWR0aDogc3RyaW5nIDtcbiAgYnJhbmRQYW5lbEhlaWdodDogc3RyaW5nIDtcbiAgZmxhdm9yUGFuZWxXaWR0aDogc3RyaW5nIDtcbiAgZmxhdm9yUGFuZWxIZWlnaHQ6IHN0cmluZyA7XG4gIHdhdGVyUGFuZWxXaWR0aDogc3RyaW5nIDtcbiAgd2F0ZXJQYW5lbEhlaWdodDogc3RyaW5nIDtcbiAgYWN0aW9uUGFuZWxXaWR0aDogc3RyaW5nIDtcbiAgYWN0aW9uUGFuZWxIZWlnaHQ6IHN0cmluZyA7XG4gIGJ1dHRvblNpemU6IHN0cmluZyA7XG4gIGJ1dHRvblNpemVGbGF2b3JTaG90czogc3RyaW5nIDtcbiAgZmxhdm9yT25Ub3BDb21iaW5hdGlvblNpemU6IHN0cmluZyA7XG4gIHNob3dMYWJlbHNPblNlY3Rpb25zOiBib29sZWFuIDtcbiAgYWN0aW9uQnV0dG9uV2lkdGg6IHN0cmluZyA7XG4gIGFjdGlvbkJ1dHRvbkhlaWdodDogc3RyaW5nIDtcbiAgYnV0dG9uSW1hZ2VIZWlnaHQ6IHN0cmluZztcbiAgYnV0dG9uSW1hZ2VXaWR0aDogc3RyaW5nO1xuICBicmFuZFBhbmVsV2F0ZXJQYW5lbFdpZHRoOiBzdHJpbmc7XG4gIHNlcnZpY2VBY3Rpb25CdXR0b25XaWR0aDogc3RyaW5nO1xuICBzZXJ2aWNlQWN0aW9uQnV0dG9uSGVpZ2h0OiBzdHJpbmc7XG59XG5cblxuZXhwb3J0IGNsYXNzIEJ1dHRvbkV2ZW50RGF0YSB7XG4gIC8vIHZhciBkYXRhID0ge1R5cGU6ZS5UeXBlLCBidXR0b25Nb2RlbDp0aGlzLmJ1dHRvbk1vZGVsLCBUYWc6ZX0gO1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdHlwZTogc3RyaW5nLCBwdWJsaWMgYnV0dG9uTW9kZWwgOiBCdXR0b25Nb2RlbCwgcHVibGljIHZpZXdNb2RlbE9iamVjdElkLCBwdWJsaWMgdGFnPzogYW55KSB7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFwcENvbmZpZyB7XG4gIHByb2R1Y3Rpb24gPSBmYWxzZSA7XG4gIHNpdGVOYW1lID0gXCJcIiA7XG4gIGVudmZpbGUgPSBcIlwiIDtcbiAgZGJCYWNrdXBBY2NvdW50VXJsUHJlZml4OiBzdHJpbmcgPSBcIlwiIDtcbiAgcmVtb3RlRGJVcmxQcmVmaXg6ICBzdHJpbmcgPSBcIlwiIDtcbiAgcmVtb3RlRGJVc2VyRGJQcmVmaXg6IHN0cmluZyA9IFwiXCIgO1xuICBjb21tb25EYlVybDogc3RyaW5nID0gXCJcIiA7XG4gIHVzZXJEYlVybDogc3RyaW5nID0gXCJcIjtcblxuICAvLyB0aGVzZSBhcmUgYnVpbHRcbiAgY29tbW9uRGJOYW1lOiBzdHJpbmcgPSBcIlwiIDtcbiAgdXNlckRiTmFtZTogc3RyaW5nID0gXCJcIiA7XG4gIHVzZXJEYlByZWZpeDogc3RyaW5nID0gXCJcIiA7XG4gIHNlcnZlclBvcnQ6IHN0cmluZyA9IFwiXCIgO1xuICBzb2NrZXRQb3J0OiBzdHJpbmcgPSBcIlwiIDtcbiAgc2l0ZUljb25QYXRoOiBzdHJpbmcgPSBcIlwiO1xuXG4gIHZlcnNpb246IHN0cmluZyA9IGBWMWA7XG4gIGNvbnRhY3RVc0F0RW1haWw6IHN0cmluZyA9IFwiamVmZkBvbGRwcm9ncmFtbWVyLmlvXCI7XG4gIGFwaVVybHM6IGFueSA9IHt9O1xuICBzZXJ2ZXJIb3N0ID0gXCJcIjtcbn1cblxuXG5cbmV4cG9ydCBjbGFzcyBQb3VyRXZlbnREYXRhIHtcbiAgcG91ck1vZGU6IHN0cmluZyA7XG5cblxufVxuXG5leHBvcnQgY2xhc3MgUG91ck1vZGUge1xuICBzdGF0aWMgb3B0aWZpbGwgPSBcIm9wdGlmaWxsXCIgO1xuICBzdGF0aWMgdGltZWRQb3VyID0gJ3RpbWVkUG91cicgO1xuICBzdGF0aWMgaXNCcml4ID0gJ2lzQnJpeCcgO1xuICBzdGF0aWMgbWFudWFsUG91ciA9ICdtYW51YWxQb3VyJyA7XG59XG5cbmV4cG9ydCBjbGFzcyBVSUN1c3RvbWl6YXRpb25TdGF0ZSB7XG4gIE92ZXJyaWRlTmFtZTogc3RyaW5nID0gXCJcIjtcbiAgQXR0cmFjdExvb3BOYW1lOiBzdHJpbmcgPSBcIlwiO1xufVxuXG5cblxuZXhwb3J0IGNsYXNzIFZhbHZlRmxvd1JhdGVzU3RhdGUge1xuICBIaWdoU3RpbGxGbG93UmF0ZTogbnVtYmVyID0gMC4wO1xuICBMb3dTdGlsbEZsb3dSYXRlOiBudW1iZXIgPSAwLjA7XG4gIEhpZ2hDYXJiRmxvd1JhdGU6IG51bWJlciA9IDAuMDtcbiAgTG93Q2FyYkZsb3dSYXRlOiBudW1iZXIgPSAwLjA7XG4gIEZsYXZvclNob3RGbG93UmF0ZTogbnVtYmVyID0gMC4wO1xufVxuXG5leHBvcnQgY2xhc3MgVmFsdmVBc3NpZ25tZW50IHtcbiAgQXNzaWdubWVudHM6IFZhbHZlQXNzaWdubWVudFN0YXRlW10gPSBbXTtcbn1cblxuZXhwb3J0IGNsYXNzIFZhbHZlQXNzaWdubWVudFN0YXRlIHtcbiAgVmFsdmVJZCA9IFwiXCI7XG4gIEJpYkl0ZW1Bc0J1dHRvbk1vZGVsOiBCdXR0b25Nb2RlbDtcbiAgU0tVID0gXCJcIiA7XG4gIElzTG9ja2VkID0gZmFsc2UgO1xuICBJc0hpZ2hZaWVsZCA9IGZhbHNlIDtcblxuICBnZXQgaXNBc3NpZ25lZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5TS1UubGVuZ3RoID4gMCA7XG4gIH1cbiAgVmFsdmVMYWJlbFBhaXI6IFZhbHZlTGFiZWxQYWlyID0gbmV3IFZhbHZlTGFiZWxQYWlyKCk7XG5cbiAgdW5Bc3NpZ25WYWx2ZSgpIHtcbiAgICB0aGlzLkJpYkl0ZW1Bc0J1dHRvbk1vZGVsID0gbnVsbCA7XG4gICAgdGhpcy5TS1UgPSBcIlwiO1xuICB9XG5cbiAgYXNzaWduVmFsdmUoc2t1OiBzdHJpbmcsIGJpYkl0ZW06IEJ1dHRvbk1vZGVsKSB7XG4gICAgdGhpcy5TS1UgPSBza3UgO1xuICAgIHRoaXMuQmliSXRlbUFzQnV0dG9uTW9kZWwgPSBiaWJJdGVtIDtcbiAgfVxuXG59XG5cbmV4cG9ydCBjbGFzcyBNaXhvbG9neVN0YXRlTW9kZWwge1xuICBWZXJzaW9uIDogc3RyaW5nIDtcbiAgTWl4ZXMgOiBCdXR0b25Nb2RlbFtdID0gW107XG59XG5cbmV4cG9ydCBjbGFzcyBCaWJJdGVtVHlwZSB7XG4gIHN0YXRpYyBmbGF2b3JzaG90ID0gXCJGbGF2b3JTaG90XCIgO1xuICBzdGF0aWMgY2FyYndhdGVyID0gXCJDYXJiV2F0ZXJcIiA7XG4gIHN0YXRpYyBzdGlsbHdhdGVyID0gXCJTdGlsbFdhdGVyXCIgO1xuICBzdGF0aWMgc3lydXAgPSBcIlN5cnVwXCIgO1xufVxuXG5leHBvcnQgY2xhc3MgQ291bnRyeUxhbmd1YWdlQ3VzdG9tZXJNb2RlbCB7XG4gIENvdW50cnk6IHN0cmluZztcbiAgTGFuZ3VhZ2U6IHN0cmluZztcbiAgQ3VzdG9tZXI6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIEJpYkl0ZW1Nb2RlbCB7XG4gIEJpYnNpemUgPSAnJztcbiAgRGVzY3JpcHRpb24gPSAnJztcbiAgTWl4UmF0aW8gPSAnJztcbiAgTmFtZSA9ICcnO1xuICBBbHROYW1lID0gJyc7XG4gIFNLVSA9ICcnO1xuICBDYWxvcmllc1Blck96ID0gMDtcbiAgVHlwZTogQmliSXRlbVR5cGUgPSBuZXcgQmliSXRlbVR5cGUoKTtcbiAgQ291bnRyeUxhbmd1YWdlQ3VzdG9tZXJzOiBDb3VudHJ5TGFuZ3VhZ2VDdXN0b21lck1vZGVsW10gPSBbXTtcblxuICBJc0xvY2tlZCA9IGZhbHNlO1xuICBJc0hpZ2hZaWVsZCA9IGZhbHNlO1xuICBJc0Fzc2lnbmVkID0gdHJ1ZTtcblxuICBnZXQgdG9TdHJpbmcoKSB7XG4gICAgY29uc3QgdmxhYmVsID0gdGhpcy5TS1UgKyBcIiAtIFwiICsgdGhpcy5EZXNjcmlwdGlvbjtcblxuICAgIHJldHVybiB2bGFiZWw7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNlcnZpY2VVSU1vZGVsIHtcbiAgVmVyc2lvbjogc3RyaW5nIDtcbiAgQWN0aW9uUGFuZWw6IEJ1dHRvbk1vZGVsW10gPSBbXTtcbiAgU3lzdGVtUGFuZWw6IEJ1dHRvbk1vZGVsW10gPSBbXTtcbn1cblxuZXhwb3J0IGNsYXNzIFNlcnZpY2VVSVBvcHVwQnV0dG9uc01vZGVsIHtcbiAgVmVyc2lvbjogc3RyaW5nO1xuICBTZXJ2aWNlTGFuZ3VhZ2VzOiBCdXR0b25Nb2RlbFtdID0gW107XG4gIENvbnN1bWVyTGFuZ3VhZ2VzOiBCdXR0b25Nb2RlbFtdID0gW107XG4gIE1hY2hpbmVTdGF0dXM6IEJ1dHRvbk1vZGVsW10gPSBbXTtcbiAgVW5pdFR5cGU6IEJ1dHRvbk1vZGVsW10gPSBbXTtcbiAgVW5pdExvY2F0aW9uOiBCdXR0b25Nb2RlbFtdID0gW107XG4gIE1vZGVtQ29ubmVjdGl2aXR5OiBCdXR0b25Nb2RlbFtdID0gW107XG4gIFNodXRkb3duT3B0aW9uczogQnV0dG9uTW9kZWxbXSA9IFtdO1xuICBSZWNpcGVzOiBCdXR0b25Nb2RlbFtdID0gW107XG4gIEJpYkl0ZW1UeXBlczogQnV0dG9uTW9kZWxbXSA9IFtdO1xuICBEaXNwbGF5T2ZmT3B0aW9uczogQnV0dG9uTW9kZWxbXSA9IFtdO1xuICBDbGVhbkRpc3BsYXlPcHRpb25zOiBCdXR0b25Nb2RlbFtdID0gW107XG4gIEZsb3dSYXRlczogQnV0dG9uTW9kZWxbXSA9IFtdO1xuICBWYWx2ZUxvY2tPcHRpb25zOiBCdXR0b25Nb2RlbFtdID0gW107XG4gIENoYW5nZVZhbHVlTWVudU9wdGlvbnM6IEJ1dHRvbk1vZGVsW10gPSBbXTtcbiAgUHJpbWluZzogQnV0dG9uTW9kZWxbXSA9IFtdO1xuICBWYWx2ZVByaW1pbmc6IEJ1dHRvbk1vZGVsW10gPSBbXTtcbiAgQnJpeDogQnV0dG9uTW9kZWxbXSA9IFtdO1xuICBDb25maWd1cmVTZWxlY3Rpb25UaW1lb3V0OiBCdXR0b25Nb2RlbFtdID0gW107XG4gIEVxdWlwbWVudFN0YXR1czogQnV0dG9uTW9kZWxbXSA9IFtdO1xuICBTRU5EaWFnbm9zdGljczogQnV0dG9uTW9kZWxbXSA9IFtdO1xuICBTRU5EaWFnbm9zdGljc0VxdWlwbWVudFNlcmlhbDogQnV0dG9uTW9kZWxbXSA9IFtdO1xuICBTRU5EaWFnbm9zdGljc1JlZnJlc2g6IEJ1dHRvbk1vZGVsW10gPSBbXTtcbiAgQ29uZmlybUJ1dHRvbnM6IEJ1dHRvbk1vZGVsW10gPSBbXTtcbn1cblxuZXhwb3J0IGNsYXNzIExlZ2FjeVZhbHZlTW9kZWwge1xuICBMZWdhY3lWYWx2ZXM6IEJ1dHRvbk1vZGVsW10gPSBbXTtcbn1cblxuZXhwb3J0IGNsYXNzIFBlcm1pc3Npb25zTW9kZWwge1xuICBWZXJzaW9uOiBzdHJpbmc7XG4gIFJvbGVzOiBSb2xlUGVybWlzc2lvbltdID0gW107XG59XG5cbmV4cG9ydCBjbGFzcyBSb2xlUGVybWlzc2lvbiB7XG4gIFJvbGU6IFJvbGU7XG4gIEFjdGlvblBlcm1pc3Npb25zOiBzdHJpbmdbXSA9IFtdO1xuICBBdXRoSWQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGVudW0gUm9sZSB7XG4gIE5vbmUgPSAwLCBDcmV3LCBNRU0sIE1hbmFnZXIsIFN1cHBvcnQsIFN1cGVyXG59XG5cbmV4cG9ydCBjbGFzcyBVSUN1c3RvbWl6YXRpb25zTW9kZWwge1xuICBWZXJzaW9uOiBzdHJpbmc7XG4gIE92ZXJyaWRlczogT3ZlcnJpZGVNb2RlbFtdO1xufVxuXG5leHBvcnQgY2xhc3MgT3ZlcnJpZGVNb2RlbCB7XG4gIE5hbWU6IHN0cmluZztcbiAgUGF0aDogc3RyaW5nO1xuICBDb3VudHJpZXM6IHN0cmluZ1tdO1xuICBBdHRyYWN0TG9vcHM6IEF0dHJhY3RMb29wTW9kZWxbXTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgQXR0cmFjdExvb3BzQXNCdXR0b25Nb2RlbDogQnV0dG9uTW9kZWxbXSkge1xuXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFBsYXRmb3JtTW9kZWwge1xuICB3aWR0aCA9IDA7XG4gIGhlaWdodCA9IDA7XG4gIGZyYW1lUmF0ZSA9IDA7XG4gIGhvbWVNZW51OiBQbGF0Zm9ybU1lbnVMYXlvdXQgPSBuZXcgUGxhdGZvcm1NZW51TGF5b3V0O1xuICBmbGF2b3JEaXJlY3Rpb24gPSAnJztcbiAgYnJhbmRGbGF2b3JzSW5mbzogQnJhbmRGbGF2b3JzSW5mbyA9IG5ldyBCcmFuZEZsYXZvcnNJbmZvKCk7XG4gIGxheW91dDogeyBbIGtleTogc3RyaW5nIF06IGFueSB9ID0ge307XG59XG5cblxuZXhwb3J0IGNsYXNzIEJyYW5kRmxhdm9yc0luZm8ge1xuICBmbGF2b3JUaXRsZSA9IDA7XG4gIGl0ZW1Gb250U2l6ZSA9IDA7XG4gIGl0ZW1Db3VudCA9IDA7XG4gIHRpdGxlRm9udFNpemUgPSAwO1xuICBwcmVUaXRsZUZvbnRTaXplID0gMDtcbiAgaXRlbUhlaWdodCA9IDA7XG59XG5leHBvcnQgY2xhc3MgUGxhdGZvcm1NZW51TGF5b3V0IHtcbiAgdG9wOiBzdHJpbmcgPSBcIlwiO1xuICBsZWZ0OiBzdHJpbmcgPSBcIlwiO1xuICByaWdodDogc3RyaW5nID0gXCJcIjtcbiAgYm90dG9tOiBzdHJpbmcgPSBcIlwiO1xuICBpdGVtczogUGxhdGZvcm1NZW51Q29vcmRpbmF0ZVtdID0gW107XG4gIGFkYUl0ZW1zOiBQbGF0Zm9ybU1lbnVDb29yZGluYXRlW10gPSBbXTtcbiAgYWRhTGVmdCA9IDA7XG59XG5cbmV4cG9ydCBjbGFzcyBQbGF0Zm9ybU1lbnVDb29yZGluYXRlIHtcbiAgeDogbnVtYmVyID0gMDtcbiAgeTogbnVtYmVyID0gMDtcbiAgcmFkaXVzOiBudW1iZXIgPSAwO1xufVxuXG5leHBvcnQgY2xhc3MgUGxhdGZvcm1Db29yZGluYXRlIHtcbiAgdG9wOiBzdHJpbmcgPSBcIlwiO1xuICBsZWZ0OiBzdHJpbmcgPSBcIlwiO1xuICByaWdodDogc3RyaW5nID0gXCJcIjtcbiAgYm90dG9tOiBzdHJpbmcgPSBcIlwiO1xuICB3aWR0aDogc3RyaW5nID0gXCJcIjtcbiAgaGVpZ2h0OiBzdHJpbmcgPSBcIlwiO1xufVxuXG5leHBvcnQgY2xhc3MgT3ZlcnJpZGVPcHRpb25zIHtcbiAgeG1sOiBcIlwiO1xuICBwYXRoOiBcIlwiO1xuICB2YWx1ZTogXCJcIjtcbn1cblxuZXhwb3J0IGNsYXNzIFVJVmlzdWFsc01vZGVsIHtcbiAgdmVyc2lvbjogbnVtYmVyO1xuICBicmFuZHM6IEJ1dHRvbk1vZGVsW10gPSBbXTtcbiAgdW51c2VkRmxhdm9yczogQnV0dG9uTW9kZWxbXSA9IFtdO1xuICBmbGF2b3JzOiBCdXR0b25Nb2RlbFtdID0gW107XG4gIHdhdGVyczogQnV0dG9uTW9kZWxbXSA9IFtdO1xuICB0b3BDb21iaW5hdGlvbnM6IEJ1dHRvbk1vZGVsW10gPSBbXTtcbiAgY3VyYXRlZE1peGVzOiBCdXR0b25Nb2RlbFtdID0gW107XG4gIGljZTogQnV0dG9uTW9kZWxbXSA9IFtdO1xuICBhY3Rpb25zOiBCdXR0b25Nb2RlbFtdID0gW107XG4gIHZhbHZlOiBCdXR0b25Nb2RlbFtdID0gW107XG4gIHNlbGVjdGFibGU6IEJ1dHRvbk1vZGVsW10gPSBbXTtcblxuICBnZXQgdG9TdHJpbmcoKSB7XG4gICAgY29uc3QgdmxhYmVsID0gXCJ2ZXJzaW9uOlwiICsgdGhpcy52ZXJzaW9uICsgXCIgYnJhbmRzOlwiICsgdGhpcy5icmFuZHMubGVuZ3RoICsgXCIgZmxhdm9yczpcIiArIHRoaXMuZmxhdm9ycy5sZW5ndGggKyBcIiB3YXRlcnM6XCIgKyB0aGlzLndhdGVycy5sZW5ndGg7XG5cbiAgICByZXR1cm4gdmxhYmVsO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBdHRyYWN0TG9vcE1vZGVsIHtcbiAgSXNTZWxlY3RlZDogYm9vbGVhbjtcbiAgTmFtZTogc3RyaW5nO1xuICBQYXRoOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBUb3BDb21iaW5hdGlvbk1vZGVsIHtcbiAgVG9wQ29tYmluYXRpb25zOiBCdXR0b25Nb2RlbFtdO1xufVxuXG5leHBvcnQgY2xhc3MgQ29uc3VtZXJVSUxvY2FsaXphdGlvbk1vZGVsIHtcbiAgcHJpbWFyeUxvY2FsaXphdGlvbjogTG9jYWxpemF0aW9uUmVzb3VyY2VNb2RlbCA9IG5ldyBMb2NhbGl6YXRpb25SZXNvdXJjZU1vZGVsKCk7XG4gIHNlY29uZGFyeUxvY2FsaXphdGlvbjogTG9jYWxpemF0aW9uUmVzb3VyY2VNb2RlbCA9IG5ldyBMb2NhbGl6YXRpb25SZXNvdXJjZU1vZGVsKCk7XG59XG5cbmV4cG9ydCBjbGFzcyBMb2NhbGl6YXRpb25SZXNvdXJjZU1vZGVsIHtcbiAgVmVyc2lvbiA9IFwiXCI7XG4gIENvdW50cnlMYW5ndWFnZUNvZGUgPSBcIlwiO1xuICBSZXNvdXJjZVN0cmluZ3M6IExvY2FsaXplZEl0ZW1zID0gbmV3IExvY2FsaXplZEl0ZW1zKCk7XG5cbiAgZ2V0SGFzSXRlbXMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuUmVzb3VyY2VTdHJpbmdzKS5sZW5ndGggPiAwO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBMb2NhbGl6ZWRJdGVtcyB7XG4gIC8vIGtleSB2YWx1ZSBwYWlyXG4gIC8vIHByb3BlcnR5IG5hbWUgaXMga2V5LCB2YWx1ZSBpcyBsb2NhbGl6ZWQgc3RyaW5nXG4gIFtrZXk6IHN0cmluZ106IHN0cmluZztcbn1cblxuXG5leHBvcnQgZW51bSBQcm9kdWN0SXRlbVR5cGVFbnVtIHtcbiAgRmxhdm9yLCBCcmFuZCwgTWl4LCBXYXRlclxufVxuXG5leHBvcnQgZW51bSBVSUl0ZW1PdmVycmlkZSB7XG4gIE5vbmUgPSAxLFxuICBJbWFnZUxvZ28gPSAyLFxuICBJbWFnZUxvZ29CcmFuZCA9IDQsXG4gIE1peEJldmVyYWdlID0gOCxcbiAgSW5oZXJpdEZsYXZvcnMgPSAxNlxufVxuXG5leHBvcnQgY2xhc3MgUHJvZHVjdFVJSXRlbU1vZGVsIHtcbiAgSWQ6IHN0cmluZztcbiAgTmFtZTogc3RyaW5nO1xuICBJbWFnZUxvZ286IHN0cmluZztcbiAgSW1hZ2VMb2dvQ29uc3VtZXJVSTogc3RyaW5nO1xuICBDb2xvckJhY2tncm91bmQ6IHN0cmluZztcbiAgRGVzaWduOiBzdHJpbmc7XG4gIFJlY2lwZUlkOiBzdHJpbmc7XG4gIE1peEJldmVyYWdlOiBzdHJpbmc7XG4gIE1peEZsYXZvcnM6IHN0cmluZ1tdO1xuICBGbGF2b3JzOiBzdHJpbmdbXTtcbiAgSXRlbU92ZXJyaWRlOiBVSUl0ZW1PdmVycmlkZTtcbiAgUHJvZHVjdEl0ZW1UeXBlOiBQcm9kdWN0SXRlbVR5cGVFbnVtO1xuICBDb3VudHJ5TGFuZ3VhZ2VDdXN0b21lcjogQ291bnRyeUxhbmd1YWdlQ3VzdG9tZXJNb2RlbFtdO1xuICBXZWlnaHRpbmc6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIFJlY2lwZVR5cGUge1xuICBzdGF0aWMgV2F0ZXIgPSBcIldhdGVyXCI7XG4gIHN0YXRpYyBCZXZlcmFnZSA9IFwiQmV2ZXJhZ2VcIjtcbiAgc3RhdGljIE1peCA9IFwiTWl4XCI7XG4gIHN0YXRpYyBGbGF2b3IgPSBcIkZsYXZvclwiO1xufVxuXG5leHBvcnQgY2xhc3MgUmVjaXBlSXRlbXNPd25lciB7XG4gIFZlcnNpb246IHN0cmluZztcbiAgUmVjaXBlczogUmVjaXBlSXRlbU1vZGVsW107XG59XG5cbmV4cG9ydCBjbGFzcyBSZWNpcGVTa3Uge1xuICBTa3UgPSAnJztcbiAgTmFtZSA9ICcnO1xufVxuXG5leHBvcnQgY2xhc3MgU2t1VG9WYWx2ZU1hcHBpbmcge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgc2t1OiBzdHJpbmcsIHB1YmxpYyB2YWx2ZUFzc2lnbm1lbnRTdGF0ZTogVmFsdmVBc3NpZ25tZW50U3RhdGUpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBBY3Rpb25UeXBlIHtcbiAgQWRkZWQ6IFwiYWRkXCI7XG4gIFJlbW92ZWQ6IFwicmVtb3ZlXCI7XG4gIExvY2tlZDogXCJsb2NrXCI7XG59XG5cbmV4cG9ydCBjbGFzcyBWYWx2ZUFjdGlvbiB7XG4gIEFjdGlvblR5cGU6IEFjdGlvblR5cGU7XG4gIElEOiBudW1iZXI7XG4gIFR5cGU6IHN0cmluZztcbiAgU0tVOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBJbnZlbnRvcnlNYXBwaW5nIHtcbiAgVmFsdmVBY3Rpb25zOiBWYWx2ZUFjdGlvbltdID0gW107XG4gIFZhbHZlQXNzaWdubWVudHM6IFZhbHZlQXNzaWdubWVudFtdID0gW107XG59XG5cbmV4cG9ydCBjbGFzcyBSZWNpcGVJdGVtTW9kZWwge1xuICBJZCA9ICcnO1xuICBOYW1lID0gJyc7XG4gIFR5cGUgPSAnJztcbiAgQmV2ZXJhZ2VJZCA9ICcnO1xuICBCcmFuZElkID0gJyc7XG4gIEZsYXZvcklkczogc3RyaW5nW10gPSBbXTtcbiAgV2F0ZXJTa3VzOiBzdHJpbmdbXSA9IFtdO1xuICBTeXJ1cFNrdXM6IFJlY2lwZVNrdVtdID0gW107XG4gIEZsYXZvclNrdXM6IFJlY2lwZVNrdVtdID0gW107XG4gIFVuQWxsb3dlZEZsYXZvcnM6IHN0cmluZ1tdID0gW107XG4gIFRvcE9mZkRlbGF5ID0gMDtcblxuICBTa3VUb1ZhbHZlTWFwcGluZ3M6IFNrdVRvVmFsdmVNYXBwaW5nW10gPSBbXTtcblxuICBhcmVBbnlWYWx2ZXNMb2NrZWRJblJlY2lwZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gXy5maW5kKHRoaXMuU2t1VG9WYWx2ZU1hcHBpbmdzLCBmdW5jdGlvbihpdGVtOiBTa3VUb1ZhbHZlTWFwcGluZykge1xuICAgICAgcmV0dXJuIGl0ZW0udmFsdmVBc3NpZ25tZW50U3RhdGUuSXNMb2NrZWQ7XG4gICAgfSkgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGdldCB0b1N0cmluZygpIHtcbiAgICBjb25zdCB2bGFiZWwgPSBcInJlY2lwZTpcIiArIHRoaXMuTmFtZSArIFwiICBcIiArIHRoaXMuSWQ7XG5cbiAgICByZXR1cm4gdmxhYmVsO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFN0cmluZ0tleVZhbHVlUGFpciB7XG4gIGtleSA9IFwiXCI7XG4gIHZhbHVlID0gXCJcIjtcbn1cblxuZXhwb3J0IGNsYXNzIEZsYXZvciB7XG4gIGlkID0gXCJcIjtcbiAgcmVzb3VyY2VJZCA9IFwiXCI7XG4gIG5hbWUgPSBcIlwiO1xuICBwb3VySXRlbTogUG91ckl0ZW0gPSBuZXcgUG91ckl0ZW0oKTtcbiAgZGVzaWduOiBGbGF2b3JEZXNpZ24gPSBuZXcgRmxhdm9yRGVzaWduKCk7XG4gIHNlbGVjdDogRmxhdm9yQW5pbWF0aW9uID0gbmV3IEZsYXZvckFuaW1hdGlvbigpO1xuICBzcGluOiBGbGF2b3JBbmltYXRpb24gPSBuZXcgRmxhdm9yQW5pbWF0aW9uKCk7XG59XG5cbmV4cG9ydCBjbGFzcyBGbGF2b3JBbmltYXRpb24ge1xuICBhc3NldCA9IFwiXCI7XG4gIHdpZHRoID0gMDtcbiAgaGVpZ2h0ID0gMDtcbiAgZnJhbWVzID0gMDtcbiAgZnBzID0gMDtcbiAgc2NhbGUgPSAwO1xufVxuXG5leHBvcnQgY2xhc3MgRmxhdm9yRGVzaWduIHtcbiAgdGV4dENvbG9yID0gXCJcIjtcbiAgdGV4dFNlbGVjdGVkQ29sb3IgPSBcIlwiO1xuICBiYWNrZ3JvdW5kQ29sb3IgPSBcIlwiO1xuICBhbHBoYURpc2FibGVkID0gXCJcIjtcbiAgcG91ckl0ZW06IFBvdXJJdGVtID0gbmV3IFBvdXJJdGVtKCk7XG59XG5cbmV4cG9ydCBjbGFzcyBSZXNvdXJjZUl0ZW0ge1xuICBuYW1lID0gXCJcIjtcbiAgdXJsID0gXCJcIjtcbn1cblxuZXhwb3J0IGNsYXNzIElkbGVTdGF0ZSB7XG4gIHZpZGVvczogUmVzb3VyY2VJdGVtW10gPSBbXTtcbiAgbG9vcCA9IGZhbHNlO1xuICBkZWxheUhvbWUgPSAwO1xuICBkZWxheUJyYW5kID0gMDtcbiAgY29sb3JMaWdodCA9IFwiXCI7XG59XG5cbmV4cG9ydCBjbGFzcyBQb3VyYWJsZURlc2lnbiB7XG4gIGlkID0gJyc7XG4gIHBvdXJJdGVtOiBQb3VySXRlbSA9IG5ldyBQb3VySXRlbSgpO1xuICByZWNpcGVJZCA9ICcnO1xuICBuYW1lID0gJyc7XG4gIGZsYXZvcnM6IHN0cmluZ1tdID0gW107XG4gIGdyb3VwID0gJyc7XG4gIGRlc2lnbjogRGVzaWduTm9kZSA9IG5ldyBEZXNpZ25Ob2RlKCk7XG4gIENhbG9yaWVDdXBzOiBDYWxvcmllQ3VwW10gPSBbXTtcbiAgV2VpZ2h0aW5nID0gMDtcbn1cblxuZXhwb3J0IGNsYXNzIEFwaVJlc3VsdCB7XG4gIHN1Y2Nlc3MgPSB0cnVlO1xuICBtZXNzYWdlID0gXCJcIjtcbiAgZGV0YWlsczogc3RyaW5nW10gPSBbXTtcbiAgdXJsID0gXCJcIjtcbn1cblxuZXhwb3J0IGNsYXNzIERlc2lnblNlY29uZGFyeUFuaW1hdGlvbiB7XG4gIGFuaW1hdGlvbklkOiBzdHJpbmcgPSBcIlwiO1xuICBhbHBoYTogbnVtYmVyID0gMTtcbiAgc2NhbGU6IG51bWJlciA9IDE7XG4gIG9mZnNldFg6IG51bWJlciA9IDA7XG4gIG9mZnNldFk6IG51bWJlciA9IDA7XG59XG5cbmV4cG9ydCBjbGFzcyBEZXNpZ25Ob2RlIHtcbiAgYXNzZXRzOiBEZXNpZ25Bc3NldHMgPSBuZXcgRGVzaWduQXNzZXRzKCk7XG4gIGFscGhhQ2FyYm9uYXRpb24gPSAwO1xuICBjb2xvcnM6IERlc2lnbkNvbG9ycyA9IG5ldyBEZXNpZ25Db2xvcnMoKTtcbiAgcGFydGljbGVzSG9tZTogRGVzaWduUGFydGljbGVzID0gbmV3IERlc2lnblBhcnRpY2xlcygpO1xuICBwYXJ0aWNsZXNCcmFuZDogRGVzaWduUGFydGljbGVzQnJhbmRbXSA9IFtdO1xuICBzZWNvbmRhcnlBbmltYXRpb24gPSBuZXcgRGVzaWduU2Vjb25kYXJ5QW5pbWF0aW9uKCk7XG4gIHNlY29uZGFyeUFuaW1hdGlvbkFkYSA9IG5ldyBEZXNpZ25TZWNvbmRhcnlBbmltYXRpb24oKTtcbiAgc2Vjb25kYXJ5QW5pbWF0aW9uXzUgPSBuZXcgRGVzaWduU2Vjb25kYXJ5QW5pbWF0aW9uKCk7XG4gIHNlY29uZGFyeUFuaW1hdGlvbkFkYV81ID0gbmV3IERlc2lnblNlY29uZGFyeUFuaW1hdGlvbigpO1xufVxuXG5leHBvcnQgY2xhc3MgRGVzaWduQXNzZXRzIHtcbiAgbG9nb0hvbWUgPSAnJztcbiAgbG9nb0JyYW5kID0gJyc7XG4gIGdyYWRpZW50ID0gJyc7XG4gIGxpcXVpZEludHJvID0gJyc7XG4gIGxpcXVpZElkbGUgPSAnJztcbiAgbGlxdWlkQmFja2dyb3VuZCA9ICcnIDtcbn1cblxuZXhwb3J0IGNsYXNzIERlc2lnbkNvbG9ycyB7XG4gIHN0cm9rZUhvbWUgPSAnJztcbiAgYW5pbWF0aW9uTGlnaHQgPSAnJztcbiAgYW5pbWF0aW9uRGFyayA9ICcnIDtcbiAgbWVzc2FnZVRpdGxlID0gJyM5OWZmZmZmZic7XG4gIG1lc3NhZ2VTdWJ0aXRsZSA9ICcjOTkwMDAwMDAnO1xufVxuXG5leHBvcnQgY2xhc3MgRGVzaWduUGFydGljbGVzIHtcbiAgY29sb3JzOiBzdHJpbmdbXSA9IFtdO1xuICBvcGFjaXR5OiBEZXNpZ25PcGFjaXR5ID0gbmV3IERlc2lnbk9wYWNpdHkoKTtcbn1cblxuZXhwb3J0IGNsYXNzIERlc2lnblBhcnRpY2xlc0JyYW5kIHtcbiAgY29sb3IgPSAnJztcbiAgb3BhY2l0eU1pbiA9IDA7XG4gIG9wYWNpdHlNYXggPSAwIDtcbiAgZnJlcXVlbmN5ID0gMTtcbiAgY29sb3JWYXJpYXRpb24gPSAwO1xufVxuXG5leHBvcnQgY2xhc3MgRGVzaWduT3BhY2l0eSB7XG4gIGZyb20gPSAwIDtcbiAgdG8gPSAwO1xufVxuXG5leHBvcnQgY2xhc3MgUG91ckl0ZW1Nb2RlbCB7XG4gIGJyYW5kczogUG91cmFibGVEZXNpZ25bXSA9IFtdO1xuICB3YXRlcnM6IFBvdXJhYmxlRGVzaWduW10gPSBbXSA7XG4gIHRvcENvbWJpbmF0aW9uczogUG91cmFibGVEZXNpZ25bXSA9IFtdIDtcbiAgZmxhdm9yczogRmxhdm9yRGVzaWduW10gPSBbXTtcbiAgY3VyYXRlZE1peGVzOiBQb3VyYWJsZURlc2lnbltdID0gW107XG4gIGhvbWVNZW51OiBQbGF0Zm9ybU1lbnVMYXlvdXRbXSA9IFtdO1xufVxuXG5leHBvcnQgY2xhc3MgUG91ckl0ZW0ge1xuICBpZCA9ICcnO1xuICBwb3VyQ29uZmlndXJhdGlvbklkID0gJyc7XG4gIGxhYmVsID0gJyc7XG4gIGlzRGlzYWJsZWQgPSBmYWxzZSA7XG4gIGJyYW5kSWQgPSAnJztcbiAgZmxhdm9ySWRzOiBzdHJpbmdbXSA9IFtdO1xufVxuXG5leHBvcnQgY2xhc3MgQnViYmxlcyB7XG4gIGFzc2V0ID0gJyc7XG4gIHdpZHRoID0gMDtcbiAgaGVpZ2h0ID0gMDtcbiAgZnJhbWVzID0gMDtcbiAgZnBzID0gMDtcbiAgc2NhbGUgPSAxO1xufVxuXG5leHBvcnQgY2xhc3MgQ2Fsb3JpZUNvdW50U3RhdGUge1xuICBJc1RvZ2dsZUJ1dHRvbkVuYWJsZWQgPSBmYWxzZTtcbiAgQ2Fsb3JpZUN1cHM6IENhbG9yaWVDdXBbXSA9IFtdO1xufVxuXG5leHBvcnQgY2xhc3MgQ2Fsb3JpZUN1cCB7XG4gIEN1cE5hbWUgPSAnJztcbiAgUXR5SW5PdW5jZXMgPSAwO1xuICBRdHlJbk1pbGxpbGl0ZXJzID0gMDtcbiAgTWV0cmljTGFiZWwgPSAnJztcbiAgTm9uTWV0cmljTGFiZWwgPSAnJztcbiAgTGluZTFMYWJlbCA9ICcnO1xuICBMaW5lMkxhYmVsID0gJyc7XG59XG5cbmV4cG9ydCBjbGFzcyBEZXNpZ25BbmltYXRpb24ge1xuICBpZCA9ICcnIDtcbiAgaW1hZ2UgPSAnJztcbiAgZnJhbWVXaWR0aCA9IDA7XG4gIGZyYW1lSGVpZ2h0ID0gMDtcbiAgZnJhbWVzID0gMDtcbiAgc21vb3RoaW5nID0gJyc7XG4gIGZwcyA9IDA7XG4gIHNjYWxlID0gMTtcbiAgZm9ybWF0ID0gMDtcbn1cblxuZXhwb3J0IGNsYXNzIEl0ZW1TdGF0ZUluZm8ge1xuICBJdGVtVHlwZSA9ICcnO1xuICBEZXNjcmlwdGlvbiA9ICcnO1xufVxuXG5leHBvcnQgY2xhc3MgT3V0T2ZPcmRlckV2ZW50QXJncyB7XG4gIEl0ZW1zOiBJdGVtU3RhdGVJbmZvW10gID0gW107XG4gIGlzT3V0T2ZPcmRlciA9IGZhbHNlIDtcbn1cblxuZXhwb3J0IGNsYXNzIFNldEN1cmF0ZWRNaXhJdGVtIHtcbiAgSWQgPSAnJztcbiAgUmVjaXBlSWQgPSAnJztcbn1cblxuIl19
