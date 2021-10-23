CREATE DEFINER=`root`@`localhost` PROCEDURE `FollowIns`(
In  PfollowerId					INT,
In  PfolloweeId					INT
)
BEGIN
INSERT INTO	follows (`follower_id`, `followee_id`)
		VALUES (PfollowerId, PfolloweeId); 
END