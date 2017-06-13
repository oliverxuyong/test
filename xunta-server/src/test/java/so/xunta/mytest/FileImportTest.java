package so.xunta.mytest;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import so.xunta.utils.dataimport.HelpDB;

/**
 * 用于excel的CP标签导入数据库
 * @author Bright_Zheng 
 * */
public class FileImportTest {

	public static void main(String[] args) throws InvalidFormatException, IOException, SQLException {
		String path = "C:\\Users\\aigine\\Downloads\\wolf测试标签.xlsx";
		
		OPCPackage pkg = OPCPackage.open(path);
		
		XSSFWorkbook xwb = new XSSFWorkbook(pkg);
		
		//哪张表
		XSSFSheet sheet = xwb.getSheet("Sheet1");
		//数据行范围
		int x[] = new int[]{1,23};
		//数据列范围
		int y[] = new int[]{'A','J'};
		
		//数据
		String[] data = new String[10];
		
		System.out.println("行："+(x[1]-x[0]+1));
		System.out.println("列："+(y[1]-y[0]+1));
		
		String sql="insert into concern_point(creator_uid,text,widget,gmt_create,gmt_modified) values (?,?,?,?,?)";
		PreparedStatement pstmt = HelpDB.getstance().getConn("wolf").prepareStatement(sql);
		
		
		for (int i = x[0]-1; i < x[1]; i++) {
			XSSFRow row_cells = sheet.getRow(i);//得到第i行
			for (int j = y[0]-'A'; j <= y[1]-'A'; j++) {//得到第j列
				XSSFCell cell=row_cells.getCell(j);
				if(cell!=null){
					pstmt.setLong(1,new Long((long)1));//默认创建者为管理员
					pstmt.setString(2, cell+"");
					pstmt.setBigDecimal(3,new BigDecimal(1.0));
					pstmt.setTimestamp(4,new Timestamp(System.currentTimeMillis()));
					pstmt.setTimestamp(5,new Timestamp(System.currentTimeMillis()));
					pstmt.executeUpdate();
				}
			}
		}
		pstmt.close();
	}

}
