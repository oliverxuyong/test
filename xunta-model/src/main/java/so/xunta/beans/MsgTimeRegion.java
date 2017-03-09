package so.xunta.beans;

/**
 * 用于封装一个闭区间  [starttime,endtime]
 * 可以查询一个话题　与　另一个话题挂的一系列时间段
 * 然后可以从挂的话题上　提取该时间段内的消息
 * @author Thinkpad
 *
 */
public class MsgTimeRegion {
	public Long topicid;
	public Long starttime = Long.MIN_VALUE;
	public Long endtime = Long.MAX_VALUE;
	public MsgTimeRegion() {
		super();
	}
	public MsgTimeRegion(Long topicid, Long starttime, Long endtime) {
		super();
		this.topicid = topicid;
		this.starttime = starttime;
		this.endtime = endtime;
	}
	@Override
	public String toString() {
		return "topicid:"+topicid+"  starttime:"+starttime+" endtime:"+endtime;
	}
	
}
