var ns = "http://www.w3.org/2000/svg";

var p_rectangle = /^rectangle-(\d+)/;
var p_cercle = /^cercle-(\d+)/;
var p_line = /^line-(\d+)/;
var p_poly = /^polygon-(\d+)/;

var svg = document.querySelector('svg');
var pt = svg.createSVGPoint();
var svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

var param = document.querySelector('#parametre');
var colorF = document.createElement("input");
colorF.setAttribute("type", "color");
var colorS = document.createElement("input");
colorS.setAttribute("type", "color");
var wStroke = document.createElement("input");
wStroke.setAttribute("type", "number");
$(wStroke).attr({
		min:0,
		max:50
});

var nForme = document.querySelector('#newForm');

//var zone = new Zone();

var nml = document.querySelector('#NoMansLand');

function svgPoint(element, x, y) {
  
		var pt = svg.createSVGPoint();
		pt.x = x;
		pt.y = y;
		return pt.matrixTransform(element.getScreenCTM().inverse());
  
	}



function addRectangle(){

	var rectangle = new Rectangle();
	rectangle.ajout();
}

function addCircle(){
	var circle = new Circle();
	circle.ajout();
}

nml.addEventListener('click', e=>{
	var allStates = $("svg.us > *");
	allStates.removeClass("on");
	$(".pr_on").removeClass("pr_on").addClass("pr_off");
});

var test = document.querySelectorAll("svg.us > *")


var pointFormeX = [];
var pointFormeY = [];
$(nForme).bind('click', e=>{
	$(window).unbind('keydown');
	$(test).unbind('click');
	$(svg).bind('click', e=>{
			
			var g = svgPoint(svg, e.clientX, e.clientY);
			let x = g.x;
			let y = g.y;
			pointFormeX.push(x);
			pointFormeY.push(y);
	});
	$(window).bind('keydown', e=>{
					if(e.keyCode == 13){
						var polygon = new Polygon(pointFormeX, pointFormeY);
						polygon.ajout();
						pointFormeX = [];
						pointFormeY = [];
						$(window).unbind('keydown');
						$(svg).unbind('click');
					}
			});
});



class Zone{
	constructor(){
		this.formes = new Map(); 
	}

	add(id,frm){
		this.formes.set(id,frm);
	}

	check(id){
		this.formes.get(id);
	}

	delete(){
		this.formes.delete(id);
	}

	focus(){

	}
}



class Forme /*extends Zone*/{
	constructor(){
		this.x = 20;
		this.y = 20;
		this.fill = "#ff0000";
		this.stroke = "#000000";
		this.wStroke = 3;
		this.frm = null;
	}
	select(){
		$(this.frm).bind('click', e=>{
			var allStates = $("svg.us > *");
			allStates.removeClass("on");
			$(e.currentTarget).addClass("on");
			console.log($(e.currentTarget));
			console.log(this)
			$(".pr_on").removeClass("pr_on").addClass("pr_off");
			$(window).unbind('keydown');
			$(colorF).unbind('change');
			$(colorS).unbind('change');
			$(wStroke).unbind('input');
			if(param.firstElementChild){
					param.removeChild(colorF);
					param.removeChild(colorS);
					param.removeChild(wStroke);
				}

			
			$(window).bind('keydown', e=>{
				var x = e.which || e.keyCode;
				if(this.frm.getAttribute("class") == "on"){
					if(e.keyCode == 46){
					console.log(this.frm);
					var idl = this.frm.getAttribute("id");
					var re = document.querySelectorAll('[id^='+ idl +']');
					console.log(re)
					for (let i of re) {
	  						svg.removeChild(i); // affiche 3, 5, 7
					}
					delete(this.frm);
					delete(this.Rotate);
					delete(this.Move);
					delete(this.Resize);
					$(window).unbind('keydown');
					}
				}
				
				else if(e.keyCode == 80){
					console.log("parametre")
					colorF.setAttribute("value", this.frm.getAttribute("fill"))
					console.log(this.frm)
					param.appendChild(colorF);
					$(colorF).bind("change", e=>{
						console.log(e.target.value)
						this.fill = e.target.value;
						this.frm.setAttribute("fill", e.target.value)
						
					});
					colorS.setAttribute("value", this.frm.getAttribute("stroke"))
					param.appendChild(colorS);
					$(colorS).bind("change", e=>{
						console.log(e.target.value)
						this.stroke = e.target.value;
						this.frm.setAttribute("stroke", e.target.value)
					});
					wStroke.setAttribute("value", this.frm.getAttribute("stroke-width"));
					param.appendChild(wStroke);
					$(wStroke).bind("input", e=>{
						console.log(e.target.value)
						if(e.target.value <= 50 && e.target.value >= 0){
							this.wStroke = e.target.value;
							this.frm.setAttribute("stroke-width", e.target.value)
						}
					});

				}
			});
		});
		


		console.log(this.frm);
	}

