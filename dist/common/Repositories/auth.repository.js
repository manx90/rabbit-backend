/* eslint-disable @typescript-eslint/no-unsafe-member-access */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthRepository", {
    enumerable: true,
    get: function() {
        return AuthRepository;
    }
});
const _common = require("@nestjs/common");
const _typeorm = require("@nestjs/typeorm");
const _typeorm1 = require("typeorm");
const _jwt = require("@nestjs/jwt");
const _bcrypt = /*#__PURE__*/ _interop_require_wildcard(require("bcrypt"));
const _authentity = require("../../auth/entities/auth.entity");
const _rolesconstant = require("../constants/roles.constant");
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
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let AuthRepository = class AuthRepository {
    /** Update user by ID */ async update(userId, updateUserDto) {
        const user = await this.findById(userId);
        if (!user) {
            throw new _common.NotFoundException('User not found');
        }
        // تحديث خصائص المستخدم بالبيانات الجديدة من updateUserDto
        Object.assign(user, updateUserDto);
        try {
            return await this.authRepository.save(user);
        } catch (error) {
            this.logger.error(`Error updating user: ${error.message}`, error.stack);
            throw new _common.InternalServerErrorException('Failed to update user');
        }
    }
    /** Find a user by username */ async findOne(username) {
        try {
            return await this.authRepository.findOne({
                where: {
                    username
                }
            });
        } catch (error) {
            this.logger.error(`Error finding user: ${error.message}`, error.stack);
            throw new _common.InternalServerErrorException('Error finding user');
        }
    }
    /** Find a user by ID */ async findById(id) {
        try {
            return await this.authRepository.findOne({
                where: {
                    id
                }
            });
        } catch (error) {
            this.logger.error(`Error finding user by ID: ${error.message}`, error.stack);
            throw new _common.InternalServerErrorException('Error finding user');
        }
    }
    /** Save a new user */ async save(user) {
        const exists = await this.findOne(user.username);
        if (exists) {
            throw new _common.ConflictException('Username already taken');
        }
        const saltRounds = Number(process.env.SALT) || 10;
        const hashed = await _bcrypt.hash(user.password, saltRounds);
        const entity = new _authentity.auth();
        entity.username = user.username;
        entity.password = hashed;
        var _user_role;
        entity.role = (_user_role = user.role) !== null && _user_role !== void 0 ? _user_role : _rolesconstant.Role.Salesman;
        try {
            return await this.authRepository.save(entity);
        } catch (error) {
            this.logger.error(`Error saving user: ${error.message}`, error.stack);
            throw new _common.InternalServerErrorException('Failed to create user');
        }
    }
    /** Validate credentials */ async validateUser(username, password) {
        const user = await this.findOne(username);
        if (!user) return null;
        const valid = await _bcrypt.compare(password, user.password);
        return valid ? user : null;
    }
    /** Generate JWT token */ generateToken(user) {
        const payload = {
            username: user.username,
            sub: user.id,
            role: user.role
        };
        return {
            access_token: this.jwtService.sign(payload)
        };
    }
    /** Update password */ async updatePassword(id, newPwd) {
        const user = await this.findById(id);
        if (!user) {
            throw new _common.NotFoundException('User not found');
        }
        const saltRounds = Number(process.env.SALT) || 10;
        user.password = await _bcrypt.hash(newPwd, saltRounds);
        return this.authRepository.save(user);
    }
    /** Delete all users */ async deleteAll() {
        await this.authRepository.clear();
    }
    /** Get all users */ async getAll() {
        return this.authRepository.find();
    }
    /** Delete one user by username */ async deleteOne(username) {
        const user = await this.findOne(username);
        if (!user) {
            throw new _common.NotFoundException('User not found');
        }
        await this.authRepository.delete({
            username
        });
    }
    constructor(authRepository, jwtService){
        this.authRepository = authRepository;
        this.jwtService = jwtService;
        this.logger = new _common.Logger(AuthRepository.name);
    }
};
AuthRepository = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_param(0, (0, _typeorm.InjectRepository)(_authentity.auth)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _typeorm1.Repository === "undefined" ? Object : _typeorm1.Repository,
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService
    ])
], AuthRepository);

//# sourceMappingURL=auth.repository.js.map