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
var core_1 = require("@angular/core");
var pub_sub_types_1 = require("./pub-sub-types");
var JsUtil_1 = require("./JsUtil");
var _ = require("lodash");
var PubSubService = /** @class */ (function () {
    function PubSubService() {
        this.subscriptions = [];
        this.pubSubItems = [];
        this.eventBufferSize = 5;
        this.eventDescriptors = [];
        this.objectId = JsUtil_1.JsUtil.getObjectId();
        console.log("ctor.PubSubService", this.objectId);
        // oldway
        this.configureObservables();
    }
    // new way, called externally from appComponent because
    // AppInfo must be available (pubsub is created before so we can't do it from ctor)
    PubSubService.prototype.configureUsingPubSubTopicWithoutEventOptions = function () {
        // needs to be called externally from appComponent, AFTER appInfo is ready
        var pubsubTopic;
        Object.keys(pub_sub_types_1.PubSubTopic).forEach(function (key) {
            pubsubTopic = pub_sub_types_1.PubSubTopic[key];
            pub_sub_types_1.EventDescriptor.Create(pubsubTopic);
        });
    };
    PubSubService.prototype.subscribe = function (token) {
        var index = this.subscriptions.indexOf(token);
        if (index > -1) {
            console.log("WARNING - token already subscribed (indexOf, Instance)", index, token);
            return;
        }
        if (token.consumerObjectId > 0 && !token.allowMultipleSubscriptionsSameEventSameConsumer) {
            var existingToken = this.subscriptions.find(function (item) {
                return (token.pubsubTopic === item.pubsubTopic && token.consumerObjectId === item.consumerObjectId);
            });
            if (existingToken) {
                console.log("WARNING - token already subscribed (pubsubTopic+viewModelObjectId)", token);
                token.isActive = false;
                return;
            }
        }
        this.subscriptions.push(token);
        // send last event on subscribe. this solves problem of something having to be alive
        // at the time of the event. HUGE BENEFIT.
        var item = this.pubSubItems.find(function (item) {
            return (item.pubsubTopic === token.pubsubTopic);
        });
        this.processEventForToken(token, item);
        // send last event on subscribe. this solves problem of something having to be alive
        // at the time of the event. HUGE BENEFIT.
        var self = this;
        var eventDescriptor = this.eventDescriptors.find(function (item) {
            return (item.pubsubTopic === token.pubsubTopic);
        });
        if (!eventDescriptor) {
            // pubsubTopic has not been defined for the new way
            return;
        }
        this.processPEventForToken(token, eventDescriptor);
    };
    // new way with EventDescriptor
    PubSubService.prototype.publish = function (e) {
        // find the descriptor for the incoming event
        var eventDescriptor = this.eventDescriptors.find(function (eventDescriptorItem) {
            return (eventDescriptorItem.pubsubTopic === e.pubsubTopic);
        });
        if (!eventDescriptor) {
            console.log("ERROR EventDescriptor not found", e.pubsubTopic);
            return;
        }
        // manage the event buffer
        if (eventDescriptor.events.length === eventDescriptor.eventBufferSize) {
            // remove the first item from the list, as we reached the buffer size
            eventDescriptor.events.shift();
        }
        eventDescriptor.events.push(e);
        // now process the event
        this.processPEventForAllSubscribers(eventDescriptor);
    };
    // new way
    PubSubService.prototype.processPEventForAllSubscribers = function (eventDescriptor) {
        var self = this;
        // get all the tokens for this pubsubTopic
        var tokensForThisTopic = this.subscriptions.filter(function (loopToken) {
            return (loopToken.pubsubTopic === eventDescriptor.pubsubTopic);
        });
        if (eventDescriptor.isSocket) {
            // it's likely that there won't be any subscribers client side
            // so we need to processes it by sending it to the other side
            self.sendSocket(eventDescriptor);
        }
        tokensForThisTopic.forEach(function (myToken) {
            self.processPEventForToken(myToken, eventDescriptor);
        });
    };
    PubSubService.prototype.sendSocket = function (eventDescriptor) {
        var e = eventDescriptor.events[0];
        this.socketClient.send(e);
    };
    // new way
    PubSubService.prototype.processPEventForToken = function (token, eventDescriptor) {
        if (eventDescriptor.events.length === 0) {
            // console.log("pubsub.processEventForToken.noEventToSend");
            return;
        }
        if (!token.filterPredicate) {
            // just send the last event
            var event_1 = eventDescriptor.events[eventDescriptor.events.length - 1];
            // console.log("No Filter, Sending Last Event:",token,item,event) ;
            token.actionCallback(event_1);
        }
        else if (token.sendCurrentEventOnly) {
            // subscriber can indicate that only the last event is sent
            var event_2 = eventDescriptor.events[eventDescriptor.events.length - 1];
            var passesFilter = token.filterPredicate(event_2);
            if (passesFilter) {
                token.actionCallback(event_2);
            }
        }
        else {
            // it's got a filter so we have to cycle through past events to see what matches
            // do it in reverse order, so we come across the most recent event first
            for (var i = eventDescriptor.events.length - 1; i > -1; i--) {
                var event_3 = eventDescriptor.events[i];
                var passesFilter = token.filterPredicate(event_3);
                if (passesFilter) {
                    token.actionCallback(event_3);
                    break;
                }
            }
        }
    };
    PubSubService.prototype.addEventDescriptor = function (pubSubEventDescriptor) {
        // --- if the topic already exists, remove it, last one in, wins
        var ifExistsIndex = _.findIndex(this.eventDescriptors, function (item) {
            return item.pubsubTopic === pubSubEventDescriptor.pubsubTopic;
        });
        if (ifExistsIndex > -1) {
            this.eventDescriptors.splice(ifExistsIndex, 1);
        }
        this.eventDescriptors.push(pubSubEventDescriptor);
    };
    PubSubService.prototype.unsubscribeByToken = function (token) {
        var index = this.subscriptions.indexOf(token);
        if (index > -1) {
            this.subscriptions.splice(index, 1);
        }
    };
    PubSubService.prototype.unsubscribeByConsumer = function (objectIdOfConsumer) {
        var self = this;
        var itemsToUnSubscribe = this.subscriptions.filter(function (token) {
            return (token.consumerObjectId == objectIdOfConsumer);
        });
        itemsToUnSubscribe.forEach(function (token) {
            self.unsubscribeByToken(token);
        });
    };
    // ----- old way, obsolete -------------------------------------------------------------
    // old way
    PubSubService.prototype.processEventForToken = function (token, item) {
        if (item.events.length === 0) {
            // console.log("pubsub.processEventForToken.noEventToSend");
            return;
        }
        if (!token.filterPredicate) {
            // just send the last event
            var event_4 = item.events[item.events.length - 1];
            // console.log("No Filter, Sending Last Event:",token,item,event) ;
            token.actionCallback(event_4);
        }
        else {
            // it's got a filter so we have to cycle through past events to see what matches
            // do it in reverse order, so we come across the most recent event first
            for (var i = item.events.length - 1; i > -1; i--) {
                var event_5 = item.events[i];
                var passesFilter = token.filterPredicate(event_5);
                if (passesFilter) {
                    token.actionCallback(event_5);
                    break;
                }
            }
        }
    };
    // old way
    PubSubService.prototype.publishUsingEventArgs = function (e) {
        var item = this.pubSubItems.find(function (item) {
            return (item.pubsubTopic === e.pubsubTopic);
        });
        if (!item) {
            console.log("ERROR PubSubItem not found in pubSubItems2 :", e.pubsubTopic);
            return;
        }
        if (item.events.length === this.eventBufferSize) {
            // remove the first item from the list, as we reached the buffer size
            item.events.shift();
            // console.log("Removing 1st Event in Stack",item.events) ;
        }
        item.events.push(e);
        // console.log("Adding event to",item.pubsubTopic,e) ;
        this.processEventForAllSubscribers(item);
    };
    // old way
    PubSubService.prototype.configureObservables = function () {
        var self = this;
        var numberOfItemsInReplayBuffer = 5;
        var pubsubTopic;
        for (var key in pub_sub_types_1.PubSubTopic) {
            pubsubTopic = pub_sub_types_1.PubSubTopic[key];
            var item = new pub_sub_types_1.PubSubItem(pubsubTopic);
            this.pubSubItems.push(item);
        }
    };
    PubSubService.prototype.processEventForAllSubscribers = function (item) {
        // get all the tokens for this pubsubTopic
        var tokensForThisTopic = this.subscriptions.filter(function (loopToken) {
            return (loopToken.pubsubTopic == item.pubsubTopic);
        });
        for (var i = 0, len = tokensForThisTopic.length; i < len; i++) {
            var myToken = tokensForThisTopic[i];
            this.processEventForToken(myToken, item);
        }
    };
    PubSubService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], PubSubService);
    return PubSubService;
}());
exports.PubSubService = PubSubService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVuaXZlcnNhbC9wdWItc3ViLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBMkM7QUFDM0MsaURBQW1IO0FBRW5ILG1DQUFnQztBQUNoQywwQkFBNEI7QUFHNUI7SUFTRTtRQVBRLGtCQUFhLEdBQThCLEVBQUUsQ0FBRTtRQUMvQyxnQkFBVyxHQUFpQixFQUFFLENBQUU7UUFDeEMsb0JBQWUsR0FBRyxDQUFDLENBQUU7UUFHckIscUJBQWdCLEdBQXNCLEVBQUUsQ0FBQztRQUd2QyxJQUFJLENBQUMsUUFBUSxHQUFHLGVBQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVqRCxTQUFTO1FBQ1QsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVELHVEQUF1RDtJQUN2RCxtRkFBbUY7SUFDbkYsb0VBQTRDLEdBQTVDO1FBQ0UsMEVBQTBFO1FBQzFFLElBQUksV0FBbUIsQ0FBRTtRQUN6QixNQUFNLENBQUMsSUFBSSxDQUFDLDJCQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBUyxHQUFXO1lBQ25ELFdBQVcsR0FBRywyQkFBVyxDQUFDLEdBQUcsQ0FBQyxDQUFFO1lBQ2hDLCtCQUFlLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3RDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGlDQUFTLEdBQVQsVUFBVSxLQUE4QjtRQUN0QyxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoRCxFQUFFLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3REFBd0QsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFFLENBQUU7WUFD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QUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUU7UUFDdEQsQ0FBQyxDQUFDLENBQUU7UUFDSixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDOUQsSUFBTSxPQUFPLEdBQUcsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUU7WUFDdkMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBRTtRQUM1QyxDQUFDO0lBQ0gsQ0FBQztJQXJRVSxhQUFhO1FBRHpCLGlCQUFVLEVBQUU7O09BQ0EsYUFBYSxDQXNRekI7SUFBRCxvQkFBQztDQXRRRCxBQXNRQyxJQUFBO0FBdFFZLHNDQUFhIiwiZmlsZSI6InVuaXZlcnNhbC9wdWItc3ViLnNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1B1YlN1YkV2ZW50QXJncywgUHViU3ViU3Vic2NyaXB0aW9uVG9rZW4sIFB1YlN1Ykl0ZW0sIEV2ZW50RGVzY3JpcHRvciwgUHViU3ViVG9waWN9IGZyb20gJy4vcHViLXN1Yi10eXBlcyc7XG5cbmltcG9ydCB7SnNVdGlsfSBmcm9tIFwiLi9Kc1V0aWxcIjtcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFB1YlN1YlNlcnZpY2Uge1xuICBvYmplY3RJZDogbnVtYmVyIDtcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBQdWJTdWJTdWJzY3JpcHRpb25Ub2tlbltdID0gW10gO1xuICBwcml2YXRlIHB1YlN1Ykl0ZW1zOiBQdWJTdWJJdGVtW10gPSBbXSA7XG4gIGV2ZW50QnVmZmVyU2l6ZSA9IDUgO1xuICBzb2NrZXRDbGllbnQ6IGFueSA7XG5cbiAgZXZlbnREZXNjcmlwdG9yczogRXZlbnREZXNjcmlwdG9yW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm9iamVjdElkID0gSnNVdGlsLmdldE9iamVjdElkKCk7XG4gICAgY29uc29sZS5sb2coXCJjdG9yLlB1YlN1YlNlcnZpY2VcIiwgdGhpcy5vYmplY3RJZCk7XG5cbiAgICAvLyBvbGR3YXlcbiAgICB0aGlzLmNvbmZpZ3VyZU9ic2VydmFibGVzKCk7XG4gIH1cblxuICAvLyBuZXcgd2F5LCBjYWxsZWQgZXh0ZXJuYWxseSBmcm9tIGFwcENvbXBvbmVudCBiZWNhdXNlXG4gIC8vIEFwcEluZm8gbXVzdCBiZSBhdmFpbGFibGUgKHB1YnN1YiBpcyBjcmVhdGVkIGJlZm9yZSBzbyB3ZSBjYW4ndCBkbyBpdCBmcm9tIGN0b3IpXG4gIGNvbmZpZ3VyZVVzaW5nUHViU3ViVG9waWNXaXRob3V0RXZlbnRPcHRpb25zKCkge1xuICAgIC8vIG5lZWRzIHRvIGJlIGNhbGxlZCBleHRlcm5hbGx5IGZyb20gYXBwQ29tcG9uZW50LCBBRlRFUiBhcHBJbmZvIGlzIHJlYWR5XG4gICAgbGV0IHB1YnN1YlRvcGljOiBzdHJpbmcgO1xuICAgIE9iamVjdC5rZXlzKFB1YlN1YlRvcGljKS5mb3JFYWNoKGZ1bmN0aW9uKGtleTogc3RyaW5nKSB7XG4gICAgICBwdWJzdWJUb3BpYyA9IFB1YlN1YlRvcGljW2tleV0gO1xuICAgICAgRXZlbnREZXNjcmlwdG9yLkNyZWF0ZShwdWJzdWJUb3BpYyk7XG4gICAgfSk7XG4gIH1cblxuICBzdWJzY3JpYmUodG9rZW46IFB1YlN1YlN1YnNjcmlwdGlvblRva2VuKSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLnN1YnNjcmlwdGlvbnMuaW5kZXhPZih0b2tlbik7XG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiV0FSTklORyAtIHRva2VuIGFscmVhZHkgc3Vic2NyaWJlZCAoaW5kZXhPZiwgSW5zdGFuY2UpXCIsIGluZGV4LCB0b2tlbiApIDtcbiAgICAgIHJldHVybiA7XG4gICAgfVxuXG4gICAgaWYgKHRva2VuLmNvbnN1bWVyT2JqZWN0SWQgPiAwICYmICEgdG9rZW4uYWxsb3dNdWx0aXBsZVN1YnNjcmlwdGlvbnNTYW1lRXZlbnRTYW1lQ29uc3VtZXIpIHtcbiAgICAgIGNvbnN0IGV4aXN0aW5nVG9rZW4gPSB0aGlzLnN1YnNjcmlwdGlvbnMuZmluZChmdW5jdGlvbihpdGVtKXtcbiAgICAgICAgcmV0dXJuICh0b2tlbi5wdWJzdWJUb3BpYyA9PT0gaXRlbS5wdWJzdWJUb3BpYyAmJiB0b2tlbi5jb25zdW1lck9iamVjdElkID09PSBpdGVtLmNvbnN1bWVyT2JqZWN0SWQgKTtcbiAgICAgIH0pIDtcblxuICAgICAgaWYgKGV4aXN0aW5nVG9rZW4pIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJXQVJOSU5HIC0gdG9rZW4gYWxyZWFkeSBzdWJzY3JpYmVkIChwdWJzdWJUb3BpYyt2aWV3TW9kZWxPYmplY3RJZClcIiwgdG9rZW4pIDtcbiAgICAgICAgdG9rZW4uaXNBY3RpdmUgPSBmYWxzZSA7XG4gICAgICAgIHJldHVybiA7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKHRva2VuKTtcblxuICAgIC8vIHNlbmQgbGFzdCBldmVudCBvbiBzdWJzY3JpYmUuIHRoaXMgc29sdmVzIHByb2JsZW0gb2Ygc29tZXRoaW5nIGhhdmluZyB0byBiZSBhbGl2ZVxuICAgIC8vIGF0IHRoZSB0aW1lIG9mIHRoZSBldmVudC4gSFVHRSBCRU5FRklULlxuICAgIGNvbnN0IGl0ZW0gPSB0aGlzLnB1YlN1Ykl0ZW1zLmZpbmQoZnVuY3Rpb24gKGl0ZW0pe1xuICAgICAgcmV0dXJuIChpdGVtLnB1YnN1YlRvcGljID09PSB0b2tlbi5wdWJzdWJUb3BpYykgO1xuICAgIH0pO1xuXG4gICAgdGhpcy5wcm9jZXNzRXZlbnRGb3JUb2tlbih0b2tlbiwgaXRlbSkgO1xuXG4gICAgLy8gc2VuZCBsYXN0IGV2ZW50IG9uIHN1YnNjcmliZS4gdGhpcyBzb2x2ZXMgcHJvYmxlbSBvZiBzb21ldGhpbmcgaGF2aW5nIHRvIGJlIGFsaXZlXG4gICAgLy8gYXQgdGhlIHRpbWUgb2YgdGhlIGV2ZW50LiBIVUdFIEJFTkVGSVQuXG4gICAgY29uc3Qgc2VsZiA9IHRoaXMgO1xuICAgIGNvbnN0IGV2ZW50RGVzY3JpcHRvcjogRXZlbnREZXNjcmlwdG9yID0gdGhpcy5ldmVudERlc2NyaXB0b3JzLmZpbmQoZnVuY3Rpb24gKGl0ZW06IEV2ZW50RGVzY3JpcHRvcil7XG4gICAgICByZXR1cm4gKGl0ZW0ucHVic3ViVG9waWMgPT09IHRva2VuLnB1YnN1YlRvcGljKSA7XG4gICAgfSk7XG5cbiAgICBpZiAoIWV2ZW50RGVzY3JpcHRvcikge1xuICAgICAgLy8gcHVic3ViVG9waWMgaGFzIG5vdCBiZWVuIGRlZmluZWQgZm9yIHRoZSBuZXcgd2F5XG4gICAgICByZXR1cm4gO1xuICAgIH1cblxuICAgIHRoaXMucHJvY2Vzc1BFdmVudEZvclRva2VuKHRva2VuLCBldmVudERlc2NyaXB0b3IpIDtcbiAgfVxuXG4gIC8vIG5ldyB3YXkgd2l0aCBFdmVudERlc2NyaXB0b3JcbiAgcHVibGlzaChlOiBQdWJTdWJFdmVudEFyZ3MpIHtcblxuICAgIC8vIGZpbmQgdGhlIGRlc2NyaXB0b3IgZm9yIHRoZSBpbmNvbWluZyBldmVudFxuICAgIGNvbnN0IGV2ZW50RGVzY3JpcHRvcjogRXZlbnREZXNjcmlwdG9yID0gdGhpcy5ldmVudERlc2NyaXB0b3JzLmZpbmQoZnVuY3Rpb24gKGV2ZW50RGVzY3JpcHRvckl0ZW06IEV2ZW50RGVzY3JpcHRvcil7XG4gICAgICByZXR1cm4gKGV2ZW50RGVzY3JpcHRvckl0ZW0ucHVic3ViVG9waWMgPT09IGUucHVic3ViVG9waWMpIDtcbiAgICB9KTtcblxuICAgIGlmICghZXZlbnREZXNjcmlwdG9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkVSUk9SIEV2ZW50RGVzY3JpcHRvciBub3QgZm91bmRcIiwgZS5wdWJzdWJUb3BpYykgO1xuICAgICAgcmV0dXJuIDtcbiAgICB9XG5cbiAgICAvLyBtYW5hZ2UgdGhlIGV2ZW50IGJ1ZmZlclxuICAgIGlmIChldmVudERlc2NyaXB0b3IuZXZlbnRzLmxlbmd0aCA9PT0gZXZlbnREZXNjcmlwdG9yLmV2ZW50QnVmZmVyU2l6ZSkge1xuICAgICAgLy8gcmVtb3ZlIHRoZSBmaXJzdCBpdGVtIGZyb20gdGhlIGxpc3QsIGFzIHdlIHJlYWNoZWQgdGhlIGJ1ZmZlciBzaXplXG4gICAgICBldmVudERlc2NyaXB0b3IuZXZlbnRzLnNoaWZ0KCkgO1xuICAgIH1cbiAgICBldmVudERlc2NyaXB0b3IuZXZlbnRzLnB1c2goZSkgO1xuXG4gICAgLy8gbm93IHByb2Nlc3MgdGhlIGV2ZW50XG4gICAgdGhpcy5wcm9jZXNzUEV2ZW50Rm9yQWxsU3Vic2NyaWJlcnMoZXZlbnREZXNjcmlwdG9yKSA7XG4gIH1cblxuICAvLyBuZXcgd2F5XG4gIHByaXZhdGUgcHJvY2Vzc1BFdmVudEZvckFsbFN1YnNjcmliZXJzKGV2ZW50RGVzY3JpcHRvcjogRXZlbnREZXNjcmlwdG9yKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXMgO1xuXG4gICAgLy8gZ2V0IGFsbCB0aGUgdG9rZW5zIGZvciB0aGlzIHB1YnN1YlRvcGljXG4gICAgY29uc3QgdG9rZW5zRm9yVGhpc1RvcGljOiBQdWJTdWJTdWJzY3JpcHRpb25Ub2tlbltdID0gdGhpcy5zdWJzY3JpcHRpb25zLmZpbHRlcihmdW5jdGlvbihsb29wVG9rZW46IFB1YlN1YlN1YnNjcmlwdGlvblRva2VuKXtcbiAgICAgIHJldHVybiAobG9vcFRva2VuLnB1YnN1YlRvcGljID09PSBldmVudERlc2NyaXB0b3IucHVic3ViVG9waWMpIDtcbiAgICB9KSA7XG5cblxuICAgIGlmIChldmVudERlc2NyaXB0b3IuaXNTb2NrZXQpIHtcbiAgICAgIC8vIGl0J3MgbGlrZWx5IHRoYXQgdGhlcmUgd29uJ3QgYmUgYW55IHN1YnNjcmliZXJzIGNsaWVudCBzaWRlXG4gICAgICAvLyBzbyB3ZSBuZWVkIHRvIHByb2Nlc3NlcyBpdCBieSBzZW5kaW5nIGl0IHRvIHRoZSBvdGhlciBzaWRlXG4gICAgICBzZWxmLnNlbmRTb2NrZXQoZXZlbnREZXNjcmlwdG9yKSA7XG4gICAgfVxuXG4gICAgdG9rZW5zRm9yVGhpc1RvcGljLmZvckVhY2goZnVuY3Rpb24obXlUb2tlbil7XG4gICAgICBzZWxmLnByb2Nlc3NQRXZlbnRGb3JUb2tlbihteVRva2VuLCBldmVudERlc2NyaXB0b3IpIDtcbiAgICB9KTtcblxuICB9XG5cbiAgc2VuZFNvY2tldChldmVudERlc2NyaXB0b3I6IEV2ZW50RGVzY3JpcHRvcikge1xuICAgICAgY29uc3QgZSA9IGV2ZW50RGVzY3JpcHRvci5ldmVudHNbMF07XG4gICAgICB0aGlzLnNvY2tldENsaWVudC5zZW5kKGUpIDtcbiAgfVxuXG5cblxuXG4gIC8vIG5ldyB3YXlcbiAgcHJpdmF0ZSBwcm9jZXNzUEV2ZW50Rm9yVG9rZW4odG9rZW46IFB1YlN1YlN1YnNjcmlwdGlvblRva2VuLCBldmVudERlc2NyaXB0b3I6IEV2ZW50RGVzY3JpcHRvcikge1xuXG4gICAgaWYgKGV2ZW50RGVzY3JpcHRvci5ldmVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcInB1YnN1Yi5wcm9jZXNzRXZlbnRGb3JUb2tlbi5ub0V2ZW50VG9TZW5kXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdG9rZW4uZmlsdGVyUHJlZGljYXRlKSB7XG4gICAgICAvLyBqdXN0IHNlbmQgdGhlIGxhc3QgZXZlbnRcbiAgICAgIGNvbnN0IGV2ZW50ID0gZXZlbnREZXNjcmlwdG9yLmV2ZW50c1tldmVudERlc2NyaXB0b3IuZXZlbnRzLmxlbmd0aCAtIDFdO1xuICAgICAgLy8gY29uc29sZS5sb2coXCJObyBGaWx0ZXIsIFNlbmRpbmcgTGFzdCBFdmVudDpcIix0b2tlbixpdGVtLGV2ZW50KSA7XG4gICAgICB0b2tlbi5hY3Rpb25DYWxsYmFjayhldmVudCk7XG4gICAgfSBlbHNlIGlmICh0b2tlbi5zZW5kQ3VycmVudEV2ZW50T25seSkge1xuICAgICAgLy8gc3Vic2NyaWJlciBjYW4gaW5kaWNhdGUgdGhhdCBvbmx5IHRoZSBsYXN0IGV2ZW50IGlzIHNlbnRcbiAgICAgIGNvbnN0IGV2ZW50ID0gZXZlbnREZXNjcmlwdG9yLmV2ZW50c1tldmVudERlc2NyaXB0b3IuZXZlbnRzLmxlbmd0aCAtIDFdO1xuICAgICAgY29uc3QgcGFzc2VzRmlsdGVyID0gdG9rZW4uZmlsdGVyUHJlZGljYXRlKGV2ZW50KTtcbiAgICAgIGlmIChwYXNzZXNGaWx0ZXIpIHtcbiAgICAgICAgdG9rZW4uYWN0aW9uQ2FsbGJhY2soZXZlbnQpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBpdCdzIGdvdCBhIGZpbHRlciBzbyB3ZSBoYXZlIHRvIGN5Y2xlIHRocm91Z2ggcGFzdCBldmVudHMgdG8gc2VlIHdoYXQgbWF0Y2hlc1xuICAgICAgLy8gZG8gaXQgaW4gcmV2ZXJzZSBvcmRlciwgc28gd2UgY29tZSBhY3Jvc3MgdGhlIG1vc3QgcmVjZW50IGV2ZW50IGZpcnN0XG4gICAgICBmb3IgKGxldCBpID0gZXZlbnREZXNjcmlwdG9yLmV2ZW50cy5sZW5ndGggLSAxOyBpID4gLTE7IGktLSkge1xuICAgICAgICBjb25zdCBldmVudCA9IGV2ZW50RGVzY3JpcHRvci5ldmVudHNbaV07XG4gICAgICAgIGNvbnN0IHBhc3Nlc0ZpbHRlciA9IHRva2VuLmZpbHRlclByZWRpY2F0ZShldmVudCk7XG4gICAgICAgIGlmIChwYXNzZXNGaWx0ZXIpIHtcbiAgICAgICAgICB0b2tlbi5hY3Rpb25DYWxsYmFjayhldmVudCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhZGRFdmVudERlc2NyaXB0b3IocHViU3ViRXZlbnREZXNjcmlwdG9yOiBFdmVudERlc2NyaXB0b3IpIHtcbiAgICAvLyAtLS0gaWYgdGhlIHRvcGljIGFscmVhZHkgZXhpc3RzLCByZW1vdmUgaXQsIGxhc3Qgb25lIGluLCB3aW5zXG4gICAgY29uc3QgaWZFeGlzdHNJbmRleCA9IF8uZmluZEluZGV4KHRoaXMuZXZlbnREZXNjcmlwdG9ycywgZnVuY3Rpb24oaXRlbTogRXZlbnREZXNjcmlwdG9yKSB7XG4gICAgICByZXR1cm4gaXRlbS5wdWJzdWJUb3BpYyA9PT0gcHViU3ViRXZlbnREZXNjcmlwdG9yLnB1YnN1YlRvcGljIDtcbiAgICB9KTtcbiAgICBpZiAoaWZFeGlzdHNJbmRleCA+IC0xKSB7XG4gICAgICB0aGlzLmV2ZW50RGVzY3JpcHRvcnMuc3BsaWNlKGlmRXhpc3RzSW5kZXgsIDEpIDtcbiAgICB9XG4gICAgdGhpcy5ldmVudERlc2NyaXB0b3JzLnB1c2gocHViU3ViRXZlbnREZXNjcmlwdG9yKSA7XG4gIH1cblxuICB1bnN1YnNjcmliZUJ5VG9rZW4odG9rZW46IFB1YlN1YlN1YnNjcmlwdGlvblRva2VuKSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLnN1YnNjcmlwdGlvbnMuaW5kZXhPZih0b2tlbik7XG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfVxuXG4gIHVuc3Vic2NyaWJlQnlDb25zdW1lcihvYmplY3RJZE9mQ29uc3VtZXI6IG51bWJlcikge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzIDtcbiAgICBjb25zdCBpdGVtc1RvVW5TdWJzY3JpYmUgID0gdGhpcy5zdWJzY3JpcHRpb25zLmZpbHRlcihmdW5jdGlvbih0b2tlbiA6IFB1YlN1YlN1YnNjcmlwdGlvblRva2VuKXtcbiAgICAgIHJldHVybiAodG9rZW4uY29uc3VtZXJPYmplY3RJZCA9PSBvYmplY3RJZE9mQ29uc3VtZXIpIDtcbiAgICB9KSA7XG5cbiAgICBpdGVtc1RvVW5TdWJzY3JpYmUuZm9yRWFjaChmdW5jdGlvbih0b2tlbiA6IFB1YlN1YlN1YnNjcmlwdGlvblRva2VuKXtcbiAgICAgIHNlbGYudW5zdWJzY3JpYmVCeVRva2VuKHRva2VuKSA7XG4gICAgfSk7XG4gIH1cblxuICAvLyAtLS0tLSBvbGQgd2F5LCBvYnNvbGV0ZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gb2xkIHdheVxuICBwcml2YXRlIHByb2Nlc3NFdmVudEZvclRva2VuKHRva2VuOiBQdWJTdWJTdWJzY3JpcHRpb25Ub2tlbiwgaXRlbTogUHViU3ViSXRlbSkge1xuXG4gICAgaWYgKGl0ZW0uZXZlbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAvLyBjb25zb2xlLmxvZyhcInB1YnN1Yi5wcm9jZXNzRXZlbnRGb3JUb2tlbi5ub0V2ZW50VG9TZW5kXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdG9rZW4uZmlsdGVyUHJlZGljYXRlKSB7XG4gICAgICAvLyBqdXN0IHNlbmQgdGhlIGxhc3QgZXZlbnRcbiAgICAgIGNvbnN0IGV2ZW50ID0gaXRlbS5ldmVudHNbaXRlbS5ldmVudHMubGVuZ3RoIC0gMV07XG4gICAgICAvLyBjb25zb2xlLmxvZyhcIk5vIEZpbHRlciwgU2VuZGluZyBMYXN0IEV2ZW50OlwiLHRva2VuLGl0ZW0sZXZlbnQpIDtcbiAgICAgIHRva2VuLmFjdGlvbkNhbGxiYWNrKGV2ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaXQncyBnb3QgYSBmaWx0ZXIgc28gd2UgaGF2ZSB0byBjeWNsZSB0aHJvdWdoIHBhc3QgZXZlbnRzIHRvIHNlZSB3aGF0IG1hdGNoZXNcbiAgICAgIC8vIGRvIGl0IGluIHJldmVyc2Ugb3JkZXIsIHNvIHdlIGNvbWUgYWNyb3NzIHRoZSBtb3N0IHJlY2VudCBldmVudCBmaXJzdFxuICAgICAgZm9yIChsZXQgaSA9IGl0ZW0uZXZlbnRzLmxlbmd0aCAtIDE7IGkgPiAtMTsgaS0tKSB7XG4gICAgICAgIGNvbnN0IGV2ZW50ID0gaXRlbS5ldmVudHNbaV07XG4gICAgICAgIGNvbnN0IHBhc3Nlc0ZpbHRlciA9IHRva2VuLmZpbHRlclByZWRpY2F0ZShldmVudCk7XG4gICAgICAgIGlmIChwYXNzZXNGaWx0ZXIpIHtcbiAgICAgICAgICB0b2tlbi5hY3Rpb25DYWxsYmFjayhldmVudCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBvbGQgd2F5XG4gIHB1Ymxpc2hVc2luZ0V2ZW50QXJncyhlOiBQdWJTdWJFdmVudEFyZ3MpIHtcbiAgICBjb25zdCBpdGVtOiBQdWJTdWJJdGVtID0gdGhpcy5wdWJTdWJJdGVtcy5maW5kKGZ1bmN0aW9uIChpdGVtKXtcbiAgICAgIHJldHVybiAoaXRlbS5wdWJzdWJUb3BpYyA9PT0gZS5wdWJzdWJUb3BpYykgO1xuICAgIH0pO1xuXG4gICAgaWYgKCFpdGVtKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkVSUk9SIFB1YlN1Ykl0ZW0gbm90IGZvdW5kIGluIHB1YlN1Ykl0ZW1zMiA6XCIsIGUucHVic3ViVG9waWMpIDtcbiAgICAgIHJldHVybiA7XG4gICAgfVxuXG4gICAgaWYgKGl0ZW0uZXZlbnRzLmxlbmd0aCA9PT0gdGhpcy5ldmVudEJ1ZmZlclNpemUpIHtcbiAgICAgIC8vIHJlbW92ZSB0aGUgZmlyc3QgaXRlbSBmcm9tIHRoZSBsaXN0LCBhcyB3ZSByZWFjaGVkIHRoZSBidWZmZXIgc2l6ZVxuICAgICAgaXRlbS5ldmVudHMuc2hpZnQoKSA7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcIlJlbW92aW5nIDFzdCBFdmVudCBpbiBTdGFja1wiLGl0ZW0uZXZlbnRzKSA7XG4gICAgfVxuICAgIGl0ZW0uZXZlbnRzLnB1c2goZSkgO1xuICAgIC8vIGNvbnNvbGUubG9nKFwiQWRkaW5nIGV2ZW50IHRvXCIsaXRlbS5wdWJzdWJUb3BpYyxlKSA7XG5cbiAgICB0aGlzLnByb2Nlc3NFdmVudEZvckFsbFN1YnNjcmliZXJzKGl0ZW0pIDtcbiAgfVxuXG4gIC8vIG9sZCB3YXlcbiAgY29uZmlndXJlT2JzZXJ2YWJsZXMoKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXMgO1xuICAgIGNvbnN0IG51bWJlck9mSXRlbXNJblJlcGxheUJ1ZmZlciA9IDUgO1xuICAgIGxldCBwdWJzdWJUb3BpYyA6IHN0cmluZyA7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gUHViU3ViVG9waWMpIHtcbiAgICAgIHB1YnN1YlRvcGljID0gUHViU3ViVG9waWNba2V5XSA7XG5cbiAgICAgIGNvbnN0IGl0ZW06IFB1YlN1Ykl0ZW0gPSBuZXcgUHViU3ViSXRlbShwdWJzdWJUb3BpYyApIDtcbiAgICAgIHRoaXMucHViU3ViSXRlbXMucHVzaChpdGVtKSA7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBwcm9jZXNzRXZlbnRGb3JBbGxTdWJzY3JpYmVycyhpdGVtIDogUHViU3ViSXRlbSkge1xuICAgIC8vIGdldCBhbGwgdGhlIHRva2VucyBmb3IgdGhpcyBwdWJzdWJUb3BpY1xuICAgIGNvbnN0IHRva2Vuc0ZvclRoaXNUb3BpYzogUHViU3ViU3Vic2NyaXB0aW9uVG9rZW5bXSA9IHRoaXMuc3Vic2NyaXB0aW9ucy5maWx0ZXIoZnVuY3Rpb24obG9vcFRva2VuOiBQdWJTdWJTdWJzY3JpcHRpb25Ub2tlbil7XG4gICAgICByZXR1cm4gKGxvb3BUb2tlbi5wdWJzdWJUb3BpYyA9PSBpdGVtLnB1YnN1YlRvcGljKSA7XG4gICAgfSkgO1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0b2tlbnNGb3JUaGlzVG9waWMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IG15VG9rZW4gPSB0b2tlbnNGb3JUaGlzVG9waWNbaV0gO1xuICAgICAgdGhpcy5wcm9jZXNzRXZlbnRGb3JUb2tlbihteVRva2VuLCBpdGVtKSA7XG4gICAgfVxuICB9XG59XG4iXX0=
