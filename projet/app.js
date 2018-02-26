var ns = "http://www.w3.org/2000/svg";

var p_rectangle = /^rectangle-(\d+)/;
var p_cercle = /^cercle-(\d+)/;
var p_line = /^line-(\d+)/;

var svg = document.querySelector('svg');
var pt = svg.createSVGPoint();
var svgP = pt.matrixTransform(svg.getScreenCTM().inverse());



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
		this.fill = "red";
		this.stroke = "black";
		this.frm = null;
	}
	select(){
		this.frm.addEventListener('click', function(e){
			var allStates = $("svg.us > *");
			allStates.removeClass("on");
			$(e.currentTarget).addClass("on");
			console.log($(e.currentTarget));
			console.log(this)
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
		this.width = 300;
		this.height = 200;
		this.Move = null;
		this.Rotate = null;
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
				id: "rectangle-"+ idp
		});
		document.querySelector("svg").appendChild(rectangle);
		this.frm = rectangle;
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
			fill:"red",
			"stroke-width":3,
			stroke:"black",
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
		this.Resize.updatePosition(this.x, this.y)

	}
	updateSize(r){
		this.frm.setAttribute("r",r)
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
		this.m_x = this.x - 5;
		this.m_y = this.y - 5;
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
				this.objForme.x = this.m_x + 5;
				this.objForme.y = this.m_y + 5;
				console.log(this.objForme);
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
			this.s_x = this.x + this.objForme.r ;
			this.s_y = this.y + this.objForme.r ;
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
			this.s_x = this.x + this.objForme.r ;
			this.s_y = this.y + this.objForme.r ;
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
						this.s_x = g.x -5;
						this.s_y = g.y -5;
						this.objForme.r = this.s_x - this.x;
						console.log(this.objForme);
						this.objForme.updateSize(this.objForme.r);
						this.s_proxy.setAttribute('x',this.objForme.x + this.objForme.r);
						this.s_proxy.setAttribute('y',this.objForme.y + this.objForme.r);
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
		this.r_x = this.x + this.objForme.width;
		this.r_y = this.y ;
		
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
		this.x = x;
		this.y = y;
		this.r_x = this.x + this.objForme.width ;
		this.r_y = this.y ;
		
		this.r_proxy.setAttribute("cx", this.r_x);
		this.r_proxy.setAttribute("cy", this.r_y);
	}

	rotate(){

		$(this.r_proxy).bind('mousedown',e=>{
			$(svg).bind('mousemove', e=>{
				var g = svgPoint(this.r_proxy, e.clientX, e.clientY);
				console.log(g);
				var rx = g.x - (this.x + (this.objForme.width/2));
				var ry = g.y - (this.y + (this.objForme.height/2));
				var rad = Math.atan2(ry,rx);
				var deg = rad * (180/Math.PI);
				console.log(ry);
				this.objForme.updateRotate(this.y,this.x,deg);
				this.r_proxy.setAttribute("transform", "rotate("+deg+" "+this.r_x+" "+this.r_y+")")
				this.r_proxy.setAttribute()
				
			
			});
		});

		$(this.r_proxy).bind('mouseup', e=>{
			$(svg).unbind('mousemove');
		});

	}
		
	}
