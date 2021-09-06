import { Connection } from 'mysql2';
import insert from '../Helpers/Insert';

export default async function likesGenerator(connection: Connection) {
    for (let i = 0; i < 6000; i++) {
        const likeTypes = ["P", "C"];
        const type = likeTypes[Math.floor(Math.random() * 2)];

        const like = {
            user_id: Math.floor(Math.random() * 100 + 1),
            type,
            post_id: type === "P" ? Math.floor(Math.random() * 500 + 1) : null,
            comment_id: type === "C" ? Math.floor(Math.random() * 1000 + 1) : null,
        };

        const query = `INSERT INTO likes(
            like_user_id, like_type, like_post_id, like_comment_id
        ) VALUES (
            ${like.user_id}, "${like.type}", ${like.post_id}, ${like.comment_id}
        )`;

        try {
            await insert(query, connection)
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};