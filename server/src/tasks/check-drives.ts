import {ITask} from "./task-runner";
import {AppInfoService} from "../services/app-info.service";
import * as inversify from "inversify";
import inject = inversify.inject;
import injectable = inversify.injectable;
import {
    AppConfig

} from "../universal/app.types";
import moment = require("moment");
import TYPES from "../server.types";
import {JsUtil} from "../universal/JsUtil";

let Promise = require("bluebird");
let _ = require("lodash");


@injectable()
export class CheckDrives implements ITask {
    command: string = "checkdrives";
    objectId: number;
    target: string;
    tag: string;

    constructor(@inject(TYPES.AppInfo) private appInfo: AppInfoService) {
        this.objectId = JsUtil.getObjectId();
        console.log('ctor.checkdrives', this.objectId);
    }

    verifyArguments(argv: any): boolean {
        return true ;
    } ;

    usage(): string {
        return "getting all the docs";
    } ;

    execute(): boolean {
       return true ;
    }


}
