CREATE DEFINER=`root`@`localhost` PROCEDURE `BlockIns`(
	IN	PBlockingUserId		INT,
	IN	PBlockedUserId		INT
)
BEGIN
	INSERT INTO blocks (`blocking_user_id`, `blocked_user_id`)
		VALUES (PBlockingUserId, PBlockedUserId);
END