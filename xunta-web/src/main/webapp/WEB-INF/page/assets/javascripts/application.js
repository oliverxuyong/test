/* 
 * xuntasoapp
 * 这个对象是网站 js 应用程序的 root 命名空间，所有
 * 与  xunta.so 有关的 js 放在这个命名空间下，避免与
 * 其它命名空间冲突
 * LIU: 这里面的代码基本上是用 jQuery 增加 click 事件的处理，获取值，设置样式或者 html，ajax 调用。
 * ajax 调用一个 url ， 传递了参数，设置了 callback function ，定义了返回数据的类型为 html
 */

// 根命名空间
var xuntasoapp = {
	test : function(msg) {
		alert(msg);
	},

	// 页面中使用的 js 的根命名空间
	pages : {}
};

// 搜索结果页 js 命名空间
xuntasoapp.pages.search_result = {
	test : function(msg) {
		alert(msg);
	},
	init : function() {
		/* 对于搜索结果中的每一个用户选择条进行处理 */
		$('.result-item-user-row').each(function() {
			var _user_row = $(this);
			var _author = _user_row.attr('data-author');
			var _site = _user_row.attr('data-site');
			var _user_tab_bar = _user_row.find('.user-tab-bar');
			var _user_tab_content = _user_row.find('.user-tab-content');

			/* 用户标签页点击的处理 */
			_user_tab_bar.find('label').click(function() {
				_user_tab_bar.find('label').removeClass('active disabled');

				var _current_tab_label = $(this);
				_current_tab_label.addClass('disabled');
				var _current_tab_name = _current_tab_label.attr('data-name');
				switch (_current_tab_name) {
				case '最新': {
					load_user_content__latest(_author, _site, _user_tab_content);
					break;
				}
					;
				case '最相关': {
					load_user_content__most_relevent(_author, _site, _user_tab_content);
					break;
				}
					;
				case '词云图': {
					load_user_content__cyt(_author, _site, _user_tab_content);
					break;
				}
					;
				default:
					break;
				}
			});
		});

		/* 转入最新内容 */
		function load_user_content__latest(author, site, content_dom) {
			content_dom.html('最新');
		}

		/* 转入最相关内容  只有这一段是ajax?*/
		function load_user_content__most_relevent(author, site, content_dom) {
			$.get("_temppages/get-html.jsp", {
				author : author,
				site: site
			}, function(data) {
				var _html = data;
				content_dom.html(_html);
				}, "html");
		}

		/* 转入词云图内容 */
		function load_user_content__cyt(author, site, content_dom) {
			content_dom.html('词云图');
		}
	}
};

$(function() {
	// 如果搜索框中没有内容，阻止用户提交，并把焦点设置到搜索框
	$('.search-form').submit(function() {
		if ($(this).find('.search-keywords').val() == '') {
			$(this).find('.search-keywords').focus();
			return false;
		}
	});
	
	/**
	 * 微信图片的显示
	 */
	function js_show_weixinImg()
	{
		$("#img_weixin").fadeIn();
	}
	function js_hidden_weixinImg()
	{
		$("#img_weixin").fadeOut();
	}
	
	/**
	 * 日期格式化
	 * @param {Object} format
	 * @memberOf {TypeName} 
	 * @return {TypeName} 
	 */
	 Date.prototype.format =function(format)
   	{
	       	 var o = {
		        "M+" : this.getMonth()+1, //month
				"d+" : this.getDate(),    //day
				"H+" : this.getHours(),   //hour
				"m+" : this.getMinutes(), //minute
				"s+" : this.getSeconds(), //second
				"q+" : Math.floor((this.getMonth()+3)/3),  //quarter
				"S" : this.getMilliseconds() //millisecond
	        }
	        if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
	        (this.getFullYear()+"").substr(4- RegExp.$1.length));
	        for(var k in o)if(new RegExp("("+ k +")").test(format))
	        format = format.replace(RegExp.$1,
	        RegExp.$1.length==1? o[k] :
	        ("00"+ o[k]).substr((""+ o[k]).length));
	        return format;
   	 }
	 
});


