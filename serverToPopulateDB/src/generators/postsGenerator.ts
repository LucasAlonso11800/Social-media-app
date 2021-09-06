import { Connection } from 'mysql2';
import faker from 'faker';
import insert from '../Helpers/Insert';

export default async function postsGenerator(connection: Connection) {
    for (let i = 0; i < 500; i++) {
        const post = {
            user_id: Math.floor(Math.random() * 100 + 1),
            body: faker.lorem.paragraph(Math.floor(Math.random() * 10)).substring(0, 140)
        };

        const query = `INSERT INTO posts(
            post_user_id, post_body
        ) VALUES (
            ${post.user_id}, "${post.body}"
        )`;

        try {
            await insert(query, connection)
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};