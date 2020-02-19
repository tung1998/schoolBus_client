import {
    Meteor
} from "meteor/meteor"


export {
    updateTask
}
/**
 * 
 * @param {string} name Tên collection trong db
 * @param {string} taskID ID của document thay đổi trong db
 * @param {string} date (option) Chỉ có trong Trip, CustomerTrip: ngày của chuyến đi để làm giảm số lần call lên server để check thay đổi
 */
function updateTask(name, taskID, date) {
    Meteor.call('task.update', name, taskID, date)
}