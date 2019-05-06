"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var JsUtil_1 = require("../universal/JsUtil");
var app_info_service_1 = require("../services/app-info.service");
var inversify = require("inversify");
var multiInject = inversify.multiInject;
var inject = inversify.inject;
var injectable = inversify.injectable;
var server_types_1 = require("../server.types");
var _ = require("lodash");
var TaskRunner = /** @class */ (function () {
    function TaskRunner(appInfo, iocConfiguredTasks) {
        this.appInfo = appInfo;
        this.tasks = [];
        this.objectId = JsUtil_1.JsUtil.getObjectId();
        console.log('ctor.TaskRunner', this.objectId);
        this.tasks = iocConfiguredTasks;
    }
    TaskRunner.prototype.execute = function (argv) {
        console.log("******************** ctool *******************\r\nargs", argv);
        if (argv._.length == 0 || argv.help) {
            console.log("clipstool command  command must be specified");
            this.showHelp();
            return;
        }
        if (argv._.length > 1 || argv.help) {
            this.showHelp();
            return;
        }
        //extract the task, using the incoming command
        var command = argv._[0];
        var task = _.find(this.tasks, function (myTask) {
            return myTask.command === command;
        });
        if (!task) {
            console.log("ERROR command " + command + " not found");
            this.showHelp();
            return;
        }
        if (task.verifyArguments(argv)) {
            console.log("\r\n---- executing " + command + " ----");
            task.execute();
        }
        else {
            console.log("ERROR in arguments");
            console.log(task.usage());
        }
    };
    TaskRunner.prototype.showHelp = function () {
        _.forEach(this.tasks, function (task) {
            console.log("    " + task.command + "\r\n        " + task.usage() + "\r\n");
        });
    };
    TaskRunner = __decorate([
        injectable(),
        __param(0, inject(server_types_1.default.AppInfo)),
        __param(1, multiInject("ITask")),
        __metadata("design:paramtypes", [app_info_service_1.AppInfoService, Array])
    ], TaskRunner);
    return TaskRunner;
}());
exports.TaskRunner = TaskRunner;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBbERRLFVBQVU7UUFEdEIsVUFBVSxFQUFFO1FBS0ksV0FBQSxNQUFNLENBQUMsc0JBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUNyQixXQUFBLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQTt5Q0FEbUIsaUNBQWM7T0FKekQsVUFBVSxDQW1EdEI7SUFBRCxpQkFBQztDQW5ERCxBQW1EQyxJQUFBO0FBbkRZLGdDQUFVIiwiZmlsZSI6InRhc2tzL3Rhc2stcnVubmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtKc1V0aWx9IGZyb20gXCIuLi91bml2ZXJzYWwvSnNVdGlsXCI7XG5pbXBvcnQge0FwcEluZm9TZXJ2aWNlfSBmcm9tIFwiLi4vc2VydmljZXMvYXBwLWluZm8uc2VydmljZVwiO1xuXG5pbXBvcnQgKiBhcyBpbnZlcnNpZnkgZnJvbSBcImludmVyc2lmeVwiO1xuaW1wb3J0IG11bHRpSW5qZWN0ID0gaW52ZXJzaWZ5Lm11bHRpSW5qZWN0O1xuaW1wb3J0IGluamVjdCA9IGludmVyc2lmeS5pbmplY3Q7XG5pbXBvcnQgaW5qZWN0YWJsZSA9IGludmVyc2lmeS5pbmplY3RhYmxlO1xuaW1wb3J0IFRZUEVTIGZyb20gXCIuLi9zZXJ2ZXIudHlwZXNcIjtcblxubGV0IF8gPSByZXF1aXJlKFwibG9kYXNoXCIpO1xuXG5AaW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVGFza1J1bm5lciB7XG4gICAgb2JqZWN0SWQgOiBudW1iZXIgO1xuICAgIHRhc2tzIDogSVRhc2tbXSA9IFtdIDtcblxuICAgIGNvbnN0cnVjdG9yKEBpbmplY3QoVFlQRVMuQXBwSW5mbykgcHJpdmF0ZSBhcHBJbmZvOiBBcHBJbmZvU2VydmljZSxcbiAgICAgICAgICAgICAgICBAbXVsdGlJbmplY3QoXCJJVGFza1wiKSBpb2NDb25maWd1cmVkVGFza3M6SVRhc2tbXSkge1xuXG4gICAgICAgIHRoaXMub2JqZWN0SWQgPSBKc1V0aWwuZ2V0T2JqZWN0SWQoKTtcbiAgICAgICAgY29uc29sZS5sb2coJ2N0b3IuVGFza1J1bm5lcicsIHRoaXMub2JqZWN0SWQpO1xuICAgICAgICB0aGlzLnRhc2tzID0gaW9jQ29uZmlndXJlZFRhc2tzIDtcbiAgICB9XG5cbiAgICBleGVjdXRlKGFyZ3Y6IGFueSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIioqKioqKioqKioqKioqKioqKioqIGN0b29sICoqKioqKioqKioqKioqKioqKipcXHJcXG5hcmdzXCIsIGFyZ3YpIDtcbiAgICAgICAgaWYgKGFyZ3YuXy5sZW5ndGggPT0gMCB8fCBhcmd2LmhlbHAgKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImNsaXBzdG9vbCBjb21tYW5kICBjb21tYW5kIG11c3QgYmUgc3BlY2lmaWVkXCIpIDtcbiAgICAgICAgICAgIHRoaXMuc2hvd0hlbHAoKTtcbiAgICAgICAgICAgIHJldHVybiA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJndi5fLmxlbmd0aCA+IDEgfHwgYXJndi5oZWxwICkge1xuICAgICAgICAgICAgdGhpcy5zaG93SGVscCgpO1xuICAgICAgICAgICAgcmV0dXJuIDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vZXh0cmFjdCB0aGUgdGFzaywgdXNpbmcgdGhlIGluY29taW5nIGNvbW1hbmRcbiAgICAgICAgbGV0IGNvbW1hbmQgPSBhcmd2Ll9bMF0gO1xuICAgICAgICBsZXQgdGFzazpJVGFzayA9IF8uZmluZCh0aGlzLnRhc2tzLCBmdW5jdGlvbiAobXlUYXNrKSB7XG4gICAgICAgICAgICByZXR1cm4gbXlUYXNrLmNvbW1hbmQgPT09IGNvbW1hbmQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghdGFzaykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYEVSUk9SIGNvbW1hbmQgJHtjb21tYW5kfSBub3QgZm91bmRgKSA7XG4gICAgICAgICAgICB0aGlzLnNob3dIZWxwKCk7XG4gICAgICAgICAgICByZXR1cm4gO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YXNrLnZlcmlmeUFyZ3VtZW50cyhhcmd2KSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYFxcclxcbi0tLS0gZXhlY3V0aW5nICR7Y29tbWFuZH0gLS0tLWApXG4gICAgICAgICAgICB0YXNrLmV4ZWN1dGUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1IgaW4gYXJndW1lbnRzXCIpO1xuICAgICAgICAgICAgY29uc29sZS5sb2codGFzay51c2FnZSgpKSA7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHNob3dIZWxwKCkge1xuICAgICAgICBfLmZvckVhY2godGhpcy50YXNrcyxmdW5jdGlvbih0YXNrOklUYXNrKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgICAgICR7dGFzay5jb21tYW5kfVxcclxcbiAgICAgICAgJHt0YXNrLnVzYWdlKCl9XFxyXFxuYCkgO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRhc2sge1xuICAgIGNvbW1hbmQgOiBzdHJpbmcgO1xuICAgIHZlcmlmeUFyZ3VtZW50cyhhcmd2OmFueSkgOiBib29sZWFuIDtcbiAgICB1c2FnZSgpIDogc3RyaW5nIDtcbiAgICBleGVjdXRlKCkgOiBib29sZWFuIDtcbn1cblxuIl19
