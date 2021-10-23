CREATE DEFINER=`root`@`localhost` PROCEDURE `CheckBlockRelation`(
	IN PBlockingUserId		INT,
    IN PBlockedUserId		INT
)
BEGIN
	SELECT * FROM blocks 
    WHERE blocking_user_id = PBlockingUserId 
    AND blocked_user_id = PBlockedUserId;
END