	add(){
		super.add();
	}

}




class Rectangle extends Forme{
	
	constructor(){
		super();
		this.width = 100;
		this.height = 60;
		this.Move = null;
		this.Rotate = null;
		this.Resize = null;
	}

	ajout(){

		var rectangle = document.createElementNS(ns, "rect" );
		var idp = document.querySelectorAll('[id^="rectangle-"]').length + 1;
		$(rectangle).attr({
				x:this.x,
				y:this.y,
				width:this.width,
				height:this.height,
				fill:this.fill,
				stroke:this.stroke,
				"stroke-width":this.wStroke,
				id: "rectangle-"+ idp
		});
		document.querySelector("svg").appendChild(rectangle);
		this.frm = rectangle;
		console.log(this.frm)
		this.Move = new Pr_Move(this);
		this.Resize = new Pr_Resize(this);
		this.Rotate = new Pr_Rotate(this);
		this.select();

	}

	select(){
		super.select();
		this.frm.addEventListener('click', e=>{
			console.log(this);
				this.Move.show();
				this.Resize.show();
				this.Rotate.show();
		});
	}


	add(){
		super.add();
	}

	updatePosition(x,y){
		this.frm.setAttribute("x",x);
		this.frm.setAttribute("y",y);
		this.x = x;
		this.y = y;
		this.Resize.updatePosition(this.x, this.y)
		this.Rotate.updatePosition(this.x, this.y)
	}

	updateSize(width,height){
		this.frm.setAttribute("width", width);
		this.frm.setAttribute("height", height);
		this.Rotate.updatePosition(this.x,this.y);
	}
	updateRotate(x,y,deg){
		this.frm.setAttribute("transform", "rotate("+deg+" "+x+" "+y+")")
		this.Resize.updateRotate(x,y,deg)
		this.Move.updateRotate(x,y,deg)
	}




}

class Circle extends Forme{
	constructor(){
		super();
		this.r = 20
		this.Move = null
		this.Resize = null
	}

	ajout(){

		var cercle = document.createElementNS(ns, "circle" ); 
		var idp = document.querySelectorAll('[id^="circle-"]').length + 1;
		$(cercle).attr({
			cx: this.x,
			cy: this.y,
			r:40,
			fill:this.fill,
			"stroke-width":this.wStroke,
			stroke:this.stroke,
			id:"circle-"+idp
		});
		document.querySelector("svg").appendChild(cercle);
		this.frm = cercle;
		this.Move = new Pr_Move(this);
		this.Resize = new Pr_Resize(this);
		this.select();

	}

	select(){
		super.select();
		this.frm.addEventListener('click', e=>{
			console.log(this);
				this.Move.show();
				this.Resize.show();
		});
	}
	updatePosition(x,y){
		this.frm.setAttribute("cx",x);
		this.frm.setAttribute("cy",y);
		this.x = x;
		this.y = y,
		this.Resize.updatePosition(this.x, this.y)

	}
	updateSize(r){
		this.r = r;
		this.frm.setAttribute("r",r)
		console.log(r)
		console.log(this.r)
		console.log(this.frm.getAttribute('r'))
	}
	
}

class Polygon extends Forme{
		constructor(pointX,pointY){
			super();
			this.pointX = pointX;
			this.pointY = pointY;
			this.Move = null;
			this.Rotate = null;
		}
		ajout(){


		var polygon = document.createElementNS(ns, "polygon" ); 
		var idp = document.querySelectorAll('[id^="polygon-"]').length + 1;

		var at = "";
		for(var i=0; i < this.pointX.length; i++){
			at = at + this.pointX[i] + "," + this.pointY[i] + " ";
		}
		console.log(at)
		$(polygon).attr({
			points: at,
			fill:this.fill,
			"stroke-width":this.wStroke,
			stroke:this.stroke,
			id:"polygon-"+idp
			
		});
		

		document.querySelector("svg").appendChild(polygon);
		this.frm = polygon;
		this.Move = new Pr_Move(this);
		this.Rotate = new Pr_Rotate(this);
		this.select();
		}

