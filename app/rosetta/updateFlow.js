//UPDATE CONTACTS
pool.query("UPDATE  contacts SET first_name = '" + record[1] + "', last_name = '" + record[2] + 
"', company = '" + record[3] + "', web = '" + record[4] +"', updated_at = '" + timeCreate + "' WHERE id = " + idRos,  
(err) => {

    if(err){

        console.log(err);

    }
});