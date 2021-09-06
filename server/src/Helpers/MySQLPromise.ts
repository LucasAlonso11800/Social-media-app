import { Connection } from "mysql2";

export const mysqlQuery = (query: string, connection: Connection): any => {
    return new Promise((resolve, reject) => {
        connection.query(query, (err, result) => {
            if(err) return reject(err);
            resolve(result);
        })
    })
};