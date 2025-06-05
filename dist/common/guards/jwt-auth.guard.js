/* eslint-disable @typescript-eslint/no-unsafe-call */ /* eslint-disable @typescript-eslint/no-unsafe-return */ /* eslint-disable @typescript-eslint/no-unsafe-assignment */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "JwtAuthGuard", {
    enumerable: true,
    get: function() {
        return JwtAuthGuard;
    }
});
const _common = require("@nestjs/common");
const _passport = require("@nestjs/passport");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let JwtAuthGuard = class JwtAuthGuard extends (0, _passport.AuthGuard)('jwt') {
    async canActivate(context) {
        // Try to authenticate with JWT
        try {
            return await super.canActivate(context);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
            // If JWT authentication fails, just return true for now
            // We'll handle guest tokens in a different way
            return true;
        }
    }
    constructor(){
        super();
    }
};
JwtAuthGuard = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], JwtAuthGuard);

//# sourceMappingURL=jwt-auth.guard.js.map