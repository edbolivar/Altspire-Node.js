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
var inversify_1 = require("inversify");
var JsUtil_1 = require("../universal/JsUtil");
var express = require("express");
var socketIo = require("socket.io");
var app_info_service_1 = require("../services/app-info.service");
var server_types_1 = require("../server.types");
var pub_sub_types_1 = require("../universal/pub-sub-types");
var pub_sub_types_2 = require("../universal/pub-sub-types");
var SocketService = /** @class */ (function () {
    function SocketService(appInfo) {
        this.appInfo = appInfo;
        this.objectId = JsUtil_1.JsUtil.getObjectId();
        console.log("ctor.SocketService", this.objectId);
        this.startSocketServer();
        this.subscribeToClientEvents();
    }
    SocketService.prototype.startSocketServer = function () {
        var self = this;
        // CORS middleware
        var allowCrossDomain = function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            next();
        };
        var socketApp = express();
        socketApp.use(allowCrossDomain);
        var socketServer = require('http').createServer(socketApp);
        var io = socketIo(socketServer);
        // wire up the socket server to the pubsub
        this.appInfo.pubsub.socketClient = this;
        socketServer.listen(this.appInfo.config.socketPort);
        console.log("Socket Server is listening on " + this.appInfo.config.socketPort);
        io.on('connect', function (socket) { self.onClientConnect(socket); });
    };
    SocketService.prototype.subscribeToClientEvents = function () {
        var self = this;
        pub_sub_types_1.SubscribeEvent.Create(pub_sub_types_2.PubSubTopic.pingServer, this.objectId)
            .HandleEventWithThisMethod(function (e) {
            console.log("Received Ping From Client");
            pub_sub_types_1.PublishEvent.Create(pub_sub_types_2.PubSubTopic.pingServerAck, self.objectId)
                .Send();
        }).Done();
        pub_sub_types_1.SubscribeEvent.Create(pub_sub_types_2.PubSubTopic.switchToServiceUI, this.objectId)
            .HandleEventWithThisMethod(function (e) {
            console.log("Received switchToServiceUI From Client");
        }).Done();
        pub_sub_types_1.SubscribeEvent.Create(pub_sub_types_2.PubSubTopic.pingClientAck, this.objectId)
            .HandleEventWithThisMethod(function (e) {
            console.log("Received pingClientAck From Client");
        }).Done();
        setInterval(function () {
            console.log("sending ping to client");
            pub_sub_types_1.PublishEvent.Create(pub_sub_types_2.PubSubTopic.pingClient, self.objectId)
                .Send();
        }, 60000);
    };
    SocketService.prototype.onClientConnect = function (socket) {
        var self = this;
        self.socket = socket;
        socket.on('ClientToServer', function (pubsubEventArgsAsString) {
            // get the stringified message and make it back to json before
            // sending it on
            var e = JSON.parse(pubsubEventArgsAsString);
            self.onMessageFromClient(e);
        });
        socket.on('disconnect', function () {
            self.onDisconnectFromClient();
            // self.socket = null ;
        });
    };
    SocketService.prototype.onMessageFromClient = function (e) {
        console.log("SocketService.FromClient:", e.pubsubTopic, e);
        pub_sub_types_1.PublishEvent.Create(e.pubsubTopic, e.sourceObjectId)
            .SetDataArgumentTo(e.data)
            .Send();
    };
    SocketService.prototype.onDisconnectFromClient = function () {
        console.log("client disconnected==>");
    };
    SocketService.prototype.send = function (e) {
        if (this.socket) {
            console.log("Sending To Client", e);
            this.socket.emit('ServerToClient', JSON.stringify(e));
        }
    };
    SocketService = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(server_types_1.default.AppInfo)),
        __metadata("design:paramtypes", [app_info_service_1.AppInfoService])
    ], SocketService);
    return SocketService;
}());
exports.SocketService = SocketService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUM7YUFDL0MsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQzthQUN6QixJQUFJLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsOENBQXNCLEdBQXRCO1FBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO0lBQ3pDLENBQUM7SUFJRCw0QkFBSSxHQUFKLFVBQUssQ0FBa0I7UUFDbkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRCxDQUFDO0lBQ0wsQ0FBQztJQXhHUSxhQUFhO1FBRHpCLHNCQUFVLEVBQUU7UUFLSSxXQUFBLGtCQUFNLENBQUMsc0JBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTt5Q0FBa0IsaUNBQWM7T0FKekQsYUFBYSxDQTBHekI7SUFBRCxvQkFBQztDQTFHRCxBQTBHQyxJQUFBO0FBMUdZLHNDQUFhIiwiZmlsZSI6InNvY2tldC9zb2NrZXQtc2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aW5qZWN0LCBpbmplY3RhYmxlfSBmcm9tICdpbnZlcnNpZnknO1xuaW1wb3J0IHtKc1V0aWx9IGZyb20gXCIuLi91bml2ZXJzYWwvSnNVdGlsXCI7XG5pbXBvcnQgKiBhcyBpbnZlcnNpZnkgZnJvbSBcImludmVyc2lmeVwiO1xuaW1wb3J0ICogYXMgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCAqIGFzIGh0dHAgZnJvbSBcImh0dHBcIjtcbmltcG9ydCAqIGFzIHNvY2tldElvIGZyb20gXCJzb2NrZXQuaW9cIjtcbmltcG9ydCAqIGFzIGNvcnMgZnJvbSBcImNvcnNcIjtcbmltcG9ydCB7QXBwSW5mb1NlcnZpY2V9IGZyb20gXCIuLi9zZXJ2aWNlcy9hcHAtaW5mby5zZXJ2aWNlXCI7XG5pbXBvcnQgVFlQRVMgZnJvbSBcIi4uL3NlcnZlci50eXBlc1wiO1xuaW1wb3J0IHtQdWJsaXNoRXZlbnQsIFB1YlN1YkV2ZW50QXJncywgU3Vic2NyaWJlRXZlbnR9IGZyb20gXCIuLi91bml2ZXJzYWwvcHViLXN1Yi10eXBlc1wiO1xuaW1wb3J0IHtQdWJTdWJUb3BpY30gZnJvbSBcIi4uL3VuaXZlcnNhbC9wdWItc3ViLXR5cGVzXCI7XG5cbkBpbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTb2NrZXRTZXJ2aWNlIHtcbiAgICBvYmplY3RJZDogbnVtYmVyIDtcbiAgICBzb2NrZXQ6IGFueSA7XG5cbiAgICBjb25zdHJ1Y3RvcihAaW5qZWN0KFRZUEVTLkFwcEluZm8pIHByaXZhdGUgYXBwSW5mbzogQXBwSW5mb1NlcnZpY2UpIHtcbiAgICAgICAgdGhpcy5vYmplY3RJZCA9IEpzVXRpbC5nZXRPYmplY3RJZCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcImN0b3IuU29ja2V0U2VydmljZVwiLCB0aGlzLm9iamVjdElkKTtcbiAgICAgICAgdGhpcy5zdGFydFNvY2tldFNlcnZlcigpO1xuICAgICAgICB0aGlzLnN1YnNjcmliZVRvQ2xpZW50RXZlbnRzKCk7XG4gICAgfVxuXG4gICAgc3RhcnRTb2NrZXRTZXJ2ZXIoKSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIC8vIENPUlMgbWlkZGxld2FyZVxuICAgICAgICBjb25zdCBhbGxvd0Nyb3NzRG9tYWluID0gZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICAgICAgICAgIHJlcy5oZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicsICcqJyk7XG4gICAgICAgICAgICByZXMuaGVhZGVyKCdBY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJywgJ0dFVCxQVVQsUE9TVCxERUxFVEUnKTtcbiAgICAgICAgICAgIHJlcy5oZWFkZXIoJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnLCAnQ29udGVudC1UeXBlJyk7XG5cbiAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNvY2tldEFwcCA9IGV4cHJlc3MoKTtcbiAgICAgICAgc29ja2V0QXBwLnVzZShhbGxvd0Nyb3NzRG9tYWluKTtcblxuICAgICAgICBjb25zdCBzb2NrZXRTZXJ2ZXIgPSByZXF1aXJlKCdodHRwJykuY3JlYXRlU2VydmVyKHNvY2tldEFwcCk7XG4gICAgICAgIGNvbnN0IGlvOiBhbnkgPSBzb2NrZXRJbyhzb2NrZXRTZXJ2ZXIpIDtcblxuICAgICAgICAvLyB3aXJlIHVwIHRoZSBzb2NrZXQgc2VydmVyIHRvIHRoZSBwdWJzdWJcbiAgICAgICAgdGhpcy5hcHBJbmZvLnB1YnN1Yi5zb2NrZXRDbGllbnQgPSB0aGlzIDtcblxuICAgICAgICBzb2NrZXRTZXJ2ZXIubGlzdGVuKHRoaXMuYXBwSW5mby5jb25maWcuc29ja2V0UG9ydCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGBTb2NrZXQgU2VydmVyIGlzIGxpc3RlbmluZyBvbiAke3RoaXMuYXBwSW5mby5jb25maWcuc29ja2V0UG9ydH1gKTtcblxuICAgICAgICBpby5vbignY29ubmVjdCcsIChzb2NrZXQ6IGFueSkgPT4geyBzZWxmLm9uQ2xpZW50Q29ubmVjdChzb2NrZXQpfSk7XG5cbiAgICB9XG5cbiAgICBzdWJzY3JpYmVUb0NsaWVudEV2ZW50cygpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXMgO1xuXG4gICAgICAgIFN1YnNjcmliZUV2ZW50LkNyZWF0ZShQdWJTdWJUb3BpYy5waW5nU2VydmVyLCB0aGlzLm9iamVjdElkKVxuICAgICAgICAgICAgLkhhbmRsZUV2ZW50V2l0aFRoaXNNZXRob2QoZnVuY3Rpb24oZTogUHViU3ViRXZlbnRBcmdzKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlY2VpdmVkIFBpbmcgRnJvbSBDbGllbnRcIik7XG4gICAgICAgICAgICAgICAgUHVibGlzaEV2ZW50LkNyZWF0ZShQdWJTdWJUb3BpYy5waW5nU2VydmVyQWNrLCBzZWxmLm9iamVjdElkIClcbiAgICAgICAgICAgICAgICAgICAgLlNlbmQoKTtcbiAgICAgICAgICAgIH0pLkRvbmUoKTtcblxuICAgICAgICBTdWJzY3JpYmVFdmVudC5DcmVhdGUoUHViU3ViVG9waWMuc3dpdGNoVG9TZXJ2aWNlVUksIHRoaXMub2JqZWN0SWQpXG4gICAgICAgICAgICAuSGFuZGxlRXZlbnRXaXRoVGhpc01ldGhvZChmdW5jdGlvbihlOiBQdWJTdWJFdmVudEFyZ3Mpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVjZWl2ZWQgc3dpdGNoVG9TZXJ2aWNlVUkgRnJvbSBDbGllbnRcIik7XG4gICAgICAgICAgICB9KS5Eb25lKCk7XG5cbiAgICAgICAgU3Vic2NyaWJlRXZlbnQuQ3JlYXRlKFB1YlN1YlRvcGljLnBpbmdDbGllbnRBY2ssIHRoaXMub2JqZWN0SWQpXG4gICAgICAgICAgICAuSGFuZGxlRXZlbnRXaXRoVGhpc01ldGhvZChmdW5jdGlvbihlOiBQdWJTdWJFdmVudEFyZ3Mpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUmVjZWl2ZWQgcGluZ0NsaWVudEFjayBGcm9tIENsaWVudFwiKTtcbiAgICAgICAgICAgIH0pLkRvbmUoKTtcblxuXG4gICAgICAgIHNldEludGVydmFsKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNlbmRpbmcgcGluZyB0byBjbGllbnRcIik7XG4gICAgICAgICAgICBQdWJsaXNoRXZlbnQuQ3JlYXRlKFB1YlN1YlRvcGljLnBpbmdDbGllbnQsIHNlbGYub2JqZWN0SWQpXG4gICAgICAgICAgICAgICAgLlNlbmQoKTtcbiAgICAgICAgfSwgNjAwMDApO1xuICAgIH1cblxuXG4gICAgb25DbGllbnRDb25uZWN0KHNvY2tldDogYW55KSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzIDtcbiAgICAgICAgc2VsZi5zb2NrZXQgPSBzb2NrZXQgO1xuXG4gICAgICAgIHNvY2tldC5vbignQ2xpZW50VG9TZXJ2ZXInLCAocHVic3ViRXZlbnRBcmdzQXNTdHJpbmc6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgLy8gZ2V0IHRoZSBzdHJpbmdpZmllZCBtZXNzYWdlIGFuZCBtYWtlIGl0IGJhY2sgdG8ganNvbiBiZWZvcmVcbiAgICAgICAgICAgIC8vIHNlbmRpbmcgaXQgb25cbiAgICAgICAgICAgIGxldCBlID0gSlNPTi5wYXJzZShwdWJzdWJFdmVudEFyZ3NBc1N0cmluZykgO1xuICAgICAgICAgICAgc2VsZi5vbk1lc3NhZ2VGcm9tQ2xpZW50KGUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBzb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCAoKSA9PiB7XG4gICAgICAgICAgICBzZWxmLm9uRGlzY29ubmVjdEZyb21DbGllbnQoKTtcbiAgICAgICAgICAgIC8vIHNlbGYuc29ja2V0ID0gbnVsbCA7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uTWVzc2FnZUZyb21DbGllbnQoZTogUHViU3ViRXZlbnRBcmdzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU29ja2V0U2VydmljZS5Gcm9tQ2xpZW50OlwiLCBlLnB1YnN1YlRvcGljLCBlKSA7XG5cbiAgICAgICAgUHVibGlzaEV2ZW50LkNyZWF0ZShlLnB1YnN1YlRvcGljLCBlLnNvdXJjZU9iamVjdElkKVxuICAgICAgICAgICAgLlNldERhdGFBcmd1bWVudFRvKGUuZGF0YSlcbiAgICAgICAgICAgIC5TZW5kKCk7XG4gICAgfVxuXG4gICAgb25EaXNjb25uZWN0RnJvbUNsaWVudCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJjbGllbnQgZGlzY29ubmVjdGVkPT0+XCIpXG4gICAgfVxuXG4gICAgXG4gICAgXG4gICAgc2VuZChlOiBQdWJTdWJFdmVudEFyZ3MpIHtcbiAgICAgICAgaWYgKHRoaXMuc29ja2V0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNlbmRpbmcgVG8gQ2xpZW50XCIsIGUpO1xuICAgICAgICAgICAgdGhpcy5zb2NrZXQuZW1pdCgnU2VydmVyVG9DbGllbnQnLCBKU09OLnN0cmluZ2lmeShlKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiJdfQ==
