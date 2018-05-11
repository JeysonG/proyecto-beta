let mysql = require('mysql');
let moment = require('moment');
let pool = require('../dbConfig/credentials');
let timeCreate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

module.exports = (arrayValue) => {

    task = {

        address: () => {

            let addressPromise = new Promise((res, rej) => {

                let sql = "SELECT idros FROM rosetta WHERE idbeta = ?";
                pool.query(sql, [arrayValue[0]], (error, result) => {
            
                    if(error){

                        rej(error);

                    }
                    else{
                        res(JSON.parse(JSON.stringify(result)));
                    }
                });

            });

            addressPromise.then((res) => {

                if(res.length > 0){

                    //UPDATE ADDRESS
                    pool.query("UPDATE  address SET address = '" + arrayValue[1] + "', city = '" + arrayValue[2] + 
                    "', country = '" + arrayValue[3] + "', zip = '" + arrayValue[5] + "', updated_at = '" + timeCreate + "' WHERE contact_is = " + res[0].idros,  
                    (err) => {

                        if(err){

                            console.log(err);

                            return false;

                        }
                        else {
                            console.log('Ready full address table');

                            return true;
                        }
                    });

                    //STATES
                    task.state(res[0].idros, arrayValue[4]);

                }

            }, (err) => {
                console.log(err);
            }).catch((e) => {

                console.log(e);

            });
        },

        ccard: () => {

            let cardPromise = new Promise((res, rej) => {

                let sql = "SELECT idros FROM rosetta WHERE idbeta = ?";
                pool.query(sql, [arrayValue[0]], (error, result) => {
            
                    if(error){

                        rej(error);

                    }
                    else{
                        res(JSON.parse(JSON.stringify(result)));
                    }
                });

            });

            cardPromise.then((res) => {

                if(res.length > 0){

                    //STATES
                    task.state(res[0].idros, arrayValue[4]);

                    //UPDATE ADDRESS
                    pool.query("UPDATE  cards SET card = '" + arrayValue[1] + "', pin = '" + arrayValue[2] + 
                    "', cvv = '" + arrayValue[3] + "', updated_at = '" + timeCreate + "' WHERE contact_id = " + res[0].idros,  
                    (err) => {

                        if(err){

                            console.log(err);

                            return false;

                        }
                        else {
                            console.log('Ready full card table');

                            return true;
                        }
                    });

                }

            }, (err) => {
                console.log(err);
            }).catch((e) => {

                console.log(e);

            });
        },

        contacts: () => {


        },

        emails: () => {


        },

        phone: () => {


        },

        state: (contact_id, shortName) => {

            let statePromise = new Promise((res, rej) => {

                let sql = "SELECT id FROM states WHERE short_name = ?";
                pool.query(sql, [shortName], (error, result) => {
            
                    if(error){

                        rej(error);

                    }
                    else{
                        res(JSON.parse(JSON.stringify(result)));
                    }
                });

            });

            statePromise.then((res) => {

                if(res.length > 0){

                    //UPDATE STATE ADDRESS
                    pool.query("UPDATE  address SET state_id = " + res[0].id + " WHERE contact_is = " + contact_id ,  
                    (err) => {

                        if(err){

                            console.log(err);

                            return false;

                        }
                        else {
                            console.log('Ready address table state');

                            return true;
                        }
                    });

                }
                else {

                    console.log('Unknow state short name');

                }
            }, (err) => {
                console.log(err);
            }).catch((e) => {

                console.log(e);

            });
        }
    }

    return task;

}