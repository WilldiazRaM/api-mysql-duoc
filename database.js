const mysql = require('mysql');

const db = mysql.createConnection( {
    host: "database-prueba-integracion.c7m6qgsi4mfp.us-east-2.rds.amazonaws.com",
    port: "3306",
    user: "admin",
    password: "Willdiaz123.",
    database: "databaspruebacl",
});

db.connect((err) => {
    if(err){
        console.log(err.message);
        return;
    }
    console.log("Base de Datos Conectada")
});
