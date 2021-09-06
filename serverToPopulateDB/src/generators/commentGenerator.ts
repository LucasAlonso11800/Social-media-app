import { Connection } from 'mysql2';
import faker from 'faker';
import insert from '../Helpers/Insert';

export default async function commentsGenerator(connection: Connection) {
    for (let i = 0; i < 1000; i++) {
        const comment = {
            post_id: Math.floor(Math.random() * 500 + 1),
            user_id: Math.floor(Math.random() * 100 + 1),
            body: faker.lorem.paragraph(Math.floor(Math.random() * 10)).substring(0, 140)
        };

        const query = `INSERT INTO comments(
            comment_post_id, comment_user_id, comment_body
        ) VALUES (
            ${comment.post_id}, ${comment.user_id}, "${comment.body}"
        )`;

        try {
            await insert(query, connection)
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};