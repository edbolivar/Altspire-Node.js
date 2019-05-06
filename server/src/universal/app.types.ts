import {Observer} from 'rxjs/Observer';
import {JsUtil} from './JsUtil';
import * as moment from 'moment';
import * as _ from 'lodash';


// harvested from server side USB package
export class DeviceDescriptor {
  bLength: number;
  bDescriptorType: number;
  bcdUSB: number;
  bDeviceClass: number;
  bDeviceSubClass: number;
  bDeviceProtocol: number;
  bMaxPacketSize: number;
  idVendor: number;
  idProduct: number;
  bcdDevice: number;
  iManufacturer: number;
  iProduct: number;
  iSerialNumber: number;
  bNumConfigurations: number;
}


export class SystemDrive
{
  device: string;
  displayName: string;
  description: string;
  path: string;
  raw: string;
  protected: boolean;
  system: boolean;
}



export interface AllDocItem {
  id: string ;
  key: string ;
  value: {
    rev: string;
  };
}



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
export class Message {
  command: string ;
  Time: Date;
}




export class DbRecordTypes {
  static recipe = '~' ;
}




export class AvailableRoles {
  roles : string[] ;
}

// user_id, Name, nickname, and picture
export interface IUserProfile {
  user_id : string;
  name: string ;
  nickname : string ;
  picture : string ;
  email : string ;
  global_client_id : string ;
  roles : string[] ;
  userHandle: string ; // stored at auth0, user_metadata
}

// want to simplfy what you see in the debugger to what we think
// the user profile should be
export class UserProfile {
  user_id : string;
  name: string ;
  picture : string ;
  email : string ;
  global_client_id : string ;
  roles : string[] ;
  userHandle: string ; // stored at auth0, app_metadata
}

export class MenuItem {
  name : string;
  id : string;
  actionCallback: (response) => void;

  constructor(name: string, id: string){
    this.name = name ;
    this.id = id ;
  }
}


export class SimpleUser {
  constructor(public userId: string, public userHandle: string, public roles : string[], public userName : string) {
  }
}


export class ButtonType {
  static brand = 'brand' ;
  static flavor = 'flavor' ;
  static ice = 'ice' ;
  static water = 'water' ;
  static topCombination = 'topcombination' ;
  static action = 'action' ;
  static mix = 'mix';
  static valveAssignment = 'valveAssignment';
  static actionpanel = 'ActionPanel';
  static systempanel = 'SystemPanel';
  static manualIce = 'manualice' ;
  static autoPour = 'autopour' ;
  static manualPour = 'manualpour' ;
  static statebutton = 'statebutton' ;
}

export class ButtonState {
  static selected = 'selected' ;
  static available = 'available' ;
  static disabled = 'disabled' ;
  static hidden = 'hidden' ;
}

// TODO why are they numbers in the C# app?
export class ButtonBehavior {
  /*static none = 1;
  static tap = 2;
  static longpress = 4;
  static checkable = 8;
  static status = 16;
  static mousedownup = 32;*/
  static none = "none";
  static tap = "tap";
  static longpress = "longpress";
  static checkable = "checkable";
  static status = "status";
  static mousedownup = "mousedownup";
}

export class Gestures {
  static singletap = 'singletap' ;
  static doubletap = 'doubletap' ;
  static press = 'press' ;
  static pressUp = 'pressup' ;
  static allGestures = 'singletap doubletap press pressup' ;
}

export class PourEventArgs {
  constructor(public brand: ButtonModel, public flavors : ButtonModel[], public sender: number) {
    this.flavors = [] ;
  }
}

export class ButtonActions {
  static manualIce = 'manual.ice' ;
  static autoPour = 'auto.pour' ;
  static manualPour = 'manual.pour' ;
  static clearSelections = 'clear.selections' ;
}

