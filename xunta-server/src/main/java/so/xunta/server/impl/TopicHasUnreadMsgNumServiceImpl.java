package so.xunta.server.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import so.xunta.beans.TopicHasUnreadMsgNum;
import so.xunta.persist.TopicHasUnreadMsgNumDao;
import so.xunta.server.TopicHasUnreadMsgNumService;

@Service
@Transactional
public class TopicHasUnreadMsgNumServiceImpl implements TopicHasUnreadMsgNumService{

		@Autowired
		private TopicHasUnreadMsgNumDao userHasUnreadmsgTopicDao;
		
		@Override
		public void recordUnReadMsgIncreaseOne(Long userid, Long topicid) {
			TopicHasUnreadMsgNum uh = userHasUnreadmsgTopicDao.findUserHasUnreadMsgTopicByTopicid(topicid);
			if(uh ==null){
				uh = new TopicHasUnreadMsgNum(userid, topicid, 1);
				userHasUnreadmsgTopicDao.addUserHasUnReadMsgTopicDao(uh);
			}else{
				userHasUnreadmsgTopicDao.increaseUnreadMsgNumbyOne(userid,topicid);
			}
		}

		@Override
		public void deleteUserUnReadTopicMsgByUserid(Long userid) {
			userHasUnreadmsgTopicDao.deleteUserHasUnreadMsgTopicByUserId(userid);
		}

		@Override
		public void deleteUserUnreadTopicMsgByTopicid(Long topicid) {
			userHasUnreadmsgTopicDao.deleteUserHasUnreadMsgTopicByTopicid(topicid);
		}

		@Override
		public List<TopicHasUnreadMsgNum> findUserHasUnreadMsgTopicByUserid(Long userid) {
			return userHasUnreadmsgTopicDao.findUserHasUnreadMsgTopicByUserid(userid);
		}

		@Override
		public void recordUnReadMsgDecreaseOne(Long userid, Long topicid) {
			userHasUnreadmsgTopicDao.recordUnReadMsgDecreaseOne(userid, topicid);
		}

}
