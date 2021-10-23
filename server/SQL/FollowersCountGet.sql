CREATE DEFINER=`root`@`localhost` PROCEDURE `FollowersCountGet`(
	IN	PfolloweeId		INT
)
BEGIN
	SELECT COUNT(*) as followers 
    FROM follows 
    WHERE followee_id = PfolloweeId;
END