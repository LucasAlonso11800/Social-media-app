CREATE DATABASE social_media;
USE social_media; 

CREATE TABLE users(
	user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_username VARCHAR(40) UNIQUE,
    user_email VARCHAR(40) UNIQUE,
    user_password VARCHAR(255),
    user_city VARCHAR(100),
    user_country VARCHAR(100),
    user_birth_date CHAR(10)
);

CREATE TABLE posts(
	post_id INT AUTO_INCREMENT PRIMARY KEY,
    post_user_id INT,
    post_body VARCHAR(140),
    post_created_at CHAR(19),
    FOREIGN KEY(post_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE comments(
	comment_id INT AUTO_INCREMENT PRIMARY KEY,
    comment_post_id INT,
    comment_user_id INT,
    comment_created_at CHAR(19),
    comment_body VARCHAR(140),
    FOREIGN KEY(comment_post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY(comment_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE likes(
	like_id INT AUTO_INCREMENT PRIMARY KEY,
    like_user_id INT,
    like_type CHAR(1),
    like_post_id INT,
    like_comment_id INT,
    FOREIGN KEY(like_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY(like_post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY(like_comment_id) REFERENCES comments(comment_id) ON DELETE CASCADE
);

CREATE TABLE follows (
    follower_id INT,
    followee_id INT,
    FOREIGN KEY(follower_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY(followee_id) REFERENCES users(user_id) ON DELETE CASCADE,
    PRIMARY KEY(follower_id, followee_id)
);

CREATE TABLE blocks (
    blocking_user_id INT,
    blocked_user_id INT,
    FOREIGN KEY(blocking_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY(blocked_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    PRIMARY KEY(blocking_user_id, blocked_user_id)
);

CREATE TABLE profiles(
	profile_id INT AUTO_INCREMENT PRIMARY KEY,
    profile_user_id INT,
    profile_profile_name VARCHAR(40),
    profile_profile_description VARCHAR(140),
    FOREIGN KEY(profile_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE images(
	image_id INT AUTO_INCREMENT PRIMARY KEY,
    image_type CHAR(1),
    image_user_id INT,
    image_profile_id INT,
    image_image LONGTEXT,
	FOREIGN KEY(image_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
	FOREIGN KEY(image_profile_id) REFERENCES profiles(profile_id) ON DELETE CASCADE
);