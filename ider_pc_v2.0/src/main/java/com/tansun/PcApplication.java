package com.tansun;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.client.RestTemplate;

/**
 * 信用卡核心启动类
 * 
 * @author Admin
 *
 */
@SpringBootApplication
@ServletComponentScan(basePackages = "com.tansun.*")
@ComponentScan(basePackages = "com.tansun.*")
public class PcApplication {

	public static void main(String[] args) {
		SpringApplication.run(PcApplication.class, args);
	}

	@Bean
	RestTemplate restTemplate() {
		return new RestTemplate();
	}

}
