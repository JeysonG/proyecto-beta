let csv = require('fast-csv');
let mysql = require('mysql');
let pool = require('../dbConfig/credentials');

let line = 0;
let insert = 0;

module.exports = (filesPath, arrayFile) => {

    let task = {

        readCsv: () => {

            //let counter = 0;
        
            let csvStream = csv.fromPath(filesPath + arrayFile[0], {
        
                delimiter: ",",
                headers: true
        
            })
            .on('data', (record) => {
    
                csvStream.pause();
        
                //if(counter > 0){   
                    
                    line++;
        
                    //VERIFICAR ROSETTA
                    let firstPromise = new Promise((res, rej) => {

                        let sql = "SELECT idros FROM rosetta WHERE idbeta = ?";
                        pool.query(sql, [record.contact_id], (error, result) => {
                    
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
                            task.initRosetta(record.contact_id);

                        }
                    }, (err) => {

                        console.log(err);

                    }).catch((e) => {

                        console.log(e);

                    });
               // }
        
                //++counter;
        
                csvStream.resume();
        
            }).on('end', () => {

                console.log('Csv readed');
        
            }).on('error', (err) => {
        
                console.log(err);
        
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

                    insert++;

                    if(line == insert){

                        task.octopus();

                    }

                }
            }, (err) => {

                console.log(err);

            }).catch((e) => {

                console.log(e);

            });
        },

        octopus: () => {

            console.log('Octopus');

            for(let i = 0; i < arrayFile.length; i++){

                let inflowTask = (arrayFile[i].split('.'))[0];

                let inFlow = require('./inFlow')(filesPath, arrayFile[i]);

                let run = 'inFlow.' + inflowTask + '();';

                eval(run);

            }
        }
    }

    return task;
    
}