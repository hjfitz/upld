CREATE DATABASE UPLD;
USE UPLD;
-- hash of image used as PK because is essentially unique
-- could concat with autonum incase of collision with md5
-- not required in this case because the program's for personal use
CREATE TABLE IMAGES (
    img_hash CHAR(32) NOT NULL,
    img_origName VARCHAR(255) NOT NULL,
    img_name CHAR(12) NOT NULL,
    img_format CHAR(4) NOT NULL,
    img_uplDate DATE NOT NULL
    PRIMARY KEY (img_hash)
);
