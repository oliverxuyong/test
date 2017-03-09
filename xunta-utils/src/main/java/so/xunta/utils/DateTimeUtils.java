package so.xunta.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateTimeUtils {

	public static String getCurrentTimeStr()
	{
		
		Date date=new Date();
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return sdf.format(date);
	}
	public static String getTimeStrFromDate(Date date)
	{
		
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return sdf.format(date);
	}
	
	/**
	 * 字符串日期时间转Date对象,注意字符串格式必须为yyyy-MM-dd HH:mm:ss
	 * @param dateTime
	 * @return
	 * @throws ParseException
	 */
	public static Date getCurrentDateTimeObj(String dateTime) throws ParseException
	{

		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return sdf.parse(dateTime);
	}
	
	//返回　年－月－日
	public static String getBirthdayFormatStr(Date date){
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
		return sdf.format(date);
	}
	
	/**
	 * 指定格式的字符串日期转Date对象
	 * @param dateTime
	 * @param format
	 * @return
	 * @throws ParseException
	 */
	public static Date getCurrentDateTimeObj(String dateTime,String format) throws ParseException
	{
		
		SimpleDateFormat sdf=new SimpleDateFormat(format);
		return sdf.parse(dateTime);
	}
	
	
}
