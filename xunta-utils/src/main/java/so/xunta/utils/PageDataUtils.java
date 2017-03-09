package so.xunta.utils;

import java.util.ArrayList;
import java.util.List;

public class PageDataUtils {
	//对List进行分页
	/**
	 * @param datas 传入的数据
	 * @param page 第多少页
	 * @param pagenum 页面多少条数据
	 * @return
	 */
	public static <T> List<T> getPageData(final List<T> datas,int page,int pagenum)
	{
		if(datas==null)
		{
			System.out.println("warning:数组为null");
			return new ArrayList<T>();
		}
		int total = datas.size();
		int fromindex = (page-1)*pagenum;
		int endindex = page*pagenum;
		/*
		 * 
		 *  0    --------------------------- size 
			 fromindex   endindex 
			 fromindex                               endindex 
			                                      fromindex endindex
		 */
		List<T> ret = new ArrayList<T>();
		if(fromindex <= total)
		{
			if(endindex >= total)
			{
				ret = datas.subList(fromindex, total);
			}
			else{
				ret = datas.subList(fromindex, endindex);
			}
		}
		return ret;
	}

	
	//对jsonArray进行分页
	
	
	public static void main(String[] args) {
		List<Integer> nums = new ArrayList<>();
		for(int i = 1;i<25;i++)
		{
			nums.add(i);
		}
		
		for(int i = 1;i<10;i++)
		{
			List<Integer> pagedata = getPageData(nums, i, 10);
			System.out.println(pagedata.toString());
		}
		
	}
	
	
}



























