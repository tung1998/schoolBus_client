import './carStopList.html';
const Cookies = require("js-cookie");
import { MeteorCall, handleError } from "../../../../functions";
import { _METHODS } from "../../../../variableConst";
let accessToken;

Template.carStopList.onCreated(() => {
    accessToken = Cookies.get("accessToken");
});

Template.carStopList.onRendered(() => {
    reloadTable();
});

Template.micromap.onRendered(() => {
    setMapHeight()
    L.Icon.Default.imagePath = '/packages/bevanhunt_leaflet/images/';
    let micromap = L.map('micromap', { drawControl: true }).setView([21.0388, 105.7886], 19);
    L.tileLayer('https://apis.wemap.asia/raster-tiles/styles/osm-bright/{z}/{x}/{y}@2x.png?key=vpstPRxkBBTLaZkOaCfAHlqXtCR', {
        maxZoom: 18,
        id: 'mapbox.streets'
    }).addTo(micromap);

    let marker = L.marker([21.03709858, 105.78349972]).addTo(micromap);
    micromap.on('move', function() {
        marker.setLatLng(micromap.getCenter());
    });

    //Dragend event of map for update marker position
    micromap.on('dragend', function(e) {
        let cnt = micromap.getCenter();
        let position = marker.getLatLng();
        lat = Number(position['lat']).toFixed(5);
        lng = Number(position['lng']).toFixed(5);
        $('.position').val(lat + ' ' + lng);
    });
})

Template.carStopList.events({
    "submit form": SubmitForm,
    "click .modify-button": ClickModifyButton,
    "click .delete-button": ClickDeleteButton
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
    let data = $(event.currentTarget).data("json");
    MeteorCall(_METHODS.carStop.Delete, data, accessToken)
        .then(result => {
            // console.log(result);
            // renderTableRow();
            deleteRow(data);
        })
        .catch(handleError);
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
    MeteorCall(_METHODS.carStop.Update, carStopUpdate, accessToken)
        .then(result => {
            console.log(result);
            // renderTableRow();
            $("#editCarStopModal").modal("hide");
            modifyTable(carStopUpdate);
        })
        .catch(handleError);
}

function deleteRow(data) {
    $(`#${data._id}`).remove();
}

function ClickDeleteButton(event) {
    let data = $(event.currentTarget).data("json");
    MeteorCall(_METHODS.carStop.Delete, data, accessToken)
        .then(result => {
            // console.log(result);
            // renderTableRow();
            deleteRow(data);
        })
        .catch(handleError);
}

function modifyTable(data) {
    $(`#${data._id}`).html(`    <th scope="row"></th>
                                <td>${data.stopType}</td>
                                <td>${data.name}</td>
                                <td>${data.address}</td>
                                <td>
                                    <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(
                                        data
                                    )}\'>Sửa</button>
                                    <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(
                                        data
                                    )}\'>Xóa</button>
                                </td>`)
}

function reloadTable() {
    MeteorCall(_METHODS.carStop.GetAll, accessToken)
        .then(result => {
            //console.log(result)
            let htmlTable = result.data.map(htmlRow);
            $("#table-body").html(htmlTable.join(" "));
        })
        .catch(handleError);
}

function htmlRow(data) {
    let item = {
        _id: data._id,
        stopType: data.stopType,
        name: data.name,
        address: data.address,
    }
    console.log(item._id)
    return ` <tr id = ${item._id}>
                  <th scope="row"></th>
                  <td>${item.stopType}</td>
                  <td>${item.name}</td>
                  <td>${item.address}</td>
                  <td>
                      <button type="button" class="btn btn-outline-brand modify-button" data-json=\'${JSON.stringify(
                          item
                      )}\'>Sửa</button>
                      <button type="button" class="btn btn-outline-danger delete-button" data-json=\'${JSON.stringify(
                          item
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