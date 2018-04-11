/*	2018.02.07   叶夷    目前不知道这个方法是用来什么的，但是由于在用js改变js文件静态资源方法中会报错，所以先注释*/
/*2018.02.15   叶夷     这个方法是用来封装api这个字段*/
jQuery(document).ready(function($){
    // var event=event?event:(window.event?window.event:null);
    $('.cd-popup-trigger').on('click', function(event){
        event.preventDefault();
        $('.cd-popup').addClass('is-visible');
    });

    $('.cd-popup').on('click', function(event){
        if( $(event.target).is('.cd-popup-close') || $(event.target).is('.cd-popup') ) {
            event.preventDefault();
            $(this).removeClass('is-visible');
        }
    });
    $(document).keyup(function(event){
        if(event.which=='27'){
            $('.cd-popup').removeClass('is-visible');
        }
    });
    function extend(o,p) {
        for(prop in p) { o[prop] = p[prop]; }
        return o;
    }
    function defineClass(constructor,methods,statics) {
        if(methods)extend(constructor.prototype,methods);
        if(statics)extend(constructor,statics);
        return constructor;
    }
    var XunApi=defineClass(function(w,d){this.win = w; this.doc = d;
    },{
        createDom:function(obj,method,a,f){
            var $cd_popup_container = $("<div class='cd-popup-container'></div>");
           var $cd_popup= $("<div class='cd-popup' role='alert'></div>");
           if(method=="confirm")
           {
              $cd_popup_container.append($("<p></p>"));
           }else if(method =="prompt")
           {
              $cd_popup_container.append($("<h2></h2>"));
              $cd_popup_container.append($("<hr/>"));
              $cd_popup_container.append($("<textarea class='text'></textarea>"));
           }
           $cd_popup_container.append("<ul class='cd-buttons'></ul>");
           $cd_popup_container.append($("<a class='cd-popup-close' href='#0'></a>"));
           $cd_popup_container.find("a.cd-popup-close").on("click",function(){
              event.preventDefault();
              $('.cd-popup').removeClass('is-visible');
           });
           $cd_popup.append($cd_popup_container);
           $(obj).append($cd_popup); 
           if(method=="prompt"){
                this.addTitle(a.title);
                this.addText(a.text);
                this.addButton(a.buttons,"prompt",function(r,e){ f(r,e); });
           }else if(method=="confirm"){
                this.addMsg(a.msg);
                this.addButton(a.buttons,"prompt",function(r,e){ f(r,e); });
           }

        },
        clickEnventListener:function(obj,m,f){
            obj.on("click",function(){
                var o = {};
                o.buttonIndex = $(this).index()+1;
                if(m=="prompt"){
                	o.text = $("textarea.text").val();

                    //o.text = $("textarea.text").text();
                }
                f(o,null);
                event.preventDefault();
                //$('.cd-popup').removeClass('is-visible');//这种写法只是删除了定义字,没有删除元素.xu
                $('.cd-popup').remove();
                //removeDiv($('.cd-popup'),userAgent[1]);
            });
        },
        addButton:function(args,method,f){
            $(".cd-buttons").empty();
            for(var i=0;i<args.length;i++)
            {
                var $elem = $("<li><a href='#0'></a></li>");
                $elem.find("a").text(args[i]);;
                $(".cd-buttons").append($elem);
                this.clickEnventListener($elem,method,f);
            }
            $(".cd-buttons li").css("width",100/args.length+"%");
            
        },
        addMsg:function(o){
            $(".cd-popup-container p").html(o);
        },
        addTitle:function(o) {
            $(".cd-popup-container h2").html(o);
        },
        addText:function(o){
            $("textarea.text").val(o);
        },
        confirm:function(a,f){
            event.preventDefault();
            if(!$(".cd-popup").length)
            {
                $(".cd-popup").remove();
                //removeDiv($(".cd-popup"),userAgent[1]);
            }
            this.createDom($("body"),"confirm",a,f);
            $('.cd-popup').addClass('is-visible');
        },
        prompt:function(a,f)
        {
            event.preventDefault();
            if(!$(".cd-popup").length)
            {
                $(".cd-popup").remove();
                //removeDiv($(".cd-popup"),userAgent[1]);
            }
            this.createDom($("body"),"prompt",a,f);
            $('.cd-popup').addClass('is-visible');
        }
    });
    api = new XunApi(window,document);
});

function toast_popup(msg,timeout){
	$("#toastoutline").remove();
	//removeDiv($("#toastoutline"),userAgent[1]);
	var toastE = $("<div class='toastoutline' id='toastoutline'><div class='toastinline' id='toastinline'>   "+msg+" </div> </div>")
	$("body").append(toastE);
	$("#toastinline").css("margin-left",($("#toastoutline").width()-$("#toastinline").width())/2);
	setTimeout(
		function(){
			toastE.remove();
			//removeDiv(toastE,userAgent[1]);
		},
		timeout
	)
}
