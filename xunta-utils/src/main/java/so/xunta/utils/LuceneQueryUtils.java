package so.xunta.utils;

import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashSet;

import java.util.List;
import java.util.Set;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.TokenStream;
import org.apache.lucene.analysis.tokenattributes.CharTermAttribute;
import org.apache.lucene.index.Term;

import org.apache.lucene.search.BooleanClause.Occur;
import org.apache.lucene.search.spans.SpanNearQuery;
import org.apache.lucene.search.spans.SpanOrQuery;
import org.apache.lucene.search.spans.SpanQuery;
import org.apache.lucene.search.spans.SpanTermQuery;
import org.apache.lucene.search.BooleanQuery;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.TermQuery;
import org.wltea.analyzer.lucene.IKAnalyzer;


import com.hankcs.hanlp.HanLP;
import com.hankcs.hanlp.seg.Segment;

public class LuceneQueryUtils {
	static final String[] buy_words = { "买", "购", "采办", "置备" };
	static final String[] sell_words = { "卖", "售", "销" };

	/**
	 * 将phrase boolean query 连结在一起
	 * 
	 * @param field
	 * @param keyWords
	 * @return
	 */
	public static Query createPhraseBooleanQuery2(String field, String keyWord) {

		// 过滤 * ? /
		if (keyWord != null) {
			keyWord = keyWord.replace("*", "").replace("?", "");
		}

		if (keyWord == null || "".equals(keyWord.trim())) {
			return null;
		}

		IKAnalyzer analyzer = new IKAnalyzer();

		List<String> terms = new ArrayList<String>();
		TokenStream tokenStream = analyzer.tokenStream(field, new StringReader(keyWord));
		tokenStream.addAttribute(CharTermAttribute.class);
		try {
			while (tokenStream.incrementToken()) {
				CharTermAttribute attribute = tokenStream.getAttribute(CharTermAttribute.class);
				String term = attribute.toString();
				if (EnglishOrChinese.isEnglish(term)) {
					terms.add(term);
				} else {
					if (term.length() > 1) {
						terms.add(term);
					}
				}

				// terms.add(term);
			}
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} finally {
			analyzer.close();
		}

		if (terms.size() == 0) {
			return null;
		}

		BooleanQuery booleanQuery = new BooleanQuery();
		for (String t : terms) {
			TermQuery termQuery = new TermQuery(new Term(field, t));
			booleanQuery.add(termQuery, Occur.SHOULD);
		}

		return booleanQuery;

		/*
		 * QueryParser queryParser = new
		 * QueryParser(Version.LUCENE_35,field,analyzer);
		 * 
		 * Query query = null; try { query = queryParser.parse(keyWord); } catch
		 * (ParseException e) { e.printStackTrace(); } return query;
		 */
	}

	public static Query createPhraseBooleanQuery(String field, String keyWord) {

		// return createRecommendQuery_v2(field, keyWord);
		return createSpanOrQuery(field, keyWord);

	}

	public static Query createBolleanTermQuery(String field, String keyWord) {
		// 过滤 * ? /
		if (keyWord != null) {
			keyWord = keyWord.replace("*", "").replace("?", "");
		}

		if (keyWord == null || "".equals(keyWord.trim())) {
			return null;
		}

		List<String> terms = getAnalyzedWords(field, keyWord);

		if (terms.size() == 0) {
			return null;
		}

		
		BooleanQuery booleanQuery = new BooleanQuery();
		for (String t : terms) {
			
			TermQuery termQuery = new TermQuery(new Term(field, t));
			booleanQuery.add(termQuery, Occur.SHOULD);
		}

		return booleanQuery;
	}

