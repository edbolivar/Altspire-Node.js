"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsUtil_1 = require("./JsUtil");
var app_info_service_1 = require("../services/app-info.service");
var PubSubTopic = /** @class */ (function () {
    function PubSubTopic() {
    }
    PubSubTopic.pourComplete = 'pour.complete';
    PubSubTopic.leftNavToggleVisibility = 'leftnav.toggle.visibility';
    PubSubTopic.onLogin = 'user.login';
    PubSubTopic.onLogout = 'user.logout';
    PubSubTopic.testEvent = 'test.event';
    PubSubTopic.buttonGesture = 'button.gesture';
    PubSubTopic.buttonSelect = 'button.select';
    PubSubTopic.unitStateChange = "unitstate.changed";
    PubSubTopic.pdmDataReady = 'product.datamodel.ready';
    PubSubTopic.start = 'start';
    PubSubTopic.stop = 'stop';
    PubSubTopic.testIODriver = "test.iodriver.event";
    PubSubTopic.popupDialog = "popup.dialog";
    PubSubTopic.testSendToServer = 'test.send.to.server';
    PubSubTopic.testSendToClient = 'test.send.to.client';
    // --- client to server ---
    PubSubTopic.switchToServiceUI = 'switchToServiceUI';
    PubSubTopic.pingServer = "pingServer";
    PubSubTopic.pingClientAck = 'pingClientAck';
    PubSubTopic.startPour = 'start.pour';
    PubSubTopic.stopPour = 'stop.pour';
    // --- server to client ---
    PubSubTopic.configurationChanged = 'configurationChanged';
    PubSubTopic.pingClient = "pingClient";
    PubSubTopic.pingServerAck = "pingServerAck";
    PubSubTopic.outOfOrderChanged = 'outoforder.changed';
    PubSubTopic.adaKeyPressed = 'adaKeyPressed';
    PubSubTopic.notifyKeyEvent = 'notifyKeyEvent';
    PubSubTopic.notifyBrandButtonChangeSelected = 'notifyBrandButtonChangeSelected';
    PubSubTopic.adaModeChanged = 'adaModeChanged';
    PubSubTopic.resetApp = 'resetApp';
    PubSubTopic.changeDx3Lighting = 'changeDx3Lighting';
    return PubSubTopic;
}());
exports.PubSubTopic = PubSubTopic;
var PubSubItem = /** @class */ (function () {
    function PubSubItem(pubsubTopic) {
        this.pubsubTopic = pubsubTopic;
        this.events = [];
    }
    return PubSubItem;
}());
exports.PubSubItem = PubSubItem;
var PubSubSubscriptionToken = /** @class */ (function () {
    function PubSubSubscriptionToken(pubsubTopic, callback, consumerObjectId, filter) {
        this.consumerObjectId = 0;
        this.id = JsUtil_1.JsUtil.generateId();
        this.isActive = true;
        this.allowMultipleSubscriptionsSameEventSameConsumer = false;
        this.sendCurrentEventOnly = false;
        this.consumerObjectId = consumerObjectId;
        this.pubsubTopic = pubsubTopic;
        this.filterPredicate = filter;
        this.actionCallback = callback;
    }
    return PubSubSubscriptionToken;
}());
exports.PubSubSubscriptionToken = PubSubSubscriptionToken;
var PubSubEventArgs = /** @class */ (function () {
    /**
     * @param sourceObjectId should be specified WHEN the consumer there are multiple publishers of the same event, and it matters
     */
    function PubSubEventArgs(pubsubTopic, data, sourceObjectId) {
        if (sourceObjectId === void 0) { sourceObjectId = 0; }
        // were being explicit here so it is easy to read.
        this.pubsubTopic = pubsubTopic;
        this.data = data;
        this.sourceObjectId = sourceObjectId;
    }
    return PubSubEventArgs;
}());
exports.PubSubEventArgs = PubSubEventArgs;
var SubscribeEvent = /** @class */ (function () {
    function SubscribeEvent() {
    }
    SubscribeEvent.Create = function (pubsubTopic, objectIdOfSubscriber) {
        var subscribeEvent = new SubscribeEvent();
        subscribeEvent.subscriptionToken = new PubSubSubscriptionToken(pubsubTopic, null, objectIdOfSubscriber, null);
        return subscribeEvent;
    };
    SubscribeEvent.UnSubscribeByToken = function (subscriptionToken) {
        app_info_service_1.AppInfoService.instance.pubsub.unsubscribeByToken(subscriptionToken);
    };
    SubscribeEvent.UnSubscribeByConsumer = function (objectId) {
        app_info_service_1.AppInfoService.instance.pubsub.unsubscribeByConsumer(objectId);
    };
    SubscribeEvent.prototype.HandleEventWithThisMethod = function (actionCallback) {
        this.subscriptionToken.actionCallback = actionCallback;
        return this;
    };
    SubscribeEvent.prototype.ApplyFilterPredicate = function (filterPredicate) {
        this.subscriptionToken.filterPredicate = filterPredicate;
        return this;
    };
    SubscribeEvent.prototype.AllowMultipleSubscriptionsSameEventSameConsumer = function () {
        this.subscriptionToken.allowMultipleSubscriptionsSameEventSameConsumer = true;
        return this;
    };
    SubscribeEvent.prototype.SendCurrentEventOnly = function () {
        this.subscriptionToken.sendCurrentEventOnly = true;
        return this;
    };
    SubscribeEvent.prototype.Done = function () {
        app_info_service_1.AppInfoService.instance.pubsub.subscribe(this.subscriptionToken);
        return this;
    };
    return SubscribeEvent;
}());
exports.SubscribeEvent = SubscribeEvent;
var PublishEvent = /** @class */ (function () {
    function PublishEvent() {
    }
    PublishEvent.Create = function (pubsubTopic, objectIdOfPublisher) {
        var publishEvent = new PublishEvent();
        publishEvent.eventArgs = new PubSubEventArgs(pubsubTopic, "", objectIdOfPublisher);
        return publishEvent;
    };
    PublishEvent.prototype.SetDataArgumentTo = function (data) {
        this.eventArgs.data = data;
        return this;
    };
    PublishEvent.prototype.Send = function () {
        app_info_service_1.AppInfoService.instance.pubsub.publish(this.eventArgs);
        return this;
    };
    return PublishEvent;
}());
exports.PublishEvent = PublishEvent;
var EventDescriptor = /** @class */ (function () {
    function EventDescriptor() {
        this.eventBufferSize = 5;
        this.isSocket = false;
        this.events = [];
        this.dataArgumentType = "";
        this.isSendToServer = false;
        this.isSendToClient = false;
    }
    EventDescriptor.Create = function (pubsubTopic) {
        var eventDescriptor = new EventDescriptor();
        eventDescriptor.pubsubTopic = pubsubTopic;
        // let's add it to appInfo, keep the external interface clean
        app_info_service_1.AppInfoService.instance.pubsub.addEventDescriptor(eventDescriptor);
        return eventDescriptor;
    };
    EventDescriptor.prototype.WithABufferSizeOf = function (n) {
        this.eventBufferSize = n;
        return this;
    };
    EventDescriptor.prototype.GoesToServer = function () {
        this.isSocket = true;
        this.isSendToServer = true;
        return this;
    };
    EventDescriptor.prototype.GoesToClient = function () {
        this.isSocket = true;
        this.isSendToClient = true;
        return this;
    };
    EventDescriptor.prototype.DataArgumentTypeAsString = function (argType) {
        this.dataArgumentType = argType;
        return this;
    };
    return EventDescriptor;
}());
exports.EventDescriptor = EventDescriptor;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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Qy9CLElBQU0sZUFBZSxHQUFHLElBQUksZUFBZSxFQUFFLENBQUM7UUFDOUMsZUFBZSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUU7UUFFM0MsNkRBQTZEO1FBQzdELGlDQUFjLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsQ0FBRTtRQUNwRSxNQUFNLENBQUMsZUFBZSxDQUFFO0lBQzFCLENBQUM7SUFFRCwyQ0FBaUIsR0FBakIsVUFBa0IsQ0FBUztRQUN6QixJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBRTtRQUMxQixNQUFNLENBQUMsSUFBSSxDQUFFO0lBQ2YsQ0FBQztJQUVELHNDQUFZLEdBQVo7UUFDRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBRTtRQUN0QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztRQUMzQixNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELHNDQUFZLEdBQVo7UUFDRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBRTtRQUN0QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztRQUMzQixNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELGtEQUF3QixHQUF4QixVQUF5QixPQUFlO1FBQ3RDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxPQUFPLENBQUU7UUFDakMsTUFBTSxDQUFDLElBQUksQ0FBRTtJQUNmLENBQUM7SUFDSCxzQkFBQztBQUFELENBdkNBLEFBdUNDLElBQUE7QUF2Q1ksMENBQWUiLCJmaWxlIjoidW5pdmVyc2FsL3B1Yi1zdWItdHlwZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0pzVXRpbH0gZnJvbSBcIi4vSnNVdGlsXCI7XG5pbXBvcnQge09ic2VydmVyfSBmcm9tIFwicnhqcy9PYnNlcnZlclwiO1xuaW1wb3J0IHtQdWJTdWJTZXJ2aWNlfSBmcm9tICcuL3B1Yi1zdWIuc2VydmljZSc7XG5pbXBvcnQge0FwcEluZm9TZXJ2aWNlfSBmcm9tICcuLi9zZXJ2aWNlcy9hcHAtaW5mby5zZXJ2aWNlJztcblxuXG5leHBvcnQgY2xhc3MgUHViU3ViVG9waWMge1xuXG5cbiAgc3RhdGljIHBvdXJDb21wbGV0ZSA9ICdwb3VyLmNvbXBsZXRlJztcblxuICBzdGF0aWMgbGVmdE5hdlRvZ2dsZVZpc2liaWxpdHkgPSAnbGVmdG5hdi50b2dnbGUudmlzaWJpbGl0eScgO1xuICBzdGF0aWMgb25Mb2dpbiAgPSAndXNlci5sb2dpbicgICAgO1xuICBzdGF0aWMgb25Mb2dvdXQgID0gJ3VzZXIubG9nb3V0JyA7XG4gIHN0YXRpYyB0ZXN0RXZlbnQgID0gJ3Rlc3QuZXZlbnQnIDtcblxuXG4gIHN0YXRpYyBidXR0b25HZXN0dXJlICA9ICdidXR0b24uZ2VzdHVyZScgO1xuICBzdGF0aWMgYnV0dG9uU2VsZWN0ICA9ICdidXR0b24uc2VsZWN0JyA7XG5cbiAgc3RhdGljIHVuaXRTdGF0ZUNoYW5nZSA9IFwidW5pdHN0YXRlLmNoYW5nZWRcIjtcblxuICBzdGF0aWMgcGRtRGF0YVJlYWR5ICA9ICdwcm9kdWN0LmRhdGFtb2RlbC5yZWFkeScgO1xuXG5cbiAgc3RhdGljIHN0YXJ0ICA9ICdzdGFydCcgO1xuICBzdGF0aWMgc3RvcCAgPSAnc3RvcCcgO1xuXG5cbiAgc3RhdGljIHRlc3RJT0RyaXZlciA9IFwidGVzdC5pb2RyaXZlci5ldmVudFwiO1xuICBzdGF0aWMgcG9wdXBEaWFsb2cgPSBcInBvcHVwLmRpYWxvZ1wiO1xuXG4gIHN0YXRpYyB0ZXN0U2VuZFRvU2VydmVyICA9ICd0ZXN0LnNlbmQudG8uc2VydmVyJyA7XG4gIHN0YXRpYyB0ZXN0U2VuZFRvQ2xpZW50ICA9ICd0ZXN0LnNlbmQudG8uY2xpZW50JyA7XG5cblxuICAvLyAtLS0gY2xpZW50IHRvIHNlcnZlciAtLS1cbiAgc3RhdGljIHN3aXRjaFRvU2VydmljZVVJID0gJ3N3aXRjaFRvU2VydmljZVVJJztcbiAgc3RhdGljIHBpbmdTZXJ2ZXIgPSBcInBpbmdTZXJ2ZXJcIjtcbiAgc3RhdGljIHBpbmdDbGllbnRBY2sgPSAncGluZ0NsaWVudEFjayc7XG5cbiAgc3RhdGljIHN0YXJ0UG91ciA9ICdzdGFydC5wb3VyJztcbiAgc3RhdGljIHN0b3BQb3VyID0gJ3N0b3AucG91cic7XG5cblxuICAvLyAtLS0gc2VydmVyIHRvIGNsaWVudCAtLS1cbiAgc3RhdGljIGNvbmZpZ3VyYXRpb25DaGFuZ2VkID0gJ2NvbmZpZ3VyYXRpb25DaGFuZ2VkJztcbiAgc3RhdGljIHBpbmdDbGllbnQgPSBcInBpbmdDbGllbnRcIjtcbiAgc3RhdGljIHBpbmdTZXJ2ZXJBY2sgPSBcInBpbmdTZXJ2ZXJBY2tcIjtcblxuICBzdGF0aWMgb3V0T2ZPcmRlckNoYW5nZWQgPSAnb3V0b2ZvcmRlci5jaGFuZ2VkJztcblxuICBzdGF0aWMgYWRhS2V5UHJlc3NlZCA9ICdhZGFLZXlQcmVzc2VkJzsgXG4gIHN0YXRpYyBub3RpZnlLZXlFdmVudCA9ICdub3RpZnlLZXlFdmVudCc7XG4gIHN0YXRpYyBub3RpZnlCcmFuZEJ1dHRvbkNoYW5nZVNlbGVjdGVkID0gJ25vdGlmeUJyYW5kQnV0dG9uQ2hhbmdlU2VsZWN0ZWQnO1xuICBzdGF0aWMgYWRhTW9kZUNoYW5nZWQgPSAnYWRhTW9kZUNoYW5nZWQnO1xuICBzdGF0aWMgcmVzZXRBcHAgPSAncmVzZXRBcHAnO1xuICBzdGF0aWMgY2hhbmdlRHgzTGlnaHRpbmcgPSAnY2hhbmdlRHgzTGlnaHRpbmcnO1xufVxuXG5cbmV4cG9ydCBjbGFzcyBQdWJTdWJJdGVte1xuICBldmVudHM6IFB1YlN1YkV2ZW50QXJnc1tdID0gW107XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwdWJzdWJUb3BpYzogc3RyaW5nKXt9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJlZGljYXRlPFQ+IHtcbiAgKGl0ZW06IFQpOiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgUHViU3ViU3Vic2NyaXB0aW9uVG9rZW4ge1xuICBvYmplY3RJZDogbnVtYmVyIDtcbiAgY29uc3VtZXJPYmplY3RJZDogbnVtYmVyID0gMCA7XG4gIHB1YnN1YlRvcGljOiBzdHJpbmcgO1xuICBmaWx0ZXJQcmVkaWNhdGU6IFByZWRpY2F0ZTxQdWJTdWJFdmVudEFyZ3M+IDtcbiAgaWQ6IHN0cmluZyA9IEpzVXRpbC5nZW5lcmF0ZUlkKCkgO1xuICBhY3Rpb25DYWxsYmFjazogKHJlc3BvbnNlKSA9PiB2b2lkO1xuICB0YWc6IGFueSA7XG4gIGlzQWN0aXZlOiBib29sZWFuID0gdHJ1ZTtcbiAgYWxsb3dNdWx0aXBsZVN1YnNjcmlwdGlvbnNTYW1lRXZlbnRTYW1lQ29uc3VtZXI6IGJvb2xlYW4gPSBmYWxzZSA7XG4gIHNlbmRDdXJyZW50RXZlbnRPbmx5OiBib29sZWFuID0gZmFsc2UgO1xuXG4gIGNvbnN0cnVjdG9yKHB1YnN1YlRvcGljOiBzdHJpbmcsIGNhbGxiYWNrOiAocmVzcG9uc2UpID0+IHZvaWQsIGNvbnN1bWVyT2JqZWN0SWQ6IG51bWJlciwgZmlsdGVyPyA6IFByZWRpY2F0ZTxQdWJTdWJFdmVudEFyZ3M+KXtcbiAgICB0aGlzLmNvbnN1bWVyT2JqZWN0SWQgPSBjb25zdW1lck9iamVjdElkIDtcbiAgICB0aGlzLnB1YnN1YlRvcGljID0gcHVic3ViVG9waWMgO1xuICAgIHRoaXMuZmlsdGVyUHJlZGljYXRlID0gZmlsdGVyIDtcbiAgICB0aGlzLmFjdGlvbkNhbGxiYWNrID0gY2FsbGJhY2sgO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFB1YlN1YkV2ZW50QXJncyB7XG4gIHB1YnN1YlRvcGljIDogc3RyaW5nIDtcbiAgZGF0YSA6IGFueSA7XG4gIHNvdXJjZU9iamVjdElkIDogbnVtYmVyIDtcblxuICAvKipcbiAgICogQHBhcmFtIHNvdXJjZU9iamVjdElkIHNob3VsZCBiZSBzcGVjaWZpZWQgV0hFTiB0aGUgY29uc3VtZXIgdGhlcmUgYXJlIG11bHRpcGxlIHB1Ymxpc2hlcnMgb2YgdGhlIHNhbWUgZXZlbnQsIGFuZCBpdCBtYXR0ZXJzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwdWJzdWJUb3BpYzogc3RyaW5nLCBkYXRhOiBhbnksIHNvdXJjZU9iamVjdElkIDogbnVtYmVyID0gMCl7XG4gICAgLy8gd2VyZSBiZWluZyBleHBsaWNpdCBoZXJlIHNvIGl0IGlzIGVhc3kgdG8gcmVhZC5cbiAgICB0aGlzLnB1YnN1YlRvcGljID0gcHVic3ViVG9waWMgO1xuICAgIHRoaXMuZGF0YSA9IGRhdGEgO1xuICAgIHRoaXMuc291cmNlT2JqZWN0SWQgPSBzb3VyY2VPYmplY3RJZCA7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFN1YnNjcmliZUV2ZW50IHtcbiAgc3Vic2NyaXB0aW9uVG9rZW46IFB1YlN1YlN1YnNjcmlwdGlvblRva2VuO1xuXG4gIHN0YXRpYyBDcmVhdGUocHVic3ViVG9waWM6IHN0cmluZywgb2JqZWN0SWRPZlN1YnNjcmliZXI6IG51bWJlcik6IFN1YnNjcmliZUV2ZW50IHtcbiAgICBjb25zdCBzdWJzY3JpYmVFdmVudCA9IG5ldyBTdWJzY3JpYmVFdmVudCgpO1xuICAgIHN1YnNjcmliZUV2ZW50LnN1YnNjcmlwdGlvblRva2VuID0gbmV3IFB1YlN1YlN1YnNjcmlwdGlvblRva2VuKHB1YnN1YlRvcGljLCBudWxsLCBvYmplY3RJZE9mU3Vic2NyaWJlciwgbnVsbCk7XG5cbiAgICByZXR1cm4gc3Vic2NyaWJlRXZlbnQgO1xuICB9XG5cbiAgc3RhdGljIFVuU3Vic2NyaWJlQnlUb2tlbihzdWJzY3JpcHRpb25Ub2tlbjogUHViU3ViU3Vic2NyaXB0aW9uVG9rZW4pIHtcbiAgICBBcHBJbmZvU2VydmljZS5pbnN0YW5jZS5wdWJzdWIudW5zdWJzY3JpYmVCeVRva2VuKHN1YnNjcmlwdGlvblRva2VuKTtcbiAgfVxuXG4gIHN0YXRpYyBVblN1YnNjcmliZUJ5Q29uc3VtZXIob2JqZWN0SWQ6IG51bWJlcikge1xuICAgIEFwcEluZm9TZXJ2aWNlLmluc3RhbmNlLnB1YnN1Yi51bnN1YnNjcmliZUJ5Q29uc3VtZXIob2JqZWN0SWQpO1xuICB9XG5cbiAgSGFuZGxlRXZlbnRXaXRoVGhpc01ldGhvZChhY3Rpb25DYWxsYmFjazogKGFyZ3M6IFB1YlN1YkV2ZW50QXJncykgPT4gdm9pZCk6IFN1YnNjcmliZUV2ZW50IHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvblRva2VuLmFjdGlvbkNhbGxiYWNrID0gYWN0aW9uQ2FsbGJhY2s7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBBcHBseUZpbHRlclByZWRpY2F0ZShmaWx0ZXJQcmVkaWNhdGU6IFByZWRpY2F0ZTxQdWJTdWJFdmVudEFyZ3M+KTogU3Vic2NyaWJlRXZlbnQge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uVG9rZW4uZmlsdGVyUHJlZGljYXRlID0gZmlsdGVyUHJlZGljYXRlO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgQWxsb3dNdWx0aXBsZVN1YnNjcmlwdGlvbnNTYW1lRXZlbnRTYW1lQ29uc3VtZXIoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25Ub2tlbi5hbGxvd011bHRpcGxlU3Vic2NyaXB0aW9uc1NhbWVFdmVudFNhbWVDb25zdW1lciA9IHRydWUgO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIFNlbmRDdXJyZW50RXZlbnRPbmx5KCk6IFN1YnNjcmliZUV2ZW50IHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvblRva2VuLnNlbmRDdXJyZW50RXZlbnRPbmx5ID0gdHJ1ZSA7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgRG9uZSgpOiBTdWJzY3JpYmVFdmVudCB7XG4gICAgQXBwSW5mb1NlcnZpY2UuaW5zdGFuY2UucHVic3ViLnN1YnNjcmliZSh0aGlzLnN1YnNjcmlwdGlvblRva2VuKSA7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFB1Ymxpc2hFdmVudCB7XG4gIGV2ZW50QXJnczogUHViU3ViRXZlbnRBcmdzO1xuXG4gIHN0YXRpYyBDcmVhdGUocHVic3ViVG9waWM6IHN0cmluZywgb2JqZWN0SWRPZlB1Ymxpc2hlcjogbnVtYmVyKTogUHVibGlzaEV2ZW50IHtcbiAgICBjb25zdCBwdWJsaXNoRXZlbnQgPSBuZXcgUHVibGlzaEV2ZW50KCk7XG4gICAgcHVibGlzaEV2ZW50LmV2ZW50QXJncyA9IG5ldyBQdWJTdWJFdmVudEFyZ3MocHVic3ViVG9waWMsIFwiXCIsIG9iamVjdElkT2ZQdWJsaXNoZXIpIDtcbiAgICByZXR1cm4gcHVibGlzaEV2ZW50IDtcbiAgfVxuXG4gIFNldERhdGFBcmd1bWVudFRvKGRhdGE6IGFueSk6IFB1Ymxpc2hFdmVudCB7XG4gICAgdGhpcy5ldmVudEFyZ3MuZGF0YSA9IGRhdGEgO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgU2VuZCgpOiBQdWJsaXNoRXZlbnQge1xuICAgIEFwcEluZm9TZXJ2aWNlLmluc3RhbmNlLnB1YnN1Yi5wdWJsaXNoKHRoaXMuZXZlbnRBcmdzKSA7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEV2ZW50RGVzY3JpcHRvciB7XG4gIHB1YnN1YlRvcGljOiBzdHJpbmcgO1xuICBldmVudEJ1ZmZlclNpemU6IG51bWJlciA9IDU7XG4gIGlzU29ja2V0OiBib29sZWFuID0gZmFsc2UgO1xuICBldmVudHM6IFB1YlN1YkV2ZW50QXJnc1tdID0gW107XG4gIGRhdGFBcmd1bWVudFR5cGU6IHN0cmluZyA9IFwiXCIgO1xuICBpc1NlbmRUb1NlcnZlcjogYm9vbGVhbiA9IGZhbHNlO1xuICBpc1NlbmRUb0NsaWVudDogYm9vbGVhbiA9IGZhbHNlIDtcblxuICBzdGF0aWMgQ3JlYXRlKHB1YnN1YlRvcGljOiBzdHJpbmcpOiBFdmVudERlc2NyaXB0b3Ige1xuICAgIGNvbnN0IGV2ZW50RGVzY3JpcHRvciA9IG5ldyBFdmVudERlc2NyaXB0b3IoKTtcbiAgICBldmVudERlc2NyaXB0b3IucHVic3ViVG9waWMgPSBwdWJzdWJUb3BpYyA7XG5cbiAgICAvLyBsZXQncyBhZGQgaXQgdG8gYXBwSW5mbywga2VlcCB0aGUgZXh0ZXJuYWwgaW50ZXJmYWNlIGNsZWFuXG4gICAgQXBwSW5mb1NlcnZpY2UuaW5zdGFuY2UucHVic3ViLmFkZEV2ZW50RGVzY3JpcHRvcihldmVudERlc2NyaXB0b3IpIDtcbiAgICByZXR1cm4gZXZlbnREZXNjcmlwdG9yIDtcbiAgfVxuXG4gIFdpdGhBQnVmZmVyU2l6ZU9mKG46IG51bWJlcik6IEV2ZW50RGVzY3JpcHRvciB7XG4gICAgdGhpcy5ldmVudEJ1ZmZlclNpemUgPSBuIDtcbiAgICByZXR1cm4gdGhpcyA7XG4gIH1cblxuICBHb2VzVG9TZXJ2ZXIoKTogRXZlbnREZXNjcmlwdG9yIHtcbiAgICB0aGlzLmlzU29ja2V0ID0gdHJ1ZSA7XG4gICAgdGhpcy5pc1NlbmRUb1NlcnZlciA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBHb2VzVG9DbGllbnQoKTogRXZlbnREZXNjcmlwdG9yIHtcbiAgICB0aGlzLmlzU29ja2V0ID0gdHJ1ZSA7XG4gICAgdGhpcy5pc1NlbmRUb0NsaWVudCA9IHRydWU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBEYXRhQXJndW1lbnRUeXBlQXNTdHJpbmcoYXJnVHlwZTogc3RyaW5nKTogRXZlbnREZXNjcmlwdG9yIHtcbiAgICB0aGlzLmRhdGFBcmd1bWVudFR5cGUgPSBhcmdUeXBlIDtcbiAgICByZXR1cm4gdGhpcyA7XG4gIH1cbn1cbiJdfQ==
