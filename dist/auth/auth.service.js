/* eslint-disable @typescript-eslint/no-unsafe-member-access */ /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */ /* eslint-disable @typescript-eslint/no-unused-vars */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthService", {
    enumerable: true,
    get: function() {
        return AuthService;
    }
});
const _common = require("@nestjs/common");
const _jwt = require("@nestjs/jwt");
const _bcrypt = /*#__PURE__*/ _interop_require_wildcard(require("bcrypt"));
const _rolesconstant = require("../common/constants/roles.constant");
const _authrepository = require("../common/Repositories/auth.repository");
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
let AuthService = class AuthService {
    async signUp(registerDto) {
        this.logger.log(`Registering user: ${registerDto.username}`);
        const exists = await this.authRepository.findOne(registerDto.username);
        if (exists) throw new _common.BadRequestException('Username already exists');
        const userToSave = _object_spread({}, registerDto);
        const newUser = await this.authRepository.save(userToSave);
        const payload = {
            sub: String(newUser.id),
            username: newUser.username,
            role: newUser.role
        };
        const access_token = this.jwtService.sign(payload, {
            secret: this.configService.jwtAccessToken || 'default_secret'
        });
        const safeUser = this.toSafeUser(newUser);
        if (!safeUser) throw new _common.InternalServerErrorException('Error creating user');
        return {
            access_token,
            user: safeUser
        };
    }
    async logIn(loginDto) {
        this.logger.log(`Login attempt: ${loginDto.username}`);
        const user = await this.validateUser(loginDto.username, loginDto.password);
        if (!user) throw new _common.UnauthorizedException('Invalid username or password');
        const payload = {
            sub: String(user.id),
            username: user.username,
            role: user.role
        };
        const access_token = this.jwtService.sign(payload, {
            secret: this.configService.jwtAccessToken || 'default_secret'
        });
        return {
            access_token,
            user
        };
    }
    async validateUser(username, password) {
        const user = await this.authRepository.findOne(username);
        if (!user) return null;
        const matches = await _bcrypt.compare(password, user.password);
        if (!matches) return null;
        return this.toSafeUser(user);
    }
    async createUser(createUserDto, creatorId) {
        const creator = await this.authRepository.findById(creatorId);
        if (!creator || creator.role !== _rolesconstant.Role.SuperAdmin) {
            throw new _common.UnauthorizedException('Only SuperAdmin can create new users');
        }
        const exists = await this.authRepository.findOne(createUserDto.username);
        if (exists) {
            throw new _common.BadRequestException('Username already exists');
        }
        const hashedPassword = await _bcrypt.hash(createUserDto.password, 10);
        const newUser = await this.authRepository.save({
            username: createUserDto.username,
            password: hashedPassword,
            role: createUserDto.role
        });
        const safeUser = this.toSafeUser(newUser);
        if (!safeUser) throw new _common.InternalServerErrorException('Error creating user');
        return safeUser;
    }
    async findById(id) {
        const user = await this.authRepository.findById(id);
        return user ? this.toSafeUser(user) : null;
    }
    async findByUsername(username) {
        const user = await this.authRepository.findOne(username);
        return user ? this.toSafeUser(user) : null;
    }
    async changePassword(userId, dto) {
        const user = await this.authRepository.findById(userId);
        if (!user) throw new _common.NotFoundException(`User ${userId} not found`);
        const valid = await this.validateUser(user.username, dto.oldPassword);
        if (!valid) throw new _common.UnauthorizedException('Current password is incorrect');
        const hashedNewPassword = await _bcrypt.hash(dto.newPassword, 10);
        await this.authRepository.updatePassword(userId, hashedNewPassword);
        return {
            success: true
        };
    }
    async updateUserBySuperAdmin(adminUser, userId, updateUserDto) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
        if (adminUser.role !== _rolesconstant.Role.SuperAdmin) {
            throw new _common.UnauthorizedException('Only Super Admins can perform this action');
        }
        const user = await this.authRepository.findById(userId);
        if (!user) {
            throw new _common.NotFoundException('User not found');
        }
        if (updateUserDto.password) {
            updateUserDto.password = await _bcrypt.hash(updateUserDto.password, 10);
        }
        const updatedUser = await this.authRepository.update(userId, updateUserDto);
        if (!updatedUser) {
            throw new _common.InternalServerErrorException('Failed to update user');
        }
        return this.toSafeUser(updatedUser);
    }
    async getAllUsers() {
        const users = await this.authRepository.getAll();
        return users.map((u)=>this.toSafeUser(u)).filter((u)=>u !== null);
    }
    async deleteUser(username) {
        await this.authRepository.deleteOne(username);
    }
    async deleteAllUsers() {
        await this.authRepository.deleteAll();
        this.logger.warn('All users have been deleted');
    }
    // eslint-disable-next-line @typescript-eslint/require-await
    async isAdmin(authorization) {
        if (!(authorization === null || authorization === void 0 ? void 0 : authorization.startsWith('Bearer '))) return false;
        try {
            const token = authorization.slice(7);
            const payload = this.jwtService.verify(token, {
                secret: this.configService.jwtAccessToken || 'default_secret'
            });
            return payload.role === _rolesconstant.Role.Admin || payload.role === _rolesconstant.Role.SuperAdmin;
        } catch (err) {
            this.logger.warn(`Invalid token: ${err.message}`);
            return false;
        }
    }
    getUserIdFromToken(token) {
        try {
            const raw = token.startsWith('Bearer ') ? token.slice(7) : token;
            const decoded = this.jwtService.decode(raw);
            return (decoded === null || decoded === void 0 ? void 0 : decoded.sub) || null;
        } catch (err) {
            this.logger.error(`Error decoding token: ${err.message}`);
            return null;
        }
    }
    toSafeUser(user) {
        if (!user) return null;
        return {
            id: user.id,
            username: user.username,
            role: user.role
        };
    }
    constructor(authRepository, jwtService, configService){
        this.authRepository = authRepository;
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = new _common.Logger(AuthService.name);
    }
};
AuthService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authrepository.AuthRepository === "undefined" ? Object : _authrepository.AuthRepository,
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService,
        typeof _configservice.AppConfigService === "undefined" ? Object : _configservice.AppConfigService
    ])
], AuthService);

//# sourceMappingURL=auth.service.js.map