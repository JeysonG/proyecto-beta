module.exports = (filesPath, file) => {

    let task = {

        readCsv: () => {

            console.log(filesPath + file);

        }
    }

    return task;
    
}