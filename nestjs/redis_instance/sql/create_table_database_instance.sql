USE db_redis_instance;
CREATE TABLE database_instance(
  `id` varchar(40) PRIMARY KEY NOT NULL,
  `host` varchar(255) NOT NULL,
  `port` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255),
  `password` varchar(255),
  `status` int NOT NULL DEFAULT 0
);

insert into database_instance SET `id`=UUID(), `host`='127.0.0.1', `port`=6379, `name`='test1';
insert into database_instance SET `id`=UUID(), `host`='192.168.1.1', `port`=6379, `name`='test2', `status`=1;
insert into database_instance SET `id`=UUID(), `host`='127.0.0.1', `port`=6380, `name`='test3';
