package so.xunta.mytest;

import java.util.HashSet;
import java.util.Set;

public class MyTest {

	public static void main(String[] args) {
		Set<String> set1 = new HashSet<String>();
		Set<String> set2;
		Set<String> set3 = new HashSet<String>();
		
		set1.add("1");
		set1.add("2");
		set1.add("3");
		
		set3.add("1");
		set3.add("2");
		
		set2=set1;
	//	set1.removeAll(set3);
		
		set3.addAll(set1);
		
		for(String s:set1){
			System.out.println("set1:"+s);
		}
		
		for(String s:set2){
			System.out.println("set2:"+s);
		}
		for(String s:set3){
			System.out.println("set3:"+s);
		}
	}
}
