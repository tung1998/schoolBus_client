import './dashboard.html'

const Cookies = require("js-cookie");

import {
  MeteorCall,
  handleError,
  handleSuccess,
  handleConfirm,
} from "../../../../functions";

import {
  _METHODS,
  LIMIT_DOCUMENT_PAGE,
  _SESSION,
  _URL_images,
} from "../../../../variableConst";

let accessToken;

Template.dashboard.onCreated(() => {
  accessToken = Cookies.get("accessToken");
  Session.set('schools', [])
  Session.set('numberUser', {})
  Session.set('numberDriver', {})
  Session.set('numberNanny', {})
  Session.set('numberTeacher', {})
  Session.set('numberParent', {})
  Session.set('numberStudent', {})
})

Template.dashboard.onRendered(() => {
  initChart()
  $('#school-dashboard').select2({
    width: '85%',
    placeholder: 'Chọn trường'
  })
})

function getNumberUser(options = null) {
  MeteorCall(_METHODS.driver.GetAll, {
    options
  }, accessToken).then(result => {
    let data = {
      icon: "fa-street-view",
      text: "Lái xe",
      number: result.count,
      color: "rgb(175, 41, 41)"
    }
    Session.set('numberDriver', data)
  })


}

function initChart() {
  let ctx1 = $('#userChart')
  let ctx2 = $('#schoolChart')
  if (!ctx1 && !ctx2) {
    return;
  }
  let dataConfig1 = {
    data: [
      2, 2, 2, 4, 30
    ],
    backgroundColor: [
      'rgb(77, 212, 50)',
      'rgb(0, 202, 158)',
      'rgb(75, 24, 216)',
      'rgb(170, 20, 90)',
      'rgb(131, 68, 98)'
    ],
    label: [
      'Tài xế',
      'Bảo Mẫu',
      'Giáo viên',
      'Phụ huynh',
      'Học sinh'
    ]
  }
  let dataConfig2 = {
    data: [2, 2, 2],
    backgroundColor: [
      'rgb(77, 212, 50)',
      'rgb(0, 202, 158)',
      'rgb(75, 24, 216)'
    ],
    label: [
      'Trường học',
      'Lớp học',
      'Số lượng xe'
    ]
  }
  let chart1 = new Chart(ctx1, config(dataConfig1));
  let chart2 = new Chart(ctx2, config(dataConfig2));
}

function config(dataConfig) {
  return {
    type: 'doughnut',
    data: {
      datasets: [{
        data: dataConfig.data,
        backgroundColor: dataConfig.backgroundColor
      }],
      labels: dataConfig.label
    },
    options: {
      cutoutPercentage: 75,
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false,
        position: 'right',
      },
      title: {
        display: false,
        text: 'Technology'
      },
      animation: {
        animateScale: true,
        animateRotate: true
      },
      tooltips: {
        enabled: true,
        intersect: false,
        mode: 'nearest',
        bodySpacing: 5,
        yPadding: 10,
        xPadding: 10,
        caretPadding: 0,
        displayColors: false,
        backgroundColor: 'rgb(218, 101, 6)',
        titleFontColor: '#ffffff',
        cornerRadius: 4,
        footerSpacing: 0,
        titleSpacing: 0
      }
    }
  }
}