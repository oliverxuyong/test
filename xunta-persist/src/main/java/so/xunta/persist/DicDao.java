package so.xunta.persist;

public interface DicDao {
	//获取某个字典的值
	public String getValue(String key);
	
	//更新字典的值
	public void updateValue(String key,String newValue);
	
	//添加值
	public void addValue(String key,String value);
}
