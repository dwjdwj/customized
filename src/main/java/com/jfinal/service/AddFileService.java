package com.jfinal.service;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;

import com.jfinal.config.UrlConfig;

public class AddFileService {
	private static String filenameTemp; 
public void name(String list, String value) {
	System.out.println("进入新增代码功能...."+list);
	BufferedWriter File = null;
	try {
		filenameTemp = UrlConfig.Addfile + list + ".java"; 
		File filename = new File(filenameTemp); 
		File = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(filename, true), "GBK")); // 指定编码格式，以免读取时中文字符异常
		File.append(value);
	} catch (Exception e) {
		e.printStackTrace();
	} finally {
		if (File != null) {
			try {
				File.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

}
}
