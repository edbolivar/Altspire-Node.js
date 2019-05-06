import {inject, injectable} from 'inversify';
import {JsUtil} from "../universal/JsUtil";
import * as inversify from "inversify";
import * as express from 'express';
import * as http from "http";
import * as socketIo from "socket.io";
import * as cors from "cors";
import {AppInfoService} from "../services/app-info.service";
import TYPES from "../server.types";
import {PublishEvent, PubSubEventArgs, SubscribeEvent} from "../universal/pub-sub-types";
import {PubSubTopic} from "../universal/pub-sub-types";

@injectable()
export class SocketService {
    objectId: number ;
    socket: any ;

    constructor(@inject(TYPES.AppInfo) private appInfo: AppInfoService) {
        this.objectId = JsUtil.getObjectId();
        console.log("ctor.SocketService", this.objectId);
        this.startSocketServer();
        this.subscribeToClientEvents();
    }

    startSocketServer() {
        const self = this;

        // CORS middleware
        const allowCrossDomain = function(req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type');

            next();
        }

        const socketApp = express();
        socketApp.use(allowCrossDomain);

        const socketServer = require('http').createServer(socketApp);
        const io: any = socketIo(socketServer) ;

        // wire up the socket server to the pubsub
        this.appInfo.pubsub.socketClient = this ;

        socketServer.listen(this.appInfo.config.socketPort);
        console.log(`Socket Server is listening on ${this.appInfo.config.socketPort}`);

        io.on('connect', (socket: any) => { self.onClientConnect(socket)});

    }

    subscribeToClientEvents() {
        const self = this ;

        SubscribeEvent.Create(PubSubTopic.pingServer, this.objectId)
            .HandleEventWithThisMethod(function(e: PubSubEventArgs){
                console.log("Received Ping From Client");
                PublishEvent.Create(PubSubTopic.pingServerAck, self.objectId )
                    .Send();
            }).Done();

        SubscribeEvent.Create(PubSubTopic.switchToServiceUI, this.objectId)
            .HandleEventWithThisMethod(function(e: PubSubEventArgs){
                console.log("Received switchToServiceUI From Client");
            }).Done();

        SubscribeEvent.Create(PubSubTopic.pingClientAck, this.objectId)
            .HandleEventWithThisMethod(function(e: PubSubEventArgs){
                console.log("Received pingClientAck From Client");
            }).Done();


        setInterval(function(){
            console.log("sending ping to client");
            PublishEvent.Create(PubSubTopic.pingClient, self.objectId)
                .Send();
        }, 60000);
    }


    onClientConnect(socket: any) {
        const self = this ;
        self.socket = socket ;

        socket.on('ClientToServer', (pubsubEventArgsAsString: string) => {
            // get the stringified message and make it back to json before
            // sending it on
            let e = JSON.parse(pubsubEventArgsAsString) ;
            self.onMessageFromClient(e);
        });

        socket.on('disconnect', () => {
            self.onDisconnectFromClient();
            // self.socket = null ;
        });
    }

    onMessageFromClient(e: PubSubEventArgs) {
        console.log("SocketService.FromClient:", e.pubsubTopic, e) ;

        PublishEvent.Create(e.pubsubTopic, e.sourceObjectId)
            .SetDataArgumentTo(e.data)
            .Send();
    }

    onDisconnectFromClient() {
        console.log("client disconnected==>")
    }

    
    
    send(e: PubSubEventArgs) {
        if (this.socket) {
            console.log("Sending To Client", e);
            this.socket.emit('ServerToClient', JSON.stringify(e));
        }
    }

}
