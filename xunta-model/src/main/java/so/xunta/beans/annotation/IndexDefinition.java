package so.xunta.beans.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
/**
 * 
 * @author fabao.yi
 *
 */
@Target(value={ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface IndexDefinition {
	boolean id() default false; //定义是否是id
	boolean store()default true;//定义是否存储
	boolean termVector() default false;//定义是否存储向量
	boolean index() default true;//索引
	boolean analyzed() default true;// 是否分词
}
