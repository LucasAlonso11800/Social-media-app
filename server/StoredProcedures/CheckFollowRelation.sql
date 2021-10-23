CREATE DEFINER=`root`@`localhost` PROCEDURE `CheckFollowRelation`(
	IN PfollowerId		INT,
    IN PfolloweeId		INT
)
BEGIN
	SELECT * FROM follows WHERE follower_id = PfollowerId AND followee_id = PfolloweeId;
END