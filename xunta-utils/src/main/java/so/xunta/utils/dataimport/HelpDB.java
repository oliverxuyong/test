package so.xunta.utils.dataimport;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import org.apache.log4j.Logger;


/**
 * 数据库连接工具
 * 
 * @author Thinkpad
 *
 */
public class HelpDB {
	private final String PREFIX = "jdbc:mysql://localhost:3306/";
	private String URL = null;
	private final String USERNAME = "root";
	private final String PASSWORD = "660419";
	private final String DRIVER = "com.mysql.jdbc.Driver";
	private Logger logger = Logger.getRootLogger();

	private ThreadLocal<Connection> conn = new ThreadLocal<Connection>() {

		@Override
		protected Connection initialValue() {
			Connection conn = null;
			try {
				conn = DriverManager.getConnection(URL, USERNAME, PASSWORD);
			} catch (SQLException e) {
			}
			return conn;
		}
	};
	
	private static HelpDB instance = new HelpDB();

	private HelpDB() {
		super();
		try {
			Class.forName(DRIVER);
		} catch (ClassNotFoundException e) {
			System.out.println("加载驱动失败");
		}
	}

	public static HelpDB getstance() {
		return instance;
	}

	public Connection getConn(String db_name) {
		URL = PREFIX + db_name;
		Connection con = conn.get();
		URL = null;
		return con;
	}

	public void closeConn() {
		try {
			conn.get().close();
			conn.remove();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage(), e);
		}
	}
	
}