export class ButtonModel {
  Id = '';
  ActionId = '' ;
  ObjectId: number ;
  Weighting = 0 ;
  ButtonState : string = ButtonState.available ;
  BibItem = BibItemModel ;
  RecipeId = '' ;
  Label = '' ;
  ResourceId = "";
  PathToImage = '' ;
  PathToBackgroundImage = '' ;
  TextColor = '';
  TextSelectedColor = '';
  BackgroundColor = '';
  ButtonType = '' ;
  IsSelected = false ;
  IsVisible = true;
  IsDisabled = false;
  pressOnly = false ;
  gesture = '';
  payload: any = "";
  flavors: ButtonModel[] = [] ;
  ButtonModelList: ButtonModel[] = [];
  behaviors: string[] = [] ;
  Tag: any ;
  FooterColor = "";
  FooterFontColor = "";
  FooterText = "";
  FooterIcon = "";
  RowNumber = "";
  LegacyValves = "";
  UnitTypes = "";
  get pathToBackGroundImageAsUrl() {
    const outline = 'url(' + this.PathToBackgroundImage + ')' ;
    return outline ;
  }
  get isTapOnly(): boolean {
    return (this.behaviors.indexOf('tap') > -1 && this.behaviors.length == 1) ;
  }
  get isPressOnly(): boolean {
    return (this.behaviors.indexOf('press') > -1 && this.behaviors.length == 1) ;
  }
}

export class ButtonModelList {
  WaterType: ButtonModel[] = [];
  FlavorType: ButtonModel[] = [];
  SyrupType: ButtonModel[] = [];
  AllTypes: ButtonModel[] = [];
}

export class UnitConfigurationModel {
  Id: string = '';
  UnitName: string = '';
  UnusedValues: number[];

  constructor(public ValveLayout: ValveConfigurationRow[], public AllValveLabelPairs: ValveLabelPair[]) {

  }
}
export class UnitTypes {
  static Spire2 = "Spire2";
  static Spire2Crew = "Spire2Crew";
  static Spire3 = "Spire3";
  static Spire41 = "Spire41";
  static Spire5 = "Spire5";
  static DriveThru = "Spire6";
}
export class ValveConfigurationRow {
  RowNumber: number = -1;
  ValveLabelPair: ValveLabelPair[] = [];
}

export class ValveLabelPair {
  ValveNumber: number = -1;
  SortValveNumber: number = 0;
  Label: string = '';
  Bank: number = 0;
  Weighting: number = 0;
  Row: number = 0;

  get valveLabel() {
    const vlabel = this.Label + " - V" + this.ValveNumber;

    return vlabel;
  }
}

// user_id, Name, nickname, and picture
export interface DriveThruData {
  objectId : number ;
  brands : ButtonModel[];
  flavors: ButtonModel[];
  waters:  ButtonModel[];
  topCombinations: ButtonModel[] ;
  actions: ButtonModel[] ;
  curatedMixes: ButtonModel[];
}

export class PDMDataArg {
  constructor (public pdmtype: string, public data: any) {
  }
}

export class PDMDataType {
  static driveThruData = 'driveThruData';
  static serviceUIData = 'serviceUIData';
}

export class ButtonEventArgs {
  constructor(public gesture: string, public buttonModel: ButtonModel, public consumerObjectId: number) {
  }
}

export class PourData {
  // ObjectId of sender
  sender : number ;

  recipeId : string  ;
  qty = 0 ;
  pourEventArgs : PourEventArgs ;
}


export class ButtonSet {
  static topCombination = 'topCombination' ;
  static brand = 'brand' ;
  static flavor = 'flavor' ;
  static water = 'water' ;
  static ice = 'ice' ;
  static action = 'action' ;
  static mix = 'mix';
}

