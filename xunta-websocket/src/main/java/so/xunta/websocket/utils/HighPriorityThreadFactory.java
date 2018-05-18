package so.xunta.websocket.utils;

import java.util.concurrent.ThreadFactory;

public class HighPriorityThreadFactory implements ThreadFactory{
	private int counter;  
    private String name;  
	
	public HighPriorityThreadFactory(String name){
		counter=0;
		this.name=name;
	}
	
	@Override
	public Thread newThread(Runnable r) {
		Thread thread = new Thread(r,name+"-Thread-"+counter);
		
		if (thread.isDaemon()) {
			thread.setDaemon(false);
		}

		if (thread.getPriority() != Thread.MAX_PRIORITY) {
			thread.setPriority(Thread.MAX_PRIORITY);
		}
		counter++;
		return thread;
	}

}
