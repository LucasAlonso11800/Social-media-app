import { Connection } from "mysql2";

export function mysqlConnection(connection: Connection){
    return new Promise((resolve, reject) => {
        connection.connect(err => {
            if(err) return reject(err)
            resolve('Connected')
        })
    })
};