/**
 * 
 */
package com.jfinal.service;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.output.XMLOutputter;

import com.jfinal.config.UrlConfig;

/**
 * @author HS
 * 创建时间： 2017年1月19日
 * 创建人    ： Du wei jun
 * 文件名：     CmdService.java
 *
 */
public class CmdService {


	//调用cmd实现编译打包运行功能
	public static  void CmdIde( ){
		System.out.println("开始编译文件......................");
		   InputStream ins = null;
		   
			System.out.println("开始编译文件进行......................");
	        String[] cmd = new String[] { "cmd.exe", "/c ","ant" };  // 命令
	        try {
	        	System.out.println("开始编译文件进行中......................");
	            Process process = Runtime.getRuntime().exec(cmd);
	            ins = process.getInputStream();  // 获取执行cmd命令后的信息
	            BufferedReader reader = new BufferedReader(new InputStreamReader(ins));   
	            String line = null;   
	            while ((line = reader.readLine()) != null) {   
	                System.out.println(line);  // 输出 
	            } 
	           /* exitValue = process.waitFor();   
	            System.out.println("返回值：" + exitValue);  */
	            process.getOutputStream().close();  
	        } catch (Exception e) {
	            e.printStackTrace();
	        } 

		
		
	}
/*name 生成xml文件
 * fileCD 文件工作根目录
 * Runname 自定义项目名称
 * jarname 自定义打包名称
 */
public static String XmlFile(String jarname) throws FileNotFoundException, IOException {
		System.out.println("生成xml文件--jarname---"+jarname);

			// 创建根节点 list;
					Element root = new Element("project");
					root.setAttribute("name", "TEST");
					root.setAttribute("default", "run");
					root.setAttribute("basedir", UrlConfig.fileCDxml);
			/*	此处 for 循环可替换成 遍历 
			* 	用于数据库表的结果集操作;
			* 	创建第一个property节点
			*/
					System.out.println("生成xml文件--jarname2---"+jarname);
					Element One = new Element("property");
			// 给 property 节点添加属性;
					One.setAttribute("name", "src");
					One.setAttribute("value", "src");
					root.addContent(One);
			// 创建第二个property节点
					Element Two = new Element("property");
					Two.setAttribute("name", "dest");
					Two.setAttribute("value", "classes");
					root.addContent(Two);
					
			// 创建第三个property节点
					Element Three = new Element("property");
					Three.setAttribute("name", jarname);
			System.out.println("ppppp");
					Three.setAttribute("value", jarname+".jar");
					root.addContent(Three);
			// 创建第四个property节点
					Element Four = new Element("property");
					Four.setAttribute("name", "ant.dir");
					Four.setAttribute("value", UrlConfig.fileCDxml);
					root.addContent(Four);
					
				
				
					System.out.println("生成xml文件--jarname3---"+jarname);		
					
			// 创建第一个节点 target
					Element Onetarget = new Element("target");
			// 给 user 节点添加属性
					Onetarget.setAttribute("name", "init");
			// 给 target节点添加子节点并赋值
					Element a1 = new Element("mkdir");
					a1.setAttribute("dir", "${dest}");
					Onetarget.addContent(a1);

					root.addContent(Onetarget);
					
			// 创建第二个节点 target
					Element Twotarget = new Element("target");
				
					Twotarget.setAttribute("name", "compile");
					Twotarget.setAttribute("depends", "init");
			// 给 target节点添加子节点并赋值
					Element b1 = new Element("javac");
					b1.setAttribute("srcdir", "${src}");
					b1.setAttribute("encoding", "gbk");
					b1.setAttribute("includeantruntime", "on");
					b1.setAttribute("destdir", "${dest}");
			//javac增加子节点
					Element classpath = new Element("classpath");
					
			//classpath增加子节点
					Element pathelement = new Element("pathelement");
					pathelement.setAttribute("path","${ant.dir}");
					
					classpath.addContent(pathelement);
					Element fileset = new Element("fileset");
					fileset.setAttribute("dir","lib");
					Element include = new Element("include");
					include.setAttribute("name","**/*.jar");
					
					fileset.addContent(include);
					classpath.addContent(fileset);
					b1.addContent(classpath);
					Twotarget.addContent(b1);
					
					System.out.println("生成xml文件--jarname5---"+jarname);				
					
					root.addContent(Twotarget);

			// 创建第三个节点 target
					Element Threetarget = new Element("target");
					Threetarget.setAttribute("name", "build");
					Threetarget.setAttribute("depends", "compile");
			// 给 target节点添加子节点并赋值
					Element c = new Element("jar");
					c.setAttribute("jarfile", "${"+jarname+"}");
					c.setAttribute("basedir", "${dest}");
					Threetarget.addContent(c);
					
					root.addContent(Threetarget);
					
			// 创建第四个节点 target
					Element Fourtarget = new Element("target");
					Fourtarget.setAttribute("name", "run");
					Fourtarget.setAttribute("depends", "build");
			
					root.addContent(Fourtarget);
					
					Document Doc = new Document(root);
				
					XMLOutputter XMLOut = new XMLOutputter();
					System.out.println("生成xml文件--jarname24---"+jarname);
					// 输出 .xml 文件,此处可调用方法内部路径
					XMLOut.output(Doc, new FileOutputStream("build.xml"));
		System.out.println("生成xml文件成功-----------------------");
	CmdIde();
		return jarname;
	
		
	}
/*public static void main(String[] args) throws FileNotFoundException, IOException {
	String jarname="sss";
	XmlFile(jarname);
	CmdIde( );
}
	*/
	
}
