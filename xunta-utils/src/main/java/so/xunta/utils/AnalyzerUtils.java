package so.xunta.utils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.net.URL;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.wltea.analyzer.IKSegmentation;
import org.wltea.analyzer.Lexeme;

public class AnalyzerUtils {
	  //用来存放停用词的集合  
    static Set<String> stopWordSet = new HashSet<String>(); 
    //扩展词
    static Set<String> extWordSet = new HashSet<String>(); 
    
    
    
    public static Set<String> getStopWordSet() {
		return stopWordSet;
	}


	public static void setStopWordSet(Set<String> stopWordSet) {
		AnalyzerUtils.stopWordSet = stopWordSet;
	}


	public static Set<String> getExtWordSet() {
		return extWordSet;
	}


	public static void setExtWordSet(Set<String> extWordSet) {
		AnalyzerUtils.extWordSet = extWordSet;
	}


	private AnalyzerUtils(){
		BufferedReader StopWordFileBr=null;
		BufferedReader extWordFileBr=null;
		try {
			URL url = this.getClass().getResource("/");
			String classesRoot = URLDecoder.decode(url.getPath().toString(),"UTF-8");
			 InputStreamReader isr = new InputStreamReader(new FileInputStream(new File(classesRoot+"/stopword.dic")));  
			 InputStreamReader isr2 = new InputStreamReader(new FileInputStream(new File(classesRoot+"/extword.dic")));  
			//初如化停用词集  
			//读入停用词文件  
			StopWordFileBr = new BufferedReader(isr);  
			extWordFileBr = new BufferedReader(isr2);  
			String stopWord = null;  
			for(; (stopWord = StopWordFileBr.readLine()) != null;){  
				//if(stopWord.length()==1){//只读入单个停用词
					stopWordSet.add(stopWord);
				//}
			}
			for(; (stopWord = extWordFileBr.readLine()) != null;){  
				extWordSet.add(stopWord);
			}
			
		} catch (IOException e) {
			e.printStackTrace();
		}  finally{
			try {
				StopWordFileBr.close();
				extWordFileBr.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		}
    };
    
    private static AnalyzerUtils instance = new AnalyzerUtils();
    
    public static AnalyzerUtils getInstance(){
    	return instance;
    }
    
	
	public  List<String> filterStopWords(String str,List<String> filterdWords){
		StringReader reader = new StringReader(str);
		IKSegmentation ik=new IKSegmentation(reader, false);//智能分词    
		Lexeme lex = new Lexeme(0, 0, 0, 0);
		List<String> wordList = new ArrayList<String>();
		try{
			while((lex=ik.next())!=null){
				   //去除停用词  
	            /*if(stopWordSet.contains(lex.getLexemeText())) {  
	            	filterdWords.add(lex.getLexemeText());
	                continue;  
	            }  */
				wordList.add(lex.getLexemeText());
			}
		}catch(IOException e){
			e.printStackTrace();
		}
		return wordList;
	}
	public  List<String> filterStopWords(String str){
		StringReader reader = new StringReader(str);
		IKSegmentation ik=new IKSegmentation(reader, true);//智能分词    
		Lexeme lex = new Lexeme(0, 0, 0, 0);
		List<String> wordList = new ArrayList<String>();
		try{
			while((lex=ik.next())!=null){
				//去除停用词  
				if(stopWordSet.contains(lex.getLexemeText())) {  
					continue;  
				}  
				wordList.add(lex.getLexemeText());
			}
		}catch(IOException e){
			e.printStackTrace();
		}
		return wordList;
	}
}
