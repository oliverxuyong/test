package so.xunta.utils;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.font.FontRenderContext;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import javax.imageio.ImageIO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 2018.03.13  
 * @author 叶夷
 * 临时账户默认头像的生成  图片+username
 */
public class MakeUserImgUtil {
	private static Logger log = LoggerFactory.getLogger(MakeUserImgUtil.class);
	/**
	 * 
	 * @param inputImagePath  所需图片路径
	 * @param outputPath      输出的图片路径
	 * @param text	          需要在图片上加的文字
	 */
	public static void addTextToImage(String inputImagePath,String outputPath,String text){  
        File file = new File(inputImagePath);         
        Image image;
        String fontFamily="华文隶书";
		try {
			image = ImageIO.read(file);
			BufferedImage bi = new BufferedImage(image.getWidth(null), image.getHeight(null),
					BufferedImage.TYPE_INT_RGB);
			Graphics2D g2 = bi.createGraphics();
			g2.drawImage(image, 0, 0, image.getWidth(null), image.getHeight(null), null);
			g2.setColor(new Color(100, 100, 100));
			Font f1 = new Font(fontFamily, Font.BOLD + Font.ITALIC, 70);
			g2.setFont(f1);
			double stringHeight = getFontHeight(g2, f1);
			double stringSize = getFontSize(g2, f1, text);
			double textStartX = (image.getWidth(null) - stringSize) / 2;
			double textStartY = (image.getHeight(null) - stringHeight) / 1.8;
			g2.drawString(text, (int) textStartX, (int) textStartY);

			g2.setColor(new Color(242,242,242));
			Font f2 = new Font(fontFamily, Font.BOLD + Font.ITALIC, 70);
			g2.setFont(f2);
			double stringHeight2 = getFontHeight(g2, f2);
			double stringSize2 = getFontSize(g2, f2, text);
			double textStartX2 = (image.getWidth(null) - stringSize2) / 2 - 2;
			double textStartY2 = (image.getHeight(null) - stringHeight2) / 1.8 - 2;
			g2.drawString(text, (int) textStartX2, (int) textStartY2);

			g2.dispose();
			ImageIO.write(bi, "JPG", new FileOutputStream(outputPath));
		} catch (IOException e) {
			log.error("图片获取失败："+e);
		}

    }  
    
    /** 
     * 获取对应字体的文字的高度 
     *  
     * @param g2d 
     * @param font 
     * @return 
     * @parm 
     * @exception 
     */  
    private static double getFontHeight(Graphics2D g2d, Font font) {  
        // 设置大字体  
        FontRenderContext context = g2d.getFontRenderContext();  
        // 获取字体的像素范围对象  
        Rectangle2D stringBounds = font.getStringBounds("w", context);  
        double fontWidth = stringBounds.getWidth();  
        return fontWidth;  
    }  
  
    /** 
     * 获取对应的文字所占有的长度 
     *  
     * @param g2d 
     * @param font 
     * @return 
     * @parm 
     * @exception 
     */  
    private static double getFontSize(Graphics2D g2d, Font font, String text) {  
        // 设置大字体  
        FontRenderContext context = g2d.getFontRenderContext();  
        // 获取字体的像素范围对象  
        Rectangle2D stringBounds = font.getStringBounds(text, context);  
        double fontWidth = stringBounds.getWidth();  
        return fontWidth;  
    }  
}
