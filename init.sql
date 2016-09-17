CREATE DATABASE UPLD;
USE UPLD;

CREATE TABLE IMAGES (
    img_hash CHAR(32) NOT NULL,
    img_origName VARCHAR(255) NOT NULL,
    img_name CHAR(12) NOT NULL,
    img_format VARCHAR(4) NOT NULL,
    img_uplDate DATE NOT NULL
    PRIMARY KEY (img_hash)
);
