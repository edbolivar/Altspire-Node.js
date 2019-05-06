
import {AppInfoService} from "../services/app-info.service";
import {inject, injectable} from "inversify";
import TYPES from "../server.types";
import {JsUtil} from "../universal/JsUtil";
import {
    PourMode, Role, UICustomizationState,
    ValveFlowRatesState
} from "../universal/app.types";
import {PublishEvent, PubSubTopic} from "../universal/pub-sub-types";

export class UnitState {
    objectId: number;
    DeviceId = '';
    CountryLanguageCode = "en-us";
    UnitLocation = "US";
    UnitType = "";
    PrimaryConsumerLanguage = "en-us";
    SecondaryConsumerLanguage = "none";
    constructor() {
        this.objectId = JsUtil.getObjectId();
    }
}

// this get's confused during serialization
// since we aren't doing serviceui here were Not going to use this class for the moment
// and use the simpler variant above
export class UnitStateX {
    objectId: number;
    _deviceId: string;

    _countryLanguageCode = "en-us";
    _unitLocation = "US";
    _unitType = "DriveThru";
    _primaryConsumerLanguage = "en-us";
    _secondaryConsumerLanguage = "none";

    _pourMode: PourMode;
    _uiCustomizationState: UICustomizationState;
    _valveFlowRatesState: ValveFlowRatesState;
    _userRole: Role;

    suspendWrite: boolean = true;
    // import Role

    _clearSelectionsDelay: number;
    isAppLoading: boolean;

    writeTimeout: any;

    constructor() {
        this.objectId = JsUtil.getObjectId();
        this.userRole = Role.Super;
        this.pourMode = PourMode.optifill;
        console.log("ctor.UnitState", this.objectId);
    }

    publishUnitChangeEvent() {
        if (this.suspendWrite) {
            return;
        }

        if (this.writeTimeout) {
            // cancel any existing timeout
            clearTimeout(this.writeTimeout);
        }

        this.writeTimeout = setTimeout(function(that) {
            PublishEvent.Create(PubSubTopic.unitStateChange, that.objectId)
                .SetDataArgumentTo(this)
                .Send();
        }, 500, this);


    }

    get countryLanguageCode() {
        return this._countryLanguageCode;
    }

    set countryLanguageCode(newCode: string) {
        this._countryLanguageCode = newCode;

        this.publishUnitChangeEvent();
    }


    get unitLocation() {
        return this._unitLocation;
    }

    set unitLocation(newLocation: string) {
        this._unitLocation = newLocation;

        this.publishUnitChangeEvent();
    }


    get uiCustomizationState() {
        return this._uiCustomizationState;
    }

    set uiCustomizationState(newState: UICustomizationState) {
        this._uiCustomizationState = newState;

        this.publishUnitChangeEvent();
    }

    get valveFlowRatesState() {
        return this._valveFlowRatesState;
    }

    set valveFlowRatesState(newState: ValveFlowRatesState) {
        this._valveFlowRatesState = newState;

        this.publishUnitChangeEvent();
    }


    get userRole() {
        return this._userRole;
    }

    set userRole(newUserRole: Role) {
        this._userRole = newUserRole;

        this.publishUnitChangeEvent();
    }


    get unitType() {
        return this._unitType;
    }

    set unitType(unitType: string) {
        this._unitType = unitType;

        this.publishUnitChangeEvent();
    }


    get pourMode() {
        return this._pourMode;
    }

    set pourMode(pourMode: PourMode) {
        this._pourMode = pourMode;

        this.publishUnitChangeEvent();
    }


    get clearSelectionsDelay() {
        return this._clearSelectionsDelay;
    }

    set clearSelectionsDelay(selectionsDelay: number) {
        this._clearSelectionsDelay = selectionsDelay;

        this.publishUnitChangeEvent();
    }


    get deviceId() {
        return this._deviceId;
    }

    set deviceId(deviceId: string) {
        this._deviceId = deviceId;

        this.publishUnitChangeEvent();
    }

}