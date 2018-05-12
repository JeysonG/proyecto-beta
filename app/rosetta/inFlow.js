let csv = require('fast-csv');
let mysql = require('mysql');
let moment = require('moment');
let pool = require('../dbConfig/credentials');
let timeCreate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

module.exports = (filesPath, fileCsv) => {

    task = {

        address: () => {

            let counter = 0;
        
            let csvStream = csv.fromPath(filesPath + fileCsv, {
        
                delimiter: ",",
        
            })
            .on('data', (record) => {
    
                csvStream.pause();
        
                if(counter > 0){   

                    //CONSULTAR ROSETTA
                    let firstPromise = new Promise((res, rej) => {

                        let sql = "SELECT idros FROM rosetta WHERE idbeta = ?";
                        pool.query(sql, [record[0]], (error, result) => {

                            if(error){

                                rej(error);

                            }
                            else{

                                res(JSON.parse(JSON.stringify(result[0].idros)));
                                
                            }
                        });

                    });

                    firstPromise.then((idRos) => {

                        //UPDATE ADDRESS
                        pool.query("UPDATE  address SET address = '" + record[1] + "', city = '" + record[2] + 
                        "', country = '" + record[3] + "', zip = '" + record[5] + "', updated_at = '" + timeCreate + "' WHERE contact_is = " + idRos,  
                        (err) => {

                            if(err){

                                console.log(err);

                            }
                        });

                        //STATES
                        task.state(idRos, record[4]);

                    }, (err) => {

                        console.log(err);

                    }).catch((e) => {

                        console.log(e);

                    });
                }

                ++counter;
        
                csvStream.resume();
        
            }).on('end', () => {

                console.log('Csv address readed');

            }).on('error', (err) => {
        
                console.log(err);
        
            }); 
        },

        ccard: () => {

            let counter = 0;
        
            let csvStream = csv.fromPath(filesPath + fileCsv, {
        
                delimiter: ",",
        
            })
            .on('data', (record) => {
    
                csvStream.pause();
        
                if(counter > 0){   
                    
                    //CONSULTAR ROSETTA
                    let firstPromise = new Promise((res, rej) => {

                    let sql = "SELECT idros FROM rosetta WHERE idbeta = ?";
                    pool.query(sql, [record[0]], (error, result) => {

                        if(error){

                            rej(error);

                        }
                        else{

                            res(JSON.parse(JSON.stringify(result[0].idros)));

                        }
                    });

                    });

                    firstPromise.then((idRos) => {

                        //UPDATE CARDS
                        pool.query("UPDATE  cards SET card = '" + record[1] + "', pin = '" + record[2] + 
                        "', cvv = '" + record[3] + "', updated_at = '" + timeCreate + "' WHERE contact_id = " + idRos,  
                        (err) => {

                            if(err){

                                console.log(err);

                            }
                        });

                    }, (err) => {

                        console.log(err);

                    }).catch((e) => {

                        console.log(e);

                    });
                }    
        
                ++counter;
        
                csvStream.resume();
        
            }).on('end', () => {

                console.log('Csv cards readed');

            }).on('error', (err) => {
        
                console.log(err);
        
            }); 
        },

        contacts: () => {

            let counter = 0;
        
            let csvStream = csv.fromPath(filesPath + fileCsv, {
        
                delimiter: ",",
        
            })
            .on('data', (record) => {
    
                csvStream.pause();
        
                if(counter > 0){   

                    //CONSULTAR ROSETTA
                    let firstPromise = new Promise((res, rej) => {

                    let sql = "SELECT idros FROM rosetta WHERE idbeta = ?";
                    pool.query(sql, [record[0]], (error, result) => {

                        if(error){

                            rej(error);

                        }
                        else{

                            res(JSON.parse(JSON.stringify(result[0].idros)));

                        }
                    });

                    });

                    firstPromise.then((idRos) => {

                        //UPDATE CONTACTS
                        pool.query("UPDATE  contacts SET first_name = '" + record[1] + "', last_name = '" + record[2] + 
                        "', company = '" + record[3] + "', web = '" + record[4] +"', updated_at = '" + timeCreate + "' WHERE id = " + idRos,  
                        (err) => {

                            if(err){

                                console.log(err);

                            }
                        });

                    }, (err) => {

                        console.log(err);

                    }).catch((e) => {

                        console.log(e);

                    });

                }    
        
                ++counter;
        
                csvStream.resume();
        
            }).on('end', () => {

                console.log('Csv contacts readed');

            }).on('error', (err) => {
        
                console.log(err);
        
            }); 
        },

        emails: () => {

            let counter = 0;
        
            let csvStream = csv.fromPath(filesPath + fileCsv, {
        
                delimiter: ",",
        
            })
            .on('data', (record) => {
    
                csvStream.pause();
        
                if(counter > 0){   

                    //CONSULTAR ROSETTA
                    let firstPromise = new Promise((res, rej) => {

                    let sql = "SELECT idros FROM rosetta WHERE idbeta = ?";
                    pool.query(sql, [record[0]], (error, result) => {

                        if(error){

                            rej(error);

                        }
                        else{
                            res(JSON.parse(JSON.stringify(result[0].idros)));
                        }
                    });

                    });

                    firstPromise.then((idRos) => {

                        //UPDATE CONTACTS
                        pool.query("UPDATE  contacts SET email = '" + record[1] + "' WHERE id = " + idRos,  
                        (err) => {

                            if(err){

                                console.log(err);

                            }
                        });

                    }, (err) => {

                        console.log(err);

                    }).catch((e) => {

                        console.log(e);

                    });

                }    
        
                ++counter;
        
                csvStream.resume();
        
            }).on('end', () => {

                console.log('Csv emails readed');

            }).on('error', (err) => {
        
                console.log(err);
        
            }); 
        },

        phone: () => {

            let counter = 0;
        
            let csvStream = csv.fromPath(filesPath + fileCsv, {
        
                delimiter: ",",
        
            })
            .on('data', (record) => {
    
                csvStream.pause();
        
                if(counter > 0){   

                    //CONSULTAR ROSETTA
                    let firstPromise = new Promise((res, rej) => {

                        let sql = "SELECT idros FROM rosetta WHERE idbeta = ?";
                        pool.query(sql, [record[0]], (error, result) => {

                            if(error){

                                rej(error);

                            }
                            else{

                                res(JSON.parse(JSON.stringify(result[0].idros)));

                            }
                        });
                    });

                    firstPromise.then((idRos) => {

                        let arrayPhone = (record[2].split('-'));

                        let numberPhone = (arrayPhone[0] + arrayPhone[2] + arrayPhone[4]); 

                        //UPDATE PHONES
                        pool.query("UPDATE  phones SET number = '" + numberPhone + "', type = '" + record[1] + "' WHERE contact_id = " + idRos,  
                        (err) => {

                            if(err){

                                console.log(err);

                            }
                        });
                    }, (err) => {

                        console.log(err);

                    }).catch((e) => {

                        console.log(e);

                    });
                }    
        
                ++counter;
        
                csvStream.resume();
        
            }).on('end', () => {

                console.log('Csv phones readed');

            }).on('error', (err) => {
        
                console.log(err);
        
            }); 
        },

        state: (contact_id, shortName) => {

            let statePromise = new Promise((res, rej) => {

                //CONSULTAR STATES
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