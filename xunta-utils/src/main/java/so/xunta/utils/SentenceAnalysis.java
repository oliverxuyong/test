package so.xunta.utils;

public class SentenceAnalysis {
	public  static int analysis_stentence_class(String sentence) {
		//分析句子是否是买卖信息
		String[] buy_words = {"买","购","采办","置备"};
		String[] sell_words = {"卖","售","销"};
		int flag = 0;	//非买卖
		for(String word:buy_words){
			if(sentence.contains(word)){
				flag = 1;//代表买
			}
		}
		
		for(String word:sell_words)
		{
			if(sentence.contains(word))
			{
				if(flag == 1){
					flag = 0;
				}else{
					flag = 2;//代表卖
				}
			}
		}
		return flag;
	}
}
