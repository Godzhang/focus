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
		this.prev = this.opt.prev || document.getElementById("prev");
		this.next = this.opt.next || document.getElementById("next");
		this.timer = null;
		this.moveTimer = null;
		this.index = 0;
		this.init();
	}
	Focus.prototype = {
		init: function(){
			var self = this;
			//初始化图片位置
			this.initialImg();
			//初始化焦点
			this.initialPoint();
			//绑定点击事件
			this.prev.addEventListener("click", function(){
				self.move(self.item[self.index], self.imgWidth);
				self.index = --self.index < 0 ? self.len - 1 : self.index;
				self.item[self.index].style.left = -self.imgWidth + "px";
				self.move(self.item[self.index], 0);
			}, false);
			this.next.addEventListener("click", function(){
				self.move(self.item[self.index], -self.imgWidth);
				self.index = ++self.index === self.len ? 0 : self.index;
				self.item[self.index].style.left = self.imgWidth + "px";
				self.move(self.item[self.index], 0);
			}, false);
		},
		initialImg: function(){
			var img = this.item;
			for(var i = 1; i < this.len; i++){
				img[i].style.left = this.imgWidth + "px";
			}
			img[0].style.left = 0 + "px";
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
		move: function(elem, dis){
			var self = this;
			clearInterval(elem.timer);		
			elem.timer = setInterval(function(){
				var speed = (dis - elem.offsetLeft) / 10;
				speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
				elem.style.left = elem.offsetLeft + speed + "px";
				if(elem.offsetLeft === dis){
					clearInterval(elem.timer);
				}
			},20);
		}
	}






	window.Focus = Focus;
})();