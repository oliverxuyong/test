package so.xunta.task;

import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import javax.annotation.PostConstruct;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import so.xunta.beans.TopicUnreadMsg;
import so.xunta.beans.TopicUnreadMsgQueue;
import so.xunta.persist.TopicHasUnreadMsgNumDao;
import so.xunta.persist.TopicUnreadMsgDao;
import so.xunta.utils.DateTimeUtils;

@Component
public class SaveUnreadMsgsTask extends TimerTask{

	private Timer timer = new Timer();
	
	Logger logger = Logger.getLogger(this.getClass());
	
	@Autowired
	private TopicUnreadMsgDao unreadMsgDao;
	
	@Autowired
	private TopicHasUnreadMsgNumDao userHasUnreadMsgTopicDao;
	
	@Override
	public void run() {
		List<TopicUnreadMsg> unreadMsgs = TopicUnreadMsgQueue.popUnreadMsg();
		if(unreadMsgs.size()>0){
			logger.info("执行任务保存未读消息数:"+unreadMsgs.size()+"   "+DateTimeUtils.getCurrentTimeStr());
			Long startLong = System.currentTimeMillis();
			unreadMsgDao.addUnreadMsgs(unreadMsgs);
			for(TopicUnreadMsg um:unreadMsgs)
			{
				userHasUnreadMsgTopicDao.increaseUnreadMsgNumbyOne(um.getUserid(), um.getTopicid());
			}
			Long endLong = System.currentTimeMillis();
			System.out.println("耗时:"+(endLong-startLong)+"  ms");
		}
	}
	
	@PostConstruct
	public void executeTask(){
		timer.schedule(this, 1000,500);
	}

}
