// Methods related to links

import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';
import {
    TIME_DEFAULT
} from '../../ui/components/variableConst';



// render data truc tiep tu mongodb

export const COLLECTION_TASK = new Mongo.Collection('Task', {
    idGeneration: 'MONGO'
});

export {
    updateTask
}

if (Meteor.isServer) {
    Meteor.publish({
        'task.byName': publishTaskByName
    })
    Meteor.methods({
        'task.update': updateTask
    })
}

function publishTaskByName(name) {
    return COLLECTION_TASK.find({
        name
    }
    // , {
    //     disableOplog: true,
    //     // pollingThrottleMs: 3000, 
    //     // pollingIntervalMs: 1000
    // }
    );
}


/**
 * Update Task.
 * @param {Object} db
 * @param {string} name
 * @param {(string|Array<string>)} taskID
 * @returns {Object}
 */

function updateTask(name, taskID, date_trip) {
    let time = Date.now()
    // let bulk = COLLECTION_TASK
    if (!Array.isArray(taskID)) {
        // add
        let fieldUpdate = {
            taskID,
            time
        }
        if(date_trip && name == 'Trip') fieldUpdate.date = date_trip;
        COLLECTION_TASK
            .upsert({
                name
            }, {
                $push: {
                    tasks: fieldUpdate,
                },
                $setOnInsert: {
                    createdTime: time
                },
                $set: {
                    updatedTime: time
                },
            })

        // remove
        COLLECTION_TASK
            .update({
                name
            }, {
                $pull: {
                    tasks: {
                        $or: [{
                                time: {
                                    $lt: time - TIME_DEFAULT.check_task
                                }
                            },
                            {
                                time: {
                                    $lt: time
                                },
                                taskID
                            },
                        ],
                    },
                },
            })
    } else {
        // add
        let fieldUpdate = taskID.map((cur, index) => {

            if(date_trip && name == 'Trip') return {
                taskID: cur,
                date: date_trip[index],
                time
            }
            return {
                taskID: cur,
                time
            }
        })

        COLLECTION_TASK
            .upsert({
                name
            }, {
                $push: {
                    tasks: {
                        $each: fieldUpdate
                    }
                },
                $setOnInsert: {
                    createdTime: time
                },
                $set: {
                    updatedTime: time
                },
            })

        // remove
        COLLECTION_TASK
            .update({
                name
            }, {
                $pull: {
                    tasks: {
                        $or: [{
                                time: {
                                    $lt: time - TIME_DEFAULT.check_task
                                }
                            },
                            {
                                time: {
                                    $lt: time
                                },
                                taskID: {
                                    $in: taskID
                                }
                            },
                        ],
                    },
                },
            })
    }
}