let fs = require('fs');

module.exports = (filesPath) => {

    const task = {

        files: () => {

            let sizeFiles = 0;

            let firstPromise = new Promise((res, rej) => {

                fs.readdir((filesPath), (err, files) => {
        
                    if(err){
                
                        rej(err);
                
                    } else {
        
                        res(files);
        
                    }
                });
            });

            firstPromise.then((res) => {

                let filesTask = require('./files')(filesPath, res);

                filesTask.readCsv();
        
            }, (err) => {
                console.log(err);
            }).catch((e) => {

                console.log(e);

            });
        }
    }

    return task;

}