import  {connection } from '../app';

export const mysqlQuery = (query: string): any => {
    return new Promise((resolve, reject) => {
        connection.query(query, (err, result) => {
            if(err) return reject(err);
            resolve(result);
        })
    })
};