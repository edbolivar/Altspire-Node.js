import {JsUtil} from "../universal/JsUtil";
import {AppInfoService} from "../services/app-info.service";

import * as inversify from "inversify";
import multiInject = inversify.multiInject;
import inject = inversify.inject;
import injectable = inversify.injectable;
import TYPES from "../server.types";

let _ = require("lodash");

@injectable()
export class TaskRunner {
    objectId : number ;
    tasks : ITask[] = [] ;

    constructor(@inject(TYPES.AppInfo) private appInfo: AppInfoService,
                @multiInject("ITask") iocConfiguredTasks:ITask[]) {

        this.objectId = JsUtil.getObjectId();
        console.log('ctor.TaskRunner', this.objectId);
        this.tasks = iocConfiguredTasks ;
    }

    execute(argv: any) {
        console.log("******************** ctool *******************\r\nargs", argv) ;
        if (argv._.length == 0 || argv.help ) {
            console.log("clipstool command  command must be specified") ;
            this.showHelp();
            return ;
        }

        if (argv._.length > 1 || argv.help ) {
            this.showHelp();
            return ;
        }

        //extract the task, using the incoming command
        let command = argv._[0] ;
        let task:ITask = _.find(this.tasks, function (myTask) {
            return myTask.command === command;
        });

        if (!task) {
            console.log(`ERROR command ${command} not found`) ;
            this.showHelp();
            return ;
        }
        if (task.verifyArguments(argv)) {
            console.log(`\r\n---- executing ${command} ----`)
            task.execute();
        } else {
            console.log("ERROR in arguments");
            console.log(task.usage()) ;
        }

    }

    showHelp() {
        _.forEach(this.tasks,function(task:ITask) {
            console.log(`    ${task.command}\r\n        ${task.usage()}\r\n`) ;
        });
    }
}

export interface ITask {
    command : string ;
    verifyArguments(argv:any) : boolean ;
    usage() : string ;
    execute() : boolean ;
}

