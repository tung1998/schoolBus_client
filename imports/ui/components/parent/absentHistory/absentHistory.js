import './absentHistory.html';
Template.absentHistory.rendered = () => {
    setFormHeight()
}

function setFormHeight() {
    let windowHeight = $(window).height();
    let formHeight = $("#absentHistory").height();
    let footerHeight = $("#kt_footer").height();
    let topBarHeight = $("#kt_header").height();

    if ($(window).width() < 1024) {
        topBarHeight = $("#kt_header_mobile").height();
        $("#absentHistory").css({
            "height": windowHeight - topBarHeight - 2 * footerHeight + 17
        })
        $('#kt_content').css({
            "padding-top": 0,
            "padding-bottom": 0
        })
    } else {
        $("#parentFeedback").css({
            "height": windowHeight - topBarHeight - 2 * footerHeight - 17
        })
        $("#absentHistory").css({
                "height": windowHeight - topBarHeight - 2 * footerHeight - 17
            })
            //$("#kt_wrapper").css({
            //  "padding-top": 60
            //  })
        $('#kt_content').css({
            "padding-top": 0,
            "padding-bottom": 0
        })
    }
    console.log(windowHeight)
    console.log(formHeight)
    console.log(footerHeight)
    console.log(topBarHeight)
}