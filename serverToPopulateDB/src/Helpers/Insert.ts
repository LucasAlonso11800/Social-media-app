import { Connection } from 'mysql2';

export default function insert(query: string, connection: Connection) {
    return new Promise((resolve, reject) => {
        connection.query(query, (err, result) => {
            if (err){
                console.log(err);
                reject(err);
            }
            resolve(result)
        })
    })
};