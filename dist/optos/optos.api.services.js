"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OptosApiService", {
    enumerable: true,
    get: function() {
        return OptosApiService;
    }
});
const _common = require("@nestjs/common");
const _axios = require("@nestjs/axios");
const _optostokenservice = require("./optos.token.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let OptosApiService = class OptosApiService {
    async Businesses() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const access_token = await this.OptosService.Login();
        const response = await this.httpService.axiosRef.get('https://opost.ps/api/resources/businesses', {
            headers: {
                Authorization: `Bearer ${access_token}`,
                Accept: 'application/json'
            },
            maxBodyLength: Infinity
        });
        return response.data;
    }
    async BusinessesAddress() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const access_token = await this.OptosService.Login();
        const response = await this.httpService.axiosRef.get('https://opost.ps/api/resources/business-addresses', {
            headers: {
                Authorization: `Bearer ${access_token}`,
                Accept: 'application/json'
            },
            maxBodyLength: Infinity
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return response.data;
    }
    async Cities() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const access_token = await this.OptosService.Login();
        const response = await this.httpService.axiosRef.get('https://opost.ps/api/resources/cities', {
            headers: {
                Authorization: `Bearer ${access_token}`,
                Accept: 'application/json'
            },
            maxBodyLength: Infinity
        });
        return response.data;
    }
    async Area(city) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const access_token = await this.OptosService.Login();
        const City = city;
        const response = await this.httpService.axiosRef.get(`https://opost.ps/api/resources/areas?city=${City}&limit=1000`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                Accept: 'application/json'
            },
            maxBodyLength: Infinity
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return response.data;
    }
    constructor(httpService, OptosService){
        this.httpService = httpService;
        this.OptosService = OptosService;
    }
};
OptosApiService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _axios.HttpService === "undefined" ? Object : _axios.HttpService,
        typeof _optostokenservice.OptosService === "undefined" ? Object : _optostokenservice.OptosService
    ])
], OptosApiService);

//# sourceMappingURL=optos.api.services.js.map