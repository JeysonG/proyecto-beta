let csv = require('fast-csv');
let mysql = require('mysql');
let moment = require('moment');
let pool = require('../dbConfig/credentials');
let timeCreate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

let line = 0;
let insert = 0;

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

                    line++;

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

                        let secondPromise = new Promise((res, rej) => {

                            //INSERT STATE ADDRESS
                            let sql = "INSERT INTO  address (contact_is, address, city, country, zip, created_at) VALUES \
                                ('"+ idRos + "', '" + record[1] + "', '" + record[2] + "', '" + record[3] + "', '" + record[5] + "', '" + timeCreate + "')";
                            pool.query(sql, (err) => {

                                if(err){

                                    rej(err);

                                }
                                else {

                                    res(idRos);
                                }
                            });

                            
                        });

                        secondPromise.then((idRos) => {

                            //STATES
                            task.state(idRos, record[4]);

                            insert++;

                            if(line == insert){

                                console.log('Upload Database');

                            }

                        }, (err) => {

                            console.log(err);

                        }).catch((e) => {

                            console.log(e);

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

                    line++;
                    
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

                        //INSERT CARDS
                        let sql = "INSERT INTO  cards (contact_id, card, pin, cvv, created_at) VALUES \
                        ('"+ idRos + "', '" + record[1] + "', '" + record[2] + "', '" + record[3] + "', '" + timeCreate + "')";
                        pool.query(sql, (err) => {

                            if(err){

                                console.log(err);

                            }
                            else {

                                insert++;

                                if(line == insert){

                                    console.log('Upload Database');

                                }
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

                    line++;

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
                            else {

                                insert++;

                                if(line == insert){

                                    console.log('Upload Database');

                                }
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

                    line++;

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
                            else {

                                insert++;

                                if(line == insert){

                                    console.log('Upload Database');

                                }

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

                    line++;

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

                        //INSERT CONTACTS
                        let sql = "INSERT INTO  phones (contact_id, number, type, created_at) VALUES \
                        ('"+ idRos + "', '" + numberPhone + "', '" + record[1] + "', '" + timeCreate + "')";
                        pool.query(sql, (err) => {

                        if(err){

                            console.log(err);

                        }
                        else {

                            insert++;

                            if(line == insert){

                                console.log('Upload Database');

                            }
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