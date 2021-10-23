CREATE DEFINER=`root`@`localhost` PROCEDURE `FollowDel`(
	IN PfollowerId		int,
    IN PfolloweeId		int
)
BEGIN
	DELETE FROM follows 
    WHERE 
    follower_id = PfollowerId 
    AND 
    followee_id = PfolloweeId;
END