	public static List<String> getAnalyzedWords(String field, String keyWord) {
		IKAnalyzer analyzer = new IKAnalyzer();

		List<String> terms = new ArrayList<String>();
		TokenStream tokenStream = analyzer.tokenStream(field, new StringReader(keyWord));
		tokenStream.addAttribute(CharTermAttribute.class);
		String[] de = new String[] { "的", "地", "得" };
	
		try {
			while (tokenStream.incrementToken()) {
				CharTermAttribute attribute = tokenStream.getAttribute(CharTermAttribute.class);
				String term = attribute.toString();
				
				boolean flag = false;
				for (String s : de) {
					if (s.equals(term)) {
						flag = true;
						break;
					}
				}
				if (flag) {
					continue;
				}
				terms.add(term);
			}
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} finally {
			analyzer.close();
		}
		
		//检查所有的term中是否全为单字
		boolean all_oneword = true;
		for(String term:terms)
		{
			if(term.length()>1)
			{
				all_oneword = false;
				break;
			}
		}
		
		List<String> words = new ArrayList<String>();
		if(!all_oneword){
			//取出已经出现在某个分词中的单字
			for(int i = 1;i<terms.size();i++){
				String ti = terms.get(i);//取出的单词
				if(ti.length()==1){
					for(int j = 0;j<i;j++){
						String tj = terms.get(j);
						if(tj.indexOf(ti)!=-1){
							//包含关系
							words.add(ti);
							break;
						}
					}
				}
				
			}
		}
		
		//从terms中删除包含words的词
		terms.removeAll(words);
		
		return terms;
	}

	private static Query createSpanOrQuery(String field, String keyWord) {

		// 过滤 * ? /
		if (keyWord != null) {
			keyWord = keyWord.replace("*", "").replace("?", "");
		}

		if (keyWord == null || "".equals(keyWord.trim())) {
			return null;
		}

		IKAnalyzer analyzer = new IKAnalyzer();

		List<String> terms = new ArrayList<String>();
		TokenStream tokenStream = analyzer.tokenStream(field, new StringReader(keyWord));
		tokenStream.addAttribute(CharTermAttribute.class);
		try {
			while (tokenStream.incrementToken()) {
				CharTermAttribute attribute = tokenStream.getAttribute(CharTermAttribute.class);
				String term = attribute.toString();
				// 去除　的　地　得
				String[] de = new String[] { "的", "地", "得" };
				boolean flag = false;
				for (String s : de) {
					if (s.equals(term)) {
						flag = true;
						break;
					}
				}
				if (flag) {
					continue;
				}

				if (terms.contains(term)) {

				} else {
					terms.add(term);
				}
			}
		} catch (IOException e1) {
			e1.printStackTrace();
		} finally {
			analyzer.close();
		}

		if (terms.size() == 0) {
			return null;
		}

		// 分词只有一个返回一个termQuery
		if (terms.size() == 1) {
			TermQuery t = new TermQuery(new Term(field, terms.get(0)));
			System.out.println("1个词:" + t);
			return t;
		} else if (terms.size() == 2) {
			// 两个关键词　返回一个nearquery 间隔5
			SpanTermQuery sqa = new SpanTermQuery(new Term(field, terms.get(0)));
			SpanTermQuery sqb = new SpanTermQuery(new Term(field, terms.get(1)));
			SpanNearQuery spanNearQuery = new SpanNearQuery(new SpanQuery[] { sqa, sqb }, 2, true);
			System.out.println("2个词:" + spanNearQuery);
			return spanNearQuery;
		} else if (terms.size() == 3) {
			// 两个关键词　返回一个nearquery 间隔5
			SpanTermQuery sqa = new SpanTermQuery(new Term(field, terms.get(0)));
			SpanTermQuery sqb = new SpanTermQuery(new Term(field, terms.get(1)));
			SpanTermQuery sqc = new SpanTermQuery(new Term(field, terms.get(2)));
			SpanNearQuery a_n_b = new SpanNearQuery(new SpanQuery[] { sqa, sqb }, 2, true);
			SpanNearQuery b_n_c = new SpanNearQuery(new SpanQuery[] { sqb, sqc }, 2, true);
			SpanOrQuery or = new SpanOrQuery(new SpanQuery[] { a_n_b, b_n_c });
			System.out.println("3个词:" + or);
			return or;
		} else if (terms.size() > 3) {
			// 去除单个字

			List<SpanTermQuery> spanTermQuerys = new ArrayList<SpanTermQuery>();
			for (int i = 0; i < terms.size(); i++) {
				SpanTermQuery spanTermQuery = new SpanTermQuery(new Term(field, terms.get(i)));
				spanTermQuerys.add(spanTermQuery);
			}
			List<SpanNearQuery> snqs = new ArrayList<SpanNearQuery>();
			for (int i = 0; i < spanTermQuerys.size() - 1; i++) {
				SpanNearQuery a_n_b = new SpanNearQuery(new SpanQuery[] { spanTermQuerys.get(i),
						spanTermQuerys.get(i + 1) }, 2, true);
				snqs.add(a_n_b);
			}

			SpanQuery[] arrs = new SpanQuery[snqs.size()];
			for (int i = 0; i < snqs.size(); i++) {
				arrs[i] = snqs.get(i);
			}
			SpanOrQuery or = new SpanOrQuery(arrs);

			// mergeSpanOrQueries(ors);

			System.out.println("查询的or" + or);

			return or;

		}

		return null;
	}

