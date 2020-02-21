import './classManager.html';
const Cookies = require('js-cookie');

import {
    MeteorCall,
    handleError
} from '../../functions'

import {
    _METHODS
} from '../../variableConst'

let accessToken;
let data;

Template.classManager.onCreated(() => {
    accessToken = Cookies.get('accessToken');
})

Template.editClassModal.onRendered(() => {
    editTitleForm();
    // let
    MeteorCall(_METHODS.class.GetAll, {}, accessToken).then(result => {
        data = result;
        console.log(data);
    }).catch(handleError);




});

Template.editClassModal.events((e) => {

});


editTitleForm = () => {
    let ktContent = $('.kt-section').find('.kt-section__content');
    ktContent.find('#add-class').click(() => {
        $('.modal-header').find('.modal-title').html("Thêm Mới lớp học");
        $('.modal-footer').find('.btn.btn-primary').html("Thêm mới");
        $('.modal-footer').find('.btn.btn-primary').addClass("btn-submit-add-form");
    });

    ktContent.find('#edit-class').click(() => {
        $('.modal-header').find('.modal-title').html("Sửalớp học");
        $('.modal-footer').find('.btn.btn-primary').html("Sửa");
        $('.modal-footer').find('.btn.btn-primary').addClass("btn-submit-edit-form");
    });
}