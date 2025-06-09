"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    AuthUser: function() {
        return AuthUser;
    },
    ChangePasswordDto: function() {
        return ChangePasswordDto;
    },
    LoginDto: function() {
        return LoginDto;
    },
    RegisterDto: function() {
        return RegisterDto;
    }
});
const _classvalidator = require("class-validator");
const _swagger = require("@nestjs/swagger");
const _rolesconstant = require("../../common/constants/roles.constant");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let LoginDto = class LoginDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'newuser',
        description: 'Username for authentication'
    }),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Username is required'
    }),
    (0, _classvalidator.IsString)({
        message: 'Username must be a string'
    }),
    _ts_metadata("design:type", String)
], LoginDto.prototype, "username", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'StrongP@ss1',
        description: 'User password'
    }),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Password is required'
    }),
    (0, _classvalidator.IsString)({
        message: 'Password must be a string'
    }),
    _ts_metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
let RegisterDto = class RegisterDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'newuser',
        description: 'Desired username'
    }),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Username is required'
    }),
    (0, _classvalidator.IsString)({
        message: 'Username must be a string'
    }),
    (0, _classvalidator.MinLength)(3, {
        message: 'Username must be at least 3 characters long'
    }),
    (0, _classvalidator.MaxLength)(20, {
        message: 'Username cannot exceed 20 characters'
    }),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "username", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'StrongP@ss1',
        description: 'Desired password'
    }),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Password is required'
    }),
    (0, _classvalidator.IsString)({
        message: 'Password must be a string'
    }),
    (0, _classvalidator.MinLength)(6, {
        message: 'Password must be at least 6 characters long'
    }),
    (0, _classvalidator.Matches)(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character'
    }),
    _ts_metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        enum: _rolesconstant.Role,
        enumName: 'Role',
        example: _rolesconstant.Role.Admin,
        description: 'Optional user role',
        required: false
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsEnum)(_rolesconstant.Role, {
        message: 'Role must be a valid enum value'
    }),
    _ts_metadata("design:type", typeof _rolesconstant.Role === "undefined" ? Object : _rolesconstant.Role)
], RegisterDto.prototype, "role", void 0);
let ChangePasswordDto = class ChangePasswordDto {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'OldP@ss1',
        description: 'Current password'
    }),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Current password is required'
    }),
    (0, _classvalidator.IsString)({
        message: 'Current password must be a string'
    }),
    _ts_metadata("design:type", String)
], ChangePasswordDto.prototype, "oldPassword", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'NewP@ss2',
        description: 'New password'
    }),
    (0, _classvalidator.IsNotEmpty)({
        message: 'New password is required'
    }),
    (0, _classvalidator.IsString)({
        message: 'New password must be a string'
    }),
    (0, _classvalidator.MinLength)(6, {
        message: 'New password must be at least 6 characters long'
    }),
    (0, _classvalidator.Matches)(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'New password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character'
    }),
    _ts_metadata("design:type", String)
], ChangePasswordDto.prototype, "newPassword", void 0);
let AuthUser = class AuthUser {
};
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'admin',
        description: 'Username'
    }),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Username is required'
    }),
    (0, _classvalidator.IsString)({
        message: 'Username must be a string'
    }),
    _ts_metadata("design:type", String)
], AuthUser.prototype, "username", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: 'StrongP@ss1',
        description: 'Password'
    }),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Password is required'
    }),
    (0, _classvalidator.IsString)({
        message: 'Password must be a string'
    }),
    _ts_metadata("design:type", String)
], AuthUser.prototype, "password", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        enum: _rolesconstant.Role,
        enumName: 'Role',
        example: _rolesconstant.Role.Admin,
        description: 'User role',
        required: false
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsEnum)(_rolesconstant.Role, {
        message: 'Role must be a valid enum value'
    }),
    _ts_metadata("design:type", typeof _rolesconstant.Role === "undefined" ? Object : _rolesconstant.Role)
], AuthUser.prototype, "role", void 0);
_ts_decorate([
    (0, _swagger.ApiProperty)({
        example: '1',
        description: 'User ID',
        required: false
    }),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.IsString)({
        message: 'ID must be a string'
    }),
    _ts_metadata("design:type", String)
], AuthUser.prototype, "id", void 0);

//# sourceMappingURL=auth.dto.js.map