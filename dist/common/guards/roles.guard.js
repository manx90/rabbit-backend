/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RolesGuard", {
    enumerable: true,
    get: function() {
        return RolesGuard;
    }
});
const _common = require("@nestjs/common");
const _core = require("@nestjs/core");
const _rolesdecorator = require("../decorators/roles.decorator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let RolesGuard = class RolesGuard {
    canActivate(context) {
        var _request_user;
        // Get the roles required by the route (@Roles(...))
        const requiredRoles = this.reflector.getAllAndOverride(_rolesdecorator.ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        // Public route if no roles specified
        if (!requiredRoles || requiredRoles.length === 0) return true;
        // Extract user from request
        const request = context.switchToHttp().getRequest();
        const userRole = (_request_user = request.user) === null || _request_user === void 0 ? void 0 : _request_user.role;
        console.log(userRole);
        if (!userRole) {
            throw new _common.ForbiddenException('User role was not found in request context');
        }
        // Authorize: user must match at least one required role
        const allowed = requiredRoles.includes(userRole);
        if (!allowed) {
            throw new _common.ForbiddenException('You do not have the required role to access this resource');
        }
        return true;
    }
    constructor(reflector){
        this.reflector = reflector;
    }
};
RolesGuard = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _core.Reflector === "undefined" ? Object : _core.Reflector
    ])
], RolesGuard);

//# sourceMappingURL=roles.guard.js.map