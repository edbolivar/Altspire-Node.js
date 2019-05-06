
import {inject, injectable} from "inversify";
import {AppInfoService} from "../services/app-info.service";
import TYPES from "../server.types";
import {JsUtil} from "../universal/JsUtil";
import {ScreenMetrics} from "../universal/app.types";
import {ConfigurationRepository} from "../configuration/configuration-repository";
import {UnitState} from "./unit-state";
import {PubSubEventArgs, PubSubTopic, SubscribeEvent} from "../universal/pub-sub-types";

export class DeviceInfo {
    static objectId: number;
    static configurationRepository: ConfigurationRepository;

    static unitState: UnitState;

    static initialize() {
        DeviceInfo.objectId = JsUtil.getObjectId();
        console.log("ctor.DeviceInfo", DeviceInfo.objectId);

        DeviceInfo.configurationRepository = global["kernel"].get(TYPES.ConfigurationRepository);

        DeviceInfo.unitState = DeviceInfo.configurationRepository.getUnitState();

        SubscribeEvent.Create(PubSubTopic.unitStateChange, DeviceInfo.objectId)
            .HandleEventWithThisMethod(e => DeviceInfo.handleUnitStateChanged(e))
            .Done() ;

//        DeviceInfo.unitState.suspendWrite = false;
    }

    static handleUnitStateChanged(e: PubSubEventArgs) {
        console.log("Writing UnitState...");

//        DeviceInfo.unitState.suspendWrite = false;
        DeviceInfo.configurationRepository.saveUnitState(DeviceInfo.unitState);
//        DeviceInfo.unitState.suspendWrite = true;
    }

}
