package com.jfinal.config;

import com.jfinal.controller.JfinalController;
import com.jfinal.controller.Urlcontroller;
import com.jfinal.ext.handler.ContextPathHandler;

import com.jfinal.render.ViewType;

/**
 * @author HS
 * 创建时间： 2017年1月18日
 * 创建人    ： Du wei jun
 * 文件名：     JfinalConfig.java
 *
 */
public class JfinalConfig extends JFinalConfig {

	@Override
	public void configConstant(Constants me) {
		// TODO Auto-generated method stub
		me.setDevMode(true);
        me.setViewType(ViewType.FREE_MARKER);//默认的 可以不配置
		//me.setBaseViewPath(UrlConfig.ftl);//页面模板根路径
	//me.setFreeMarkerViewExtension(".ftl");//freemarker 模板后缀名
	}

	@Override
	public void configRoute(Routes me) {
		me.add("/",JfinalController.class,UrlConfig.INDEX);
		me.add("/index",Urlcontroller.class,UrlConfig.INDEX);
	
		
	}

	@Override
	public void configPlugin(Plugins me) {
		
	}

	@Override
	public void configInterceptor(Interceptors me) {
		// TODO Auto-generated method stub

	}

	@Override
	public void configHandler(Handlers me) {
		me.add(new ContextPathHandler("base"));//添加项目contextPath,以便在页面直接获取该值 ${base?if_exists}
	}

}
