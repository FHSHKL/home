function LG_script_init()
{
	const script_version="7.3.102";

	function chat()
	{
		console.log("LG-chat");
		var s=document.createElement("style");
		s.innerHTML=".message{word-break:break-all;}";
		document.head.appendChild(s);
	}

	function background()
	{
		console.log("LG-background");
		var bac=document.getElementsByClassName("background")[0];
		bac.style.zIndex=1;
		var s=bac.parentNode.children[1];
		for(var i=0;i<3;i++)
		{
			s.children[i].style.zIndex=2;
		}

		s=document.getElementsByClassName("user-nav")[0];
		s.style.backgroundColor="rgb(255,255,255,.5)";
		s.style.padding="5px";
		s.style.borderRadius="10px";

		s=document.getElementsByClassName("header-link color-none");
		for(var i=0;i<2;i++)
		{
			s[i].style.backgroundColor="rgb(255,255,255,.5)";
			s[i].style.padding="5px";
			s[i].style.borderRadius="10px";
		}
	}

	function search_by_name()
	{
		console.log("LG-seanchname");
		document.getElementsByClassName("lg-article lg-index-stat")[0].innerHTML=
		"<h2>题目名搜索</h2><p><input type='text' class='am-form-field' placeholder='输入要搜索的题目名' name='probnamesearchbox'></input></p><button class='am-btn am-btn-danger am-btn-sm' name='probnamesearch'>进入题库界面</button>&#32;<button class=\"am-btn am-btn-primary am-btn-sm\" name=\"gotorandom\">随机跳题</button>";
		document.getElementsByClassName("am-u-lg-3 am-u-md-4 lg-right")[0].firstElementChild.innerHTML=
		"<h2>用户名搜索</h2><p><input type='text' class='am-form-field' placeholder='输入要搜索的用户名' name='usernamesearchbox'></input></p><button class='am-btn am-btn-danger am-btn-sm' name='usernamesearch'>进入用户主页</button>&#32;<div class=\"users_cd\" id=\"user_list\"></div>";
		function LG_search_name_slove()
		{
			var username=document.getElementsByName("usernamesearchbox")[0].value;
			$.get(
				"https://www.luogu.com.cn/fe/api/user/search?keyword="+username,
				function (data)
				{
					if(data["users"][0]==null)
					{
						show_alert("找不到用户");
						return;
					}
					var tarid=data["users"][0].uid;
					window.open("https://www.luogu.com.cn/user/"+tarid);
				}
			);
		}

		function LG_search_prob_slove()
		{
			var uprobname=document.getElementsByName("probnamesearchbox")[0].value;
			var pid=uprobname.match(/(uva|at|poj|cf|sp|u|t|p)?\d+[a-z]?/ig);
			var withp=uprobname.match(/(uva|at|poj|cf|sp|u|t|p)/ig);
			if(pid==null)
			{
				window.open("https://www.luogu.com.cn/problem/list?keyword="+encodeURIComponent(uprobname));
			}
			else
			{
				pid=pid[0].toLocaleUpperCase();
				if(withp==null)
				{
					window.open("https://www.luogu.com.cn/problem/P"+pid);
				}
				else
				{
					window.open("https://www.luogu.com.cn/problem/"+pid);
				}
			}
		}
		$("[name=gotorandom]").click(function () {window.open('/problemnew/show/P' + (parseInt(Math.random(0, 1) * 4503) + 1000));});
		$("[name=probnamesearch]")[0].onclick=function(){LG_search_prob_slove();};
		$("[name=probnamesearchbox]").keydown(function (e) {if (e.keyCode==13){LG_search_prob_slove();}});
		$("[name=usernamesearch]")[0].onclick=function(){LG_search_name_slove();};
		$("[name=usernamesearchbox]").keydown(function (e) {if (e.keyCode==13){LG_search_name_slove();}});
	};

	function record()
	{
		console.log("LG-record-coding");
		return;
		var uid=window._feInjection.currentData.user.uid;
		var ybt=document.getElementsByClassName("user-action")[0];
		ybt.innerHTML+=`<a data-v-445f91a0="" data-v-147b298c="" href="https://www.luogu.com.cn/blog/firehumansskeleton/" class="color-none" data-v-796309f8=""><button data-v-86f36770="" data-v-147b298c="" type="button" class="btn lfe-form-sz-middle" data-v-445f91a0="" style="border-color: rgba(255, 255, 255, 0.5); color: rgb(255, 255, 255); background-color: rgba(0, 0, 0, 0.5);"><svg data-v-147b298c="" data-v-86f36770="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="rss" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-rss fa-w-14"><path data-v-147b298c="" data-v-86f36770="" fill="currentColor" d="M128.081 415.959c0 35.369-28.672 64.041-64.041 64.041S0 451.328 0 415.959s28.672-64.041 64.041-64.041 64.04 28.673 64.04 64.041zm175.66 47.25c-8.354-154.6-132.185-278.587-286.95-286.95C7.656 175.765 0 183.105 0 192.253v48.069c0 8.415 6.49 15.472 14.887 16.018 111.832 7.284 201.473 96.702 208.772 208.772.547 8.397 7.604 14.887 16.018 14.887h48.069c9.149.001 16.489-7.655 15.995-16.79zm144.249.288C439.596 229.677 251.465 40.445 16.503 32.01 7.473 31.686 0 38.981 0 48.016v48.068c0 8.625 6.835 15.645 15.453 15.999 191.179 7.839 344.627 161.316 352.465 352.465.353 8.618 7.373 15.453 15.999 15.453h48.068c9.034-.001 16.329-7.474 16.005-16.504z" class=""></path></svg>&nbsp;个人博客</button></a>`;
	}

	function punch()
	{
		console.log("LG-punch");
		if(document.getElementsByName("punch").length>0)
		{
			document.getElementsByName("punch")[0].click();
		}
	}

	function init()
	{
		if(document.getElementsByName("LG_script").length>1)
		{
			return;
		}
		var nurl=location.host+location.pathname;
		console.log("LG-version:"+script_version);
		if((typeof(jQuery)).toLocaleUpperCase()!="undefined")
		{
			console.log("jQuery已加载");
		}
		else
		{
			console.log("未检测到jQuery");
			var jq=document.createElement("script");
			jq.setAttribute("src","https://huokulou.tk/static/js/jquery.js");
			document.head.appendChild(jq);
			console.log("jQuery已加载");
		}
		var to_do_list={
			"www.luogu.com.cn":"punch();search_by_name();background();",
			"www.luogu.com.cn/":"punch();search_by_name();background();",
			"www.luogu.com.cn":"punch();search_by_name();background();",
			"www.luogu.com.cn/":"punch();search_by_name();background();",
			"match_0":"record();",
			"match_1":"chat();"
		};
		var match_list=[
			/www\.luogu.+\/user\//ig,
			/www\.luogu.+\/chat/ig
		];
		for(var i=0;i<match_list.length;i++)
		{
			if(location.href.match(match_list[i]))
			{
				eval(to_do_list["match_"+i]);
			}
		}
		eval(to_do_list[nurl]);
	}

	function updata_script()
	{
		console.log("LG-updata");
		localStorage.setItem("LG_script_version",script_version);
		localStorage.setItem("LG_script",LG_script_init.toString().replace("LG_script_init","LG_load_from_local"));
	}

	function check_version()
	{
		var version=localStorage.getItem("LG_script_version");
		
		if(version!=null)
		{
			if(version==script_version)
			{
				init();
			}
			else
			{
				updata_script();
			}
		}
		else
		{
			updata_script();
			init();
		}
	}

	check_version();
	
}
