let csv = require('fast-csv');
let mysql = require('mysql');
let moment = require('moment');
let pool = require('../dbConfig/credentials');
let timeCreate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

let line = 0;
let insert = 0;

module.exports = (filesPath, fileCsv) => {

    task = {

        octopus: (idBeta) => {

            return new Promise((res, rej) => {

                let sql = "SELECT idros FROM rosetta WHERE idbeta = ?";
                pool.query(sql, [idBeta], (error, result) => {

                    if(error){

                        rej(error);

                    }
                    else{

                        res(JSON.parse(JSON.stringify(result[0].idros)));
                        
                    }
                });
            });
        },

        address: () => {
        
            let csvStream = csv.fromPath(filesPath + fileCsv, {
        
                delimiter: ",",
                headers: true
        
            })
            .on('data', (record) => {
    
                csvStream.pause();

                line++;

                task.octopus(record.contact_id)
                .then((idRos) => {
       
                    let secondPromise = new Promise((res, rej) => {

                        //INSERT STATE ADDRESS
                        let sql = "INSERT INTO  address (contact_is, address, city, country, zip, created_at) VALUES \
                            ('"+ idRos + "', '" + record.address + "', '" + record.city + "', '" + record.county + "', '" + record.zip + "', '" + timeCreate + "')";
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
                        task.state(idRos, record.state);

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
        
                csvStream.resume();
        
            }).on('end', () => {

                console.log('Csv address readed');

            }).on('error', (err) => {
        
                console.log(err);
        
            }); 
        },

        ccard: () => {
        
            let csvStream = csv.fromPath(filesPath + fileCsv, {
        
                delimiter: ",",
                headers: true
        
            })
            .on('data', (record) => {
    
                csvStream.pause();

                line++;
                
                //CONSULTAR ROSETTA
                task.octopus(record.contact_id)
                .then((idRos) => {

                    //INSERT CARDS
                    let sql = "INSERT INTO  cards (contact_id, card, pin, cvv, created_at) VALUES \
                    ('"+ idRos + "', '" + record.card_number + "', '" + record.pin + "', '" + record.CVV + "', '" + timeCreate + "')";
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
        
                csvStream.resume();
        
            }).on('end', () => {

                console.log('Csv cards readed');

            }).on('error', (err) => {
        
                console.log(err);
        
            }); 
        },

        contacts: () => {
        
            let csvStream = csv.fromPath(filesPath + fileCsv, {
        
                delimiter: ",",
                headers: true
        
            })
            .on('data', (record) => {
    
                csvStream.pause();
    
                line++;

                //CONSULTAR ROSETTA
                task.octopus(record.id)
                .then((idRos) => {

                    //UPDATE CONTACTS
                    pool.query("UPDATE  contacts SET first_name = '" + record.first_name + "', last_name = '" + record.last_name + 
                    "', company = '" + record.company_name + "', web = '" + record.web +"', updated_at = '" + timeCreate + "' WHERE id = " + idRos,  
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
        
                csvStream.resume();
        
            }).on('end', () => {

                console.log('Csv contacts readed');

            }).on('error', (err) => {
        
                console.log(err);
        
            }); 
        },

        emails: () => {
        
            let csvStream = csv.fromPath(filesPath + fileCsv, {
        
                delimiter: ",",
                headers: true
        
            })
            .on('data', (record) => {
    
                csvStream.pause();

                line++;

                //CONSULTAR ROSETTA
                task.octopus(record.contact_id)
                .then((idRos) => {

                    //UPDATE CONTACTS
                    pool.query("UPDATE  contacts SET email = '" + record.email + "' WHERE id = " + idRos,  
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
        
                csvStream.resume();
        
            }).on('end', () => {

                console.log('Csv emails readed');

            }).on('error', (err) => {
        
                console.log(err);
        
            }); 
        },

        phone: () => {
        
            let csvStream = csv.fromPath(filesPath + fileCsv, {
        
                delimiter: ",",
                headers: true
        
            })
            .on('data', (record) => {
    
                csvStream.pause();
        
                line++;

                //CONSULTAR ROSETTA
                task.octopus(record.contact_id)
                .then((idRos) => {

                    let arrayPhone = (record.phone.split('-'));

                    let numberPhone = (arrayPhone[0] + arrayPhone[2] + arrayPhone[4]); 

                    //INSERT CONTACTS
                    let sql = "INSERT INTO  phones (contact_id, number, type, created_at) VALUES \
                    ('"+ idRos + "', '" + numberPhone + "', '" + record.type + "', '" + timeCreate + "')";
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