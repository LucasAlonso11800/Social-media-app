import { Connection } from 'mysql2';
import insert from '../Helpers/Insert';

export default async function blocksGenerator(connection: Connection, numberOfIterations: number): Promise<any>{
    for (let i = numberOfIterations; i < 5; i++) {
        const BlockingNumber = Math.floor(Math.random() * 20 + 1);
        const BlockingIsEven = BlockingNumber % 2 === 0;

        const blockedNumber = Math.floor(Math.random() * 20 + 1);
        const blockedIsEven = blockedNumber % 2 === 0;

        const block = {
            blocking_user_id: BlockingIsEven ? (BlockingNumber - 1) * 5 : BlockingNumber * 5,
            blocked_user_id: blockedIsEven ? (blockedNumber - 1) * 5 : blockedNumber * 5
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