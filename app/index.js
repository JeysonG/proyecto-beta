let fs = require('fs');

let routeCsv = './csvfiles/';
let mainPath = routeCsv + 'contacts.csv';

let rosStone = require('./rosetta/main')(mainPath);

let sizeFiles = 0;

let contact = rosStone.contact();





/*function typeName (dirName) {

    let nameDir = new Promise((res, rej) => {

        fs.readdir((dirName), (err, files) => {

            if(err){
        
                rej(err);
                return;
        
            } else {
                
                sizeFiles = files.length;

                res(files);

            }
        });
    });

    return nameDir;

}

let type = typeName(routeCsv);
type.then(

    (files) => {

        console.log(sizeFiles);

        for(let i = 0; i < sizeFiles; i++){

            rosStone.parseData(routeCsv, files[i]);

        }

    },
    (err) => {

        console.log('Error en el directorio', err);

    }
)*/