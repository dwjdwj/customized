/*
 * Copyright (c) 2009 A.L.Zhang (zehao.zh@gmail.com)
 * Licensed under the Apache License 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
 * 
 * demo: http://al-groupselect.appspot.com/
 * author:alzhang
 * version:1.0
 * data:2009-06-03
 * Requires: jquery-1.3.2+
 * 
 * */

jQuery.extend({
	
	//请使用此方法取得一份初始参数！
	GSParameters: function() {
		//默认的，可以在此基础上修改为自定义的初始化参数
        return {
	        'frameId':'',//div的ID，控件将于此div内生成
	        'edit'://如果需要编辑请设置以下属性
	            {'need':false,//是否是编辑状态，true的话同时必须设置下面2个属性
	             'gid':'',//已经选择的组Id
	             'item':''//已经选择的Item,数据格式为JSON: {'id':'','name':''}.
	            },
	        'ismustinput':true,//是否必须输入并显示提示信息
	        'groupInfo':
	            {'divId':'',//如果需要取得或者显示选取的group信息,请指定此Div的ID
	             'gid':'',//group id将存放于此attr中
	             'gname':''//group name将存放于此attr中
	            },
	        'needactive':false,//是否需要动态提示，比如首字母输入
	        'checkmax':false,//是否需要最大数目限制
	        'maxcount':30,//最大选择数
	        'ajaxRequestType':'GET',//ajax请求方式，post or get
	        'ajaxRequestUrl':
	            {'group':'',//请求group数据的url
	             'item':'',//请求item的url
	             'active':''//请求active对应数据的url
	            },
	            //如果不为空 发起ajax 请求，请求数据, (数据为json格式)
	        'ajaxRequestKey':
	            {'groupid':'id','activetext':'text'},
	            //如果发起ajax 请求，提交的参数使用此key，groupid为取此group下的item, activetext为动态输入内容
	        'getStaticData':
	            {'activeData':'',//函数，如果不使用ajax则从此取得active对应的数据，提供输入text参数
	             'groupData':'',//函数，如果不使用ajax则从此取得Group数据
	             'itemData':''//函数，如果不使用ajax则从此取得Item数据，提供组id           
	            },
	        'img':
	            {'downOver':'./images/downover.gif',//down focus
	             'downOut':'./images/downout.gif',//down blur
	             'upOver':'./images/upover.gif',//up focus
	             'upOut':'./images/upout.gif',//up blur
	             'closeOver':'./images/closeOver.gif',//colse focus
	             'closeOut':'./images/closeOut.gif',//close blur
	             'removeOver':'./images/removeOver.gif',//remove focus
                 'removeOut':'./images/removeOut.gif'//remove blur
	            },
	        'message':
	            {'imgTitle':'选择文件',
	             'closeTitle':'关闭',
	             'removeTitle':'移除',
	             'select':'请选择文件',
	             'buttonOK':'确定',
	             'buttonCancle':'取消',
	             'active':'请选择对应文件名称(支持拼音首字母输入)',
	             'notfindactive':'列表中不存在此文件哦，请重新输入',
	             'noactive':'请从下拉菜单中选择！',
	             'max1':'最多只能选择',
	             'max2':'个文件！',
	             'result':'请选择要添加到当前分组的文件！'
	            }
	        };
	},
	
	// 返回结果为一个函数，其调用返回选择的item的Id的一个字符串。
	InitGS: function (pars){	
	
		var newDiv = '<div/>';//创建新的Div
		var newImg = '<img/>';//创建新的Img
		var newA = '<a />';//创建新的A
		var newSpan = '<span/>';//创建新的Span
		var newSelect = '<select></select>';//创建新的Select
		var newOption = '<option/>';//创建新的Option
		var newButton = '<input type="button"/>';//创建新的Button
		var newText = '<input type="text" />';//创建新的Text
		var newCheckbox = '<input type="checkbox" />';//创建新的Checkbox
		
		var data = [];//最终选择结果
		var suggestdata = [];//suggest数据
		var itemsdata = [];//下拉框中选项数据
	
		// initialize all components 
		gs_init();
		
		function gs_init () {
			initTopFrame();//整体框架
			initInputContentDiv();//输入框
			initFlowFrame();//下拉框架
			initClear(topFrame);//清除浮动布局
			initPopEvent();//下拉点击事件
			initPopMenu();//下拉窗口
			initPopImg();//下拉点击图片
			initGroupMenu();//下拉框顶部区域(组选择)
			initAllItems();//下拉框中部区域(子选项)
			initButtonsMenu();//下拉框低部区域(按钮)
			initGroupspan();//组选择区域	
			initClear(groupMenu);//清除浮动布局
			initGroupInput();//组选择控件	
			initButtons();//按钮	
			initGroupData();
		}
        
		function initGroupData(){
			if(pars.ajaxRequestUrl.group != ""){
				$.ajax({
					   type: pars.ajaxRequestType,
					   url: pars.ajaxRequestUrl.group,
					   dataType: "json",
					   success: function(json){
					   		addGroupOptions(json);
					   		initEditGroupData();
					   }
				});
			}else {
				addGroupOptions(pars.getStaticData.groupData());
				initEditGroupData();
			}
		}
		
		//编辑状态
		function initEditGroupData(){
			if(pars.edit.need){
				$(groupInput).val(pars.edit.gid);//编辑中的组
				
				$(pars.edit.item).each(function(){//编辑中的选项
					$(this).attr('type','static');
					data[data.length] = this;
				});
				refreshInput();
			}
			initGroupInfo();
		}
		
		//同步显示外部组信息
		function initGroupInfo(){
			if('' != pars.groupInfo.divId){
			    $('#' + pars.groupInfo.divId).attr(pars.groupInfo.gid,$(groupInput).val()).attr(pars.groupInfo.gname,$(groupInput).find(':selected').text()).text($(groupInput).find(':selected').text());
			}
		}
		
		//输入框点击事件
		function gs_inputOnclick()
		{
			$(popMenu).css('display','none'); //隐藏下拉框
			if(hasActive() != -1) //有active的数据时点击，自动选择数据
			{
				if($(active).val() != "" && $(suggest).css('display') == 'none' )//没有待选数据则清空
				{
					$(active).val('');
				}
				$(active).focus();
			}
			else
			{
				data[data.length] = {type:"active"};//添加一个active标记
				refreshInput();
			}
			
		}

		//active focus event
		function gs_inputOnfocus(obj)
		{
			if(obj.value == "")
			{
				$(emptysuggest).css('display','block');
				if(pars.needactive){
					$(emptysuggest).text(pars.message.active);
				}else {
					$(emptysuggest).text(pars.message.noactive);
				}
				
			}
		}

		// active key down even for up down left right
		function gs_inputOnkeydown(evnt)
		{
			$(active).css('width',strlen($(active).val())*6+20 + "px");//根据输入的数据改变active长度
			
			if (evnt.keyCode == 13)//ENTER
			{
				return false;
			}
			
			//BACKSPACE
			if(evnt.keyCode == 8 && data[hasActive() - 1] && $(active).val() == "")
			{
				var tdata = [];
				var j=0;
				for(var i=0; i<data.length ; i++)
				{
					if(hasActive() - 1 == i)
					{
						continue;
					}
					tdata[j] = data[i];
					j++;
				}
				data = tdata;
				refreshInput();
				$(active).focus();//操作后刷新active
				return false;
			}
		
			//LEFT
			if(evnt.keyCode == 37 && data[hasActive()-1] && $(active).val() == "")
			{
				return;
			}
			
			//RIGHT
			if(evnt.keyCode == 39 && data[hasActive()+1] && $(active).val() == "")
			{
				return;
			}
			
			//DOWN 包括suggest中的选择
			if(evnt.keyCode == 40)
			{
				if( suggestitems[0] != null && $(suggest).css('display') == "block")
				{
					if(suggestInfo().index == -1)
					{
						selectedSuggestItem(suggestitems[0]);
					}
					else
					{
						selectedSuggestItem(suggestitems[suggestInfo().index == suggestInfo().total - 1 ? 0 : suggestInfo().index + 1]);
					}
					return false;
				}
			}
			
			//UP
			if(evnt.keyCode == 38)
			{
				if($(suggestitems[0]) != null && $(suggest).css('display') == "block")
				{
					if(suggestInfo().index == -1)
					{
						selectedSuggestItem(suggestitems[suggestInfo().total-1]);
					}
					else
					{
						selectedSuggestItem(suggestitems[suggestInfo().index == 0 ? suggestInfo().total - 1 : suggestInfo().index - 1]);
					}
				}
			}
			
			if(!pars.needactive){
				return false;
			}
		}

		//active key up event
		function gs_inputOnkeyup(evnt)
		{
			if(!pars.needactive){
				return false;
			}
			
			//ENTER
			if (evnt.keyCode == 13)
			{
				addSelectedSuggestObj();
			}
			if(evnt.keyCode == 38 || evnt.keyCode == 40 || evnt.keyCode == 37 || evnt.keyCode == 39 )
			{
				return;
			}
			else if($(active).val() != '')
			{
				var text = encodeURIComponent($(active).val());

				if(pars.ajaxRequestUrl.active != ""){
					$.ajax({
						   type: pars.ajaxRequestType,
						   url: pars.ajaxRequestUrl.active,
						   data: pars.ajaxRequestKey.activetext + '=' + text,
						   dataType: "json",
						   success: function(json){
						     initSuggestData(json);
						   }
					});
				}else {
					initSuggestData(pars.getStaticData.activeData(text));
				}
			}
		
		}

		//active blur
		function gs_inputOnblur(obj)
		{
			if($(active).val() != "")
			{
				$(active).val('');
			}
			$(suggest).css('display','none');
			$(emptysuggest).css('display','none');
		}

        var suggestitems = [];//suggest选项组件
		function initSuggestData(serverdata)
		{
			suggestdata = serverdata;
			
			if(suggestdata.length == 0)
			{
				$(suggest).css('display','none');
				$(emptysuggest).css('display','block');
				$(emptysuggest).text(pars.message.notfindactive);
				
				return;
			}
			
			$(suggest).empty();
			
			for(var i=0 ; i<suggestdata.length ; i++)
			{
				if (i == 0)//第一个选项添加关闭按钮
		        {
		        	suggestitems[i] = $(newDiv).appendTo(suggest).addClass('sgt_of').mouseover(function(){selectedSuggestItem(this);});
		        	$(newDiv).appendTo(suggestitems[i]).addClass('l').text(suggestdata[i].name).addClass('itemC').mousedown(function(){addSelectedSuggestObj();});
		        	$(newImg).appendTo($(newA).appendTo($(newDiv).appendTo(suggestitems[i]).addClass('r cp')).click(function(){refreshInput();})).attr(({src:pars.img.closeOut,alt:pars.message.closeTitle,title:pars.message.closeTitle})).mouseover(function(){this.src=pars.img.closeOver}).mouseout(function(){this.src=pars.img.closeOut});
		        	initClear(suggestitems[i]);
		        }
		        else{
		        	suggestitems[i] = $(newDiv).appendTo(suggest).addClass('sgt_of').text(suggestdata[i].name).mouseover(function(){selectedSuggestItem(this);}).mousedown(function(){addSelectedSuggestObj();});
		        }

			}

			$(suggest).css('display','block');
			$(emptysuggest).css('display','none');
			
		}

		function popFlow(){
			
			$(suggest).css('display','none');
		    $(emptysuggest).css('display','none');
		    
			if($(popMenu).css('display') == 'block')
			{
				$(popMenu).css('display','none');
				$(popImg).attr('src',pars.img.downOut).mouseover(function(){this.src=pars.img.downOver}).mouseout(function(){this.src=pars.img.downOut});
			}
			else
			{
				initPopData();
			}
		}
		
		function  initPopData()
		{
			if(pars.ajaxRequestUrl.item != ""){
				$.ajax({
					   type: pars.ajaxRequestType,
					   url: pars.ajaxRequestUrl.item,
					   data: pars.ajaxRequestKey.groupid + '=' + $(groupInput).val(),
					   dataType: "json",
					   success: function(json){
							initPopItems(json);
					   }
				});
			}else {
				initPopItems(pars.getStaticData.itemData($(groupInput).val()));
			}
			
			$(popMenu).css('display','block');
			$(popImg).attr('src',pars.img.upOut).mouseover(function(){this.src=pars.img.upOver}).mouseout(function(){this.src=pars.img.upOut});

		}

        var itemcheckbox = [];//选项checkbox组件
		function initPopItems(serverdata)
		{
			$(allitems).empty();
			
			itemsdata = serverdata;
			var len = Math.ceil(itemsdata.length/3)*3;
			for(var i=0 ; i<len ; i++)
			{	
				var tempItemDiv;
				if(i%3 == 0)
				{
					tempItemDiv = $(newDiv).addClass('sgt_3');
				}
				if(itemsdata[i])
				{
					var titemdiv = $(newDiv).appendTo(tempItemDiv).addClass('l itemW').attr('title',itemsdata[i].name);
					itemcheckbox[i] = $(newCheckbox).appendTo(titemdiv).click(function(){checkPassMax(this);});
					$(data).each(function(){//勾选已经选择的选项
						  if($(this).attr('id') == itemsdata[i].id){
							  itemcheckbox[i].attr('checked','true');
							  return false;
						  }
					});
					
					$(titemdiv).append(itemsdata[i].name);
				}
				if(i%3 == 2)
				{
					initClear(tempItemDiv);
					$(tempItemDiv).appendTo(allitems);
				}
			}
		}

		function checkPassMax(obj)
		{
			var count = 0;
			for(var i=0; i<itemcheckbox.length ; i++)
			{
				if($(itemcheckbox[i])[0].checked && !isDataDuplicate(itemsdata[i]))
				    count++;
			}
			
			if(isPassMax(staticDataCount() + count - 1)){
				obj.checked = false;
			}
		}

		//添加组选项
		function addGroupOptions(serverData)
		{
			for(var i=0; i<serverData.length; i++)
			{
				$(newOption).appendTo(groupInput).val(serverData[i].id).text(serverData[i].name);
			}
			
		}
		
		//检查添加重复的选项
		function isDataDuplicate(item){
			var isDuplicate = false;
			$(data).each(function(){
	             if($(this).attr('id') == item.id){
	             	isDuplicate = true;
	                return false;
	             }
            });
            return isDuplicate;
		}
		
		// 下拉框 选择
		function addSelectedPopItems()
		{
			initGroupInfo();
			for(var i=0; i<itemsdata.length ; i++)
			{
				if($(itemcheckbox[i])[0].checked)
				{
					var obj = itemsdata[i];
					obj.type = "static";
					if(isDataDuplicate(itemsdata[i])){
						continue;
					}
					data[data.length] = itemsdata[i];
				}
			}
			var tdata = [];
			var j=0;
			for(var i=0; i<data.length ; i++)
			{
				if(data[i].type == "active")
				{
					continue;
				}
				
				tdata[j] = data[i];
				j++;
			}
			data = tdata;
		
			popMenuCancle();
		}

		//取消下拉选择
		function popMenuCancle(){
			
			$(popMenu).css('display','none');
			$(popImg).attr('src',pars.img.downOut).mouseover(function(){this.src=pars.img.downOver}).mouseout(function(){this.src=pars.img.downOut});
				
			refreshInput();
		}
		
		//选择当前选择的数据 mouseover suggest
		function selectedSuggestItem(thisobj)
		{
			$.each(suggestitems, function(i, n){
				n.removeClass();
                n.addClass('sgt_of');	
			});
			$(thisobj).removeClass();
			$(thisobj).addClass('sgt_on');
		}

		//取得当前选择的数据 and mousedown suggest
		function addSelectedSuggestObj()
		{
			if ($(suggest).css('display') == "block" && suggestInfo().index != -1 && suggestInfo().total > 0)
			{
				if (!isPassMax(staticDataCount()) && !isDataDuplicate(suggestdata[suggestInfo().index]))
				{
					var newData = suggestdata[suggestInfo().index];
					newData.type = "static";
				
					for(var i = data.length ; i> hasActive() ; i--)
					{
						data[i] = data[i-1];
					}
					data[hasActive()] = newData;
				}
				refreshInput();
			}
		}

		//检查选择数目限制
		function isPassMax(count)
		{
			if(pars.checkmax){
				if( count < pars.maxcount ){
					return false;
				}else {
					alert(pars.message.max1 + pars.maxcount+ pars.message.max2);
					return true;
				}
			}
			else{
				return false;    
			}
		}

		function staticDataCount(){
			var c = 0;
            for(var i=0; i<data.length ; i++)
            {
                if(data[i].type == "static")
                {
                    c++;
                }
            }
            return c;
		}
		
		//得到suggest中选中的项目和总数
		function suggestInfo()
		{
			var index = -1;
			for(var i = 0; i < suggestitems.length; i++){
				if(suggestitems[i].hasClass('sgt_on')){
					index = i;
				}
			}
			return {"index":index,"total":suggestitems.length};
			
		}

        //根据输入项重新设置输入区域的高
		function resizeInputContentDiv(){
            var mintop = 1000000;
            var maxbottom = 0;
            
            $.each( $(inputContentDiv).contents(), function(i, n){
              if($(n).hasClass('selItem') || $(n).hasClass('activeDiv'))
                {
                    if($(n).offset().top <  mintop)
                    {
                        mintop = $(n).offset().top;
                    }
                    if( ($(n).offset().top + $(n).height()) > maxbottom)
                    {
                        maxbottom = $(n).offset().top + $(n).height();
                    }
                }
            });

            var height = maxbottom-mintop;
            height = height < 23 ? 23 : height;
            
            $(inputContentDiv).css('height', height + "px");
		}
		
		//刷新输入框中内容
		function refreshInput()
		{
			$(inputContentDiv).empty();
			for(var i=0; i<data.length ; i++)
			{
				if(data[i].type == "static")//static表由选项选择的数据
				{
					var selected = $(newDiv).appendTo(inputContentDiv).addClass('selItem').text(data[i].name);
					$(newImg).appendTo($(newA).appendTo(selected).addClass('cp')).attr('index',data[i].id).click(function(){removeInput(this);}).attr(({src:pars.img.removeOut,alt:pars.message.removeTitle,title:pars.message.removeTitle})).mouseover(function(){this.src=pars.img.removeOver}).mouseout(function(){this.src=pars.img.removeOut});
					
				}
				else
				{
					initActiveAndSuggest();
				}
			}	
			
			resizeInputContentDiv();
		
		}
	
		function removeInput(obj)
	    {
		    var tdata = [];
		    var j = 0;
		    for (var i=0; i < data.length; i++)
		    {
		        if (data[i].id == $(obj).attr('index'))
		        {
		            continue;
		        }
		        tdata[j] = data[i];
		        j++;
		    }
		    data = tdata;
		    refreshInput();
		    return;
	    }
	
	
		//按字得到长度 
		function strlen(fData)
		{
			var intLength=0;
			for (var i=0;i<fData.length;i++)
			{
				if ((fData.charCodeAt(i) < 0) || (fData.charCodeAt(i) > 255))
					intLength=intLength+2;
				else
					intLength=intLength+1;   
			}
			return intLength;
		}

		//data中是否有type为active的数据(用户手动输入的数据)
		function hasActive()
		{
			for(var i=0; i<data.length ; i++)
			{
				if(data[i].type == "active")
				{
					return i;
				}
			}
			return -1;
		}
        
        var topFrame;//整体框架
        function initTopFrame(){
            topFrame = $(newDiv).appendTo($(newDiv).appendTo('#' + pars.frameId).addClass('frame l it_s')).addClass('it1');
        }
        
        var inputContentDiv;//输入框
        function initInputContentDiv(){
            inputContentDiv = $(newDiv).appendTo(topFrame).addClass('l inputContent').click(function(){gs_inputOnclick();});
        }
        
        var flowFrame;//下拉框架
        function initFlowFrame(){
            flowFrame = $(newDiv).appendTo(topFrame).addClass('flow');
        }
        
        var popEvent;//下拉点击事件
        function initPopEvent(){
            popEvent = $(newDiv).appendTo(flowFrame).click(function(){popFlow();});
        }
        
        var popMenu;//下拉窗口
        function initPopMenu(){
            popMenu = $(newDiv).appendTo(flowFrame).addClass('popMenu');
        }
        
        var popImg;//下拉点击图片
        function initPopImg(){
            popImg = $(newImg).appendTo(popEvent).addClass('cp').attr(({src:pars.img.downOut,alt:pars.message.imgTitle,title:pars.message.imgTitle})).mouseover(function(){this.src=pars.img.downOver}).mouseout(function(){this.src=pars.img.downOut});
        }
        
        var groupMenu;//下拉框顶部区域(组选择)
        function initGroupMenu(){
            groupMenu = $(newDiv).appendTo(popMenu).addClass('groupMenu');
            $(newDiv).appendTo(groupMenu).addClass('l').text(pars.message.select);
        }
        
        var allitems;//下拉框中部区域(子选项)
        function initAllItems(){
            allitems = $(newDiv).appendTo(popMenu).addClass('items');
        }
        
        var buttonsMenu;//下拉框低部区域(按钮)
        function initButtonsMenu(){
            buttonsMenu = $(newDiv).appendTo(popMenu).addClass('buttonsMenu');
        }
        
        var groupspan;//组选择区域
        function initGroupspan(){
            groupspan = $(newSpan).appendTo($(newDiv).appendTo(groupMenu).addClass('r').css('padding-right','20px'));
        }
        
        var groupInput;//组选择控件
        function initGroupInput(){
            groupInput = $(newSelect).appendTo(groupspan).change(function(){initPopData();});
        }
        
        var active;//动态输入框
        var suggest;//供选择框
        var emptysuggest;//提示输入信息
        //输入和备选区域
        function initActiveAndSuggest(){
            var activeDiv = $(newDiv).appendTo(inputContentDiv).addClass('activeDiv');
            active = $(newText).appendTo(activeDiv).addClass('actText').attr({value:'',size:'2',Autocomplete:'off',maxlength:'50'}).keydown(function(event){return gs_inputOnkeydown(event);}).keyup(function(event){gs_inputOnkeyup(event);}).blur(function(){gs_inputOnblur(this);}).focus(function(){gs_inputOnfocus(this);});
            suggest = $(newDiv).appendTo(activeDiv).addClass('suggest').css({display:'none'});
            emptysuggest = $(newDiv).appendTo(activeDiv).addClass('emptySuggest').text(pars.message.active);
        }
        
        function initButtons(){
            var buttonsDiv = $(newDiv).appendTo(buttonsMenu).addClass('buttonsDiv');
            $(newButton).appendTo(buttonsDiv).attr({value:pars.message.buttonOK,title:pars.message.buttonOK}).addClass('gb1').mouseover(function(){this.className='gb1'}).mouseout(function(){this.className='gb1'}).click(function(){addSelectedPopItems();});
            $(newButton).appendTo(buttonsDiv).attr({value:pars.message.buttonCancle,title:pars.message.buttonCancle}).addClass('gb2').mouseover(function(){this.className='gb2'}).mouseout(function(){this.className='gb2'}).click(function(){popMenuCancle();});
            $(newDiv).appendTo(buttonsMenu).addClass('c');
        }
              
        function initClear(components){//清除浮动布局
            return $(newDiv).appendTo(components).addClass('c');
        }

		//返回取得结果函数
		return function ()
	        {
	            var v_tags = "";
	            for(var i=0; i<data.length ; i++)
	            {
	                if(data[i].type == "static")
	                {
	                    v_tags += data[i].id+",";
	                }
	            }
	            if (v_tags == "" && ismustinput)
	            {
	                alert(pars.message.result);
	                return;
	            }
	            return v_tags;
	        };
}
	
});
