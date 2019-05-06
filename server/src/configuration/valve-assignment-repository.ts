import {inject, injectable} from "inversify";
import {AppInfoService} from "../services/app-info.service";
import {ProductDataService} from "./product-data-service";
import TYPES, {FileLocations} from "../server.types";
import * as JSONFILE from "load-json-file";
import {JsUtil} from "../universal/JsUtil";
import * as path from "path";
import {
    ButtonModel, UnitConfigurationModel, ValveAssignment, ValveConfigurationRow,
    ValveLabelPair
} from "../universal/app.types";

const PATH = require("path");
let _ = require("lodash");

@injectable()
export class ValveAssignmentRepository {
    objectId: number;
    allunits: UnitConfigurationModel[] = [];

    constructor(@inject(TYPES.AppInfo) private appInfo: AppInfoService,
                @inject(TYPES.FileLocations) private fileLocations: FileLocations) {
        this.objectId = JsUtil.getObjectId();
        console.log("ctor.ValveAssignmentRepository", this.objectId);

        this.initializeValveConfigurations();
    }

    initializeValveConfigurations() {
        var valveConfigFile = JSONFILE.sync(this.fileLocations.valveConfigurationState);
        var allunits_dirty = valveConfigFile.Units;

        for (let unit of allunits_dirty) {
            this.allunits.push(JsUtil.mapToNewObject(unit, new UnitConfigurationModel(unit.ValveLayout, [])));
        }

        this.fixUpAllLabelPairs();
        this.applyWeightingForSubsequentOrderBy();
    }

    // TODO figure out why it's not taking these
    fixUpAllLabelPairs() {
        for (let eachUnit of this.allunits) {
            for (let valveAssignmentRow of eachUnit.ValveLayout) {
                for (let valve of valveAssignmentRow.ValveLabelPair) {
                    valve.Row = valveAssignmentRow.RowNumber;
                    eachUnit.AllValveLabelPairs.push(JsUtil.mapToNewObject(valve, new ValveLabelPair()));
                }
            }
        }
    }

    applyWeightingForSubsequentOrderBy() {
        // foreach allunits
        for (let eachUnit of this.allunits) {
            for (let valveAssignmentRow of eachUnit.ValveLayout) {
                for (let valve of valveAssignmentRow.ValveLabelPair) {
                    if (valve.Label === "CW-R" || valve.Label === "CW" || valve.Label === "HC") {
                        valve.Weighting = 10;
                    } else if (valve.Label == "PW-R" || valve.Label == "PW" || valve.Label == "HS") {
                        valve.Weighting = 20;
                    } else if (valve.Label == "CW-L" || valve.Label == "LC") {
                        valve.Weighting = 30;
                    } else if (valve.Label == "PW-L" || valve.Label == "LS") {
                        valve.Weighting = 40;
                    } else {
                        var valveNumberAsString = valve.Label.substr(1);
                        var nval = +valveNumberAsString;

                        if (nval === NaN) {
                            console.log("Error: Invalid ValveNumber inside of Label " + eachUnit.Id + " row:" + valveAssignmentRow.RowNumber + " Label:" + valve.Label);
                        }

                        if (valve.Label.startsWith("S")) {
                            valve.Weighting = 100 * nval;
                        } else if (valve.Label.startsWith("F")) {
                            valve.Weighting = 5000 * nval;
                        } else {
                            console.log("Error: Invalid Label inside of Label " + eachUnit.Id + " row:" + valveAssignmentRow.RowNumber + " Label:" + valve.Label);
                        }
                    }
                }
            }
        }
    }

    getAvailableConfiguration(): UnitConfigurationModel[] {
        return this.allunits;
    }

    // TODO make allunits a real object
    getConfiguration(unitName: string): UnitConfigurationModel {
        const item = _.find(this.allunits, function(unit) { unit.UnitName === unitName } );
        if (item == null) {
            console.log("Unit configuration not found.");
            return;
        }
        return item;
    }

    getConfigurationById(id: string): UnitConfigurationModel {
        const item: UnitConfigurationModel = _.find(this.allunits, function(unit) { return unit.Id === id } );
        if (item == null) {
            console.log("Unit configuration not found.");
            return;
        }

        return item;
    }

    getCurrentValveAssignments(): ValveAssignment {
        var valveAssignmentsFile = this.fileLocations.valveAssignmentState;
        console.log(valveAssignmentsFile);
        return JSONFILE.sync(valveAssignmentsFile);
    }

    // TODO implement serializetodisk
    writeValveAssignments(valveAssignments: ValveAssignment) {
        var valveAssignmentsFile = this.fileLocations.valveAssignmentState;
        // serializetodisk
    }

}