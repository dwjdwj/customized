package com.jfinal.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.management.MalformedObjectNameException;

import com.jfinal.config.UrlConfig;

import freemarker.core.ParseException;
import freemarker.template.Configuration;
import freemarker.template.DefaultObjectWrapper;
import freemarker.template.Template;
import freemarker.template.TemplateException;

public class test{
	private static Map<String, Object> paramMap;

	/**
     * 使用模板生成HTML代码
     */
	public   Map<String, Object> name (Map<String, Object> a) throws TemplateException{
	try {Configuration configuration = new Configuration();  
	     configuration.setDirectoryForTemplateLoading(new File(UrlConfig.ftl));  
	     configuration.setObjectWrapper(new DefaultObjectWrapper());  
	     configuration.setDefaultEncoding("UTF-8");   //这个一定要设置，不然在生成的页面中 会乱码  
	     //获取或创建一个模版。  
	     Template template = configuration.getTemplate("Freemarker.ftl");  
	     Map<String, Object> paramMap = new HashMap<String, Object>();  
	     paramMap.put("description", "我正在学习使用Freemarker生成静态文件！");  
	       
	     List<String> nameList = new ArrayList<String>();  
	     nameList.add("陈靖仇");  
	     nameList.add("玉儿");  
	     nameList.add("宇文拓");  
	     paramMap.put("nameList", nameList);  
	       
	     Map<String, Object> weaponMap = new HashMap<String, Object>();  
	     weaponMap.put("first", "轩辕剑");  
	     weaponMap.put("second", "崆峒印");  
	     weaponMap.put("third", "女娲石");  
	     weaponMap.put("fourth", "神农鼎");  
	     weaponMap.put("fifth", "伏羲琴");  
	     weaponMap.put("sixth", "昆仑镜");  
	     weaponMap.put("seventh", null);  
	     paramMap.put("weaponMap", weaponMap);  
	     Writer writer  = new OutputStreamWriter(new FileOutputStream("h.html"),"UTF-8");  
	     template.process(paramMap, writer);  
	    
	     System.out.println("恭喜，生成成功~~");  


 } catch (IOException e) {  
     e.printStackTrace();  }

    a =paramMap;
	return a;   
}

}  
  
	       
	
		