	public static Query createSpanOrQuery_bak(String field, String keyWord) {

		// 过滤 * ? /
		if (keyWord != null) {
			keyWord = keyWord.replace("*", "").replace("?", "");
		}

		if (keyWord == null || "".equals(keyWord.trim())) {
			return null;
		}

		IKAnalyzer analyzer = new IKAnalyzer();

		List<String> terms = new ArrayList<String>();
		TokenStream tokenStream = analyzer.tokenStream(field, new StringReader(keyWord));
		tokenStream.addAttribute(CharTermAttribute.class);
		try {
			while (tokenStream.incrementToken()) {
				CharTermAttribute attribute = tokenStream.getAttribute(CharTermAttribute.class);
				String term = attribute.toString();
				// 去除　的　地　得
				String[] de = new String[] { "的", "地", "得" };
				boolean flag = false;
				for (String s : de) {
					if (s.equals(term)) {
						flag = true;
						break;
					}
				}
				if (flag) {
					continue;
				}

				if (terms.contains(term)) {

				} else {
					terms.add(term);
				}
			}
		} catch (IOException e1) {
			e1.printStackTrace();
		} finally {
			analyzer.close();
		}

		if (terms.size() == 0) {
			return null;
		}

		// 分词只有一个返回一个termQuery
		if (terms.size() == 1) {
			TermQuery t = new TermQuery(new Term(field, terms.get(0)));
			System.out.println("1个词:" + t);
			return t;
		} else if (terms.size() == 2) {
			// 两个关键词　返回一个nearquery 间隔5
			SpanTermQuery sqa = new SpanTermQuery(new Term(field, terms.get(0)));
			SpanTermQuery sqb = new SpanTermQuery(new Term(field, terms.get(1)));
			SpanOrQuery spanNearQuery = new SpanOrQuery(new SpanQuery[] { sqa, sqb });
			System.out.println("2个词:" + spanNearQuery);
			return spanNearQuery;
		} else if (terms.size() == 3) {
			// 两个关键词　返回一个nearquery 间隔5
			SpanTermQuery sqa = new SpanTermQuery(new Term(field, terms.get(0)));
			SpanTermQuery sqb = new SpanTermQuery(new Term(field, terms.get(1)));
			SpanTermQuery sqc = new SpanTermQuery(new Term(field, terms.get(2)));
			SpanOrQuery a_n_b = new SpanOrQuery(new SpanQuery[] { sqa, sqb });
			SpanOrQuery b_n_c = new SpanOrQuery(new SpanQuery[] { sqb, sqc });
			SpanOrQuery or = new SpanOrQuery(new SpanQuery[] { a_n_b, b_n_c });
			System.out.println("3个词:" + or);
			return or;
		} else if (terms.size() > 3) {
			// 去除单个字

			List<SpanTermQuery> spanTermQuerys = new ArrayList<SpanTermQuery>();
			for (int i = 0; i < terms.size(); i++) {
				SpanTermQuery spanTermQuery = new SpanTermQuery(new Term(field, terms.get(i)));
				spanTermQuerys.add(spanTermQuery);
			}
			List<SpanNearQuery> snqs = new ArrayList<SpanNearQuery>();
			for (int i = 0; i < spanTermQuerys.size() - 1; i++) {
				SpanNearQuery a_n_b = new SpanNearQuery(new SpanQuery[] { spanTermQuerys.get(i),
						spanTermQuerys.get(i + 1) }, 2, true);
				snqs.add(a_n_b);
			}

			SpanQuery[] arrs = new SpanQuery[snqs.size()];
			for (int i = 0; i < snqs.size(); i++) {
				arrs[i] = snqs.get(i);
			}
			SpanOrQuery or = new SpanOrQuery(arrs);

			// mergeSpanOrQueries(ors);

			System.out.println("查询的or" + or);

			return or;

		}

		return null;
	}

