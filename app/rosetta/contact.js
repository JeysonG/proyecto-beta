let fs = require('fs');
let csv = require('fast-csv');
let mysql = require('mysql');
let moment = require('moment');
let pool = require('../dbConfig/credentials');
let timeCreate = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

module.exports = (mainPath) => {

    const task = {

        readCsv: () => {

            let counter = 0;
            let arrayValue = [];
        
            let csvStream = csv.fromPath(mainPath, {
        
                delimiter: ",",
        
            })
            .on('data', (record) => {
        
                csvStream.pause();
        
                if(counter > 0 && counter <= 10){    
        
                    let idBeta = record[0];
                    let firstName = record[1];
                    let lastName = record[2];
                    let companyName = record[3];
                    let web = record[4];

                    //VERIFICAR ROSETTA
                    let firstPromise = new Promise((res, rej) => {

                        let sql = "SELECT idros FROM rosetta WHERE idbeta = ?";
                        pool.query(sql, [idBeta], (error, result) => {
                    
                            if(error){
        
                                rej(error);
        
                            }
                            else{
                                res(JSON.parse(JSON.stringify(result)));
                            }
                        });

                    });

                    firstPromise.then((res) => {

                        if(res.length > 0){

                            //UPDATE CONTACTS
                            task.updateContact(res[0].idros, firstName, lastName, companyName, web);

                        }
                        else {

                            //CREATE ROSETTA
                            task.initRosetta(idBeta, firstName, lastName, companyName, web);

                        }
                    }, (err) => {
                        console.log(err);
                    }).catch((e) => {

                        console.log(e);

                    });
                }
        
                ++counter;
        
                csvStream.resume();
        
            }).on('end', () => {
        
                console.log('Csv readed');
                return true;
        
            }).on('error', (err) => {
        
                console.log(err);
                return false;
        
            }); 

            
        },

        initRosetta: (idBeta, firstName, lastName, companyName, web) => {

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
                    console.log('hey');
                    task.createContact(idBeta, firstName, lastName, companyName, web);

                }
            }, (err) => {
                console.log(err)
            }).catch((e) => {

                console.log(e);

            });

            /*pool.query("INSERT INTO rosetta(idros, idbeta) VALUES ('', '" + idBeta + "')",  
            (err, result) => {

                if(err){

                    console.log('contacts rosetta');
                    return false;

                }
            });*/

        },

        updateContact: (id, firstName, lastName, companyName, web) => {

            pool.query("UPDATE  contacts SET first_name = '" + firstName + "', last_name = '" + lastName + 
            "', company = '" + companyName + "', web = '" + web + "', updated_at = '" + timeCreate + "' WHERE id = " + id,  
            (err) => {

                if(err){

                    console.log(err);

                }
                else {
                    console.log('Ready update contacts table');
                }
            });
        },

        createContact: (idBeta, firstName, lastName, companyName, web) => {

            let thirdPromise = new Promise((res, rej) => {

                let sql = "SELECT * FROM rosetta WHERE idbeta = ?";
                pool.query(sql, [idBeta], (err, result) => {
                    //console.log('hey');
                    if(err){

                        rej(err);

                    }
                    else{
                        res(JSON.parse(JSON.stringify(result)));
                    }
                });
            });

            thirdPromise.then((res) => {

                console.log(res[0].idros);
            
                pool.query("INSERT INTO contacts(id, first_name, last_name, company, web, created_at) VALUES \
                ('"+ res[0].idros + "', '" + firstName + "', '" + lastName + "', '" + companyName + "', '" + web + "', '" + timeCreate + "')",  
                (err, result) => {

                    if(err){

                        console.log(err);

                    }
                    else {
                        console.log('Ready contacts table');
                    }

                });
            }, (err) => {
                console.log(err);
            }).catch((e) => {
                
                console.log(e);

            });
        }
    }

    return task;

}