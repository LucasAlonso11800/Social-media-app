import { Connection } from 'mysql2';
import faker from 'faker';
import insert from '../Helpers/Insert';

export default async function commentsGenerator(connection: Connection) {
    for (let i = 0; i < 200; i++) {
        const UserNumber = Math.floor(Math.random() * 40 + 1);
        const UserIsEven = UserNumber % 2 === 0;

        const PostNumber = Math.floor(Math.random() * 100 + 1);
        const PostIsEven = PostNumber % 2 === 0;

        const comment = {
            post_id: PostIsEven ? (PostNumber - 1) * 5 : PostNumber * 5,
            user_id: UserIsEven ? (UserNumber - 1) * 5 : UserNumber * 5,
            body: faker.lorem.paragraph(Math.floor(Math.random() * 10)).substring(0, 140),
            createdAt: faker.date.past(1)
        };

        const query = `INSERT INTO comments(
            comment_post_id, comment_user_id, comment_body, comment_created_at
        ) VALUES (
            ${comment.post_id}, ${comment.user_id}, "${comment.body}", "${comment.createdAt.toISOString().substring(0, 19)}"
        )`;

        try {
            await insert(query, connection)
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};