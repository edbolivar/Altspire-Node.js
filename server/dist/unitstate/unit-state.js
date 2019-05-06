"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JsUtil_1 = require("../universal/JsUtil");
var app_types_1 = require("../universal/app.types");
var pub_sub_types_1 = require("../universal/pub-sub-types");
var UnitState = /** @class */ (function () {
    function UnitState() {
        this.DeviceId = '';
        this.CountryLanguageCode = "en-us";
        this.UnitLocation = "US";
        this.UnitType = "";
        this.PrimaryConsumerLanguage = "en-us";
        this.SecondaryConsumerLanguage = "none";
        this.objectId = JsUtil_1.JsUtil.getObjectId();
    }
    return UnitState;
}());
exports.UnitState = UnitState;
// this get's confused during serialization
// since we aren't doing serviceui here were Not going to use this class for the moment
// and use the simpler variant above
var UnitStateX = /** @class */ (function () {
    function UnitStateX() {
        this._countryLanguageCode = "en-us";
        this._unitLocation = "US";
        this._unitType = "DriveThru";
        this._primaryConsumerLanguage = "en-us";
        this._secondaryConsumerLanguage = "none";
        this.suspendWrite = true;
        this.objectId = JsUtil_1.JsUtil.getObjectId();
        this.userRole = app_types_1.Role.Super;
        this.pourMode = app_types_1.PourMode.optifill;
        console.log("ctor.UnitState", this.objectId);
    }
    UnitStateX.prototype.publishUnitChangeEvent = function () {
        if (this.suspendWrite) {
            return;
        }
        if (this.writeTimeout) {
            // cancel any existing timeout
            clearTimeout(this.writeTimeout);
        }
        this.writeTimeout = setTimeout(function (that) {
            pub_sub_types_1.PublishEvent.Create(pub_sub_types_1.PubSubTopic.unitStateChange, that.objectId)
                .SetDataArgumentTo(this)
                .Send();
        }, 500, this);
    };
    Object.defineProperty(UnitStateX.prototype, "countryLanguageCode", {
        get: function () {
            return this._countryLanguageCode;
        },
        set: function (newCode) {
            this._countryLanguageCode = newCode;
            this.publishUnitChangeEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UnitStateX.prototype, "unitLocation", {
        get: function () {
            return this._unitLocation;
        },
        set: function (newLocation) {
            this._unitLocation = newLocation;
            this.publishUnitChangeEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UnitStateX.prototype, "uiCustomizationState", {
        get: function () {
            return this._uiCustomizationState;
        },
        set: function (newState) {
            this._uiCustomizationState = newState;
            this.publishUnitChangeEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UnitStateX.prototype, "valveFlowRatesState", {
        get: function () {
            return this._valveFlowRatesState;
        },
        set: function (newState) {
            this._valveFlowRatesState = newState;
            this.publishUnitChangeEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UnitStateX.prototype, "userRole", {
        get: function () {
            return this._userRole;
        },
        set: function (newUserRole) {
            this._userRole = newUserRole;
            this.publishUnitChangeEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UnitStateX.prototype, "unitType", {
        get: function () {
            return this._unitType;
        },
        set: function (unitType) {
            this._unitType = unitType;
            this.publishUnitChangeEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UnitStateX.prototype, "pourMode", {
        get: function () {
            return this._pourMode;
        },
        set: function (pourMode) {
            this._pourMode = pourMode;
            this.publishUnitChangeEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UnitStateX.prototype, "clearSelectionsDelay", {
        get: function () {
            return this._clearSelectionsDelay;
        },
        set: function (selectionsDelay) {
            this._clearSelectionsDelay = selectionsDelay;
            this.publishUnitChangeEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UnitStateX.prototype, "deviceId", {
        get: function () {
            return this._deviceId;
        },
        set: function (deviceId) {
            this._deviceId = deviceId;
            this.publishUnitChangeEvent();
        },
        enumerable: true,
        configurable: true
    });
    return UnitStateX;
}());
exports.UnitStateX = UnitStateX;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QztRQUMxQixDQUFDO2FBRUQsVUFBYSxRQUFnQjtZQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztZQUUxQixJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUNsQyxDQUFDOzs7T0FOQTtJQVFMLGlCQUFDO0FBQUQsQ0FsSkEsQUFrSkMsSUFBQTtBQWxKWSxnQ0FBVSIsImZpbGUiOiJ1bml0c3RhdGUvdW5pdC1zdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHtBcHBJbmZvU2VydmljZX0gZnJvbSBcIi4uL3NlcnZpY2VzL2FwcC1pbmZvLnNlcnZpY2VcIjtcbmltcG9ydCB7aW5qZWN0LCBpbmplY3RhYmxlfSBmcm9tIFwiaW52ZXJzaWZ5XCI7XG5pbXBvcnQgVFlQRVMgZnJvbSBcIi4uL3NlcnZlci50eXBlc1wiO1xuaW1wb3J0IHtKc1V0aWx9IGZyb20gXCIuLi91bml2ZXJzYWwvSnNVdGlsXCI7XG5pbXBvcnQge1xuICAgIFBvdXJNb2RlLCBSb2xlLCBVSUN1c3RvbWl6YXRpb25TdGF0ZSxcbiAgICBWYWx2ZUZsb3dSYXRlc1N0YXRlXG59IGZyb20gXCIuLi91bml2ZXJzYWwvYXBwLnR5cGVzXCI7XG5pbXBvcnQge1B1Ymxpc2hFdmVudCwgUHViU3ViVG9waWN9IGZyb20gXCIuLi91bml2ZXJzYWwvcHViLXN1Yi10eXBlc1wiO1xuXG5leHBvcnQgY2xhc3MgVW5pdFN0YXRlIHtcbiAgICBvYmplY3RJZDogbnVtYmVyO1xuICAgIERldmljZUlkID0gJyc7XG4gICAgQ291bnRyeUxhbmd1YWdlQ29kZSA9IFwiZW4tdXNcIjtcbiAgICBVbml0TG9jYXRpb24gPSBcIlVTXCI7XG4gICAgVW5pdFR5cGUgPSBcIlwiO1xuICAgIFByaW1hcnlDb25zdW1lckxhbmd1YWdlID0gXCJlbi11c1wiO1xuICAgIFNlY29uZGFyeUNvbnN1bWVyTGFuZ3VhZ2UgPSBcIm5vbmVcIjtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5vYmplY3RJZCA9IEpzVXRpbC5nZXRPYmplY3RJZCgpO1xuICAgIH1cbn1cblxuLy8gdGhpcyBnZXQncyBjb25mdXNlZCBkdXJpbmcgc2VyaWFsaXphdGlvblxuLy8gc2luY2Ugd2UgYXJlbid0IGRvaW5nIHNlcnZpY2V1aSBoZXJlIHdlcmUgTm90IGdvaW5nIHRvIHVzZSB0aGlzIGNsYXNzIGZvciB0aGUgbW9tZW50XG4vLyBhbmQgdXNlIHRoZSBzaW1wbGVyIHZhcmlhbnQgYWJvdmVcbmV4cG9ydCBjbGFzcyBVbml0U3RhdGVYIHtcbiAgICBvYmplY3RJZDogbnVtYmVyO1xuICAgIF9kZXZpY2VJZDogc3RyaW5nO1xuXG4gICAgX2NvdW50cnlMYW5ndWFnZUNvZGUgPSBcImVuLXVzXCI7XG4gICAgX3VuaXRMb2NhdGlvbiA9IFwiVVNcIjtcbiAgICBfdW5pdFR5cGUgPSBcIkRyaXZlVGhydVwiO1xuICAgIF9wcmltYXJ5Q29uc3VtZXJMYW5ndWFnZSA9IFwiZW4tdXNcIjtcbiAgICBfc2Vjb25kYXJ5Q29uc3VtZXJMYW5ndWFnZSA9IFwibm9uZVwiO1xuXG4gICAgX3BvdXJNb2RlOiBQb3VyTW9kZTtcbiAgICBfdWlDdXN0b21pemF0aW9uU3RhdGU6IFVJQ3VzdG9taXphdGlvblN0YXRlO1xuICAgIF92YWx2ZUZsb3dSYXRlc1N0YXRlOiBWYWx2ZUZsb3dSYXRlc1N0YXRlO1xuICAgIF91c2VyUm9sZTogUm9sZTtcblxuICAgIHN1c3BlbmRXcml0ZTogYm9vbGVhbiA9IHRydWU7XG4gICAgLy8gaW1wb3J0IFJvbGVcblxuICAgIF9jbGVhclNlbGVjdGlvbnNEZWxheTogbnVtYmVyO1xuICAgIGlzQXBwTG9hZGluZzogYm9vbGVhbjtcblxuICAgIHdyaXRlVGltZW91dDogYW55O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMub2JqZWN0SWQgPSBKc1V0aWwuZ2V0T2JqZWN0SWQoKTtcbiAgICAgICAgdGhpcy51c2VyUm9sZSA9IFJvbGUuU3VwZXI7XG4gICAgICAgIHRoaXMucG91ck1vZGUgPSBQb3VyTW9kZS5vcHRpZmlsbDtcbiAgICAgICAgY29uc29sZS5sb2coXCJjdG9yLlVuaXRTdGF0ZVwiLCB0aGlzLm9iamVjdElkKTtcbiAgICB9XG5cbiAgICBwdWJsaXNoVW5pdENoYW5nZUV2ZW50KCkge1xuICAgICAgICBpZiAodGhpcy5zdXNwZW5kV3JpdGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLndyaXRlVGltZW91dCkge1xuICAgICAgICAgICAgLy8gY2FuY2VsIGFueSBleGlzdGluZyB0aW1lb3V0XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy53cml0ZVRpbWVvdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy53cml0ZVRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKHRoYXQpIHtcbiAgICAgICAgICAgIFB1Ymxpc2hFdmVudC5DcmVhdGUoUHViU3ViVG9waWMudW5pdFN0YXRlQ2hhbmdlLCB0aGF0Lm9iamVjdElkKVxuICAgICAgICAgICAgICAgIC5TZXREYXRhQXJndW1lbnRUbyh0aGlzKVxuICAgICAgICAgICAgICAgIC5TZW5kKCk7XG4gICAgICAgIH0sIDUwMCwgdGhpcyk7XG5cblxuICAgIH1cblxuICAgIGdldCBjb3VudHJ5TGFuZ3VhZ2VDb2RlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY291bnRyeUxhbmd1YWdlQ29kZTtcbiAgICB9XG5cbiAgICBzZXQgY291bnRyeUxhbmd1YWdlQ29kZShuZXdDb2RlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fY291bnRyeUxhbmd1YWdlQ29kZSA9IG5ld0NvZGU7XG5cbiAgICAgICAgdGhpcy5wdWJsaXNoVW5pdENoYW5nZUV2ZW50KCk7XG4gICAgfVxuXG5cbiAgICBnZXQgdW5pdExvY2F0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdW5pdExvY2F0aW9uO1xuICAgIH1cblxuICAgIHNldCB1bml0TG9jYXRpb24obmV3TG9jYXRpb246IHN0cmluZykge1xuICAgICAgICB0aGlzLl91bml0TG9jYXRpb24gPSBuZXdMb2NhdGlvbjtcblxuICAgICAgICB0aGlzLnB1Ymxpc2hVbml0Q2hhbmdlRXZlbnQoKTtcbiAgICB9XG5cblxuICAgIGdldCB1aUN1c3RvbWl6YXRpb25TdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VpQ3VzdG9taXphdGlvblN0YXRlO1xuICAgIH1cblxuICAgIHNldCB1aUN1c3RvbWl6YXRpb25TdGF0ZShuZXdTdGF0ZTogVUlDdXN0b21pemF0aW9uU3RhdGUpIHtcbiAgICAgICAgdGhpcy5fdWlDdXN0b21pemF0aW9uU3RhdGUgPSBuZXdTdGF0ZTtcblxuICAgICAgICB0aGlzLnB1Ymxpc2hVbml0Q2hhbmdlRXZlbnQoKTtcbiAgICB9XG5cbiAgICBnZXQgdmFsdmVGbG93UmF0ZXNTdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHZlRmxvd1JhdGVzU3RhdGU7XG4gICAgfVxuXG4gICAgc2V0IHZhbHZlRmxvd1JhdGVzU3RhdGUobmV3U3RhdGU6IFZhbHZlRmxvd1JhdGVzU3RhdGUpIHtcbiAgICAgICAgdGhpcy5fdmFsdmVGbG93UmF0ZXNTdGF0ZSA9IG5ld1N0YXRlO1xuXG4gICAgICAgIHRoaXMucHVibGlzaFVuaXRDaGFuZ2VFdmVudCgpO1xuICAgIH1cblxuXG4gICAgZ2V0IHVzZXJSb2xlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdXNlclJvbGU7XG4gICAgfVxuXG4gICAgc2V0IHVzZXJSb2xlKG5ld1VzZXJSb2xlOiBSb2xlKSB7XG4gICAgICAgIHRoaXMuX3VzZXJSb2xlID0gbmV3VXNlclJvbGU7XG5cbiAgICAgICAgdGhpcy5wdWJsaXNoVW5pdENoYW5nZUV2ZW50KCk7XG4gICAgfVxuXG5cbiAgICBnZXQgdW5pdFR5cGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl91bml0VHlwZTtcbiAgICB9XG5cbiAgICBzZXQgdW5pdFR5cGUodW5pdFR5cGU6IHN0cmluZykge1xuICAgICAgICB0aGlzLl91bml0VHlwZSA9IHVuaXRUeXBlO1xuXG4gICAgICAgIHRoaXMucHVibGlzaFVuaXRDaGFuZ2VFdmVudCgpO1xuICAgIH1cblxuXG4gICAgZ2V0IHBvdXJNb2RlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcG91ck1vZGU7XG4gICAgfVxuXG4gICAgc2V0IHBvdXJNb2RlKHBvdXJNb2RlOiBQb3VyTW9kZSkge1xuICAgICAgICB0aGlzLl9wb3VyTW9kZSA9IHBvdXJNb2RlO1xuXG4gICAgICAgIHRoaXMucHVibGlzaFVuaXRDaGFuZ2VFdmVudCgpO1xuICAgIH1cblxuXG4gICAgZ2V0IGNsZWFyU2VsZWN0aW9uc0RlbGF5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY2xlYXJTZWxlY3Rpb25zRGVsYXk7XG4gICAgfVxuXG4gICAgc2V0IGNsZWFyU2VsZWN0aW9uc0RlbGF5KHNlbGVjdGlvbnNEZWxheTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX2NsZWFyU2VsZWN0aW9uc0RlbGF5ID0gc2VsZWN0aW9uc0RlbGF5O1xuXG4gICAgICAgIHRoaXMucHVibGlzaFVuaXRDaGFuZ2VFdmVudCgpO1xuICAgIH1cblxuXG4gICAgZ2V0IGRldmljZUlkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGV2aWNlSWQ7XG4gICAgfVxuXG4gICAgc2V0IGRldmljZUlkKGRldmljZUlkOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fZGV2aWNlSWQgPSBkZXZpY2VJZDtcblxuICAgICAgICB0aGlzLnB1Ymxpc2hVbml0Q2hhbmdlRXZlbnQoKTtcbiAgICB9XG5cbn0iXX0=