export class ScreenMetrics {
  size: number ;
  aspect: string ;
  resolution: string ;
  heightInch: number ;
  widthInch: number ;
  heightPx: number ;
  widthPx: number ;
  heightPxAsCSS: string ;
  widthPxAsCSS: string ;
  factorPx: number ;
  showSectionTitles : boolean ;
  topCombinationWidth : string ;
  topCombinationHeight : string ;
  mixWidth : string;
  mixHeight : string;
  brandPanelWidth: string ;
  brandPanelHeight: string ;
  flavorPanelWidth: string ;
  flavorPanelHeight: string ;
  waterPanelWidth: string ;
  waterPanelHeight: string ;
  actionPanelWidth: string ;
  actionPanelHeight: string ;
  buttonSize: string ;
  buttonSizeFlavorShots: string ;
  flavorOnTopCombinationSize: string ;
  showLabelsOnSections: boolean ;
  actionButtonWidth: string ;
  actionButtonHeight: string ;
  buttonImageHeight: string;
  buttonImageWidth: string;
  brandPanelWaterPanelWidth: string;
  serviceActionButtonWidth: string;
  serviceActionButtonHeight: string;
}


export class ButtonEventData {
  // var data = {Type:e.Type, buttonModel:this.buttonModel, Tag:e} ;
  constructor(public type: string, public buttonModel : ButtonModel, public viewModelObjectId, public tag?: any) {
  }
}

export class AppConfig {
  production = false ;
  siteName = "" ;
  envfile = "" ;
  dbBackupAccountUrlPrefix: string = "" ;
  remoteDbUrlPrefix:  string = "" ;
  remoteDbUserDbPrefix: string = "" ;
  commonDbUrl: string = "" ;
  userDbUrl: string = "";

  // these are built
  commonDbName: string = "" ;
  userDbName: string = "" ;
  userDbPrefix: string = "" ;
  serverPort: string = "" ;
  socketPort: string = "" ;
  siteIconPath: string = "";

  version: string = `V1`;
  contactUsAtEmail: string = "jeff@oldprogrammer.io";
  apiUrls: any = {};
  serverHost = "";
}



export class PourEventData {
  pourMode: string ;


}

export class PourMode {
  static optifill = "optifill" ;
  static timedPour = 'timedPour' ;
  static isBrix = 'isBrix' ;
  static manualPour = 'manualPour' ;
}

export class UICustomizationState {
  OverrideName: string = "";
  AttractLoopName: string = "";
}



export class ValveFlowRatesState {
  HighStillFlowRate: number = 0.0;
  LowStillFlowRate: number = 0.0;
  HighCarbFlowRate: number = 0.0;
  LowCarbFlowRate: number = 0.0;
  FlavorShotFlowRate: number = 0.0;
}

export class ValveAssignment {
  Assignments: ValveAssignmentState[] = [];
}

export class ValveAssignmentState {
  ValveId = "";
  BibItemAsButtonModel: ButtonModel;
  SKU = "" ;
  IsLocked = false ;
  IsHighYield = false ;

  get isAssigned(): boolean {
    return this.SKU.length > 0 ;
  }
  ValveLabelPair: ValveLabelPair = new ValveLabelPair();

  unAssignValve() {
    this.BibItemAsButtonModel = null ;
    this.SKU = "";
  }

  assignValve(sku: string, bibItem: ButtonModel) {
    this.SKU = sku ;
    this.BibItemAsButtonModel = bibItem ;
  }

}

export class MixologyStateModel {
  Version : string ;
  Mixes : ButtonModel[] = [];
}

export class BibItemType {
  static flavorshot = "FlavorShot" ;
  static carbwater = "CarbWater" ;
  static stillwater = "StillWater" ;
  static syrup = "Syrup" ;
}

export class CountryLanguageCustomerModel {
  Country: string;
  Language: string;
  Customer: string;
}

export class BibItemModel {
  Bibsize = '';
  Description = '';
  MixRatio = '';
  Name = '';
  AltName = '';
  SKU = '';
  CaloriesPerOz = 0;
  Type: BibItemType = new BibItemType();
  CountryLanguageCustomers: CountryLanguageCustomerModel[] = [];

