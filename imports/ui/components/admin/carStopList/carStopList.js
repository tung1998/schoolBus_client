import './carStopList.html';

const Cookies = require("js-cookie");

import {
    MeteorCall,
    handleError,
    handleSuccess,
    handleConfirm,
    addRequiredInputLabel,
    addPaging,
    getBase64,
    makeID,
    initDropzone,
    handlePaging
} from "../../../../functions";

import {
    _METHODS,
    LIMIT_DOCUMENT_PAGE,
    _SESSION,
} from "../../../../variableConst";

let accessToken;
let currentPage = 1;


Template.carStopList.onCreated(() => {
    accessToken = Cookies.get("accessToken");
});

Template.carStopList.onRendered(() => {
    addRequiredInputLabel();
    addPaging($('#carStopTable'));
    reloadTable();
    this.checkIsSuperAdmin = Tracker.autorun(() => {
        if (Session.get(_SESSION.isSuperadmin)) {
            initSchoolSelect2()
        }
    })
});

Template.carStopList.onDestroyed(() => {
    if(this.checkIsSuperAdmin) this.checkIsSuperAdmin = null
})

Template.micromap.onRendered(() => {
    setMapHeight()
    L.Icon.Default.imagePath = '/packages/bevanhunt_leaflet/images/';
    let micromap = L.map('micromap', {
        drawControl: true
    }).setView([21.0388, 105.7886], 19);
    L.tileLayer('https://apis.wemap.asia/raster-tiles/styles/osm-bright/{z}/{x}/{y}@2x.png?key=vpstPRxkBBTLaZkOaCfAHlqXtCR', {
        maxZoom: 18,
        id: 'mapbox.streets'
    }).addTo(micromap);

    let marker = L.marker([21.03709858, 105.78349972]).addTo(micromap);
    micromap.on('move', function () {
        marker.setLatLng(micromap.getCenter());
    });

    //Dragend event of map for update marker position
    micromap.on('dragend', function (e) {
        let cnt = micromap.getCenter();
        let position = marker.getLatLng();
        lat = Number(position['lat']).toFixed(5);
        lng = Number(position['lng']).toFixed(5);
        $('.position').val(lat + ' ' + lng);
    });
})

Template.carStopList.helpers({
    isSuperadmin() {
        return Session.get(_SESSION.isSuperadmin)
    }
})

Template.carStopList.events({
    "submit form": SubmitForm,
    "click .modify-button": ClickModifyButton,
    "click .delete-button": ClickDeleteButton,
    "click .kt-datatable__pager-link": (e) => {
        reloadTable(parseInt($(e.currentTarget).data('page')), getLimitDocPerPage());
        $(".kt-datatable__pager-link").removeClass("kt-datatable__pager-link--active");
        $(e.currentTarget).addClass("kt-datatable__pager-link--active")
        currentPage = parseInt($(e.currentTarget).data('page'));
    },
    "change #limit-doc": (e) => {
        reloadTable(1, getLimitDocPerPage());
    },
});

Template.carStopListFilter.events({
    'click #filter-button': carStopListFilter,
    'click #refresh-button': refreshFilter,
    'keypress .filter-input': (e) => {
        if (e.which === 13 || e.keyCode == 13) {
            carStopListFilter()
        }
    },
    'change #school-filter': (e) => {
        let options = [{
            text: "schoolID",
            value: $('#school-filter').val()
        }]
        reloadTable(1, getLimitDocPerPage(), options)
    }
})

Template.carStopListFilter.helpers({
    isSuperadmin() {
        return Session.get(_SESSION.isSuperadmin)
    },
    schools() {
        return Session.get('schools')
    },
});


function ClickModifyButton(event) {

    let carStopData = $(event.currentTarget).data("json");
    $("#editCarStopModal").attr("carStopID", carStopData._id);
    $(".modal-title").html("Chỉnh Sửa");
    $(".confirm-button").html("Sửa");

    $("#stopName").val(carStopData.name);
    $("#stopType").val(carStopData.stopType);
    $("#address").val(carStopData.address);
    $("#editCarStopModal").modal("show");
}

function ClickDeleteButton(event) {
    handleConfirm().then(result => {
        if (result.value) {
            let data = $(event.currentTarget).data("json");
            MeteorCall(_METHODS.carStop.Delete, data, accessToken)
                .then(result => {
                    Swal.fire({
                        icon: "success",
                        text: "Đã xóa thành công",
                        timer: 3000
                    })
                    reloadTable(currentPage, getLimitDocPerPage())
                }).catch(handleError)
        } else {

        }
    })
}

