let filesPath = './csvfiles/';
let mainPath = filesPath + 'contacts.csv';

let rosStone = require('./rosetta/main')(/*mainPath,*/filesPath);

//rosStone.contact();

rosStone.files();               