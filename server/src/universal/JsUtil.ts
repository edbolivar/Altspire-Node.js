
import * as moment from 'moment';
import * as shortid from 'shortid';
import {ButtonModel} from "./app.types";
import * as _ from 'lodash';

export class JsUtil {
  static _objectIdSeed = 0 ;
  static capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static getObjectId() {
    return ++this._objectIdSeed;
  }

  static clone(objectToClone: any) {
    const contents = JSON.stringify(objectToClone);
    const newObj = JSON.parse(contents);
    return newObj;
  }

  static zeroPad(num, numZeros) {
    const n = Math.abs(num);
    const zeros = Math.max(0, numZeros - Math.floor(n).toString().length );
    let zeroString = Math.pow(10, zeros).toString().substr(1);

    if ( num < 0 ) {
      zeroString = '-' + zeroString;
    }

    return zeroString + n ;
  }

  static logPourConfig(brandButton: ButtonModel, flavorButtons: ButtonModel[]) {
      // let flavors = "";
      // _.forEach(flavorButtons, function(flavorButton: ButtonModel){
      //
      //   if (flavors.length > 0) {
      //     flavors += ", ";
      //   }
      //
      //   flavors += flavorButton.Label ;
      // });

      const msg = `Pour: ${brandButton.Label}\r\n  Flavors: ${flavors}` ;
      console.log(msg);
  }


  static formatSeconds(seconds: number) {
    // converts seconds to hhh:mm:ss
    const nseconds = Number(seconds) ;
    const h = Math.floor(nseconds / 3600);
    const m = this.zeroPad(Math.floor(nseconds % 3600 / 60),2);
    const s = this.zeroPad(Math.floor(nseconds % 3600 % 60),2);

    const result = `${h}:${m}:${s}` ;
    return result;
  }

  static generateId() {
    // it'd wrapped in case we decide to change implementation;
    return shortid.generate() ;
  }



  static extractDocTypeFromDocumentId(key: string) {

    return key ;
  }



  static mapToNewObject(sourceObject: any, targetObject: any): any {
    // ************************************************************
    // make sure your targetObject type definition has default
    // values for all properties, otherwise you will lose data
    // ************************************************************

    // used to make sure we have all the correct properties
    // and with the correct function prototypes
    // *** note if are you moving from a simple property to
    // a getter/setter, you'll have to handle it elsewhere
    Object.keys(targetObject).forEach(function(propertyName) {
      // console.log('TargetObject ', propertyName,': ', targetObject[propertyName]);

      // if the property exists in the sourceObject, then we want to bring it across
      if (propertyName in sourceObject && sourceObject[propertyName] != null) {
          if ( targetObject[propertyName] instanceof Date) {
            targetObject[propertyName] = new Date(sourceObject[propertyName].toString()) ;
          } else {
            targetObject[propertyName] = sourceObject[propertyName];
          }
      }
    });

    return targetObject ;
  }

  static mapToNewObjectCaseInsensitive(sourceObject: any, targetObject: any , mappingObject: any = null): any {
    // ************************************************************
    // make sure your targetObject type definition has default
    // values for all properties, otherwise you will lose data
    // ************************************************************

    // used to make sure we have all the correct properties
    // and with the correct function prototypes
    // *** note if are you moving from a simple property to
    // a getter/setter, you'll have to handle it elsewhere

    const lowercaseSourceParams: string[] = [];

    Object.keys(sourceObject).forEach(function(propertyName) {
      // console.log('SourceObject ', propertyName, ': ', sourceObject[propertyName]);

      lowercaseSourceParams.push(propertyName);

    });

    Object.keys(targetObject).forEach( function(propertyName) {

      const propertyNameLowercase = propertyName.toLowerCase();

      const propertyNameSource = lowercaseSourceParams.find(p => p.toLowerCase() === propertyNameLowercase);

      // TODO need a way to get it to work for arrays and objects
      if (propertyNameSource !== undefined) {
        // console.log("Target Object Type Name: ", typeof targetObject[propertyName]);
        if (targetObject[propertyName] instanceof Date) {
          targetObject[propertyName] = new Date(sourceObject[propertyNameSource].toString());
        } else {
          targetObject[propertyName] = sourceObject[propertyNameSource];
        }
      }

    });

    return targetObject ;
  }
}