function SubmitForm(event) {
    event.preventDefault();
    let carStopUpdate = {
        _id: $("#editCarStopModal").attr("carStopID"),
        stopType: event.target.stopType.value,
        name: event.target.stopName.value,
        address: event.target.address.value,
        location: getLatLng(event.target.location.value)
    }
    console.log(carStopUpdate)
    //let modify = $("#editCarStopModal").attr("carStopID");
    event.target.stopType.value = " ";
    event.target.stopName.value = " ";
    event.target.address.value = " ";
    event.target.location.value = " ";

    if (Session.get(_SESSION.isSuperadmin)) {
        carStopUpdate.schoolID = $('#school-input').val()
    }
    MeteorCall(_METHODS.carStop.Update, carStopUpdate, accessToken)
        .then(result => {
            handleSuccess("Thêm").then(() => {
                $("#editCarStopModal").modal("hide");
                reloadTable(currentPage, getLimitDocPerPage())
                clearForm()
            })
        })
        .catch(handleError);
}

function getLimitDocPerPage() {
    return parseInt($("#limit-doc").val());
}

function reloadTable(page = 1, limitDocPerPage = LIMIT_DOCUMENT_PAGE, options = null) {
    let table = $('#table-body');
    MeteorCall(_METHODS.carStop.GetByPage, {
        page: page,
        limit: limitDocPerPage,
        options
    }, accessToken).then(result => {
        handlePaging(table, result.count, page, limitDocPerPage)
        createTable(table, result, limitDocPerPage)
    })

}

function createTable(table, result, limitDocPerPage) {
    let htmlRow = result.data.map((key, index) => {
        key.index = index + (result.page - 1) * limitDocPerPage;
        return createRow(key)
    });
    table.html(htmlRow.join(''))
}

function createRow(result) {
    let data = {
        _id: result._id,
        stopType: result.stopType,
        name: result.name,
        address: result.address,
    }

    if(Session.get(_SESSION.isSuperadmin)) {
        data.schoolID = result.schoolID,
        data.schoolName = result.school.name
    }

    return ` <tr id = ${data._id}>
                <th scope="row">${result.index + 1}</th>
                <td>${data.stopType}</td>
                <td>${data.name}</td>
                <td>${data.address}</td>
                ${Session.get(_SESSION.isSuperadmin) ? `<td>${data.schoolName}</td>` : ''}
                <td>
                    <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(
                        data
                    )}\'>Sửa</button>
                    <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(
                        data
                    )}\'>Xóa</button>
                </td>
            </tr>`;
}

function getLatLng(string) {
    let LatLng = string.split(" ");
    LatLng[0] = parseFloat(LatLng[0]);
    LatLng[1] = parseFloat(LatLng[1]);
    return LatLng;
}


function carStopListFilter() {
    let options = [{
        text: "stopType",
        value: $('#carStop-type-filter').val()
    }, {
        text: "name",
        value: $('#carStop-name-filter').val()
    }, {
        text: "address",
        value: $('#carStop-address-filter').val()
    }, {
        text: "schoolID",
        value: $('#school-filter').val()
    }]
    console.log(options);
    reloadTable(1, getLimitDocPerPage(), options)
}

function refreshFilter() {
    $('#carStop-type-filter').val('')
    $('#carStop-name-filter').val('')
    $('#carStop-address-filter').val('')
    $('#school-filter').val('')
    reloadTable(1, getLimitDocPerPage(), null)
}

function setMapHeight() {
    setInterval(() => {
        //console.log(1), 1000
    })
    if ($(window).width() < 1024) {
        $("#micromap").css({
            //"height": windowHeight - topBarHeight - sHeaderHeight - footerHeight
            "height": $(".anchorHeight").height()
        })
    } else {

        $("#micromap").css({
            //"height": windowHeight - topBarHeight - sHeaderHeight - footerHeight
            "height": 474.5
        })
    }
}

function initSchoolSelect2() {
    MeteorCall(_METHODS.school.GetAll, null, accessToken).then(result => {
        Session.set('schools', result.data)
        $('#school-input').select2({
            width: '100%',
            placeholder: "Chọn trường"
        })
        $('#school-filter').select2({
            width: '100%',
            placeholder: "Chọn trường"
        })
    }).catch(handleError)
}