  IsLocked = false;
  IsHighYield = false;
  IsAssigned = true;

  get toString() {
    const vlabel = this.SKU + " - " + this.Description;

    return vlabel;
  }
}

export class ServiceUIModel {
  Version: string ;
  ActionPanel: ButtonModel[] = [];
  SystemPanel: ButtonModel[] = [];
}

export class ServiceUIPopupButtonsModel {
  Version: string;
  ServiceLanguages: ButtonModel[] = [];
  ConsumerLanguages: ButtonModel[] = [];
  MachineStatus: ButtonModel[] = [];
  UnitType: ButtonModel[] = [];
  UnitLocation: ButtonModel[] = [];
  ModemConnectivity: ButtonModel[] = [];
  ShutdownOptions: ButtonModel[] = [];
  Recipes: ButtonModel[] = [];
  BibItemTypes: ButtonModel[] = [];
  DisplayOffOptions: ButtonModel[] = [];
  CleanDisplayOptions: ButtonModel[] = [];
  FlowRates: ButtonModel[] = [];
  ValveLockOptions: ButtonModel[] = [];
  ChangeValueMenuOptions: ButtonModel[] = [];
  Priming: ButtonModel[] = [];
  ValvePriming: ButtonModel[] = [];
  Brix: ButtonModel[] = [];
  ConfigureSelectionTimeout: ButtonModel[] = [];
  EquipmentStatus: ButtonModel[] = [];
  SENDiagnostics: ButtonModel[] = [];
  SENDiagnosticsEquipmentSerial: ButtonModel[] = [];
  SENDiagnosticsRefresh: ButtonModel[] = [];
  ConfirmButtons: ButtonModel[] = [];
}

export class LegacyValveModel {
  LegacyValves: ButtonModel[] = [];
}

export class PermissionsModel {
  Version: string;
  Roles: RolePermission[] = [];
}

export class RolePermission {
  Role: Role;
  ActionPermissions: string[] = [];
  AuthId: string;
}

export enum Role {
  None = 0, Crew, MEM, Manager, Support, Super
}

export class UICustomizationsModel {
  Version: string;
  Overrides: OverrideModel[];
}

export class OverrideModel {
  Name: string;
  Path: string;
  Countries: string[];
  AttractLoops: AttractLoopModel[];

  constructor(public AttractLoopsAsButtonModel: ButtonModel[]) {

  }
}

export class PlatformModel {
  width = 0;
  height = 0;
  frameRate = 0;
  homeMenu: PlatformMenuLayout = new PlatformMenuLayout;
  flavorDirection = '';
  brandFlavorsInfo: BrandFlavorsInfo = new BrandFlavorsInfo();
  layout: { [ key: string ]: any } = {};
}


export class BrandFlavorsInfo {
  flavorTitle = 0;
  itemFontSize = 0;
  itemCount = 0;
  titleFontSize = 0;
  preTitleFontSize = 0;
  itemHeight = 0;
}
export class PlatformMenuLayout {
  top: string = "";
  left: string = "";
  right: string = "";
  bottom: string = "";
  items: PlatformMenuCoordinate[] = [];
  adaItems: PlatformMenuCoordinate[] = [];
  adaLeft = 0;
}

export class PlatformMenuCoordinate {
  x: number = 0;
  y: number = 0;
  radius: number = 0;
}

export class PlatformCoordinate {
  top: string = "";
  left: string = "";
  right: string = "";
  bottom: string = "";
  width: string = "";
  height: string = "";
}

export class OverrideOptions {
  xml: "";
  path: "";
  value: "";
}

export class UIVisualsModel {
  version: number;
  brands: ButtonModel[] = [];
  unusedFlavors: ButtonModel[] = [];
  flavors: ButtonModel[] = [];
  waters: ButtonModel[] = [];
  topCombinations: ButtonModel[] = [];
  curatedMixes: ButtonModel[] = [];
  ice: ButtonModel[] = [];
  actions: ButtonModel[] = [];
  valve: ButtonModel[] = [];
  selectable: ButtonModel[] = [];