		select(){
			super.select();
			this.frm.addEventListener('click', e=>{
				this.Move.show();
				this.Rotate.show();
		});
		}

		updatePosition(x,y){
		this.frm.setAttribute("transform", "translate("+x+","+y+")");
		this.Rotate.updatePosition(x, y)
	}
	updateRotate(x,y,deg){
		this.frm.setAttribute("transform", "rotate("+deg+" "+x+" "+y+")")
		this.Move.updateRotate(x,y,deg)
	}
}


class Proxy{

	constructor(objForme){
		this.objForme = objForme;
		this.id = objForme.id;
		this.x = objForme.x;
		this.y = objForme.y;
		this.m_proxy = null;
		this.s_proxy = null;

	}

	hide(){
		$(this.m_proxy).removeClass("pr_on");
		$(this.m_proxy).addClass("pr_off");
	}

	show(){
		$(this.m_proxy).removeClass("pr_off");
		$(this.m_proxy).addClass("pr_on");
	}

	// addeventlistener
}

class Pr_Move extends Proxy{
	constructor(objForme){
		super(objForme);
		if(p_poly.test(this.objForme.frm.id)){
			this.m_x = this.objForme.pointX[0]
			this.m_y = this.objForme.pointY[0]
			console.log(this.objForme.pointY[0])
		}
		else{
			this.m_x = this.x - 5;
			this.m_y = this.y - 5;
		}
		var rectangle = document.createElementNS(ns, "rect" );
		$(rectangle).attr({
				x:this.m_x,
				y:this.m_y,
				width:10,
				height:10,
				fill:"blue",
				stroke:"black",
				id: this.objForme.frm.id + "_1"
		});
		document.querySelector("svg").appendChild(rectangle);
		this.m_proxy = rectangle;
		$(this.m_proxy).addClass("pr_off");

		this.move();

	}
	show(){
		super.show();
	}
	hide(){
		super.hide();
	}


	move(){
		console.log(this.objForme);
		$(this.m_proxy).bind('mousedown',e=>{
			$(svg).bind('mousemove', e=>{
				var g = svgPoint(this.m_proxy, e.clientX, e.clientY);
				console.log(g);
				this.m_x = g.x - 5;
				this.m_y = g.y - 5;
				this.x = this.m_x + 5;
				this.y = this.m_x + 5;
				this.m_proxy.setAttribute("x",this.m_x);
				this.m_proxy.setAttribute("y",this.m_y);

				if(p_poly.test(this.objForme.frm.id)){
					this.objForme.x = this.m_x + 5 - this.objForme.pointX[0];
					this.objForme.y = this.m_y + 5 - this.objForme.pointY[0];
				}
				else{
					this.objForme.x = this.m_x + 5;
					this.objForme.y = this.m_y + 5;
					console.log(this.objForme);
				}

				this.objForme.updatePosition(this.objForme.x,this.objForme.y);
			});
		});

		$(this.m_proxy).bind('mouseup', e=>{
			$(svg).unbind('mousemove');
		});

	}
	updateRotate(x,y,deg){
		this.m_proxy.setAttribute("transform", "rotate("+deg+" "+x+" "+y+")")
	}
	

}

class Pr_Resize extends Proxy{
	constructor(objForme){
		super(objForme);
		if(p_rectangle.test(this.objForme.frm.id )){
			this.s_x = this.x + this.objForme.width - 5;
			this.s_y = this.y + this.objForme.height - 5;
		}
		else{
			this.s_x = this.x + this.objForme.r +10;
			this.s_y = this.y - 5;
			console.log(this.objForme.r)
		}
		
		var rectangle = document.createElementNS(ns, "rect" );
		$(rectangle).attr({
				x:this.s_x,
				y:this.s_y,
				width:10,
				height:10,
				fill:"blue",
				stroke:"black",
				id: this.objForme.frm.id + "_2"
		});
		document.querySelector("svg").appendChild(rectangle);
		this.s_proxy = rectangle;
		$(this.s_proxy).addClass("pr_off");

		this.resize();
	}

	show(){
		$(this.s_proxy).removeClass("pr_off");
		$(this.s_proxy).addClass("pr_on");
	}

