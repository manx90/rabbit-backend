/* eslint-disable @typescript-eslint/no-unsafe-member-access */ /* eslint-disable @typescript-eslint/no-unsafe-return */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OptosShipmentService", {
    enumerable: true,
    get: function() {
        return OptosShipmentService;
    }
});
const _common = require("@nestjs/common");
const _axios = require("@nestjs/axios");
const _formdata = /*#__PURE__*/ _interop_require_default(require("form-data"));
const _optostokenservice = require("./optos.token.service");
const _configservice = require("../config/config.service");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let OptosShipmentService = class OptosShipmentService {
    async createShipment(createShipment) {
        var _this_configService_business, _this_configService_business_address;
        const data = new _formdata.default();
        data.append('business', (_this_configService_business = this.configService.business) === null || _this_configService_business === void 0 ? void 0 : _this_configService_business.toString());
        data.append('business_address', (_this_configService_business_address = this.configService.business_address) === null || _this_configService_business_address === void 0 ? void 0 : _this_configService_business_address.toString());
        data.append('consignee[name]', createShipment.consignee_name);
        data.append('consignee[phone]', createShipment.consignee_phone);
        data.append('consignee[city]', createShipment.consignee_city);
        data.append('consignee[area]', createShipment.consignee_area);
        data.append('consignee[address]', createShipment.consignee_address);
        data.append('shipment_types[0][id]', createShipment.shipment_types);
        data.append('quantity', createShipment.quantity);
        data.append('items_description', createShipment.items_description);
        data.append('is_cod', createShipment.is_cod || '1');
        data.append('cod_amount', createShipment.cod_amount);
        data.append('has_return', createShipment.has_return || '1');
        data.append('return_notes', createShipment.return_notes || '');
        data.append('notes', createShipment.notes || '');
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const access_token = await this.OptosService.Login();
            console.log(access_token);
            const response = await this.httpService.axiosRef.post('https://opost.ps/api/resources/shipments', data, {
                headers: _object_spread_props(_object_spread({}, data.getHeaders()), {
                    Authorization: `Bearer ${access_token}`,
                    Accept: 'application/json'
                })
            });
            return response.data;
        } catch (error) {
            var _error_response_data, _error_response, _error_response1;
            throw new _common.HttpException((_error_response = error.response) === null || _error_response === void 0 ? void 0 : (_error_response_data = _error_response.data) === null || _error_response_data === void 0 ? void 0 : _error_response_data.message, (_error_response1 = error.response) === null || _error_response1 === void 0 ? void 0 : _error_response1.status);
        }
    }
    async getShipment(query = {}) {
        try {
            const access_token = await this.OptosService.Login();
            // Build query string from the query object
            const params = new URLSearchParams(query).toString();
            const url = `https://opost.ps/api/resources/shipments${params ? '?' + params : ''}`;
            const response = await this.httpService.axiosRef.get(url, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    Accept: 'application/json'
                },
                maxBodyLength: Infinity
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching shipments:', error.message);
            throw new _common.HttpException('Failed to fetch shipments', _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getPendingTypes() {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const access_token = await this.OptosService.Login();
            console.log(access_token);
            const response = await this.httpService.axiosRef.get('https://opost.ps/api/resources/pending-types', {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    Accept: 'application/json'
                },
                maxBodyLength: Infinity
            });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return response.data;
        } catch (error) {
            var // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            _error_response_data, _error_response, // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            _error_response1;
            throw new _common.HttpException(((_error_response = error.response) === null || _error_response === void 0 ? void 0 : (_error_response_data = _error_response.data) === null || _error_response_data === void 0 ? void 0 : _error_response_data.message) || 'Failed to fetch pending types', ((_error_response1 = error.response) === null || _error_response1 === void 0 ? void 0 : _error_response1.status) || _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getShipmentType() {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const access_token = await this.OptosService.Login();
            const response = await this.httpService.axiosRef.get(`https://opost.ps/api/resources/shipment-types`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    Accept: 'application/json'
                },
                maxBodyLength: Infinity
            });
            return response.data;
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            console.error('Error fetching shipment types:', error.message);
            throw new _common.HttpException('Failed to fetch shipment types', //@typescript-eslint/no-unsafe-member-access
            _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    constructor(httpService, OptosService, configService){
        this.httpService = httpService;
        this.OptosService = OptosService;
        this.configService = configService;
    }
};
OptosShipmentService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _axios.HttpService === "undefined" ? Object : _axios.HttpService,
        typeof _optostokenservice.OptosService === "undefined" ? Object : _optostokenservice.OptosService,
        typeof _configservice.AppConfigService === "undefined" ? Object : _configservice.AppConfigService
    ])
], OptosShipmentService);

//# sourceMappingURL=optos.shipment.service.js.map