/*
SQLyog Ultimate v12.09 (64 bit)
MySQL - 5.7.10-log : Database - wolf
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`wolf` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `wolf`;
/*Table structure for table `tbl_communicatetime` */

DROP TABLE IF EXISTS `tbl_communicatetime`;

CREATE TABLE `tbl_communicatetime` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `datetime` bigint(20) NOT NULL,
  `datetimestr` varchar(255) NOT NULL,
  `fromtopicid` bigint(20) NOT NULL,
  `msgid` bigint(20) NOT NULL,
  `totopicid` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_qxg0lhskexhsoyntvn0n9r6hk` (`fromtopicid`,`totopicid`)
) ENGINE=InnoDB AUTO_INCREMENT=22184 DEFAULT CHARSET=utf8mb4;

/*Table structure for table `tbl_dic` */

DROP TABLE IF EXISTS `tbl_dic`;

CREATE TABLE `tbl_dic` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `_key` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_b55eqlxqlwgrqskv9a30m62nn` (`_key`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

/*Table structure for table `tbl_logger` */

DROP TABLE IF EXISTS `tbl_logger`;

CREATE TABLE `tbl_logger` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `datetime_long` bigint(20) DEFAULT NULL,
  `datetime_str` varchar(255) DEFAULT NULL,
  `info` mediumtext,
  `userId` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49283 DEFAULT CHARSET=utf8mb4;

/*Table structure for table `tbl_mobilephone_valicode` */

DROP TABLE IF EXISTS `tbl_mobilephone_valicode`;

CREATE TABLE `tbl_mobilephone_valicode` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `datetime_long` bigint(20) DEFAULT NULL,
  `datetime_str` varchar(20) DEFAULT NULL,
  `ip` varchar(15) DEFAULT NULL,
  `mobile_phone_number` varchar(15) DEFAULT NULL,
  `validatecode` varchar(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=140 DEFAULT CHARSET=utf8mb4;




/*Table structure for table `tbl_user` */

DROP TABLE IF EXISTS `tbl_user`;

CREATE TABLE `tbl_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `create_datetime_long` bigint(20) DEFAULT NULL,
  `create_datetime_str` varchar(255) DEFAULT NULL,
  `imgUrl` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `third_party_id` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `userGroup` varchar(255) NOT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `password` varchar(12) DEFAULT NULL,
  `phonenumber` varchar(15) DEFAULT NULL,
  `ifInitedTopics` int(11) DEFAULT '0',
  `openid` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_37eqpe6xlhe06phctre5cl0b6` (`third_party_id`,`type`)
) ENGINE=InnoDB AUTO_INCREMENT=735 DEFAULT CHARSET=utf8mb4;


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
