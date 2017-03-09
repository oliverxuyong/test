package so.xunta.web.initial;

import javax.annotation.PostConstruct;

import org.springframework.stereotype.Controller;

import so.xunta.utils.AnalyzerUtils;

@Controller
public class IKAnalyzerInit {
	
	@SuppressWarnings("static-access")
	@PostConstruct
	public void initExtWord(){
		//读取扩展词
		System.out.println("读取扩展词");
		org.wltea.analyzer.dic.Dictionary.loadExtendWords(AnalyzerUtils.getInstance().getExtWordSet());
	}
	

}
