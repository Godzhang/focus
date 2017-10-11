(function(){
	var Focus = function(options){
		this.opt = options || {};
		this.list = this.opt.list;
		this.item = this.opt.item || this.list.children;
		this.len = this.item.length || 0;
		this.imgWidth = this.opt.imgWidth || this.list.offsetWidth;
		this.point = this.opt.point;
		this.pointTag = this.opt.pointTag || "b";
		this.active = this.opt.active || "act";
		this.event = this.opt.event || "click";
		this.prev = this.opt.prev || document.getElementById("prev");
		this.next = this.opt.next || document.getElementById("next");
		this.time = this.opt.time;    //轮播时间，默认不轮播
		this.timer = null;
		this.moveTimer = null;
		this.index = 0;
		this.flag = true;
		this.init();
	}
	Focus.prototype = {
		init: function(){
			var self = this;
			//初始化图片位置
			this.initialImg();
			//初始化焦点,绑定焦点事件(默认点击)
			if(typeof this.point != "undefined"){
				this.initialPoint();
				this.pointEvent();
			}			
			//绑定箭头点击事件
			this.prev.addEventListener("click", function(){
				self.moveToLeft();
			}, false);
			this.next.addEventListener("click", function(){
				self.moveToRight();
			}, false);
			
			//自动轮播
			if(this.time){
				this.timer = setInterval(function(){
					self.moveToRight();
				}, this.time);
				this.hoverEvent();
			}
		},
		moveToLeft: function(i){
			var self = this;
			if(!this.flag) return;
			this.flag = false;
			var previous = this.index;

			if(typeof i != "undefined"){
				this.index = i;
			}else{
				this.index = --this.index < 0 ? this.len - 1 : this.index;
			}
			this.lightOn(this.index);
			var item = this.item[this.index];
			this.list.style.width = this.imgWidth * 2 + "px";
			this.list.style.left = -this.imgWidth + "px";
			this.item[previous].style.left = this.imgWidth + "px";
			item.style.display = "block";
			item.style.left = 0 + "px";
			item.style.top = 0 + "px";
			this.move(0 , function(){
				self.item[previous].style.display = "none";
				self.flag = true;
			});
		},
		moveToRight: function(i){
			var self = this;
			if(!this.flag) return;
			this.flag = false;
			var previous = this.index;

			if(typeof i != "undefined"){
				this.index = i;
			}else{
				this.index = ++this.index === this.len ? 0 : this.index;
			}
			this.lightOn(this.index);
			var item = this.item[this.index];
			this.list.style.width = this.imgWidth * 2 + "px";
			item.style.display = "block";
			item.style.left = this.imgWidth + "px";
			item.style.top = 0 + "px";
			this.move(-this.imgWidth, function(){
				self.list.style.left = 0 + "px";
				item.style.left = 0 + "px";
				self.item[previous].style.display = "none";
				self.flag = true;
			});
		},
		initialImg: function(){
			this.item[0].style.display = "block";
		},
		initialPoint: function(){
			var frag = document.createDocumentFragment();
			for(var i = 0; i < this.len; i++){
				var tag = document.createElement(this.pointTag);
				tag.innerHTML = i + 1;
				if(i === 0){
					tag.className = this.active;
				}
				frag.appendChild(tag);
			}
			this.point.appendChild(frag);
		},
		// move: function(dis, fn){
		// 	var self = this;
		// 	clearInterval(this.moveTimer);
		// 	this.moveTimer = setInterval(function(){
		// 		var speed = (dis - self.list.offsetLeft) / 10;
		// 		speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
		// 		self.list.style.left = self.list.offsetLeft + speed + "px";
		// 		if(self.list.offsetLeft === dis){
		// 			clearInterval(self.moveTimer);
		// 			if(fn){
		// 				fn();
		// 			}
		// 		}
		// 	},20);
		// },
		move: function(dis, fn){
			var self = this;
			clearInterval(this.moveTimer);  //清除定时器
			var speed = (dis - self.list.offsetLeft) / 10;
			this.moveTimer = setInterval(function(){

				self.list.style.left = self.getLeft(self.list) + speed + "px";

				if(self.list.offsetLeft === dis){
					clearInterval(self.moveTimer);
					if(fn){
						fn();
					}
				}
			},20);
		},
		getLeft: function(elem){
			var left = getComputedStyle(elem).left;
			return Number(left.replace(/px/, ""));
		},
		pointEvent: function(){
			var self = this;
			var point = this.point.getElementsByTagName(this.pointTag);
			for(var i = 0, len = point.length; i < len; i++){
				point[i].index = i;
				point[i].addEventListener(this.event,function(){
					if(!self.flag) return;
					if(this.index > self.index){
						self.moveToRight(this.index);
					}else if(this.index < self.index){
						self.moveToLeft(this.index);
					}else{
						return;
					}
				},false);
			}
		},
		lightOn: function(index){
			if(typeof this.point == "undefined") return;
			var point = this.point.getElementsByTagName(this.pointTag);
			for(var i = 0, len = point.length; i < len; i++){
				if(i === index){
					point[i].className = this.active;
				}else{
					point[i].className = "";
				}
			}
		},
		hoverEvent: function(){
			var self = this;
			var hoverArr = [this.list];
			if(typeof this.point != "undefined"){
				hoverArr.push(this.point);
			}
			if(typeof this.prev != "undefined"){
				hoverArr.push(this.prev);
			}
			if(typeof this.next != "undefined"){
				hoverArr.push(this.next);
			}
			hoverArr.forEach(function(val, i){
				if(!val) return;
				val.addEventListener('mouseover', function(){
					clearInterval(self.timer);
				}, false);
				val.addEventListener('mouseout', function(){
					clearInterval(self.timer);
					self.timer = setInterval(function(){
						self.moveToRight();
					}, self.time);
				}, false);
			});
		}
	}
	window.Focus = Focus;
})();