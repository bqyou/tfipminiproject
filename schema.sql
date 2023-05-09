CREATE TABLE users (
  email VARCHAR(255) PRIMARY KEY,
  password VARCHAR(255) NOT NULL,
  verification_code VARCHAR(255) NOT NULL
);

CREATE TABLE verifiedusers (
  userID INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255) NOT NULL,
  displayName VARCHAR (255) NOT NULL,
  dateOfBirth DATE NOT NULL,
  gender VARCHAR (10) NOT NULL,
  preference VARCHAR (10) NOT NULL,
  profilePic longblob NOT NULL,
  imageType VARCHAR(20) NOT NULL
);

CREATE TABLE swipe_status (
  userID INT NOT NULL,
  number_of_swipes INT DEFAULT 10,
  premium_status BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (userID),
  FOREIGN KEY (userID) REFERENCES verifiedusers(userID)
);