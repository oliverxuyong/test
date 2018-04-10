package so.xunta.persist;

import java.util.List;

import so.xunta.beans.TagChoiceDO;

public interface TagChoiceDao {
	//public static final List<String> MEANINGLESS_TAG = null;
	public TagChoiceDO getTagChoice(String tag);
	public List<String> getTopChoiceTags();
}
