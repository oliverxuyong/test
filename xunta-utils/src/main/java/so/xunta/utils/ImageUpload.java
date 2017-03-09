package so.xunta.utils;

import javax.validation.constraints.NotNull;

import org.springframework.web.multipart.MultipartFile;

public class ImageUpload {
	
	@NotNull
	private MultipartFile imageFile;
	
	private boolean defaultFileName;
	
	private String caption;
	
	private String altTag;
	
	public ImageUpload() {
	}

	public MultipartFile getImageFile() {
		return imageFile;
	}

	public void setImageFile(MultipartFile imageFile) {
		this.imageFile = imageFile;
	}

	public boolean isDefaultFileName() {
		return defaultFileName;
	}

	public void setDefaultFileName(boolean defaultFileName) {
		this.defaultFileName = defaultFileName;
	}

	public String getCaption() {
		return caption;
	}

	public void setCaption(String caption) {
		this.caption = caption;
	}

	public String getAltTag() {
		return altTag;
	}

	public void setAltTag(String altTag) {
		this.altTag = altTag;
	}

	@Override
	public String toString() {
		return "ImageUploadModel [imageFile=" + imageFile + ", defaultFileName=" + defaultFileName + ", caption="
				+ caption + ", altTag=" + altTag + "]";
	}
	
}
