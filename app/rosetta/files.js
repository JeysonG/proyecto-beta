let fs = require('fs');
let csv = require('fast-csv');
let mysql = require('mysql');
let moment = require('moment');
let pool = require('../dbConfig/credentials');

let subIFile = 0;

module.exports = (filesPath, arrayFile) => {

    let task = {

        readCsv: () => {

            let counter = 0;
        
            let csvStream = csv.fromPath(filesPath + arrayFile[subIFile], {
        
                delimiter: ",",
        
            })
            .on('data', (record) => {
        
                csvStream.pause();
        
                if(counter > 0){    
        
                    let arrayValue = [];
                    for(let i = 0; i < record.length; i++){

                        arrayValue[i] = record[i];

                    }

                    if(subIFile == 0){

                        //VERIFICAR ROSETTA
                        let firstPromise = new Promise((res, rej) => {

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

                        firstPromise.then((res) => {

                            if(res.length == 0){

                                //CREATE ROSETTA
                                task.initRosetta(arrayValue[0]);

                            }

                        }, (err) => {
                            console.log(err);
                        }).catch((e) => {

                            console.log(e);

                        });

                    } else {

                        /*let inflowTask = (arrayFile[subIFile-1].split('.'))[0];

                        let inFlow = require('./inFlow')(arrayValue);

                        let run = "inFlow." + inflowTask + "();";

                        eval(run);*/

                    }
                }
        
                ++counter;
        
                csvStream.resume();
        
            }).on('end', () => {
        
                console.log('Csv readed');

                if(arrayFile.length == (subIFile)){

                    console.log('Readed all csv files');

                }
                else {

                    task.readCsv();

                }

                subIFile++;
        
            }).on('error', (err) => {
        
                console.log(err);
                return false;
        
            }); 

        },

        initRosetta: (idBeta) => {

            let secondPromise = new Promise((res,rej) => {

                pool.query("INSERT INTO rosetta(idros, idbeta) VALUES ('', '" + idBeta + "')",  
                (err, result) => {

                    if(err){

                        rej(err);

                    }
                    else {
                        res(result);
                    }
                });
            });
        
            secondPromise.then((res) => {
                
                if(res){

                    //CREATE CONTACT
                    task.createContact(idBeta);

                }
            }, (err) => {
                console.log(err)
            }).catch((e) => {

                console.log(e);

            });
        },

        createContact: (idBeta) => {

            let thirdPromise = new Promise((res, rej) => {

                let sql = "SELECT idros FROM rosetta WHERE idbeta = ?";
                pool.query(sql, [idBeta], (err, result) => {
                    
                    if(err){

                        rej(err);

                    }
                    else{
                        res(JSON.parse(JSON.stringify(result)));
                    }
                });
            });

            thirdPromise.then((res) => {

                let idRos = res[0].idros;

                let addressPromise = new Promise((res, rej) => {

                    pool.query("INSERT INTO address(contact_is) VALUES \
                    ('"+ idRos + "')",  
                    (err, result) => {

                        if(err){

                            rej(err);


                        }
                        else {

                            res('Ready address table');

                        }

                    });
                });

                let cardsPromise = new Promise((res, rej) => {

                    pool.query("INSERT INTO cards(contact_id) VALUES \
                    ('"+ idRos + "')",  
                    (err, result) => {

                        if(err){

                            rej(err);

                        }
                        else {
                            res('Ready cards table');
                        }

                    });
                });

                let contactsPromise = new Promise ((res, rej) => {

                    pool.query("INSERT INTO contacts(id) VALUES \
                    ('"+ idRos + "')",  
                    (err, result) => {

                        if(err){

                            rej(err);

                        }
                        else {
                            res('Ready contacts table');
                        }

                    });
                });

                let phonesPromise = new Promise ((res, rej) => {

                    pool.query("INSERT INTO phones(contact_id) VALUES \
                    ('"+ idRos + "')",  
                    (err, result) => {

                        if(err){

                            rej(err);

                        }
                        else {
                            res('Ready phones table');
                        }

                    });
                });

                Promise.all([addressPromise, cardsPromise, contactsPromise, phonesPromise]).then((values) => {

                    console.log(values);

                }, reason => {

                    console.log(reason);

                })

            }, (err) => {
                console.log(err);
            }).catch((e) => {
                
                console.log(e);

            });
        }
    }

    return task;
    
}