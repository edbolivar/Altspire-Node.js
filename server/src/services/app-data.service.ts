import {inject, injectable} from 'inversify';
import {JsUtil} from "../universal/JsUtil";
import * as inversify from "inversify";
import Kernel = inversify.interfaces.Kernel;
import { environment } from '../environments/environment';
import {AppConfig} from "../universal/app.types";
import {PubSubService} from "../universal/pub-sub.service";
import TYPES from "../server.types";
import {EventDescriptor, PublishEvent, PubSubEventArgs, SubscribeEvent} from "../universal/pub-sub-types";
import {AppInfoService} from "./app-info.service";


@injectable()
export class AppDataService {
    objectId: number;
    static instance: AppDataService;
    ioc : Kernel ;
    result: any;

    constructor(@inject(TYPES.AppInfo) private appInfo: AppInfoService) {
        AppDataService.instance = this;
        this.objectId = JsUtil.getObjectId();
        console.log("ctor.AppDataService", this.objectId);
        this.ioc = global["kernel"];
    }


}