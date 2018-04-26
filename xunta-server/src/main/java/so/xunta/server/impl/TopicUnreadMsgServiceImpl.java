package so.xunta.server.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import so.xunta.beans.TopicUnreadMsg;
import so.xunta.beans.TopicUnreadMsgQueue;
import so.xunta.persist.TopicUnreadMsgDao;
import so.xunta.server.TopicUnreadMsgService;

@Service
@Transactional
public class TopicUnreadMsgServiceImpl implements TopicUnreadMsgService {

	@Autowired
	private TopicUnreadMsgDao unreadMsgDao;
	
//	@Autowired
//	private TopicHasUnreadMsgNumDao userHasUnreadMsgTopicDao;

	@Override
	public void addUnreadMsg(TopicUnreadMsg unreadMsg) {
		// unreadMsgDao.addUnreadMsg(unreadMsg);
		TopicUnreadMsgQueue.offerUnreadMsg(unreadMsg);
	}

	@Override
	public List<TopicUnreadMsg> findUnreadChatMessage(Long userid) {
		return unreadMsgDao.findUnreadMsgs(userid);
	}

	@Override
	public void deleteUnreadMsgs(Long topicid) {
		if (topicid == null) {
			return;
		}
		unreadMsgDao.deleteUnreadMsgs(topicid);
	}

	@Override
	public void deleteOneUnreadMsg(Long topicid, Long msgid) {
		unreadMsgDao.deleteOneUnreadMsg(topicid, msgid);
	}

	@Override
	public void deleteUserAllUnreadMsgs(Long userid) {
		unreadMsgDao.deleteUserAllUnreadMsgs(userid);
	}

}
