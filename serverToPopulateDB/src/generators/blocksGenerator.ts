import { Connection } from 'mysql2';
import insert from '../Helpers/Insert';

export default async function blocksGenerator(connection: Connection, numberOfIterations: number): Promise<any>{
    for (let i = numberOfIterations; i < 50; i++) {

        const block = {
            blocking_user_id: Math.floor(Math.random() * 100 + 1),
            blocked_user_id: Math.floor(Math.random() * 100 + 1)
        };

        if(block.blocked_user_id === block.blocked_user_id) continue

        const query = `INSERT INTO blocks(
            blocking_user_id, blocked_user_id
        ) VALUES (
            ${block.blocking_user_id}, ${block.blocked_user_id}
        )`;

        try {
            await insert(query, connection)
        }
        catch (err: any) {
            if(err.sqlMessage.startsWith('Duplicate entry')) return blocksGenerator(connection, i)
            throw new Error(err)
        }
    }
};