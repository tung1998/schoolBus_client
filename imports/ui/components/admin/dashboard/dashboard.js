import './dashboard.html'

const Cookies = require("js-cookie");

import {
  MeteorCall,
  handleError,
  handleSuccess,
  handleConfirm,
  MeteorCallNoEfect,
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
  Session.set('users', {})
})

Template.dashboard.onRendered(() => {
  $('#school-dashboard').select2({
    width: '85%',
    placeholder: 'Chọn trường'
  })

  getNumberUser()
})


Template.dashboard.helpers({
  numberUser() {
    return Session.get('users').numberUser
  },
  dataUser() {
    return Session.get('users').data
  },
  dataTrip() {
    return
  }
})

function formatData(icon, text, number, color) {
  return {
    icon: icon,
    text: text,
    number: number,
    color: color
  }
}

function getNumberUser(options = null) {
  MeteorCall(_METHODS.user.GetAll, {
    options
  }, accessToken).then(result => {
    let nStudent = result.data.filter(item => item.userType === 1).length
    let nDriver = result.data.filter(item => item.userType === 4).length
    let nNanny = result.data.filter(item => item.userType === 2).length
    let nParent = result.data.filter(item => item.userType === 3).length
    let nTeacher = result.data.filter(item => item.userType === 5).length

    let dataUser = {
      numberUser: nStudent + nDriver + nNanny + nParent + nTeacher,
      data: [
        formatData("fa-street-view", "Tài xế", nDriver, "rgb(77, 212, 50)"),
        formatData("fa-street-view", "Bảo mẫu", nNanny, "rgb(0, 202, 158)"),
        formatData("fa-street-view", "Giáo viên", nTeacher, "rgb(75, 24, 216)"),
        formatData("fa-street-view", "Phụ huynh", nParent, "rgb(170, 20, 90)"),
        formatData("fa-street-view", "Học sinh", nStudent, "rgb(131, 68, 98)"),
      ]
    }

    Session.set('users', dataUser)

    initChart(
      $('#userChart'),
      {
        data: dataUser.data.map(value => {return value.number}),
        backgroundColor: dataUser.data.map(value => {return value.color}),
        label: dataUser.data.map(value => {return value.text})
    })
    
  })


}



function initChart(ctx, dataConfig) {
  if (!ctx) {
    return;
  }
  let chart = new Chart(ctx, config(dataConfig));
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

function getAllTrip() {
  MeteorCall(_METHODS.trip.GetAll, null, accessToken).then(result => {

  })
}