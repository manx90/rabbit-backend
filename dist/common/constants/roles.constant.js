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
    ROLES_HIERARCHY: function() {
        return ROLES_HIERARCHY;
    },
    Role: function() {
        return Role;
    }
});
var Role = /*#__PURE__*/ function(Role) {
    Role["SuperAdmin"] = "SuperAdmin";
    Role["Admin"] = "Admin";
    Role["Salesman"] = "Salesman";
    Role["GUEST"] = "GUEST";
    return Role;
}({});
const ROLES_HIERARCHY = {
    ["SuperAdmin"]: [
        "SuperAdmin",
        "Admin",
        "Salesman",
        "GUEST"
    ],
    ["Admin"]: [
        "Admin",
        "Salesman",
        "GUEST"
    ],
    ["Salesman"]: [
        "Salesman",
        "GUEST"
    ],
    ["GUEST"]: [
        "GUEST"
    ]
};

//# sourceMappingURL=roles.constant.js.map