	/**
	 * 将ors在大小合并到等于1
	 * 
	 * @param ors
	 */
	public static void mergeSpanOrQueries(List<SpanOrQuery> ors) {
		while (ors.size() > 1) {
			List<SpanOrQuery> ors_new = new ArrayList<SpanOrQuery>();
			for (int i = 0; i < ors.size() - 1; i++) {
				SpanOrQuery or = new SpanOrQuery(new SpanQuery[] { ors.get(i), ors.get(i + 1) });
				System.out.println("合并：" + or);
				ors_new.add(or);
			}
			ors = ors_new;
		}

	}

	/**
	 * 匹配程度较高,推荐时使用
	 * 
	 * @param fieldName
	 * @param keyWords
	 * @return
	 */
	public static Query createRecommendQuery(String fieldName, String keyword) {
		/*
		 * //过滤 * ? / if(keyword!=null){ keyword =
		 * keyword.replace("*","").replace("?",""); } List<String> words =
		 * AnalyzerUtils.getInstance().filterStopWords(keyword); if(words!=null)
		 * { Iterator<String> iterator = words.iterator();
		 * if(iterator.hasNext()) { String next = iterator.next();
		 * if(next.length()<2){ iterator.remove(); } } }
		 * if(words==null||words.size()==0){ return null; }
		 * 
		 * BooleanQuery booleanQuery = new BooleanQuery(); for(String
		 * word:words){ TermQuery termquery = new TermQuery(new
		 * Term(fieldName,word)); booleanQuery.add(termquery, Occur.SHOULD); }
		 * return booleanQuery;
		 */
		return createSpanOrQuery(fieldName, keyword);
	}

	public static Query createRecommendQuery_v2(String fieldName, String keyword) throws IOException {
		// 过滤 * ? /
		if (keyword != null) {
			keyword = keyword.replace("*", "").replace("?", "");
		}

		// 提取名词
		// 地名识别
		Set<String> dile_names = new HashSet<String>();
		Segment segment = HanLP.newSegment().enablePlaceRecognize(true);
		List<com.hankcs.hanlp.seg.common.Term> termList = segment.seg(keyword);
		for (com.hankcs.hanlp.seg.common.Term t : termList) {
			if (t.nature.name().equals("ns")) {
				dile_names.add(t.word);
			}
		}

		// 提取停用词
		List<String> stopWords = new ArrayList<String>();
		AnalyzerUtils.getInstance().filterStopWords(keyword, stopWords);

		Analyzer analyzer = new IKAnalyzer();
		List<String> words = new ArrayList<String>();
		TokenStream tokenStream = analyzer.tokenStream("content", new StringReader(keyword));
		tokenStream.addAttribute(CharTermAttribute.class);
		while (tokenStream.incrementToken()) {
			CharTermAttribute attribute = tokenStream.getAttribute(CharTermAttribute.class);
			String word = attribute.toString();
			if (!words.contains(word)) {
				words.add(word);
			}

		}

		BooleanQuery booleanQuery = new BooleanQuery();
		for (String word : words) {
			TermQuery termQuery = new TermQuery(new Term(fieldName, word));
			if (dile_names.contains(word)) {
				termQuery.setBoost(100);
			} else {
				if (stopWords.contains(word)) {
					termQuery.setBoost(10);
				} else {
					termQuery.setBoost(25);
				}
			}

			booleanQuery.add(termQuery, Occur.SHOULD);
		}
		analyzer.close();
		System.out.println(booleanQuery.toString());
		return booleanQuery;
	}

	public static String filterSellWords(String keyword) {
		for (String w : sell_words) {
			keyword = keyword.replace(w, "");
		}
		return keyword;
	}

	public static String filterBuyWords(String keyword) {

		for (String w : buy_words) {
			keyword = keyword.replace(w, "");
		}
		return keyword;
	}

	public static BooleanQuery createBuyBooleanQuery(String fieldName) {
		BooleanQuery booleanQuery = new BooleanQuery();
		for (String word : buy_words) {
			booleanQuery.add(new TermQuery(new Term(fieldName, word)), Occur.SHOULD);
		}
		return booleanQuery;
	}

	public static BooleanQuery createSellBooleanQuery(String fieldName) {
		BooleanQuery booleanQuery = new BooleanQuery();
		for (String word : sell_words) {
			booleanQuery.add(new TermQuery(new Term(fieldName, word)), Occur.SHOULD);
		}
		return booleanQuery;
	}
}
