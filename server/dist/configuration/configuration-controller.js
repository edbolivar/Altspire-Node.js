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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var inversify_express_utils_1 = require("inversify-express-utils");
var inversify_1 = require("inversify");
var app_info_service_1 = require("../services/app-info.service");
var JsUtil_1 = require("../universal/JsUtil");
var server_types_1 = require("../server.types");
var configuration_service_1 = require("./configuration-service");
var product_data_service_1 = require("./product-data-service");
var app_types_1 = require("../universal/app.types");
var pub_sub_types_1 = require("../universal/pub-sub-types");
var ConfigurationController = /** @class */ (function () {
    function ConfigurationController(appInfo, configurationService, productDataService) {
        this.appInfo = appInfo;
        this.configurationService = configurationService;
        this.productDataService = productDataService;
        this.callCount = 1;
        this.isOutOfOrder = false;
        this.objectId = JsUtil_1.JsUtil.getObjectId();
        console.log("ctor.ConfigurationController", this.objectId);
    }
    ConfigurationController.prototype.GetServiceUIData = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logRequest(req);
                        return [4 /*yield*/, this.configurationService.getServiceUI()];
                    case 1:
                        result = _a.sent();
                        res.status(200)
                            .json(result);
                        return [2 /*return*/];
                }
            });
        });
    };
    ConfigurationController.prototype.getPlatform = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var fileTokenToReturn, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logRequest(req);
                        fileTokenToReturn = '';
                        if (req.params.f) {
                            fileTokenToReturn = req.query.f;
                        }
                        return [4 /*yield*/, this.configurationService.getPlatform(fileTokenToReturn)];
                    case 1:
                        result = _a.sent();
                        res.status(200)
                            .json(result);
                        return [2 /*return*/];
                }
            });
        });
    };
    ConfigurationController.prototype.getPlatform2 = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logRequest(req);
                        return [4 /*yield*/, this.configurationService.getPlatform2()];
                    case 1:
                        result = _a.sent();
                        res.status(200)
                            .json(result);
                        return [2 /*return*/];
                }
            });
        });
    };
    ConfigurationController.prototype.getHome = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var fileName, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logRequest(req);
                        fileName = '';
                        if (req.params.f) {
                            fileName = req.query.f;
                        }
                        return [4 /*yield*/, this.configurationService.getHome(fileName)];
                    case 1:
                        result = _a.sent();
                        res.status(200)
                            .json(result);
                        return [2 /*return*/];
                }
            });
        });
    };
    ConfigurationController.prototype.getFlavorDesign = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logRequest(req);
                        return [4 /*yield*/, this.configurationService.getDesignFlavor()];
                    case 1:
                        result = _a.sent();
                        res.status(200)
                            .json(result);
                        return [2 /*return*/];
                }
            });
        });
    };
    ConfigurationController.prototype.getPourablesDesign = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var country, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logRequest(req);
                        country = "en-us";
                        if (req.query["country"]) {
                            country = req.query["country"];
                        }
                        return [4 /*yield*/, this.configurationService.getDesignPourables(country)];
                    case 1:
                        result = _a.sent();
                        res.status(200)
                            .json(result);
                        return [2 /*return*/];
                }
            });
        });
    };
    ConfigurationController.prototype.getBubblesDesign = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logRequest(req);
                        return [4 /*yield*/, this.configurationService.getDesignBubbles()];
                    case 1:
                        result = _a.sent();
                        res.status(200)
                            .json(result);
                        return [2 /*return*/];
                }
            });
        });
    };
    ConfigurationController.prototype.getAnimationsDesign = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logRequest(req);
                        return [4 /*yield*/, this.configurationService.getDesignAnimations()];
                    case 1:
                        result = _a.sent();
                        res.status(200)
                            .json(result);
                        return [2 /*return*/];
                }
            });
        });
    };
    ConfigurationController.prototype.getIdleState = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logRequest(req);
                        return [4 /*yield*/, this.configurationService.getIdleState()];
                    case 1:
                        result = _a.sent();
                        res.status(200)
                            .json(result);
                        return [2 /*return*/];
                }
            });
        });
    };
    ConfigurationController.prototype.getUnitState = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logRequest(req);
                        return [4 /*yield*/, this.configurationService.getUnitState()];
                    case 1:
                        result = _a.sent();
                        res.status(200)
                            .json(result);
                        return [2 /*return*/];
                }
            });
        });
    };
    ConfigurationController.prototype.getOverrides = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logRequest(req);
                        return [4 /*yield*/, this.configurationService.getOverrides()];
                    case 1:
                        result = _a.sent();
                        res.status(200)
                            .json(result);
                        return [2 /*return*/];
                }
            });
        });
    };
    ConfigurationController.prototype.getValidatePin = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var result, role, isPinValid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logRequest(req);
                        console.log(req);
                        result = new app_types_1.ApiResult();
                        result["url"] = req.originalUrl;
                        return [4 /*yield*/, this.configurationService.getRoleByAuthId(req.query["pin"])];
                    case 1:
                        role = _a.sent();
                        isPinValid = role != app_types_1.Role.None;
                        result["details"].push("Role=" + role);
                        result["details"].push("IsPinValid=" + isPinValid);
                        result["success"] = isPinValid;
                        res.status(200)
                            .json(result);
                        return [2 /*return*/];
                }
            });
        });
    };
    ConfigurationController.prototype.getLocalizationForConsumerUI = function (req, res, next) {
        this.logRequest(req);
        var data = this.configurationService.getLocalizationForConsumerUI();
        return data;
    };
    ConfigurationController.prototype.getPourItems = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logRequest(req);
                        return [4 /*yield*/, this.configurationService.getPourItems()];
                    case 1:
                        result = _a.sent();
                        res.status(200)
                            .json(result);
                        return [2 /*return*/];
                }
            });
        });
    };
    ConfigurationController.prototype.logRequest = function (req) {
        console.log(this.callCount++ + " " + req.originalUrl);
    };
    ConfigurationController.prototype.getOutOfOrder = function (req, res, next) {
        this.logRequest(req);
        this.isOutOfOrder = !this.isOutOfOrder;
        // @@Eugen
        // TEST, will always send out of order
        //this.isOutOfOrder = true ;
        // REMOVE and it will toggle between in-order and out of order
        var args = new app_types_1.OutOfOrderEventArgs();
        if (this.isOutOfOrder) {
            var itemStateInfo = new app_types_1.ItemStateInfo();
            itemStateInfo.ItemType = 'ValveController';
            itemStateInfo.Description = 'Valve Controller is OffLine';
            args.Items.push(itemStateInfo);
            itemStateInfo = new app_types_1.ItemStateInfo();
            itemStateInfo.ItemType = 'TouchController';
            itemStateInfo.Description = 'Touch Controller is OffLine';
            args.Items.push(itemStateInfo);
        }
        args.isOutOfOrder = this.isOutOfOrder;
        pub_sub_types_1.PublishEvent.Create(pub_sub_types_1.PubSubTopic.outOfOrderChanged, this.objectId)
            .SetDataArgumentTo(args)
            .Send();
        return args;
    };
    __decorate([
        inversify_express_utils_1.Get('/serviceui'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], ConfigurationController.prototype, "GetServiceUIData", null);
    __decorate([
        inversify_express_utils_1.Get('/design/platform'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], ConfigurationController.prototype, "getPlatform", null);
    __decorate([
        inversify_express_utils_1.Get('/design/platform2'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], ConfigurationController.prototype, "getPlatform2", null);
    __decorate([
        inversify_express_utils_1.Get('/design/home'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], ConfigurationController.prototype, "getHome", null);
    __decorate([
        inversify_express_utils_1.Get('/design/flavors'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], ConfigurationController.prototype, "getFlavorDesign", null);
    __decorate([
        inversify_express_utils_1.Get('/design/allpourables'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], ConfigurationController.prototype, "getPourablesDesign", null);
    __decorate([
        inversify_express_utils_1.Get('/design/bubbles'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], ConfigurationController.prototype, "getBubblesDesign", null);
    __decorate([
        inversify_express_utils_1.Get('/design/animations'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], ConfigurationController.prototype, "getAnimationsDesign", null);
    __decorate([
        inversify_express_utils_1.Get('/idlestate'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], ConfigurationController.prototype, "getIdleState", null);
    __decorate([
        inversify_express_utils_1.Get('/unitstate'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], ConfigurationController.prototype, "getUnitState", null);
    __decorate([
        inversify_express_utils_1.Get('/overrides'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], ConfigurationController.prototype, "getOverrides", null);
    __decorate([
        inversify_express_utils_1.Get('/validatepin'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], ConfigurationController.prototype, "getValidatePin", null);
    __decorate([
        inversify_express_utils_1.Get('/localization'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Object)
    ], ConfigurationController.prototype, "getLocalizationForConsumerUI", null);
    __decorate([
        inversify_express_utils_1.Get('/pourables'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], ConfigurationController.prototype, "getPourItems", null);
    __decorate([
        inversify_express_utils_1.Get('/test/outoforder'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Object)
    ], ConfigurationController.prototype, "getOutOfOrder", null);
    ConfigurationController = __decorate([
        inversify_express_utils_1.Controller('/api/config'),
        inversify_1.injectable(),
        __param(0, inversify_1.inject(server_types_1.default.AppInfo)),
        __param(1, inversify_1.inject(server_types_1.default.ConfigurationService)),
        __param(2, inversify_1.inject(server_types_1.default.ProductDataService)),
        __metadata("design:paramtypes", [app_info_service_1.AppInfoService,
            configuration_service_1.ConfigurationService,
            product_data_service_1.ProductDataService])
    ], ConfigurationController);
    return ConfigurationController;
}());
exports.ConfigurationController = ConfigurationController;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpZ3VyYXRpb24vY29uZmlndXJhdGlvbi1jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQ0FBbUM7QUFDbkMsbUVBQXNFO0FBQ3RFLHVDQUErQztBQUMvQyxpRUFBNEQ7QUFDNUQsOENBQTJDO0FBQzNDLGdEQUFvQztBQUVwQyxpRUFBNkQ7QUFDN0QsK0RBQTBEO0FBQzFELG9EQUEyRjtBQUMzRiw0REFBcUU7QUFLckU7SUFJSSxpQ0FBMkMsT0FBdUIsRUFDVixvQkFBMEMsRUFDNUMsa0JBQXNDO1FBRmpELFlBQU8sR0FBUCxPQUFPLENBQWdCO1FBQ1YseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFzQjtRQUM1Qyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBSjVGLGNBQVMsR0FBRyxDQUFDLENBQUM7UUFDZCxpQkFBWSxHQUFHLEtBQUssQ0FBRTtRQUtsQixJQUFJLENBQUMsUUFBUSxHQUFHLGVBQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBR1ksa0RBQWdCLEdBQTdCLFVBQThCLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxJQUEwQjs7Ozs7O3dCQUNqRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUNOLHFCQUFNLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxZQUFZLEVBQUUsRUFBQTs7d0JBQXZELE1BQU0sR0FBRyxTQUE4Qzt3QkFDN0QsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7NkJBQ1YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUNsQixzQkFBUTs7OztLQUNYO0lBR1ksNkNBQVcsR0FBeEIsVUFBeUIsR0FBb0IsRUFBRSxHQUFxQixFQUFFLElBQTBCOzs7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QUFHLENBQUMsb0JBQW9CLENBQUM7Ozs7c0VBT3pCO0lBR0Q7UUFEQyw2QkFBRyxDQUFDLFlBQVksQ0FBQzs7OzsrREFPakI7SUFHRDtRQURDLDZCQUFHLENBQUMsWUFBWSxDQUFDOzs7OytEQU9qQjtJQUdEO1FBREMsNkJBQUcsQ0FBQyxZQUFZLENBQUM7Ozs7K0RBT2pCO0lBR0Q7UUFEQyw2QkFBRyxDQUFDLGNBQWMsQ0FBQzs7OztpRUFvQm5CO0lBR0Q7UUFEQyw2QkFBRyxDQUFDLGVBQWUsQ0FBQzs7OzsrRUFLcEI7SUFHRDtRQURDLDZCQUFHLENBQUMsWUFBWSxDQUFDOzs7OytEQU9qQjtJQU9EO1FBREMsNkJBQUcsQ0FBQyxrQkFBa0IsQ0FBQzs7OztnRUFnQ3ZCO0lBcE5RLHVCQUF1QjtRQUZuQyxvQ0FBVSxDQUFDLGFBQWEsQ0FBQztRQUN6QixzQkFBVSxFQUFFO1FBS0ksV0FBQSxrQkFBTSxDQUFDLHNCQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDckIsV0FBQSxrQkFBTSxDQUFDLHNCQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtRQUNsQyxXQUFBLGtCQUFNLENBQUMsc0JBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO3lDQUZPLGlDQUFjO1lBQ1ksNENBQW9CO1lBQ3hCLHlDQUFrQjtPQU5uRix1QkFBdUIsQ0FxTm5DO0lBQUQsOEJBQUM7Q0FyTkQsQUFxTkMsSUFBQTtBQXJOWSwwREFBdUIiLCJmaWxlIjoiY29uZmlndXJhdGlvbi9jb25maWd1cmF0aW9uLWNvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XG5pbXBvcnQgeyBpbnRlcmZhY2VzLCBDb250cm9sbGVyLCBHZXQgfSBmcm9tICdpbnZlcnNpZnktZXhwcmVzcy11dGlscyc7XG5pbXBvcnQgeyBpbmplY3RhYmxlLCBpbmplY3QgfSBmcm9tICdpbnZlcnNpZnknO1xuaW1wb3J0IHtBcHBJbmZvU2VydmljZX0gZnJvbSBcIi4uL3NlcnZpY2VzL2FwcC1pbmZvLnNlcnZpY2VcIjtcbmltcG9ydCB7SnNVdGlsfSBmcm9tIFwiLi4vdW5pdmVyc2FsL0pzVXRpbFwiO1xuaW1wb3J0IFRZUEVTIGZyb20gXCIuLi9zZXJ2ZXIudHlwZXNcIjtcbmltcG9ydCB7QXBwUHJvZHVjdGRhdGFTZXJ2aWNlfSBmcm9tIFwiLi4vc2VydmljZXMvYXBwLXByb2R1Y3RkYXRhLnNlcnZpY2VcIjtcbmltcG9ydCB7Q29uZmlndXJhdGlvblNlcnZpY2V9IGZyb20gXCIuL2NvbmZpZ3VyYXRpb24tc2VydmljZVwiO1xuaW1wb3J0IHtQcm9kdWN0RGF0YVNlcnZpY2V9IGZyb20gXCIuL3Byb2R1Y3QtZGF0YS1zZXJ2aWNlXCI7XG5pbXBvcnQge0FwaVJlc3VsdCwgSXRlbVN0YXRlSW5mbywgT3V0T2ZPcmRlckV2ZW50QXJncywgUm9sZX0gZnJvbSBcIi4uL3VuaXZlcnNhbC9hcHAudHlwZXNcIjtcbmltcG9ydCB7UHVibGlzaEV2ZW50LCBQdWJTdWJUb3BpY30gZnJvbSBcIi4uL3VuaXZlcnNhbC9wdWItc3ViLXR5cGVzXCI7XG5cblxuQENvbnRyb2xsZXIoJy9hcGkvY29uZmlnJylcbkBpbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb25maWd1cmF0aW9uQ29udHJvbGxlciBpbXBsZW1lbnRzIGludGVyZmFjZXMuQ29udHJvbGxlciB7XG4gICAgb2JqZWN0SWQ6IG51bWJlciA7XG4gICAgY2FsbENvdW50ID0gMTtcbiAgICBpc091dE9mT3JkZXIgPSBmYWxzZSA7XG4gICAgY29uc3RydWN0b3IoQGluamVjdChUWVBFUy5BcHBJbmZvKSBwcml2YXRlIGFwcEluZm86IEFwcEluZm9TZXJ2aWNlICxcbiAgICAgICAgICAgICAgICBAaW5qZWN0KFRZUEVTLkNvbmZpZ3VyYXRpb25TZXJ2aWNlKSBwcml2YXRlIGNvbmZpZ3VyYXRpb25TZXJ2aWNlOiBDb25maWd1cmF0aW9uU2VydmljZSxcbiAgICAgICAgICAgICAgICBAaW5qZWN0KFRZUEVTLlByb2R1Y3REYXRhU2VydmljZSkgcHJpdmF0ZSBwcm9kdWN0RGF0YVNlcnZpY2U6IFByb2R1Y3REYXRhU2VydmljZSkge1xuXG4gICAgICAgIHRoaXMub2JqZWN0SWQgPSBKc1V0aWwuZ2V0T2JqZWN0SWQoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJjdG9yLkNvbmZpZ3VyYXRpb25Db250cm9sbGVyXCIsIHRoaXMub2JqZWN0SWQpO1xuICAgIH1cblxuICAgIEBHZXQoJy9zZXJ2aWNldWknKVxuICAgIHB1YmxpYyBhc3luYyBHZXRTZXJ2aWNlVUlEYXRhKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGV4cHJlc3MuTmV4dEZ1bmN0aW9uKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgdGhpcy5sb2dSZXF1ZXN0KHJlcSk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2UuZ2V0U2VydmljZVVJKCk7XG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKVxuICAgICAgICAgICAgLmpzb24ocmVzdWx0KTtcbiAgICAgICAgcmV0dXJuIDtcbiAgICB9XG5cbiAgICBAR2V0KCcvZGVzaWduL3BsYXRmb3JtJylcbiAgICBwdWJsaWMgYXN5bmMgZ2V0UGxhdGZvcm0ocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogZXhwcmVzcy5OZXh0RnVuY3Rpb24pOiBQcm9taXNlPGFueT4ge1xuICAgICAgICB0aGlzLmxvZ1JlcXVlc3QocmVxKTtcbiAgICAgICAgLy8gaWYgd2Ugc2VuZCBpbiBhIGYgcXVlcnkgc3RyaW5nIHdlIGNhbiBzcGVjaWZ5IHRoZSBmaWxlIHRvIHJldHVyblxuICAgICAgICAvLyB0aGlzIGlzIHVzZWZ1bCBpbiBhIHVuaXQgdGVzdCBjb250ZXh0IHNvIHdlIGNhbiB2YWxpZGF0ZSB0aGUgVVJMXG4gICAgICAgIC8vIHdpdGhvdXQgaGF2aW5nIHRvIGNoYW5nZSB0aGUgbWFjaGluZSBjb25maWd1cmF0aW9uXG5cbiAgICAgICAgbGV0IGZpbGVUb2tlblRvUmV0dXJuID0gJycgO1xuXG4gICAgICAgIGlmIChyZXEucGFyYW1zLmYpIHtcbiAgICAgICAgICAgIGZpbGVUb2tlblRvUmV0dXJuID0gcmVxLnF1ZXJ5LmY7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZXMuc3RhdHVzKDUwMClcbiAgICAgICAgLy8gICAgIC5qc29uKHtcInRoaXMgaXMgYW4gZXJyb3JcIjogXCJteSBiYWRcIn0pO1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2UuZ2V0UGxhdGZvcm0oZmlsZVRva2VuVG9SZXR1cm4pO1xuICAgICAgICByZXMuc3RhdHVzKDIwMClcbiAgICAgICAgICAgIC5qc29uKHJlc3VsdCk7XG4gICAgICAgIHJldHVybiA7XG4gICAgfVxuXG4gICAgQEdldCgnL2Rlc2lnbi9wbGF0Zm9ybTInKVxuICAgIHB1YmxpYyBhc3luYyBnZXRQbGF0Zm9ybTIocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogZXhwcmVzcy5OZXh0RnVuY3Rpb24pOiBQcm9taXNlPGFueT4ge1xuICAgICAgICB0aGlzLmxvZ1JlcXVlc3QocmVxKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5jb25maWd1cmF0aW9uU2VydmljZS5nZXRQbGF0Zm9ybTIoKTtcbiAgICAgICAgcmVzLnN0YXR1cygyMDApXG4gICAgICAgICAgICAuanNvbihyZXN1bHQpO1xuICAgICAgICByZXR1cm4gO1xuICAgIH1cblxuICAgIEBHZXQoJy9kZXNpZ24vaG9tZScpXG4gICAgcHVibGljIGFzeW5jIGdldEhvbWUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogZXhwcmVzcy5OZXh0RnVuY3Rpb24pOiBQcm9taXNlPGFueT4ge1xuICAgICAgICB0aGlzLmxvZ1JlcXVlc3QocmVxKTtcblxuICAgICAgICBsZXQgZmlsZU5hbWUgPSAnJyA7XG5cbiAgICAgICAgaWYgKHJlcS5wYXJhbXMuZikge1xuICAgICAgICAgICAgZmlsZU5hbWUgPSByZXEucXVlcnkuZjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2UuZ2V0SG9tZShmaWxlTmFtZSk7XG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKVxuICAgICAgICAgICAgLmpzb24ocmVzdWx0KTtcbiAgICAgICAgcmV0dXJuIDtcbiAgICB9XG5cbiAgICBAR2V0KCcvZGVzaWduL2ZsYXZvcnMnKVxuICAgIHB1YmxpYyBhc3luYyBnZXRGbGF2b3JEZXNpZ24ocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogZXhwcmVzcy5OZXh0RnVuY3Rpb24pOiBQcm9taXNlPGFueT4ge1xuICAgICAgICB0aGlzLmxvZ1JlcXVlc3QocmVxKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5jb25maWd1cmF0aW9uU2VydmljZS5nZXREZXNpZ25GbGF2b3IoKTtcbiAgICAgICAgcmVzLnN0YXR1cygyMDApXG4gICAgICAgICAgICAuanNvbihyZXN1bHQpO1xuICAgICAgICByZXR1cm4gO1xuICAgIH1cblxuICAgIEBHZXQoJy9kZXNpZ24vYWxscG91cmFibGVzJylcbiAgICBwdWJsaWMgYXN5bmMgZ2V0UG91cmFibGVzRGVzaWduKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGV4cHJlc3MuTmV4dEZ1bmN0aW9uKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgdGhpcy5sb2dSZXF1ZXN0KHJlcSk7XG5cbiAgICAgICAgbGV0IGNvdW50cnkgPSBcImVuLXVzXCI7XG5cbiAgICAgICAgaWYgKHJlcS5xdWVyeVtcImNvdW50cnlcIl0pIHtcbiAgICAgICAgICAgIGNvdW50cnkgPSByZXEucXVlcnlbXCJjb3VudHJ5XCJdO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5jb25maWd1cmF0aW9uU2VydmljZS5nZXREZXNpZ25Qb3VyYWJsZXMoY291bnRyeSk7XG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKVxuICAgICAgICAgICAgLmpzb24ocmVzdWx0KTtcbiAgICAgICAgcmV0dXJuIDtcbiAgICB9XG5cbiAgICBAR2V0KCcvZGVzaWduL2J1YmJsZXMnKVxuICAgIHB1YmxpYyBhc3luYyBnZXRCdWJibGVzRGVzaWduKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGV4cHJlc3MuTmV4dEZ1bmN0aW9uKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgdGhpcy5sb2dSZXF1ZXN0KHJlcSk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuY29uZmlndXJhdGlvblNlcnZpY2UuZ2V0RGVzaWduQnViYmxlcygpO1xuICAgICAgICByZXMuc3RhdHVzKDIwMClcbiAgICAgICAgICAgIC5qc29uKHJlc3VsdCk7XG4gICAgICAgIHJldHVybiA7XG4gICAgfVxuXG4gICAgQEdldCgnL2Rlc2lnbi9hbmltYXRpb25zJylcbiAgICBwdWJsaWMgYXN5bmMgZ2V0QW5pbWF0aW9uc0Rlc2lnbihyZXE6IGV4cHJlc3MuUmVxdWVzdCwgcmVzOiBleHByZXNzLlJlc3BvbnNlLCBuZXh0OiBleHByZXNzLk5leHRGdW5jdGlvbik6IFByb21pc2U8YW55PiB7XG4gICAgICAgIHRoaXMubG9nUmVxdWVzdChyZXEpO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldERlc2lnbkFuaW1hdGlvbnMoKTtcbiAgICAgICAgcmVzLnN0YXR1cygyMDApXG4gICAgICAgICAgICAuanNvbihyZXN1bHQpO1xuICAgICAgICByZXR1cm4gO1xuICAgIH1cblxuICAgIEBHZXQoJy9pZGxlc3RhdGUnKVxuICAgIHB1YmxpYyBhc3luYyBnZXRJZGxlU3RhdGUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogZXhwcmVzcy5OZXh0RnVuY3Rpb24pOiBQcm9taXNlPGFueT4ge1xuICAgICAgICB0aGlzLmxvZ1JlcXVlc3QocmVxKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5jb25maWd1cmF0aW9uU2VydmljZS5nZXRJZGxlU3RhdGUoKTtcbiAgICAgICAgcmVzLnN0YXR1cygyMDApXG4gICAgICAgICAgICAuanNvbihyZXN1bHQpO1xuICAgICAgICByZXR1cm4gO1xuICAgIH1cblxuICAgIEBHZXQoJy91bml0c3RhdGUnKVxuICAgIHB1YmxpYyBhc3luYyBnZXRVbml0U3RhdGUocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogZXhwcmVzcy5OZXh0RnVuY3Rpb24pOiBQcm9taXNlPGFueT4ge1xuICAgICAgICB0aGlzLmxvZ1JlcXVlc3QocmVxKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5jb25maWd1cmF0aW9uU2VydmljZS5nZXRVbml0U3RhdGUoKTtcbiAgICAgICAgcmVzLnN0YXR1cygyMDApXG4gICAgICAgICAgICAuanNvbihyZXN1bHQpO1xuICAgICAgICByZXR1cm4gO1xuICAgIH1cblxuICAgIEBHZXQoJy9vdmVycmlkZXMnKVxuICAgIHB1YmxpYyBhc3luYyBnZXRPdmVycmlkZXMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogZXhwcmVzcy5OZXh0RnVuY3Rpb24pOiBQcm9taXNlPGFueT4ge1xuICAgICAgICB0aGlzLmxvZ1JlcXVlc3QocmVxKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5jb25maWd1cmF0aW9uU2VydmljZS5nZXRPdmVycmlkZXMoKTtcbiAgICAgICAgcmVzLnN0YXR1cygyMDApXG4gICAgICAgICAgICAuanNvbihyZXN1bHQpO1xuICAgICAgICByZXR1cm4gO1xuICAgIH1cblxuICAgIEBHZXQoJy92YWxpZGF0ZXBpbicpXG4gICAgcHVibGljIGFzeW5jIGdldFZhbGlkYXRlUGluKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGV4cHJlc3MuTmV4dEZ1bmN0aW9uKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgdGhpcy5sb2dSZXF1ZXN0KHJlcSk7XG5cbiAgICAgICAgY29uc29sZS5sb2cocmVxKTtcblxuICAgICAgICBjb25zdCByZXN1bHQ6IEFwaVJlc3VsdCA9IG5ldyBBcGlSZXN1bHQoKTtcbiAgICAgICAgcmVzdWx0W1widXJsXCJdID0gcmVxLm9yaWdpbmFsVXJsO1xuXG4gICAgICAgIGNvbnN0IHJvbGUgPSBhd2FpdCB0aGlzLmNvbmZpZ3VyYXRpb25TZXJ2aWNlLmdldFJvbGVCeUF1dGhJZChyZXEucXVlcnlbXCJwaW5cIl0pO1xuICAgICAgICBjb25zdCBpc1BpblZhbGlkID0gcm9sZSAhPSBSb2xlLk5vbmU7XG5cbiAgICAgICAgcmVzdWx0W1wiZGV0YWlsc1wiXS5wdXNoKFwiUm9sZT1cIiArIHJvbGUpO1xuICAgICAgICByZXN1bHRbXCJkZXRhaWxzXCJdLnB1c2goXCJJc1BpblZhbGlkPVwiICsgaXNQaW5WYWxpZCk7XG5cbiAgICAgICAgcmVzdWx0W1wic3VjY2Vzc1wiXSA9IGlzUGluVmFsaWQ7XG5cbiAgICAgICAgcmVzLnN0YXR1cygyMDApXG4gICAgICAgICAgICAuanNvbihyZXN1bHQpO1xuICAgICAgICByZXR1cm4gO1xuICAgIH1cblxuICAgIEBHZXQoJy9sb2NhbGl6YXRpb24nKVxuICAgIHB1YmxpYyBnZXRMb2NhbGl6YXRpb25Gb3JDb25zdW1lclVJKHJlcTogZXhwcmVzcy5SZXF1ZXN0LCByZXM6IGV4cHJlc3MuUmVzcG9uc2UsIG5leHQ6IGV4cHJlc3MuTmV4dEZ1bmN0aW9uKTogYW55IHtcbiAgICAgICAgdGhpcy5sb2dSZXF1ZXN0KHJlcSk7XG4gICAgICAgIGNvbnN0IGRhdGEgPSAgdGhpcy5jb25maWd1cmF0aW9uU2VydmljZS5nZXRMb2NhbGl6YXRpb25Gb3JDb25zdW1lclVJKCk7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIEBHZXQoJy9wb3VyYWJsZXMnKVxuICAgIHB1YmxpYyBhc3luYyBnZXRQb3VySXRlbXMocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogZXhwcmVzcy5OZXh0RnVuY3Rpb24pOiBQcm9taXNlPGFueT4ge1xuICAgICAgICB0aGlzLmxvZ1JlcXVlc3QocmVxKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5jb25maWd1cmF0aW9uU2VydmljZS5nZXRQb3VySXRlbXMoKTtcbiAgICAgICAgcmVzLnN0YXR1cygyMDApXG4gICAgICAgICAgICAuanNvbihyZXN1bHQpO1xuICAgICAgICByZXR1cm4gO1xuICAgIH1cblxuICAgIGxvZ1JlcXVlc3QocmVxOiBleHByZXNzLlJlcXVlc3QpIHtcbiAgICAgICAgY29uc29sZS5sb2coYCR7dGhpcy5jYWxsQ291bnQrK30gJHtyZXEub3JpZ2luYWxVcmx9YCk7XG4gICAgfVxuXG4gICAgQEdldCgnL3Rlc3Qvb3V0b2ZvcmRlcicpXG4gICAgcHVibGljIGdldE91dE9mT3JkZXIocmVxOiBleHByZXNzLlJlcXVlc3QsIHJlczogZXhwcmVzcy5SZXNwb25zZSwgbmV4dDogZXhwcmVzcy5OZXh0RnVuY3Rpb24pOiBhbnkge1xuICAgICAgICB0aGlzLmxvZ1JlcXVlc3QocmVxKTtcblxuICAgICAgICBcbiAgICAgICAgdGhpcy5pc091dE9mT3JkZXIgPSAhIHRoaXMuaXNPdXRPZk9yZGVyO1xuICAgICAgICBcbiAgICAgICAgLy8gQEBFdWdlblxuICAgICAgICAvLyBURVNULCB3aWxsIGFsd2F5cyBzZW5kIG91dCBvZiBvcmRlclxuICAgICAgICAvL3RoaXMuaXNPdXRPZk9yZGVyID0gdHJ1ZSA7XG4gICAgICAgIC8vIFJFTU9WRSBhbmQgaXQgd2lsbCB0b2dnbGUgYmV0d2VlbiBpbi1vcmRlciBhbmQgb3V0IG9mIG9yZGVyXG5cbiAgICAgICAgY29uc3QgYXJncyA9IG5ldyBPdXRPZk9yZGVyRXZlbnRBcmdzKCk7XG4gICAgICAgIGlmICh0aGlzLmlzT3V0T2ZPcmRlcikge1xuICAgICAgICAgICAgbGV0IGl0ZW1TdGF0ZUluZm8gPSBuZXcgSXRlbVN0YXRlSW5mbygpO1xuICAgICAgICAgICAgaXRlbVN0YXRlSW5mby5JdGVtVHlwZSA9ICdWYWx2ZUNvbnRyb2xsZXInO1xuICAgICAgICAgICAgaXRlbVN0YXRlSW5mby5EZXNjcmlwdGlvbiA9ICdWYWx2ZSBDb250cm9sbGVyIGlzIE9mZkxpbmUnO1xuICAgICAgICAgICAgYXJncy5JdGVtcy5wdXNoKGl0ZW1TdGF0ZUluZm8pO1xuXG4gICAgICAgICAgICBpdGVtU3RhdGVJbmZvID0gbmV3IEl0ZW1TdGF0ZUluZm8oKTtcbiAgICAgICAgICAgIGl0ZW1TdGF0ZUluZm8uSXRlbVR5cGUgPSAnVG91Y2hDb250cm9sbGVyJztcbiAgICAgICAgICAgIGl0ZW1TdGF0ZUluZm8uRGVzY3JpcHRpb24gPSAnVG91Y2ggQ29udHJvbGxlciBpcyBPZmZMaW5lJztcbiAgICAgICAgICAgIGFyZ3MuSXRlbXMucHVzaChpdGVtU3RhdGVJbmZvKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFyZ3MuaXNPdXRPZk9yZGVyID0gdGhpcy5pc091dE9mT3JkZXI7XG5cbiAgICAgICAgUHVibGlzaEV2ZW50LkNyZWF0ZShQdWJTdWJUb3BpYy5vdXRPZk9yZGVyQ2hhbmdlZCwgdGhpcy5vYmplY3RJZClcbiAgICAgICAgICAgIC5TZXREYXRhQXJndW1lbnRUbyhhcmdzKVxuICAgICAgICAgICAgLlNlbmQoKTtcblxuICAgICAgICByZXR1cm4gYXJncztcbiAgICB9XG59XG4iXX0=
