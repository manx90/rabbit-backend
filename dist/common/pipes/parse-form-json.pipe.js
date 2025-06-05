"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ParseFormJsonPipe", {
    enumerable: true,
    get: function() {
        return ParseFormJsonPipe;
    }
});
const _common = require("@nestjs/common");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let ParseFormJsonPipe = class ParseFormJsonPipe {
    transform(value, // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _metadata) {
        if (!value) return value;
        // Handle complex objects that might be sent as JSON strings in form data
        const complexFields = [
            'sizes',
            'colors',
            'images'
        ];
        const arrayFields = [
            'images',
            'sizes',
            'colors'
        ]; // Fields that should be arrays but might not be sent as JSON
        // Process JSON fields
        complexFields.forEach((field)=>{
            if (value[field]) {
                // Handle case where the field is an array containing a JSON string
                if (Array.isArray(value[field]) && value[field].length > 0 && typeof value[field][0] === 'string') {
                    try {
                        // Parse the first element if it's a JSON string
                        value[field] = JSON.parse(value[field][0]);
                        console.log(`Successfully parsed ${field} from array:`, value[field]);
                    } catch (e) {
                        console.error(`Failed to parse ${field} from array as JSON:`, e);
                        console.error(`Raw array value for ${field}:`, value[field]);
                        if (arrayFields.includes(field)) {
                            value[field] = [];
                        }
                    }
                } else if (typeof value[field] === 'string') {
                    try {
                        value[field] = JSON.parse(value[field]);
                        console.log(`Successfully parsed ${field} from string:`, value[field]);
                    } catch (e) {
                        console.error(`Failed to parse ${field} as JSON:`, e);
                        console.error(`Raw string value for ${field}:`, value[field]);
                        if (arrayFields.includes(field)) {
                            value[field] = [];
                        }
                    }
                } else {
                    console.log(`Field ${field} is already an object or array:`, value[field]);
                }
            } else {
                console.log(`Field ${field} is missing`);
            }
        });
        // Handle file uploads - convert to expected format
        if (value.imgCover === '') {
            value.imgCover = 'default-cover.jpg'; // Provide a default value
        }
        // Ensure arrays are properly initialized
        if (!value.images || !Array.isArray(value.images)) {
            value.images = value.images ? [
                value.images
            ] : [];
        }
        if (!value.sizes || !Array.isArray(value.sizes)) {
            value.sizes = value.sizes ? [
                value.sizes
            ] : [];
        }
        if (!value.colors || !Array.isArray(value.colors)) {
            value.colors = value.colors ? [
                value.colors
            ] : [];
        }
        console.log('Processed form data:', JSON.stringify(value, null, 2));
        return value;
    }
};
ParseFormJsonPipe = _ts_decorate([
    (0, _common.Injectable)()
], ParseFormJsonPipe);

//# sourceMappingURL=parse-form-json.pipe.js.map