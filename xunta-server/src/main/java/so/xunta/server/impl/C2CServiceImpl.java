package so.xunta.server.impl;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import so.xunta.beans.ConcernPointDO;
import so.xunta.persist.C2cDao;
import so.xunta.persist.ConcernPointDao;
import so.xunta.persist.TagChoiceDao;
import so.xunta.persist.WeiboTagDao;
import so.xunta.server.C2CService;

@Service
public class C2CServiceImpl implements C2CService {
	@Autowired
	private ConcernPointDao concernPointDao;
	@Autowired
	private C2cDao c2cDao;
	@Autowired
	private TagChoiceDao tagChoiceDao;
	@Autowired
	private WeiboTagDao weiboTagDao;
	
	Logger logger =Logger.getLogger(C2CServiceImpl.class);
	
	@Override
	public void initC2C() {
		List<String> meanlessTags = tagChoiceDao.getTopChoiceTags();
		List<String> tags = weiboTagDao.getAllTags();
		logger.info("获取到"+tags.size()+"个Tag，开始遍历");
		int loop =1;
		for(String tag:tags){
			if(meanlessTags.contains(tag)){continue;}
			long choiceNum=tagChoiceDao.getTagChoice(tag).getChoice();
			int magnitude = 0;
			
			if(choiceNum >= 500){
				magnitude = 3;
			}else if(choiceNum >= 50){
				magnitude = 2;
			}else if(choiceNum >= 10){
				magnitude = 1;
			}
			Map<String,Double> relateTags= weiboTagDao.getRelateTags(tag, magnitude);
			logger.info(tag+"查询完毕");
			Map<String,String> relateTagIds = new HashMap<String,String>();
			for(Entry<String,Double> relateTag:relateTags.entrySet()){
				String tagText = relateTag.getKey();
				ConcernPointDO relateCP = concernPointDao.getConcernPointByText(tagText);
				if(relateCP == null){
					relateCP = insertCp(tagText);
				}
				relateTagIds.put(relateCP.getId().toString(), relateTag.getValue().toString());
			}
			
			ConcernPointDO tagCP = concernPointDao.getConcernPointByText(tag);
			if(tagCP == null){
				tagCP = insertCp(tag);
			}
			c2cDao.setCpRelateCps(tagCP.getId().toString(), relateTagIds);
			logger.info("第"+loop+"个Tag初始化完成");
			loop++;
		}
	}
	
	private ConcernPointDO insertCp(String cpText){
		ConcernPointDO cp = new ConcernPointDO();
		cp.setCreator_uid(new Long(1));
		cp.setType("general");
		cp.setWeight(new BigDecimal(1.0));
		cp.setText(cpText);
		Timestamp current = new Timestamp(System.currentTimeMillis());
		cp.setCreate_time(current);
		cp.setModified_time(current);
		cp = concernPointDao.saveConcernPoint(cp);
		return cp;
	}

}
