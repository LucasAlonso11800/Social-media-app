CREATE DEFINER=`root`@`localhost` PROCEDURE `SingleCommentGet`(
	IN 	PCommentId	INT
)
BEGIN
	SELECT 
		comment_id AS id,
		comment_body AS body,
		comment_created_at AS createdAt,
		user_username AS username,
		profile_profile_name AS profileName
	FROM comments
	JOIN users
	ON comment_user_id = users.user_id
	JOIN profiles
    ON profiles.profile_user_id = comment_user_id
    WHERE comment_id = PcommentId;
END