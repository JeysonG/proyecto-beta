let csv = require('fast-csv');
let mysql = require('mysql');
let moment = require('moment');
let pool = require('../dbConfig/credentials');
let timeCreate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

let line = 0;

module.exports = (filesPath, csv) => {

    task = {

        address: () => {

            console.log('Here');

            console.log(csv);
        },

        ccard: () => {

            console.log(csv);

    
        },

        contacts: () => {

            console.log(csv);
        },

        emails: () => {

            console.log(csv);
        },

        phone: () => {

            console.log(csv);
        },

        state: (contact_id, shortName) => {

            
        }
    }

    return task;

}