  get toString() {
    const vlabel = "version:" + this.version + " brands:" + this.brands.length + " flavors:" + this.flavors.length + " waters:" + this.waters.length;

    return vlabel;
  }
}

export class AttractLoopModel {
  IsSelected: boolean;
  Name: string;
  Path: string;
}

export class TopCombinationModel {
  TopCombinations: ButtonModel[];
}

export class ConsumerUILocalizationModel {
  primaryLocalization: LocalizationResourceModel = new LocalizationResourceModel();
  secondaryLocalization: LocalizationResourceModel = new LocalizationResourceModel();
}

export class LocalizationResourceModel {
  Version = "";
  CountryLanguageCode = "";
  ResourceStrings: LocalizedItems = new LocalizedItems();

  getHasItems(): boolean {
    return Object.keys(this.ResourceStrings).length > 0;
  }
}

export class LocalizedItems {
  // key value pair
  // property name is key, value is localized string
  [key: string]: string;
}


export enum ProductItemTypeEnum {
  Flavor, Brand, Mix, Water
}

export enum UIItemOverride {
  None = 1,
  ImageLogo = 2,
  ImageLogoBrand = 4,
  MixBeverage = 8,
  InheritFlavors = 16
}

export class ProductUIItemModel {
  Id: string;
  Name: string;
  ImageLogo: string;
  ImageLogoConsumerUI: string;
  ColorBackground: string;
  Design: string;
  RecipeId: string;
  MixBeverage: string;
  MixFlavors: string[];
  Flavors: string[];
  ItemOverride: UIItemOverride;
  ProductItemType: ProductItemTypeEnum;
  CountryLanguageCustomer: CountryLanguageCustomerModel[];
  Weighting: number;
}

export class RecipeType {
  static Water = "Water";
  static Beverage = "Beverage";
  static Mix = "Mix";
  static Flavor = "Flavor";
}

export class RecipeItemsOwner {
  Version: string;
  Recipes: RecipeItemModel[];
}

export class RecipeSku {
  Sku = '';
  Name = '';
}

export class SkuToValveMapping {
  constructor(public sku: string, public valveAssignmentState: ValveAssignmentState) {}
}

export class ActionType {
  Added: "add";
  Removed: "remove";
  Locked: "lock";
}

export class ValveAction {
  ActionType: ActionType;
  ID: number;
  Type: string;
  SKU: string;
}

export class InventoryMapping {
  ValveActions: ValveAction[] = [];
  ValveAssignments: ValveAssignment[] = [];
}

export class RecipeItemModel {
  Id = '';
  Name = '';
  Type = '';
  BeverageId = '';
  BrandId = '';
  FlavorIds: string[] = [];
  WaterSkus: string[] = [];
  SyrupSkus: RecipeSku[] = [];
  FlavorSkus: RecipeSku[] = [];
  UnAllowedFlavors: string[] = [];
  TopOffDelay = 0;

  SkuToValveMappings: SkuToValveMapping[] = [];

  areAnyValvesLockedInRecipe(): boolean {
    return _.find(this.SkuToValveMappings, function(item: SkuToValveMapping) {
      return item.valveAssignmentState.IsLocked;
    }) !== undefined;
  }

  get toString() {
    const vlabel = "recipe:" + this.Name + "  " + this.Id;

    return vlabel;
  }
}


export class StringKeyValuePair {
  key = "";
  value = "";
}

export class Flavor {
  id = "";
  resourceId = "";
  name = "";
  pourItem: PourItem = new PourItem();
  design: FlavorDesign = new FlavorDesign();
  select: FlavorAnimation = new FlavorAnimation();
  spin: FlavorAnimation = new FlavorAnimation();
}

