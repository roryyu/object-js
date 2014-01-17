(function(window, undefined){
    function obj(o) {
        function F() {}
        F.prototype = o;
        return new F();
    }
    function inherit(subClass,superClass){
        var proto=obj(superClass.prototype);
        proto.constructor=subClass;
        subClass.prototype=proto;
    }
    function extend(o){
        o=o||{};
        for(var j=1;j<arguments.length;j++){
            var t=arguments[j]||{};
            var tmp=obj(t);
            for(var i in tmp){
                o[i]=o[i]||tmp[i];
            }            
        }
        return o;        
    }
    function joint(a,b){
        for(var i=0;i<b.length;i++){
            var flg=true;
            for(var j=0;j<a.length;j++){
                if(a[j]==b[i]){flg=false}
            }
            if(flg){a.push(b[i])}
        }
        return a;
    }
    function create(cls){
        var tmp="function {CLASS}(){{CLASS}._constructor.apply(this,arguments);};{CLASS}.prototype.constructor={CLASS};window.{CLASS}={CLASS}";
        return eval(tmp.replace(/{CLASS}/g,cls));
    }
    function Class(o){
        var default_opts={
            '_constructor':function(){},
            'classname':'Class'+Class.inx++,
            'public':{},
            'protected':{},
            'private':{},
            'extends':null,
            'implements':null
        }
        o=extend(o,default_opts);       
        create(o.classname);
        var cls=window[o.classname];        
        cls._private={};
        if(o['extends']){
            var pCls=window[o['extends']];
            inherit(cls,pCls)
            cls._parent=pCls;
            cls.prototype._parent=function(key){
                return cls._parent[key];
            }
            if(pCls._protected.length>0){
                for(var i=0;i<pCls._protected.length;i++){
                    var k=pCls._protected[i];
                    cls._private[k]=cls.prototype[k];
                    delete(cls.prototype[k]);
                }
            }
            o.__constructor=o._constructor;
            o._constructor=function(){
                pCls._constructor.apply(this,arguments);
                o.__constructor.apply(this,arguments);
            }            
        }       
        cls._constructor=o._constructor;
        cls._private=extend(cls._private,o['private']);
        var _protected=[];
        for(var pped in o['protected']){
            _protected.push(pped);
        }
        cls._protected=_protected;
        cls.prototype.extend=function(){
            var a=[this];
            for(var i=0;i<arguments.length;i++){
                a.push(arguments[i])
            }
            extend.apply(this,a);
        }
        //TODO:click public function and protected function       
        cls.prototype.extend(o['public'],o['protected'],{
            '_private':function(objname){
                var pva=extend({},cls._private);
                return pva[objname]||{};
            }
        });
        if(o['implements']){
            var imp=window[o['implements']];
            var funs=imp.functions;
            for(var i=0;i<funs.length;i++){
                var flg=false;
                for(var pp in cls.prototype){
                    if(pp==funs[i]){flg=true}
                }
                if(flg==false){
                    delete(window[o.classname]);
                    console.log(funs[i]+' must be defined from interface');
                    return null;
                }
            }
        }
        return cls;   
    }

    Class.inx=0;
    Class.prototype={
        version:0.1, 
        constructor: Class
    }
    function Interface(o){
        var default_opts={
            'interfacename':'Interface'+Interface.inx++,
            'extends':null,
            'functions':[]
        }
        o=extend(o,default_opts); 
        if(o['extends']){
            var pIfc=window[o['extends']];
            joint(o.functions,pIfc.functions)
        }      
        function ifc(){};
        ifc.prototype.constructor=window.Interface;    
        ifc.prototype.functions=o.functions;
        window[o.interfacename]=new ifc();
        return window[o.interfacename];              
    };
    Interface.inx=0;
    inherit(Interface,Class)
    window.Class=Class;
    window.Interface=Interface;
})(window);
