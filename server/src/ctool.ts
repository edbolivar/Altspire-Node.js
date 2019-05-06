import 'reflect-metadata';
import { interfaces, Controller, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import { Kernel } from 'inversify';
import * as bodyParser from 'body-parser';
import {AppInfoService} from "./services/app-info.service";
import {ITask, TaskRunner} from "./tasks/task-runner";
import TYPES from "./server.types";
import {CheckDrives} from "./tasks/check-drives";
import {TestConfigService} from "./tasks/test-config-service";
import {ConfigurationService} from "./configuration/configuration-service";
import {ProductDataService} from "./configuration/product-data-service";

// load everything needed to the container
const container = new Kernel();
container.bind<TaskRunner>("TaskRunner").to(TaskRunner).inSingletonScope().whenTargetNamed("MyTaskRunner");
container.bind<AppInfoService>(TYPES.AppInfo).to(AppInfoService).inSingletonScope();
container.bind<ConfigurationService>(TYPES.ConfigurationService).to(ConfigurationService).inSingletonScope();
container.bind<ProductDataService>(TYPES.ProductDataService).to(ProductDataService).inSingletonScope();


// tasks (add your task here)
container.bind<CheckDrives>("ITask").to(CheckDrives).inSingletonScope();

container.bind<TestConfigService>("ITask").to(TestConfigService).inSingletonScope();

var argv = require('minimist')(process.argv.slice(2));

let taskRunner = container.getNamed<TaskRunner>("TaskRunner","MyTaskRunner") ;

taskRunner.execute(argv) ;


