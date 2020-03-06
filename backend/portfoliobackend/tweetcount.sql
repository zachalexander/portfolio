BEGIN TRANSACTION;

drop table if exists users.portfolio_tweets;
drop table if exists users.portfolio_tweet_count;

CREATE TABLE users.portfolio_tweets (
id int NOT NULL PRIMARY KEY,
tweetText varchar(255) NOT NULL,
user varchar(255) NOT NULL,
followers int NOT NULL,
date datetime NOT NULL,
location varchar(255)
);

CREATE TABLE users.portfolio_tweet_count (
count int,
date datetime NOT NULL
);

INSERT INTO portfolio_tweet_count (count, date)
VALUES (1, CURRENT_TIMESTAMP);

COMMIT;