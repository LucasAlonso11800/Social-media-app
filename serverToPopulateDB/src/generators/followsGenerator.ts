import { Connection } from 'mysql2';
import insert from '../Helpers/Insert';

export default async function followsGenerator(connection: Connection, numberOfIterations: number): Promise<any> {
    for (let i = numberOfIterations; i < 3000; i++) {

        const follow = {
            follower_id: Math.floor(Math.random() * 100 + 1),
            followee_id: Math.floor(Math.random() * 100 + 1)
        };

        if(follow.followee_id === follow.follower_id) continue

        const query = `INSERT INTO follows(
            follower_id, followee_id
        ) VALUES (
            ${follow.follower_id}, ${follow.followee_id}
        )`;

        try {
            await insert(query, connection)
        }
        catch (err: any) {
            if(err.sqlMessage.startsWith('Duplicate entry')) return followsGenerator(connection, i)
            throw new Error(err)
        }
    }
};