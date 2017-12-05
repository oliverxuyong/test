package so.xunta.beans;
/**
* 类名: TextMessage </br>
* 描述: 请求消息之文本消息 </br>
 */
public class TextMessage extends BaseMessage {
    // 消息内容
    private String Content;

    public String getContent() {
        return Content;
    }

    public void setContent(String content) {
        Content = content;
    }
}
