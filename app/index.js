let filesPath = './csvfiles/';
let mainPath = filesPath + 'contacts.csv';

let rosStone = require('./rosetta/main')(mainPath, filesPath);

let contact = rosStone.contact();

let files = rosStone.files();