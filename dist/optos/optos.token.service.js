"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OptosService", {
    enumerable: true,
    get: function() {
        return OptosService;
    }
});
const _common = require("@nestjs/common");
const _axios = require("@nestjs/axios");
const _dotenv = /*#__PURE__*/ _interop_require_wildcard(require("dotenv"));
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
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
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
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
// eslint-disable-next-line @typescript-eslint/no-require-imports
const FormData = require("form-data");
_dotenv.config({
    path: '.env'
});
let OptosService = class OptosService {
    async Login() {
        const clientId = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;
        const grantType = process.env.GRANT_TYPE;
        const username = process.env.USERNAME1;
        const password = process.env.PASSWORD;
        const scope = process.env.SCOPE;
        if (!clientId || !clientSecret || !grantType || !username || !password) {
            const missingVars = [];
            if (!clientId) missingVars.push('CLIENT_ID');
            if (!clientSecret) missingVars.push('CLIENT_SECRET');
            if (!grantType) missingVars.push('GRANT_TYPE');
            if (!username) missingVars.push('USERNAME');
            if (!password) missingVars.push('PASSWORD');
            throw new _common.HttpException(`Missing required environment variables: ${missingVars.join(', ')}. Please check your .env file.`, _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const data = new FormData();
        data.append('grant_type', grantType);
        data.append('client_id', clientId);
        data.append('client_secret', clientSecret);
        data.append('username', username);
        data.append('password', password);
        if (scope) {
            data.append('scope', scope);
        }
        const urlLogin = 'https://opost.ps/oauth/token';
        if (!urlLogin) {
            throw new _common.HttpException('URL_LOGIN configuration is missing', _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        try {
            const response = await this.httpService.axiosRef.post(urlLogin.trim(), data, {
                headers: _object_spread({
                    Accept: 'application/json'
                }, data.getHeaders()),
                maxBodyLength: Infinity
            });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            return response.data.access_token;
        } catch (error) {
            var // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            _error_response, _error_response_data, _error_response1;
            console.error('Error creating token:', ((_error_response = error.response) === null || _error_response === void 0 ? void 0 : _error_response.data) || error.message);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (((_error_response1 = error.response) === null || _error_response1 === void 0 ? void 0 : (_error_response_data = _error_response1.data) === null || _error_response_data === void 0 ? void 0 : _error_response_data.error) === 'invalid_grant') {
                throw new _common.HttpException('Authentication failed: Please check your username and password are correct', _common.HttpStatus.UNAUTHORIZED);
            }
            throw new _common.HttpException(// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            `Failed to create token: ${error.message}`, _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async userInfo(access_token) {
        if (!access_token) {
            throw new _common.HttpException('Access token is required', _common.HttpStatus.BAD_REQUEST);
        }
        const urlUserInfo = 'https://opost.ps/api/oauth/user';
        try {
            const response = await this.httpService.axiosRef.get(urlUserInfo, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    Accept: 'application/json'
                },
                maxBodyLength: Infinity
            });
            return response.data;
        } catch (error) {
            var // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            _error_response, _error_response1, // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            _error_response2;
            console.error('Error fetching user info:', ((_error_response = error.response) === null || _error_response === void 0 ? void 0 : _error_response.data) || error.message);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (((_error_response1 = error.response) === null || _error_response1 === void 0 ? void 0 : _error_response1.status) === 401) {
                throw new _common.HttpException('Invalid or expired access token', _common.HttpStatus.UNAUTHORIZED);
            }
            throw new _common.HttpException(// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            `Failed to fetch user info: ${error.message}`, ((_error_response2 = error.response) === null || _error_response2 === void 0 ? void 0 : _error_response2.status) || _common.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    constructor(httpService){
        this.httpService = httpService;
    }
};
OptosService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _axios.HttpService === "undefined" ? Object : _axios.HttpService
    ])
], OptosService);

//# sourceMappingURL=optos.token.service.js.map