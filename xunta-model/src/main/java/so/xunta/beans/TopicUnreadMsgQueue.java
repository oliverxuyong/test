package so.xunta.beans;

import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.log4j.Logger;

public class TopicUnreadMsgQueue {
	private static Map<TopicUnreadMsg, Long> msgid_time_map = new ConcurrentHashMap<TopicUnreadMsg, Long>();
	static Logger logger = Logger.getLogger(TopicUnreadMsgQueue.class);

	// 2秒超时
	private static final Long TIMEOUT = 3000L;

	/**
	 * 添加待确定的消息
	 * 
	 * @param unreadMsg
	 */
	public static void offerUnreadMsg(TopicUnreadMsg unreadMsg) {
		msgid_time_map.put(unreadMsg, new Date().getTime());
	}

	/**
	 * 提取超时的消息保存为未读消息
	 * 
	 * @return
	 */
	public static List<TopicUnreadMsg> popUnreadMsg() {
		Long cur_time = new Date().getTime();
		Iterator<Entry<TopicUnreadMsg, Long>> iterator = msgid_time_map.entrySet().iterator();
		List<TopicUnreadMsg> unreadMsgs = new ArrayList<TopicUnreadMsg>();
		while (iterator.hasNext()) {
			Entry<TopicUnreadMsg, Long> next = iterator.next();
			Long t = next.getValue();
			if (cur_time - t > TIMEOUT) {
				iterator.remove();
				unreadMsgs.add(next.getKey());
			}
		}
		return unreadMsgs;
	}

	/**
	 * 消息收到确认
	 * 
	 * @param msgid
	 */
	public static void confirmMsg(Long userid, Long topicid, Long msgid) {
		Iterator<Entry<TopicUnreadMsg, Long>> iterator = msgid_time_map.entrySet().iterator();
		while (iterator.hasNext()) {
			Entry<TopicUnreadMsg, Long> next = iterator.next();
			TopicUnreadMsg msg = next.getKey();
			Long current_time = new Date().getTime();
			if (msg.getUserid().equals(userid) && msg.getMsgid().equals(msgid) && msg.getTopicid().equals(topicid)
					&& current_time - next.getValue() <= TIMEOUT) {
				iterator.remove();
				logger.info("用户" + userid + "消息确认成功:msgid:" + msgid);
				break;
			}
		}
	}

	/**
	 * 删除用户所有的待确认消息
	 * 
	 * @param args
	 */
	public static void delAllUserzUnreadMsgs(Long userid) {
		Iterator<Entry<TopicUnreadMsg, Long>> iterator = msgid_time_map.entrySet().iterator();
		while (iterator.hasNext()) {
			Entry<TopicUnreadMsg, Long> next = iterator.next();
			TopicUnreadMsg msg = next.getKey();
			if (msg.getUserid().equals(userid)) {
				iterator.remove();
				break;
			}
		}
	}
}
