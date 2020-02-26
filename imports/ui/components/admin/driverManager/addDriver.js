import './driverManager.html'

Template.editDriverModal.events({
    'change #driver-image': editChooseFileName,
})

function editChooseFileName() {
    var filename = $("#driver-image").val();
    $(".custom-file-label").html(filename.replace("C:\\fakepath\\", ""));
}
