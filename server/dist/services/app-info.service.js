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
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var JsUtil_1 = require("../universal/JsUtil");
var environment_1 = require("../environments/environment");
var app_types_1 = require("../universal/app.types");
var pub_sub_service_1 = require("../universal/pub-sub.service");
var pub_sub_types_1 = require("../universal/pub-sub-types");
var PATH = require("path");
var AppInfoService = /** @class */ (function () {
    function AppInfoService() {
        this.config = new app_types_1.AppConfig();
        this.incomingEnvironment = environment_1.environment;
        this.isClientSide = false;
        this.isElectron = false;
        AppInfoService_1.instance = this;
        this.objectId = JsUtil_1.JsUtil.getObjectId();
        console.log("ctor.AppInfo", this.objectId);
        this.ioc = global["kernel"];
        // a crutch for the fluent types that are not resolved by DI
        AppInfoService_1.instance = this;
        this.loadEnvironmentFile();
        this.prepareDirectories();
        this.preparePubSub();
    }
    AppInfoService_1 = AppInfoService;
    AppInfoService.prototype.prepareDirectories = function () {
        var path = require("path");
        if (this.isElectron) {
            this.configDir_App = path.resolve("../Config");
            this.configDir_AppData = path.resolve("../AppData/Config");
        }
        else {
            this.configDir_App = path.resolve("../Config");
            this.configDir_AppData = path.resolve("../AppData/Config");
        }
        this.appRootDir = path.resolve(path.join(this.configDir_App, "../"));
        console.log("ConfigDir_App " + this.configDir_App);
        console.log("appRootDir " + this.appRootDir);
        this.designDir = PATH.join(this.configDir_App, 'design');
    };
    AppInfoService.prototype.loadEnvironmentFile = function () {
        // copy props to the config property object on this class
        JsUtil_1.JsUtil.mapToNewObject(environment_1.environment, this.config);
        // console.log("======== Config ==========");
        // console.log(this.config);
        // console.log("==========================");
    };
    AppInfoService.prototype.preparePubSub = function () {
        // were not using ioc in this case, because it requres a @injectable annotation which is inversify
        this.pubsub = new pub_sub_service_1.PubSubService();
        // we have to do this from here, because AppInfo must be available (pubsub is created first)
        this.pubsub.configureUsingPubSubTopicWithoutEventOptions();
        // add in, more defined events here
        pub_sub_types_1.EventDescriptor.Create(pub_sub_types_1.PubSubTopic.pourComplete).GoesToClient();
        pub_sub_types_1.EventDescriptor.Create(pub_sub_types_1.PubSubTopic.pingClient)
            .WithABufferSizeOf(1)
            .GoesToClient();
        pub_sub_types_1.EventDescriptor.Create(pub_sub_types_1.PubSubTopic.pingServerAck)
            .WithABufferSizeOf(1)
            .GoesToClient();
        pub_sub_types_1.EventDescriptor.Create(pub_sub_types_1.PubSubTopic.outOfOrderChanged)
            .WithABufferSizeOf(1)
            .GoesToClient();
    };
    AppInfoService = AppInfoService_1 = __decorate([
        inversify_1.injectable(),
        __metadata("design:paramtypes", [])
    ], AppInfoService);
    return AppInfoService;
    var AppInfoService_1;
}());
exports.AppInfoService = AppInfoService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VzL2FwcC1pbmZvLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSx1Q0FBNkM7QUFDN0MsOENBQTJDO0FBRzNDLDJEQUEwRDtBQUMxRCxvREFBaUQ7QUFDakQsZ0VBQTJEO0FBRTNELDREQUF3RTtBQUd4RSxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFHN0I7SUFhSTtRQVZBLFdBQU0sR0FBYyxJQUFJLHFCQUFTLEVBQUUsQ0FBQztRQUNwQyx3QkFBbUIsR0FBUSx5QkFBVyxDQUFFO1FBQ3hDLGlCQUFZLEdBQUcsS0FBSyxDQUFFO1FBT3RCLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFFZixnQkFBYyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUU7UUFDaEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxlQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFFO1FBRTdCLDREQUE0RDtRQUM1RCxnQkFBYyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUU7UUFFaEMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3pCLENBQUM7dUJBekJRLGNBQWM7SUE0QnZCLDJDQUFrQixHQUFsQjtRQUNJLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNsQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUMvRCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUMvRCxDQUFDO1FBQ0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQWlCLElBQUksQ0FBQyxhQUFlLENBQUMsQ0FBQztRQUNuRCxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFjLElBQUksQ0FBQyxVQUFZLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQsNENBQW1CLEdBQW5CO1FBQ0kseURBQXlEO1FBQ3pELGVBQU0sQ0FBQyxjQUFjLENBQUMseUJBQVcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUU7UUFFakQsNkNBQTZDO1FBQzdDLDRCQUE0QjtRQUM1Qiw2Q0FBNkM7SUFDakQsQ0FBQztJQUVELHNDQUFhLEdBQWI7UUFDSSxrR0FBa0c7UUFDbEcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLCtCQUFhLEVBQUUsQ0FBQztRQUNsQyw0RkFBNEY7UUFDNUYsSUFBSSxDQUFDLE1BQU0sQ0FBQyw0Q0FBNEMsRUFBRSxDQUFDO1FBRTNELG1DQUFtQztRQUNuQywrQkFBZSxDQUFDLE1BQU0sQ0FBQywyQkFBVyxDQUFDLFlBQVksQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRWhFLCtCQUFlLENBQUMsTUFBTSxDQUFDLDJCQUFXLENBQUMsVUFBVSxDQUFDO2FBQ3pDLGlCQUFpQixDQUFDLENBQUMsQ0FBQzthQUNwQixZQUFZLEVBQUUsQ0FBQztRQUVwQiwrQkFBZSxDQUFDLE1BQU0sQ0FBQywyQkFBVyxDQUFDLGFBQWEsQ0FBQzthQUM1QyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7YUFDcEIsWUFBWSxFQUFFLENBQUM7UUFFcEIsK0JBQWUsQ0FBQyxNQUFNLENBQUMsMkJBQVcsQ0FBQyxpQkFBaUIsQ0FBQzthQUNoRCxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7YUFDcEIsWUFBWSxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQXhFUSxjQUFjO1FBRDFCLHNCQUFVLEVBQUU7O09BQ0EsY0FBYyxDQTBFMUI7SUFBRCxxQkFBQzs7Q0ExRUQsQUEwRUMsSUFBQTtBQTFFWSx3Q0FBYyIsImZpbGUiOiJzZXJ2aWNlcy9hcHAtaW5mby5zZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpbmplY3QsIGluamVjdGFibGV9IGZyb20gJ2ludmVyc2lmeSc7XG5pbXBvcnQge0pzVXRpbH0gZnJvbSBcIi4uL3VuaXZlcnNhbC9Kc1V0aWxcIjtcbmltcG9ydCAqIGFzIGludmVyc2lmeSBmcm9tIFwiaW52ZXJzaWZ5XCI7XG5pbXBvcnQgS2VybmVsID0gaW52ZXJzaWZ5LmludGVyZmFjZXMuS2VybmVsO1xuaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tICcuLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQnO1xuaW1wb3J0IHtBcHBDb25maWd9IGZyb20gXCIuLi91bml2ZXJzYWwvYXBwLnR5cGVzXCI7XG5pbXBvcnQge1B1YlN1YlNlcnZpY2V9IGZyb20gXCIuLi91bml2ZXJzYWwvcHViLXN1Yi5zZXJ2aWNlXCI7XG5pbXBvcnQgVFlQRVMgZnJvbSBcIi4uL3NlcnZlci50eXBlc1wiO1xuaW1wb3J0IHtFdmVudERlc2NyaXB0b3IsIFB1YlN1YlRvcGljfSBmcm9tIFwiLi4vdW5pdmVyc2FsL3B1Yi1zdWItdHlwZXNcIjtcbmltcG9ydCB7RGV2aWNlSW5mb30gZnJvbSBcIi4uL3VuaXRzdGF0ZS9kZXZpY2UtaW5mb1wiO1xuaW1wb3J0IHtEZXZpY2V9IGZyb20gXCJ1c2JcIjtcbmNvbnN0IFBBVEggPSByZXF1aXJlKFwicGF0aFwiKTtcblxuQGluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEFwcEluZm9TZXJ2aWNlIHtcbiAgICBzdGF0aWMgaW5zdGFuY2U6IEFwcEluZm9TZXJ2aWNlO1xuICAgIG9iamVjdElkIDogbnVtYmVyIDtcbiAgICBjb25maWc6IEFwcENvbmZpZyA9IG5ldyBBcHBDb25maWcoKTtcbiAgICBpbmNvbWluZ0Vudmlyb25tZW50OiBhbnkgPSBlbnZpcm9ubWVudCA7XG4gICAgaXNDbGllbnRTaWRlID0gZmFsc2UgO1xuICAgIGlvYzogS2VybmVsIDtcbiAgICBwdWJzdWI6IFB1YlN1YlNlcnZpY2UgO1xuICAgIGNvbmZpZ0Rpcl9BcHA6IHN0cmluZyA7XG4gICAgY29uZmlnRGlyX0FwcERhdGE6IHN0cmluZyA7XG4gICAgZGVzaWduRGlyOiBzdHJpbmcgO1xuICAgIGFwcFJvb3REaXI6IHN0cmluZyA7XG4gICAgaXNFbGVjdHJvbiA9IGZhbHNlO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBBcHBJbmZvU2VydmljZS5pbnN0YW5jZSA9IHRoaXMgO1xuICAgICAgICB0aGlzLm9iamVjdElkID0gSnNVdGlsLmdldE9iamVjdElkKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiY3Rvci5BcHBJbmZvXCIsIHRoaXMub2JqZWN0SWQpO1xuICAgICAgICB0aGlzLmlvYyA9IGdsb2JhbFtcImtlcm5lbFwiXSA7XG5cbiAgICAgICAgLy8gYSBjcnV0Y2ggZm9yIHRoZSBmbHVlbnQgdHlwZXMgdGhhdCBhcmUgbm90IHJlc29sdmVkIGJ5IERJXG4gICAgICAgIEFwcEluZm9TZXJ2aWNlLmluc3RhbmNlID0gdGhpcyA7XG5cbiAgICAgICAgdGhpcy5sb2FkRW52aXJvbm1lbnRGaWxlKCk7XG4gICAgICAgIHRoaXMucHJlcGFyZURpcmVjdG9yaWVzKCk7XG4gICAgICAgIHRoaXMucHJlcGFyZVB1YlN1YigpO1xuICAgIH1cblxuXG4gICAgcHJlcGFyZURpcmVjdG9yaWVzKCkge1xuICAgICAgICBjb25zdCBwYXRoID0gcmVxdWlyZShcInBhdGhcIik7XG4gICAgICAgIGlmICh0aGlzLmlzRWxlY3Ryb24pIHtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnRGlyX0FwcCA9IHBhdGgucmVzb2x2ZShcIi4uL0NvbmZpZ1wiKTtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnRGlyX0FwcERhdGEgPSBwYXRoLnJlc29sdmUoXCIuLi9BcHBEYXRhL0NvbmZpZ1wiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnRGlyX0FwcCA9IHBhdGgucmVzb2x2ZShcIi4uL0NvbmZpZ1wiKTtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnRGlyX0FwcERhdGEgPSBwYXRoLnJlc29sdmUoXCIuLi9BcHBEYXRhL0NvbmZpZ1wiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFwcFJvb3REaXIgPSBwYXRoLnJlc29sdmUocGF0aC5qb2luKHRoaXMuY29uZmlnRGlyX0FwcCwgXCIuLi9cIikpO1xuICAgICAgICBjb25zb2xlLmxvZyhgQ29uZmlnRGlyX0FwcCAke3RoaXMuY29uZmlnRGlyX0FwcH1gKTtcbiAgICAgICAgY29uc29sZS5sb2coYGFwcFJvb3REaXIgJHt0aGlzLmFwcFJvb3REaXJ9YCk7XG4gICAgICAgIHRoaXMuZGVzaWduRGlyID0gUEFUSC5qb2luKHRoaXMuY29uZmlnRGlyX0FwcCwgJ2Rlc2lnbicpO1xuICAgIH1cblxuICAgIGxvYWRFbnZpcm9ubWVudEZpbGUoKSB7XG4gICAgICAgIC8vIGNvcHkgcHJvcHMgdG8gdGhlIGNvbmZpZyBwcm9wZXJ0eSBvYmplY3Qgb24gdGhpcyBjbGFzc1xuICAgICAgICBKc1V0aWwubWFwVG9OZXdPYmplY3QoZW52aXJvbm1lbnQsIHRoaXMuY29uZmlnKSA7XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coXCI9PT09PT09PSBDb25maWcgPT09PT09PT09PVwiKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5jb25maWcpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIj09PT09PT09PT09PT09PT09PT09PT09PT09XCIpO1xuICAgIH1cblxuICAgIHByZXBhcmVQdWJTdWIoKSB7XG4gICAgICAgIC8vIHdlcmUgbm90IHVzaW5nIGlvYyBpbiB0aGlzIGNhc2UsIGJlY2F1c2UgaXQgcmVxdXJlcyBhIEBpbmplY3RhYmxlIGFubm90YXRpb24gd2hpY2ggaXMgaW52ZXJzaWZ5XG4gICAgICAgIHRoaXMucHVic3ViID0gbmV3IFB1YlN1YlNlcnZpY2UoKTtcbiAgICAgICAgLy8gd2UgaGF2ZSB0byBkbyB0aGlzIGZyb20gaGVyZSwgYmVjYXVzZSBBcHBJbmZvIG11c3QgYmUgYXZhaWxhYmxlIChwdWJzdWIgaXMgY3JlYXRlZCBmaXJzdClcbiAgICAgICAgdGhpcy5wdWJzdWIuY29uZmlndXJlVXNpbmdQdWJTdWJUb3BpY1dpdGhvdXRFdmVudE9wdGlvbnMoKTtcblxuICAgICAgICAvLyBhZGQgaW4sIG1vcmUgZGVmaW5lZCBldmVudHMgaGVyZVxuICAgICAgICBFdmVudERlc2NyaXB0b3IuQ3JlYXRlKFB1YlN1YlRvcGljLnBvdXJDb21wbGV0ZSkuR29lc1RvQ2xpZW50KCk7XG5cbiAgICAgICAgRXZlbnREZXNjcmlwdG9yLkNyZWF0ZShQdWJTdWJUb3BpYy5waW5nQ2xpZW50KVxuICAgICAgICAgICAgLldpdGhBQnVmZmVyU2l6ZU9mKDEpXG4gICAgICAgICAgICAuR29lc1RvQ2xpZW50KCk7XG5cbiAgICAgICAgRXZlbnREZXNjcmlwdG9yLkNyZWF0ZShQdWJTdWJUb3BpYy5waW5nU2VydmVyQWNrKVxuICAgICAgICAgICAgLldpdGhBQnVmZmVyU2l6ZU9mKDEpXG4gICAgICAgICAgICAuR29lc1RvQ2xpZW50KCk7XG5cbiAgICAgICAgRXZlbnREZXNjcmlwdG9yLkNyZWF0ZShQdWJTdWJUb3BpYy5vdXRPZk9yZGVyQ2hhbmdlZClcbiAgICAgICAgICAgIC5XaXRoQUJ1ZmZlclNpemVPZigxKVxuICAgICAgICAgICAgLkdvZXNUb0NsaWVudCgpO1xuICAgIH1cblxufVxuIl19
