module.exports = (mainPath) => {

    const task = {

        contact: () => {

            let contactTask = require('./contact')(mainPath);

            let readCsv = contactTask.readCsv();

        },

    }

    return task;

}