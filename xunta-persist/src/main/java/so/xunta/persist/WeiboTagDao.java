package so.xunta.persist;

import java.util.List;

import so.xunta.beans.WeiboTag;

public interface WeiboTagDao {
	//2018.03.26 叶夷 遍历获得微博标签的所有的name
	public List<WeiboTag> queryAllName();
	//2018.03.26 叶夷 通过name获得其对应的标签
	public List<WeiboTag> queryTextFromName(String name);
}
