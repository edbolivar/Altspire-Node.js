import 'reflect-metadata';
import { interfaces, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import { Kernel  } from 'inversify';
import * as bodyParser from 'body-parser';
import {AppInfoService} from "./services/app-info.service";
import {ITask} from "./tasks/task-runner";

import * as express from 'express';
import * as http from "http";
import * as socketIo from "socket.io";
import * as cors from "cors";
import { DeviceDescriptor } from './universal/app.types';
import TYPES, {FileLocations} from "./server.types";
import {SocketService} from "./socket/socket-service";
// import {ValveControllerService} from "./pour/valve-controller-service";
import {PubSubService} from "./universal/pub-sub.service";
import {TAGS} from "./constant/constants";
import {AppDataService} from "./services/app-data.service";
import {AppProductdataService} from "./services/app-productdata.service";
// import {PourControllerService} from "./pour/pour-controller-service";
// import {FunctionDriver} from "./pour/function-driver";
import {ConfigurationController} from "./configuration/configuration-controller";
import {ConfigurationService} from "./configuration/configuration-service";
import {ProductDataService} from "./configuration/product-data-service";
import {ConfigurationRepository} from "./configuration/configuration-repository";
import {ProductDataRepository} from "./configuration/product-data-repository";
import {ValveAssignmentRepository} from "./configuration/valve-assignment-repository";
import {DeviceInfo} from "./unitstate/device-info";

// import Kernel from "inversify/dts/kernel/kernel";
// import {AppInfoService} from "./services/app-info";
// import TYPES from "./server.types";
// import * as bodyParser from "body-parser";

// prepare the ioc container
let kernel = new Kernel();
global["kernel"] = kernel ;

var path = require('path'),
    fs = require('fs');

// service definitions
kernel.bind<AppInfoService>(TYPES.AppInfo).to(AppInfoService).inSingletonScope();
kernel.bind<SocketService>(TYPES.SocketService).to(SocketService).inSingletonScope();
kernel.bind<DeviceInfo>(TYPES.DeviceInfo).to(DeviceInfo).inSingletonScope();
kernel.bind<AppDataService>(TYPES.AppDataService).to(AppDataService).inSingletonScope();
kernel.bind<AppProductdataService>(TYPES.AppProductdataService).to(AppProductdataService).inSingletonScope();
kernel.bind<interfaces.Controller>(TYPE.Controller).to(ConfigurationController).inSingletonScope()
    .whenTargetNamed(TAGS.ConfigurationController);
kernel.bind<PubSubService>(TYPES.PubSubService).to(PubSubService).inSingletonScope();
kernel.bind<ConfigurationService>(TYPES.ConfigurationService).to(ConfigurationService).inSingletonScope();
kernel.bind<ConfigurationRepository>(TYPES.ConfigurationRepository).to(ConfigurationRepository).inSingletonScope();
kernel.bind<ProductDataService>(TYPES.ProductDataService).to(ProductDataService).inSingletonScope();
kernel.bind<ProductDataRepository>(TYPES.ProductDataRepository).to(ProductDataRepository).inSingletonScope();
kernel.bind<ValveAssignmentRepository>(TYPES.ValveAssignmentRepository).to(ValveAssignmentRepository).inSingletonScope();
kernel.bind<FileLocations>(TYPES.FileLocations).to(FileLocations).inSingletonScope();

// kernel.bind<interfaces.Controller>(TYPES.PourControllerService)
// .to(PourControllerService).inSingletonScope().whenTargetNamed(TAGS.PourControllerService);
// kernel.bind<FunctionDriver>(TYPES.FunctionDriver).to(FunctionDriver).inSingletonScope().whenTargetNamed(TAGS.FunctionDriver);
// kernel.bind<ValveControllerService>(TYPES.ValveControllerService).to(ValveControllerService).inSingletonScope();

// CORS middleware
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

// start the server
const server = new InversifyExpressServer(kernel);
server.setConfig((app) => {
    app.use(bodyParser.json());
    app.use(allowCrossDomain) ;
});

let app = server.build();

app.use(bodyParser.urlencoded({
    extended: true
}));

DeviceInfo.initialize();

const appInfo: AppInfoService = <AppInfoService> kernel.get(TYPES.AppInfo);

app.listen(appInfo.config.serverPort);
console.log(`API Server started on port ${appInfo.config.serverPort} :)`);

// fire up the common services
kernel.get(TYPES.SocketService);
// kernel.get(TYPES.ValveControllerService) ;
// kernel.get(TYPES.PourControllerService) ;



