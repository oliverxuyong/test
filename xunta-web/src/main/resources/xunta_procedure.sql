DELIMITER //

##USE db_yi//


#添加一条 topic_register的存储过程
DELIMITER //
DROP PROCEDURE  IF EXISTS add_topic_register//
CREATE PROCEDURE add_topic_register(
	IN center_topicid BIGINT,
	IN register_topicid BIGINT,
	IN createDatettime_long BIGINT
)
BEGIN
	#如果是第一次挂，那么挂的时间应该最早，查询是否存在挂
	DECLARE num INT DEFAULT 0;
	SELECT COUNT(1) INTO num FROM tbl_topicregister_record AS t WHERE t.center_topicid = center_topicid AND t.register_topicid = register_topicid;
	IF num > 0 THEN
		INSERT INTO tbl_topic_register(id,center_topicid,register_topicid,createDatetime,createDatetime_long)
		VALUES(DEFAULT,center_topicid,register_topicid, FROM_UNIXTIME(createDatettime_long/1000,'%Y-%m-%d %H:%i:%S'),createDatettime_long);
	ELSE 
		INSERT INTO tbl_topic_register(id,center_topicid,register_topicid,createDatetime,createDatetime_long)
		VALUES(DEFAULT,center_topicid,register_topicid, FROM_UNIXTIME(0,'%Y-%m-%d %H:%i:%S'),0);
	END IF;
END;
//

#删除一条　topic_register的存储过程
DELIMITER //


DROP PROCEDURE  IF EXISTS del_topic_register//
CREATE PROCEDURE del_topic_register(
	IN center_topicid BIGINT,
	IN register_topicid BIGINT
)
BEGIN
	DELETE t1 FROM tbl_topic_register AS t1 WHERE t1.center_topicid = center_topicid AND t1.register_topicid = register_topicid;
		
END;
//

#将两个话题互挂的存储过程
DELIMITER //
DROP PROCEDURE IF EXISTS topic_register_with_eachother//
CREATE PROCEDURE topic_register_with_eachother(
	IN topicid1 BIGINT,
	IN topicid2 BIGINT,
	IN createDatettime_long BIGINT
	)
BEGIN
    DECLARE t_error INT DEFAULT 0;  
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET t_error=1;  
        START TRANSACTION;  
	  CALL add_topic_register(topicid1,topicid2,createDatettime_long);
	  CALL add_topic_register(topicid2,topicid1,createDatettime_long);        
        IF t_error = 1 THEN  
            ROLLBACK;  
        ELSE  
            COMMIT;  
        END IF;  
   SELECT t_error;  
END;
//


#将两个话题相互解挂的存储过程
DELIMITER //
DROP PROCEDURE IF EXISTS del_topic_register_with_eachother//
CREATE PROCEDURE del_topic_register_with_eachother(
	IN topicid1 BIGINT,
	IN topicid2 BIGINT
	)
BEGIN
    DECLARE t_error INT DEFAULT 0;  
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET t_error=1;  
        START TRANSACTION;  
	  CALL del_topic_register(topicid1,topicid2);
	  CALL del_topic_register(topicid2,topicid1);        
        IF t_error = 1 THEN  
            ROLLBACK;  
        ELSE  
            COMMIT;  
        END IF;  
   SELECT t_error;  
END;
//

#添加话题挂的记录的触发器
DELIMITER //
DROP TRIGGER IF EXISTS add_topic_register_record//
CREATE TRIGGER add_topic_register_record 
AFTER INSERT ON tbl_topic_register FOR EACH ROW
BEGIN
	INSERT INTO tbl_topicregister_record 
	(`id`, 
	`center_topicid`, 
	`operation`, 
	`opt_datetime_long`, 
	`opt_datetime_str`, 
	`register_topicid`
	)
	VALUES
	(DEFAULT, 
	new.center_topicid, 
	1, 
	new.createDatetime_long, 
	new.createDatetime, 
	new.register_topicid
	);
END;
//

#删除话题挂 的记录的触发器
DELIMITER //
DROP TRIGGER IF EXISTS del_topic_register_record//
CREATE TRIGGER del_topic_register_record 
 AFTER DELETE ON tbl_topic_register FOR EACH ROW
BEGIN
	DECLARE time_long BIGINT DEFAULT UNIX_TIMESTAMP();
	
	INSERT INTO tbl_topicregister_record 
	(`id`, 
	`center_topicid`, 
	`operation`, 
	`opt_datetime_long`, 
	`opt_datetime_str`, 
	`register_topicid`
	)
	VALUES
	(DEFAULT, 
	old.center_topicid, 
	0, 
	time_long*1000,
	FROM_UNIXTIME(time_long,'%Y-%m-%d %H:%i:%S'), 
	old.register_topicid
	);
