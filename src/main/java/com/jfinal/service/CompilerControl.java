package com.jfinal.service;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

/*
 * 
 * 
 * 
 */
public class CompilerControl {
public void Compiler() {
	  InputStream ins = null;
      String[] cmd = new String[] { "cmd.exe", "/c ","ant" };  // 命令
      try {
          Process process = Runtime.getRuntime().exec(cmd);
          ins = process.getInputStream();  // 获取执行cmd命令后的信息
          BufferedReader reader = new BufferedReader(new InputStreamReader(ins));   
          String line = null;   
          while ((line = reader.readLine()) != null) {   
              System.out.println(line);  // 输出 
          } 
          int exitValue = process.waitFor();   
          System.out.println("返回值：" + exitValue);  
          process.getOutputStream().close();  
      } catch (Exception e) {
          e.printStackTrace();
      } 
  }
}