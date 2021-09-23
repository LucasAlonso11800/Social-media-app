import { Connection } from 'mysql2';
import faker from 'faker';
import insert from '../Helpers/Insert';

export default async function postsGenerator(connection: Connection) {
    for (let i = 0; i < 100; i++) {
        const number = Math.floor(Math.random() * 40 + 1);
        const isEven = number % 2 === 0;

        const post = {
            user_id: isEven ? (number - 1) * 5 : number * 5,
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