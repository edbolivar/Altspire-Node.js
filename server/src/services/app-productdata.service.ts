import {inject, injectable} from 'inversify';
import * as inversify from "inversify";
import Kernel = inversify.interfaces.Kernel;
import * as jsonfile from "load-json-file";
import {AppInfoService} from "./app-info.service";
import {JsUtil} from "../universal/JsUtil";
import TYPES, {DeviceInfo} from "../server.types";

@injectable()
export class AppProductdataService {
    objectId: number;
    static instance: AppProductdataService;
    ioc : Kernel ;
    path = "../src/config/appData/CrewUIVisuals.json";
    serviceuipath = "../src/config/ServiceUI.json";

    constructor(@inject(TYPES.AppInfo) private appInfo: AppInfoService) {
        AppProductdataService.instance = this;
        this.objectId = JsUtil.getObjectId();
        console.log("ctor.AppProductdataService", this.objectId);
        this.ioc = global["kernel"] ;

    }

    GetData() {
        return jsonfile.sync(this.path);
    }

    getServiceUIData() {
        return jsonfile.sync(this.serviceuipath);
    }

}