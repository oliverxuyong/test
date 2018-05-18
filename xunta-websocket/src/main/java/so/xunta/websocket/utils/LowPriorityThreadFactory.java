package so.xunta.websocket.utils;

import java.util.concurrent.ThreadFactory;

public class LowPriorityThreadFactory implements ThreadFactory {
	private int counter;  
    private String name;  
	
	public LowPriorityThreadFactory(String name){
		counter=0;
		this.name=name;
	}
	
	@Override
	public Thread newThread(Runnable r) {
	Thread thread = new Thread(r,name+"-Thread-"+counter);
		
		if (thread.isDaemon()) {
			thread.setDaemon(false);
		}

		if (thread.getPriority() != Thread.NORM_PRIORITY) {
			thread.setPriority(Thread.NORM_PRIORITY);
		}
		counter++;
		return thread;
	}

}
