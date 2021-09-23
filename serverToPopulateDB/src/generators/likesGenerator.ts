import { Connection } from 'mysql2';
import insert from '../Helpers/Insert';

export default async function likesGenerator(connection: Connection) {
    for (let i = 870; i < 1000; i++) {
        const likeTypes = ["P", "C"];
        const type = likeTypes[Math.floor(Math.random() * 2)];

        const UserNumber = Math.floor(Math.random() * 40 + 1);
        const UserIsEven = UserNumber % 2 === 0;

        const PostNumber = Math.floor(Math.random() * 100 + 1);
        const PostIsEven = PostNumber % 2 === 0;

        const CommentNumber = Math.floor(Math.random() * 200 + 1);
        const CommentIsEven = CommentNumber % 2 === 0;
        if((CommentNumber - 1) * 5 === 5 || CommentNumber * 5 === 5) continue
        if((CommentNumber - 1) * 5 === 145 || CommentNumber * 5 === 145) continue
        if((CommentNumber - 1) * 5 === 315 || CommentNumber * 5 === 315) continue

        const like = {
            user_id: UserIsEven ? (UserNumber - 1) * 5 : UserNumber * 5,
            type,
            post_id: type === "P" ? PostIsEven ? (PostNumber - 1) * 5 : PostNumber * 5 : null,
            comment_id: type === "C" ? CommentIsEven ? (CommentNumber - 1) * 5 : CommentNumber * 5 : null,
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