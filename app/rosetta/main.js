let fs = require('fs');

module.exports = (mainPath, filesPath) => {

    const task = {

        contact: () => {

            let contactTask = require('./contact')(mainPath);

            let readCsv = contactTask.readCsv();

        },

        files: () => {

            let sizeFiles = 0;

            let firstPromise = new Promise((res, rej) => {

                fs.readdir((filesPath), (err, files) => {
        
                    if(err){
                
                        rej(err);
                
                    } else {
                        
                        sizeFiles = files.length;
        
                        res(files);
        
                    }
                });
            });

            firstPromise.then((res) => {

                for(let i = 0; i < sizeFiles; i++){

                    let filesTask = require('./files')(filesPath, res[i]);

                    filesTask.readCsv();
        
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