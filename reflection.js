(function( window, undefined ) {
	var Reflection = (function() {
		var Reflection=function(){
			var args=arguments
			return new Reflection.fn.init(args);
		}
		function add(fn,namespace,name){
			if(this.fns[namespace]==undefined){
				this.fns[namespace]={}
			}
			this.fns[namespace][name]=fn;			
		}
		function get(namespace,name){
			if(this.fns[namespace]!=undefined && typeof this.fns[namespace][name]=='function'){
				var __method=this.fns[namespace][name];
				return function(){
					__method.apply(this,arguments)
				}
			}else{
				return function(){}
			}			
		}
		Reflection.fn=Reflection.prototype={
			constructor: Reflection,
			init:function(args){
					if(args[0]==undefined){
						for(var k in Reflection.fns['window']){
							this[k]=Reflection.fns['window'][k]
						}
						for(var k in window){
							if(typeof window[k]=='function'&&window[k].prototype==undefined){
								this[k]=window[k];
							}
						}
					}else{
						for(var k in Reflection.fns[args[0]]){
							this[k]=Reflection.fns[args[0]][k]
						}
					}
					if(args[1]){
						this.opts=args[1]
					}
					
			},			
			opts:{}
		}
		Reflection.extend = Reflection.fn.extend = function() {
			var options, name, copy,
				target = arguments[0] || {},
				i = 1,
				length = arguments.length;		
			if ( typeof target !== "object" ) {
				target = {};
			}		
			if ( length === i ) {

				target = this;
				--i;
			}	
			
			for ( ; i < length; i++ ) {								
				if ((options = arguments[i]) != null ) {
					for ( name in options ) {
						copy = options[ name ];		
						if ( target === copy ) {
							continue;
						}
						if ( copy !== undefined ) {
							target[ name ] = copy;
						}
					}
				}
			}
			return target;
		};
		Reflection.extend({
			add:add,
			get:get,
			index:0,
			version:0.1,
			fns:{}
		})
		Reflection.fn.init.prototype = Reflection.fn;
		return Reflection;
	})()
	function reflection(namespace,name){		
		var __method=this;
		namespace=namespace||'window';
		name=name||__method.name||'lambda'+(Reflection.index++)
		Reflection.add(__method,namespace,name);
		return function(){
			__method.apply(this,arguments)
		}
	}
	window.Reflection=window.R=Reflection;
	Function.prototype.r=reflection;
})(window);
