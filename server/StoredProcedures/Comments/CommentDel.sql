CREATE DEFINER=`root`@`localhost` PROCEDURE `CommentDel`(
	IN PCommentId	INT
)
BEGIN
	DELETE FROM comments WHERE comment_id = PCommentId;
END