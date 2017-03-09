package so.xunta.websocket.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import so.xunta.websocket.echo.HandShakeInterceptor;

@Configuration
@EnableWebMvc
@EnableWebSocket
public class WebConfig extends WebMvcConfigurerAdapter implements WebSocketConfigurer {

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {

		registry.addHandler(echoWebSocketHandler(), "/websocket")
		.addInterceptors(new HandShakeInterceptor())
		.setAllowedOrigins("*");
		registry.addHandler(echoWebSocketHandler(), "/sockjs/websocket")
		.addInterceptors(new HandShakeInterceptor())
		.setAllowedOrigins("*")
		.withSockJS();

	}

	@Bean
	public WebSocketHandler echoWebSocketHandler() {
		return new so.xunta.websocket.echo.EchoWebSocketHandler();
	}


	// Allow serving HTML files through the default Servlet

	@Override
	public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
		configurer.enable();
	}

}
