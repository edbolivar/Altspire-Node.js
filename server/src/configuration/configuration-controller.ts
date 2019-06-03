import * as express from "express";
import { interfaces, Controller, Get } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import {AppInfoService} from "../services/app-info.service";
import {JsUtil} from "../universal/JsUtil";
import TYPES from "../server.types";
import {AppProductdataService} from "../services/app-productdata.service";
import {ConfigurationService} from "./configuration-service";
import {ProductDataService} from "./product-data-service";
import {ApiResult, ItemStateInfo, OutOfOrderEventArgs, Role} from "../universal/app.types";
import {PublishEvent, PubSubTopic} from "../universal/pub-sub-types";


@Controller('/api/config')
@injectable()
export class ConfigurationController implements interfaces.Controller {
    objectId: number ;
    callCount = 1;
    isOutOfOrder = false ;
    constructor(@inject(TYPES.AppInfo) private appInfo: AppInfoService ,
                @inject(TYPES.ConfigurationService) private configurationService: ConfigurationService,
                @inject(TYPES.ProductDataService) private productDataService: ProductDataService) {

        this.objectId = JsUtil.getObjectId();
        console.log("ctor.ConfigurationController", this.objectId);
    }

    @Get('/serviceui')
    public async GetServiceUIData(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
        this.logRequest(req);
        const result = await this.configurationService.getServiceUI();
        res.status(200)
            .json(result);
        return ;
    }

    @Get('/design/platform')
    public async getPlatform(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
        this.logRequest(req);
        // if we send in a f query string we can specify the file to return
        // this is useful in a unit test context so we can validate the URL
        // without having to change the machine configuration

        let fileTokenToReturn = '' ;

        if (req.params.f) {
            fileTokenToReturn = req.query.f;
        }

        // res.status(500)
        //     .json({"this is an error": "my bad"});

        const result = await this.configurationService.getPlatform(fileTokenToReturn);
        res.status(200)
            .json(result);
        return ;
    }

    @Get('/design/platform2')
    public async getPlatform2(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
        this.logRequest(req);
        const result = await this.configurationService.getPlatform2();
        res.status(200)
            .json(result);
        return ;
    }

    @Get('/design/home')
    public async getHome(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
        this.logRequest(req);

        let fileName = '' ;

        if (req.params.f) {
            fileName = req.query.f;
        }

        const result = await this.configurationService.getHome(fileName);
        res.status(200)
            .json(result);
        return ;
    }

    @Get('/design/flavors')
    public async getFlavorDesign(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
        this.logRequest(req);
        const result = await this.configurationService.getDesignFlavor();
        res.status(200)
            .json(result);
        return ;
    }

    @Get('/design/allpourables')
    public async getPourablesDesign(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
        this.logRequest(req);

        let country = "en-us";

        if (req.query["country"]) {
            country = req.query["country"];
        }

        const result = await this.configurationService.getDesignPourables(country);
        res.status(200)
            .json(result);
        return ;
    }

    @Get('/design/bubbles')
    public async getBubblesDesign(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
        this.logRequest(req);
        const result = await this.configurationService.getDesignBubbles();
        res.status(200)
            .json(result);
        return ;
    }

    @Get('/design/animations')
    public async getAnimationsDesign(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
        this.logRequest(req);
        const result = await this.configurationService.getDesignAnimations();
        res.status(200)
            .json(result);
        return ;
    }

    @Get('/idlestate')
    public async getIdleState(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
//        this.logRequest(req);
        const result = await this.configurationService.getIdleState();
        res.status(200)
            .json(result);
        return ;
    }

    @Get('/unitstate')
    public async getUnitState(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
        this.logRequest(req);
        const result = await this.configurationService.getUnitState();
        res.status(200)
            .json(result);
        return ;
    }

    @Get('/overrides')
    public async getOverrides(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
        this.logRequest(req);
        const result = await this.configurationService.getOverrides();
        res.status(200)
            .json(result);
        return ;
    }

    @Get('/validatepin')
    public async getValidatePin(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
        this.logRequest(req);

        console.log(req);

        const result: ApiResult = new ApiResult();
        result["url"] = req.originalUrl;

        const role = await this.configurationService.getRoleByAuthId(req.query["pin"]);
        const isPinValid = role != Role.None;

        result["details"].push("Role=" + role);
        result["details"].push("IsPinValid=" + isPinValid);

        result["success"] = isPinValid;

        res.status(200)
            .json(result);
        return ;
    }

    @Get('/localization')
    public getLocalizationForConsumerUI(req: express.Request, res: express.Response, next: express.NextFunction): any {
        this.logRequest(req);
        const data =  this.configurationService.getLocalizationForConsumerUI();
        return data;
    }

    @Get('/pourables')
    public async getPourItems(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> {
        this.logRequest(req);
        const result = await this.configurationService.getPourItems();
        res.status(200)
            .json(result);
        return ;
    }

    logRequest(req: express.Request) {
        console.log(`${this.callCount++} ${req.originalUrl}`);
    }

    @Get('/test/outoforder')
    public getOutOfOrder(req: express.Request, res: express.Response, next: express.NextFunction): any {
        this.logRequest(req);


        this.isOutOfOrder = ! this.isOutOfOrder;

        // @@Eugen
        // TEST, will always send out of order
        //this.isOutOfOrder = true ;
        // REMOVE and it will toggle between in-order and out of order

        const args = new OutOfOrderEventArgs();
        if (this.isOutOfOrder) {
            let itemStateInfo = new ItemStateInfo();
            itemStateInfo.ItemType = 'ValveController';
            itemStateInfo.Description = 'Valve Controller is OffLine';
            args.Items.push(itemStateInfo);

            itemStateInfo = new ItemStateInfo();
            itemStateInfo.ItemType = 'TouchController';
            itemStateInfo.Description = 'Touch Controller is OffLine';
            args.Items.push(itemStateInfo);
        }

        args.isOutOfOrder = this.isOutOfOrder;

        PublishEvent.Create(PubSubTopic.outOfOrderChanged, this.objectId)
            .SetDataArgumentTo(args)
            .Send();

        return args;
    }
}