END;
//

#添加消息触发器　==>更新话题的最新回复时间
DELIMITER //
DROP TRIGGER IF EXISTS update_topic_newest_restime//
CREATE TRIGGER update_topic_newest_restime
AFTER INSERT ON tbl_chatmessage FOR EACH ROW
BEGIN
	UPDATE tbl_topic AS t SET t.newest_response_time_long = new.msg_create_datetime_long,
				t.newest_response_time_str = new.msg_create_datetime_str
		WHERE t.topicId = new.topic_id;
END;
//


#插入一条话题
DELIMITER //
DROP PROCEDURE IF EXISTS add_topic//
CREATE PROCEDURE add_topic(
	IN userid BIGINT,
	IN topicId BIGINT,
	IN topicContent LONGTEXT,
	IN newest_response_time_str VARCHAR(255),
	IN newest_response_time_long BIGINT,
	IN ifclosed INT,
	IN createDatetime_str VARCHAR(255),
	IN createDatetime_long BIGINT
)
BEGIN	
	INSERT INTO `tbl_topic` 
		(`id`, 
		`createDatetime_long`, 
		`createDatetime_str`, 
		`ifclosed`, 
		`newest_response_time_long`, 
		`newest_response_time_str`, 
		`topicContent`, 
		`topicId`, 
		`userid`
		)
		VALUES
		(DEFAULT, 
		createDatetime_long, 
		createDatetime_str, 
		ifclosed, 
		newest_response_time_long, 
		newest_response_time_str, 
		topicContent, 
		topicId, 
		userid
		);
END;
//


#插入一条消息
DELIMITER //
DROP PROCEDURE IF EXISTS add_chatmessage//
CREATE PROCEDURE add_chatmessage(
	IN `content` LONGTEXT, 
	IN `msg_create_datetime_long` BIGINT, 
	IN `msg_create_datetime_str` VARCHAR(255), 
	IN `msgid` BIGINT, 
	IN `send_userid` BIGINT, 
	IN `tmppid` BIGINT, 
	IN `topic_id` BIGINT, 
	IN `type` INT, 
	IN `sender_from_topicid` BIGINT	
)
BEGIN
	INSERT INTO `tbl_chatmessage` 
		(`id`, 
		`content`, 
		`msg_create_datetime_long`, 
		`msg_create_datetime_str`, 
		`msgid`, 
		`send_userid`, 
		`tmppid`, 
		`topic_id`, 
		`type`, 
		`sender_from_topicid`
		)
		VALUES
		(DEFAULT, 
		content, 
		msg_create_datetime_long, 
		msg_create_datetime_str, 
		msgid, 
		send_userid, 
		tmppid, 
		topic_id, 
		`type`, 
		sender_from_topicid
		);
END;
//




#========将话题移到新话题中============================================
# 　我的话题与我的话题中的别人的话题解挂
#　 将新建的话题与我的话题中的别人的话题挂在一起

DELIMITER //
DROP PROCEDURE IF EXISTS moveto_new_topic//
CREATE PROCEDURE moveto_new_topic(
	IN userid BIGINT,
	IN move_from_topicid BIGINT,
	IN move_new_topicid BIGINT,
	IN bemoved_topicid BIGINT,
	IN topicContent LONGTEXT,
	IN topic_createtime BIGINT,
	IN new_msgid BIGINT
)
BEGIN
	DECLARE t_error INT DEFAULT 0;  
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET t_error =1;
	START TRANSACTION;
		#一条新话题==>tbl_topic 插入一条数据
		CALL add_topic(
			userid,
			move_new_topicid,
			topicContent,
			FROM_UNIXTIME(topic_createtime/1000,'%Y-%m-%d %H:%i:%S'),
			topic_createtime,
			0,
			FROM_UNIXTIME(topic_createtime/1000,'%Y-%m-%d %H:%i:%S'),
			topic_createtime
		);
		#新创建的话题要当作一条消息保存到当前新创建的话题中
		CALL add_chatmessage(
			topicContent,
			topic_createtime,
			FROM_UNIXTIME(topic_createtime/1000,'%Y-%m-%d %H:%i:%S'),
			new_msgid,
			userid,
			UNIX_TIMESTAMP()*1000,
			move_new_topicid,
			0,
			move_new_topicid
		);
		#把自己的话题与自己话题中的别人的话题解挂
		CALL del_topic_register(move_from_topicid,bemoved_topicid);
		CALL del_topic_register(bemoved_topicid,move_from_topicid);
		#将自己的新创建的话题与别人的话题挂在一起
		CALL add_topic_register(move_new_topicid,bemoved_topicid,topic_createtime);
		CALL add_topic_register(bemoved_topicid,move_new_topicid,topic_createtime); 
			
	IF t_error = 1 THEN
		ROLLBACK;
	ELSE
		COMMIT;
	END IF;
	
	SELECT t_error;
