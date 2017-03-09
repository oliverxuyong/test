package so.xunta.utils;

import java.util.List;
/**
 * 过滤不符合条 件的搜索
 * @author Thinkpad
 *
 */
public class FilterBadSearch {
	/**
	 * true 符合，false不符合应过滤掉
	 * @param analyzedwords
	 * @param content
	 * @return
	 */
	public static boolean check(List<String> analyzedwords,String content){
		//统计一个字的多少个 //两个字以上的多少个
		int total_num = 0;
		int count_one = 0;
		int count_double = 0;
		if(analyzedwords==null){
			throw new RuntimeException("analyzedwords 为空");
		}
		for(String str:analyzedwords)
		{
			if(str.length()>1){
				count_double++;
			}else{
				count_one++;
			}
		}
		total_num = count_double+count_one;
		
		//如果总共就一个词并符合条 件
		if(total_num == 1){
			return true;
		}
		
		//全为单字 spanOr(a,b)>>>>
		if(total_num == count_one){
			for(int i = 0;i<analyzedwords.size()-1;i++){
				String w2 = analyzedwords.get(i)+analyzedwords.get(i+1);
				int indexOf = content.indexOf(w2);
				if(indexOf!=-1){
					return true;
				}
			}
		}else{//有单字有双字
			//首先判断双字是否命中
			for(String str:analyzedwords)
			{
				if(str.length()>1&&content.indexOf(str)!=-1){
					return true;
				}
			}
			//判断相邻的单字是否命中
			for(int i = 0;i<total_num-1;i++)
			{
				String w1 = analyzedwords.get(i);
				String w2 = analyzedwords.get(i+1);
				if(w1.length()==1&&w2.length()==1)
				{
					if(content.indexOf(w1+w2)!=-1){
						return true;
					}
				}
			}
		}
		
		return false;
	}
}
