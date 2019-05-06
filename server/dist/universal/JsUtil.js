"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shortid = require("shortid");
var _ = require("lodash");
var JsUtil = /** @class */ (function () {
    function JsUtil() {
    }
    JsUtil.capitalizeFirstLetter = function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    JsUtil.getObjectId = function () {
        return ++this._objectIdSeed;
    };
    JsUtil.clone = function (objectToClone) {
        var contents = JSON.stringify(objectToClone);
        var newObj = JSON.parse(contents);
        return newObj;
    };
    JsUtil.zeroPad = function (num, numZeros) {
        var n = Math.abs(num);
        var zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
        var zeroString = Math.pow(10, zeros).toString().substr(1);
        if (num < 0) {
            zeroString = '-' + zeroString;
        }
        return zeroString + n;
    };
    JsUtil.logPourConfig = function (brandButton, flavorButtons) {
        var flavors = "";
        _.forEach(flavorButtons, function (flavorButton) {
            if (flavors.length > 0) {
                flavors += ", ";
            }
            flavors += flavorButton.Label;
        });
        var msg = "Pour: " + brandButton.Label + "\r\n  Flavors: " + flavors;
        console.log(msg);
    };
    JsUtil.formatSeconds = function (seconds) {
        // converts seconds to hhh:mm:ss
        var nseconds = Number(seconds);
        var h = Math.floor(nseconds / 3600);
        var m = this.zeroPad(Math.floor(nseconds % 3600 / 60), 2);
        var s = this.zeroPad(Math.floor(nseconds % 3600 % 60), 2);
        var result = h + ":" + m + ":" + s;
        return result;
    };
    JsUtil.generateId = function () {
        // it'd wrapped in case we decide to change implementation;
        return shortid.generate();
    };
    JsUtil.extractDocTypeFromDocumentId = function (key) {
        return key;
    };
    JsUtil.mapToNewObject = function (sourceObject, targetObject) {
        // ************************************************************
        // make sure your targetObject type definition has default
        // values for all properties, otherwise you will lose data
        // ************************************************************
        // used to make sure we have all the correct properties
        // and with the correct function prototypes
        // *** note if are you moving from a simple property to
        // a getter/setter, you'll have to handle it elsewhere
        Object.keys(targetObject).forEach(function (propertyName) {
            // console.log('TargetObject ', propertyName,': ', targetObject[propertyName]);
            // if the property exists in the sourceObject, then we want to bring it across
            if (propertyName in sourceObject && sourceObject[propertyName] != null) {
                if (targetObject[propertyName] instanceof Date) {
                    targetObject[propertyName] = new Date(sourceObject[propertyName].toString());
                }
                else {
                    targetObject[propertyName] = sourceObject[propertyName];
                }
            }
        });
        return targetObject;
    };
    JsUtil.mapToNewObjectCaseInsensitive = function (sourceObject, targetObject, mappingObject) {
        // ************************************************************
        // make sure your targetObject type definition has default
        // values for all properties, otherwise you will lose data
        // ************************************************************
        if (mappingObject === void 0) { mappingObject = null; }
        // used to make sure we have all the correct properties
        // and with the correct function prototypes
        // *** note if are you moving from a simple property to
        // a getter/setter, you'll have to handle it elsewhere
        var lowercaseSourceParams = [];
        Object.keys(sourceObject).forEach(function (propertyName) {
            // console.log('SourceObject ', propertyName, ': ', sourceObject[propertyName]);
            lowercaseSourceParams.push(propertyName);
        });
        Object.keys(targetObject).forEach(function (propertyName) {
            var propertyNameLowercase = propertyName.toLowerCase();
            var propertyNameSource = lowercaseSourceParams.find(function (p) { return p.toLowerCase() === propertyNameLowercase; });
            // TODO need a way to get it to work for arrays and objects
            if (propertyNameSource !== undefined) {
                // console.log("Target Object Type Name: ", typeof targetObject[propertyName]);
                if (targetObject[propertyName] instanceof Date) {
                    targetObject[propertyName] = new Date(sourceObject[propertyNameSource].toString());
                }
                else {
                    targetObject[propertyName] = sourceObject[propertyNameSource];
                }
            }
        });
        return targetObject;
    };
    JsUtil._objectIdSeed = 0;
    return JsUtil;
}());
exports.JsUtil = JsUtil;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QWEsR0FBRyxDQUFDLENBQUU7SUFzSTVCLGFBQUM7Q0F2SUQsQUF1SUMsSUFBQTtBQXZJWSx3QkFBTSIsImZpbGUiOiJ1bml2ZXJzYWwvSnNVdGlsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCAqIGFzIHNob3J0aWQgZnJvbSAnc2hvcnRpZCc7XG5pbXBvcnQge0J1dHRvbk1vZGVsfSBmcm9tIFwiLi9hcHAudHlwZXNcIjtcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcblxuZXhwb3J0IGNsYXNzIEpzVXRpbCB7XG4gIHN0YXRpYyBfb2JqZWN0SWRTZWVkID0gMCA7XG4gIHN0YXRpYyBjYXBpdGFsaXplRmlyc3RMZXR0ZXIoc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRPYmplY3RJZCgpIHtcbiAgICByZXR1cm4gKyt0aGlzLl9vYmplY3RJZFNlZWQ7XG4gIH1cblxuICBzdGF0aWMgY2xvbmUob2JqZWN0VG9DbG9uZTogYW55KSB7XG4gICAgY29uc3QgY29udGVudHMgPSBKU09OLnN0cmluZ2lmeShvYmplY3RUb0Nsb25lKTtcbiAgICBjb25zdCBuZXdPYmogPSBKU09OLnBhcnNlKGNvbnRlbnRzKTtcbiAgICByZXR1cm4gbmV3T2JqO1xuICB9XG5cbiAgc3RhdGljIHplcm9QYWQobnVtLCBudW1aZXJvcykge1xuICAgIGNvbnN0IG4gPSBNYXRoLmFicyhudW0pO1xuICAgIGNvbnN0IHplcm9zID0gTWF0aC5tYXgoMCwgbnVtWmVyb3MgLSBNYXRoLmZsb29yKG4pLnRvU3RyaW5nKCkubGVuZ3RoICk7XG4gICAgbGV0IHplcm9TdHJpbmcgPSBNYXRoLnBvdygxMCwgemVyb3MpLnRvU3RyaW5nKCkuc3Vic3RyKDEpO1xuXG4gICAgaWYgKCBudW0gPCAwICkge1xuICAgICAgemVyb1N0cmluZyA9ICctJyArIHplcm9TdHJpbmc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHplcm9TdHJpbmcgKyBuIDtcbiAgfVxuXG4gIHN0YXRpYyBsb2dQb3VyQ29uZmlnKGJyYW5kQnV0dG9uOiBCdXR0b25Nb2RlbCwgZmxhdm9yQnV0dG9uczogQnV0dG9uTW9kZWxbXSkge1xuICAgICAgbGV0IGZsYXZvcnMgPSBcIlwiO1xuICAgICAgXy5mb3JFYWNoKGZsYXZvckJ1dHRvbnMsIGZ1bmN0aW9uKGZsYXZvckJ1dHRvbjogQnV0dG9uTW9kZWwpe1xuXG4gICAgICAgIGlmIChmbGF2b3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBmbGF2b3JzICs9IFwiLCBcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZsYXZvcnMgKz0gZmxhdm9yQnV0dG9uLkxhYmVsIDtcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBtc2cgPSBgUG91cjogJHticmFuZEJ1dHRvbi5MYWJlbH1cXHJcXG4gIEZsYXZvcnM6ICR7Zmxhdm9yc31gIDtcbiAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gIH1cblxuXG4gIHN0YXRpYyBmb3JtYXRTZWNvbmRzKHNlY29uZHM6IG51bWJlcikge1xuICAgIC8vIGNvbnZlcnRzIHNlY29uZHMgdG8gaGhoOm1tOnNzXG4gICAgY29uc3QgbnNlY29uZHMgPSBOdW1iZXIoc2Vjb25kcykgO1xuICAgIGNvbnN0IGggPSBNYXRoLmZsb29yKG5zZWNvbmRzIC8gMzYwMCk7XG4gICAgY29uc3QgbSA9IHRoaXMuemVyb1BhZChNYXRoLmZsb29yKG5zZWNvbmRzICUgMzYwMCAvIDYwKSwyKTtcbiAgICBjb25zdCBzID0gdGhpcy56ZXJvUGFkKE1hdGguZmxvb3IobnNlY29uZHMgJSAzNjAwICUgNjApLDIpO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gYCR7aH06JHttfToke3N9YCA7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHN0YXRpYyBnZW5lcmF0ZUlkKCkge1xuICAgIC8vIGl0J2Qgd3JhcHBlZCBpbiBjYXNlIHdlIGRlY2lkZSB0byBjaGFuZ2UgaW1wbGVtZW50YXRpb247XG4gICAgcmV0dXJuIHNob3J0aWQuZ2VuZXJhdGUoKSA7XG4gIH1cblxuXG5cbiAgc3RhdGljIGV4dHJhY3REb2NUeXBlRnJvbURvY3VtZW50SWQoa2V5OiBzdHJpbmcpIHtcblxuICAgIHJldHVybiBrZXkgO1xuICB9XG5cblxuXG4gIHN0YXRpYyBtYXBUb05ld09iamVjdChzb3VyY2VPYmplY3Q6IGFueSwgdGFyZ2V0T2JqZWN0OiBhbnkpOiBhbnkge1xuICAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgIC8vIG1ha2Ugc3VyZSB5b3VyIHRhcmdldE9iamVjdCB0eXBlIGRlZmluaXRpb24gaGFzIGRlZmF1bHRcbiAgICAvLyB2YWx1ZXMgZm9yIGFsbCBwcm9wZXJ0aWVzLCBvdGhlcndpc2UgeW91IHdpbGwgbG9zZSBkYXRhXG4gICAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgICAvLyB1c2VkIHRvIG1ha2Ugc3VyZSB3ZSBoYXZlIGFsbCB0aGUgY29ycmVjdCBwcm9wZXJ0aWVzXG4gICAgLy8gYW5kIHdpdGggdGhlIGNvcnJlY3QgZnVuY3Rpb24gcHJvdG90eXBlc1xuICAgIC8vICoqKiBub3RlIGlmIGFyZSB5b3UgbW92aW5nIGZyb20gYSBzaW1wbGUgcHJvcGVydHkgdG9cbiAgICAvLyBhIGdldHRlci9zZXR0ZXIsIHlvdSdsbCBoYXZlIHRvIGhhbmRsZSBpdCBlbHNld2hlcmVcbiAgICBPYmplY3Qua2V5cyh0YXJnZXRPYmplY3QpLmZvckVhY2goZnVuY3Rpb24ocHJvcGVydHlOYW1lKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnVGFyZ2V0T2JqZWN0ICcsIHByb3BlcnR5TmFtZSwnOiAnLCB0YXJnZXRPYmplY3RbcHJvcGVydHlOYW1lXSk7XG5cbiAgICAgIC8vIGlmIHRoZSBwcm9wZXJ0eSBleGlzdHMgaW4gdGhlIHNvdXJjZU9iamVjdCwgdGhlbiB3ZSB3YW50IHRvIGJyaW5nIGl0IGFjcm9zc1xuICAgICAgaWYgKHByb3BlcnR5TmFtZSBpbiBzb3VyY2VPYmplY3QgJiYgc291cmNlT2JqZWN0W3Byb3BlcnR5TmFtZV0gIT0gbnVsbCkge1xuICAgICAgICAgIGlmICggdGFyZ2V0T2JqZWN0W3Byb3BlcnR5TmFtZV0gaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgICAgICB0YXJnZXRPYmplY3RbcHJvcGVydHlOYW1lXSA9IG5ldyBEYXRlKHNvdXJjZU9iamVjdFtwcm9wZXJ0eU5hbWVdLnRvU3RyaW5nKCkpIDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGFyZ2V0T2JqZWN0W3Byb3BlcnR5TmFtZV0gPSBzb3VyY2VPYmplY3RbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGFyZ2V0T2JqZWN0IDtcbiAgfVxuXG4gIHN0YXRpYyBtYXBUb05ld09iamVjdENhc2VJbnNlbnNpdGl2ZShzb3VyY2VPYmplY3Q6IGFueSwgdGFyZ2V0T2JqZWN0OiBhbnkgLCBtYXBwaW5nT2JqZWN0OiBhbnkgPSBudWxsKTogYW55IHtcbiAgICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAvLyBtYWtlIHN1cmUgeW91ciB0YXJnZXRPYmplY3QgdHlwZSBkZWZpbml0aW9uIGhhcyBkZWZhdWx0XG4gICAgLy8gdmFsdWVzIGZvciBhbGwgcHJvcGVydGllcywgb3RoZXJ3aXNlIHlvdSB3aWxsIGxvc2UgZGF0YVxuICAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gICAgLy8gdXNlZCB0byBtYWtlIHN1cmUgd2UgaGF2ZSBhbGwgdGhlIGNvcnJlY3QgcHJvcGVydGllc1xuICAgIC8vIGFuZCB3aXRoIHRoZSBjb3JyZWN0IGZ1bmN0aW9uIHByb3RvdHlwZXNcbiAgICAvLyAqKiogbm90ZSBpZiBhcmUgeW91IG1vdmluZyBmcm9tIGEgc2ltcGxlIHByb3BlcnR5IHRvXG4gICAgLy8gYSBnZXR0ZXIvc2V0dGVyLCB5b3UnbGwgaGF2ZSB0byBoYW5kbGUgaXQgZWxzZXdoZXJlXG5cbiAgICBjb25zdCBsb3dlcmNhc2VTb3VyY2VQYXJhbXM6IHN0cmluZ1tdID0gW107XG5cbiAgICBPYmplY3Qua2V5cyhzb3VyY2VPYmplY3QpLmZvckVhY2goZnVuY3Rpb24ocHJvcGVydHlOYW1lKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnU291cmNlT2JqZWN0ICcsIHByb3BlcnR5TmFtZSwgJzogJywgc291cmNlT2JqZWN0W3Byb3BlcnR5TmFtZV0pO1xuXG4gICAgICBsb3dlcmNhc2VTb3VyY2VQYXJhbXMucHVzaChwcm9wZXJ0eU5hbWUpO1xuXG4gICAgfSk7XG5cbiAgICBPYmplY3Qua2V5cyh0YXJnZXRPYmplY3QpLmZvckVhY2goIGZ1bmN0aW9uKHByb3BlcnR5TmFtZSkge1xuXG4gICAgICBjb25zdCBwcm9wZXJ0eU5hbWVMb3dlcmNhc2UgPSBwcm9wZXJ0eU5hbWUudG9Mb3dlckNhc2UoKTtcblxuICAgICAgY29uc3QgcHJvcGVydHlOYW1lU291cmNlID0gbG93ZXJjYXNlU291cmNlUGFyYW1zLmZpbmQocCA9PiBwLnRvTG93ZXJDYXNlKCkgPT09IHByb3BlcnR5TmFtZUxvd2VyY2FzZSk7XG5cbiAgICAgIC8vIFRPRE8gbmVlZCBhIHdheSB0byBnZXQgaXQgdG8gd29yayBmb3IgYXJyYXlzIGFuZCBvYmplY3RzXG4gICAgICBpZiAocHJvcGVydHlOYW1lU291cmNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJUYXJnZXQgT2JqZWN0IFR5cGUgTmFtZTogXCIsIHR5cGVvZiB0YXJnZXRPYmplY3RbcHJvcGVydHlOYW1lXSk7XG4gICAgICAgIGlmICh0YXJnZXRPYmplY3RbcHJvcGVydHlOYW1lXSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgICB0YXJnZXRPYmplY3RbcHJvcGVydHlOYW1lXSA9IG5ldyBEYXRlKHNvdXJjZU9iamVjdFtwcm9wZXJ0eU5hbWVTb3VyY2VdLnRvU3RyaW5nKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRhcmdldE9iamVjdFtwcm9wZXJ0eU5hbWVdID0gc291cmNlT2JqZWN0W3Byb3BlcnR5TmFtZVNvdXJjZV07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRhcmdldE9iamVjdCA7XG4gIH1cbn1cbiJdfQ==
