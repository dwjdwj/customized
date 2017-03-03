package com.jfinal.controller;

import java.io.FileNotFoundException;
import java.io.IOException;

import com.jfinal.core.ActionKey;
import com.jfinal.core.Controller;
import com.jfinal.service.*;

import freemarker.template.TemplateException;

/**
 * @author HS 
 * 创建时间： 2017年1月18日
 * 创建人 ： Du wei jun 
 * 文件名： Urlcontroller.java
 *
 */
public class Urlcontroller extends Controller {
// 首页跳转
	@ActionKey("/index")
	public void index() {
		System.out.println("------首页跳转成功----------");

		render("index.html");
		// render("kitchen-sink.html");
	}

// 跳转至编辑器界面
	@ActionKey("/editor")
	public void editor() {
		System.out.println("------编辑器页面跳转成功----------");

		render("addeditor.html");
	}

// 跳转代码选择界面
	@SuppressWarnings("static-access")
	@ActionKey("/Choice")
	public void Choice() throws TemplateException {
			System.out.println("------跳转代码选择界面成功----------");
			FileQueryService addfile = enhance(FileQueryService.class);
			String name = null;
			System.out.println("-----------");
			setAttr("Filelist", addfile.recursion(name));
			setAttr("FilelistJar", addfile.JarFile(name));
			setAttr("Filelistrun", addfile.runrecursion(name));
			render("Choice.html");
		
	}
	
	
// 移动文件路径跳转+读取文件内容
	@SuppressWarnings("static-access")
	@ActionKey("/moveFile")
	public void moveFile() throws TemplateException, FileNotFoundException, IOException {
		String h = getPara("radiofilename");
		if (h != "null" && h != "" && h != null) {
			FileQueryService addfile = enhance(FileQueryService.class);
			setAttr("content", addfile.ReaderFile(h));
			System.out.println(setAttr("content", addfile.ReaderFile(h))+":Ppp");
			System.out.println(h + "：跳转更新代码界面");
		
		} else {
			
			System.out.println("------跳转代选择界面成功----------");

			FileQueryService addfile = enhance(FileQueryService.class);
			CmdService xmlfile = enhance(CmdService.class);
			String a = getPara("filename");
			String jarname= getPara("jarname");
			setAttr("result", xmlfile.XmlFile(addfile.moveFile( a,jarname) ));
			
		}
		renderJson();
	}
//反 移动文件路径
		@SuppressWarnings({ "static-access", "unused" })
		@ActionKey("/backmoveFile")
		public void BackMoveFile() throws TemplateException, FileNotFoundException, IOException {
			String h = getPara("radiofilename");
				
				System.out.println("------跳转代选择界面成功----------");

				FileQueryService addfile = enhance(FileQueryService.class);
		
				String a = getPara("filename");
				String jarname= getPara("jarname");
				setAttr("result", addfile.BackMoveFile(a,jarname));
			renderJson();
		}
// -----------------------------------------------------------------------------------
// 新增代码
	@ActionKey("/add")
	public void add() {
		String list = getPara("list");
		String value = getPara("value");
		System.out.println("------新增代码页面跳转成功----------");
		AddFileService addfile = enhance(AddFileService.class);
		addfile.name(list, value);
	}
}
