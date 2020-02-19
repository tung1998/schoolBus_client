import {
    GoogleMaps
} from 'meteor/dburles:google-maps';
import {
    valueOfObjectToNumber,
    isJson,
    isArray,
    isNumber,
} from '../../../components/functions';
import {
    TYPE,
    COLORS,
    LOCATION_INIT,
    ZOOM,
    ICON_DEFAULT,
    OPACITY,
} from '../../../components/variableConst';

const BASE_ICON_ADDRESS = '/assets/images/markers/'
const ICON_PICKUP_ADDRESS = 'pickupAddress.png'
const ICON_TAKEOFF_ADDRESS = 'takeoffAddress.png'

function pushElementToMap(ele, map, align) {
    // Create the element and link it to the UI element.
    let element = document.getElementById(ele);
    map.controls[align].push(element);
    element.classList.remove('d-none');
    return element;
}

/**
 *
 * @param start {Object}
 * @param end {Object}
 */

function fitBoundMap(start, end) {
    const map = GoogleMaps.maps.mymap.instance;
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(valueOfObjectToNumber(start));
    bounds.extend(valueOfObjectToNumber(end));
    // console.log(bounds);
    map.fitBounds(bounds);
}

function iconCircle(fillColor = COLORS[TYPE.car_stop], strokeColor = '#fff') {
    return {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 7,
        strokeWeight: 3,
        fillOpacity: 0.8,
        strokeColor,
        fillColor,
    }
}

/**
 *
 * @param markers {object} Tất cả các marker điểm dừng
 * @param markersInBound {array} Các marker có trong bound hiện tại: mảng chứa _id của các điểm dừng
 * @param map {object}
 */

function getMarkerClosest(markers, markersInBound, map) {
    let distances = [];
    let closest = -1;
    markersInBound.forEach((key, index) => {
        let d = google.maps.geometry.spherical.computeDistanceBetween(markers[key].position, map.getCenter());
        distances[key] = d;
        if (closest == -1 || d < distances[closest]) {
            closest = key;
        }
    });
    return closest;
}

/**
 *
 * @param markers {object} Tất cả các marker điểm dừng
 * @param map {Object}
 * @returns {Array} Các marker có trong bound hiện tại: mảng chứa _id của các điểm dừng
 */
function getMarkersInBound(markers, map) {
    return Object.keys(markers).filter(key => map.getBounds().contains(markers[key].getPosition()));
}

function newPoint(x, y) {
    return new google.maps.Point(x, y);
}

function newLatLng(param1, param2) {
    if (isNumber(param1)) return new google.maps.LatLng(param1, param2);
    else if (isArray(param1)) return new google.maps.LatLng(param1[0], param1[1]);
    else if (isJson(param1)) return new google.maps.LatLng(param1.lat, param1.lng);
    else console.log('loi roiiii');
}
/**
 * Tìm kiếm địa chỉ --> output: location
 * NOTE: không miễn phí
 * @param {string} name Địa chỉ cần tìm kiếm
 * @param {object google}} service 
 */
function searchByName(name, service) {
    return new Promise((resolve, reject) => {
        serviceQuery(name, service).then(predictions => {
            let p = [];
            predictions.forEach(prediction => {
                if (prediction.place_id)
                    p.push(getAddressByPlaceID(prediction.place_id));
            });
            Promise.all(p).then(result => {
                predictions.forEach((prediction, index) => {
                    if (result[index]) {
                        prediction.place = result[index];
                        if (result[index].geometry) prediction.location = {
                            lat: result[index].geometry.location.lat(),
                            lng: result[index].geometry.location.lng()
                        };
                        delete prediction.id;
                        // delete prediction.types;
                        delete prediction.matched_substrings;
                        delete prediction.place.geometry.location;
                        delete prediction.place.html_attributions;
                        delete prediction.place.geometry;
                        delete prediction.reference;
                        // delete prediction.place_id;
                        delete prediction.structured_formatting;
                        delete prediction.terms;
                    }
                });
                predictions = predictions.filter((item) => item.place_id);
                resolve(predictions);
            }).catch(error => {
                console.log(error);
                reject({
                    error
                });
            });
        }).catch(error => {
            console.log(error);
            reject({
                error: true,
                message: error.status
            });
        });
    });
}

function serviceQuery(name, service) {
    return new Promise((resolve, reject) => {
        const request = {
            input: name, // + ' Viet nam',
            radius: 1500,
            location: new google.maps.LatLng(LOCATION_INIT[0], LOCATION_INIT[1]),
        };
        service.getQueryPredictions(request, (predictions, status) => {
            if (status != google.maps.places.PlacesServiceStatus.OK) {
                reject({
                    status
                });
            }
            resolve(predictions);
        });
    })
}

function getAddressByPlaceID(place_id) {
    const map = GoogleMaps.maps.mymap.instance;
    const placeService = new google.maps.places.PlacesService(map);
    return new Promise((resolve, reject) => {
        placeService.getDetails({
            placeId: place_id,
            fields: ['name', 'formatted_address', 'geometry']
        }, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                resolve(place);
            } else reject({
                status
            });
        });
    });
}

