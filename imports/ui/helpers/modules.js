// Helper function for client
export{
    getModules
}
function getModules(accessToken='') {
    return new Promise((resolve, reject) => {
        Meteor.call('modules.get', accessToken, (err, result) => {
            resolve(result);
        });
    });
}