	updatePosition(x,y){
		console.log(x)
		this.x = x;
		this.y = y;
		if(p_rectangle.test(this.objForme.frm.id )){
			this.s_x = this.x + this.objForme.width - 5;
			this.s_y = this.y + this.objForme.height - 5;
		}
		else{
			console.log(this.objForme.r);
			this.s_x = this.x + this.objForme.r -5;
			this.s_y = this.y - 5;
		}
		
		this.s_proxy.setAttribute("x", this.s_x);
		this.s_proxy.setAttribute("y", this.s_y);
	}

	resize(){

		$(this.s_proxy).bind('mousedown',e=>{
			$(svg).bind('mousemove', e=>{
				var g = svgPoint(this.s_proxy, e.clientX, e.clientY);
				console.log(g);
				if(g.x > this.x && g.y > this.y){
					if(p_rectangle.test(this.objForme.frm.id )){
						this.s_x = g.x - 5;
						this.s_y = g.y - 5;
						this.objForme.width = this.s_x - this.x + 5;
						this.objForme.height = this.s_y - this.y + 5;
						this.s_proxy.setAttribute('x',this.s_x);
						this.s_proxy.setAttribute('y',this.s_y);
						console.log(this.objForme);
						this.objForme.updateSize(this.objForme.width,this.objForme.height);
					}
					else{
						if(g.x -5 - this.x > 0){
						this.s_x = g.x ;
						this.s_y = g.y ;
						this.objForme.r = Math.sqrt(Math.pow(this.s_x  - this.x,2)+Math.pow(this.s_y - this.y,2) );
						console.log(this.objForme);
						this.objForme.updateSize(this.objForme.r);
						this.s_proxy.setAttribute('x',this.s_x - 5);
						this.s_proxy.setAttribute('y',this.s_y - 5);
						console.log(this.objForme.r)
					}
					}
					
			}
			});
		});

		$(this.s_proxy).bind('mouseup', e=>{
			$(svg).unbind('mousemove');
		});

	}
	updateRotate(x,y,deg){
		this.s_proxy.setAttribute("transform", "rotate("+deg+" "+x+" "+y+")")
	}

}

class Pr_Rotate extends Proxy{

	constructor(objForme){
		super(objForme);
		if(p_poly.test(this.objForme.frm.id)){
			this.r_x = this.objForme.pointX[1]
			this.r_y = this.objForme.pointY[1]
			this.x = this.objForme.pointX[0]
			this.y = this.objForme.pointY[0]
			console.log(this.objForme.pointY[1])
		}
		else{
			this.r_x = this.x + this.objForme.width;
			this.r_y = this.y ;
		}
		var circle = document.createElementNS(ns, "circle" );
		$(circle).attr({
				cx:this.r_x,
				cy:this.r_y,
				r:5,
				fill:"blue",
				stroke:"black",
				id: this.objForme.frm.id + "_3"
		});
		document.querySelector("svg").appendChild(circle);
		this.r_proxy = circle;
		$(this.r_proxy).addClass("pr_off");

		this.rotate();
	}

	show(){
		$(this.r_proxy).removeClass("pr_off");
		$(this.r_proxy).addClass("pr_on");
	}

	updatePosition(x,y){
		console.log(x)
		
		if(p_poly.test(this.objForme.frm.id)){
			this.r_proxy.setAttribute("transform", "translate("+x+","+y+")");
		}
		else{
			this.x = x;
			this.y = y;
			this.r_x = this.x + this.objForme.width ;
			this.r_y = this.y ;
		
			this.r_proxy.setAttribute("cx", this.r_x);
			this.r_proxy.setAttribute("cy", this.r_y);
		}
	}

	rotate(){

		$(this.r_proxy).bind('mousedown',e=>{
			$(svg).bind('mousemove', e=>{
				var g = svgPoint(this.r_proxy, e.clientX, e.clientY);
				console.log(g);
				this.r_proxy.setAttribute('cx', g.x)
				this.r_proxy.setAttribute('cy', g.y)
				var rx = this.r_proxy.getAttribute('cx')  - this.x ;
				var ry = this.r_proxy.getAttribute('cy') - this.y ;
				
				var rad = Math.atan2(ry,rx);
				

				this.deg = rad * (180/Math.PI);

				
				console.log(this.deg);
				
				this.objForme.updateRotate(this.x,this.y,this.deg);
			});
		});

		$(this.r_proxy).bind('mouseup', e=>{
			$(svg).unbind('mousemove');
			this.r_proxy.setAttribute("transform", "rotate("+this.deg+" "+this.objForme.x+" "+this.objForme.y+")")
			this.updatePosition(this.x,this.y)
		});

	}
		
	}
