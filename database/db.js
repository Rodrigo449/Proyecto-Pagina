const mysql= require('mysql');
const conection = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
});

conection.connect((error)=>{
    if(error){
        //atrapa un error en caso de haber uno y lo muestra con terminal o consola
        console.log('El error de coneccion es: '+error);
        return;
    }else{
        //de lo contrario muestra un mensaje de que no hay ningun error en la conección 
        console.log('CONECTADO A LA BASE DE DATOS');
    }
});
//exportamos el modulo para no volver a setear el archivo y poder usarlo en cualquier archivo del proyecto
module.exports= conection;