// Methods related to links

import {
    Meteor
} from 'meteor/meteor';
import {
    Mongo
} from 'meteor/mongo';



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
    });
}


/**
 * Update Task.
 * @param {Object} db
 * @param {string} name
 * @param {(string|Array<string>)} taskID
 * @returns {Object}
 */

function updateTask(name, taskID) {
    let time = Date.now()
    // let bulk = COLLECTION_TASK

    if (!Array.isArray(taskID)) {
        // add
        COLLECTION_TASK
            .update({
                name
            }, {
                $push: {
                    tasks: {
                        taskID,
                        time
                    }
                },
                $setOnInsert: {
                    createdTime: time
                },
                $set: {
                    updatedTime: time
                },
            }, (error, upResult) => {
                // remove
                COLLECTION_TASK
                    .update({
                        name
                    }, {
                        $pull: {
                            tasks: {
                                $or: [{
                                        time: {
                                            $lt: time - 60000
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
            });

    } else {
        // add
        COLLECTION_TASK
            .update({
                name
            }, {
                $push: {
                    tasks: {
                        $each: taskID.map(cur => ({
                            taskID: cur,
                            time
                        }))
                    }
                },
                $setOnInsert: {
                    createdTime: time
                },
                $set: {
                    updatedTime: time
                },
            }, (error, upResult) => {
                // remove
                COLLECTION_TASK
                    .update({
                        name
                    }, {
                        $pull: {
                            tasks: {
                                $or: [{
                                        time: {
                                            $lt: time - 60000
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
            });


    }
}