(function( window, undefined ) {
	var ClassName = (function() {
		var ClassName=function(){
			var args=arguments
			return new ClassName.fn.init(args);
		}
		ClassName.fn=ClassName.prototype={
			constructor: ClassName,
			init:function(args){
				this.opts=args
				console.log(args)
			},
			version:'0.1',
			_get:function(){
				
			},
			_set:function(lst){
				
			},
			opts:{}
		}
		ClassName.fn.init.prototype = ClassName.fn;
		return ClassName;
	})()
	window.ClassName=ClassName;
})(window);
