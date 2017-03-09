package so.xunta.mytest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class MyTest {

	public static void main(String[] args) {
		Map<Long,List<Long>> ms = new HashMap<Long,List<Long>>();
		List<Long> nums = new ArrayList<Long>();
		nums.add(1L);
		nums.add(2L);
		ms.put(10L, nums);
		
		if(ms.containsKey(10L))
		{
			ms.get(10L).add(1000L);
		}
		
		
		List<Long> temps = ms.get(10L);
		for(Long l:temps)
		{
			System.out.println("l:"+l);
		}
	}
}
