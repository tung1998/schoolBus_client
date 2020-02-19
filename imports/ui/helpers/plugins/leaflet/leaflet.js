import {
    getWidthOfText,
    capitalizeFirstLetter
} from '../../../components/functions'
import {
    MARKER_LEAFLET
} from '../../../components/variableConst'

function createIconHTML() {
    let div = document.createElement('div');
    let img = this._createImg(MARKER_LEAFLET[`${this.options['type']}Place`].iconUrl);
    img.setAttribute("class", 'image');
    let labelDiv = document.createElement('div');
    let widthLabelDiv = getWidthOfText(this.options['text'], 'Arial, Helvetica, sans-serif', '14px')+10 ; // 10px padding của marker .map-book-trip-wrapper .markerLabel
    labelDiv.setAttribute('class', `position-absolute font-weight-normal text-description markerLabel font-14 markerLabel${capitalizeFirstLetter(this.options['type'])}`);
    // căn giữa label của marker
    // 45 la height cua labelDiv
    labelDiv.setAttribute('style', `top: -25px !important; left: -${(widthLabelDiv - MARKER_LEAFLET[`${this.options['type']}Place`].size)/2}px !important;`);
    labelDiv.innerHTML = this.options['text'];
    // div.setAttribute(`id`, `FK${kit.KitID}`);
    div.appendChild(img);
    div.appendChild(labelDiv);
    this._setIconStyles(div, 'icon');
    return div;
}

export {
    createIconHTML,
}