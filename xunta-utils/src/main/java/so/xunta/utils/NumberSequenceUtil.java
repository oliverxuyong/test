package so.xunta.utils;

public class NumberSequenceUtil {
	private static int startIndex = 0;
	
	public static int getIndex(){
		int returnIndex = startIndex;
		startIndex = startIndex + 200;
		if(startIndex > 4000){
			startIndex = 0;
			returnIndex = 0;
		}
		return returnIndex;
	}
}