/**
 * 画词云图的方法
 */
//Width and height
	var w = window.screen.width;
	var h = window.screen.height;
	var showWordCloud = function(author_name,site) {
		console.log(author_name+"  "+site);
		//先定义一下取下标的方法
		var getIndex = function(data, str) {
			for (var i = 0; i < data.length; i++) {
				if (data[i].name == str) {
					return i;
				}
			}
		}
		
		//发送post请求，获取json数据
		$.post("http://localhost:8080/DataFactory/wordCloud", {
			"author_name" :author_name,
			"site":site
		}, function(data, err) {
			//生成dataset_nodes;
			//console.log(data);
			var dataset_nodes = data.nodes;
			console.log("节点数："+dataset_nodes.length);
			if(dataset_nodes.length==0)
			{
				$(".user-tab-content").html("<div id='tip'><b>该用户数据过少，词云图无法生成</b></div>");
				$("#content").html("<div id='tip'><b>该用户数据过少，词云图无法生成</b></div>");
				return;
			}
			var edges = data.edges;
			var dataset_edges = [];
			//生成dataset_edges

			for (var i = 0; i < edges.length; i++) {
				var sourceIndex = getIndex(dataset_nodes, edges[i].source);
				var targetIndex = getIndex(dataset_nodes, edges[i].target);
				var weight = edges[i].weight;
				var edge = {
					source : sourceIndex,
					target : targetIndex,
					weight: weight
				};
				dataset_edges.push(edge);
			}

			//Initialize a default force layout, using the nodes and edges in dataset
			var force = d3.layout.force()
			.nodes(dataset_nodes).links(
					dataset_edges)
					.size([ w, h ])
					.linkDistance([ 100 ])
					.theta(0.8)
					.charge([ -1000 ])
					.gravity(0.9)//中心点对其他所有点的拉力,使图形局中
					.start();
			
			$("#tip").remove();
			
		
			//生成取色器
			var colors = d3.scale.category10();

			// 创建比例尺
			var xScale = d3.scale.linear().domain(
					[ 0, d3.max(dataset_nodes, function(d) {
						return d.score;
					}) ]).range([ 0.2, 1 ]);
			var textScale = d3.scale.linear().domain(
					[ 0, d3.max(dataset_nodes, function(d) {
						return d.score;
					}) ]).range([10,60]);

			var weightScale = d3.scale.linear().domain([d3.min(edges,function(d){
				return d.weight;
			}),d3.max(edges,function(d){
				return d.weight;
			})]).range([0.01,0.1]);
			
			
			var svg = d3.select("#div3").append("svg").attr("width", w)
					.attr("height", h);


			var texts = svg.selectAll("text").data(dataset_nodes).enter()
					.append("text").text(function(d) {
						return d.name;
					})
					.attr("id",function(d,i){return "textId"+d.index;})
					.attr("font-family", "sans-serif")
					.attr("font-size",function(d,i){
						return textScale(d.score)+"px";
						})
					.attr("font-wight","bold")
					.attr("fill", function(d, i) {
						return colors(i);		
					})
					.call(force.drag);
			
			texts.append("title").text(function(d) {
				return d.name;
			});
			
			var edges = svg.selectAll("line").data(dataset_edges).enter()
			.append("line")
			.style("stroke", function(d,i){
				//console.log(d);
				return "rgba(100,100,100,"+d.weight+")";
			})
			.style("stroke-width",0.07); 
			
			//Every time the simulation "ticks", this will be called
			force.on("tick", function() {
				
				 edges.attr("x1", function(d) {
						return d.source.x;
					}).attr("y1", function(d) {
						return d.source.y;
					}).attr("x2", function(d) {
						return d.target.x;
					}).attr("y2", function(d) {
						return d.target.y;
					}); 
				 
				texts.attr("x", function(d) {
					return d.x;
				}).attr("y", function(d) {
					return d.y;
				}).attr("text-anchor", "middle")
			});
		});
	}

