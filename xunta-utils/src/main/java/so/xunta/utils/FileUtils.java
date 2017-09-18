package so.xunta.utils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

import org.apache.log4j.Logger;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.JSONArray;
import org.json.JSONObject;

public class FileUtils {
	
	static String publictopic = "别人在说啥";
    static Logger logger = Logger.getRootLogger();
	
	public static String readStrFromFile(String filepath) {
		File file = new File(filepath);
		StringBuffer sb = new StringBuffer();
		try {
			BufferedReader reader = new BufferedReader(new FileReader(file));
			String line = reader.readLine();
			while (line != null) {
				sb.append(line);
				line = reader.readLine();
			}
			reader.close();
		} catch (FileNotFoundException e) {
			logger.error(e.getMessage(), e);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage(), e);
		}
		return sb.toString();
	}


	public static JSONObject readJSONFromXLS(String filepath) throws InvalidFormatException, IOException {
		String path = filepath;//"C:\\Users\\Thinkpad\\Desktop\\寻TA预设话题.xlsx";
		
		OPCPackage pkg = OPCPackage.open(path);
		
		XSSFWorkbook xwb = new XSSFWorkbook(pkg);
		
		//哪张表
		XSSFSheet sheet = xwb.getSheet("Sheet1");
		//数据行范围
		int x[] = new int[]{1,103};
		//数据列范围
		int y[] = new int[]{'A','P'};
		
		//数据
		String data[][] = new String[x[1]-x[0]+1][y[1]-y[0]+1];
		
		System.out.println("行："+(x[1]-x[0]+1));
		System.out.println("列："+(y[1]-y[0]+1));
		
		for (int i = x[0]-1; i < x[1]; i++) {
			XSSFRow row_cells = sheet.getRow(i);//得到第i行
			for (int j = y[0]-'A'; j < y[1]-'A'+1; j++) {//得到第j列
				data[i-x[0]+1][j-y[0]+'A']=row_cells.getCell(j)+"";
			}
		}
		
		//System.out.println("========================================================");
		String topics[] = getTopics(data, 7, 'B');
		int topicNumber[] = getTopicNumber(data,7,'A');
		String topicGroupNames[] = getTopicGroups(data,2,'C');
		int[][] marks = getmarkdatas(data, 7, 'C');
		
		System.out.println("marks rows:"+marks.length+"  columns:"+marks[0].length);
		System.out.println("topicNumbers:"+topicNumber.length);
		System.out.println("topicGroupNames:"+topicGroupNames.length);
		
		//生成目标json数据
		JSONObject json_from_xls = new JSONObject();
		for(int i=1;i<topicGroupNames.length;i++){
			String topicGroupName = topicGroupNames[i];//话题组名
			JSONArray arr = new JSONArray();
			//获取话题组下的话题及话题编号,是否是大厅
			for(int k = 0;k<marks.length;k++){
				if(marks[k][i]==1){
					JSONObject obj = new JSONObject();
					obj.put("number",topicNumber[k]);
					obj.put("topic", topics[k]);
					obj.put("isDating",marks[k][0]);
					arr.put(obj);
				}
			}
			json_from_xls.put(topicGroupName,arr);
		}
	
		//System.out.println(json_from_xls.toString(2));
		pkg.revert();
		return json_from_xls;
	}
	
	public static void main(String[] args) throws InvalidFormatException, IOException {
		JSONObject obj = readJSONFromXLS("/home/yifabao/Documents/topics_preset.xlsx");
		System.out.println(obj.toString(2));
	}


	//获取话题
	public static String[] getTopics(String[][] data,int start_row,int start_column){
		String topics[] = new String[data.length-start_row+1];
		for(int i = start_row-1;i<data.length;i++){
			topics[i-start_row+1]=data[i][start_column-'A'];
		}
		return topics;
	}
	
	//获取话题编号
	public static int[] getTopicNumber(String[][] data,int start_row,int start_column){
		int topicnumbers[] = new int[data.length-start_row+1];
		for(int i = start_row-1;i<data.length;i++){
			topicnumbers[i-start_row+1]=(int) Float.parseFloat(data[i][start_column-'A']);
		}
		return topicnumbers;
	}
	
	//获取话题组
	public static String[] getTopicGroups(String[][] data,int start_row,int start_column){
		String groups[] = new String[data[0].length-(start_column-'A')];
		String temp[] = data[start_row-1];
		for(int j = start_column-'A';j<data[0].length;j++){
			groups[j-start_column+'A'] = temp[j]; 
		}
		return groups;
	}
	
	//获取数据区
	public static int[][] getmarkdatas(String[][] data,int start_row,int start_column){
		int[] x= {start_row-1,data.length};
		int[] y = {start_column-'A',data[0].length};
		int[][] markdatas = new int[x[1]-x[0]][y[1]-y[0]];
		for(int i = x[0];i<x[1];i++){
			for(int j=y[0];j<y[1];j++){
				String temp = data[i][j];
				markdatas[i-x[0]][j-y[0]]=((temp!=null&&("*".equals(temp.trim())))?1:0);
			}
		}
		return markdatas;
	}
	
}