/**
 *
 * @param triangleCoords {array JSON key: lat, lng}
 * @returns {_o.Polygon|Polygon|xc.Polygon}
 */

function drawPolygon(triangleCoords = [], options = {}) {
    let strokeOpacity = options.opastrokeOpacity ? options.opastrokeOpacity : 0.5,
        strokeColor = options.strokeColor ? options.strokeColor : '#FF0000',
        strokeWeight = options.strokeWeight ? options.strokeWeight : 3,
        fillColor = options.fillColor ? options.fillColor : '#FF0000',
        fillOpacity = options.fillOpacity ? options.fillOpacity : 0.1;
    const map = GoogleMaps.maps.mymap.instance;
    let bermudaTriangle = new google.maps.Polygon({
        paths: triangleCoords,
        strokeColor,
        strokeOpacity,
        strokeWeight,
        fillColor,
        fillOpacity,
    });
    bermudaTriangle.setMap(map);
    return bermudaTriangle;
}

function optionsMapDefault() {
    return {
        center: new google.maps.LatLng(LOCATION_INIT[0], LOCATION_INIT[1]),
        zoom: ZOOM[TYPE.init],
        fullscreenControl: false,
        mapTypeControl: false,
        zoomControl: false,
        streetViewControl: false,
        gestureHandling: 'greedy',
        // mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
}

function createMarkerDefault(json) {
    const map = GoogleMaps.maps.mymap.instance;
    return new google.maps.Marker({
        position: json.location,
        map: map,
    });
}

function createMarkerWithLabelDefault(options) {
    const map = GoogleMaps.maps.mymap.instance;
    return new MarkerWithLabel({
        position: options.location,
        labelContent: `<strong>${options.title}</strong>`,
        icon: {
            url: options.icon.url,
            scaledSize: new google.maps.Size(options.icon.size, options.icon.size),
        },
        labelAnchor: new google.maps.Point(options.icon.size, options.icon.size * 1.8),
        json: options,
        // draggable: true, // co the di chuyen duoc icon.
        raiseOnDrag: true,
        map: map,
        optimized: false,
        labelClass, // the CSS class for the label
    });
}

/**
 * Xoa route tren ban do
 * 
 */
function clearDirections(directionsDisplay) {
    directionsDisplay.forEach(key => {
        key.setMap(null);
    });
    return [];
}

/**
 *  Tùy chọn hiển thị đường trên map
 * @param strokeColor {string}
 * @param strokeWeight {Number}
 * @param strokeOpacity {Number}
 * @returns {{strokeColor: string, strokeWeight: number, strokeOpacity: number}}
 */

function optionsPolylineDirection(strokeOpacity = OPACITY.route, strokeColor = COLORS[TYPE.current_location], strokeWeight = 6) {
    return {
        strokeColor,
        strokeWeight,
        strokeOpacity
    }
}
/**
 * Vẽ đường lên bản đồ
 * @param {*} idMarker 
 */
function drawRoute(markers, directionsService, directionsDisplay, {
    color
}) {
    const map = GoogleMaps.maps.mymap.instance;
    const index = directionsDisplay.push(new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        preserveViewport: true,
        polylineOptions: optionsPolylineDirection(OPACITY.route, color),
    }));
    directionsDisplay[index - 1].setMap(map);
    var request = {
        travelMode: google.maps.TravelMode.DRIVING
    };
    markers.forEach((key, index) => {
        if (index == 0) request.origin = key;
        else if (index == markers.length - 1) request.destination = key;
        else {
            if (!request.waypoints) request.waypoints = [];
            request.waypoints.push({
                location: key,
                stopover: true
            });
        }
    });
    return new Promise((resolve, reject) => {
        directionsService.route(request, function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay[index - 1].setDirections(result);
                resolve(directionsDisplay);
            }
        });
    })
}

function getCenterBetweenTwoPlace(latlng1, latlng2) {
    return [
        (Number(latlng1[0]) + Number(latlng2[0])) / 2,
        (Number(latlng1[1]) + Number(latlng2[1])) / 2,
    ]
}

function computeDistanceBetween(position1, position2) {
    return google.maps.geometry.spherical.computeDistanceBetween(position1, position2);
}

function createMarkerDefault(json) {
    const map = GoogleMaps.maps.mymap.instance;
    return new google.maps.Marker({
        position: json.location,
        map: map,
    });
}

export {
    pushElementToMap,
    fitBoundMap,
    iconCircle,
    getMarkersInBound,
    getMarkerClosest,
    newPoint,
    newLatLng,
    searchByName,
    getAddressByPlaceID,
    drawPolygon,
    optionsMapDefault,
    createMarkerWithLabelDefault,
    clearDirections,
    optionsPolylineDirection,
    drawRoute,
    getCenterBetweenTwoPlace,
    BASE_ICON_ADDRESS,
    ICON_PICKUP_ADDRESS,
    ICON_TAKEOFF_ADDRESS,
    createMarkerDefault,
    computeDistanceBetween,
}