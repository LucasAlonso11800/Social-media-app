CREATE DEFINER=`root`@`localhost` PROCEDURE `BlockDel`(
	IN PBlockingUserId		INT,
    IN PBlockedUserId		INT
)
BEGIN
	DELETE FROM blocks
		WHERE blocking_user_id = PBlockingUserId 
		AND blocked_user_id = PBlockedUserId;
END