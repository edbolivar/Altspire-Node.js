import {inject, injectable} from 'inversify';
import {JsUtil} from "../universal/JsUtil";
import * as inversify from "inversify";
import Kernel = inversify.interfaces.Kernel;
import { environment } from '../environments/environment';
import {AppConfig} from "../universal/app.types";
import {PubSubService} from "../universal/pub-sub.service";
import TYPES from "../server.types";
import {EventDescriptor, PubSubTopic} from "../universal/pub-sub-types";
import {DeviceInfo} from "../unitstate/device-info";
import {Device} from "usb";
const PATH = require("path");

@injectable()
export class AppInfoService {
    static instance: AppInfoService;
    objectId : number ;
    config: AppConfig = new AppConfig();
    incomingEnvironment: any = environment ;
    isClientSide = false ;
    ioc: Kernel ;
    pubsub: PubSubService ;
    configDir_App: string ;
    configDir_AppData: string ;
    designDir: string ;
    appRootDir: string ;
    isElectron = false;
    constructor() {
        AppInfoService.instance = this ;
        this.objectId = JsUtil.getObjectId();
        console.log("ctor.AppInfo", this.objectId);
        this.ioc = global["kernel"] ;

        // a crutch for the fluent types that are not resolved by DI
        AppInfoService.instance = this ;

        this.loadEnvironmentFile();
        this.prepareDirectories();
        this.preparePubSub();
    }


    prepareDirectories() {
        const path = require("path");
        if (this.isElectron) {
            this.configDir_App = path.resolve("../Config");
            this.configDir_AppData = path.resolve("../AppData/Config");
        } else {
            this.configDir_App = path.resolve("../Config");
            this.configDir_AppData = path.resolve("../AppData/Config");
        }
        this.appRootDir = path.resolve(path.join(this.configDir_App, "../"));
        console.log(`ConfigDir_App ${this.configDir_App}`);
        console.log(`appRootDir ${this.appRootDir}`);
        this.designDir = PATH.join(this.configDir_App, 'design');
    }

    loadEnvironmentFile() {
        // copy props to the config property object on this class
        JsUtil.mapToNewObject(environment, this.config) ;

        // console.log("======== Config ==========");
        // console.log(this.config);
        // console.log("==========================");
    }

    preparePubSub() {
        // were not using ioc in this case, because it requres a @injectable annotation which is inversify
        this.pubsub = new PubSubService();
        // we have to do this from here, because AppInfo must be available (pubsub is created first)
        this.pubsub.configureUsingPubSubTopicWithoutEventOptions();

        // add in, more defined events here
        EventDescriptor.Create(PubSubTopic.pourComplete).GoesToClient();

        EventDescriptor.Create(PubSubTopic.pingClient)
            .WithABufferSizeOf(1)
            .GoesToClient();

        EventDescriptor.Create(PubSubTopic.pingServerAck)
            .WithABufferSizeOf(1)
            .GoesToClient();

        EventDescriptor.Create(PubSubTopic.outOfOrderChanged)
            .WithABufferSizeOf(1)
            .GoesToClient();
    }

}
