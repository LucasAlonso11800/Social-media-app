CREATE DEFINER=`root`@`localhost` PROCEDURE `CommentIns`(
	IN	PPostId			INT,
    IN 	PUserId			INT,
    IN 	PCreatedAt		CHAR(19),
    IN	PBody			VARCHAR(140)
)
BEGIN
	INSERT INTO comments (
		`comment_post_id`,
		`comment_user_id`,
		`comment_created_at`,
		`comment_body`
	) VALUES (PPostId, PUserId, PCreatedAt, PBody);
END