CREATE DEFINER=`root`@`localhost` PROCEDURE `FolloweesCountGet`(
	IN	PfolloweeId	INT
)
BEGIN
	SELECT COUNT(*) AS followees FROM follows WHERE follower_id = PfolloweeId;
END