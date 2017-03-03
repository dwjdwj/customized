package com.jfinal.config;

import java.io.File;

/** 
 * URL
 * 创建时间：2017/01/03
 * 创建人： Du Wei Jun
 * */
public class UrlConfig
{
	/** 
	 * URL
	 * fileCD：编译文件存放位置
	 * fileurl 读取文件的路径
	 * fileCP 调用的源目录代码文件位置
	 * */
//路径跳转调用层
	public static final String INDEX = "/editor/";
	public static final String ftl="src/main/java/ftl";

//添加文件路径
	public static final String Addfile="D:/daimaseshi/";
	//文件存储盘符
	public static final String fileCD="D:/DTLFolder1/TEST/src/com/test/";
	public static final String fileCDxml="D:/DTLFolder1/TEST/";
	public static final String fileCP="D:/daimaseshi/";
	public static final String UPfilexml="../Customized/build.xml";
	//JAR包路径
	public static final String Jarfile="D:/DTLFolder1/TEST/";
//编译文件盘符
}