export class FlavorAnimation {
  asset = "";
  width = 0;
  height = 0;
  frames = 0;
  fps = 0;
  scale = 0;
}

export class FlavorDesign {
  textColor = "";
  textSelectedColor = "";
  backgroundColor = "";
  alphaDisabled = "";
  pourItem: PourItem = new PourItem();
}

export class ResourceItem {
  name = "";
  url = "";
}

export class IdleState {
  videos: ResourceItem[] = [];
  loop = false;
  delayHome = 0;
  delayBrand = 0;
  colorLight = "";
}

export class PourableDesign {
  id = '';
  pourItem: PourItem = new PourItem();
  recipeId = '';
  name = '';
  flavors: string[] = [];
  group = '';
  design: DesignNode = new DesignNode();
  CalorieCups: CalorieCup[] = [];
  Weighting = 0;
}

export class ApiResult {
  success = true;
  message = "";
  details: string[] = [];
  url = "";
}

export class DesignSecondaryAnimation {
  animationId: string = "";
  alpha: number = 1;
  scale: number = 1;
  offsetX: number = 0;
  offsetY: number = 0;
}

export class DesignNode {
  assets: DesignAssets = new DesignAssets();
  alphaCarbonation = 0;
  colors: DesignColors = new DesignColors();
  particlesHome: DesignParticles = new DesignParticles();
  particlesBrand: DesignParticlesBrand[] = [];
  secondaryAnimation = new DesignSecondaryAnimation();
  secondaryAnimationAda = new DesignSecondaryAnimation();
  secondaryAnimation_5 = new DesignSecondaryAnimation();
  secondaryAnimationAda_5 = new DesignSecondaryAnimation();
}

export class DesignAssets {
  logoHome = '';
  logoBrand = '';
  gradient = '';
  liquidIntro = '';
  liquidIdle = '';
  liquidBackground = '' ;
}

export class DesignColors {
  strokeHome = '';
  animationLight = '';
  animationDark = '' ;
  messageTitle = '#99ffffff';
  messageSubtitle = '#99000000';
}

export class DesignParticles {
  colors: string[] = [];
  opacity: DesignOpacity = new DesignOpacity();
}

export class DesignParticlesBrand {
  color = '';
  opacityMin = 0;
  opacityMax = 0 ;
  frequency = 1;
  colorVariation = 0;
}

export class DesignOpacity {
  from = 0 ;
  to = 0;
}

export class PourItemModel {
  brands: PourableDesign[] = [];
  waters: PourableDesign[] = [] ;
  topCombinations: PourableDesign[] = [] ;
  flavors: FlavorDesign[] = [];
  curatedMixes: PourableDesign[] = [];
  homeMenu: PlatformMenuLayout[] = [];
}

export class PourItem {
  id = '';
  pourConfigurationId = '';
  label = '';
  isDisabled = false ;
  brandId = '';
  flavorIds: string[] = [];
}

export class Bubbles {
  asset = '';
  width = 0;
  height = 0;
  frames = 0;
  fps = 0;
  scale = 1;
}

export class CalorieCountState {
  IsToggleButtonEnabled = false;
  CalorieCups: CalorieCup[] = [];
}

export class CalorieCup {
  CupName = '';
  QtyInOunces = 0;
  QtyInMilliliters = 0;
  MetricLabel = '';
  NonMetricLabel = '';
  Line1Label = '';
  Line2Label = '';
}

export class DesignAnimation {
  id = '' ;
  image = '';
  frameWidth = 0;
  frameHeight = 0;
  frames = 0;
  smoothing = '';
  fps = 0;
  scale = 1;
  format = 0;
}

export class ItemStateInfo {
  ItemType = '';
  Description = '';
}

export class OutOfOrderEventArgs {
  Items: ItemStateInfo[]  = [];
  isOutOfOrder = false ;
}

export class SetCuratedMixItem {
  Id = '';
  RecipeId = '';
}

