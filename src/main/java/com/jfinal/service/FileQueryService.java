package com.jfinal.service;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

import java.util.ArrayList;
import java.util.List;
import java.util.StringTokenizer;

import com.jfinal.config.UrlConfig;

/**
 * @author HS
 * 创建时间： 2017年1月18日
 * 创建人    ： Du wei jun
 * 文件名：     FileQueryService.java
 *
 */
public class FileQueryService {
private static CmdService cmdService;
	// 读取文件夹返回给前端LIST
	public static List<String> recursion(String name ) {
		List<String> fileList = new ArrayList<String>();
		File file = new File(UrlConfig.fileCP);
		File[] subFile = file.listFiles();
		for (int i = 0; i < subFile.length; i++) {
			if (subFile[i].isDirectory()) {
				recursion(subFile[i].getAbsolutePath());
			} else {
				System.out.println();
				fileList.add(subFile[i].getName());
			}
		}
		System.out.println(fileList);
		return fileList;
	}
//已确定编译的文件	
	public static List<String> runrecursion(String name ) {
		List<String> fileListrun = new ArrayList<String>();
		File file = new File(UrlConfig.fileCD);
		File[] subFile = file.listFiles();
		for (int i = 0; i < subFile.length; i++) {
			if (subFile[i].isDirectory()) {
				recursion(subFile[i].getAbsolutePath());
			} else {
				System.out.println();
				fileListrun.add(subFile[i].getName());
			}
		}
		System.out.println(fileListrun);
		return fileListrun;
	}
	
	
//获取jar文件显示到前端
	public static List<String> JarFile(String jarname) {
		List<String> fileListjar = new ArrayList<String>();
		File file = new File(UrlConfig.Jarfile);
		File[] subFile = file.listFiles();
		for (int i = 0; i < subFile.length; i++) {
			if (subFile[i].isDirectory()) {
				recursion(subFile[i].getAbsolutePath());
			} else {
				System.out.println();
				fileListjar.add(subFile[i].getName());
			}
		}
		System.out.println(fileListjar);
		return fileListjar;
	}	
	public static void main(String[] args) {
		JarFile(null);
	}
	
//代码冗余，后期更换，零时调用
	public static  String BackMoveFile(String a, String jarname ) throws FileNotFoundException, IOException { 
		boolean re=false;
	//字符串文件名分割

		 StringTokenizer st = new StringTokenizer(a,"&");
		 
		 while( st.hasMoreElements() ){
			
	        String[] strarray=st.nextToken().split("Fruit=");
	       
	        for (int i = 0; i < strarray.length; i++) {
	        	 System.out.println("--------");
	        	if(!strarray[i].equals(null)){
	        		System.out.println(strarray[i]+":pp");
	        	String srcFileName=UrlConfig.fileCD+strarray[i];
	 			System.out.println(srcFileName);
	 			String destDirName=UrlConfig.fileCP;
	 		    File srcFile = new File(srcFileName);  
	 		    System.out.println(srcFile.isFile()+":srcFile.isFile()");
	 		    System.out.println(srcFile.exists()+":srcFile.exists()");
	 		    if(!srcFile.exists() || !srcFile.isFile()) {
	 		    	System.out.println("文件移动失败-false-");
	 		    	  
	 		    }else{     
	 		    File destDir = new File(destDirName);  
	 			System.out.println(destDir.mkdirs()  );
	 		    srcFile.renameTo(new File(destDirName + File.separator + srcFile.getName()));
	 	    	System.out.println("--文件移动成功返回true-");
	 	    	re=true;
	 		    }
	 		    } 
	        }
	}	  
		System.out.println("0000000000000");
	return jarname;
			   
			}
	
	
//代码文件移动
public static  String moveFile(String a, String jarname ) throws FileNotFoundException, IOException { 
	boolean re=false;
//字符串文件名分割

	 StringTokenizer st = new StringTokenizer(a,"&");
	 
	 while( st.hasMoreElements() ){
		
        String[] strarray=st.nextToken().split("Fruit=");
       
        for (int i = 0; i < strarray.length; i++) {
        	 System.out.println("--------");
        	if(!strarray[i].equals(null)){
        		System.out.println(strarray[i]+":pp");
        	String srcFileName=UrlConfig.fileCP+strarray[i];
 			System.out.println(srcFileName);
 			String destDirName=UrlConfig.fileCD;
 		    File srcFile = new File(srcFileName);  
 		    System.out.println(srcFile.isFile()+":srcFile.isFile()");
 		    System.out.println(srcFile.exists()+":srcFile.exists()");
 		    if(!srcFile.exists() || !srcFile.isFile()) {
 		    	System.out.println("文件移动失败-false-");
 		    	  
 		    }else{     
 		    File destDir = new File(destDirName);  
 			System.out.println(destDir.mkdirs()  );
 		    srcFile.renameTo(new File(destDirName + File.separator + srcFile.getName()));
 	    	System.out.println("--文件移动成功返回true-");
 	    	re=true;
 		    }
 		    } 
        }
}	  
	System.out.println("0000000000000");
return jarname;
		   
		}
/*public static void main(String[] args) throws FileNotFoundException, IOException {
	moveFile(null, null);
}*/
//-------------------------------
//读取需要更新的代码文件内容
public static String ReaderFile(String content){
// 文件和该类在同个目录下
	String filePath =UrlConfig.Addfile + content; 
	File file = new File(filePath); 
	FileInputStream fis = null;
	try {
		fis = new FileInputStream(file);
	} catch (FileNotFoundException e1) {
		// TODO Auto-generated catch block
		e1.printStackTrace();
	} 
//创建文件输入流
	byte[] buffer = new byte[1024]; 
//创建文件输入缓冲区
	ByteArrayOutputStream  bos = new ByteArrayOutputStream(); 
//创建内存输出流
	int len;
	try {
		while((len=fis.read(buffer))!=-1){ 
//当整个循环结束后，文件中的内容就全部写入了缓冲区
		    bos.write(buffer,0,len);
		    byte[] result = bos.toByteArray(); 
			content = new String(result,"gbk");
		}
	} catch (IOException e) {
		e.printStackTrace();
	}

//通过字符型的数据存放结果，也就把文件中的内容赋值给了content变量
			System.out.println(content+":00");
	
	return content;
	
}
	
}
