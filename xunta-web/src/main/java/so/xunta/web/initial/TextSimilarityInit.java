package so.xunta.web.initial;

import javax.annotation.PostConstruct;
import org.springframework.stereotype.Controller;


@Controller
public class TextSimilarityInit {
	
	@PostConstruct
	public void initTextSimilarityInit(){
		//TextSimilarity textSimilarity = new SimpleTextSimilarity();
		//double similarScore = textSimilarity.similarScore("上海不错", "上海很好");
		//System.out.println("相似度测试:"+similarScore);
	}
}
