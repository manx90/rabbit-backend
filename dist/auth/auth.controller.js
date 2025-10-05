/* eslint-disable @typescript-eslint/no-unsafe-member-access */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthController", {
    enumerable: true,
    get: function() {
        return AuthController;
    }
});
const _common = require("@nestjs/common");
const _swagger = require("@nestjs/swagger");
const _authservice = require("./auth.service");
const _createuserdto = require("./dto/create-user.dto");
const _authdto = require("./dto/auth.dto");
const _updateuserdto = require("./dto/update-user.dto");
const _jwtauthguard = require("../common/guards/jwt-auth.guard");
const _rolesguard = require("../common/guards/roles.guard");
const _rolesdecorator = require("../common/decorators/roles.decorator");
const _rolesconstant = require("../common/constants/roles.constant");
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
let AuthController = class AuthController {
    async createUser(createUserDto, req) {
        return this.authService.createUser(createUserDto, req.user.id);
    }
    async register(dto) {
        try {
            const result = await this.authService.signUp(dto);
            return {
                statusCode: _common.HttpStatus.CREATED,
                message: 'User registered successfully',
                data: result
            };
        } catch (err) {
            throw new _common.HttpException(err.message, err.status || _common.HttpStatus.BAD_REQUEST);
        }
    }
    async login(dto) {
        try {
            const result = await this.authService.logIn(dto);
            return {
                statusCode: _common.HttpStatus.OK,
                message: 'User logged in successfully',
                data: result
            };
        } catch (err) {
            throw new _common.HttpException(err.message, err.status || _common.HttpStatus.UNAUTHORIZED);
        }
    }
    getProfile(req) {
        return {
            statusCode: _common.HttpStatus.OK,
            data: req.user
        };
    }
    async changePassword(req, dto) {
        return this.authService.changePassword(req.user.id, dto);
    }
    getAllUsers() {
        return this.authService.getAllUsers();
    }
    deleteUser(username) {
        return this.authService.deleteUser(username);
    }
    async updateUser(req, userId, updateUserDto) {
        try {
            const updatedUser = await this.authService.updateUserBySuperAdmin(req.user, userId, updateUserDto);
            return {
                statusCode: _common.HttpStatus.OK,
                message: 'User updated successfully',
                data: updatedUser
            };
        } catch (err) {
            throw new _common.HttpException(err.message, err.status || _common.HttpStatus.BAD_REQUEST);
        }
    }
    isLoggedIn(req) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const authHeader = req.headers['authorization'];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        const token = authHeader && authHeader.split(' ')[1];
        return this.authService.isLoggedIn(token);
    }
    constructor(authService){
        this.authService = authService;
    }
};
_ts_decorate([
    (0, _common.Post)('create-user'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.SuperAdmin),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Create a new user (SuperAdmin only)'
    }),
    (0, _swagger.ApiBody)({
        type: _createuserdto.CreateUserDto
    }),
    (0, _swagger.ApiCreatedResponse)({
        description: 'User created successfully'
    }),
    (0, _swagger.ApiUnauthorizedResponse)({
        description: 'Unauthorized'
    }),
    (0, _swagger.ApiForbiddenResponse)({
        description: 'Forbidden - SuperAdmin role required'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_param(1, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _createuserdto.CreateUserDto === "undefined" ? Object : _createuserdto.CreateUserDto,
        typeof RequestWithUser === "undefined" ? Object : RequestWithUser
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "createUser", null);
_ts_decorate([
    (0, _common.Post)('register'),
    (0, _swagger.ApiOperation)({
        summary: 'User register'
    }),
    (0, _swagger.ApiBody)({
        type: _authdto.RegisterDto
    }),
    (0, _swagger.ApiCreatedResponse)({
        description: 'User registered successfully'
    }),
    (0, _swagger.ApiBadRequestResponse)({
        description: 'Bad request - validation failed'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authdto.RegisterDto === "undefined" ? Object : _authdto.RegisterDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
_ts_decorate([
    (0, _common.Post)('login'),
    (0, _swagger.ApiOperation)({
        summary: 'User login'
    }),
    (0, _swagger.ApiBody)({
        type: _authdto.LoginDto
    }),
    (0, _swagger.ApiOkResponse)({
        description: 'Login successful'
    }),
    (0, _swagger.ApiUnauthorizedResponse)({
        description: 'Invalid credentials'
    }),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authdto.LoginDto === "undefined" ? Object : _authdto.LoginDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Get)('user'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get current user profile'
    }),
    (0, _swagger.ApiOkResponse)({
        description: 'User profile retrieved successfully'
    }),
    (0, _swagger.ApiUnauthorizedResponse)({
        description: 'Unauthorized'
    }),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof RequestWithUser === "undefined" ? Object : RequestWithUser
    ]),
    _ts_metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Post)('change-password'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Change user password'
    }),
    (0, _swagger.ApiBody)({
        type: _authdto.ChangePasswordDto
    }),
    (0, _swagger.ApiOkResponse)({
        description: 'Password changed successfully'
    }),
    (0, _swagger.ApiUnauthorizedResponse)({
        description: 'Unauthorized'
    }),
    (0, _swagger.ApiBadRequestResponse)({
        description: 'Bad request - validation failed'
    }),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof RequestWithUser === "undefined" ? Object : RequestWithUser,
        typeof _authdto.ChangePasswordDto === "undefined" ? Object : _authdto.ChangePasswordDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.SuperAdmin),
    (0, _common.Get)('all'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Get all users (SuperAdmin only)'
    }),
    (0, _swagger.ApiOkResponse)({
        description: 'Users retrieved successfully'
    }),
    (0, _swagger.ApiUnauthorizedResponse)({
        description: 'Unauthorized'
    }),
    (0, _swagger.ApiForbiddenResponse)({
        description: 'Forbidden - SuperAdmin role required'
    }),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", []),
    _ts_metadata("design:returntype", void 0)
], AuthController.prototype, "getAllUsers", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.SuperAdmin, _rolesconstant.Role.Admin),
    (0, _common.Delete)('user/:username'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Delete user by username (Admin/SuperAdmin only)'
    }),
    (0, _swagger.ApiParam)({
        name: 'username',
        description: 'Username to delete'
    }),
    (0, _swagger.ApiOkResponse)({
        description: 'User deleted successfully'
    }),
    (0, _swagger.ApiUnauthorizedResponse)({
        description: 'Unauthorized'
    }),
    (0, _swagger.ApiForbiddenResponse)({
        description: 'Forbidden - Admin/SuperAdmin role required'
    }),
    _ts_param(0, (0, _common.Param)('username')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", void 0)
], AuthController.prototype, "deleteUser", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    (0, _rolesdecorator.Roles)(_rolesconstant.Role.SuperAdmin),
    (0, _common.Post)('update-user/:userId'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Update user by SuperAdmin'
    }),
    (0, _swagger.ApiParam)({
        name: 'userId',
        description: 'User ID to update'
    }),
    (0, _swagger.ApiBody)({
        type: _updateuserdto.UpdateUserDto
    }),
    (0, _swagger.ApiOkResponse)({
        description: 'User updated successfully'
    }),
    (0, _swagger.ApiUnauthorizedResponse)({
        description: 'Unauthorized'
    }),
    (0, _swagger.ApiForbiddenResponse)({
        description: 'Forbidden - SuperAdmin role required'
    }),
    (0, _swagger.ApiBadRequestResponse)({
        description: 'Bad request - validation failed'
    }),
    _ts_param(0, (0, _common.Req)()),
    _ts_param(1, (0, _common.Param)('userId')),
    _ts_param(2, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof RequestWithUser === "undefined" ? Object : RequestWithUser,
        String,
        typeof _updateuserdto.UpdateUserDto === "undefined" ? Object : _updateuserdto.UpdateUserDto
    ]),
    _ts_metadata("design:returntype", Promise)
], AuthController.prototype, "updateUser", null);
_ts_decorate([
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.Get)('isLoggedIn'),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Check if user is logged in'
    }),
    (0, _swagger.ApiOkResponse)({
        description: 'Login status checked successfully'
    }),
    (0, _swagger.ApiUnauthorizedResponse)({
        description: 'Unauthorized'
    }),
    _ts_param(0, (0, _common.Req)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _common.Request === "undefined" ? Object : _common.Request
    ]),
    _ts_metadata("design:returntype", void 0)
], AuthController.prototype, "isLoggedIn", null);
AuthController = _ts_decorate([
    (0, _swagger.ApiTags)('Authentication'),
    (0, _common.Controller)('auth'),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _authservice.AuthService === "undefined" ? Object : _authservice.AuthService
    ])
], AuthController);

//# sourceMappingURL=auth.controller.js.map