END;
//



#########发起新话题 存储过程 插入一条话题，将第一条话题当作消息插入
DELIMITER //
DROP PROCEDURE IF EXISTS post_new_topic//
CREATE PROCEDURE post_new_topic(
	IN userid BIGINT,
	IN topicId BIGINT,
	IN tmp_topicid BIGINT,
	IN topicContent LONGTEXT,
	IN ifclosed INT,
	IN createDatetime_long BIGINT,
	IN msgid BIGINT,
	IN tmppid BIGINT
)
BEGIN
	DECLARE t_error INT DEFAULT 0;
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET t_error=1;
	START TRANSACTION;
	CALL add_topic(
		userid,
		topicId,
		topicContent,
		FROM_UNIXTIME(createDatetime_long/1000,'%Y-%m-%d %H:%i:%S'),
		createDatetime_long,
		ifclosed,
		FROM_UNIXTIME(createDatetime_long/1000,'%Y-%m-%d %H:%i:%S'),
		createDatetime_long
	);
	CALL add_newtopic_request(userid,tmp_topicid);
	CALL add_chatmessage(
		topicContent,
		createDatetime_long,
		FROM_UNIXTIME(createDatetime_long/1000,'%Y-%m-%d %H:%i:%S'),
		msgid,
		userid,
		tmppid,
		topicId,
		0,
		topicId
	);
	
	IF t_error = 1 THEN
		ROLLBACK;
	ELSE
		COMMIT;
	END IF;
	
	SELECT t_error;
END;
//

##插入一条创建话题请求的记录,用来查重

DELIMITER //
DROP PROCEDURE IF EXISTS add_newtopic_request//
CREATE PROCEDURE add_newtopic_request(
	IN `userid` BIGINT,
	IN `tmp_topicid` BIGINT 
)
BEGIN
INSERT INTO `db_yi`.`tbl_newtopic_request` 
	(`id`, 
	 `userid`,
	`tmp_topicid` 
	)
	VALUES
	(DEFAULT, 
	userid, 
	tmp_topicid
	);
END;
//


##创建删除用户的触发器
DELIMITER //
DROP TRIGGER IF EXISTS trigger_del_user//
CREATE TRIGGER trigger_del_user
AFTER DELETE ON tbl_user FOR EACH ROW
BEGIN	
##删除消息
DELETE FROM `db_yi`.`tbl_chatmessage` WHERE `send_userid` = old.userid  ;
##删除话题中的挂的
DELETE FROM `db_yi`.`tbl_topic_register` WHERE `center_topicid` OR `register_topicid`  IN (SELECT t1.`topicId` FROM `tbl_topic` AS t1 WHERE t1.`userid` = old.userid );
DELETE FROM `db_yi`.`tbl_topicregister_record` WHERE `center_topicid` OR `register_topicid`  IN (SELECT t1.`topicId` FROM `tbl_topic` AS t1 WHERE t1.`userid` = old.userid );
##删除创建话题时防止重复的表
DELETE FROM `db_yi`.`tbl_newtopic_request` WHERE `userid` = old.userid ;
##删除用户设置
DELETE FROM `db_yi`.`tbl_topic_setting` WHERE `topicid` IN  (SELECT t1.`topicId` FROM `tbl_topic` AS t1 WHERE t1.`userid` = old.userid) ;
##删除记录用户的未读消息	
DELETE FROM `db_yi`.`tbl_unreadmsg` WHERE `userid` = old.userid ;
##删除记录的用户的未读消息数
DELETE FROM `db_yi`.`tbl_user_topic_unreadnum` WHERE `userid` = old.userid ;	
##删除用户的预设话题
DELETE FROM `db_yi`.`tbl_pub_topic` WHERE `userid` = old.userid ;
##删除用用户的话题(放最后删除)
DELETE FROM `db_yi`.`tbl_topic` WHERE `userid` = old.userid;

END;
//









