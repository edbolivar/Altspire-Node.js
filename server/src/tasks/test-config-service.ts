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
import {ConfigurationService} from "../configuration/configuration-service";

let Promise = require("bluebird");
let _ = require("lodash");

@injectable()
export class TestConfigService implements ITask {
    command: string = "testconfigservice";
    objectId: number;
    target: string;
    tag: string;

    constructor(@inject(TYPES.AppInfo) private appInfo: AppInfoService, private configurationService: ConfigurationService) {
        this.objectId = JsUtil.getObjectId();
        console.log('ctor.testconfigservice', this.objectId);
    }

    verifyArguments(argv: any): boolean {
        return true ;
    } ;

    usage(): string {
        return "exercise the ConfigurationService";
    } ;

    execute(): boolean {
        return true ;
    }
}