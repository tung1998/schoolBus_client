import {
    valueOfObjectToNumber, isJson, isArray, isNumber,
} from '../../../components/functions';
import {
    TYPE, COLORS, LOCATION_INIT, ZOOM, ICON_DEFAULT, OPACITY,
} from '../../../components/variableConst';

export {
    getOsmID
}

function getOsmID(osm_id, type) {
    switch (type) {
        case 'note':
            type = 'N'
            break;
        case 'way':
            type = 'W'
            break;
        case 'relation':
            type = 'R'
            break;
        default:
            type = 'N'
            break;
    }
    return type + osm_id;
}

