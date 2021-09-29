import { Connection } from 'mysql2';
import insert from '../Helpers/Insert';

export default async function followsGenerator(connection: Connection, numberOfIterations: number): Promise<any> {
    for (let i = numberOfIterations; i < 200; i++) {
        const FollowerNumber = Math.floor(Math.random() * 20 + 1);
        const FollowerIsEven = FollowerNumber % 2 === 0;

        const FolloweeNumber = Math.floor(Math.random() * 20 + 1);
        const FolloweeIsEven = FolloweeNumber % 2 === 0;

        const follow = {
            follower_id: FollowerIsEven ? (FollowerNumber - 1) * 5 : FollowerNumber * 5,
            followee_id: FolloweeIsEven ? (FolloweeNumber - 1) * 5 : FolloweeNumber * 5
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