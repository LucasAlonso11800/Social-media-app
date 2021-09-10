import { Connection } from 'mysql2';
import faker from 'faker';
import insert from '../Helpers/Insert';

export default async function postsGenerator(connection: Connection) {
    for (let i = 0; i < 500; i++) {
        const post = {
            user_id: Math.floor(Math.random() * 100 + 1),
            body: faker.lorem.paragraph(Math.floor(Math.random() * 10 + 1)).substring(0, 140),
            createdAt: faker.date.past(2)
        };

        const query = `INSERT INTO posts(
            post_user_id, post_body, post_created_at
        ) VALUES (
            ${post.user_id}, "${post.body}", "${post.createdAt.toISOString().substring(0, 10)}"
        )`;

        try {
            await insert(query, connection)
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};