package so.xunta.web.controller;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;

import so.xunta.utils.IdWorker;


@Controller
public class ManagerController {
	
	IdWorker idWorder = new IdWorker(1L, 1L);	
	/** 
	 * 转义正则特殊字符 （$()*+.[]?\^{},|） 
	 *  
	 * @param keyword 
	 * @return 
	 */  
	public static String escapeExprSpecialWord(String keyword) {  
	    if (StringUtils.isNotBlank(keyword)) {  
	        String[] fbsArr = { "\\", "$", "(", ")", "*", "+", ".", "[", "]", "?", "^", "{", "}", "|","'" ,":","!","-"};  
	        for (String key : fbsArr) {  
	            if (keyword.contains(key)) {  
	                keyword = keyword.replace(key, "\\" + key);  
	            }  
	        }  
	    }  
	    return keyword;  
	} 
	
}
