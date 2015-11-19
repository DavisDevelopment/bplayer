(function (console, $hx_exports) { "use strict";
$hx_exports.tannus = $hx_exports.tannus || {};
$hx_exports.tannus.sys = $hx_exports.tannus.sys || {};
var $hxClasses = {},$estr = function() { return js_Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
$hxClasses["EReg"] = EReg;
EReg.__name__ = ["EReg"];
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) return this.r.m[n]; else throw new js__$Boot_HaxeError("EReg::matched");
	}
	,matchedPos: function() {
		if(this.r.m == null) throw new js__$Boot_HaxeError("No string matched");
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchSub: function(s,pos,len) {
		if(len == null) len = -1;
		if(this.r.global) {
			this.r.lastIndex = pos;
			this.r.m = this.r.exec(len < 0?s:HxOverrides.substr(s,0,pos + len));
			var b = this.r.m != null;
			if(b) this.r.s = s;
			return b;
		} else {
			var b1 = this.match(len < 0?HxOverrides.substr(s,pos,null):HxOverrides.substr(s,pos,len));
			if(b1) {
				this.r.s = s;
				this.r.m.index += pos;
			}
			return b1;
		}
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,map: function(s,f) {
		var offset = 0;
		var buf = new StringBuf();
		do {
			if(offset >= s.length) break; else if(!this.matchSub(s,offset)) {
				buf.add(HxOverrides.substr(s,offset,null));
				break;
			}
			var p = this.matchedPos();
			buf.add(HxOverrides.substr(s,offset,p.pos - offset));
			buf.add(f(this));
			if(p.len == 0) {
				buf.add(HxOverrides.substr(s,p.pos,1));
				offset = p.pos + 1;
			} else offset = p.pos + p.len;
		} while(this.r.global);
		if(!this.r.global && offset > 0 && offset < s.length) buf.add(HxOverrides.substr(s,offset,null));
		return buf.b;
	}
	,__class__: EReg
};
var HxOverrides = function() { };
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.strDate = function(s) {
	var _g = s.length;
	switch(_g) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k1 = s.split("-");
		return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
	case 19:
		var k2 = s.split(" ");
		var y = k2[0].split("-");
		var t = k2[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw new js__$Boot_HaxeError("Invalid date format : " + s);
	}
};
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var IntIterator = function(min,max) {
	this.min = min;
	this.max = max;
};
$hxClasses["IntIterator"] = IntIterator;
IntIterator.__name__ = ["IntIterator"];
IntIterator.prototype = {
	hasNext: function() {
		return this.min < this.max;
	}
	,__class__: IntIterator
};
var Lambda = function() { };
$hxClasses["Lambda"] = Lambda;
Lambda.__name__ = ["Lambda"];
Lambda.has = function(it,elt) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(x == elt) return true;
	}
	return false;
};
Lambda.empty = function(it) {
	return !$iterator(it)().hasNext();
};
var List = function() {
	this.length = 0;
};
$hxClasses["List"] = List;
List.__name__ = ["List"];
List.prototype = {
	add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,__class__: List
};
var _$List_ListIterator = function(head) {
	this.head = head;
	this.val = null;
};
$hxClasses["_List.ListIterator"] = _$List_ListIterator;
_$List_ListIterator.__name__ = ["_List","ListIterator"];
_$List_ListIterator.prototype = {
	hasNext: function() {
		return this.head != null;
	}
	,next: function() {
		this.val = this.head[0];
		this.head = this.head[1];
		return this.val;
	}
	,__class__: _$List_ListIterator
};
Math.__name__ = ["Math"];
var Player = function() {
	this.buildPlayer();
};
$hxClasses["Player"] = Player;
Player.__name__ = ["Player"];
Player.wait = function(f,ms) {
	window.setTimeout(f,ms);
};
Player.main = function() {
	new Player();
};
Player.prototype = {
	choose: function(cb) {
		tannus_chrome_FileSystem.chooseEntry({ acceptsMultiple : true},function(entries) {
			var stack = new tannus_ds_AsyncStack();
			var list = new tannus_media_Playlist();
			var _g = 0;
			while(_g < entries.length) {
				var entry = [entries[_g]];
				++_g;
				if(entry[0].isFile) stack.under((function(entry) {
					return function(done) {
						var filee = entry[0];
						tannus_html_fs__$WebFileEntry_WebFileEntry_$Impl_$.file(filee).then((function(entry) {
							return function(file) {
								var url = window.webkitURL.createObjectURL(file);
								if((function($this) {
									var $r;
									var this1 = file.type;
									$r = tannus_ds_StringUtils.has(this1,"/")?this1.substring(0,this1.indexOf("/")):this1;
									return $r;
								}(this)) == "video") {
									var track = new tannus_media_Track(entry[0].name,url);
									list.addTrack(track);
									done();
								}
							};
						})(entry));
					};
				})(entry));
			}
			stack.run(function() {
				cb(list);
			});
		});
	}
	,buildPlayer: function() {
		var doc = window.document;
		this.canvas = doc.createElement("canvas");
		doc.body.appendChild(this.canvas);
		this.stage = new gryffin_core_Stage(this.canvas);
		this.stage.fill();
		this.player = new player_Player();
		this.stage.addChild(this.player);
	}
	,__class__: Player
};
var Reflect = function() { };
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = ["Reflect"];
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
Reflect.getProperty = function(o,field) {
	var tmp;
	if(o == null) return null; else if(o.__properties__ && (tmp = o.__properties__["get_" + field])) return o[tmp](); else return o[field];
};
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
};
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
};
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && v.__enum__ == null || t == "function" && (v.__name__ || v.__ename__) != null;
};
Reflect.deleteField = function(o,field) {
	if(!Object.prototype.hasOwnProperty.call(o,field)) return false;
	delete(o[field]);
	return true;
};
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
};
var Std = function() { };
$hxClasses["Std"] = Std;
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	add: function(x) {
		this.b += Std.string(x);
	}
	,__class__: StringBuf
};
var StringTools = function() { };
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
};
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
};
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
};
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c > 8 && c < 14 || c == 32;
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
};
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { };
$hxClasses["Type"] = Type;
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null; else return js_Boot.getClass(o);
};
Type.getSuperClass = function(c) {
	return c.__super__;
};
Type.getClassName = function(c) {
	var a = c.__name__;
	if(a == null) return null;
	return a.join(".");
};
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
};
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
};
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
};
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
};
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw new js__$Boot_HaxeError("No such constructor " + constr);
	if(Reflect.isFunction(f)) {
		if(params == null) throw new js__$Boot_HaxeError("Constructor " + constr + " need parameters");
		return Reflect.callMethod(e,f,params);
	}
	if(params != null && params.length != 0) throw new js__$Boot_HaxeError("Constructor " + constr + " does not need parameters");
	return f;
};
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
};
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = js_Boot.getClass(v);
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
var gryffin_Tools = function() { };
$hxClasses["gryffin.Tools"] = gryffin_Tools;
gryffin_Tools.__name__ = ["gryffin","Tools"];
gryffin_Tools.__properties__ = {get_win:"get_win"}
gryffin_Tools.defer = function(f) {
	window.setTimeout(f,5);
};
gryffin_Tools.makeUniqueIdentifier = function(digits) {
	var id = "";
	var r = new tannus_math_Random();
	var _g = 0;
	while(_g < digits) {
		var i = _g++;
		var range = [0,0];
		var letter = r.randbool();
		if(letter) {
			var upper = r.randbool();
			if(upper) range = [65,90]; else range = [97,122];
		} else range = [48,57];
		var c;
		var n = r.randint(range[0],range[1]);
		var this1;
		if(!tannus_io__$Byte_Byte_$Impl_$.isValid(n)) throw new js__$Boot_HaxeError("Invalid Byte Value (" + n + ")!");
		this1 = n;
		c = this1;
		id += String.fromCharCode(c);
	}
	if(Lambda.has(gryffin_Tools.used_idents,id)) return gryffin_Tools.makeUniqueIdentifier(digits); else {
		gryffin_Tools.used_idents.push(id);
		return id;
	}
};
gryffin_Tools.deleteUniqueIdentifier = function(id) {
	return HxOverrides.remove(gryffin_Tools.used_idents,id);
};
gryffin_Tools.get_win = function() {
	return window;
};
var gryffin_core_EventDispatcher = function() {
	this.__sigs = new haxe_ds_StringMap();
};
$hxClasses["gryffin.core.EventDispatcher"] = gryffin_core_EventDispatcher;
gryffin_core_EventDispatcher.__name__ = ["gryffin","core","EventDispatcher"];
gryffin_core_EventDispatcher.prototype = {
	sig: function(name) {
		if(!this.__sigs.exists(name)) {
			var value = new tannus_io_Signal();
			this.__sigs.set(name,value);
		}
		return this.__sigs.get(name);
	}
	,on: function(name,handler) {
		this.sig(name).on(handler,null);
	}
	,once: function(name,handler) {
		this.sig(name).once(handler);
	}
	,when: function(name,test,handler) {
		this.sig(name).when(test,handler);
	}
	,times: function(name,count,handler) {
		this.sig(name).times(count,handler);
	}
	,every: function(name,interval,handler) {
		this.sig(name).every(interval,handler);
	}
	,off: function(name,handler) {
		var s = this.sig(name);
		if(handler != null) s.ignore(handler); else s.handlers = [];
	}
	,ignore: function(name,handler) {
		this.off(name,handler);
	}
	,dispatch: function(name,data) {
		this.sig(name).call(data);
	}
	,call: function(name,data) {
		this.dispatch(name,data);
	}
	,__class__: gryffin_core_EventDispatcher
};
var gryffin_core_Entity = function() {
	gryffin_core_EventDispatcher.call(this);
	this._cached = false;
	this._hidden = false;
	this.destroyed = false;
	this.priority = 0;
	this.once("activated",$bind(this,this.init));
};
$hxClasses["gryffin.core.Entity"] = gryffin_core_Entity;
gryffin_core_Entity.__name__ = ["gryffin","core","Entity"];
gryffin_core_Entity.__super__ = gryffin_core_EventDispatcher;
gryffin_core_Entity.prototype = $extend(gryffin_core_EventDispatcher.prototype,{
	'delete': function() {
		this.destroyed = true;
	}
	,hide: function() {
		this._hidden = true;
	}
	,show: function() {
		this._hidden = false;
	}
	,cache: function() {
		this._cached = true;
	}
	,uncache: function() {
		this._cached = false;
	}
	,toggleCache: function() {
		(this._cached?$bind(this,this.uncache):$bind(this,this.cache))();
	}
	,toggleHidden: function() {
		(this._hidden?$bind(this,this.show):$bind(this,this.hide))();
	}
	,init: function(s) {
		console.log(tannus_internal_TypeTools.typename(this) + " has been initialized");
	}
	,update: function(s) {
		null;
	}
	,render: function(s,c) {
		null;
	}
	,containsPoint: function(p) {
		return false;
	}
	,__class__: gryffin_core_Entity
});
var gryffin_core_Stage = function(can) {
	gryffin_core_EventDispatcher.call(this);
	this.canvas = can;
	this.ctx = this.canvas.getContext("2d",null);
	this.children = [];
	this.manager = new gryffin_events_FrameManager();
	this.mouseManager = new gryffin_events_MouseListener(this);
	this.keyManager = new gryffin_events_KeyListener(this);
	this.mouseWatcher = new gryffin_events_MouseWatcher(this);
	this.eventTimes = new haxe_ds_StringMap();
	this._fill = false;
	var this1 = window;
	this.lastWindowSize = new tannus_geom_CRectangle(this1.scrollX,this1.scrollY,this1.innerWidth,this1.innerHeight);
	this.__init();
};
$hxClasses["gryffin.core.Stage"] = gryffin_core_Stage;
gryffin_core_Stage.__name__ = ["gryffin","core","Stage"];
gryffin_core_Stage.__properties__ = {get_window:"get_window"}
gryffin_core_Stage.get_window = function() {
	return window;
};
gryffin_core_Stage.__super__ = gryffin_core_EventDispatcher;
gryffin_core_Stage.prototype = $extend(gryffin_core_EventDispatcher.prototype,{
	resize: function(w,h) {
		this.canvas.width = w;
		this.canvas.height = h;
		this.ctx = this.canvas.getContext("2d",null);
	}
	,addChild: function(child) {
		if(!Lambda.has(this.children,child)) {
			this.children.push(child);
			child.stage = this;
			child.dispatch("activated",this);
		}
	}
	,fill: function() {
		this._fill = true;
	}
	,getMousePosition: function() {
		return this.mouseWatcher.getMousePosition();
	}
	,mostRecentOccurrenceTime: function(event) {
		return this.eventTimes.get(event);
	}
	,frame: function(delta) {
		if(this._fill) {
			var vp;
			var this1 = window;
			vp = new tannus_geom_CRectangle(this1.scrollX,this1.scrollY,this1.innerWidth,this1.innerHeight);
			if(vp != this.lastWindowSize) {
				gryffin_core_StageFiller.sheet();
				this.canvas.width = vp.width | 0;
				this.canvas.height = vp.height | 0;
				this.lastWindowSize = vp;
			}
		}
		this.children = this.children.filter(function(e) {
			return !e.destroyed;
		});
		haxe_ds_ArraySort.sort(this.children,function(a,b) {
			return b.priority + a.priority;
		});
		var this2 = this.ctx;
		this2.clearRect(0,0,this2.canvas.width,this2.canvas.height);
		var _g = 0;
		var _g1 = this.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(!child._cached) child.update(this);
			if(!child._hidden) child.render(this,this.ctx);
		}
	}
	,get: function(sel) {
		var s;
		var this1;
		var b = tannus_nore_ORegEx.compile(sel);
		this1 = [sel,b];
		s = this1;
		return this.children.filter(s[1]);
	}
	,mouseEvent: function(e) {
		this.dispatch(e.type,e);
		this.children.reverse();
		var target = null;
		var _g = 0;
		var _g1 = this.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.containsPoint(e.position)) {
				child.dispatch(e.type,e);
				target = child;
				break;
			}
		}
		this.children.reverse();
	}
	,__init: function() {
		this.__events();
	}
	,__events: function() {
		this.manager.frame.listen($bind(this,this.frame),false);
		this.manager.start();
	}
	,dispatch: function(name,data) {
		gryffin_core_EventDispatcher.prototype.dispatch.call(this,name,data);
		var value = new Date().getTime();
		this.eventTimes.set(name,value);
	}
	,get_width: function() {
		return this.canvas.width;
	}
	,set_width: function(v) {
		this.resize(v,this.canvas.height);
		return this.canvas.width;
	}
	,get_height: function() {
		return this.canvas.height;
	}
	,set_height: function(v) {
		this.resize(this.canvas.width,v);
		return this.canvas.height;
	}
	,get_rect: function() {
		return new tannus_geom_CRectangle(0,0,this.canvas.width,this.canvas.height);
	}
	,set_rect: function(v) {
		this.resize(Math.round(v.width),Math.round(v.height));
		return new tannus_geom_CRectangle(0,0,this.canvas.width,this.canvas.height);
	}
	,__class__: gryffin_core_Stage
	,__properties__: {set_rect:"set_rect",get_rect:"get_rect",set_height:"set_height",get_height:"get_height",set_width:"set_width",get_width:"get_width"}
});
var gryffin_core_StageFiller = function() { };
$hxClasses["gryffin.core.StageFiller"] = gryffin_core_StageFiller;
gryffin_core_StageFiller.__name__ = ["gryffin","core","StageFiller"];
gryffin_core_StageFiller.sheet = function() {
	if(!gryffin_core_StageFiller.addedStyleSheet) {
		var sheet = new tannus_css_StyleSheet();
		var all = sheet.rule("*",{ 'margin' : 0, 'padding' : 0});
		var bodyAndHtml = sheet.rule("body, html",{ 'height' : "100%"});
		var canvas = sheet.rule("canvas",{ 'position' : "absolute", 'width' : "100%", 'height' : "100%"});
		var element = gryffin_core_StageFiller.sheetElement(sheet);
		window.document.getElementsByTagName("head").item(0).appendChild(element);
		gryffin_core_StageFiller.addedStyleSheet = true;
	}
};
gryffin_core_StageFiller.sheetElement = function(sheet) {
	var el;
	var _this = window.document;
	el = _this.createElement("style");
	el.type = "text/css";
	el.textContent = sheet.toString();
	return el;
};
var gryffin_display_Paintable = function() { };
$hxClasses["gryffin.display.Paintable"] = gryffin_display_Paintable;
gryffin_display_Paintable.__name__ = ["gryffin","display","Paintable"];
gryffin_display_Paintable.prototype = {
	__class__: gryffin_display_Paintable
};
var gryffin_display_Canvas = function(c) {
	if(c != null) this.canvas = c; else {
		var _this = window.document;
		this.canvas = _this.createElement("canvas");
	}
	var r = (function(f,a1) {
		return function() {
			return f(a1);
		};
	})(($_=this.canvas,$bind($_,$_.getContext)),"2d");
	this._ctx = new tannus_ds_CRef(r);
};
$hxClasses["gryffin.display.Canvas"] = gryffin_display_Canvas;
gryffin_display_Canvas.__name__ = ["gryffin","display","Canvas"];
gryffin_display_Canvas.__interfaces__ = [gryffin_display_Paintable];
gryffin_display_Canvas.create = function(w,h) {
	var can = new gryffin_display_Canvas();
	can.resize(w,h);
	return can;
};
gryffin_display_Canvas.prototype = {
	resize: function(w,h) {
		this.canvas.width = w;
		this.canvas.height = h;
		var r = (function(f,a1) {
			return function() {
				return f(a1);
			};
		})(($_=this.canvas,$bind($_,$_.getContext)),"2d");
		this._ctx = new tannus_ds_CRef(r);
	}
	,paint: function(c,src,dest) {
		c.drawImage(this.canvas,src.x,src.y,src.width,src.height,dest.x,dest.y,dest.width,dest.height);
	}
	,dataURI: function(type) {
		return this.canvas.toDataURL(type);
	}
	,getImage: function(cb) {
		gryffin_display_Image.load(this.dataURI(),cb);
	}
	,pixels: function(x,y,w,h) {
		var idata = this._ctx.get().getImageData(x,y,w,h);
		var pos = new tannus_geom_TPoint(x,y,0);
		return new gryffin_display_Pixels(this,pos,idata);
	}
	,get_width: function() {
		return this.canvas.width;
	}
	,set_width: function(v) {
		this.resize(v,this.canvas.height);
		return this.canvas.width;
	}
	,get_height: function() {
		return this.canvas.height;
	}
	,set_height: function(v) {
		this.resize(this.canvas.width,v);
		return this.canvas.height;
	}
	,get_context: function() {
		return this._ctx.get();
	}
	,__class__: gryffin_display_Canvas
	,__properties__: {get_context:"get_context",set_height:"set_height",get_height:"get_height",set_width:"set_width",get_width:"get_width"}
};
var gryffin_display__$Ctx_Ctx_$Impl_$ = {};
$hxClasses["gryffin.display._Ctx.Ctx_Impl_"] = gryffin_display__$Ctx_Ctx_$Impl_$;
gryffin_display__$Ctx_Ctx_$Impl_$.__name__ = ["gryffin","display","_Ctx","Ctx_Impl_"];
gryffin_display__$Ctx_Ctx_$Impl_$.__properties__ = {get_height:"get_height",get_width:"get_width"}
gryffin_display__$Ctx_Ctx_$Impl_$._new = function(c) {
	return c;
};
gryffin_display__$Ctx_Ctx_$Impl_$.erase = function(this1) {
	this1.clearRect(0,0,this1.canvas.width,this1.canvas.height);
};
gryffin_display__$Ctx_Ctx_$Impl_$.paint = function(this1,comp,src,dest) {
	comp.paint(this1,src,dest);
};
gryffin_display__$Ctx_Ctx_$Impl_$.drawComponent = function(this1,comp,sx,sy,sw,sh,dx,dy,dw,dh) {
	var src = new tannus_geom_CRectangle(sx,sy,sw,sh);
	var dest = new tannus_geom_CRectangle(dx,dy,dw,dh);
	comp.paint(this1,src,dest);
};
gryffin_display__$Ctx_Ctx_$Impl_$.measureText = function(this1,txt) {
	return gryffin_display_CtxTools.patchedMeasureText(this1,txt);
};
gryffin_display__$Ctx_Ctx_$Impl_$.setMatrix = function(this1,m) {
	gryffin_display_CtxTools.applyMatrix(this1,m);
};
gryffin_display__$Ctx_Ctx_$Impl_$.getMatrix = function(this1) {
	return gryffin_display_CtxTools.obtainMatrix(this1);
};
gryffin_display__$Ctx_Ctx_$Impl_$.get_width = function(this1) {
	return this1.canvas.width;
};
gryffin_display__$Ctx_Ctx_$Impl_$.get_height = function(this1) {
	return this1.canvas.height;
};
var gryffin_display_CtxTools = function() { };
$hxClasses["gryffin.display.CtxTools"] = gryffin_display_CtxTools;
gryffin_display_CtxTools.__name__ = ["gryffin","display","CtxTools"];
gryffin_display_CtxTools.patchedMeasureText = function(c,txt) {
	var font = c.font;
	var w = c.measureText(txt).width;
	var h = gryffin_display_CtxTools.getTextHeight(font).height;
	return { 'width' : w, 'height' : h};
};
gryffin_display_CtxTools.getTextHeight = function(font) {
	var doc = window.document;
	var span = doc.createElement("span");
	span.style.fontFamily = font;
	span.textContent = "Hg";
	var block = doc.createElement("div");
	block.style.display = "inline-block";
	block.style.width = "1px";
	block.style.height = "0px";
	var div = doc.createElement("div");
	div.appendChild(span);
	div.appendChild(block);
	var body = doc.body;
	body.appendChild(div);
	var result = { 'ascent' : 0.0, 'descent' : 0.0, 'height' : 0.0};
	try {
		var bo = (function(f,e) {
			return function() {
				return f(e);
			};
		})(gryffin_display_CtxTools.offset,block);
		var so = (function(f1,e1) {
			return function() {
				return f1(e1);
			};
		})(gryffin_display_CtxTools.offset,span);
		var align = new tannus_io__$Pointer_Ref(function() {
			return block.style.verticalAlign;
		},function(v) {
			return block.style.verticalAlign = v;
		});
		align.set("baseline");
		result.ascent = bo().top - so().top;
		align.set("bottom");
		result.height = bo().top - so().top;
		result.descent = result.height - result.ascent;
		div.remove();
		return result;
	} catch( err ) {
		if (err instanceof js__$Boot_HaxeError) err = err.val;
		console.log(err);
		div.remove();
	}
	return result;
};
gryffin_display_CtxTools.offset = function(e) {
	try {
		var rect = e.getBoundingClientRect();
		var win = window;
		var doc = win.document.documentElement;
		return { 'top' : rect.top + win.pageYOffset - doc.clientTop, 'left' : rect.left + win.pageXOffset - doc.clientLeft};
	} catch( error ) {
		if (error instanceof js__$Boot_HaxeError) error = error.val;
		console.log(error);
		return { 'top' : 0, 'left' : 0};
	}
};
gryffin_display_CtxTools.drawVertices = function(c,vertices,closed) {
	if(closed == null) closed = true;
	var points;
	{
		var _g = [];
		var $it0 = vertices.iterator();
		while( $it0.hasNext() ) {
			var p = $it0.next();
			_g.push((function($this) {
				var $r;
				var x = p.get_x();
				var y = p.get_y();
				var z = p.get_z();
				$r = new tannus_geom_TPoint(x,y,z);
				return $r;
			}(this)));
		}
		points = _g;
	}
	var first = points.shift();
	c.beginPath();
	c.moveTo(first.get_x(),first.get_y());
	var _g1 = 0;
	while(_g1 < points.length) {
		var p1 = points[_g1];
		++_g1;
		c.lineTo(p1.get_x(),p1.get_y());
	}
	c.lineTo(first.get_x(),first.get_y());
	if(closed) {
		c.closePath();
		c.stroke();
	} else {
		c.stroke();
		c.closePath();
	}
};
gryffin_display_CtxTools.applyMatrix = function(c,m) {
	if(m.a == 1 && m.b == 0 && m.c == 0 && m.d == 1) c.translate(m.tx,m.ty); else c.setTransform(m.a,m.b,m.c,m.d,m.tx,m.ty);
};
gryffin_display_CtxTools.obtainMatrix = function(c) {
	return new tannus_geom_Matrix();
};
var gryffin_display_Image = function(i) {
	if(i != null) this.img = i; else this.img = (function($this) {
		var $r;
		var _this = window.document;
		$r = _this.createElement("img");
		return $r;
	}(this));
	this.ready = new tannus_io_VoidSignal();
	this.targetWidth = this.targetHeight = 0;
	this.__init();
};
$hxClasses["gryffin.display.Image"] = gryffin_display_Image;
gryffin_display_Image.__name__ = ["gryffin","display","Image"];
gryffin_display_Image.__interfaces__ = [gryffin_display_Paintable];
gryffin_display_Image.load = function(src,cb) {
	if(!gryffin_display_Image.registry.exists(src)) {
		var img = new gryffin_display_Image();
		img.img.src = src;
		if(cb != null) img.ready.once((function(f,a1) {
			return function() {
				f(a1);
			};
		})(cb,img));
		{
			gryffin_display_Image.registry.set(src,img);
			img;
		}
		return img;
	} else {
		var img1 = gryffin_display_Image.registry.get(src);
		if(cb != null) (img1.img.complete?gryffin_Tools.defer:($_=img1.ready,$bind($_,$_.once)))((function(f1,a11) {
			return function() {
				f1(a11);
			};
		})(cb,img1));
		return img1;
	}
};
gryffin_display_Image.prototype = {
	__init: function() {
		this.img.onload = (function(f1,f) {
			return function() {
				f1(f);
			};
		})(gryffin_Tools.defer,($_=this.ready,$bind($_,$_.fire)));
		this.img.onerror = function(err) {
			window.console.error(err);
		};
		if(this.img.complete) window.setTimeout(($_=this.ready,$bind($_,$_.fire)),5);
	}
	,toCanvas: function() {
		var _g = this;
		var can = gryffin_display_Canvas.create(this.targetWidth,this.targetHeight);
		var c = can._ctx.get();
		if(this.img.complete) {
			can.resize(this.img.naturalWidth,this.img.naturalHeight);
			c = can._ctx.get();
			var src = new tannus_geom_CRectangle(0,0,this.img.naturalWidth,this.img.naturalHeight);
			var dest = new tannus_geom_CRectangle(0,0,this.img.naturalWidth,this.img.naturalHeight);
			this.paint(c,src,dest);
			console.log("Image already loaded");
		} else {
			console.log("Image not loaded");
			c.save();
			c.fillStyle = "#000000";
			c.fillRect(0,0,this.targetWidth,this.targetHeight);
			c.restore();
			this.ready.once(function() {
				console.log("Image now loaded");
				console.log([_g.img.naturalWidth,_g.img.naturalHeight]);
				can.resize(_g.img.naturalWidth,_g.img.naturalHeight);
				c = can._ctx.get();
				var src1 = new tannus_geom_CRectangle(0,0,_g.img.naturalWidth,_g.img.naturalHeight);
				var dest1 = new tannus_geom_CRectangle(0,0,_g.img.naturalWidth,_g.img.naturalHeight);
				_g.paint(c,src1,dest1);
			});
		}
		return can;
	}
	,paint: function(c,s,d) {
		c.drawImage(this.img,s.x,s.y,s.width,s.height,d.x,d.y,d.width,d.height);
	}
	,get_src: function() {
		return this.img.src;
	}
	,set_src: function(v) {
		return this.img.src = v;
	}
	,get_width: function() {
		return this.img.naturalWidth;
	}
	,get_height: function() {
		return this.img.naturalHeight;
	}
	,get_rect: function() {
		return new tannus_geom_CRectangle(0,0,this.img.naturalWidth,this.img.naturalHeight);
	}
	,get_complete: function() {
		return this.img.complete;
	}
	,__class__: gryffin_display_Image
	,__properties__: {get_complete:"get_complete",get_rect:"get_rect",get_height:"get_height",get_width:"get_width",set_src:"set_src",get_src:"get_src"}
};
var gryffin_display_Pixels = function(owner,position,dat) {
	this.canvas = owner;
	this.idata = dat;
	this.data = this.idata.data;
	this.pos = position;
};
$hxClasses["gryffin.display.Pixels"] = gryffin_display_Pixels;
gryffin_display_Pixels.__name__ = ["gryffin","display","Pixels"];
gryffin_display_Pixels.prototype = {
	get: function(xi,y) {
		if(y == null) return this.getAtIndex(xi | 0); else return this.getAtIndex((xi | 0) + (y | 0) * this.idata.width);
	}
	,getAtPos: function(x,y) {
		return this.getAtIndex((x | 0) + (y | 0) * this.idata.width);
	}
	,getAtIndex: function(i) {
		i *= 4;
		var col = new tannus_graphics__$Color_TColor(this.data[i],this.data[i + 1],this.data[i + 2],this.data[i + 3]);
		return col;
	}
	,setAtIndex: function(i,color) {
		i *= 4;
		this.data[i] = color._red;
		this.data[i + 1] = color._green;
		this.data[i + 2] = color._blue;
		if(color._alpha != null) this.data[i + 3] = color._alpha; else this.data[i + 3] = 0;
		return color;
	}
	,setAtPos: function(x,y,color) {
		return this.setAtIndex((x | 0) + (y | 0) * this.idata.width,color);
	}
	,set: function(x,y,color) {
		return this.setAtIndex((x | 0) + (y | 0) * this.idata.width,color);
	}
	,index: function(x,y) {
		return (x | 0) + (y | 0) * this.idata.width;
	}
	,write: function(target,x,y,sx,sy,sw,sh) {
		if(sy == null) sy = 0;
		if(sx == null) sx = 0;
		target._ctx.get().putImageData(this.idata,x,y,sx,sy,sw != null?sw:this.idata.width,sh != null?sh:this.idata.height);
	}
	,save: function() {
		this.write(this.canvas,this.pos.get_x(),this.pos.get_y());
	}
	,get_width: function() {
		return this.idata.width;
	}
	,get_height: function() {
		return this.idata.height;
	}
	,get_length: function() {
		return this.data.length / 4 | 0;
	}
	,__class__: gryffin_display_Pixels
	,__properties__: {get_length:"get_length",get_height:"get_height",get_width:"get_width"}
};
var gryffin_display_Video = function(el) {
	if(el != null) this.vid = el; else this.vid = gryffin_display_Video.createVid();
	this.onerror = new tannus_io_Signal();
	this.ondurationchange = new tannus_io_Signal();
	this.onvolumechange = new tannus_io_Signal();
	this.onratechange = new tannus_io_Signal();
	this.onended = new tannus_io_VoidSignal();
	this.oncanplay = new tannus_io_VoidSignal();
	this.onplay = new tannus_io_VoidSignal();
	this.onpause = new tannus_io_VoidSignal();
	this.onload = new tannus_io_VoidSignal();
	this.listen();
};
$hxClasses["gryffin.display.Video"] = gryffin_display_Video;
gryffin_display_Video.__name__ = ["gryffin","display","Video"];
gryffin_display_Video.__interfaces__ = [gryffin_display_Paintable];
gryffin_display_Video.createVid = function() {
	var _this = window.document;
	return _this.createElement("video");
};
gryffin_display_Video.prototype = {
	destroy: function() {
		this.vid.remove();
	}
	,paint: function(c,s,d) {
		c.drawImage(this.vid,s.x,s.y,s.width,s.height,d.x,d.y,d.width,d.height);
	}
	,play: function() {
		this.vid.play();
	}
	,pause: function() {
		this.vid.pause();
	}
	,load: function(url,cb) {
		this.pause();
		this.onload.once(function() {
			console.log("VIDEO LOADED");
		});
		this.oncanplay.once(cb);
		this.onerror.listen(function(error) {
			window.console.error(error);
			cb();
		},true);
		this.set_src(url);
	}
	,listen: function() {
		var _g = this;
		var on = (function(f) {
			return function(a1,a2) {
				f(a1,a2);
			};
		})(($_=this.vid,$bind($_,$_.addEventListener)));
		on("error",function() {
			_g.onerror.broadcast(_g.vid.error);
		});
		on("ended",($_=this.onended,$bind($_,$_.fire)));
		on("canplay",($_=this.oncanplay,$bind($_,$_.fire)));
		on("play",($_=this.onplay,$bind($_,$_.fire)));
		on("pause",($_=this.onpause,$bind($_,$_.fire)));
		on("load",($_=this.onload,$bind($_,$_.fire)));
		this.durationChanged();
		this.volumeChanged();
	}
	,durationChanged: function() {
		var _g = this;
		var last_duration = null;
		this.vid.addEventListener("durationchange",function() {
			var cur_dur = tannus_media__$Duration_Duration_$Impl_$.fromSecondsF(_g.vid.duration);
			var delta = [cur_dur,last_duration];
			_g.ondurationchange.broadcast(delta);
			last_duration = cur_dur;
		});
	}
	,volumeChanged: function() {
		var _g = this;
		var last_vol = this.vid.volume;
		this.vid.addEventListener("volumechange",function() {
			var delta = [_g.vid.volume,last_vol];
			_g.onvolumechange.broadcast(delta);
			last_vol = _g.vid.volume;
		});
	}
	,get_width: function() {
		return this.vid.videoWidth;
	}
	,get_height: function() {
		return this.vid.videoHeight;
	}
	,get_rect: function() {
		return new tannus_geom_CRectangle(0,0,this.vid.videoWidth,this.vid.videoHeight);
	}
	,get_src: function() {
		return Std.string(this.vid.currentSrc);
	}
	,set_src: function(v) {
		this.vid.src = v.toString();
		return this.get_src();
	}
	,get_duration: function() {
		return tannus_media__$Duration_Duration_$Impl_$.fromSecondsF(this.vid.duration);
	}
	,get_currentTime: function() {
		return this.vid.currentTime;
	}
	,set_currentTime: function(v) {
		return this.vid.currentTime = v;
	}
	,get_progress: function() {
		return tannus_math__$Percent_Percent_$Impl_$.percent(this.vid.currentTime,this.vid.duration);
	}
	,get_playbackRate: function() {
		return this.vid.playbackRate;
	}
	,set_playbackRate: function(v) {
		return this.vid.playbackRate = v;
	}
	,get_paused: function() {
		return this.vid.paused;
	}
	,get_volume: function() {
		return this.vid.volume;
	}
	,set_volume: function(v) {
		return this.vid.volume = v;
	}
	,get_muted: function() {
		return this.vid.muted;
	}
	,set_muted: function(v) {
		return this.vid.muted = v;
	}
	,__class__: gryffin_display_Video
	,__properties__: {set_muted:"set_muted",get_muted:"get_muted",set_volume:"set_volume",get_volume:"get_volume",get_paused:"get_paused",set_playbackRate:"set_playbackRate",get_playbackRate:"get_playbackRate",get_progress:"get_progress",set_currentTime:"set_currentTime",get_currentTime:"get_currentTime",get_duration:"get_duration",set_src:"set_src",get_src:"get_src",get_rect:"get_rect",get_height:"get_height",get_width:"get_width"}
};
var gryffin_events_FrameManager = function() {
	this.frame = new tannus_io_Signal();
};
$hxClasses["gryffin.events.FrameManager"] = gryffin_events_FrameManager;
gryffin_events_FrameManager.__name__ = ["gryffin","events","FrameManager"];
gryffin_events_FrameManager.prototype = {
	_frame: function(delta) {
		this.frame.broadcast(delta);
		this.queueNext();
	}
	,queueNext: function() {
		this.id = window.requestAnimationFrame($bind(this,this._frame));
	}
	,start: function() {
		this.queueNext();
	}
	,stop: function() {
		window.cancelAnimationFrame(this.id);
	}
	,__class__: gryffin_events_FrameManager
};
var tannus_events_EventCreator = function() { };
$hxClasses["tannus.events.EventCreator"] = tannus_events_EventCreator;
tannus_events_EventCreator.__name__ = ["tannus","events","EventCreator"];
var gryffin_events_KeyListener = function(s) {
	this.stage = s;
	this.listen();
};
$hxClasses["gryffin.events.KeyListener"] = gryffin_events_KeyListener;
gryffin_events_KeyListener.__name__ = ["gryffin","events","KeyListener"];
gryffin_events_KeyListener.__interfaces__ = [tannus_events_EventCreator];
gryffin_events_KeyListener.prototype = {
	listen: function() {
		var win = window;
		var events = ["keydown","keyup","keypress"];
		var _g = 0;
		while(_g < events.length) {
			var name = events[_g];
			++_g;
			win.addEventListener(name,$bind(this,this.handle));
		}
	}
	,collectMods: function(e) {
		var mods = [];
		if(e.altKey) mods.push("alt");
		if(e.shiftKey) mods.push("shift");
		if(e.ctrlKey) mods.push("ctrl");
		if(e.metaKey) mods.push("super");
		return mods;
	}
	,handle: function(e) {
		var event = new tannus_events_KeyboardEvent(e.type,e.keyCode,this.collectMods(e));
		event.onDefaultPrevented.listen($bind(e,e.preventDefault),true);
		event.onPropogationStopped.listen($bind(e,e.stopPropagation),true);
		this.stage.dispatch(e.type,event);
	}
	,__class__: gryffin_events_KeyListener
};
var gryffin_events_MouseListener = function(s) {
	this.stage = s;
	this.canvas = this.stage.canvas;
	this.bind();
};
$hxClasses["gryffin.events.MouseListener"] = gryffin_events_MouseListener;
gryffin_events_MouseListener.__name__ = ["gryffin","events","MouseListener"];
gryffin_events_MouseListener.__interfaces__ = [tannus_events_EventCreator];
gryffin_events_MouseListener.prototype = {
	bind: function() {
		var relevant = ["click","mouseup","mousedown","mouseenter","mouseleave"];
		var _g = 0;
		while(_g < relevant.length) {
			var name = relevant[_g];
			++_g;
			this.canvas.addEventListener(name,$bind(this,this.handle));
		}
		this.canvas.addEventListener("mousemove",$bind(this,this.handleMove));
	}
	,findPos: function(e) {
		var pos = new tannus_geom_TPoint(e.clientX,e.clientY,0);
		var crect = this.canvas.getBoundingClientRect();
		var nx = pos.get_x() - crect.left;
		pos.set_x(nx);
		var ny = pos.get_y() - crect.top;
		pos.set_y(ny);
		return pos;
	}
	,findMods: function(e) {
		var mods = [];
		if(e.altKey) mods.push("alt");
		if(e.ctrlKey) mods.push("ctrl");
		if(e.shiftKey) mods.push("shift");
		if(e.metaKey) mods.push("super");
		return mods;
	}
	,handle: function(e) {
		var pos = this.findPos(e);
		var mods = this.findMods(e);
		var event = new tannus_events_MouseEvent(e.type,pos,e.button,mods);
		event.onDefaultPrevented.listen($bind(e,e.preventDefault),true);
		event.onPropogationStopped.listen($bind(e,e.stopPropagation),true);
		this.stage.mouseEvent(event);
	}
	,handleMove: function() {
		var _g = this;
		var lastTarget = null;
		var _handle = function(e) {
			var pos = _g.findPos(e);
			var mods = _g.findMods(e);
			var event = new tannus_events_MouseEvent(e.type,pos,e.button,mods);
			event.onDefaultPrevented.listen($bind(e,e.preventDefault),true);
			event.onPropogationStopped.listen($bind(e,e.stopPropagation),true);
			var target = _g.getRootTarget(event);
			{
				var left = lastTarget;
				var left1 = lastTarget;
				if(lastTarget == null) {
					var entered = target;
					if(entered != null) entered.dispatch("mouseenter",e); else {
						var right = target;
						if(target == null) {
							if(left != null) left.dispatch("mouseleave",e); else if(left1 != null && right != null) {
								if(left1 == right) left1.dispatch("mousemove",e); else {
									left1.dispatch("mouseleave",e);
									right.dispatch("mouseenter",e);
								}
							}
						} else switch(target) {
						default:
							if(left1 != null && right != null) {
								if(left1 == right) left1.dispatch("mousemove",e); else {
									left1.dispatch("mouseleave",e);
									right.dispatch("mouseenter",e);
								}
							}
						}
					}
				} else switch(lastTarget) {
				default:
					var right = target;
					if(target == null) {
						if(left != null) left.dispatch("mouseleave",e); else if(left1 != null && right != null) {
							if(left1 == right) left1.dispatch("mousemove",e); else {
								left1.dispatch("mouseleave",e);
								right.dispatch("mouseenter",e);
							}
						}
					} else switch(target) {
					default:
						if(left1 != null && right != null) {
							if(left1 == right) left1.dispatch("mousemove",e); else {
								left1.dispatch("mouseleave",e);
								right.dispatch("mouseenter",e);
							}
						}
					}
				}
			}
			lastTarget = target;
			_g.stage.mouseEvent(event);
		};
		this.canvas.addEventListener("mousemove",_handle);
	}
	,getRootTarget: function(e) {
		var _g = 0;
		var _g1 = this.stage.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.containsPoint(e.position) && !(child._cached || child.destroyed)) return child;
		}
		return null;
	}
	,__class__: gryffin_events_MouseListener
};
var gryffin_events_MouseWatcher = function(s) {
	this.stage = s;
	this.lastMousePos = null;
	this.lastMove = -1;
	this._listen();
};
$hxClasses["gryffin.events.MouseWatcher"] = gryffin_events_MouseWatcher;
gryffin_events_MouseWatcher.__name__ = ["gryffin","events","MouseWatcher"];
gryffin_events_MouseWatcher.prototype = {
	getMousePosition: function() {
		if(this.lastMousePos == null) return null; else {
			var this1 = this.lastMousePos;
			var x = this1.get_x();
			var y = this1.get_y();
			var z = this1.get_z();
			return new tannus_geom_TPoint(x,y,z);
		}
	}
	,getMoveTime: function() {
		if(this.lastMove != -1) return this.lastMove; else return null;
	}
	,_listen: function() {
		this.stage.on("mousemove",$bind(this,this.onmove));
		this.stage.on("mouseleave",$bind(this,this.onleave));
	}
	,onmove: function(e) {
		this.lastMousePos = e.position;
		this.lastMove = e.date;
	}
	,onleave: function(e) {
		this.lastMousePos = null;
	}
	,__class__: gryffin_events_MouseWatcher
};
var haxe_IMap = function() { };
$hxClasses["haxe.IMap"] = haxe_IMap;
haxe_IMap.__name__ = ["haxe","IMap"];
var haxe__$Int64__$_$_$Int64 = function(high,low) {
	this.high = high;
	this.low = low;
};
$hxClasses["haxe._Int64.___Int64"] = haxe__$Int64__$_$_$Int64;
haxe__$Int64__$_$_$Int64.__name__ = ["haxe","_Int64","___Int64"];
haxe__$Int64__$_$_$Int64.prototype = {
	__class__: haxe__$Int64__$_$_$Int64
};
var haxe_Serializer = function() {
	this.buf = new StringBuf();
	this.cache = [];
	this.useCache = haxe_Serializer.USE_CACHE;
	this.useEnumIndex = haxe_Serializer.USE_ENUM_INDEX;
	this.shash = new haxe_ds_StringMap();
	this.scount = 0;
};
$hxClasses["haxe.Serializer"] = haxe_Serializer;
haxe_Serializer.__name__ = ["haxe","Serializer"];
haxe_Serializer.run = function(v) {
	var s = new haxe_Serializer();
	s.serialize(v);
	return s.toString();
};
haxe_Serializer.prototype = {
	toString: function() {
		return this.buf.b;
	}
	,serializeString: function(s) {
		var x = this.shash.get(s);
		if(x != null) {
			this.buf.b += "R";
			if(x == null) this.buf.b += "null"; else this.buf.b += "" + x;
			return;
		}
		this.shash.set(s,this.scount++);
		this.buf.b += "y";
		s = encodeURIComponent(s);
		if(s.length == null) this.buf.b += "null"; else this.buf.b += "" + s.length;
		this.buf.b += ":";
		if(s == null) this.buf.b += "null"; else this.buf.b += "" + s;
	}
	,serializeRef: function(v) {
		var vt = typeof(v);
		var _g1 = 0;
		var _g = this.cache.length;
		while(_g1 < _g) {
			var i = _g1++;
			var ci = this.cache[i];
			if(typeof(ci) == vt && ci == v) {
				this.buf.b += "r";
				if(i == null) this.buf.b += "null"; else this.buf.b += "" + i;
				return true;
			}
		}
		this.cache.push(v);
		return false;
	}
	,serializeFields: function(v) {
		var _g = 0;
		var _g1 = Reflect.fields(v);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			this.serializeString(f);
			this.serialize(Reflect.field(v,f));
		}
		this.buf.b += "g";
	}
	,serialize: function(v) {
		{
			var _g = Type["typeof"](v);
			switch(_g[1]) {
			case 0:
				this.buf.b += "n";
				break;
			case 1:
				var v1 = v;
				if(v1 == 0) {
					this.buf.b += "z";
					return;
				}
				this.buf.b += "i";
				if(v1 == null) this.buf.b += "null"; else this.buf.b += "" + v1;
				break;
			case 2:
				var v2 = v;
				if(isNaN(v2)) this.buf.b += "k"; else if(!isFinite(v2)) if(v2 < 0) this.buf.b += "m"; else this.buf.b += "p"; else {
					this.buf.b += "d";
					if(v2 == null) this.buf.b += "null"; else this.buf.b += "" + v2;
				}
				break;
			case 3:
				if(v) this.buf.b += "t"; else this.buf.b += "f";
				break;
			case 6:
				var c = _g[2];
				if(c == String) {
					this.serializeString(v);
					return;
				}
				if(this.useCache && this.serializeRef(v)) return;
				switch(c) {
				case Array:
					var ucount = 0;
					this.buf.b += "a";
					var l = v.length;
					var _g1 = 0;
					while(_g1 < l) {
						var i = _g1++;
						if(v[i] == null) ucount++; else {
							if(ucount > 0) {
								if(ucount == 1) this.buf.b += "n"; else {
									this.buf.b += "u";
									if(ucount == null) this.buf.b += "null"; else this.buf.b += "" + ucount;
								}
								ucount = 0;
							}
							this.serialize(v[i]);
						}
					}
					if(ucount > 0) {
						if(ucount == 1) this.buf.b += "n"; else {
							this.buf.b += "u";
							if(ucount == null) this.buf.b += "null"; else this.buf.b += "" + ucount;
						}
					}
					this.buf.b += "h";
					break;
				case List:
					this.buf.b += "l";
					var v3 = v;
					var _g1_head = v3.h;
					var _g1_val = null;
					while(_g1_head != null) {
						var i1;
						_g1_val = _g1_head[0];
						_g1_head = _g1_head[1];
						i1 = _g1_val;
						this.serialize(i1);
					}
					this.buf.b += "h";
					break;
				case Date:
					var d = v;
					this.buf.b += "v";
					this.buf.add(d.getTime());
					break;
				case haxe_ds_StringMap:
					this.buf.b += "b";
					var v4 = v;
					var $it0 = v4.keys();
					while( $it0.hasNext() ) {
						var k = $it0.next();
						this.serializeString(k);
						this.serialize(__map_reserved[k] != null?v4.getReserved(k):v4.h[k]);
					}
					this.buf.b += "h";
					break;
				case haxe_ds_IntMap:
					this.buf.b += "q";
					var v5 = v;
					var $it1 = v5.keys();
					while( $it1.hasNext() ) {
						var k1 = $it1.next();
						this.buf.b += ":";
						if(k1 == null) this.buf.b += "null"; else this.buf.b += "" + k1;
						this.serialize(v5.h[k1]);
					}
					this.buf.b += "h";
					break;
				case haxe_ds_ObjectMap:
					this.buf.b += "M";
					var v6 = v;
					var $it2 = v6.keys();
					while( $it2.hasNext() ) {
						var k2 = $it2.next();
						var id = Reflect.field(k2,"__id__");
						Reflect.deleteField(k2,"__id__");
						this.serialize(k2);
						k2.__id__ = id;
						this.serialize(v6.h[k2.__id__]);
					}
					this.buf.b += "h";
					break;
				case haxe_io_Bytes:
					var v7 = v;
					var i2 = 0;
					var max = v7.length - 2;
					var charsBuf = new StringBuf();
					var b64 = haxe_Serializer.BASE64;
					while(i2 < max) {
						var b1 = v7.get(i2++);
						var b2 = v7.get(i2++);
						var b3 = v7.get(i2++);
						charsBuf.add(b64.charAt(b1 >> 2));
						charsBuf.add(b64.charAt((b1 << 4 | b2 >> 4) & 63));
						charsBuf.add(b64.charAt((b2 << 2 | b3 >> 6) & 63));
						charsBuf.add(b64.charAt(b3 & 63));
					}
					if(i2 == max) {
						var b11 = v7.get(i2++);
						var b21 = v7.get(i2++);
						charsBuf.add(b64.charAt(b11 >> 2));
						charsBuf.add(b64.charAt((b11 << 4 | b21 >> 4) & 63));
						charsBuf.add(b64.charAt(b21 << 2 & 63));
					} else if(i2 == max + 1) {
						var b12 = v7.get(i2++);
						charsBuf.add(b64.charAt(b12 >> 2));
						charsBuf.add(b64.charAt(b12 << 4 & 63));
					}
					var chars = charsBuf.b;
					this.buf.b += "s";
					if(chars.length == null) this.buf.b += "null"; else this.buf.b += "" + chars.length;
					this.buf.b += ":";
					if(chars == null) this.buf.b += "null"; else this.buf.b += "" + chars;
					break;
				default:
					if(this.useCache) this.cache.pop();
					if(v.hxSerialize != null) {
						this.buf.b += "C";
						this.serializeString(Type.getClassName(c));
						if(this.useCache) this.cache.push(v);
						v.hxSerialize(this);
						this.buf.b += "g";
					} else {
						this.buf.b += "c";
						this.serializeString(Type.getClassName(c));
						if(this.useCache) this.cache.push(v);
						this.serializeFields(v);
					}
				}
				break;
			case 4:
				if(js_Boot.__instanceof(v,Class)) {
					var className = Type.getClassName(v);
					this.buf.b += "A";
					this.serializeString(className);
				} else if(js_Boot.__instanceof(v,Enum)) {
					this.buf.b += "B";
					this.serializeString(Type.getEnumName(v));
				} else {
					if(this.useCache && this.serializeRef(v)) return;
					this.buf.b += "o";
					this.serializeFields(v);
				}
				break;
			case 7:
				var e = _g[2];
				if(this.useCache) {
					if(this.serializeRef(v)) return;
					this.cache.pop();
				}
				if(this.useEnumIndex) this.buf.b += "j"; else this.buf.b += "w";
				this.serializeString(Type.getEnumName(e));
				if(this.useEnumIndex) {
					this.buf.b += ":";
					this.buf.b += Std.string(v[1]);
				} else this.serializeString(v[0]);
				this.buf.b += ":";
				var l1 = v.length;
				this.buf.b += Std.string(l1 - 2);
				var _g11 = 2;
				while(_g11 < l1) {
					var i3 = _g11++;
					this.serialize(v[i3]);
				}
				if(this.useCache) this.cache.push(v);
				break;
			case 5:
				throw new js__$Boot_HaxeError("Cannot serialize function");
				break;
			default:
				throw new js__$Boot_HaxeError("Cannot serialize " + Std.string(v));
			}
		}
	}
	,__class__: haxe_Serializer
};
var haxe_Unserializer = function(buf) {
	this.buf = buf;
	this.length = buf.length;
	this.pos = 0;
	this.scache = [];
	this.cache = [];
	var r = haxe_Unserializer.DEFAULT_RESOLVER;
	if(r == null) {
		r = Type;
		haxe_Unserializer.DEFAULT_RESOLVER = r;
	}
	this.setResolver(r);
};
$hxClasses["haxe.Unserializer"] = haxe_Unserializer;
haxe_Unserializer.__name__ = ["haxe","Unserializer"];
haxe_Unserializer.initCodes = function() {
	var codes = [];
	var _g1 = 0;
	var _g = haxe_Unserializer.BASE64.length;
	while(_g1 < _g) {
		var i = _g1++;
		codes[haxe_Unserializer.BASE64.charCodeAt(i)] = i;
	}
	return codes;
};
haxe_Unserializer.run = function(v) {
	return new haxe_Unserializer(v).unserialize();
};
haxe_Unserializer.prototype = {
	setResolver: function(r) {
		if(r == null) this.resolver = { resolveClass : function(_) {
			return null;
		}, resolveEnum : function(_1) {
			return null;
		}}; else this.resolver = r;
	}
	,get: function(p) {
		return this.buf.charCodeAt(p);
	}
	,readDigits: function() {
		var k = 0;
		var s = false;
		var fpos = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c != c) break;
			if(c == 45) {
				if(this.pos != fpos) break;
				s = true;
				this.pos++;
				continue;
			}
			if(c < 48 || c > 57) break;
			k = k * 10 + (c - 48);
			this.pos++;
		}
		if(s) k *= -1;
		return k;
	}
	,readFloat: function() {
		var p1 = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c >= 43 && c < 58 || c == 101 || c == 69) this.pos++; else break;
		}
		return Std.parseFloat(HxOverrides.substr(this.buf,p1,this.pos - p1));
	}
	,unserializeObject: function(o) {
		while(true) {
			if(this.pos >= this.length) throw new js__$Boot_HaxeError("Invalid object");
			if(this.buf.charCodeAt(this.pos) == 103) break;
			var k = this.unserialize();
			if(!(typeof(k) == "string")) throw new js__$Boot_HaxeError("Invalid object key");
			var v = this.unserialize();
			o[k] = v;
		}
		this.pos++;
	}
	,unserializeEnum: function(edecl,tag) {
		if(this.get(this.pos++) != 58) throw new js__$Boot_HaxeError("Invalid enum format");
		var nargs = this.readDigits();
		if(nargs == 0) return Type.createEnum(edecl,tag);
		var args = [];
		while(nargs-- > 0) args.push(this.unserialize());
		return Type.createEnum(edecl,tag,args);
	}
	,unserialize: function() {
		var _g = this.get(this.pos++);
		switch(_g) {
		case 110:
			return null;
		case 116:
			return true;
		case 102:
			return false;
		case 122:
			return 0;
		case 105:
			return this.readDigits();
		case 100:
			return this.readFloat();
		case 121:
			var len = this.readDigits();
			if(this.get(this.pos++) != 58 || this.length - this.pos < len) throw new js__$Boot_HaxeError("Invalid string length");
			var s = HxOverrides.substr(this.buf,this.pos,len);
			this.pos += len;
			s = decodeURIComponent(s.split("+").join(" "));
			this.scache.push(s);
			return s;
		case 107:
			return NaN;
		case 109:
			return -Infinity;
		case 112:
			return Infinity;
		case 97:
			var buf = this.buf;
			var a = [];
			this.cache.push(a);
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c == 104) {
					this.pos++;
					break;
				}
				if(c == 117) {
					this.pos++;
					var n = this.readDigits();
					a[a.length + n - 1] = null;
				} else a.push(this.unserialize());
			}
			return a;
		case 111:
			var o = { };
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 114:
			var n1 = this.readDigits();
			if(n1 < 0 || n1 >= this.cache.length) throw new js__$Boot_HaxeError("Invalid reference");
			return this.cache[n1];
		case 82:
			var n2 = this.readDigits();
			if(n2 < 0 || n2 >= this.scache.length) throw new js__$Boot_HaxeError("Invalid string reference");
			return this.scache[n2];
		case 120:
			throw new js__$Boot_HaxeError(this.unserialize());
			break;
		case 99:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw new js__$Boot_HaxeError("Class not found " + name);
			var o1 = Type.createEmptyInstance(cl);
			this.cache.push(o1);
			this.unserializeObject(o1);
			return o1;
		case 119:
			var name1 = this.unserialize();
			var edecl = this.resolver.resolveEnum(name1);
			if(edecl == null) throw new js__$Boot_HaxeError("Enum not found " + name1);
			var e = this.unserializeEnum(edecl,this.unserialize());
			this.cache.push(e);
			return e;
		case 106:
			var name2 = this.unserialize();
			var edecl1 = this.resolver.resolveEnum(name2);
			if(edecl1 == null) throw new js__$Boot_HaxeError("Enum not found " + name2);
			this.pos++;
			var index = this.readDigits();
			var tag = Type.getEnumConstructs(edecl1)[index];
			if(tag == null) throw new js__$Boot_HaxeError("Unknown enum index " + name2 + "@" + index);
			var e1 = this.unserializeEnum(edecl1,tag);
			this.cache.push(e1);
			return e1;
		case 108:
			var l = new List();
			this.cache.push(l);
			var buf1 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) l.add(this.unserialize());
			this.pos++;
			return l;
		case 98:
			var h = new haxe_ds_StringMap();
			this.cache.push(h);
			var buf2 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s1 = this.unserialize();
				h.set(s1,this.unserialize());
			}
			this.pos++;
			return h;
		case 113:
			var h1 = new haxe_ds_IntMap();
			this.cache.push(h1);
			var buf3 = this.buf;
			var c1 = this.get(this.pos++);
			while(c1 == 58) {
				var i = this.readDigits();
				h1.set(i,this.unserialize());
				c1 = this.get(this.pos++);
			}
			if(c1 != 104) throw new js__$Boot_HaxeError("Invalid IntMap format");
			return h1;
		case 77:
			var h2 = new haxe_ds_ObjectMap();
			this.cache.push(h2);
			var buf4 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s2 = this.unserialize();
				h2.set(s2,this.unserialize());
			}
			this.pos++;
			return h2;
		case 118:
			var d;
			if(this.buf.charCodeAt(this.pos) >= 48 && this.buf.charCodeAt(this.pos) <= 57 && this.buf.charCodeAt(this.pos + 1) >= 48 && this.buf.charCodeAt(this.pos + 1) <= 57 && this.buf.charCodeAt(this.pos + 2) >= 48 && this.buf.charCodeAt(this.pos + 2) <= 57 && this.buf.charCodeAt(this.pos + 3) >= 48 && this.buf.charCodeAt(this.pos + 3) <= 57 && this.buf.charCodeAt(this.pos + 4) == 45) {
				var s3 = HxOverrides.substr(this.buf,this.pos,19);
				d = HxOverrides.strDate(s3);
				this.pos += 19;
			} else {
				var t = this.readFloat();
				var d1 = new Date();
				d1.setTime(t);
				d = d1;
			}
			this.cache.push(d);
			return d;
		case 115:
			var len1 = this.readDigits();
			var buf5 = this.buf;
			if(this.get(this.pos++) != 58 || this.length - this.pos < len1) throw new js__$Boot_HaxeError("Invalid bytes length");
			var codes = haxe_Unserializer.CODES;
			if(codes == null) {
				codes = haxe_Unserializer.initCodes();
				haxe_Unserializer.CODES = codes;
			}
			var i1 = this.pos;
			var rest = len1 & 3;
			var size;
			size = (len1 >> 2) * 3 + (rest >= 2?rest - 1:0);
			var max = i1 + (len1 - rest);
			var bytes = haxe_io_Bytes.alloc(size);
			var bpos = 0;
			while(i1 < max) {
				var c11 = codes[StringTools.fastCodeAt(buf5,i1++)];
				var c2 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c11 << 2 | c2 >> 4);
				var c3 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c2 << 4 | c3 >> 2);
				var c4 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c3 << 6 | c4);
			}
			if(rest >= 2) {
				var c12 = codes[StringTools.fastCodeAt(buf5,i1++)];
				var c21 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c12 << 2 | c21 >> 4);
				if(rest == 3) {
					var c31 = codes[StringTools.fastCodeAt(buf5,i1++)];
					bytes.set(bpos++,c21 << 4 | c31 >> 2);
				}
			}
			this.pos += len1;
			this.cache.push(bytes);
			return bytes;
		case 67:
			var name3 = this.unserialize();
			var cl1 = this.resolver.resolveClass(name3);
			if(cl1 == null) throw new js__$Boot_HaxeError("Class not found " + name3);
			var o2 = Type.createEmptyInstance(cl1);
			this.cache.push(o2);
			o2.hxUnserialize(this);
			if(this.get(this.pos++) != 103) throw new js__$Boot_HaxeError("Invalid custom data");
			return o2;
		case 65:
			var name4 = this.unserialize();
			var cl2 = this.resolver.resolveClass(name4);
			if(cl2 == null) throw new js__$Boot_HaxeError("Class not found " + name4);
			return cl2;
		case 66:
			var name5 = this.unserialize();
			var e2 = this.resolver.resolveEnum(name5);
			if(e2 == null) throw new js__$Boot_HaxeError("Enum not found " + name5);
			return e2;
		default:
		}
		this.pos--;
		throw new js__$Boot_HaxeError("Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos);
	}
	,__class__: haxe_Unserializer
};
var haxe_io_Bytes = function(data) {
	this.length = data.byteLength;
	this.b = new Uint8Array(data);
	data.hxBytes = this;
	data.bytes = this.b;
};
$hxClasses["haxe.io.Bytes"] = haxe_io_Bytes;
haxe_io_Bytes.__name__ = ["haxe","io","Bytes"];
haxe_io_Bytes.alloc = function(length) {
	return new haxe_io_Bytes(new ArrayBuffer(length));
};
haxe_io_Bytes.ofString = function(s) {
	var a = [];
	var i = 0;
	while(i < s.length) {
		var c = StringTools.fastCodeAt(s,i++);
		if(55296 <= c && c <= 56319) c = c - 55232 << 10 | StringTools.fastCodeAt(s,i++) & 1023;
		if(c <= 127) a.push(c); else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe_io_Bytes(new Uint8Array(a).buffer);
};
haxe_io_Bytes.prototype = {
	get: function(pos) {
		return this.b[pos];
	}
	,set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,getFloat: function(pos) {
		if(this.data == null) this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		return this.data.getFloat32(pos,true);
	}
	,setFloat: function(pos,v) {
		if(this.data == null) this.data = new DataView(this.b.buffer,this.b.byteOffset,this.b.byteLength);
		this.data.setFloat32(pos,v,true);
	}
	,getString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) break;
				s += fcc(c);
			} else if(c < 224) s += fcc((c & 63) << 6 | b[i++] & 127); else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c21 = b[i++];
				var c3 = b[i++];
				var u = (c & 15) << 18 | (c21 & 127) << 12 | (c3 & 127) << 6 | b[i++] & 127;
				s += fcc((u >> 10) + 55232);
				s += fcc(u & 1023 | 56320);
			}
		}
		return s;
	}
	,toString: function() {
		return this.getString(0,this.length);
	}
	,__class__: haxe_io_Bytes
};
var haxe_crypto_Base64 = function() { };
$hxClasses["haxe.crypto.Base64"] = haxe_crypto_Base64;
haxe_crypto_Base64.__name__ = ["haxe","crypto","Base64"];
haxe_crypto_Base64.encode = function(bytes,complement) {
	if(complement == null) complement = true;
	var str = new haxe_crypto_BaseCode(haxe_crypto_Base64.BYTES).encodeBytes(bytes).toString();
	if(complement) {
		var _g = bytes.length % 3;
		switch(_g) {
		case 1:
			str += "==";
			break;
		case 2:
			str += "=";
			break;
		default:
		}
	}
	return str;
};
haxe_crypto_Base64.decode = function(str,complement) {
	if(complement == null) complement = true;
	if(complement) while(HxOverrides.cca(str,str.length - 1) == 61) str = HxOverrides.substr(str,0,-1);
	return new haxe_crypto_BaseCode(haxe_crypto_Base64.BYTES).decodeBytes(haxe_io_Bytes.ofString(str));
};
var haxe_crypto_BaseCode = function(base) {
	var len = base.length;
	var nbits = 1;
	while(len > 1 << nbits) nbits++;
	if(nbits > 8 || len != 1 << nbits) throw new js__$Boot_HaxeError("BaseCode : base length must be a power of two.");
	this.base = base;
	this.nbits = nbits;
};
$hxClasses["haxe.crypto.BaseCode"] = haxe_crypto_BaseCode;
haxe_crypto_BaseCode.__name__ = ["haxe","crypto","BaseCode"];
haxe_crypto_BaseCode.prototype = {
	encodeBytes: function(b) {
		var nbits = this.nbits;
		var base = this.base;
		var size = b.length * 8 / nbits | 0;
		var out = haxe_io_Bytes.alloc(size + (b.length * 8 % nbits == 0?0:1));
		var buf = 0;
		var curbits = 0;
		var mask = (1 << nbits) - 1;
		var pin = 0;
		var pout = 0;
		while(pout < size) {
			while(curbits < nbits) {
				curbits += 8;
				buf <<= 8;
				buf |= b.get(pin++);
			}
			curbits -= nbits;
			out.set(pout++,base.b[buf >> curbits & mask]);
		}
		if(curbits > 0) out.set(pout++,base.b[buf << nbits - curbits & mask]);
		return out;
	}
	,initTable: function() {
		var tbl = [];
		var _g = 0;
		while(_g < 256) {
			var i = _g++;
			tbl[i] = -1;
		}
		var _g1 = 0;
		var _g2 = this.base.length;
		while(_g1 < _g2) {
			var i1 = _g1++;
			tbl[this.base.b[i1]] = i1;
		}
		this.tbl = tbl;
	}
	,decodeBytes: function(b) {
		var nbits = this.nbits;
		var base = this.base;
		if(this.tbl == null) this.initTable();
		var tbl = this.tbl;
		var size = b.length * nbits >> 3;
		var out = haxe_io_Bytes.alloc(size);
		var buf = 0;
		var curbits = 0;
		var pin = 0;
		var pout = 0;
		while(pout < size) {
			while(curbits < 8) {
				curbits += nbits;
				buf <<= nbits;
				var i = tbl[b.get(pin++)];
				if(i == -1) throw new js__$Boot_HaxeError("BaseCode : invalid encoded char");
				buf |= i;
			}
			curbits -= 8;
			out.set(pout++,buf >> curbits & 255);
		}
		return out;
	}
	,__class__: haxe_crypto_BaseCode
};
var haxe_crypto_Crc32 = function() { };
$hxClasses["haxe.crypto.Crc32"] = haxe_crypto_Crc32;
haxe_crypto_Crc32.__name__ = ["haxe","crypto","Crc32"];
haxe_crypto_Crc32.make = function(data) {
	var init = -1;
	var crc = init;
	var b = data.b.buffer;
	var _g1 = 0;
	var _g = data.length;
	while(_g1 < _g) {
		var i = _g1++;
		var tmp = (crc ^ b.bytes[i]) & 255;
		var _g2 = 0;
		while(_g2 < 8) {
			var j = _g2++;
			if((tmp & 1) == 1) tmp = tmp >>> 1 ^ -306674912; else tmp >>>= 1;
		}
		crc = crc >>> 8 ^ tmp;
	}
	return crc ^ init;
};
var haxe_ds_ArraySort = function() { };
$hxClasses["haxe.ds.ArraySort"] = haxe_ds_ArraySort;
haxe_ds_ArraySort.__name__ = ["haxe","ds","ArraySort"];
haxe_ds_ArraySort.sort = function(a,cmp) {
	haxe_ds_ArraySort.rec(a,cmp,0,a.length);
};
haxe_ds_ArraySort.rec = function(a,cmp,from,to) {
	var middle = from + to >> 1;
	if(to - from < 12) {
		if(to <= from) return;
		var _g = from + 1;
		while(_g < to) {
			var i = _g++;
			var j = i;
			while(j > from) {
				if(cmp(a[j],a[j - 1]) < 0) haxe_ds_ArraySort.swap(a,j - 1,j); else break;
				j--;
			}
		}
		return;
	}
	haxe_ds_ArraySort.rec(a,cmp,from,middle);
	haxe_ds_ArraySort.rec(a,cmp,middle,to);
	haxe_ds_ArraySort.doMerge(a,cmp,from,middle,to,middle - from,to - middle);
};
haxe_ds_ArraySort.doMerge = function(a,cmp,from,pivot,to,len1,len2) {
	var first_cut;
	var second_cut;
	var len11;
	var len22;
	var new_mid;
	if(len1 == 0 || len2 == 0) return;
	if(len1 + len2 == 2) {
		if(cmp(a[pivot],a[from]) < 0) haxe_ds_ArraySort.swap(a,pivot,from);
		return;
	}
	if(len1 > len2) {
		len11 = len1 >> 1;
		first_cut = from + len11;
		second_cut = haxe_ds_ArraySort.lower(a,cmp,pivot,to,first_cut);
		len22 = second_cut - pivot;
	} else {
		len22 = len2 >> 1;
		second_cut = pivot + len22;
		first_cut = haxe_ds_ArraySort.upper(a,cmp,from,pivot,second_cut);
		len11 = first_cut - from;
	}
	haxe_ds_ArraySort.rotate(a,cmp,first_cut,pivot,second_cut);
	new_mid = first_cut + len22;
	haxe_ds_ArraySort.doMerge(a,cmp,from,first_cut,new_mid,len11,len22);
	haxe_ds_ArraySort.doMerge(a,cmp,new_mid,second_cut,to,len1 - len11,len2 - len22);
};
haxe_ds_ArraySort.rotate = function(a,cmp,from,mid,to) {
	var n;
	if(from == mid || mid == to) return;
	n = haxe_ds_ArraySort.gcd(to - from,mid - from);
	while(n-- != 0) {
		var val = a[from + n];
		var shift = mid - from;
		var p1 = from + n;
		var p2 = from + n + shift;
		while(p2 != from + n) {
			a[p1] = a[p2];
			p1 = p2;
			if(to - p2 > shift) p2 += shift; else p2 = from + (shift - (to - p2));
		}
		a[p1] = val;
	}
};
haxe_ds_ArraySort.gcd = function(m,n) {
	while(n != 0) {
		var t = m % n;
		m = n;
		n = t;
	}
	return m;
};
haxe_ds_ArraySort.upper = function(a,cmp,from,to,val) {
	var len = to - from;
	var half;
	var mid;
	while(len > 0) {
		half = len >> 1;
		mid = from + half;
		if(cmp(a[val],a[mid]) < 0) len = half; else {
			from = mid + 1;
			len = len - half - 1;
		}
	}
	return from;
};
haxe_ds_ArraySort.lower = function(a,cmp,from,to,val) {
	var len = to - from;
	var half;
	var mid;
	while(len > 0) {
		half = len >> 1;
		mid = from + half;
		if(cmp(a[mid],a[val]) < 0) {
			from = mid + 1;
			len = len - half - 1;
		} else len = half;
	}
	return from;
};
haxe_ds_ArraySort.swap = function(a,i,j) {
	var tmp = a[i];
	a[i] = a[j];
	a[j] = tmp;
};
var haxe_ds_IntMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.IntMap"] = haxe_ds_IntMap;
haxe_ds_IntMap.__name__ = ["haxe","ds","IntMap"];
haxe_ds_IntMap.__interfaces__ = [haxe_IMap];
haxe_ds_IntMap.prototype = {
	set: function(key,value) {
		this.h[key] = value;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe_ds_IntMap
};
var haxe_ds_ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
$hxClasses["haxe.ds.ObjectMap"] = haxe_ds_ObjectMap;
haxe_ds_ObjectMap.__name__ = ["haxe","ds","ObjectMap"];
haxe_ds_ObjectMap.__interfaces__ = [haxe_IMap];
haxe_ds_ObjectMap.prototype = {
	set: function(key,value) {
		var id = key.__id__ || (key.__id__ = ++haxe_ds_ObjectMap.count);
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) a.push(this.h.__keys__[key]);
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe_ds_ObjectMap
};
var haxe_ds_StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe_ds_StringMap;
haxe_ds_StringMap.__name__ = ["haxe","ds","StringMap"];
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,get: function(key) {
		if(__map_reserved[key] != null) return this.getReserved(key);
		return this.h[key];
	}
	,exists: function(key) {
		if(__map_reserved[key] != null) return this.existsReserved(key);
		return this.h.hasOwnProperty(key);
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,existsReserved: function(key) {
		if(this.rh == null) return false;
		return this.rh.hasOwnProperty("$" + key);
	}
	,keys: function() {
		var _this = this.arrayKeys();
		return HxOverrides.iter(_this);
	}
	,arrayKeys: function() {
		var out = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) out.push(key);
		}
		if(this.rh != null) {
			for( var key in this.rh ) {
			if(key.charCodeAt(0) == 36) out.push(key.substr(1));
			}
		}
		return out;
	}
	,__class__: haxe_ds_StringMap
};
var haxe_io_BytesBuffer = function() {
	this.b = [];
};
$hxClasses["haxe.io.BytesBuffer"] = haxe_io_BytesBuffer;
haxe_io_BytesBuffer.__name__ = ["haxe","io","BytesBuffer"];
haxe_io_BytesBuffer.prototype = {
	addBytes: function(src,pos,len) {
		if(pos < 0 || len < 0 || pos + len > src.length) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
		var b1 = this.b;
		var b2 = src.b;
		var _g1 = pos;
		var _g = pos + len;
		while(_g1 < _g) {
			var i = _g1++;
			this.b.push(b2[i]);
		}
	}
	,getBytes: function() {
		var bytes = new haxe_io_Bytes(new Uint8Array(this.b).buffer);
		this.b = null;
		return bytes;
	}
	,__class__: haxe_io_BytesBuffer
};
var haxe_io_Input = function() { };
$hxClasses["haxe.io.Input"] = haxe_io_Input;
haxe_io_Input.__name__ = ["haxe","io","Input"];
var haxe_io_BytesInput = function(b,pos,len) {
	if(pos == null) pos = 0;
	if(len == null) len = b.length - pos;
	if(pos < 0 || len < 0 || pos + len > b.length) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
	this.b = b.b;
	this.pos = pos;
	this.len = len;
	this.totlen = len;
};
$hxClasses["haxe.io.BytesInput"] = haxe_io_BytesInput;
haxe_io_BytesInput.__name__ = ["haxe","io","BytesInput"];
haxe_io_BytesInput.__super__ = haxe_io_Input;
haxe_io_BytesInput.prototype = $extend(haxe_io_Input.prototype,{
	__class__: haxe_io_BytesInput
});
var haxe_io_Output = function() { };
$hxClasses["haxe.io.Output"] = haxe_io_Output;
haxe_io_Output.__name__ = ["haxe","io","Output"];
haxe_io_Output.prototype = {
	writeByte: function(c) {
		throw new js__$Boot_HaxeError("Not implemented");
	}
	,writeBytes: function(s,pos,len) {
		var k = len;
		var b = s.b.buffer;
		if(pos < 0 || len < 0 || pos + len > s.length) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
		while(k > 0) {
			this.writeByte(b[pos]);
			pos++;
			k--;
		}
		return len;
	}
	,write: function(s) {
		var l = s.length;
		var p = 0;
		while(l > 0) {
			var k = this.writeBytes(s,p,l);
			if(k == 0) throw new js__$Boot_HaxeError(haxe_io_Error.Blocked);
			p += k;
			l -= k;
		}
	}
	,writeFullBytes: function(s,pos,len) {
		while(len > 0) {
			var k = this.writeBytes(s,pos,len);
			pos += k;
			len -= k;
		}
	}
	,writeUInt16: function(x) {
		if(x < 0 || x >= 65536) throw new js__$Boot_HaxeError(haxe_io_Error.Overflow);
		if(this.bigEndian) {
			this.writeByte(x >> 8);
			this.writeByte(x & 255);
		} else {
			this.writeByte(x & 255);
			this.writeByte(x >> 8);
		}
	}
	,writeInt32: function(x) {
		if(this.bigEndian) {
			this.writeByte(x >>> 24);
			this.writeByte(x >> 16 & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x & 255);
		} else {
			this.writeByte(x & 255);
			this.writeByte(x >> 8 & 255);
			this.writeByte(x >> 16 & 255);
			this.writeByte(x >>> 24);
		}
	}
	,writeString: function(s) {
		var b = haxe_io_Bytes.ofString(s);
		this.writeFullBytes(b,0,b.length);
	}
	,__class__: haxe_io_Output
};
var haxe_io_BytesOutput = function() {
	this.b = new haxe_io_BytesBuffer();
};
$hxClasses["haxe.io.BytesOutput"] = haxe_io_BytesOutput;
haxe_io_BytesOutput.__name__ = ["haxe","io","BytesOutput"];
haxe_io_BytesOutput.__super__ = haxe_io_Output;
haxe_io_BytesOutput.prototype = $extend(haxe_io_Output.prototype,{
	writeByte: function(c) {
		this.b.b.push(c);
	}
	,writeBytes: function(buf,pos,len) {
		this.b.addBytes(buf,pos,len);
		return len;
	}
	,getBytes: function() {
		return this.b.getBytes();
	}
	,__class__: haxe_io_BytesOutput
});
var haxe_io_Eof = function() { };
$hxClasses["haxe.io.Eof"] = haxe_io_Eof;
haxe_io_Eof.__name__ = ["haxe","io","Eof"];
haxe_io_Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe_io_Eof
};
var haxe_io_Error = $hxClasses["haxe.io.Error"] = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe_io_Error.Blocked = ["Blocked",0];
haxe_io_Error.Blocked.toString = $estr;
haxe_io_Error.Blocked.__enum__ = haxe_io_Error;
haxe_io_Error.Overflow = ["Overflow",1];
haxe_io_Error.Overflow.toString = $estr;
haxe_io_Error.Overflow.__enum__ = haxe_io_Error;
haxe_io_Error.OutsideBounds = ["OutsideBounds",2];
haxe_io_Error.OutsideBounds.toString = $estr;
haxe_io_Error.OutsideBounds.__enum__ = haxe_io_Error;
haxe_io_Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe_io_Error; $x.toString = $estr; return $x; };
var haxe_io_FPHelper = function() { };
$hxClasses["haxe.io.FPHelper"] = haxe_io_FPHelper;
haxe_io_FPHelper.__name__ = ["haxe","io","FPHelper"];
haxe_io_FPHelper.i32ToFloat = function(i) {
	var sign = 1 - (i >>> 31 << 1);
	var exp = i >>> 23 & 255;
	var sig = i & 8388607;
	if(sig == 0 && exp == 0) return 0.0;
	return sign * (1 + Math.pow(2,-23) * sig) * Math.pow(2,exp - 127);
};
haxe_io_FPHelper.floatToI32 = function(f) {
	if(f == 0) return 0;
	var af;
	if(f < 0) af = -f; else af = f;
	var exp = Math.floor(Math.log(af) / 0.6931471805599453);
	if(exp < -127) exp = -127; else if(exp > 128) exp = 128;
	var sig = Math.round((af / Math.pow(2,exp) - 1) * 8388608) & 8388607;
	return (f < 0?-2147483648:0) | exp + 127 << 23 | sig;
};
haxe_io_FPHelper.i64ToDouble = function(low,high) {
	var sign = 1 - (high >>> 31 << 1);
	var exp = (high >> 20 & 2047) - 1023;
	var sig = (high & 1048575) * 4294967296. + (low >>> 31) * 2147483648. + (low & 2147483647);
	if(sig == 0 && exp == -1023) return 0.0;
	return sign * (1.0 + Math.pow(2,-52) * sig) * Math.pow(2,exp);
};
haxe_io_FPHelper.doubleToI64 = function(v) {
	var i64 = haxe_io_FPHelper.i64tmp;
	if(v == 0) {
		i64.low = 0;
		i64.high = 0;
	} else {
		var av;
		if(v < 0) av = -v; else av = v;
		var exp = Math.floor(Math.log(av) / 0.6931471805599453);
		var sig;
		var v1 = (av / Math.pow(2,exp) - 1) * 4503599627370496.;
		sig = Math.round(v1);
		var sig_l = sig | 0;
		var sig_h = sig / 4294967296.0 | 0;
		i64.low = sig_l;
		i64.high = (v < 0?-2147483648:0) | exp + 1023 << 20 | sig_h;
	}
	return i64;
};
var haxe_io_Path = function(path) {
	switch(path) {
	case ".":case "..":
		this.dir = path;
		this.file = "";
		return;
	}
	var c1 = path.lastIndexOf("/");
	var c2 = path.lastIndexOf("\\");
	if(c1 < c2) {
		this.dir = HxOverrides.substr(path,0,c2);
		path = HxOverrides.substr(path,c2 + 1,null);
		this.backslash = true;
	} else if(c2 < c1) {
		this.dir = HxOverrides.substr(path,0,c1);
		path = HxOverrides.substr(path,c1 + 1,null);
	} else this.dir = null;
	var cp = path.lastIndexOf(".");
	if(cp != -1) {
		this.ext = HxOverrides.substr(path,cp + 1,null);
		this.file = HxOverrides.substr(path,0,cp);
	} else {
		this.ext = null;
		this.file = path;
	}
};
$hxClasses["haxe.io.Path"] = haxe_io_Path;
haxe_io_Path.__name__ = ["haxe","io","Path"];
haxe_io_Path.withoutExtension = function(path) {
	var s = new haxe_io_Path(path);
	s.ext = null;
	return s.toString();
};
haxe_io_Path.withoutDirectory = function(path) {
	var s = new haxe_io_Path(path);
	s.dir = null;
	return s.toString();
};
haxe_io_Path.directory = function(path) {
	var s = new haxe_io_Path(path);
	if(s.dir == null) return "";
	return s.dir;
};
haxe_io_Path.extension = function(path) {
	var s = new haxe_io_Path(path);
	if(s.ext == null) return "";
	return s.ext;
};
haxe_io_Path.join = function(paths) {
	var paths1 = paths.filter(function(s) {
		return s != null && s != "";
	});
	if(paths1.length == 0) return "";
	var path = paths1[0];
	var _g1 = 1;
	var _g = paths1.length;
	while(_g1 < _g) {
		var i = _g1++;
		path = haxe_io_Path.addTrailingSlash(path);
		path += paths1[i];
	}
	return haxe_io_Path.normalize(path);
};
haxe_io_Path.normalize = function(path) {
	var slash = "/";
	path = path.split("\\").join("/");
	if(path == null || path == slash) return slash;
	var target = [];
	var _g = 0;
	var _g1 = path.split(slash);
	while(_g < _g1.length) {
		var token = _g1[_g];
		++_g;
		if(token == ".." && target.length > 0 && target[target.length - 1] != "..") target.pop(); else if(token != ".") target.push(token);
	}
	var tmp = target.join(slash);
	var regex = new EReg("([^:])/+","g");
	var result = regex.replace(tmp,"$1" + slash);
	var acc = new StringBuf();
	var colon = false;
	var slashes = false;
	var _g11 = 0;
	var _g2 = tmp.length;
	while(_g11 < _g2) {
		var i = _g11++;
		var _g21 = HxOverrides.cca(tmp,i);
		var i1 = _g21;
		if(_g21 != null) switch(_g21) {
		case 58:
			acc.b += ":";
			colon = true;
			break;
		case 47:
			if(colon == false) slashes = true; else {
				colon = false;
				if(slashes) {
					acc.b += "/";
					slashes = false;
				}
				acc.add(String.fromCharCode(i1));
			}
			break;
		default:
			colon = false;
			if(slashes) {
				acc.b += "/";
				slashes = false;
			}
			acc.add(String.fromCharCode(i1));
		} else {
			colon = false;
			if(slashes) {
				acc.b += "/";
				slashes = false;
			}
			acc.add(String.fromCharCode(i1));
		}
	}
	var result1 = acc.b;
	return result1;
};
haxe_io_Path.addTrailingSlash = function(path) {
	if(path.length == 0) return "/";
	var c1 = path.lastIndexOf("/");
	var c2 = path.lastIndexOf("\\");
	if(c1 < c2) {
		if(c2 != path.length - 1) return path + "\\"; else return path;
	} else if(c1 != path.length - 1) return path + "/"; else return path;
};
haxe_io_Path.isAbsolute = function(path) {
	if(StringTools.startsWith(path,"/")) return true;
	if(path.charAt(1) == ":") return true;
	return false;
};
haxe_io_Path.prototype = {
	toString: function() {
		return (this.dir == null?"":this.dir + (this.backslash?"\\":"/")) + this.file + (this.ext == null?"":"." + this.ext);
	}
	,__class__: haxe_io_Path
};
var haxe_zip_ExtraField = $hxClasses["haxe.zip.ExtraField"] = { __ename__ : ["haxe","zip","ExtraField"], __constructs__ : ["FUnknown","FInfoZipUnicodePath","FUtf8"] };
haxe_zip_ExtraField.FUnknown = function(tag,bytes) { var $x = ["FUnknown",0,tag,bytes]; $x.__enum__ = haxe_zip_ExtraField; $x.toString = $estr; return $x; };
haxe_zip_ExtraField.FInfoZipUnicodePath = function(name,crc) { var $x = ["FInfoZipUnicodePath",1,name,crc]; $x.__enum__ = haxe_zip_ExtraField; $x.toString = $estr; return $x; };
haxe_zip_ExtraField.FUtf8 = ["FUtf8",2];
haxe_zip_ExtraField.FUtf8.toString = $estr;
haxe_zip_ExtraField.FUtf8.__enum__ = haxe_zip_ExtraField;
var haxe_zip_Writer = function(o) {
	this.o = o;
	this.files = new List();
};
$hxClasses["haxe.zip.Writer"] = haxe_zip_Writer;
haxe_zip_Writer.__name__ = ["haxe","zip","Writer"];
haxe_zip_Writer.prototype = {
	writeZipDate: function(date) {
		var hour = date.getHours();
		var min = date.getMinutes();
		var sec = date.getSeconds() >> 1;
		this.o.writeUInt16(hour << 11 | min << 5 | sec);
		var year = date.getFullYear() - 1980;
		var month = date.getMonth() + 1;
		var day = date.getDate();
		this.o.writeUInt16(year << 9 | month << 5 | day);
	}
	,writeEntryHeader: function(f) {
		var o = this.o;
		var flags = 0;
		if(f.extraFields != null) {
			var _g_head = f.extraFields.h;
			var _g_val = null;
			while(_g_head != null) {
				var e1;
				e1 = (function($this) {
					var $r;
					_g_val = _g_head[0];
					_g_head = _g_head[1];
					$r = _g_val;
					return $r;
				}(this));
				switch(e1[1]) {
				case 2:
					flags |= 2048;
					break;
				default:
				}
			}
		}
		o.writeInt32(67324752);
		o.writeUInt16(20);
		o.writeUInt16(flags);
		if(f.data == null) {
			f.fileSize = 0;
			f.dataSize = 0;
			f.crc32 = 0;
			f.compressed = false;
			f.data = haxe_io_Bytes.alloc(0);
		} else {
			if(f.crc32 == null) {
				if(f.compressed) throw new js__$Boot_HaxeError("CRC32 must be processed before compression");
				f.crc32 = haxe_crypto_Crc32.make(f.data);
			}
			if(!f.compressed) f.fileSize = f.data.length;
			f.dataSize = f.data.length;
		}
		o.writeUInt16(f.compressed?8:0);
		this.writeZipDate(f.fileTime);
		o.writeInt32(f.crc32);
		o.writeInt32(f.dataSize);
		o.writeInt32(f.fileSize);
		o.writeUInt16(f.fileName.length);
		var e = new haxe_io_BytesOutput();
		if(f.extraFields != null) {
			var _g_head1 = f.extraFields.h;
			var _g_val1 = null;
			while(_g_head1 != null) {
				var f1;
				f1 = (function($this) {
					var $r;
					_g_val1 = _g_head1[0];
					_g_head1 = _g_head1[1];
					$r = _g_val1;
					return $r;
				}(this));
				switch(f1[1]) {
				case 1:
					var crc = f1[3];
					var name = f1[2];
					var namebytes = haxe_io_Bytes.ofString(name);
					e.writeUInt16(28789);
					e.writeUInt16(namebytes.length + 5);
					e.writeByte(1);
					e.writeInt32(crc);
					e.write(namebytes);
					break;
				case 0:
					var bytes = f1[3];
					var tag = f1[2];
					e.writeUInt16(tag);
					e.writeUInt16(bytes.length);
					e.write(bytes);
					break;
				case 2:
					break;
				}
			}
		}
		var ebytes = e.getBytes();
		o.writeUInt16(ebytes.length);
		o.writeString(f.fileName);
		o.write(ebytes);
		this.files.add({ name : f.fileName, compressed : f.compressed, clen : f.data.length, size : f.fileSize, crc : f.crc32, date : f.fileTime, fields : ebytes});
	}
	,write: function(files) {
		var _g_head = files.h;
		var _g_val = null;
		while(_g_head != null) {
			var f;
			f = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			this.writeEntryHeader(f);
			this.o.writeFullBytes(f.data,0,f.data.length);
		}
		this.writeCDR();
	}
	,writeCDR: function() {
		var cdr_size = 0;
		var cdr_offset = 0;
		var _g_head = this.files.h;
		var _g_val = null;
		while(_g_head != null) {
			var f;
			f = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			var namelen = f.name.length;
			var extraFieldsLength = f.fields.length;
			this.o.writeInt32(33639248);
			this.o.writeUInt16(20);
			this.o.writeUInt16(20);
			this.o.writeUInt16(0);
			this.o.writeUInt16(f.compressed?8:0);
			this.writeZipDate(f.date);
			this.o.writeInt32(f.crc);
			this.o.writeInt32(f.clen);
			this.o.writeInt32(f.size);
			this.o.writeUInt16(namelen);
			this.o.writeUInt16(extraFieldsLength);
			this.o.writeUInt16(0);
			this.o.writeUInt16(0);
			this.o.writeUInt16(0);
			this.o.writeInt32(0);
			this.o.writeInt32(cdr_offset);
			this.o.writeString(f.name);
			this.o.write(f.fields);
			cdr_size += 46 + namelen + extraFieldsLength;
			cdr_offset += 30 + namelen + extraFieldsLength + f.clen;
		}
		this.o.writeInt32(101010256);
		this.o.writeUInt16(0);
		this.o.writeUInt16(0);
		this.o.writeUInt16(this.files.length);
		this.o.writeUInt16(this.files.length);
		this.o.writeInt32(cdr_size);
		this.o.writeInt32(cdr_offset);
		this.o.writeUInt16(0);
	}
	,__class__: haxe_zip_Writer
};
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
$hxClasses["js._Boot.HaxeError"] = js__$Boot_HaxeError;
js__$Boot_HaxeError.__name__ = ["js","_Boot","HaxeError"];
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
	__class__: js__$Boot_HaxeError
});
var js_Boot = function() { };
$hxClasses["js.Boot"] = js_Boot;
js_Boot.__name__ = ["js","Boot"];
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js_Boot.__nativeClassName(o);
		if(name != null) return js_Boot.__resolveNativeClass(name);
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) return true;
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(o instanceof cl) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js_Boot.__cast = function(o,t) {
	if(js_Boot.__instanceof(o,t)) return o; else throw new js__$Boot_HaxeError("Cannot cast " + Std.string(o) + " to " + Std.string(t));
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	if(typeof window != "undefined") return window[name]; else return global[name];
};
var js_Browser = function() { };
$hxClasses["js.Browser"] = js_Browser;
js_Browser.__name__ = ["js","Browser"];
js_Browser.getLocalStorage = function() {
	try {
		var s = window.localStorage;
		s.getItem("");
		return s;
	} catch( e ) {
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		return null;
	}
};
var js_html_compat_ArrayBuffer = function(a) {
	if((a instanceof Array) && a.__enum__ == null) {
		this.a = a;
		this.byteLength = a.length;
	} else {
		var len = a;
		this.a = [];
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			this.a[i] = 0;
		}
		this.byteLength = len;
	}
};
$hxClasses["js.html.compat.ArrayBuffer"] = js_html_compat_ArrayBuffer;
js_html_compat_ArrayBuffer.__name__ = ["js","html","compat","ArrayBuffer"];
js_html_compat_ArrayBuffer.sliceImpl = function(begin,end) {
	var u = new Uint8Array(this,begin,end == null?null:end - begin);
	var result = new ArrayBuffer(u.byteLength);
	var resultArray = new Uint8Array(result);
	resultArray.set(u);
	return result;
};
js_html_compat_ArrayBuffer.prototype = {
	slice: function(begin,end) {
		return new js_html_compat_ArrayBuffer(this.a.slice(begin,end));
	}
	,__class__: js_html_compat_ArrayBuffer
};
var js_html_compat_DataView = function(buffer,byteOffset,byteLength) {
	this.buf = buffer;
	if(byteOffset == null) this.offset = 0; else this.offset = byteOffset;
	if(byteLength == null) this.length = buffer.byteLength - this.offset; else this.length = byteLength;
	if(this.offset < 0 || this.length < 0 || this.offset + this.length > buffer.byteLength) throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
};
$hxClasses["js.html.compat.DataView"] = js_html_compat_DataView;
js_html_compat_DataView.__name__ = ["js","html","compat","DataView"];
js_html_compat_DataView.prototype = {
	getInt8: function(byteOffset) {
		var v = this.buf.a[this.offset + byteOffset];
		if(v >= 128) return v - 256; else return v;
	}
	,getUint8: function(byteOffset) {
		return this.buf.a[this.offset + byteOffset];
	}
	,getInt16: function(byteOffset,littleEndian) {
		var v = this.getUint16(byteOffset,littleEndian);
		if(v >= 32768) return v - 65536; else return v;
	}
	,getUint16: function(byteOffset,littleEndian) {
		if(littleEndian) return this.buf.a[this.offset + byteOffset] | this.buf.a[this.offset + byteOffset + 1] << 8; else return this.buf.a[this.offset + byteOffset] << 8 | this.buf.a[this.offset + byteOffset + 1];
	}
	,getInt32: function(byteOffset,littleEndian) {
		var p = this.offset + byteOffset;
		var a = this.buf.a[p++];
		var b = this.buf.a[p++];
		var c = this.buf.a[p++];
		var d = this.buf.a[p++];
		if(littleEndian) return a | b << 8 | c << 16 | d << 24; else return d | c << 8 | b << 16 | a << 24;
	}
	,getUint32: function(byteOffset,littleEndian) {
		var v = this.getInt32(byteOffset,littleEndian);
		if(v < 0) return v + 4294967296.; else return v;
	}
	,getFloat32: function(byteOffset,littleEndian) {
		return haxe_io_FPHelper.i32ToFloat(this.getInt32(byteOffset,littleEndian));
	}
	,getFloat64: function(byteOffset,littleEndian) {
		var a = this.getInt32(byteOffset,littleEndian);
		var b = this.getInt32(byteOffset + 4,littleEndian);
		return haxe_io_FPHelper.i64ToDouble(littleEndian?a:b,littleEndian?b:a);
	}
	,setInt8: function(byteOffset,value) {
		if(value < 0) this.buf.a[byteOffset + this.offset] = value + 128 & 255; else this.buf.a[byteOffset + this.offset] = value & 255;
	}
	,setUint8: function(byteOffset,value) {
		this.buf.a[byteOffset + this.offset] = value & 255;
	}
	,setInt16: function(byteOffset,value,littleEndian) {
		this.setUint16(byteOffset,value < 0?value + 65536:value,littleEndian);
	}
	,setUint16: function(byteOffset,value,littleEndian) {
		var p = byteOffset + this.offset;
		if(littleEndian) {
			this.buf.a[p] = value & 255;
			this.buf.a[p++] = value >> 8 & 255;
		} else {
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p] = value & 255;
		}
	}
	,setInt32: function(byteOffset,value,littleEndian) {
		this.setUint32(byteOffset,value,littleEndian);
	}
	,setUint32: function(byteOffset,value,littleEndian) {
		var p = byteOffset + this.offset;
		if(littleEndian) {
			this.buf.a[p++] = value & 255;
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p++] = value >> 16 & 255;
			this.buf.a[p++] = value >>> 24;
		} else {
			this.buf.a[p++] = value >>> 24;
			this.buf.a[p++] = value >> 16 & 255;
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p++] = value & 255;
		}
	}
	,setFloat32: function(byteOffset,value,littleEndian) {
		this.setUint32(byteOffset,haxe_io_FPHelper.floatToI32(value),littleEndian);
	}
	,setFloat64: function(byteOffset,value,littleEndian) {
		var i64 = haxe_io_FPHelper.doubleToI64(value);
		if(littleEndian) {
			this.setUint32(byteOffset,i64.low);
			this.setUint32(byteOffset,i64.high);
		} else {
			this.setUint32(byteOffset,i64.high);
			this.setUint32(byteOffset,i64.low);
		}
	}
	,__class__: js_html_compat_DataView
};
var js_html_compat_Uint8Array = function() { };
$hxClasses["js.html.compat.Uint8Array"] = js_html_compat_Uint8Array;
js_html_compat_Uint8Array.__name__ = ["js","html","compat","Uint8Array"];
js_html_compat_Uint8Array._new = function(arg1,offset,length) {
	var arr;
	if(typeof(arg1) == "number") {
		arr = [];
		var _g = 0;
		while(_g < arg1) {
			var i = _g++;
			arr[i] = 0;
		}
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else if(js_Boot.__instanceof(arg1,js_html_compat_ArrayBuffer)) {
		var buffer = arg1;
		if(offset == null) offset = 0;
		if(length == null) length = buffer.byteLength - offset;
		if(offset == 0) arr = buffer.a; else arr = buffer.a.slice(offset,offset + length);
		arr.byteLength = arr.length;
		arr.byteOffset = offset;
		arr.buffer = buffer;
	} else if((arg1 instanceof Array) && arg1.__enum__ == null) {
		arr = arg1.slice();
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else throw new js__$Boot_HaxeError("TODO " + Std.string(arg1));
	arr.subarray = js_html_compat_Uint8Array._subarray;
	arr.set = js_html_compat_Uint8Array._set;
	return arr;
};
js_html_compat_Uint8Array._set = function(arg,offset) {
	var t = this;
	if(js_Boot.__instanceof(arg.buffer,js_html_compat_ArrayBuffer)) {
		var a = arg;
		if(arg.byteLength + offset > t.byteLength) throw new js__$Boot_HaxeError("set() outside of range");
		var _g1 = 0;
		var _g = arg.byteLength;
		while(_g1 < _g) {
			var i = _g1++;
			t[i + offset] = a[i];
		}
	} else if((arg instanceof Array) && arg.__enum__ == null) {
		var a1 = arg;
		if(a1.length + offset > t.byteLength) throw new js__$Boot_HaxeError("set() outside of range");
		var _g11 = 0;
		var _g2 = a1.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			t[i1 + offset] = a1[i1];
		}
	} else throw new js__$Boot_HaxeError("TODO");
};
js_html_compat_Uint8Array._subarray = function(start,end) {
	var t = this;
	var a = js_html_compat_Uint8Array._new(t.slice(start,end));
	a.byteOffset = start;
	return a;
};
var player_Ent = function() {
	gryffin_core_Entity.call(this);
	this.rect = new tannus_geom_CRectangle(0,0,0,0);
	this.margin = [0,0,0,0];
	this.padding = [0,0,0,0];
};
$hxClasses["player.Ent"] = player_Ent;
player_Ent.__name__ = ["player","Ent"];
player_Ent.__super__ = gryffin_core_Entity;
player_Ent.prototype = $extend(gryffin_core_Entity.prototype,{
	containsPoint: function(p) {
		return this.rect.contains(p.get_x(),p.get_y());
	}
	,get_x: function() {
		return this.rect.x;
	}
	,set_x: function(v) {
		return this.rect.x = v;
	}
	,get_y: function() {
		return this.rect.y;
	}
	,set_y: function(v) {
		return this.rect.y = v;
	}
	,get_w: function() {
		return this.rect.width;
	}
	,set_w: function(v) {
		return this.rect.width = v;
	}
	,get_h: function() {
		return this.rect.height;
	}
	,set_h: function(v) {
		return this.rect.height = v;
	}
	,get_pos: function() {
		return new tannus_geom_TPoint(this.rect.x,this.rect.y,0);
	}
	,set_pos: function(v) {
		var x = this.set_x(v.get_x());
		var y = this.set_y(v.get_y());
		return new tannus_geom_TPoint(x,y,0);
	}
	,__class__: player_Ent
	,__properties__: {set_pos:"set_pos",get_pos:"get_pos",set_h:"set_h",get_h:"get_h",set_w:"set_w",get_w:"get_w",set_y:"set_y",get_y:"get_y",set_x:"set_x",get_x:"get_x"}
});
var player_ControlButton = function(c) {
	player_Ent.call(this);
	this.controls = c;
	this.on("click",$bind(this,this.click));
	this.listen();
};
$hxClasses["player.ControlButton"] = player_ControlButton;
player_ControlButton.__name__ = ["player","ControlButton"];
player_ControlButton.__super__ = player_Ent;
player_ControlButton.prototype = $extend(player_Ent.prototype,{
	update: function(s) {
		player_Ent.prototype.update.call(this,s);
		this.set_w(this.rect.height = this.controls.rect.height);
		this.set_pos(this.position());
	}
	,click: function(e) {
		console.log("you clicked a button");
	}
	,position: function() {
		return this.rect.get_topLeft();
	}
	,listen: function() {
		var _g = this;
		this.controls.on("activated",function(x) {
			_g.controls.stage.addChild(_g);
		});
	}
	,get_player: function() {
		return this.controls.player;
	}
	,get_videoPane: function() {
		return this.controls.player.videoPane;
	}
	,get_video: function() {
		return this.controls.player.get_video();
	}
	,__class__: player_ControlButton
	,__properties__: $extend(player_Ent.prototype.__properties__,{get_video:"get_video",get_videoPane:"get_videoPane",get_player:"get_player"})
});
var player_Controls = function(p) {
	player_Ent.call(this);
	this.player = p;
	this.background = tannus_graphics__$Color_TColor.fromString("#666");
	this.hovered = false;
	this.seekbar = new player_Seekbar(this);
	this.buttons = [];
	this.buttons.push(new player_PlayButton(this));
	this.buttons.push(new player_VolumeButton(this));
	this.buttons.push(new player_NextButton(this));
	this.buttons.push(new player_PrevButton(this));
};
$hxClasses["player.Controls"] = player_Controls;
player_Controls.__name__ = ["player","Controls"];
player_Controls.__super__ = player_Ent;
player_Controls.prototype = $extend(player_Ent.prototype,{
	update: function(s) {
		this.rect.width = this.player.rect.width;
		this.rect.height = 35;
		this.rect.y = this.player.rect.height - this.rect.height;
		this.checkMouse();
	}
	,render: function(s,c) {
		if(this.player.showAll) {
			c.save();
			c.globalAlpha = 0.7;
			c.fillStyle = this.background.toString();
			c.fillRect(this.rect.x,this.rect.y,this.rect.width,this.rect.height);
			c.restore();
		}
	}
	,checkMouse: function() {
		var pos = this.stage.getMousePosition();
		this.hovered = pos != null && this.containsPoint(pos);
	}
	,__class__: player_Controls
});
var player_KeyControls = function(p) {
	var _g = this;
	this.player = p;
	this.stage = this.player.stage;
	this.player.on("activated",function(s) {
		_g.stage = s;
		_g.listen();
	});
};
$hxClasses["player.KeyControls"] = player_KeyControls;
player_KeyControls.__name__ = ["player","KeyControls"];
player_KeyControls.prototype = {
	listen: function() {
		this.stage.on("keydown",$bind(this,this.press));
	}
	,press: function(e) {
		var _g = e.keyCode;
		switch(_g) {
		case 32:
			(this.player.get_video().get_paused()?($_=this.player.get_video(),$bind($_,$_.play)):($_=this.player.get_video(),$bind($_,$_.pause)))();
			break;
		case 78:
			this.player.nextTrack(function() {
				console.log("skipped to next track");
			});
			break;
		case 80:
			this.player.prevTrack(function() {
				console.log("skipped to previous track");
			});
			break;
		case 79:
			if(e.ctrlKey) this.player.open(); else console.log(e.keyCode);
			break;
		case 77:
			this.player.get_video().set_muted(!this.player.get_video().get_muted());
			break;
		case 39:
			var _g1 = this.player.get_video();
			_g1.vid.currentTime = _g1.vid.currentTime + 15;
			break;
		case 37:
			var _g11 = this.player.get_video();
			_g11.vid.currentTime = _g11.vid.currentTime - 15;
			break;
		case 221:
			this.player.get_video().set_playbackRate(Math.round((this.player.get_video().get_playbackRate() + 0.05) * 100) / 100);
			break;
		case 219:
			this.player.get_video().set_playbackRate(Math.round((this.player.get_video().get_playbackRate() - 0.05) * 100) / 100);
			break;
		case 187:
			this.player.get_video().set_playbackRate(1.0);
			break;
		default:
			console.log(e.keyCode);
		}
	}
	,get_video: function() {
		return this.player.get_video();
	}
	,__class__: player_KeyControls
	,__properties__: {get_video:"get_video"}
};
var player_NextButton = function(c) {
	player_ControlButton.call(this,c);
	this.icon = gryffin_display_Image.load("../assets/next-light.png");
};
$hxClasses["player.NextButton"] = player_NextButton;
player_NextButton.__name__ = ["player","NextButton"];
player_NextButton.__super__ = player_ControlButton;
player_NextButton.prototype = $extend(player_ControlButton.prototype,{
	position: function() {
		return new tannus_geom_TPoint(this.controls.rect.x + this.controls.rect.width - this.rect.width * 2 - 10,this.controls.rect.y,0);
	}
	,render: function(s,c) {
		if(this.controls.player.showAll) {
			var src = new tannus_geom_CRectangle(0,0,this.icon.img.naturalWidth,this.icon.img.naturalHeight);
			var dest = new tannus_geom_CRectangle(this.rect.x,this.rect.y,this.rect.width,this.rect.height);
			this.icon.paint(c,src,dest);
		}
	}
	,click: function(e) {
		this.controls.player.nextTrack(function() {
			console.log("skipped to next track");
		});
	}
	,__class__: player_NextButton
});
var player_PlayButton = function(c) {
	player_ControlButton.call(this,c);
	var l = gryffin_display_Image.load("../assets/play-light.png");
	var r = gryffin_display_Image.load("../assets/pause-light.png");
	this.icons = new tannus_ds_CPair(l,r);
};
$hxClasses["player.PlayButton"] = player_PlayButton;
player_PlayButton.__name__ = ["player","PlayButton"];
player_PlayButton.__super__ = player_ControlButton;
player_PlayButton.prototype = $extend(player_ControlButton.prototype,{
	position: function() {
		return new tannus_geom_TPoint(this.controls.rect.x,this.controls.rect.y,0);
	}
	,click: function(e) {
		(this.controls.player.get_video().get_paused()?($_=this.controls.player.get_video(),$bind($_,$_.play)):($_=this.controls.player.get_video(),$bind($_,$_.pause)))();
	}
	,render: function(s,c) {
		var icon;
		if(this.controls.player.get_video().get_paused()) icon = this.icons.left; else icon = this.icons.right;
		if(this.controls.player.showAll) {
			var src = new tannus_geom_CRectangle(0,0,icon.img.naturalWidth,icon.img.naturalHeight);
			var dest = new tannus_geom_CRectangle(this.rect.x,this.rect.y,this.rect.width,this.rect.height);
			icon.paint(c,src,dest);
		}
	}
	,__class__: player_PlayButton
});
var player_Player = function() {
	player_Ent.call(this);
	this.videoPane = new player_VideoPane();
	this.controls = new player_Controls(this);
	this.keyControls = new player_KeyControls(this);
	this.speedView = new player_SpeedView(this);
	this.idleTime = 2200;
	this.currentMedia = null;
	this.showAll = false;
};
$hxClasses["player.Player"] = player_Player;
player_Player.__name__ = ["player","Player"];
player_Player.__super__ = player_Ent;
player_Player.prototype = $extend(player_Ent.prototype,{
	setMedia: function(track,cb) {
		var _g = this;
		this.get_video().load(track.location,function() {
			window.document.title = "BPlayer - " + track.title;
			_g.currentMedia = track;
			if(cb != null) cb();
		});
	}
	,setMediaList: function(list) {
		if(!Lambda.empty(list.tracks)) {
			this.playlist = list;
			if(this.currentMedia == null) this.setMedia(list.tracks[0]);
		}
	}
	,nextTrack: function(cb) {
		if((this.playlist != null && this.currentMedia != null?HxOverrides.indexOf(this.playlist.tracks,this.currentMedia,0):-1) != -1) this.setMedia(this.playlist.tracks[this.nextTrackIndex()],cb);
	}
	,prevTrack: function(cb) {
		if((this.playlist != null && this.currentMedia != null?HxOverrides.indexOf(this.playlist.tracks,this.currentMedia,0):-1) != -1) this.setMedia(this.playlist.tracks[this.prevTrackIndex()],cb);
	}
	,open: function(cb) {
		var _g = this;
		this.choose(function(list) {
			if(_g.playlist == null) _g.setMediaList(list); else _g.playlist.tracks = _g.playlist.tracks.concat(list.tracks);
			if(cb != null) cb();
		});
	}
	,nextTrackIndex: function() {
		if((this.playlist != null && this.currentMedia != null?HxOverrides.indexOf(this.playlist.tracks,this.currentMedia,0):-1) == this.playlist.tracks.length - 1) return 0; else return (this.playlist != null && this.currentMedia != null?HxOverrides.indexOf(this.playlist.tracks,this.currentMedia,0):-1) + 1;
	}
	,prevTrackIndex: function() {
		if((this.playlist != null && this.currentMedia != null?HxOverrides.indexOf(this.playlist.tracks,this.currentMedia,0):-1) == 0) return this.playlist.tracks.length - 1; else return (this.playlist != null && this.currentMedia != null?HxOverrides.indexOf(this.playlist.tracks,this.currentMedia,0):-1) - 1;
	}
	,choose: function(cb) {
		tannus_chrome_FileSystem.chooseEntry({ acceptsMultiple : true},function(entries) {
			var stack = new tannus_ds_AsyncStack();
			var list = new tannus_media_Playlist();
			var _g = 0;
			while(_g < entries.length) {
				var entry = [entries[_g]];
				++_g;
				if(entry[0].isFile) stack.under((function(entry) {
					return function(done) {
						var filee = entry[0];
						tannus_html_fs__$WebFileEntry_WebFileEntry_$Impl_$.file(filee).then((function(entry) {
							return function(file) {
								var url = window.webkitURL.createObjectURL(file);
								if((function($this) {
									var $r;
									var this1 = file.type;
									$r = tannus_ds_StringUtils.has(this1,"/")?this1.substring(0,this1.indexOf("/")):this1;
									return $r;
								}(this)) == "video") {
									var track = new tannus_media_Track(entry[0].name,url);
									list.addTrack(track);
									done();
								}
							};
						})(entry));
					};
				})(entry));
			}
			stack.run(function() {
				cb(list);
			});
		});
	}
	,init: function(s) {
		player_Ent.prototype.init.call(this,s);
		s.addChild(this.videoPane);
		s.addChild(this.controls);
	}
	,update: function(s) {
		this.rect.width = s.canvas.width;
		this.rect.height = s.canvas.height;
		this.showAll = false;
		var showAllEvents = ["mousemove","click","keydown"];
		var now = new Date().getTime();
		var _g = 0;
		while(_g < showAllEvents.length) {
			var name = showAllEvents[_g];
			++_g;
			var sinceLast = now - s.mostRecentOccurrenceTime(name);
			this.showAll = sinceLast < this.idleTime;
			if(this.showAll) break;
		}
	}
	,render: function(s,c) {
		null;
	}
	,get_video: function() {
		return this.videoPane.video;
	}
	,get_window: function() {
		return window;
	}
	,get_document: function() {
		return window.document;
	}
	,get_trackNumber: function() {
		if(this.playlist != null && this.currentMedia != null) return HxOverrides.indexOf(this.playlist.tracks,this.currentMedia,0); else return -1;
	}
	,__class__: player_Player
	,__properties__: $extend(player_Ent.prototype.__properties__,{get_trackNumber:"get_trackNumber",get_document:"get_document",get_window:"get_window",get_video:"get_video"})
});
var player_PrevButton = function(c) {
	player_ControlButton.call(this,c);
	this.icon = gryffin_display_Image.load("../assets/previous-light.png");
};
$hxClasses["player.PrevButton"] = player_PrevButton;
player_PrevButton.__name__ = ["player","PrevButton"];
player_PrevButton.__super__ = player_ControlButton;
player_PrevButton.prototype = $extend(player_ControlButton.prototype,{
	position: function() {
		return new tannus_geom_TPoint(this.controls.rect.x + this.rect.width + 5,this.controls.rect.y,0);
	}
	,render: function(s,c) {
		if(this.controls.player.showAll) {
			var src = new tannus_geom_CRectangle(0,0,this.icon.img.naturalWidth,this.icon.img.naturalHeight);
			var dest = new tannus_geom_CRectangle(this.rect.x,this.rect.y,this.rect.width,this.rect.height);
			this.icon.paint(c,src,dest);
		}
	}
	,click: function(e) {
		this.controls.player.prevTrack(function() {
			console.log("skipped to previous track");
		});
	}
	,__class__: player_PrevButton
});
var player_Seekbar = function(c) {
	player_Ent.call(this);
	this.controls = c;
	this.hovered = false;
	this.hoverLocation = null;
	this.listen();
};
$hxClasses["player.Seekbar"] = player_Seekbar;
player_Seekbar.__name__ = ["player","Seekbar"];
player_Seekbar.__super__ = player_Ent;
player_Seekbar.prototype = $extend(player_Ent.prototype,{
	update: function(s) {
		player_Ent.prototype.update.call(this,s);
		this.rect.cloneFrom(this.controls.rect);
		this.rect.height = 18;
		this.rect.y = this.controls.rect.y - this.rect.height;
		this.hovered = false;
		this.hoverLocation = null;
		var mp = this.stage.getMousePosition();
		if(mp != null && this.containsPoint(mp)) {
			this.hovered = true;
			this.hoverLocation = mp;
		}
	}
	,render: function(s,c) {
		if(this.controls.player.showAll) {
			c.fillStyle = "#FFF";
			var p = this.progress();
			c.fillRect(this.rect.x,this.rect.y,this.rect.width * (p / 100),this.rect.height);
			var text = tannus_media__$Duration_Duration_$Impl_$.toString(this.currentTime());
			c.font = "12pt Monospace";
			var tm = gryffin_display_CtxTools.patchedMeasureText(c,text);
			var tr = new tannus_geom_CRectangle(0,0,tm.width + 4,tm.height + 4);
			tr.x = this.rect.x + this.rect.width * (p / 100) - tm.width / 2;
			tr.y = this.rect.y - tr.height - 5;
			if(tr.x < 5) tr.x = 5;
			if(tr.x > s.canvas.width - 5) tr.x = s.canvas.width - 5;
			c.fillStyle = "#888";
			c.fillRect(tr.x,tr.y,tr.width,tr.height);
			c.fillStyle = "#000";
			c.fillText(text,tr.x + 2,tr.y + tr.height - 2);
		}
	}
	,listen: function() {
		var _g = this;
		this.controls.on("activated",function(x) {
			_g.controls.stage.addChild(_g);
		});
		this.on("click",$bind(this,this.click));
	}
	,click: function(e) {
		var p = tannus_math__$Percent_Percent_$Impl_$.percent(Math.abs(this.rect.x - e.position.get_x()),this.rect.width);
		var v = this.controls.player.get_video();
		v.set_currentTime((function($this) {
			var $r;
			var this1 = tannus_media__$Duration_Duration_$Impl_$.fromSecondsF(v.vid.duration);
			$r = 3600 * this1.hours + 60 * this1.minutes + this1.seconds;
			return $r;
		}(this)) * (p / 100));
	}
	,progress: function() {
		if(!this.hovered) return this.controls.player.get_video().get_progress(); else return tannus_math__$Percent_Percent_$Impl_$.percent(this.hoverLocation.get_x(),this.rect.width);
	}
	,currentTime: function() {
		var v = this.controls.player.get_video();
		return tannus_media__$Duration_Duration_$Impl_$.fromSecondsF((function($this) {
			var $r;
			var this1 = tannus_media__$Duration_Duration_$Impl_$.fromSecondsF(v.vid.duration);
			$r = 3600 * this1.hours + 60 * this1.minutes + this1.seconds;
			return $r;
		}(this)) * ((function($this) {
			var $r;
			var this2 = $this.progress();
			$r = this2;
			return $r;
		}(this)) / 100));
	}
	,__class__: player_Seekbar
});
var player_SpeedView = function(p) {
	var _g = this;
	player_Ent.call(this);
	this.player = p;
	this.player.on("activated",function(s) {
		s.addChild(_g);
	});
};
$hxClasses["player.SpeedView"] = player_SpeedView;
player_SpeedView.__name__ = ["player","SpeedView"];
player_SpeedView.__super__ = player_Ent;
player_SpeedView.prototype = $extend(player_Ent.prototype,{
	update: function(s) {
	}
	,render: function(s,c) {
		if(this.player.showAll) {
			c.save();
			c.font = "10pt Monospace";
			var tm;
			var txt;
			var this1 = tannus_math__$Percent_Percent_$Impl_$.percent(this.player.get_video().get_playbackRate(),1.0);
			txt = "" + this1 + "%";
			tm = gryffin_display_CtxTools.patchedMeasureText(c,txt);
			this.rect.width = tm.width + 6;
			this.rect.height = tm.height + 6;
			this.rect.x = s.canvas.width - this.rect.width - 6;
			this.rect.y = 6;
			c.fillStyle = "#888";
			c.globalAlpha = 0.8;
			c.fillRect(this.rect.x,this.rect.y,this.rect.width,this.rect.height);
			c.fillStyle = "#000";
			c.fillText((function($this) {
				var $r;
				var this2 = tannus_math__$Percent_Percent_$Impl_$.percent($this.player.get_video().get_playbackRate(),1.0);
				$r = "" + this2 + "%";
				return $r;
			}(this)),this.rect.x + 3,this.rect.y + this.rect.height - 3);
			c.restore();
		}
	}
	,get_video: function() {
		return this.player.get_video();
	}
	,get_speed: function() {
		return tannus_math__$Percent_Percent_$Impl_$.percent(this.player.get_video().get_playbackRate(),1.0);
	}
	,__class__: player_SpeedView
	,__properties__: $extend(player_Ent.prototype.__properties__,{get_speed:"get_speed",get_video:"get_video"})
});
var player_VideoPane = function(vid) {
	player_Ent.call(this);
	if(vid != null) this.video = vid; else this.video = new gryffin_display_Video();
};
$hxClasses["player.VideoPane"] = player_VideoPane;
player_VideoPane.__name__ = ["player","VideoPane"];
player_VideoPane.__super__ = player_Ent;
player_VideoPane.prototype = $extend(player_Ent.prototype,{
	init: function(s) {
		player_Ent.prototype.init.call(this,s);
	}
	,update: function(s) {
		this.rect.width = s.canvas.width;
		this.rect.height = s.canvas.height;
	}
	,render: function(s,c) {
		c.save();
		if(this.video.vid.videoWidth == 0 || this.video.vid.videoHeight == 0) {
			c.fillStyle = "#000";
			c.fillRect(this.rect.x,this.rect.y,this.rect.width,this.rect.height);
		} else {
			var src = new tannus_geom_CRectangle(0,0,this.video.vid.videoWidth,this.video.vid.videoHeight);
			var dest = new tannus_geom_CRectangle(this.rect.x,this.rect.y,this.rect.width,this.rect.height);
			this.video.paint(c,src,dest);
		}
		c.restore();
	}
	,__class__: player_VideoPane
});
var player_VolumeButton = function(c) {
	player_ControlButton.call(this,c);
	this.icon = gryffin_display_Image.load("../assets/volume-light.png");
	this.hovered = false;
	this.widget = new player_VolumeWidget(this.controls,this);
};
$hxClasses["player.VolumeButton"] = player_VolumeButton;
player_VolumeButton.__name__ = ["player","VolumeButton"];
player_VolumeButton.__super__ = player_ControlButton;
player_VolumeButton.prototype = $extend(player_ControlButton.prototype,{
	update: function(s) {
		var mp = s.getMousePosition();
		this.hovered = mp != null && this.containsPoint(mp);
		this.set_w(this.rect.height = this.controls.rect.height);
		this.rect.x = this.controls.rect.x + this.controls.rect.width - this.rect.width - 5;
		this.rect.y = this.controls.rect.y;
	}
	,render: function(s,c) {
		if(this.controls.player.showAll) {
			var src = new tannus_geom_CRectangle(0,0,this.icon.img.naturalWidth,this.icon.img.naturalHeight);
			var dest = new tannus_geom_CRectangle(this.rect.x,this.rect.y,this.rect.width,this.rect.height);
			this.icon.paint(c,src,dest);
		}
	}
	,click: function(e) {
		this.widget.toggleHidden();
	}
	,__class__: player_VolumeButton
});
var player_VolumeWidget = function(c,vb) {
	var _g = this;
	player_Ent.call(this);
	this.controls = c;
	this.button = vb;
	this.button.on("activated",function(stage) {
		stage.addChild(_g);
	});
	this.on("click",$bind(this,this.click));
	this.hide();
};
$hxClasses["player.VolumeWidget"] = player_VolumeWidget;
player_VolumeWidget.__name__ = ["player","VolumeWidget"];
player_VolumeWidget.__super__ = player_Ent;
player_VolumeWidget.prototype = $extend(player_Ent.prototype,{
	update: function(s) {
		player_Ent.prototype.update.call(this,s);
		this.rect.width = 10;
		this.rect.height = 75;
		this.rect.x = this.button.rect.x + this.button.rect.width / 2;
		this.rect.y = this.button.rect.y - this.rect.height - 8;
	}
	,render: function(s,c) {
		if(this.button.controls.player.showAll) {
			var _h = this.rect.height * this.controls.player.get_video().get_volume();
			c.save();
			c.fillStyle = "#888";
			c.fillRect(this.rect.x,this.rect.y,this.rect.width,this.rect.height);
			c.fillStyle = "#FFF";
			c.fillRect(this.rect.x,this.rect.y + (this.rect.height - _h),this.rect.width,_h);
			c.strokeStyle = "#000";
			c.strokeRect(this.rect.x,this.rect.y,this.rect.width,this.rect.height);
			c.restore();
		}
	}
	,click: function(e) {
		var vp;
		var this1;
		var f;
		f = (function($this) {
			var $r;
			var this2 = tannus_math__$Percent_Percent_$Impl_$.percent($this.rect.y - e.position.get_y(),$this.rect.height);
			$r = this2;
			return $r;
		}(this)) * -1;
		this1 = f;
		vp = 100 - this1;
		this.controls.player.get_video().set_volume(vp / 100);
	}
	,get_volume: function() {
		return this.controls.player.get_video().get_volume();
	}
	,set_volume: function(v) {
		return this.controls.player.get_video().set_volume(v);
	}
	,__class__: player_VolumeWidget
	,__properties__: $extend(player_Ent.prototype.__properties__,{set_volume:"set_volume",get_volume:"get_volume"})
});
var tannus_chrome_FileSystem = function() { };
$hxClasses["tannus.chrome.FileSystem"] = tannus_chrome_FileSystem;
tannus_chrome_FileSystem.__name__ = ["tannus","chrome","FileSystem"];
tannus_chrome_FileSystem.__properties__ = {get_lib:"get_lib"}
tannus_chrome_FileSystem.requestFileSystem = function(volume,cb) {
	chrome.fileSystem.requestFileSystem({ 'volumeId' : volume, 'writable' : true},cb);
};
tannus_chrome_FileSystem.getVolumeList = function(cb) {
	chrome.fileSystem.getVolumeList(cb);
};
tannus_chrome_FileSystem.chooseEntry = function(options,cb) {
	chrome.fileSystem.chooseEntry(options,function(entry) {
		var all = [];
		if(entry != null) {
			if((entry instanceof Array) && entry.__enum__ == null) all = all.concat(entry); else all.push(entry);
		}
		var _all = all;
		all = tannus_ds_ArrayTools.flatten(_all);
		cb(all);
	});
};
tannus_chrome_FileSystem.chooseDirectory = function() {
	return new tannus_ds_Promise(function(accept,reject) {
		tannus_chrome_FileSystem.chooseEntry({ type : "openDirectory"},function(entries) {
			var e = entries.shift();
			if(e == null || !e.isDirectory) reject("Not a Directory!"); else accept(e);
		});
	},null);
};
tannus_chrome_FileSystem.getDisplayPath = function(entry,cb) {
	chrome.fileSystem.getDisplayPath(entry,cb);
};
tannus_chrome_FileSystem.get_lib = function() {
	return chrome.fileSystem;
};
var tannus_css_Property = function(key,val) {
	this.name = key;
	this.value = val;
};
$hxClasses["tannus.css.Property"] = tannus_css_Property;
tannus_css_Property.__name__ = ["tannus","css","Property"];
tannus_css_Property.prototype = {
	get_values: function() {
		return tannus_css_vals_Lexer.parseString(this.value);
	}
	,__class__: tannus_css_Property
	,__properties__: {get_values:"get_values"}
};
var tannus_css_Rule = function(par,sel,props) {
	this.sheet = par;
	this.selector = sel;
	if(props != null) this.properties = props; else this.properties = [];
};
$hxClasses["tannus.css.Rule"] = tannus_css_Rule;
tannus_css_Rule.__name__ = ["tannus","css","Rule"];
tannus_css_Rule.prototype = {
	child: function(childSel,props) {
		var sel = [this.selector," ",childSel].join("");
		return this.sheet.rule(sel,props);
	}
	,set: function(name,value) {
		this.properties.push(new tannus_css_Property(name,Std.string(value)));
	}
	,exists: function(name) {
		return this.getProp(name) != null;
	}
	,get: function(name) {
		if(this.exists(name)) return this.getProp(name).value; else return null;
	}
	,getProp: function(name) {
		var _g = 0;
		var _g1 = this.properties;
		while(_g < _g1.length) {
			var prop = _g1[_g];
			++_g;
			if(prop.name == name) return prop;
		}
		return null;
	}
	,__class__: tannus_css_Rule
};
var tannus_css_StyleSheet = function() {
	this.rules = [];
};
$hxClasses["tannus.css.StyleSheet"] = tannus_css_StyleSheet;
tannus_css_StyleSheet.__name__ = ["tannus","css","StyleSheet"];
tannus_css_StyleSheet.prototype = {
	rule: function(selector,props) {
		var r;
		if(this.hasRule(selector)) r = this.getRule(selector); else {
			r = new tannus_css_Rule(this,selector);
			this.rules.push(r);
		}
		if(props != null) {
			var _g = 0;
			var _g1;
			var this1 = props;
			_g1 = Reflect.fields(this1).map(function(k) {
				return { 'name' : k, 'value' : Reflect.getProperty(this1,k)};
			});
			while(_g < _g1.length) {
				var p = _g1[_g];
				++_g;
				r.set(p.name,p.value);
			}
		}
		return r;
	}
	,hasRule: function(sel) {
		return this.getRule(sel) != null;
	}
	,getRule: function(sel) {
		var _g = 0;
		var _g1 = this.rules;
		while(_g < _g1.length) {
			var rule = _g1[_g];
			++_g;
			if(rule.selector == sel) return rule;
		}
		return null;
	}
	,toString: function() {
		var w = new tannus_css_Writer();
		{
			var this1 = w.generate(this);
			return this1.map(function(b) {
				return String.fromCharCode(b);
			}).join("");
		}
	}
	,__class__: tannus_css_StyleSheet
};
var tannus_css_Value = $hxClasses["tannus.css.Value"] = { __ename__ : ["tannus","css","Value"], __constructs__ : ["VIdent","VString","VNumber","VColor","VRef","VCall","VTuple"] };
tannus_css_Value.VIdent = function(id) { var $x = ["VIdent",0,id]; $x.__enum__ = tannus_css_Value; $x.toString = $estr; return $x; };
tannus_css_Value.VString = function(str) { var $x = ["VString",1,str]; $x.__enum__ = tannus_css_Value; $x.toString = $estr; return $x; };
tannus_css_Value.VNumber = function(num,unit) { var $x = ["VNumber",2,num,unit]; $x.__enum__ = tannus_css_Value; $x.toString = $estr; return $x; };
tannus_css_Value.VColor = function(col) { var $x = ["VColor",3,col]; $x.__enum__ = tannus_css_Value; $x.toString = $estr; return $x; };
tannus_css_Value.VRef = function(name) { var $x = ["VRef",4,name]; $x.__enum__ = tannus_css_Value; $x.toString = $estr; return $x; };
tannus_css_Value.VCall = function(func,args) { var $x = ["VCall",5,func,args]; $x.__enum__ = tannus_css_Value; $x.toString = $estr; return $x; };
tannus_css_Value.VTuple = function(vals) { var $x = ["VTuple",6,vals]; $x.__enum__ = tannus_css_Value; $x.toString = $estr; return $x; };
var tannus_css_Writer = function() {
};
$hxClasses["tannus.css.Writer"] = tannus_css_Writer;
tannus_css_Writer.__name__ = ["tannus","css","Writer"];
tannus_css_Writer.prototype = {
	generate: function(sheet) {
		this.buffer = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
		var _g = 0;
		var _g1 = sheet.rules;
		while(_g < _g1.length) {
			var rule = _g1[_g];
			++_g;
			this.writeRule(rule);
		}
		return this.buffer;
	}
	,writeRule: function(rule) {
		var tab = "    ";
		this.writeln((function($this) {
			var $r;
			var ba = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
			tannus_io__$ByteArray_ByteArray_$Impl_$.writeString(ba,rule.selector + " {");
			$r = ba;
			return $r;
		}(this)));
		var _g = 0;
		var _g1 = rule.properties;
		while(_g < _g1.length) {
			var prop = _g1[_g];
			++_g;
			this.writeln((function($this) {
				var $r;
				var ba1 = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
				tannus_io__$ByteArray_ByteArray_$Impl_$.writeString(ba1,"" + tab + prop.name + ": " + prop.value + ";");
				$r = ba1;
				return $r;
			}(this)));
		}
		this.writeln((function($this) {
			var $r;
			var ba2 = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
			tannus_io__$ByteArray_ByteArray_$Impl_$.writeString(ba2,"}");
			$r = ba2;
			return $r;
		}(this)));
	}
	,reset: function() {
		this.buffer = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
	}
	,write: function(what) {
		this.buffer = this.buffer.concat(what);
	}
	,writeln: function(data) {
		this.write((function($this) {
			var $r;
			var other;
			{
				var ba = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
				tannus_io__$ByteArray_ByteArray_$Impl_$.writeString(ba,"\n");
				other = ba;
			}
			$r = (function($this) {
				var $r;
				var ia = data.concat(other);
				$r = tannus_io__$ByteArray_ByteArray_$Impl_$._new(ia.map(function(n) {
					var this1;
					if(!tannus_io__$Byte_Byte_$Impl_$.isValid(n)) throw new js__$Boot_HaxeError("Invalid Byte Value (" + n + ")!");
					this1 = n;
					return this1;
				}));
				return $r;
			}($this));
			return $r;
		}(this)));
	}
	,__class__: tannus_css_Writer
};
var tannus_css_vals_Lexer = function() {
	this.reset();
};
$hxClasses["tannus.css.vals.Lexer"] = tannus_css_vals_Lexer;
tannus_css_vals_Lexer.__name__ = ["tannus","css","vals","Lexer"];
tannus_css_vals_Lexer.eof = function() {
	throw new js__$Boot_HaxeError(tannus_css_vals__$Lexer_Err.Eof);
};
tannus_css_vals_Lexer.unex = function(c) {
	throw new js__$Boot_HaxeError(tannus_css_vals__$Lexer_Err.Unexpected(c));
};
tannus_css_vals_Lexer.isUnit = function(c) {
	return c >= 65 && c <= 90 || c >= 97 && c <= 122 || Lambda.has([37],c);
};
tannus_css_vals_Lexer.parseString = function(s) {
	return new tannus_css_vals_Lexer().parse((function($this) {
		var $r;
		var ba = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
		tannus_io__$ByteArray_ByteArray_$Impl_$.writeString(ba,s);
		$r = ba;
		return $r;
	}(this)));
};
tannus_css_vals_Lexer.prototype = {
	parse: function(snip) {
		this.reset();
		this.buffer = snip;
		var ba;
		{
			var ba1 = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
			tannus_io__$ByteArray_ByteArray_$Impl_$.writeString(ba1," ");
			ba = ba1;
		}
		this.buffer = this.buffer.concat(ba);
		try {
			while(true) try {
				var v = this.parseNext();
				this.tree.push(v);
			} catch( err ) {
				if (err instanceof js__$Boot_HaxeError) err = err.val;
				if( js_Boot.__instanceof(err,tannus_css_vals__$Lexer_Err) ) {
					switch(err[1]) {
					case 1:
						throw "__break__";
						break;
					case 0:
						var c = err[2];
						var e = "CSSValueError: Unexpected " + String.fromCharCode(c) + "!";
						console.log(e);
						throw new js__$Boot_HaxeError(e);
						break;
					}
				} else throw(err);
			}
		} catch( e ) { if( e != "__break__" ) throw e; }
		return this.tree;
	}
	,parseNext: function() {
		if(this.cursor == this.buffer.length - 1) throw new js__$Boot_HaxeError(tannus_css_vals__$Lexer_Err.Eof); else if(Lambda.has([9,10,11,12,13,32],this.buffer[this.cursor])) {
			this.advance();
			return this.parseNext();
		} else if((function($this) {
			var $r;
			var this1 = $this.buffer[$this.cursor];
			$r = this1 >= 65 && this1 <= 90 || this1 >= 97 && this1 <= 122;
			return $r;
		}(this)) || tannus_io__$Byte_Byte_$Impl_$.equalsi(this.buffer[this.cursor],95) || tannus_io__$Byte_Byte_$Impl_$.equalsi(this.buffer[this.cursor],64)) {
			var ident;
			{
				var ba = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
				tannus_io__$ByteArray_ByteArray_$Impl_$.writeString(ba,"");
				ident = ba;
			}
			ident.push(this.buffer[this.cursor]);
			this.advance();
			while(!(this.cursor == this.buffer.length - 1) && ((function($this) {
				var $r;
				var this2 = $this.buffer[$this.cursor];
				$r = this2 >= 65 && this2 <= 90 || this2 >= 97 && this2 <= 122;
				return $r;
			}(this)) || (function($this) {
				var $r;
				var this3 = $this.buffer[$this.cursor];
				$r = this3 >= 48 && this3 <= 57;
				return $r;
			}(this)) || tannus_io__$Byte_Byte_$Impl_$.equalsi(this.buffer[this.cursor],95))) {
				ident.push(this.buffer[this.cursor]);
				this.advance();
			}
			if(tannus_io__$Byte_Byte_$Impl_$.equalsi(ident[0],64)) {
				ident.shift();
				return tannus_css_Value.VRef(ident.map(function(b) {
					return String.fromCharCode(b);
				}).join(""));
			} else try {
				var c = this.cursor;
				var next = this.parseNext();
				switch(next[1]) {
				case 6:
					var args = next[2];
					return tannus_css_Value.VCall(ident.map(function(b1) {
						return String.fromCharCode(b1);
					}).join(""),args);
				default:
					this.cursor = c;
					return tannus_css_Value.VIdent(ident.map(function(b2) {
						return String.fromCharCode(b2);
					}).join(""));
				}
			} catch( err ) {
				if (err instanceof js__$Boot_HaxeError) err = err.val;
				if( js_Boot.__instanceof(err,tannus_css_vals__$Lexer_Err) ) {
					switch(err[1]) {
					case 1:
						return tannus_css_Value.VIdent(ident.map(function(b3) {
							return String.fromCharCode(b3);
						}).join(""));
					default:
						throw new js__$Boot_HaxeError(err);
					}
				} else throw(err);
			}
		} else if((function($this) {
			var $r;
			var this4 = $this.buffer[$this.cursor];
			$r = this4 >= 48 && this4 <= 57;
			return $r;
		}(this))) {
			var snum = String.fromCharCode(this.buffer[this.cursor]);
			this.advance();
			while(!(this.cursor == this.buffer.length - 1) && ((function($this) {
				var $r;
				var this5 = $this.buffer[$this.cursor];
				$r = this5 >= 48 && this5 <= 57;
				return $r;
			}(this)) || tannus_io__$Byte_Byte_$Impl_$.equalsi(this.buffer[this.cursor],46))) {
				snum += String.fromCharCode(this.buffer[this.cursor]);
				this.advance();
			}
			var num = parseFloat(snum);
			var unit = null;
			if(tannus_css_vals_Lexer.isUnit(this.buffer[this.cursor])) {
				var su = String.fromCharCode(this.buffer[this.cursor]);
				this.advance();
				while(!(this.cursor == this.buffer.length - 1) && tannus_css_vals_Lexer.isUnit(this.buffer[this.cursor])) {
					su += String.fromCharCode(this.buffer[this.cursor]);
					this.advance();
				}
				if(Lambda.has(["em","ex","ch","rem","vw","vh","%","cm","mm","in","px","pt","pc"],su)) unit = su; else {
					var e = "CSSUnitError: " + su + " is not a valid unit!";
					console.log(e);
					throw new js__$Boot_HaxeError(e);
				}
			}
			return tannus_css_Value.VNumber(num,unit);
		} else if(tannus_io__$Byte_Byte_$Impl_$.equalsi(this.buffer[this.cursor],35)) {
			var scol = "#";
			this.advance();
			while(!(this.cursor == this.buffer.length - 1) && new EReg("[0-9A-F]","i").match(String.fromCharCode(this.buffer[this.cursor]))) {
				scol += String.fromCharCode(this.buffer[this.cursor]);
				this.advance();
			}
			var color = tannus_graphics__$Color_TColor.fromString(scol);
			return tannus_css_Value.VColor(color);
		} else if(tannus_io__$Byte_Byte_$Impl_$.equalsi(this.buffer[this.cursor],34) || tannus_io__$Byte_Byte_$Impl_$.equalsi(this.buffer[this.cursor],39)) {
			var del = this.buffer[this.cursor];
			var str = "";
			this.advance();
			while(!(this.cursor == this.buffer.length - 1)) if(tannus_io__$Byte_Byte_$Impl_$.equalsi(this.buffer[this.cursor],92) && tannus_io__$Byte_Byte_$Impl_$.equalsi(this.buffer[this.cursor + 1],del)) {
				this.advance();
				var this6 = this.advance();
				str += String.fromCharCode(this6);
			} else if(tannus_io__$Byte_Byte_$Impl_$.equalsi(this.buffer[this.cursor],del)) {
				this.advance();
				break;
			} else {
				str += String.fromCharCode(this.buffer[this.cursor]);
				this.advance();
			}
			return tannus_css_Value.VString(str);
		} else if(tannus_io__$Byte_Byte_$Impl_$.equalsi(this.buffer[this.cursor],40)) {
			var stup;
			{
				var ba1 = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
				tannus_io__$ByteArray_ByteArray_$Impl_$.writeString(ba1,"");
				stup = ba1;
			}
			var l = 1;
			this.advance();
			while(!(this.cursor == this.buffer.length - 1) && l > 0) {
				var _g = this.buffer[this.cursor];
				switch(_g) {
				case 40:
					l++;
					break;
				case 41:
					l--;
					break;
				default:
					null;
				}
				if(l > 0) stup.push(this.buffer[this.cursor]);
				this.advance();
			}
			var ba2;
			{
				var ba3 = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
				tannus_io__$ByteArray_ByteArray_$Impl_$.writeString(ba3," ");
				ba2 = ba3;
			}
			stup = stup.concat(ba2);
			var tup = [];
			if(!(stup.length == 0)) {
				var old = this.saveState();
				this.buffer = stup;
				this.cursor = 0;
				this.tree = [];
				while(!(this.cursor == this.buffer.length - 1)) {
					var v = this.parseNext();
					tup.push(v);
					if(tannus_io__$Byte_Byte_$Impl_$.equalsi(this.buffer[this.cursor],44)) this.advance(); else if(!(this.cursor == this.buffer.length - 1)) {
						var e1 = "CSSValueError: Missing \",\"!";
						throw new js__$Boot_HaxeError(e1);
					}
				}
				this.loadState(old);
			}
			return tannus_css_Value.VTuple(tup);
		} else throw new js__$Boot_HaxeError(tannus_css_vals__$Lexer_Err.Unexpected(this.buffer[this.cursor]));
	}
	,reset: function() {
		{
			var ba = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
			tannus_io__$ByteArray_ByteArray_$Impl_$.writeString(ba,"");
			this.buffer = ba;
		}
		this.cursor = 0;
		this.tree = [];
	}
	,saveState: function() {
		return { 'buffer' : (function($this) {
			var $r;
			var ia = $this.buffer.slice();
			$r = tannus_io__$ByteArray_ByteArray_$Impl_$._new(ia.map(function(n) {
				var this1;
				if(!tannus_io__$Byte_Byte_$Impl_$.isValid(n)) throw new js__$Boot_HaxeError("Invalid Byte Value (" + n + ")!");
				this1 = n;
				return this1;
			}));
			return $r;
		}(this)), 'tree' : this.tree.slice(), 'cursor' : this.cursor};
	}
	,loadState: function(state) {
		{
			var ia = state.buffer.slice();
			this.buffer = tannus_io__$ByteArray_ByteArray_$Impl_$._new(ia.map(function(n) {
				var this1;
				if(!tannus_io__$Byte_Byte_$Impl_$.isValid(n)) throw new js__$Boot_HaxeError("Invalid Byte Value (" + n + ")!");
				this1 = n;
				return this1;
			}));
		}
		this.tree = state.tree.slice();
		this.cursor = state.cursor;
	}
	,atend: function(d) {
		if(d == null) d = 0;
		return this.cursor + d == this.buffer.length - 1;
	}
	,advance: function(d) {
		if(d == null) d = 1;
		this.cursor += d;
		return this.buffer[this.cursor];
	}
	,next: function(d) {
		if(d == null) d = 1;
		return this.buffer[this.cursor + d];
	}
	,push: function(v) {
		this.tree.push(v);
	}
	,get_end: function() {
		return this.cursor == this.buffer.length - 1;
	}
	,get_cur: function() {
		return this.buffer[this.cursor];
	}
	,__class__: tannus_css_vals_Lexer
	,__properties__: {get_cur:"get_cur",get_end:"get_end"}
};
var tannus_css_vals__$Lexer_Err = $hxClasses["tannus.css.vals._Lexer.Err"] = { __ename__ : ["tannus","css","vals","_Lexer","Err"], __constructs__ : ["Unexpected","Eof"] };
tannus_css_vals__$Lexer_Err.Unexpected = function(c) { var $x = ["Unexpected",0,c]; $x.__enum__ = tannus_css_vals__$Lexer_Err; $x.toString = $estr; return $x; };
tannus_css_vals__$Lexer_Err.Eof = ["Eof",1];
tannus_css_vals__$Lexer_Err.Eof.toString = $estr;
tannus_css_vals__$Lexer_Err.Eof.__enum__ = tannus_css_vals__$Lexer_Err;
var tannus_css_vals__$Unit_Unit_$Impl_$ = {};
$hxClasses["tannus.css.vals._Unit.Unit_Impl_"] = tannus_css_vals__$Unit_Unit_$Impl_$;
tannus_css_vals__$Unit_Unit_$Impl_$.__name__ = ["tannus","css","vals","_Unit","Unit_Impl_"];
tannus_css_vals__$Unit_Unit_$Impl_$.__properties__ = {get_all:"get_all"}
tannus_css_vals__$Unit_Unit_$Impl_$.get_all = function() {
	return ["em","ex","ch","rem","vw","vh","%","cm","mm","in","px","pt","pc"];
};
tannus_css_vals__$Unit_Unit_$Impl_$.isValidUnit = function(s) {
	return Lambda.has(["em","ex","ch","rem","vw","vh","%","cm","mm","in","px","pt","pc"],s);
};
var tannus_ds__$ActionStack_ActionStack_$Impl_$ = {};
$hxClasses["tannus.ds._ActionStack.ActionStack_Impl_"] = tannus_ds__$ActionStack_ActionStack_$Impl_$;
tannus_ds__$ActionStack_ActionStack_$Impl_$.__name__ = ["tannus","ds","_ActionStack","ActionStack_Impl_"];
tannus_ds__$ActionStack_ActionStack_$Impl_$._new = function() {
	return [];
};
tannus_ds__$ActionStack_ActionStack_$Impl_$.call = function(this1) {
	var _g = 0;
	while(_g < this1.length) {
		var action = this1[_g];
		++_g;
		action();
	}
};
tannus_ds__$ActionStack_ActionStack_$Impl_$.clone = function(this1) {
	return this1.slice();
};
var tannus_ds__$ActionStack_ParametricStack_$Impl_$ = {};
$hxClasses["tannus.ds._ActionStack.ParametricStack_Impl_"] = tannus_ds__$ActionStack_ParametricStack_$Impl_$;
tannus_ds__$ActionStack_ParametricStack_$Impl_$.__name__ = ["tannus","ds","_ActionStack","ParametricStack_Impl_"];
tannus_ds__$ActionStack_ParametricStack_$Impl_$._new = function() {
	return [];
};
tannus_ds__$ActionStack_ParametricStack_$Impl_$.call = function(this1,context) {
	var _g = 0;
	while(_g < this1.length) {
		var a = this1[_g];
		++_g;
		a(context);
	}
};
var tannus_ds_ArrayTools = function() { };
$hxClasses["tannus.ds.ArrayTools"] = tannus_ds_ArrayTools;
tannus_ds_ArrayTools.__name__ = ["tannus","ds","ArrayTools"];
tannus_ds_ArrayTools.pointerArray = function(a) {
	var res = [];
	var _g1 = 0;
	var _g = a.length;
	while(_g1 < _g) {
		var i = [_g1++];
		res.push(new tannus_io__$Pointer_Ref((function(i) {
			return function() {
				return a[i[0]];
			};
		})(i),(function(i) {
			return function(v) {
				return a[i[0]] = v;
			};
		})(i)));
	}
	return res;
};
tannus_ds_ArrayTools.without = function(list,blacklist) {
	var c = list.slice();
	var _g = 0;
	while(_g < blacklist.length) {
		var v = blacklist[_g];
		++_g;
		while(true) if(!HxOverrides.remove(c,v)) break;
	}
	return c;
};
tannus_ds_ArrayTools.hasf = function(set,item,tester) {
	var $it0 = $iterator(set)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(tester(x,item)) return true;
	}
	return false;
};
tannus_ds_ArrayTools.unique = function(set,tester) {
	if(tester == null) tester = function(x,y) {
		return x == y;
	};
	var results = [];
	var _g = 0;
	while(_g < set.length) {
		var item = set[_g];
		++_g;
		if(!tannus_ds_ArrayTools.hasf(results,item,tester)) results.push(item);
	}
	return results;
};
tannus_ds_ArrayTools.union = function(one,other) {
	return one.filter(function(item) {
		return Lambda.has(other,item);
	});
};
tannus_ds_ArrayTools.flatten = function(set) {
	var res = [];
	var _g = 0;
	while(_g < set.length) {
		var sub = set[_g];
		++_g;
		res = res.concat(sub);
	}
	return res;
};
tannus_ds_ArrayTools.last = function(list,v) {
	if(v == null) return list[list.length - 1]; else return list[list.length - 1] = v;
};
tannus_ds_ArrayTools.before = function(list,val) {
	return list.slice(0,HxOverrides.indexOf(list,val,0) != -1?HxOverrides.indexOf(list,val,0):list.length);
};
tannus_ds_ArrayTools.after = function(list,val) {
	return list.slice(HxOverrides.indexOf(list,val,0) != -1?HxOverrides.indexOf(list,val,0) + 1:0);
};
tannus_ds_ArrayTools.times = function(list,n) {
	var res = list.slice();
	var _g1 = 0;
	var _g = n - 1;
	while(_g1 < _g) {
		var i = _g1++;
		res = res.concat(list.slice());
	}
	return res;
};
tannus_ds_ArrayTools.min = function(list,predicate) {
	var m = null;
	var $it0 = $iterator(list)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		var score = predicate(x);
		if(m == null || score < m[1]) m = [x,score];
	}
	if(m == null) throw new js__$Boot_HaxeError("Error: Iterable must not be empty!");
	return m[0];
};
tannus_ds_ArrayTools.max = function(list,predicate) {
	var m = null;
	var $it0 = $iterator(list)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		var score = predicate(x);
		if(m == null || score > m[1]) m = [x,score];
	}
	if(m == null) throw new js__$Boot_HaxeError("Error: Iterable must not be empty!");
	return m[0];
};
tannus_ds_ArrayTools.minmax = function(list,predicate) {
	var l = null;
	var h = null;
	var $it0 = $iterator(list)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		var score = predicate(x);
		if(l == null || score < l[1]) l = [x,score]; else if(h == null || score > h[1]) h = [x,score];
	}
	if(l == null || h == null) throw new js__$Boot_HaxeError("Error: Iterable must not be empty!");
	return { 'min' : l[0], 'max' : h[0]};
};
var tannus_ds__$Async_Async_$Impl_$ = {};
$hxClasses["tannus.ds._Async.Async_Impl_"] = tannus_ds__$Async_Async_$Impl_$;
tannus_ds__$Async_Async_$Impl_$.__name__ = ["tannus","ds","_Async","Async_Impl_"];
tannus_ds__$Async_Async_$Impl_$._new = function(f) {
	return f;
};
tannus_ds__$Async_Async_$Impl_$.fromTask = function(t) {
	var f = t.toAsync();
	return f;
};
tannus_ds__$Async_Async_$Impl_$.toTask = function(this1) {
	return new tannus_ds__$Async_AsyncTask(this1);
};
var tannus_ds_Task = function() {
	this._doing = false;
	this.onkill = new tannus_io_VoidSignal();
	this.onfinish = new tannus_io_VoidSignal();
};
$hxClasses["tannus.ds.Task"] = tannus_ds_Task;
tannus_ds_Task.__name__ = ["tannus","ds","Task"];
tannus_ds_Task.prototype = {
	start: function() {
		if(!this._doing) this._doing = true; else throw new js__$Boot_HaxeError("Error: Task already running");
	}
	,perform: function(done) {
		this.start();
		this.onfinish.once(done);
		this.action($bind(this,this.finish));
	}
	,action: function(done) {
		done();
	}
	,finish: function() {
		this._doing = false;
		this.onfinish.call();
	}
	,abort: function() {
		if(this._doing) this.onkill.call(); else throw new js__$Boot_HaxeError("Error: Cannot abort a Task that is not running!");
	}
	,toAsync: function() {
		return (function(f) {
			return function(a1) {
				f(a1);
			};
		})($bind(this,this.perform));
	}
	,get_doing: function() {
		return this._doing;
	}
	,__class__: tannus_ds_Task
	,__properties__: {get_doing:"get_doing"}
};
var tannus_ds__$Async_AsyncTask = function(a) {
	tannus_ds_Task.call(this);
	this.f = a;
};
$hxClasses["tannus.ds._Async.AsyncTask"] = tannus_ds__$Async_AsyncTask;
tannus_ds__$Async_AsyncTask.__name__ = ["tannus","ds","_Async","AsyncTask"];
tannus_ds__$Async_AsyncTask.__super__ = tannus_ds_Task;
tannus_ds__$Async_AsyncTask.prototype = $extend(tannus_ds_Task.prototype,{
	action: function(done) {
		this.f(done);
	}
	,__class__: tannus_ds__$Async_AsyncTask
});
var tannus_ds_Stack = function(dat) {
	if(dat != null) this.data = dat; else this.data = [];
};
$hxClasses["tannus.ds.Stack"] = tannus_ds_Stack;
tannus_ds_Stack.__name__ = ["tannus","ds","Stack"];
tannus_ds_Stack.prototype = {
	peek: function(d) {
		if(d == null) d = 0;
		return this.data[d];
	}
	,pop: function() {
		return this.data.shift();
	}
	,add: function(item) {
		this.data.unshift(item);
	}
	,under: function(item) {
		this.data.push(item);
	}
	,bottom: function() {
		return this.data.pop();
	}
	,next: function(item) {
		if(item != null) this.add(item); else item = this.pop();
		return item;
	}
	,last: function(item) {
		if(item != null) this.under(item); else item = this.bottom();
		return item;
	}
	,copy: function() {
		return new tannus_ds_Stack(this.data.slice());
	}
	,iterator: function() {
		return new tannus_ds__$Stack_StackIterator(this);
	}
	,get_empty: function() {
		return this.data.length == 0;
	}
	,__class__: tannus_ds_Stack
	,__properties__: {get_empty:"get_empty"}
};
var tannus_ds_AsyncStack = function() {
	tannus_ds_Stack.call(this);
	this.completion = new tannus_io_VoidSignal();
};
$hxClasses["tannus.ds.AsyncStack"] = tannus_ds_AsyncStack;
tannus_ds_AsyncStack.__name__ = ["tannus","ds","AsyncStack"];
tannus_ds_AsyncStack.__super__ = tannus_ds_Stack;
tannus_ds_AsyncStack.prototype = $extend(tannus_ds_Stack.prototype,{
	callNext: function() {
		if(!this.get_empty()) {
			var action = this.pop();
			action($bind(this,this.callNext));
		} else this.completion.call();
	}
	,run: function(done) {
		if(this.get_empty()) done(); else {
			this.completion.once(done);
			this.callNext();
		}
	}
	,push: function(f) {
		this.under(f);
	}
	,__class__: tannus_ds_AsyncStack
});
var tannus_ds_OldAsyncStack = function() {
	this.funcs = [];
	this.complete = new tannus_io_Signal();
};
$hxClasses["tannus.ds.OldAsyncStack"] = tannus_ds_OldAsyncStack;
tannus_ds_OldAsyncStack.__name__ = ["tannus","ds","OldAsyncStack"];
tannus_ds_OldAsyncStack.prototype = {
	call: function(i,cb) {
		var f = this.funcs[i];
		if(f != null) this.funcs[i](cb); else this.complete.broadcast(null);
	}
	,run: function(done) {
		var _g = this;
		var i = 0;
		if(done != null) this.complete.listen(function(x) {
			done();
		},false);
		var next;
		var next1 = null;
		next1 = function() {
			i++;
			_g.call(i,next1);
		};
		next = next1;
		this.call(i,next);
	}
	,__class__: tannus_ds_OldAsyncStack
};
var tannus_ds__$Delta_Delta_$Impl_$ = {};
$hxClasses["tannus.ds._Delta.Delta_Impl_"] = tannus_ds__$Delta_Delta_$Impl_$;
tannus_ds__$Delta_Delta_$Impl_$.__name__ = ["tannus","ds","_Delta","Delta_Impl_"];
tannus_ds__$Delta_Delta_$Impl_$.__properties__ = {get_previous:"get_previous",get_current:"get_current"}
tannus_ds__$Delta_Delta_$Impl_$._new = function(cur,prev) {
	return [cur,prev];
};
tannus_ds__$Delta_Delta_$Impl_$.toString = function(this1) {
	var res = "Delta(";
	if(this1[1] != null) res += "from " + Std.string(this1[1]) + " ";
	res += "to " + Std.string(this1[0]) + ")";
	return res;
};
tannus_ds__$Delta_Delta_$Impl_$.get_current = function(this1) {
	return this1[0];
};
tannus_ds__$Delta_Delta_$Impl_$.get_previous = function(this1) {
	return this1[1];
};
var tannus_ds_Destructible = function() { };
$hxClasses["tannus.ds.Destructible"] = tannus_ds_Destructible;
tannus_ds_Destructible.__name__ = ["tannus","ds","Destructible"];
tannus_ds_Destructible.prototype = {
	__class__: tannus_ds_Destructible
};
var tannus_ds__$Dict_Dict_$Impl_$ = {};
$hxClasses["tannus.ds._Dict.Dict_Impl_"] = tannus_ds__$Dict_Dict_$Impl_$;
tannus_ds__$Dict_Dict_$Impl_$.__name__ = ["tannus","ds","_Dict","Dict_Impl_"];
tannus_ds__$Dict_Dict_$Impl_$._new = function(cd) {
	return cd != null?cd:new tannus_ds_CDict();
};
tannus_ds__$Dict_Dict_$Impl_$.iterator = function(this1) {
	return new _$List_ListIterator(this1.pairs.h);
};
tannus_ds__$Dict_Dict_$Impl_$.get = function(this1,k) {
	return this1.get(k);
};
tannus_ds__$Dict_Dict_$Impl_$.set = function(this1,k,v) {
	return this1.setByKey(k,v);
};
tannus_ds__$Dict_Dict_$Impl_$.setKey = function(this1,v,k) {
	return this1.setByValue(k,v);
};
tannus_ds__$Dict_Dict_$Impl_$.remove = function(this1,id) {
	{
		var _g = id;
		switch(_g[1]) {
		case 0:
			var key = _g[2];
			this1.removeByKey(key);
			break;
		case 1:
			var val = _g[2];
			this1.removeByValue(val);
			break;
		}
	}
};
tannus_ds__$Dict_Dict_$Impl_$.exists = function(this1,key) {
	return this1.get(key) != null;
};
tannus_ds__$Dict_Dict_$Impl_$.write_a = function(this1,other) {
	this1.write(other);
};
tannus_ds__$Dict_Dict_$Impl_$.toObject = function(this1) {
	var o = { };
	var $it0 = new _$List_ListIterator(this1.pairs.h);
	while( $it0.hasNext() ) {
		var p = $it0.next();
		var key = Std.string(p[0]) + "";
		Reflect.setProperty(o,key,p[1]);
		Reflect.getProperty(o,key);
	}
	return o;
};
var tannus_ds_CDict = function() {
	this.pairs = new List();
};
$hxClasses["tannus.ds.CDict"] = tannus_ds_CDict;
tannus_ds_CDict.__name__ = ["tannus","ds","CDict"];
tannus_ds_CDict.prototype = {
	get: function(key) {
		var pair;
		{
			var this1 = this.getPairByKey(key);
			if(this1 != null) pair = this1; else pair = this1;
		}
		if(pair != null) return pair[1]; else return null;
	}
	,set: function(k,v) {
		return this.setByKey(k,v);
	}
	,getPairByKey: function(key) {
		var _g_head = this.pairs.h;
		var _g_val = null;
		while(_g_head != null) {
			var p;
			p = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			if(p[0] == key) return p;
		}
		return null;
	}
	,getPairByValue: function(value) {
		var _g_head = this.pairs.h;
		var _g_val = null;
		while(_g_head != null) {
			var p;
			p = (function($this) {
				var $r;
				_g_val = _g_head[0];
				_g_head = _g_head[1];
				$r = _g_val;
				return $r;
			}(this));
			if(p[1] == value) return p;
		}
		return null;
	}
	,setByKey: function(k,v) {
		var p = this.getPairByKey(k);
		if(p != null) (p != null?p:p)[1] = v; else this.pairs.add([k,v]);
		return v;
	}
	,setByValue: function(k,v) {
		var p = this.getPairByValue(v);
		if(p != null) (p != null?p:p)[0] = k; else this.pairs.add([k,v]);
		return k;
	}
	,removeByKey: function(key) {
		this.pairs.remove((function($this) {
			var $r;
			var this1 = $this.getPairByKey(key);
			$r = this1 != null?this1:this1;
			return $r;
		}(this)));
	}
	,removeByValue: function(val) {
		this.pairs.remove((function($this) {
			var $r;
			var this1 = $this.getPairByValue(val);
			$r = this1 != null?this1:this1;
			return $r;
		}(this)));
	}
	,write: function(other) {
		var $it0 = (function($this) {
			var $r;
			var o = { };
			var $it1 = new _$List_ListIterator(other.pairs.h);
			while( $it1.hasNext() ) {
				var p = $it1.next();
				var key = Std.string(p[0]) + "";
				Reflect.setProperty(o,key,p[1]);
				Reflect.getProperty(o,key);
			}
			$r = o;
			return $r;
		}(this));
		while( $it0.hasNext() ) {
			var pair = $it0.next();
			this.setByKey(pair.key,pair.value);
		}
	}
	,__class__: tannus_ds_CDict
};
var tannus_ds__$Dict_Pair_$Impl_$ = {};
$hxClasses["tannus.ds._Dict.Pair_Impl_"] = tannus_ds__$Dict_Pair_$Impl_$;
tannus_ds__$Dict_Pair_$Impl_$.__name__ = ["tannus","ds","_Dict","Pair_Impl_"];
tannus_ds__$Dict_Pair_$Impl_$.__properties__ = {set_value:"set_value",get_value:"get_value",set_key:"set_key",get_key:"get_key"}
tannus_ds__$Dict_Pair_$Impl_$._new = function(p) {
	return p;
};
tannus_ds__$Dict_Pair_$Impl_$.get_key = function(this1) {
	return this1[0];
};
tannus_ds__$Dict_Pair_$Impl_$.set_key = function(this1,nk) {
	return this1[0] = nk;
};
tannus_ds__$Dict_Pair_$Impl_$.get_value = function(this1) {
	return this1[1];
};
tannus_ds__$Dict_Pair_$Impl_$.set_value = function(this1,nv) {
	return this1[1] = nv;
};
tannus_ds__$Dict_Pair_$Impl_$.toArray = function(this1) {
	var a = [this1[0],this1[1]];
	return a;
};
var tannus_ds__$EitherType_EitherType_$Impl_$ = {};
$hxClasses["tannus.ds._EitherType.EitherType_Impl_"] = tannus_ds__$EitherType_EitherType_$Impl_$;
tannus_ds__$EitherType_EitherType_$Impl_$.__name__ = ["tannus","ds","_EitherType","EitherType_Impl_"];
tannus_ds__$EitherType_EitherType_$Impl_$.__properties__ = {get_type:"get_type"}
tannus_ds__$EitherType_EitherType_$Impl_$._new = function(e) {
	return e;
};
tannus_ds__$EitherType_EitherType_$Impl_$.get_type = function(this1) {
	return this1;
};
tannus_ds__$EitherType_EitherType_$Impl_$.toLeft = function(this1) {
	{
		var _g = this1;
		switch(_g[1]) {
		case 0:
			var lv = _g[2];
			return lv;
		case 1:
			var rv = _g[2];
			throw new js__$Boot_HaxeError("EitherTypeError: " + Std.string(rv) + " was not the expected value!");
			break;
		}
	}
};
tannus_ds__$EitherType_EitherType_$Impl_$.toRight = function(this1) {
	{
		var _g = this1;
		switch(_g[1]) {
		case 1:
			var rv = _g[2];
			return rv;
		case 0:
			var lv = _g[2];
			throw new js__$Boot_HaxeError("EitherTypeError: " + Std.string(lv) + " was not the expected value!");
			break;
		}
	}
};
tannus_ds__$EitherType_EitherType_$Impl_$.fromL = function(v) {
	var e = tannus_ds_Either.Left(v);
	return e;
};
tannus_ds__$EitherType_EitherType_$Impl_$.fromR = function(v) {
	var e = tannus_ds_Either.Right(v);
	return e;
};
var tannus_ds_Either = $hxClasses["tannus.ds.Either"] = { __ename__ : ["tannus","ds","Either"], __constructs__ : ["Left","Right"] };
tannus_ds_Either.Left = function(value) { var $x = ["Left",0,value]; $x.__enum__ = tannus_ds_Either; $x.toString = $estr; return $x; };
tannus_ds_Either.Right = function(value) { var $x = ["Right",1,value]; $x.__enum__ = tannus_ds_Either; $x.toString = $estr; return $x; };
var tannus_ds_Range = function(mi,ma) {
	this.min = mi;
	this.max = ma;
};
$hxClasses["tannus.ds.Range"] = tannus_ds_Range;
tannus_ds_Range.__name__ = ["tannus","ds","Range"];
tannus_ds_Range.prototype = {
	contains: function(v) {
		return v > this.min && v < this.max;
	}
	,clamp: function(v) {
		if(v < this.min) return this.min; else if(v > this.max) return this.max; else return v;
	}
	,toString: function() {
		return "Range(" + Std.string(this.min) + " => " + Std.string(this.max) + ")";
	}
	,get_size: function() {
		return this.max - this.min;
	}
	,__class__: tannus_ds_Range
	,__properties__: {get_size:"get_size"}
};
var tannus_ds_FloatRange = function(mi,ma) {
	tannus_ds_Range.call(this,mi,ma);
};
$hxClasses["tannus.ds.FloatRange"] = tannus_ds_FloatRange;
tannus_ds_FloatRange.__name__ = ["tannus","ds","FloatRange"];
tannus_ds_FloatRange.__super__ = tannus_ds_Range;
tannus_ds_FloatRange.prototype = $extend(tannus_ds_Range.prototype,{
	__class__: tannus_ds_FloatRange
});
var tannus_ds_IntRange = function(mi,ma) {
	tannus_ds_Range.call(this,mi,ma);
};
$hxClasses["tannus.ds.IntRange"] = tannus_ds_IntRange;
tannus_ds_IntRange.__name__ = ["tannus","ds","IntRange"];
tannus_ds_IntRange.__super__ = tannus_ds_Range;
tannus_ds_IntRange.prototype = $extend(tannus_ds_Range.prototype,{
	iterator: function() {
		return new IntIterator(this.min,this.max);
	}
	,__class__: tannus_ds_IntRange
});
var tannus_ds__$Maybe_Maybe_$Impl_$ = {};
$hxClasses["tannus.ds._Maybe.Maybe_Impl_"] = tannus_ds__$Maybe_Maybe_$Impl_$;
tannus_ds__$Maybe_Maybe_$Impl_$.__name__ = ["tannus","ds","_Maybe","Maybe_Impl_"];
tannus_ds__$Maybe_Maybe_$Impl_$.__properties__ = {get_value:"get_value",get_exists:"get_exists"}
tannus_ds__$Maybe_Maybe_$Impl_$._new = function(x) {
	return x;
};
tannus_ds__$Maybe_Maybe_$Impl_$.or = function(this1,alt) {
	if(this1 != null) return this1; else return alt;
};
tannus_ds__$Maybe_Maybe_$Impl_$.orGetter = function(this1,gettr) {
	if(this1 != null) return this1; else return gettr();
};
tannus_ds__$Maybe_Maybe_$Impl_$.runIf = function(this1,f) {
	if(this1 != null) return f(this1 != null?this1:this1); else return null;
};
tannus_ds__$Maybe_Maybe_$Impl_$.get_exists = function(this1) {
	return this1 != null;
};
tannus_ds__$Maybe_Maybe_$Impl_$.get_value = function(this1) {
	return this1 != null?this1:this1;
};
tannus_ds__$Maybe_Maybe_$Impl_$.orDie = function(this1,error) {
	if(!(this1 != null)) throw new js__$Boot_HaxeError(error);
	return this1 != null?this1:this1;
};
tannus_ds__$Maybe_Maybe_$Impl_$.toNonNullable = function(this1) {
	if(this1 != null) return this1; else return this1;
};
tannus_ds__$Maybe_Maybe_$Impl_$.toBoolean = function(this1) {
	return this1 != null;
};
var tannus_ds_Memory = function() { };
$hxClasses["tannus.ds.Memory"] = tannus_ds_Memory;
tannus_ds_Memory.__name__ = ["tannus","ds","Memory"];
tannus_ds_Memory.uniqueIdInt = function() {
	var id = tannus_ds_Memory.state;
	tannus_ds_Memory.state++;
	return id;
};
tannus_ds_Memory.uniqueIdString = function(prefix) {
	if(prefix == null) prefix = "";
	return prefix + tannus_ds_Memory.uniqueIdInt();
};
tannus_ds_Memory.allocRandomId = function(digits) {
	var id = "";
	var r = new tannus_math_Random();
	var _g = 0;
	while(_g < digits) {
		var i = _g++;
		var range = [0,0];
		var letter = r.randbool();
		if(letter) {
			var upper = r.randbool();
			if(upper) range = [65,90]; else range = [97,122];
		} else range = [48,57];
		var c;
		var n = r.randint(range[0],range[1]);
		var this1;
		if(!tannus_io__$Byte_Byte_$Impl_$.isValid(n)) throw new js__$Boot_HaxeError("Invalid Byte Value (" + n + ")!");
		this1 = n;
		c = this1;
		id += String.fromCharCode(c);
	}
	if(Lambda.has(tannus_ds_Memory.used,id)) return tannus_ds_Memory.allocRandomId(digits); else {
		tannus_ds_Memory.used.push(id);
		return id;
	}
};
tannus_ds_Memory.freeRandomId = function(id) {
	return HxOverrides.remove(tannus_ds_Memory.used,id);
};
var tannus_ds__$Method_Method_$Impl_$ = {};
$hxClasses["tannus.ds._Method.Method_Impl_"] = tannus_ds__$Method_Method_$Impl_$;
tannus_ds__$Method_Method_$Impl_$.__name__ = ["tannus","ds","_Method","Method_Impl_"];
tannus_ds__$Method_Method_$Impl_$.__properties__ = {get_call:"get_call"}
tannus_ds__$Method_Method_$Impl_$._new = function(func,ctx) {
	var this1;
	this1 = (function(f,o,a1) {
		return function(a2) {
			return f(o,a1,a2);
		};
	})(Reflect.callMethod,ctx,func);
	return this1;
};
tannus_ds__$Method_Method_$Impl_$.get_call = function(this1) {
	return Reflect.makeVarArgs(this1);
};
tannus_ds__$Method_Method_$Impl_$.fromFunction = function(f) {
	var this1;
	this1 = (function(f1,o,a1) {
		return function(a2) {
			return f1(o,a1,a2);
		};
	})(Reflect.callMethod,null,f);
	return this1;
};
var tannus_ds__$Object_Object_$Impl_$ = {};
$hxClasses["tannus.ds._Object.Object_Impl_"] = tannus_ds__$Object_Object_$Impl_$;
tannus_ds__$Object_Object_$Impl_$.__name__ = ["tannus","ds","_Object","Object_Impl_"];
tannus_ds__$Object_Object_$Impl_$.__properties__ = {get_keys:"get_keys"}
tannus_ds__$Object_Object_$Impl_$._new = function(o) {
	return o;
};
tannus_ds__$Object_Object_$Impl_$.get_keys = function(this1) {
	return Reflect.fields(this1);
};
tannus_ds__$Object_Object_$Impl_$.get = function(this1,key) {
	return Reflect.getProperty(this1,key);
};
tannus_ds__$Object_Object_$Impl_$.set = function(this1,key,value) {
	Reflect.setProperty(this1,key,value);
	return Reflect.getProperty(this1,key);
};
tannus_ds__$Object_Object_$Impl_$.exists = function(this1,key) {
	return Object.prototype.hasOwnProperty.call(this1,key);
};
tannus_ds__$Object_Object_$Impl_$.remove = function(this1,key) {
	Reflect.deleteField(this1,key);
};
tannus_ds__$Object_Object_$Impl_$.clone = function(this1) {
	var c = { };
	var _g = 0;
	var _g1 = Reflect.fields(this1);
	while(_g < _g1.length) {
		var k = _g1[_g];
		++_g;
		var value = Reflect.getProperty(this1,k);
		Reflect.setProperty(c,k,value);
		Reflect.getProperty(c,k);
	}
	return c;
};
tannus_ds__$Object_Object_$Impl_$.pairs = function(this1) {
	return Reflect.fields(this1).map(function(k) {
		return { 'name' : k, 'value' : Reflect.getProperty(this1,k)};
	});
};
tannus_ds__$Object_Object_$Impl_$.iterator = function(this1) {
	var _this;
	var this2 = this1;
	_this = Reflect.fields(this2).map(function(k) {
		return { 'name' : k, 'value' : Reflect.getProperty(this2,k)};
	});
	return HxOverrides.iter(_this);
};
tannus_ds__$Object_Object_$Impl_$.plus = function(this1,other) {
	var res = tannus_ds__$Object_Object_$Impl_$.clone(this1);
	var _g = 0;
	var _g1 = Reflect.fields(other);
	while(_g < _g1.length) {
		var k = _g1[_g];
		++_g;
		if(!Object.prototype.hasOwnProperty.call(res,k)) {
			var value = Reflect.getProperty(other,k);
			Reflect.setProperty(res,k,value);
			Reflect.getProperty(res,k);
		}
	}
	return res;
};
tannus_ds__$Object_Object_$Impl_$.write = function(this1,o) {
	var _g = 0;
	var _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var k = _g1[_g];
		++_g;
		var value = Reflect.getProperty(o,k);
		Reflect.setProperty(this1,k,value);
		Reflect.getProperty(this1,k);
	}
};
tannus_ds__$Object_Object_$Impl_$.method = function(this1,mname) {
	var func;
	{
		var this3 = Reflect.getProperty(this1,mname);
		if(this3 != null) func = this3; else func = this3;
	}
	var this2;
	this2 = (function(f,o,a1) {
		return function(a2) {
			return f(o,a1,a2);
		};
	})(Reflect.callMethod,this1,func);
	return this2;
};
tannus_ds__$Object_Object_$Impl_$.plucka = function(this1,keys) {
	return tannus_ds__$Object_Object_$Impl_$._plk(this1,keys);
};
tannus_ds__$Object_Object_$Impl_$._plk = function(this1,keys,mtarget) {
	var target;
	target = mtarget != null?mtarget:{ };
	var _g = 0;
	while(_g < keys.length) {
		var k = keys[_g];
		++_g;
		var value = Reflect.getProperty(this1,k);
		Reflect.setProperty(target,k,value);
		Reflect.getProperty(target,k);
	}
	return target;
};
tannus_ds__$Object_Object_$Impl_$["is"] = function(this1,oreg) {
	var sel;
	{
		var this2;
		var b = tannus_nore_ORegEx.compile(oreg);
		this2 = [oreg,b];
		sel = this2;
	}
	return sel[1](this1);
};
tannus_ds__$Object_Object_$Impl_$.toMap = function(this1) {
	var m = new haxe_ds_StringMap();
	var $it0 = (function($this) {
		var $r;
		var _this;
		{
			var this2 = this1;
			_this = Reflect.fields(this2).map(function(k) {
				return { 'name' : k, 'value' : Reflect.getProperty(this2,k)};
			});
		}
		$r = HxOverrides.iter(_this);
		return $r;
	}(this));
	while( $it0.hasNext() ) {
		var p = $it0.next();
		var value = p.value;
		m.set(p.name,value);
	}
	return m;
};
tannus_ds__$Object_Object_$Impl_$.fromMap = function(map) {
	var o = { };
	var $it0 = map.keys();
	while( $it0.hasNext() ) {
		var key = $it0.next();
		var value;
		value = __map_reserved[key] != null?map.getReserved(key):map.h[key];
		Reflect.setProperty(o,key,value);
		Reflect.getProperty(o,key);
	}
	return o;
};
tannus_ds__$Object_Object_$Impl_$.toTannusDict = function(this1) {
	var d = new tannus_ds_CDict();
	var $it0 = (function($this) {
		var $r;
		var _this;
		{
			var this2 = this1;
			_this = Reflect.fields(this2).map(function(k) {
				return { 'name' : k, 'value' : Reflect.getProperty(this2,k)};
			});
		}
		$r = HxOverrides.iter(_this);
		return $r;
	}(this));
	while( $it0.hasNext() ) {
		var p = $it0.next();
		var v = p.value;
		d.setByKey(p.name,v);
	}
	return d;
};
var tannus_ds__$Pair_Pair_$Impl_$ = {};
$hxClasses["tannus.ds._Pair.Pair_Impl_"] = tannus_ds__$Pair_Pair_$Impl_$;
tannus_ds__$Pair_Pair_$Impl_$.__name__ = ["tannus","ds","_Pair","Pair_Impl_"];
tannus_ds__$Pair_Pair_$Impl_$._new = function(l,r) {
	return new tannus_ds_CPair(l,r);
};
tannus_ds__$Pair_Pair_$Impl_$.toString = function(this1) {
	return this1.toString();
};
tannus_ds__$Pair_Pair_$Impl_$.swap = function(this1) {
	return new tannus_ds_CPair(this1.right,this1.left);
};
tannus_ds__$Pair_Pair_$Impl_$.eq = function(this1,other) {
	return this1.left == other.left && this1.right == other.right;
};
var tannus_ds_CPair = function(l,r) {
	this.left = l;
	this.right = r;
};
$hxClasses["tannus.ds.CPair"] = tannus_ds_CPair;
tannus_ds_CPair.__name__ = ["tannus","ds","CPair"];
tannus_ds_CPair.prototype = {
	equals: function(other) {
		return this.left == other.left && this.right == other.right;
	}
	,toString: function() {
		return "Pair(" + Std.string(this.left) + ", " + Std.string(this.right) + ")";
	}
	,swap: function() {
		return new tannus_ds_CPair(this.right,this.left);
	}
	,__class__: tannus_ds_CPair
};
var tannus_ds_Promise = function(exec,nocall) {
	if(nocall == null) nocall = false;
	this.back = null;
	this.in_progress = false;
	this.executor = exec;
	this.fulfillment = new tannus_io_Signal();
	this.rejection = new tannus_io_Signal();
	this.derived = [];
	if(!nocall) this.make();
};
$hxClasses["tannus.ds.Promise"] = tannus_ds_Promise;
tannus_ds_Promise.__name__ = ["tannus","ds","Promise"];
tannus_ds_Promise.prototype = {
	fulfill: function(v) {
		this.in_progress = false;
		this.fulfillment.broadcast(v);
	}
	,reject: function(err) {
		this.in_progress = false;
		this.rejection.call(err);
	}
	,derive: function(der) {
		this.derived.push(der);
	}
	,then: function(callback) {
		this.fulfillment.listen(callback,false);
		return this;
	}
	,unless: function(callback) {
		this.rejection.listen(callback,false);
		return this;
	}
	,always: function(cb) {
		var called = false;
		this.then(function(x) {
			if(!called) {
				cb();
				called = true;
			}
		});
		this.unless(function(e) {
			if(!called) {
				cb();
				called = true;
			}
		});
	}
	,transform: function(change) {
		var _g = this;
		var res1 = new tannus_ds_Promise(function(res,err) {
			_g.then(function(val) {
				res(change(val));
			});
			_g.unless(function(error) {
				err(error);
			});
		});
		this.attach(res1);
		return res1;
	}
	,parent: function() {
		if(this.back != null) return this.back; else throw new js__$Boot_HaxeError("PromiseError: Cannot read field 'back' from the given Promise, as it has not yet been assigned");
	}
	,attach: function(child) {
		this.derive(child);
		child.back = this;
		return this;
	}
	,make: function(cb) {
		var _g = this;
		if(cb == null) cb = function() {
			null;
		};
		if(!this.in_progress) {
			this.in_progress = true;
			var stack = new tannus_ds_AsyncStack();
			var _g1 = 0;
			var _g11 = this.derived;
			while(_g1 < _g11.length) {
				var child = [_g11[_g1]];
				++_g1;
				stack.under((function(child) {
					return function(nxt) {
						child[0].make(nxt);
					};
				})(child));
			}
			stack.run(function() {
				var ff = function(x) {
					_g.fulfill(x);
					cb();
				};
				var rj = function(e) {
					_g.reject(e);
					cb();
				};
				_g.executor(ff,rj);
			});
		} else {
			var remake = (function(max_calls) {
				var run = 0;
				var rm = function() {
					if(run < max_calls) {
						_g.make();
						run++;
					}
				};
				return rm;
			})(1);
			this.fulfillment.listen(function(x1) {
				remake();
			},true);
			this.rejection.listen(function(x2) {
				remake();
			},true);
		}
	}
	,print: function() {
		this.then(function(x) {
			console.log(x);
		});
		return this;
	}
	,typeError: function(msg) {
		return "TypeError: " + msg;
	}
	,bool: function() {
		var _g = this;
		var res = new tannus_ds_promises_BoolPromise(function(yep,nope) {
			_g.then(function(data) {
				if(typeof(data) == "boolean") yep(data); else nope("TypeError: " + ("Cannot cast " + Std.string(data) + " to Boolean!"));
			});
			_g.unless(nope);
		});
		this.attach(res);
		return res;
	}
	,string: function() {
		var _g = this;
		var res = new tannus_ds_promises_StringPromise(function(accept,reject) {
			_g.then(function(data) {
				if(typeof(data) == "string") accept(Std.string(data) + ""); else reject("TypeError: " + ("Cannot cast " + Std.string(data) + " to String"));
			});
		});
		this.attach(res);
		return res;
	}
	,array: function() {
		var _g = this;
		var res = new tannus_ds_promises_ArrayPromise(function(yep,nope) {
			_g.then(function(data) {
				if((data instanceof Array) && data.__enum__ == null) try {
					var list;
					var _g1 = [];
					var _g2 = 0;
					var _g3;
					_g3 = js_Boot.__cast(data , Array);
					while(_g2 < _g3.length) {
						var x = _g3[_g2];
						++_g2;
						_g1.push(x);
					}
					list = _g1;
					yep(list);
				} catch( err ) {
					if (err instanceof js__$Boot_HaxeError) err = err.val;
					if( js_Boot.__instanceof(err,String) ) {
						nope(err);
					} else throw(err);
				} else nope("TypeError: " + ("Cannot cast " + Std.string(data) + " to Array!"));
			});
			_g.unless(nope);
		});
		this.attach(res);
		return res;
	}
	,object: function() {
		var _g = this;
		var res = new tannus_ds_promises_ObjectPromise(function(reply,reject) {
			_g.then(function(data) {
				var stype = tannus_internal_TypeTools.typename(data);
				if(!(typeof(data) == "boolean") && !(typeof(data) == "number") && !((data instanceof Array) && data.__enum__ == null) && !(typeof(data) == "string")) {
					var _g1 = Type["typeof"](data);
					switch(_g1[1]) {
					case 4:case 6:
						reply(data);
						break;
					default:
						reject("TypeError: " + ("Cannot cast " + stype + " to Object"));
					}
				} else reject("TypeError: " + ("Cannot cast " + stype + " to Object"));
			});
		});
		this.attach(res);
		return res;
	}
	,eq: function(other) {
		var _g = this;
		return new tannus_ds_promises_BoolPromise(function(done,fail) {
			_g.then(function(data) {
				{
					var _g1 = other;
					switch(_g1[1]) {
					case 0:
						var val = _g1[2];
						done(val == data);
						break;
					case 1:
						var prom = _g1[2];
						prom.then(function(val1) {
							done(val1 == data);
						});
						prom.unless(fail);
						break;
					}
				}
			});
			_g.unless(fail);
		});
	}
	,__class__: tannus_ds_Promise
};
var tannus_ds_QueryString = function() { };
$hxClasses["tannus.ds.QueryString"] = tannus_ds_QueryString;
tannus_ds_QueryString.__name__ = ["tannus","ds","QueryString"];
tannus_ds_QueryString.stringify = function(data) {
	var pairs = [];
	var _g = 0;
	var _g1 = Reflect.fields(data);
	while(_g < _g1.length) {
		var key = _g1[_g];
		++_g;
		var val;
		var this1 = Reflect.getProperty(data,key);
		val = this1 != null?this1:this1;
		var t = tannus_internal_TypeTools.typename(val);
		switch(t) {
		case "Number":case "String":case "Boolean":
			pairs.push(key + "=" + encodeURIComponent(Std.string(val)));
			break;
		case "Array":
			var arr = val;
			var _g2 = 0;
			while(_g2 < arr.length) {
				var x = arr[_g2];
				++_g2;
				if(Lambda.has(["Number","String","Boolean"],tannus_internal_TypeTools.typename(x))) null; else throw new js__$Boot_HaxeError("TypeError: Cannot urlify non-primitive values!");
			}
			var _g21 = 0;
			while(_g21 < arr.length) {
				var x1 = arr[_g21];
				++_g21;
				pairs.push("" + key + "[]=" + encodeURIComponent(Std.string(x1)));
			}
			break;
		default:
			var o = val;
			var _g22 = 0;
			var _g3 = Reflect.fields(o);
			while(_g22 < _g3.length) {
				var ok = _g3[_g22];
				++_g22;
				pairs.push("" + key + "[" + ok + "]=" + StringTools.urlEncode(Std.string(Reflect.getProperty(o,ok))));
			}
		}
	}
	var qs = pairs.join("&");
	return qs;
};
tannus_ds_QueryString.parse = function(qs) {
	var ekey = new EReg("([A-Z]+[A-Z0-9_\\-]*)\\[([A-Z]+[A-Z0-9]*)\\]","i");
	var earr = new EReg("([A-Z]+[A-Z0-9_\\-]*)\\[([0-9]*)\\]","i");
	var res = { };
	var pairs = qs.split("&").map(function(s) {
		return s.split("=");
	});
	var _g = 0;
	while(_g < pairs.length) {
		var p = pairs[_g];
		++_g;
		switch(p.length) {
		case 2:
			var __ex1 = p[1];
			var __ex0 = p[0];
			{
				var _g1 = decodeURIComponent(__ex1.split("+").join(" "));
				var _g2 = decodeURIComponent(__ex0.split("+").join(" "));
				var key = _g2;
				var val = _g1;
				if(ekey.match(key)) {
					var md = tannus_io__$RegEx_RegEx_$Impl_$.matches(ekey,key)[0].slice(1);
					key = md[0];
					var okey = md[1];
					if(!Object.prototype.hasOwnProperty.call(res,key)) {
						Reflect.setProperty(res,key,{ });
						Reflect.getProperty(res,key);
					}
					var this1;
					var o = Reflect.getProperty(res,key);
					this1 = o;
					Reflect.setProperty(this1,okey,val);
					Reflect.getProperty(this1,okey);
				} else switch(p.length) {
				case 2:
					var __ex11 = p[1];
					var __ex01 = p[0];
					{
						var _g3 = decodeURIComponent(__ex11.split("+").join(" "));
						var _g4 = decodeURIComponent(__ex01.split("+").join(" "));
						var key1 = _g4;
						var val1 = _g3;
						if(earr.match(key1)) {
							var md1 = tannus_io__$RegEx_RegEx_$Impl_$.matches(earr,key1)[0].slice(1);
							key1 = md1[0];
							var index = Std.parseInt(md1[1]);
							if(!Object.prototype.hasOwnProperty.call(res,key1)) {
								var value = [];
								Reflect.setProperty(res,key1,value);
								Reflect.getProperty(res,key1);
							}
							var list;
							list = js_Boot.__cast((function($this) {
								var $r;
								var this2 = Reflect.getProperty(res,key1);
								$r = this2 != null?this2:this2;
								return $r;
							}(this)) , Array);
							if(index != null) list[index] = val1; else list.push(val1);
						} else switch(p.length) {
						case 2:
							var __ex12 = p[1];
							var __ex02 = p[0];
							{
								var _g5 = decodeURIComponent(__ex12.split("+").join(" "));
								var _g6 = decodeURIComponent(__ex02.split("+").join(" "));
								var key2 = _g6;
								var val2 = _g5;
								{
									Reflect.setProperty(res,key2,val2);
									Reflect.getProperty(res,key2);
								}
							}
							break;
						}
					}
					break;
				}
			}
			break;
		}
	}
	return res;
};
var tannus_ds__$Ref_Ref_$Impl_$ = {};
$hxClasses["tannus.ds._Ref.Ref_Impl_"] = tannus_ds__$Ref_Ref_$Impl_$;
tannus_ds__$Ref_Ref_$Impl_$.__name__ = ["tannus","ds","_Ref","Ref_Impl_"];
tannus_ds__$Ref_Ref_$Impl_$._new = function(r) {
	return new tannus_ds_CRef(r);
};
tannus_ds__$Ref_Ref_$Impl_$.get = function(this1) {
	return this1.get();
};
tannus_ds__$Ref_Ref_$Impl_$.toString = function(this1) {
	return Std.string(this1.get());
};
var tannus_ds_CRef = function(g) {
	this.getter = g;
	this._value = null;
};
$hxClasses["tannus.ds.CRef"] = tannus_ds_CRef;
tannus_ds_CRef.__name__ = ["tannus","ds","CRef"];
tannus_ds_CRef.prototype = {
	get: function() {
		if(this._value == null) {
			console.log("first get");
			return this._value = this.getter();
		} else return this._value;
	}
	,__class__: tannus_ds_CRef
};
var tannus_ds__$Stack_StackIterator = function(s) {
	this.stack = s;
};
$hxClasses["tannus.ds._Stack.StackIterator"] = tannus_ds__$Stack_StackIterator;
tannus_ds__$Stack_StackIterator.__name__ = ["tannus","ds","_Stack","StackIterator"];
tannus_ds__$Stack_StackIterator.prototype = {
	hasNext: function() {
		return !this.stack.get_empty();
	}
	,next: function() {
		return this.stack.pop();
	}
	,__class__: tannus_ds__$Stack_StackIterator
};
var tannus_ds_StringUtils = function() { };
$hxClasses["tannus.ds.StringUtils"] = tannus_ds_StringUtils;
tannus_ds_StringUtils.__name__ = ["tannus","ds","StringUtils"];
tannus_ds_StringUtils.byteAt = function(s,i) {
	if(i <= s.length - 1) {
		var n = HxOverrides.cca(s,i);
		var this1;
		if(!tannus_io__$Byte_Byte_$Impl_$.isValid(n)) throw new js__$Boot_HaxeError("Invalid Byte Value (" + n + ")!");
		this1 = n;
		return this1;
	} else throw new js__$Boot_HaxeError("IndexOutOfBoundError: " + i + " is not within range(0, " + (s.length - 1) + ")");
};
tannus_ds_StringUtils.strip = function(str,pat) {
	{
		var _g = pat;
		switch(_g[1]) {
		case 0:
			var repl = _g[2];
			return StringTools.replace(str,repl,"");
		case 1:
			var patt = _g[2];
			var res = str;
			var reg = patt;
			var bits = tannus_io__$RegEx_RegEx_$Impl_$.matches(reg,res);
			var _g1 = 0;
			while(_g1 < bits.length) {
				var bit = bits[_g1];
				++_g1;
				res = StringTools.replace(res,bit[0],"");
			}
			return res;
		}
	}
};
tannus_ds_StringUtils.remove = function(str,sub) {
	var i = str.indexOf(sub);
	if(i == -1) return str; else if(i == 0) return str.substring(i + sub.length); else return str.substring(0,i) + str.substring(i + 1);
};
tannus_ds_StringUtils.wrap = function(str,wrapper,end) {
	if(end == null) end = wrapper;
	return wrapper + str + end;
};
tannus_ds_StringUtils.capitalize = function(s) {
	return s.substring(0,1).toUpperCase() + s.substring(1).toLowerCase();
};
tannus_ds_StringUtils.has = function(str,sub) {
	return str.indexOf(sub) != -1;
};
tannus_ds_StringUtils.slice = function(str,pos,len) {
	if(len != null) return HxOverrides.substr(str,pos,len); else return str.substring(pos);
};
tannus_ds_StringUtils.before = function(s,del) {
	if(tannus_ds_StringUtils.has(s,del)) return s.substring(0,s.indexOf(del)); else return s;
};
tannus_ds_StringUtils.beforeLast = function(s,del) {
	if(tannus_ds_StringUtils.has(s,del)) return s.substring(0,s.lastIndexOf(del)); else return s;
};
tannus_ds_StringUtils.after = function(s,del) {
	if(tannus_ds_StringUtils.has(s,del)) return s.substring(s.indexOf(del) + 1); else return s;
};
tannus_ds_StringUtils.afterLast = function(s,del) {
	if(tannus_ds_StringUtils.has(s,del)) return s.substring(s.lastIndexOf(del) + 1); else return "";
};
tannus_ds_StringUtils.lastByte = function(s) {
	var n = HxOverrides.cca(s,s.length - 1);
	var this1;
	if(!tannus_io__$Byte_Byte_$Impl_$.isValid(n)) throw new js__$Boot_HaxeError("Invalid Byte Value (" + n + ")!");
	this1 = n;
	return this1;
};
tannus_ds_StringUtils.empty = function(s) {
	return s.length == 0;
};
var tannus_ds__$ThreeTuple_ThreeTuple_$Impl_$ = {};
$hxClasses["tannus.ds._ThreeTuple.ThreeTuple_Impl_"] = tannus_ds__$ThreeTuple_ThreeTuple_$Impl_$;
tannus_ds__$ThreeTuple_ThreeTuple_$Impl_$.__name__ = ["tannus","ds","_ThreeTuple","ThreeTuple_Impl_"];
tannus_ds__$ThreeTuple_ThreeTuple_$Impl_$.__properties__ = {set_three:"set_three",get_three:"get_three",set_two:"set_two",get_two:"get_two",set_one:"set_one",get_one:"get_one"}
tannus_ds__$ThreeTuple_ThreeTuple_$Impl_$._new = function(a,b,c) {
	return [a,b,c];
};
tannus_ds__$ThreeTuple_ThreeTuple_$Impl_$.get_one = function(this1) {
	return this1[0];
};
tannus_ds__$ThreeTuple_ThreeTuple_$Impl_$.set_one = function(this1,v) {
	return this1[0] = v;
};
tannus_ds__$ThreeTuple_ThreeTuple_$Impl_$.get_two = function(this1) {
	return this1[1];
};
tannus_ds__$ThreeTuple_ThreeTuple_$Impl_$.set_two = function(this1,v) {
	return this1[1] = v;
};
tannus_ds__$ThreeTuple_ThreeTuple_$Impl_$.get_three = function(this1) {
	return this1[2];
};
tannus_ds__$ThreeTuple_ThreeTuple_$Impl_$.set_three = function(this1,v) {
	return this1[2] = v;
};
tannus_ds__$ThreeTuple_ThreeTuple_$Impl_$.toString = function(this1) {
	return "(" + Std.string(this1[0]) + ", " + Std.string(this1[1]) + ", " + Std.string(this1[2]) + ")";
};
tannus_ds__$ThreeTuple_ThreeTuple_$Impl_$.toArray = function(this1) {
	return this1;
};
var tannus_ds__$TwoTuple_TwoTuple_$Impl_$ = {};
$hxClasses["tannus.ds._TwoTuple.TwoTuple_Impl_"] = tannus_ds__$TwoTuple_TwoTuple_$Impl_$;
tannus_ds__$TwoTuple_TwoTuple_$Impl_$.__name__ = ["tannus","ds","_TwoTuple","TwoTuple_Impl_"];
tannus_ds__$TwoTuple_TwoTuple_$Impl_$.__properties__ = {set_two:"set_two",get_two:"get_two",set_one:"set_one",get_one:"get_one"}
tannus_ds__$TwoTuple_TwoTuple_$Impl_$._new = function(a,b) {
	return [a,b];
};
tannus_ds__$TwoTuple_TwoTuple_$Impl_$.get_one = function(this1) {
	return this1[0];
};
tannus_ds__$TwoTuple_TwoTuple_$Impl_$.set_one = function(this1,v) {
	return this1[0] = v;
};
tannus_ds__$TwoTuple_TwoTuple_$Impl_$.get_two = function(this1) {
	return this1[1];
};
tannus_ds__$TwoTuple_TwoTuple_$Impl_$.set_two = function(this1,v) {
	return this1[1] = v;
};
tannus_ds__$TwoTuple_TwoTuple_$Impl_$.toString = function(this1) {
	return "(" + Std.string(this1[0]) + ", " + Std.string(this1[1]) + ")";
};
tannus_ds__$TwoTuple_TwoTuple_$Impl_$.toArray = function(this1) {
	return this1;
};
var tannus_ds__$Value_Value_$Impl_$ = {};
$hxClasses["tannus.ds._Value.Value_Impl_"] = tannus_ds__$Value_Value_$Impl_$;
tannus_ds__$Value_Value_$Impl_$.__name__ = ["tannus","ds","_Value","Value_Impl_"];
tannus_ds__$Value_Value_$Impl_$._new = function(g) {
	return new tannus_ds__$Value_CVal(g);
};
tannus_ds__$Value_Value_$Impl_$.get = function(this1) {
	return this1.get();
};
tannus_ds__$Value_Value_$Impl_$.toString = function(this1) {
	return Std.string(this1.get());
};
var tannus_ds__$Value_CVal = function(b) {
	this.base = b;
	this.mods = [];
};
$hxClasses["tannus.ds._Value.CVal"] = tannus_ds__$Value_CVal;
tannus_ds__$Value_CVal.__name__ = ["tannus","ds","_Value","CVal"];
tannus_ds__$Value_CVal.prototype = {
	modify: function(m) {
		this.mods.push(m);
	}
	,transform: function(t) {
		return new tannus_ds__$Value_CVal(tannus_io__$Getter_Getter_$Impl_$.transform($bind(this,this.get),t));
	}
	,get: function() {
		var result = this.base();
		var _g = 0;
		var _g1 = this.mods;
		while(_g < _g1.length) {
			var m = _g1[_g];
			++_g;
			result = m(result);
		}
		return result;
	}
	,__class__: tannus_ds__$Value_CVal
};
var tannus_ds_promises_ArrayPromise = function(f) {
	tannus_ds_Promise.call(this,f);
};
$hxClasses["tannus.ds.promises.ArrayPromise"] = tannus_ds_promises_ArrayPromise;
tannus_ds_promises_ArrayPromise.__name__ = ["tannus","ds","promises","ArrayPromise"];
tannus_ds_promises_ArrayPromise.fromPrim = function(pa) {
	return new tannus_ds_promises_ArrayPromise(function(res,err) {
		pa.then(res);
		pa.unless(err);
	});
};
tannus_ds_promises_ArrayPromise.__super__ = tannus_ds_Promise;
tannus_ds_promises_ArrayPromise.prototype = $extend(tannus_ds_Promise.prototype,{
	get: function(index) {
		var _g = this;
		var res = new tannus_ds_Promise(function(accept,reject) {
			_g.then(function(items) {
				accept(items[index]);
			});
			_g.unless(function(error) {
				reject(error);
			});
		},null);
		this.attach(res);
		return res;
	}
	,slice: function(pos,end) {
		var _g = this;
		return new tannus_ds_promises_ArrayPromise(function(res,err) {
			_g.then(function(list) {
				res(list.slice(pos,end));
			});
			_g.unless(function(error) {
				err(error);
			});
		});
	}
	,concat: function(other) {
		var _g = this;
		var res1 = new tannus_ds_promises_ArrayPromise(function(res,err) {
			_g.then(function(list) {
				res(list.concat(other));
			});
			_g.unless(function(error) {
				err(error);
			});
		});
		this.attach(res1);
		return res1;
	}
	,map: function(f) {
		var res = tannus_ds_promises_ArrayPromise.fromPrim(this.transform(function(x) {
			return x.map(f);
		}));
		this.attach(res);
		return res;
	}
	,filter: function(test) {
		var res = tannus_ds_promises_ArrayPromise.fromPrim(this.transform(function(list) {
			return list.filter(test);
		}));
		this.attach(res);
		return res;
	}
	,has: function(item) {
		var _g = this;
		var result = new tannus_ds_promises_BoolPromise(function(res,err) {
			_g.then(function(list) {
				res(Lambda.has(list,item));
			});
			_g.unless(err);
		});
		this.attach(result);
		return result;
	}
	,join: function(sep) {
		var _g = this;
		var result = new tannus_ds_promises_StringPromise(function(accept,reject) {
			_g.then(function(list) {
				accept(list.join(sep));
			});
			_g.unless(reject);
		});
		this.attach(result);
		return result;
	}
	,each: function(f) {
		this.then(function(list) {
			var _g = 0;
			while(_g < list.length) {
				var item = list[_g];
				++_g;
				f(item);
			}
		});
		return this;
	}
	,__class__: tannus_ds_promises_ArrayPromise
});
var tannus_ds_promises_BoolPromise = function(exec,nocall) {
	tannus_ds_Promise.call(this,exec,nocall);
};
$hxClasses["tannus.ds.promises.BoolPromise"] = tannus_ds_promises_BoolPromise;
tannus_ds_promises_BoolPromise.__name__ = ["tannus","ds","promises","BoolPromise"];
tannus_ds_promises_BoolPromise.__super__ = tannus_ds_Promise;
tannus_ds_promises_BoolPromise.prototype = $extend(tannus_ds_Promise.prototype,{
	yep: function(onyes) {
		this.then(function(v) {
			if(v) onyes();
		});
		return this;
	}
	,nope: function(onno) {
		this.then(function(v) {
			if(!v) onno();
		});
		return this;
	}
	,__class__: tannus_ds_promises_BoolPromise
});
var tannus_ds_promises_ObjectPromise = function(exec,nocall) {
	tannus_ds_Promise.call(this,exec,nocall);
};
$hxClasses["tannus.ds.promises.ObjectPromise"] = tannus_ds_promises_ObjectPromise;
tannus_ds_promises_ObjectPromise.__name__ = ["tannus","ds","promises","ObjectPromise"];
tannus_ds_promises_ObjectPromise.__super__ = tannus_ds_Promise;
tannus_ds_promises_ObjectPromise.prototype = $extend(tannus_ds_Promise.prototype,{
	exists: function(key) {
		var _g = this;
		var r = new tannus_ds_promises_BoolPromise(function(res,err) {
			_g.then(function(o) {
				res(Object.prototype.hasOwnProperty.call(o,key));
			});
			_g.unless(err);
		});
		this.attach(r);
		return r;
	}
	,keys: function() {
		var _g = this;
		var r = new tannus_ds_promises_ArrayPromise(function(a,e) {
			_g.then(function(o) {
				a(Reflect.fields(o));
			});
			_g.unless(e);
		});
		this.attach(r);
		return r;
	}
	,get: function(key) {
		var _g = this;
		var r = new tannus_ds_promises_ObjectPromise(function(accept,reject) {
			_g.then(function(o) {
				console.log(o);
				accept((function($this) {
					var $r;
					var this1 = Reflect.getProperty(o,key);
					$r = this1 != null?this1:this1;
					return $r;
				}(this)));
			});
			_g.unless(reject);
		});
		this.attach(r);
		return r;
	}
	,__class__: tannus_ds_promises_ObjectPromise
});
var tannus_ds_promises_StringPromise = function(exec,nocall) {
	tannus_ds_Promise.call(this,exec,nocall);
};
$hxClasses["tannus.ds.promises.StringPromise"] = tannus_ds_promises_StringPromise;
tannus_ds_promises_StringPromise.__name__ = ["tannus","ds","promises","StringPromise"];
tannus_ds_promises_StringPromise.__super__ = tannus_ds_Promise;
tannus_ds_promises_StringPromise.prototype = $extend(tannus_ds_Promise.prototype,{
	charAt: function(i) {
		var _g = this;
		var res = new tannus_ds_promises_StringPromise(function(accept,reject) {
			_g.then(function(s) {
				accept(s.charAt(i));
			});
			_g.unless(reject);
		});
		this.attach(res);
		return res;
	}
	,charCodeAt: function(i) {
		var res = this.charAt(i).transform(function(c) {
			return HxOverrides.cca(c,0);
		});
		this.attach(res);
		return res;
	}
	,split: function(delimiter) {
		var _g = this;
		var res = new tannus_ds_Promise(function(accept,reject) {
			_g.then(function(s) {
				accept(s.split(delimiter));
			});
			_g.unless(function(err) {
				reject(err);
			});
		},null).array();
		this.attach(res);
		return res;
	}
	,substr: function(pos,len) {
		var _g = this;
		var res = new tannus_ds_promises_StringPromise(function(accept,reject) {
			_g.then(function(data) {
				var sub = HxOverrides.substr(data,pos,len);
				accept(sub);
			});
			_g.unless(reject);
		});
		this.attach(res);
		return res;
	}
	,substring: function(start,end) {
		var _g = this;
		var res = new tannus_ds_promises_StringPromise(function(accept,reject) {
			_g.then(function(data) {
				var sub = data.substring(start,end);
				accept(sub);
			});
			_g.unless(reject);
		});
		this.attach(res);
		return res;
	}
	,toUpperCase: function() {
		var _g = this;
		var res = new tannus_ds_promises_StringPromise(function(accept,reject) {
			_g.then(function(s) {
				accept(s.toUpperCase());
			});
			_g.unless(reject);
		});
		this.attach(res);
		return res;
	}
	,toLowerCase: function() {
		var _g = this;
		var res = new tannus_ds_promises_StringPromise(function(accept,reject) {
			_g.then(function(s) {
				accept(s.toLowerCase());
			});
			_g.unless(reject);
		});
		this.attach(res);
		return res;
	}
	,capitalize: function() {
		var _g = this;
		var res = new tannus_ds_Promise(function(accept,reject) {
			_g.then(function(s) {
				var chars = s.split("");
				var first = chars.shift().toUpperCase();
				var rest = chars.join("").toLowerCase();
				accept(first + rest);
			});
			_g.unless(function(err) {
				reject(err);
			});
		},null).string();
		this.attach(res);
		return res;
	}
	,startsWith: function(start) {
		var _g = this;
		var res = new tannus_ds_promises_BoolPromise(function(reply,reject) {
			_g.then(function(data) {
				{
					var _g1 = start;
					switch(_g1[1]) {
					case 0:
						var str = _g1[2];
						reply(StringTools.startsWith(data,str));
						break;
					case 1:
						var _pstr = _g1[2];
						var pstr = _pstr.string();
						pstr.then(function(str1) {
							reply(StringTools.startsWith(data,str1));
						});
						break;
					}
				}
			});
			_g.unless(reject);
		});
		this.attach(res);
		return res;
	}
	,endsWith: function(end) {
		var _g = this;
		var res = new tannus_ds_promises_BoolPromise(function(reply,reject) {
			_g.then(function(data) {
				{
					var _g1 = end;
					switch(_g1[1]) {
					case 0:
						var str = _g1[2];
						reply(StringTools.endsWith(data,str));
						break;
					case 1:
						var _pstr = _g1[2];
						var pstr = _pstr.string();
						pstr.then(function(str1) {
							reply(StringTools.endsWith(data,str1));
						});
						break;
					}
				}
			});
			_g.unless(reject);
		});
		this.attach(res);
		return res;
	}
	,ltrim: function() {
		var lt = this.transform(function(s) {
			return StringTools.ltrim(s);
		}).string();
		this.attach(lt);
		return lt;
	}
	,rtrim: function() {
		var rt = this.transform(function(s) {
			return StringTools.rtrim(s);
		}).string();
		this.attach(rt);
		return rt;
	}
	,trim: function() {
		var trimmed = this.transform(function(s) {
			return StringTools.trim(s);
		}).string();
		this.attach(trimmed);
		return trimmed;
	}
	,match: function(pattern) {
		var res = this.transform(function(s) {
			return pattern.match(s);
		}).bool();
		this.attach(res);
		return res;
	}
	,__class__: tannus_ds_promises_StringPromise
});
var tannus_ds_tuples__$Tup2_Tup2_$Impl_$ = {};
$hxClasses["tannus.ds.tuples._Tup2.Tup2_Impl_"] = tannus_ds_tuples__$Tup2_Tup2_$Impl_$;
tannus_ds_tuples__$Tup2_Tup2_$Impl_$.__name__ = ["tannus","ds","tuples","_Tup2","Tup2_Impl_"];
tannus_ds_tuples__$Tup2_Tup2_$Impl_$.__properties__ = {set__1:"set__1",get__1:"get__1",set__0:"set__0",get__0:"get__0"}
tannus_ds_tuples__$Tup2_Tup2_$Impl_$._new = function(a,b) {
	return [a,b];
};
tannus_ds_tuples__$Tup2_Tup2_$Impl_$.get__0 = function(this1) {
	return this1[0];
};
tannus_ds_tuples__$Tup2_Tup2_$Impl_$.set__0 = function(this1,v) {
	return this1[0] = v;
};
tannus_ds_tuples__$Tup2_Tup2_$Impl_$.get__1 = function(this1) {
	return this1[1];
};
tannus_ds_tuples__$Tup2_Tup2_$Impl_$.set__1 = function(this1,v) {
	return this1[1] = v;
};
var tannus_ds_tuples__$Tup4_Tup4_$Impl_$ = {};
$hxClasses["tannus.ds.tuples._Tup4.Tup4_Impl_"] = tannus_ds_tuples__$Tup4_Tup4_$Impl_$;
tannus_ds_tuples__$Tup4_Tup4_$Impl_$.__name__ = ["tannus","ds","tuples","_Tup4","Tup4_Impl_"];
tannus_ds_tuples__$Tup4_Tup4_$Impl_$.__properties__ = {set__3:"set__3",get__3:"get__3",set__2:"set__2",get__2:"get__2",set__1:"set__1",get__1:"get__1",set__0:"set__0",get__0:"get__0"}
tannus_ds_tuples__$Tup4_Tup4_$Impl_$._new = function(a,b,c,d) {
	return [a,b,c,d];
};
tannus_ds_tuples__$Tup4_Tup4_$Impl_$.get__0 = function(this1) {
	return this1[0];
};
tannus_ds_tuples__$Tup4_Tup4_$Impl_$.set__0 = function(this1,v) {
	return this1[0] = v;
};
tannus_ds_tuples__$Tup4_Tup4_$Impl_$.get__1 = function(this1) {
	return this1[1];
};
tannus_ds_tuples__$Tup4_Tup4_$Impl_$.set__1 = function(this1,v) {
	return this1[1] = v;
};
tannus_ds_tuples__$Tup4_Tup4_$Impl_$.get__2 = function(this1) {
	return this1[2];
};
tannus_ds_tuples__$Tup4_Tup4_$Impl_$.set__2 = function(this1,v) {
	return this1[2] = v;
};
tannus_ds_tuples__$Tup4_Tup4_$Impl_$.get__3 = function(this1) {
	return this1[3];
};
tannus_ds_tuples__$Tup4_Tup4_$Impl_$.set__3 = function(this1,v) {
	return this1[3] = v;
};
var tannus_events_Event = function(variety,bubbls) {
	if(bubbls == null) bubbls = false;
	this.type = variety;
	this.date = new Date().getTime();
	this._bubbles = bubbls;
	this._defaultPrevented = false;
	this.onDefaultPrevented = new tannus_io_Signal();
	this.onPropogationStopped = new tannus_io_Signal();
};
$hxClasses["tannus.events.Event"] = tannus_events_Event;
tannus_events_Event.__name__ = ["tannus","events","Event"];
tannus_events_Event.prototype = {
	preventDefault: function() {
		this._defaultPrevented = true;
		this.onDefaultPrevented.broadcast(this._defaultPrevented);
	}
	,stopPropogation: function() {
		this.onPropogationStopped.broadcast(true);
	}
	,get_bubbles: function() {
		return this._bubbles;
	}
	,get_defaultPrevented: function() {
		return this._defaultPrevented;
	}
	,__class__: tannus_events_Event
	,__properties__: {get_defaultPrevented:"get_defaultPrevented",get_bubbles:"get_bubbles"}
};
var tannus_events__$Key_Key_$Impl_$ = {};
$hxClasses["tannus.events._Key.Key_Impl_"] = tannus_events__$Key_Key_$Impl_$;
tannus_events__$Key_Key_$Impl_$.__name__ = ["tannus","events","_Key","Key_Impl_"];
tannus_events__$Key_Key_$Impl_$.__properties__ = {get_name:"get_name"}
tannus_events__$Key_Key_$Impl_$.get_name = function(this1) {
	return tannus_events__$Key_Key_$Impl_$.nameof(this1);
};
tannus_events__$Key_Key_$Impl_$.nameof = function(key) {
	var _g = 0;
	var _g1;
	var this1 = tannus_events__$Key_Key_$Impl_$.raw;
	_g1 = Reflect.fields(this1).map(function(k) {
		return { 'name' : k, 'value' : Reflect.getProperty(this1,k)};
	});
	while(_g < _g1.length) {
		var pair = _g1[_g];
		++_g;
		if(pair.value == key) return pair.name;
	}
	return null;
};
var tannus_events_KeyboardEvent = function(type,code,emods) {
	tannus_events_Event.call(this,type);
	this.keyCode = code;
	this.key = this.keyCode;
	if(emods != null) this.mods = emods; else this.mods = [];
	this.altKey = Lambda.has(this.mods,"alt");
	this.ctrlKey = Lambda.has(this.mods,"ctrl");
	this.shiftKey = Lambda.has(this.mods,"shift");
	this.metaKey = Lambda.has(this.mods,"super");
};
$hxClasses["tannus.events.KeyboardEvent"] = tannus_events_KeyboardEvent;
tannus_events_KeyboardEvent.__name__ = ["tannus","events","KeyboardEvent"];
tannus_events_KeyboardEvent.fromJqEvent = function(e) {
	var mods = [];
	if(e.altKey) mods.push("alt");
	if(e.ctrlKey) mods.push("ctrl");
	if(e.shiftKey) mods.push("shift");
	if(e.metaKey) mods.push("super");
	var res = new tannus_events_KeyboardEvent(e.type,e.keyCode,mods);
	res.onDefaultPrevented.listen($bind(e,e.preventDefault),true);
	res.onPropogationStopped.listen($bind(e,e.stopPropagation),true);
	return res;
};
tannus_events_KeyboardEvent.__super__ = tannus_events_Event;
tannus_events_KeyboardEvent.prototype = $extend(tannus_events_Event.prototype,{
	__class__: tannus_events_KeyboardEvent
});
var tannus_events_MouseEvent = function(type,pos,btn,mods) {
	if(btn == null) btn = -1;
	tannus_events_Event.call(this,type);
	this.position = pos;
	this.button = btn;
	this.emods = mods != null?mods:[];
};
$hxClasses["tannus.events.MouseEvent"] = tannus_events_MouseEvent;
tannus_events_MouseEvent.__name__ = ["tannus","events","MouseEvent"];
tannus_events_MouseEvent.fromJqEvent = function(event) {
	var mods = [];
	if(event.shiftKey) mods.push("shift");
	if(event.altKey) mods.push("alt");
	if(event.ctrlKey) mods.push("ctrl");
	if(event.metaKey) mods.push("super");
	var pos = new tannus_geom_TPoint(event.pageX,event.pageY,0);
	var result = new tannus_events_MouseEvent(event.type,pos,event.which,mods);
	result.onDefaultPrevented.listen(function(x) {
		event.preventDefault();
	},true);
	result.onPropogationStopped.listen(function(x1) {
		event.stopPropagation();
	},true);
	return result;
};
tannus_events_MouseEvent.__super__ = tannus_events_Event;
tannus_events_MouseEvent.prototype = $extend(tannus_events_Event.prototype,{
	get_shiftKey: function() {
		return Lambda.has(this.emods,"shift");
	}
	,get_altKey: function() {
		return Lambda.has(this.emods,"alt");
	}
	,get_ctrlKey: function() {
		return Lambda.has(this.emods,"ctrl");
	}
	,get_metaKey: function() {
		return Lambda.has(this.emods,"super");
	}
	,__class__: tannus_events_MouseEvent
	,__properties__: $extend(tannus_events_Event.prototype.__properties__,{get_metaKey:"get_metaKey",get_ctrlKey:"get_ctrlKey",get_altKey:"get_altKey",get_shiftKey:"get_shiftKey"})
});
var tannus_geom__$Angle_Angle_$Impl_$ = {};
$hxClasses["tannus.geom._Angle.Angle_Impl_"] = tannus_geom__$Angle_Angle_$Impl_$;
tannus_geom__$Angle_Angle_$Impl_$.__name__ = ["tannus","geom","_Angle","Angle_Impl_"];
tannus_geom__$Angle_Angle_$Impl_$.__properties__ = {set_radians:"set_radians",get_radians:"get_radians",set_degrees:"set_degrees",get_degrees:"get_degrees"}
tannus_geom__$Angle_Angle_$Impl_$._new = function(degs) {
	return degs;
};
tannus_geom__$Angle_Angle_$Impl_$.compliment = function(this1) {
	return 360 - this1;
};
tannus_geom__$Angle_Angle_$Impl_$.postincrement = function(this1) {
	var degs = this1++;
	return degs;
};
tannus_geom__$Angle_Angle_$Impl_$.preincrement = function(this1) {
	var degs = ++this1;
	return degs;
};
tannus_geom__$Angle_Angle_$Impl_$.get_degrees = function(this1) {
	return this1;
};
tannus_geom__$Angle_Angle_$Impl_$.set_degrees = function(this1,v) {
	return v < 0?this1 = 0:v > 360?this1 = 360:this1 = v;
};
tannus_geom__$Angle_Angle_$Impl_$.get_radians = function(this1) {
	return this1 * 3.141592653589793 / 180;
};
tannus_geom__$Angle_Angle_$Impl_$.set_radians = function(this1,v) {
	var v1 = v * 180 / 3.141592653589793;
	if(v1 < 0) return this1 = 0; else if(v1 > 360) return this1 = 360; else return this1 = v1;
};
tannus_geom__$Angle_Angle_$Impl_$.toString = function(this1) {
	return this1 + "°";
};
tannus_geom__$Angle_Angle_$Impl_$.fromDegrees = function(fl) {
	return fl;
};
tannus_geom__$Angle_Angle_$Impl_$.fromRadians = function(fl) {
	return fl * 0.0174532925199432955;
};
var tannus_geom__$Area_Area_$Impl_$ = {};
$hxClasses["tannus.geom._Area.Area_Impl_"] = tannus_geom__$Area_Area_$Impl_$;
tannus_geom__$Area_Area_$Impl_$.__name__ = ["tannus","geom","_Area","Area_Impl_"];
tannus_geom__$Area_Area_$Impl_$.__properties__ = {set_height:"set_height",get_height:"get_height",set_width:"set_width",get_width:"get_width"}
tannus_geom__$Area_Area_$Impl_$._new = function(w,h) {
	if(h == null) h = 0;
	if(w == null) w = 0;
	return [w,h];
};
tannus_geom__$Area_Area_$Impl_$.get_width = function(this1) {
	return this1[0];
};
tannus_geom__$Area_Area_$Impl_$.set_width = function(this1,nw) {
	return this1[0] = nw;
};
tannus_geom__$Area_Area_$Impl_$.get_height = function(this1) {
	return this1[1];
};
tannus_geom__$Area_Area_$Impl_$.set_height = function(this1,nh) {
	return this1[1] = nh;
};
tannus_geom__$Area_Area_$Impl_$.clone = function(this1) {
	return [this1[0],this1[1]];
};
tannus_geom__$Area_Area_$Impl_$.resize = function(this1,nw,nh,mr) {
	if(mr == null) mr = false;
	if(mr) {
		var w = this1[0];
		var h = this1[1];
		if(nw != null) {
			var rat = h / w;
			w = nw;
			h = w * rat;
			return [w,h];
		} else if(nh != null) {
			var rat1 = w / h;
			h = nh;
			w = h * rat1;
			return [w,h];
		} else throw new js__$Boot_HaxeError("GeometryError: Cannot maintain ration if both [width] and [height] are assigned!");
	} else {
		var w1;
		if(nw != null) w1 = nw; else w1 = this1[0];
		var h1;
		if(nh != null) h1 = nh; else h1 = this1[1];
		return [w1,h1];
	}
};
tannus_geom__$Area_Area_$Impl_$.toFloatTuple = function(this1) {
	return this1;
};
tannus_geom__$Area_Area_$Impl_$.toIntTuple = function(this1) {
	var a = Math.round(this1[0]);
	var b = Math.round(this1[1]);
	return [a,b];
};
tannus_geom__$Area_Area_$Impl_$.fromTwoTuple = function(t) {
	return [t[0],t[1]];
};
tannus_geom__$Area_Area_$Impl_$.toRectangle = function(this1) {
	return new tannus_geom_CRectangle(0,0,this1[0],this1[1]);
};
tannus_geom__$Area_Area_$Impl_$.fromRectangle = function(r) {
	return [r.width,r.height];
};
tannus_geom__$Area_Area_$Impl_$.toString = function(this1) {
	return "Area<" + this1[0] + "x" + this1[1] + ">";
};
tannus_geom__$Area_Area_$Impl_$.fromString = function(s) {
	var w;
	var h;
	s = StringTools.replace(StringTools.replace(StringTools.replace(s,"Area",""),"<",""),">","");
	var a = s.split("x").map((function(f) {
		return function(x) {
			return f(x);
		};
	})(Std.parseFloat));
	return [a[0],a[1]];
};
tannus_geom__$Area_Area_$Impl_$.toFloatArray = function(this1) {
	return [this1[0],this1[1]];
};
tannus_geom__$Area_Area_$Impl_$.toIntArray = function(this1) {
	return [this1[0],this1[1]].map(Math.round);
};
tannus_geom__$Area_Area_$Impl_$.fromFloatArray = function(a) {
	return [a[0],a[1]];
};
tannus_geom__$Area_Area_$Impl_$.fromIntArray = function(a) {
	return [a[0],a[1]];
};
tannus_geom__$Area_Area_$Impl_$.i = function(f) {
	return Math.round(f);
};
var tannus_geom_OldArea = function(w,h) {
	if(h == null) h = 0;
	if(w == null) w = 0;
	this.width = w;
	this.height = h;
};
$hxClasses["tannus.geom.OldArea"] = tannus_geom_OldArea;
tannus_geom_OldArea.__name__ = ["tannus","geom","OldArea"];
tannus_geom_OldArea.prototype = {
	__class__: tannus_geom_OldArea
};
var tannus_geom_Line = function(o,t) {
	this.one = o;
	this.two = t;
};
$hxClasses["tannus.geom.Line"] = tannus_geom_Line;
tannus_geom_Line.__name__ = ["tannus","geom","Line"];
tannus_geom_Line.prototype = {
	toString: function() {
		return "Line<(" + this.one.get_x() + ", " + this.one.get_y() + ") => (" + this.two.get_x() + ", " + this.two.get_y() + ")>";
	}
	,getPoint: function(d) {
		var dist = d;
		var vel;
		var angle = tannus_geom__$Point_Point_$Impl_$.angleTo(this.one,this.two);
		vel = [dist,angle];
		var res;
		var x = Math.cos(vel[1] * 3.141592653589793 / 180) * vel[0];
		var y = Math.sin(vel[1] * 3.141592653589793 / 180) * vel[0];
		res = new tannus_geom_TPoint(x,y,0);
		res = tannus_geom__$Point_Point_$Impl_$.plus(res,this.one);
		res.set_x(tannus_math_TMath.i(res.get_x()));
		res.set_y(tannus_math_TMath.i(res.get_y()));
		res.set_z(tannus_math_TMath.i(res.get_z()));
		return res;
	}
	,getVertices: function() {
		var pts = [];
		var this1 = this.one;
		this1.set_x(tannus_math_TMath.i(this1.get_x()));
		this1.set_y(tannus_math_TMath.i(this1.get_y()));
		this1.set_z(tannus_math_TMath.i(this1.get_z()));
		var this2 = this.two;
		this2.set_x(tannus_math_TMath.i(this2.get_x()));
		this2.set_y(tannus_math_TMath.i(this2.get_y()));
		this2.set_z(tannus_math_TMath.i(this2.get_z()));
		var _g1 = 0;
		var _g = Math.round(tannus_geom__$Point_Point_$Impl_$.distanceFrom(this.one,this.two));
		while(_g1 < _g) {
			var i = _g1++;
			pts.push(this.getPoint(i));
		}
		return new tannus_geom_VertexArray(pts);
	}
	,get_length: function() {
		return tannus_geom__$Point_Point_$Impl_$.distanceFrom(this.one,this.two);
	}
	,get_start: function() {
		return this.one;
	}
	,set_start: function(ns) {
		return this.one = ns;
	}
	,get_end: function() {
		return this.two;
	}
	,set_end: function(ne) {
		return this.two = ne;
	}
	,get_rectangle: function() {
		var min;
		if(tannus_geom__$Point_Point_$Impl_$.distanceFrom(this.one,new tannus_geom_TPoint(0,0,0)) > tannus_geom__$Point_Point_$Impl_$.distanceFrom(this.two,new tannus_geom_TPoint(0,0,0))) min = this.two; else min = this.one;
		var max;
		if(tannus_geom__$Point_Point_$Impl_$.distanceFrom(this.one,new tannus_geom_TPoint(0,0,0)) > tannus_geom__$Point_Point_$Impl_$.distanceFrom(this.two,new tannus_geom_TPoint(0,0,0))) max = this.one; else max = this.two;
		var _x = min.get_x();
		var _y = min.get_y();
		var _width = max.get_x() - min.get_x();
		var _height = max.get_y() - min.get_y();
		return new tannus_geom_CRectangle(_x,_y,_width,_height);
	}
	,__class__: tannus_geom_Line
	,__properties__: {get_rectangle:"get_rectangle",set_end:"set_end",get_end:"get_end",set_start:"set_start",get_start:"get_start",get_length:"get_length"}
};
var tannus_geom_Matrix = function(a,b,c,d,tx,ty) {
	if(ty == null) ty = 0;
	if(tx == null) tx = 0;
	if(d == null) d = 1;
	if(c == null) c = 0;
	if(b == null) b = 0;
	if(a == null) a = 1;
	this.a = a;
	this.b = b;
	this.c = c;
	this.d = d;
	this.tx = tx;
	this.ty = ty;
};
$hxClasses["tannus.geom.Matrix"] = tannus_geom_Matrix;
tannus_geom_Matrix.__name__ = ["tannus","geom","Matrix"];
tannus_geom_Matrix.prototype = {
	clone: function() {
		return new tannus_geom_Matrix(this.a,this.b,this.c,this.d,this.tx,this.ty);
	}
	,concat: function(m) {
		var a1 = this.a * m.a + this.b * m.c;
		this.b = this.a * m.b + this.b * m.d;
		this.a = a1;
		var c1 = this.c * m.a + this.d * m.c;
		this.d = this.c * m.b + this.d * m.d;
		this.c = c1;
		var tx1 = this.tx * m.a + this.ty * m.c + m.tx;
		this.ty = this.tx * m.b + this.ty * m.d + m.ty;
		this.tx = tx1;
	}
	,copyFrom: function(sourceMatrix) {
		this.a = sourceMatrix.a;
		this.b = sourceMatrix.b;
		this.c = sourceMatrix.c;
		this.d = sourceMatrix.d;
		this.tx = sourceMatrix.tx;
		this.ty = sourceMatrix.ty;
	}
	,createBox: function(scaleX,scaleY,rotation,tx,ty) {
		if(ty == null) ty = 0;
		if(tx == null) tx = 0;
		if(rotation == null) rotation = 0;
		this.a = scaleX;
		this.d = scaleY;
		this.b = rotation;
		this.tx = tx;
		this.ty = ty;
	}
	,createGradientBox: function(width,height,rotation,tx,ty) {
		if(ty == null) ty = 0;
		if(tx == null) tx = 0;
		if(rotation == null) rotation = 0;
		this.a = width / 1638.4;
		this.d = height / 1638.4;
		if(rotation != 0) {
			var cos = Math.cos(rotation);
			var sin = Math.sin(rotation);
			this.b = sin * this.d;
			this.c = -sin * this.a;
			this.a *= cos;
			this.d *= cos;
		} else {
			this.b = 0;
			this.c = 0;
		}
		this.tx = tx + width / 2;
		this.ty = ty + height / 2;
	}
	,equals: function(matrix) {
		return matrix != null && this.tx == matrix.tx && this.ty == matrix.ty && this.a == matrix.a && this.b == matrix.b && this.c == matrix.c && this.d == matrix.d;
	}
	,identity: function() {
		this.a = 1;
		this.b = 0;
		this.c = 0;
		this.d = 1;
		this.tx = 0;
		this.ty = 0;
	}
	,invert: function() {
		var norm = this.a * this.d - this.b * this.c;
		if(norm == 0) {
			this.a = this.b = this.c = this.d = 0;
			this.tx = -this.tx;
			this.ty = -this.ty;
		} else {
			norm = 1.0 / norm;
			var a1 = this.d * norm;
			this.d = this.a * norm;
			this.a = a1;
			this.b *= -norm;
			this.c *= -norm;
			var tx1 = -this.a * this.tx - this.c * this.ty;
			this.ty = -this.b * this.tx - this.d * this.ty;
			this.tx = tx1;
		}
		return this;
	}
	,mult: function(m) {
		var result = new tannus_geom_Matrix(this.a,this.b,this.c,this.d,this.tx,this.ty);
		result.concat(m);
		return result;
	}
	,rotate: function(theta) {
		var cos = Math.cos(theta);
		var sin = Math.sin(theta);
		var a1 = this.a * cos - this.b * sin;
		this.b = this.a * sin + this.b * cos;
		this.a = a1;
		var c1 = this.c * cos - this.d * sin;
		this.d = this.c * sin + this.d * cos;
		this.c = c1;
		var tx1 = this.tx * cos - this.ty * sin;
		this.ty = this.tx * sin + this.ty * cos;
		this.tx = tx1;
	}
	,scale: function(sx,sy) {
		this.a *= sx;
		this.b *= sy;
		this.c *= sx;
		this.d *= sy;
		this.tx *= sx;
		this.ty *= sy;
	}
	,setRotation: function(theta,scale) {
		if(scale == null) scale = 1;
		this.a = Math.cos(theta) * scale;
		this.c = Math.sin(theta) * scale;
		this.b = -this.c;
		this.d = this.a;
	}
	,setTo: function(a,b,c,d,tx,ty) {
		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
		this.tx = tx;
		this.ty = ty;
	}
	,toString: function() {
		return "Matrix(" + this.a + ", " + this.b + ", " + this.c + ", " + this.d + ", " + this.tx + ", " + this.ty + ")";
	}
	,transformPoint: function(pos) {
		var x = pos.get_x() * this.a + pos.get_y() * this.c + this.tx;
		var y = pos.get_x() * this.b + pos.get_y() * this.d + this.ty;
		return new tannus_geom_TPoint(x,y,0);
	}
	,__transformX: function(pos) {
		return pos.get_x() * this.a + pos.get_y() * this.c + this.tx;
	}
	,__transformY: function(pos) {
		return pos.get_x() * this.b + pos.get_y() * this.d + this.ty;
	}
	,translate: function(dx,dy) {
		var m = new tannus_geom_Matrix();
		m.tx = dx;
		m.ty = dy;
		this.concat(m);
	}
	,__cleanValues: function() {
		this.a = Math.round(this.a * 1000) / 1000;
		this.b = Math.round(this.b * 1000) / 1000;
		this.c = Math.round(this.c * 1000) / 1000;
		this.d = Math.round(this.d * 1000) / 1000;
		this.tx = Math.round(this.tx * 10) / 10;
		this.ty = Math.round(this.ty * 10) / 10;
	}
	,__translateTransformed: function(pos) {
		this.tx = pos.get_x() * this.a + pos.get_y() * this.c + this.tx;
		this.ty = pos.get_x() * this.b + pos.get_y() * this.d + this.ty;
	}
	,__class__: tannus_geom_Matrix
};
var tannus_geom__$Point_Point_$Impl_$ = {};
$hxClasses["tannus.geom._Point.Point_Impl_"] = tannus_geom__$Point_Point_$Impl_$;
tannus_geom__$Point_Point_$Impl_$.__name__ = ["tannus","geom","_Point","Point_Impl_"];
tannus_geom__$Point_Point_$Impl_$.__properties__ = {get_d:"get_d",set_iz:"set_iz",get_iz:"get_iz",set_iy:"set_iy",get_iy:"get_iy",set_ix:"set_ix",get_ix:"get_ix",set_z:"set_z",get_z:"get_z",set_y:"set_y",get_y:"get_y",set_x:"set_x",get_x:"get_x"}
tannus_geom__$Point_Point_$Impl_$._new = function(x,y,z) {
	if(z == null) z = 0;
	if(y == null) y = 0;
	if(x == null) x = 0;
	return new tannus_geom_TPoint(x,y,z);
};
tannus_geom__$Point_Point_$Impl_$.get_x = function(this1) {
	return this1.get_x();
};
tannus_geom__$Point_Point_$Impl_$.set_x = function(this1,nx) {
	return this1.set_x(nx);
};
tannus_geom__$Point_Point_$Impl_$.get_y = function(this1) {
	return this1.get_y();
};
tannus_geom__$Point_Point_$Impl_$.set_y = function(this1,ny) {
	return this1.set_y(ny);
};
tannus_geom__$Point_Point_$Impl_$.get_z = function(this1) {
	return this1.get_z();
};
tannus_geom__$Point_Point_$Impl_$.set_z = function(this1,nz) {
	return this1.set_z(nz);
};
tannus_geom__$Point_Point_$Impl_$.get_ix = function(this1) {
	return tannus_math_TMath.i(this1.get_x());
};
tannus_geom__$Point_Point_$Impl_$.set_ix = function(this1,nix) {
	return tannus_math_TMath.i(this1.set_x(nix));
};
tannus_geom__$Point_Point_$Impl_$.get_iy = function(this1) {
	return tannus_math_TMath.i(this1.get_y());
};
tannus_geom__$Point_Point_$Impl_$.set_iy = function(this1,niy) {
	return tannus_math_TMath.i(this1.set_y(niy));
};
tannus_geom__$Point_Point_$Impl_$.get_iz = function(this1) {
	return tannus_math_TMath.i(this1.get_z());
};
tannus_geom__$Point_Point_$Impl_$.set_iz = function(this1,niz) {
	return tannus_math_TMath.i(this1.set_z(niz));
};
tannus_geom__$Point_Point_$Impl_$.get_d = function(this1) {
	return tannus_geom__$Point_Point_$Impl_$.distanceFrom(this1,new tannus_geom_TPoint(0,0,0));
};
tannus_geom__$Point_Point_$Impl_$.distanceFrom = function(this1,other) {
	return Math.sqrt(Math.pow(Math.abs(this1.get_x() - other.get_x()),2) + Math.pow(Math.abs(this1.get_y() - other.get_y()),2));
};
tannus_geom__$Point_Point_$Impl_$.transform = function(this1,m) {
	return m.transformPoint((function($this) {
		var $r;
		var x = this1.get_x();
		var y = this1.get_y();
		var z = this1.get_z();
		$r = new tannus_geom_TPoint(x,y,z);
		return $r;
	}(this)));
};
tannus_geom__$Point_Point_$Impl_$.rotate = function(this1,a,origin) {
	if(origin == null) origin = new tannus_geom_TPoint(0,0,0);
	var s = Math.sin(a * 3.141592653589793 / 180);
	var c = Math.cos(a * 3.141592653589793 / 180);
	var nx = c * (this1.get_x() - origin.get_x()) - s * (this1.get_y() - origin.get_y());
	var ny = s * (this1.get_x() - origin.get_x()) + c * (this1.get_y() - origin.get_y());
	return new tannus_geom_TPoint(nx,ny,0);
};
tannus_geom__$Point_Point_$Impl_$.copyFrom = function(this1,p) {
	var nx = p.get_x();
	this1.set_x(nx);
	var ny = p.get_y();
	this1.set_y(ny);
	var nz = p.get_z();
	this1.set_z(nz);
};
tannus_geom__$Point_Point_$Impl_$.plus = function(this1,other) {
	var x = this1.get_x() + other.get_x();
	var y = this1.get_y() + other.get_y();
	var z = this1.get_z() + other.get_z();
	return new tannus_geom_TPoint(x,y,z);
};
tannus_geom__$Point_Point_$Impl_$.minus = function(this1,other) {
	var x = this1.get_x() - other.get_x();
	var y = this1.get_y() - other.get_y();
	var z = this1.get_z() - other.get_z();
	return new tannus_geom_TPoint(x,y,z);
};
tannus_geom__$Point_Point_$Impl_$.minusFloat = function(this1,n) {
	var x = this1.get_x() - n;
	var y = this1.get_y() - n;
	var z = this1.get_z() - n;
	return new tannus_geom_TPoint(x,y,z);
};
tannus_geom__$Point_Point_$Impl_$.dividePoint = function(this1,p) {
	return this1.dividePoint(p);
};
tannus_geom__$Point_Point_$Impl_$.divideFloat = function(this1,d) {
	return this1.divideFloat(d);
};
tannus_geom__$Point_Point_$Impl_$.multPoint = function(this1,p) {
	return this1.multPoint(p);
};
tannus_geom__$Point_Point_$Impl_$.multFloat = function(this1,n) {
	return this1.multFloat(n);
};
tannus_geom__$Point_Point_$Impl_$.negate = function(this1) {
	return this1.multFloat(-1);
};
tannus_geom__$Point_Point_$Impl_$.greaterThan = function(this1,other) {
	return tannus_geom__$Point_Point_$Impl_$.distanceFrom(this1,new tannus_geom_TPoint(0,0,0)) > tannus_geom__$Point_Point_$Impl_$.distanceFrom(other,new tannus_geom_TPoint(0,0,0));
};
tannus_geom__$Point_Point_$Impl_$.lessThan = function(this1,other) {
	return !(tannus_geom__$Point_Point_$Impl_$.distanceFrom(this1,new tannus_geom_TPoint(0,0,0)) > tannus_geom__$Point_Point_$Impl_$.distanceFrom(other,new tannus_geom_TPoint(0,0,0)));
};
tannus_geom__$Point_Point_$Impl_$.equals = function(this1,other) {
	return this1.get_x() == other.get_x() && this1.get_y() == other.get_y() && this1.get_z() == other.get_z();
};
tannus_geom__$Point_Point_$Impl_$.nequals = function(this1,other) {
	return !(this1.get_x() == other.get_x() && this1.get_y() == other.get_y() && this1.get_z() == other.get_z());
};
tannus_geom__$Point_Point_$Impl_$.angleTo = function(this1,other) {
	var angl = tannus_math_TMath.angleBetween(this1.get_x(),this1.get_y(),other.get_x(),other.get_y());
	return angl;
};
tannus_geom__$Point_Point_$Impl_$.clone = function(this1) {
	var x = this1.get_x();
	var y = this1.get_y();
	var z = this1.get_z();
	return new tannus_geom_TPoint(x,y,z);
};
tannus_geom__$Point_Point_$Impl_$.clamp = function(this1) {
	this1.set_x(tannus_math_TMath.i(this1.get_x()));
	this1.set_y(tannus_math_TMath.i(this1.get_y()));
	this1.set_z(tannus_math_TMath.i(this1.get_z()));
};
tannus_geom__$Point_Point_$Impl_$.vectorize = function(this1,r) {
	var x;
	var what = this1.get_x();
	x = tannus_math__$Percent_Percent_$Impl_$.percent(what,r.width);
	var y;
	var what1 = this1.get_y();
	y = tannus_math__$Percent_Percent_$Impl_$.percent(what1,r.height);
	return new tannus_geom_TPoint(x,y,0);
};
tannus_geom__$Point_Point_$Impl_$.devectorize = function(this1,r) {
	var px;
	var f = this1.get_x();
	px = f;
	var py;
	var f1 = this1.get_y();
	py = f1;
	return new tannus_geom_TPoint(r.width * (px / 100),r.height * (py / 100),0);
};
tannus_geom__$Point_Point_$Impl_$.toString = function(this1) {
	return "Point(" + this1.get_x() + ", " + this1.get_y() + ", " + this1.get_z() + ")";
};
tannus_geom__$Point_Point_$Impl_$.toArray = function(this1) {
	return [this1.get_x(),this1.get_y(),this1.get_z()];
};
tannus_geom__$Point_Point_$Impl_$.fromFloatArray = function(a) {
	var ma = a;
	return new tannus_geom_TPoint((function($this) {
		var $r;
		var this1 = ma[0];
		$r = this1 != null?this1:0;
		return $r;
	}(this)),(function($this) {
		var $r;
		var this2 = ma[1];
		$r = this2 != null?this2:0;
		return $r;
	}(this)),(function($this) {
		var $r;
		var this3 = ma[2];
		$r = this3 != null?this3:0;
		return $r;
	}(this)));
};
tannus_geom__$Point_Point_$Impl_$.fromIntArray = function(a) {
	var ma = a;
	return new tannus_geom_TPoint((function($this) {
		var $r;
		var this1 = ma[0];
		$r = this1 != null?this1:0;
		return $r;
	}(this)),(function($this) {
		var $r;
		var this2 = ma[1];
		$r = this2 != null?this2:0;
		return $r;
	}(this)),(function($this) {
		var $r;
		var this3 = ma[2];
		$r = this3 != null?this3:0;
		return $r;
	}(this)));
};
tannus_geom__$Point_Point_$Impl_$.perc = function(what,of) {
	return tannus_math__$Percent_Percent_$Impl_$.percent(what,of);
};
var tannus_geom_TPoint = function(x,y,z) {
	this._x = x;
	this._y = y;
	this._z = z;
};
$hxClasses["tannus.geom.TPoint"] = tannus_geom_TPoint;
tannus_geom_TPoint.__name__ = ["tannus","geom","TPoint"];
tannus_geom_TPoint.prototype = {
	dividePoint: function(d) {
		var x = this.get_x() / d.get_x();
		var y = this.get_y() / d.get_y();
		var z;
		if(this.get_z() != 0) z = this.get_z() / d.get_z(); else z = 0;
		return new tannus_geom_TPoint(x,y,z);
	}
	,divideFloat: function(f) {
		var x = this.get_x() / f;
		var y = this.get_y() / f;
		var z;
		if(this.get_z() != 0) z = this.get_z() / f; else z = 0;
		return new tannus_geom_TPoint(x,y,z);
	}
	,multPoint: function(p) {
		var x = this.get_x() * p.get_x();
		var y = this.get_y() * p.get_y();
		var z = this.get_z() * p.get_z();
		return new tannus_geom_TPoint(x,y,z);
	}
	,multFloat: function(n) {
		var x = this.get_x() * n;
		var y = this.get_y() * n;
		var z = this.get_z() * n;
		return new tannus_geom_TPoint(x,y,z);
	}
	,get_x: function() {
		return this._x;
	}
	,get_y: function() {
		return this._y;
	}
	,get_z: function() {
		return this._z;
	}
	,set_x: function(v) {
		return this._x = v;
	}
	,set_y: function(v) {
		return this._y = v;
	}
	,set_z: function(v) {
		return this._z = v;
	}
	,__class__: tannus_geom_TPoint
	,__properties__: {set_z:"set_z",get_z:"get_z",set_y:"set_y",get_y:"get_y",set_x:"set_x",get_x:"get_x"}
};
var tannus_geom__$Position_Position_$Impl_$ = {};
$hxClasses["tannus.geom._Position.Position_Impl_"] = tannus_geom__$Position_Position_$Impl_$;
tannus_geom__$Position_Position_$Impl_$.__name__ = ["tannus","geom","_Position","Position_Impl_"];
tannus_geom__$Position_Position_$Impl_$.__properties__ = {set_left:"set_left",get_left:"get_left",set_bottom:"set_bottom",get_bottom:"get_bottom",set_right:"set_right",get_right:"get_right",set_top:"set_top",get_top:"get_top"}
tannus_geom__$Position_Position_$Impl_$._new = function(top,right,bottom,left) {
	return [top,right,bottom,left];
};
tannus_geom__$Position_Position_$Impl_$.clone = function(this1) {
	return this1.copy();
};
tannus_geom__$Position_Position_$Impl_$.get_top = function(this1) {
	return this1[0];
};
tannus_geom__$Position_Position_$Impl_$.set_top = function(this1,v) {
	return this1[0] = v;
};
tannus_geom__$Position_Position_$Impl_$.get_right = function(this1) {
	return this1[1];
};
tannus_geom__$Position_Position_$Impl_$.set_right = function(this1,v) {
	return this1[1] = v;
};
tannus_geom__$Position_Position_$Impl_$.get_bottom = function(this1) {
	return this1[2];
};
tannus_geom__$Position_Position_$Impl_$.set_bottom = function(this1,v) {
	return this1[2] = v;
};
tannus_geom__$Position_Position_$Impl_$.get_left = function(this1) {
	return this1[3];
};
tannus_geom__$Position_Position_$Impl_$.set_left = function(this1,v) {
	return this1[3] = v;
};
var tannus_geom__$Rectangle_Rectangle_$Impl_$ = {};
$hxClasses["tannus.geom._Rectangle.Rectangle_Impl_"] = tannus_geom__$Rectangle_Rectangle_$Impl_$;
tannus_geom__$Rectangle_Rectangle_$Impl_$.__name__ = ["tannus","geom","_Rectangle","Rectangle_Impl_"];
tannus_geom__$Rectangle_Rectangle_$Impl_$._new = function(_x,_y,_width,_height) {
	if(_height == null) _height = 0;
	if(_width == null) _width = 0;
	if(_y == null) _y = 0;
	if(_x == null) _x = 0;
	return new tannus_geom_CRectangle(_x,_y,_width,_height);
};
tannus_geom__$Rectangle_Rectangle_$Impl_$.eq = function(this1,o) {
	return this1.equals(o);
};
tannus_geom__$Rectangle_Rectangle_$Impl_$.floatDiv = function(this1,o) {
	return this1.divide(tannus_ds__$EitherType_EitherType_$Impl_$.fromL(o));
};
tannus_geom__$Rectangle_Rectangle_$Impl_$.rectDiv = function(this1,r) {
	return this1.divide((function($this) {
		var $r;
		var e = tannus_ds_Either.Right(r);
		$r = e;
		return $r;
	}(this)));
};
tannus_geom__$Rectangle_Rectangle_$Impl_$.fromArray = function(a) {
	return new tannus_geom_CRectangle(a[0],a[1],a[2],a[3]);
};
var tannus_geom_Shape = function() { };
$hxClasses["tannus.geom.Shape"] = tannus_geom_Shape;
tannus_geom_Shape.__name__ = ["tannus","geom","Shape"];
tannus_geom_Shape.prototype = {
	__class__: tannus_geom_Shape
};
var tannus_geom_CRectangle = function(_x,_y,_width,_height) {
	if(_height == null) _height = 0;
	if(_width == null) _width = 0;
	if(_y == null) _y = 0;
	if(_x == null) _x = 0;
	this.x = _x;
	this.y = _y;
	this.z = 0;
	this.width = _width;
	this.height = _height;
	this.depth = 0;
};
$hxClasses["tannus.geom.CRectangle"] = tannus_geom_CRectangle;
tannus_geom_CRectangle.__name__ = ["tannus","geom","CRectangle"];
tannus_geom_CRectangle.__interfaces__ = [tannus_geom_Shape];
tannus_geom_CRectangle.perc = function(what,of) {
	return tannus_math__$Percent_Percent_$Impl_$.percent(what,of);
};
tannus_geom_CRectangle.prototype = {
	clone: function() {
		var r = new tannus_geom_CRectangle(this.x,this.y,this.width,this.height);
		r.z = this.z;
		r.depth = this.depth;
		return r;
	}
	,cloneFrom: function(other) {
		this.x = other.x;
		this.y = other.y;
		this.z = other.z;
		this.width = other.width;
		this.height = other.height;
		this.depth = other.depth;
	}
	,equals: function(other) {
		return this.x == other.x && this.y == other.y && this.z == other.z && this.width == other.width && this.height == other.height && this.depth == other.depth;
	}
	,divide: function(div) {
		{
			var _g = div;
			switch(_g[1]) {
			case 0:
				var f = _g[2];
				return new tannus_geom_CRectangle(this.x,this.y,this.width / f,this.height / f);
			case 1:
				var r = _g[2];
				return new tannus_geom_CRectangle(this.x,this.y,this.width / r.width,this.height / r.height);
			}
		}
	}
	,contains: function(ox,oy) {
		return ox > this.x && ox < this.x + this.width && (oy > this.y && oy < this.y + this.height);
	}
	,containsPoint: function(point) {
		return this.contains(point.get_x(),point.get_y());
	}
	,containsRect: function(o) {
		var _g = 0;
		var _g1 = o.get_corners();
		while(_g < _g1.length) {
			var p = _g1[_g];
			++_g;
			if(this.contains(p.get_x(),p.get_y())) return true;
		}
		return false;
	}
	,vectorize: function(r) {
		var pos;
		var this1 = new tannus_geom_TPoint(this.x,this.y,0);
		var x;
		var what = this1.get_x();
		x = tannus_math__$Percent_Percent_$Impl_$.percent(what,r.width);
		var y;
		var what1 = this1.get_y();
		y = tannus_math__$Percent_Percent_$Impl_$.percent(what1,r.height);
		pos = new tannus_geom_TPoint(x,y,0);
		var dim;
		var w = tannus_math__$Percent_Percent_$Impl_$.percent(this.width,r.width);
		var h = tannus_math__$Percent_Percent_$Impl_$.percent(this.height,r.height);
		dim = [w,h];
		var _x = pos.get_x();
		var _y = pos.get_y();
		return new tannus_geom_CRectangle(_x,_y,dim[0],dim[1]);
	}
	,devectorize: function(r) {
		var px = this.x;
		var py = this.y;
		var pw = this.width;
		var ph = this.height;
		return new tannus_geom_CRectangle(r.width * (px / 100),r.height * (py / 100),r.width * (pw / 100),r.height * (ph / 100));
	}
	,getVertices: function() {
		var self = this;
		var verts;
		var v = [new tannus_geom_TPoint(self.x,self.y,0),new tannus_geom_TPoint(self.x + self.width,self.y,0),new tannus_geom_TPoint(self.x + self.width,self.y + self.height,0),new tannus_geom_TPoint(self.x,self.y + self.height,0)];
		verts = new tannus_geom_VertexArray(v);
		return verts;
	}
	,toString: function() {
		return "Rectangle(" + this.x + ", " + this.y + ", " + this.width + ", " + this.height + ")";
	}
	,get_position: function() {
		return new tannus_geom_TPoint(this.x,this.y,this.z);
	}
	,set_position: function(np) {
		this.x = np.get_x();
		this.y = np.get_y();
		this.z = np.get_z();
		return new tannus_geom_TPoint(this.x,this.y,this.z);
	}
	,get_corners: function() {
		return [new tannus_geom_TPoint(this.x,this.y,0),new tannus_geom_TPoint(this.x + this.width,this.y,0),new tannus_geom_TPoint(this.x,this.y + this.height,0),new tannus_geom_TPoint(this.x + this.width,this.y + this.height,0)];
	}
	,get_area: function() {
		return this.width * this.height;
	}
	,get_center: function() {
		return new tannus_geom_TPoint(this.x + this.width / 2,this.y + this.height / 2,0);
	}
	,set_center: function(nc) {
		this.x = nc.get_x() - this.width / 2;
		this.y = nc.get_y() - this.height / 2;
		return nc;
	}
	,get_topRight: function() {
		return new tannus_geom_TPoint(this.x + this.width,this.y,0);
	}
	,get_topLeft: function() {
		return new tannus_geom_TPoint(this.x,this.y,0);
	}
	,get_bottomLeft: function() {
		return new tannus_geom_TPoint(this.x,this.y + this.height,0);
	}
	,get_bottomRight: function() {
		return new tannus_geom_TPoint(this.x + this.width,this.y + this.height,0);
	}
	,get_w: function() {
		return this.width;
	}
	,set_w: function(nw) {
		return this.width = nw;
	}
	,get_h: function() {
		return this.height;
	}
	,set_h: function(nh) {
		return this.height = nh;
	}
	,get_d: function() {
		return this.depth;
	}
	,set_d: function(nd) {
		return this.depth = nd;
	}
	,__class__: tannus_geom_CRectangle
	,__properties__: {set_d:"set_d",get_d:"get_d",set_h:"set_h",get_h:"get_h",set_w:"set_w",get_w:"get_w",get_bottomRight:"get_bottomRight",get_bottomLeft:"get_bottomLeft",get_topLeft:"get_topLeft",get_topRight:"get_topRight",set_center:"set_center",get_center:"get_center",get_area:"get_area",get_corners:"get_corners",set_position:"set_position",get_position:"get_position"}
};
var tannus_geom__$Velocity_Velocity_$Impl_$ = {};
$hxClasses["tannus.geom._Velocity.Velocity_Impl_"] = tannus_geom__$Velocity_Velocity_$Impl_$;
tannus_geom__$Velocity_Velocity_$Impl_$.__name__ = ["tannus","geom","_Velocity","Velocity_Impl_"];
tannus_geom__$Velocity_Velocity_$Impl_$.__properties__ = {set_vector:"set_vector",get_vector:"get_vector",set_y:"set_y",get_y:"get_y",set_x:"set_x",get_x:"get_x",set_angle:"set_angle",get_angle:"get_angle",set_speed:"set_speed",get_speed:"get_speed"}
tannus_geom__$Velocity_Velocity_$Impl_$._new = function(speed,angle) {
	return [speed,angle];
};
tannus_geom__$Velocity_Velocity_$Impl_$.setVector = function(this1,vx,vy) {
	var e = new tannus_geom_TPoint(vx,vy,0);
	var l = new tannus_geom_Line(tannus_geom__$Point_Point_$Impl_$.fromIntArray([0,0]),e);
	var ns = tannus_geom__$Point_Point_$Impl_$.distanceFrom(l.one,l.two);
	this1[0] = ns;
	var ns1 = tannus_math_TMath.angleBetween(0.0,0.0,e.get_x(),e.get_y());
	this1[1] = ns1;
};
tannus_geom__$Velocity_Velocity_$Impl_$.clone = function(this1) {
	return [this1[0],this1[1]];
};
tannus_geom__$Velocity_Velocity_$Impl_$.inverted = function(this1) {
	return tannus_geom__$Velocity_Velocity_$Impl_$.fromVector(Math.cos(this1[1] * 3.141592653589793 / 180) * this1[0] * -1,Math.sin(this1[1] * 3.141592653589793 / 180) * this1[0] * -1);
};
tannus_geom__$Velocity_Velocity_$Impl_$.plus = function(this1,that) {
	var vec = tannus_geom__$Point_Point_$Impl_$.plus((function($this) {
		var $r;
		var x = Math.cos(this1[1] * 3.141592653589793 / 180) * this1[0];
		var y = Math.sin(this1[1] * 3.141592653589793 / 180) * this1[0];
		$r = new tannus_geom_TPoint(x,y,0);
		return $r;
	}(this)),(function($this) {
		var $r;
		var x1 = Math.cos(that[1] * 3.141592653589793 / 180) * that[0];
		var y1 = Math.sin(that[1] * 3.141592653589793 / 180) * that[0];
		$r = new tannus_geom_TPoint(x1,y1,0);
		return $r;
	}(this)));
	return tannus_geom__$Velocity_Velocity_$Impl_$.fromVector(vec.get_x(),vec.get_y());
};
tannus_geom__$Velocity_Velocity_$Impl_$.minus = function(this1,that) {
	var vec = tannus_geom__$Point_Point_$Impl_$.minus((function($this) {
		var $r;
		var x = Math.cos(this1[1] * 3.141592653589793 / 180) * this1[0];
		var y = Math.sin(this1[1] * 3.141592653589793 / 180) * this1[0];
		$r = new tannus_geom_TPoint(x,y,0);
		return $r;
	}(this)),(function($this) {
		var $r;
		var x1 = Math.cos(that[1] * 3.141592653589793 / 180) * that[0];
		var y1 = Math.sin(that[1] * 3.141592653589793 / 180) * that[0];
		$r = new tannus_geom_TPoint(x1,y1,0);
		return $r;
	}(this)));
	return tannus_geom__$Velocity_Velocity_$Impl_$.fromVector(vec.get_x(),vec.get_y());
};
tannus_geom__$Velocity_Velocity_$Impl_$.get_speed = function(this1) {
	return this1[0];
};
tannus_geom__$Velocity_Velocity_$Impl_$.set_speed = function(this1,ns) {
	return this1[0] = ns;
};
tannus_geom__$Velocity_Velocity_$Impl_$.get_angle = function(this1) {
	return this1[1];
};
tannus_geom__$Velocity_Velocity_$Impl_$.set_angle = function(this1,ns) {
	return this1[1] = ns;
};
tannus_geom__$Velocity_Velocity_$Impl_$.get_x = function(this1) {
	return Math.cos(this1[1] * 3.141592653589793 / 180) * this1[0];
};
tannus_geom__$Velocity_Velocity_$Impl_$.set_x = function(this1,nx) {
	tannus_geom__$Velocity_Velocity_$Impl_$.setVector(this1,nx,Math.sin(this1[1] * 3.141592653589793 / 180) * this1[0]);
	return nx;
};
tannus_geom__$Velocity_Velocity_$Impl_$.get_y = function(this1) {
	return Math.sin(this1[1] * 3.141592653589793 / 180) * this1[0];
};
tannus_geom__$Velocity_Velocity_$Impl_$.set_y = function(this1,ny) {
	tannus_geom__$Velocity_Velocity_$Impl_$.setVector(this1,Math.cos(this1[1] * 3.141592653589793 / 180) * this1[0],ny);
	return ny;
};
tannus_geom__$Velocity_Velocity_$Impl_$.get_vector = function(this1) {
	var x = Math.cos(this1[1] * 3.141592653589793 / 180) * this1[0];
	var y = Math.sin(this1[1] * 3.141592653589793 / 180) * this1[0];
	return new tannus_geom_TPoint(x,y,0);
};
tannus_geom__$Velocity_Velocity_$Impl_$.set_vector = function(this1,nv) {
	tannus_geom__$Velocity_Velocity_$Impl_$.setVector(this1,nv.get_x(),nv.get_y());
	var x = Math.cos(this1[1] * 3.141592653589793 / 180) * this1[0];
	var y = Math.sin(this1[1] * 3.141592653589793 / 180) * this1[0];
	return new tannus_geom_TPoint(x,y,0);
};
tannus_geom__$Velocity_Velocity_$Impl_$.fromVector = function(x,y) {
	var v = [0,0];
	tannus_geom__$Velocity_Velocity_$Impl_$.set_vector(v,new tannus_geom_TPoint(x,y,0));
	return v;
};
var tannus_geom_VertexArray = function(v) {
	if(v != null) {
		var _g = [];
		var _g1 = 0;
		while(_g1 < v.length) {
			var p = v[_g1];
			++_g1;
			_g.push(this.toImmutable(p));
		}
		this.data = _g;
	} else this.data = [];
	this._lines = new tannus_ds_CPair(null,null);
	this._rect = null;
};
$hxClasses["tannus.geom.VertexArray"] = tannus_geom_VertexArray;
tannus_geom_VertexArray.__name__ = ["tannus","geom","VertexArray"];
tannus_geom_VertexArray.prototype = {
	resetCache: function() {
		this._lines = new tannus_ds_CPair(null,null);
		this._rect = null;
	}
	,get: function(i) {
		return this.data[i];
	}
	,set: function(i,p) {
		this.data[i] = this.toImmutable(p);
		this.resetCache();
		return this.get(i);
	}
	,toImmutable: function(p) {
		if(!js_Boot.__instanceof(p,tannus_geom_ImmutablePoint)) {
			var np = new tannus_geom_ImmutablePoint(p.get_x(),p.get_y(),p.get_z());
			return np;
		} else {
			var x = p.get_x();
			var y = p.get_y();
			var z = p.get_z();
			return new tannus_geom_TPoint(x,y,z);
		}
	}
	,toMutable: function(p) {
		if(js_Boot.__instanceof(p,tannus_geom_ImmutablePoint)) {
			var np = new tannus_geom_TPoint(0,0,0);
			var nx = p.get_x();
			np.set_x(nx);
			var ny = p.get_y();
			np.set_y(ny);
			var nz = p.get_z();
			np.set_z(nz);
			return np;
		} else return p;
	}
	,iterator: function() {
		return new tannus_geom_VerticeIterator(this);
	}
	,push: function(p) {
		this.resetCache();
		return this.data.push(this.toImmutable(p));
	}
	,pop: function() {
		this.resetCache();
		return this.data.pop();
	}
	,unshift: function(p) {
		this.resetCache();
		this.data.unshift(this.toImmutable(p));
		return this.data.length;
	}
	,shift: function() {
		this.resetCache();
		return this.data.shift();
	}
	,clone: function() {
		return new tannus_geom_VertexArray(this.data);
	}
	,calculateLines: function(close) {
		if(close == null) close = false;
		var cached;
		if(close) cached = this._lines.right; else cached = this._lines.left;
		if(cached != null) return cached; else {
			var lines = [];
			var i = 0;
			var last = null;
			while(i < this.data.length) {
				var start = this.data[i];
				if(last == null) last = start; else {
					lines.push(new tannus_geom_Line(last,start));
					last = start;
				}
				i++;
			}
			if(close) {
				lines.push(new tannus_geom_Line(tannus_ds_ArrayTools.last(this.data),this.data[0]));
				this._lines.right = lines;
			} else this._lines.left = lines;
			return lines;
		}
	}
	,lineStack: function(close) {
		if(close == null) close = false;
		return new tannus_ds_Stack(this.calculateLines(close));
	}
	,pointStack: function() {
		var rdat = this.data.slice();
		rdat.reverse();
		return new tannus_ds_Stack(rdat);
	}
	,simplify: function(threshold) {
		if(threshold == null) threshold = 2;
		var s = this.pointStack();
		var ndata = [];
		var pass = (function(f) {
			return function(x) {
				return f(x);
			};
		})($arrayPushClosure(ndata));
		while(!s.get_empty()) {
			var x1 = s.pop();
			var y = s.peek();
			if(Math.round(tannus_geom__$Point_Point_$Impl_$.distanceFrom(x1,y)) < threshold) s.add(y); else pass(x1);
		}
		if(this.data.length != ndata.length) {
			this.data = ndata;
			this.resetCache();
		}
	}
	,each: function(f) {
		var points = this.pointStack();
		while(!points.get_empty()) {
			var ip = points.peek();
			var p = this.toMutable(points.pop());
			f(p);
			(js_Boot.__cast(ip , tannus_geom_ImmutablePoint)).write(p);
		}
		this.resetCache();
	}
	,apply: function(m) {
		this.each($bind(m,m.transformPoint));
	}
	,map: function(f) {
		return new tannus_geom_VertexArray(this.data.map(f));
	}
	,getContainingRect: function() {
		if(this._rect == null) {
			var xr = tannus_math_TMath.minmax(this.data,function(p) {
				return p.get_x();
			});
			var yr = tannus_math_TMath.minmax(this.data,function(p1) {
				return p1.get_y();
			});
			this._rect = new tannus_geom_CRectangle(xr.min,yr.min,xr.max - xr.min,yr.max - yr.min);
		}
		return this._rect;
	}
	,get_length: function() {
		return this.data.length;
	}
	,get_lines: function() {
		return this.calculateLines(true);
	}
	,get_rect: function() {
		return this.getContainingRect();
	}
	,get_first: function() {
		return this.get(0);
	}
	,get_last: function() {
		return this.get(this.data.length - 1);
	}
	,__class__: tannus_geom_VertexArray
	,__properties__: {get_last:"get_last",get_first:"get_first",get_rect:"get_rect",get_lines:"get_lines",get_length:"get_length"}
};
var tannus_geom_VerticeIterator = function(va) {
	this.array = va;
	this.iter = new IntIterator(0,this.array.data.length);
};
$hxClasses["tannus.geom.VerticeIterator"] = tannus_geom_VerticeIterator;
tannus_geom_VerticeIterator.__name__ = ["tannus","geom","VerticeIterator"];
tannus_geom_VerticeIterator.prototype = {
	hasNext: function() {
		return this.iter.hasNext();
	}
	,next: function() {
		return this.array.get(this.iter.min++);
	}
	,__class__: tannus_geom_VerticeIterator
};
var tannus_geom_ImmutablePoint = function(x,y,z) {
	tannus_geom_TPoint.call(this,x,y,z);
};
$hxClasses["tannus.geom.ImmutablePoint"] = tannus_geom_ImmutablePoint;
tannus_geom_ImmutablePoint.__name__ = ["tannus","geom","ImmutablePoint"];
tannus_geom_ImmutablePoint.__super__ = tannus_geom_TPoint;
tannus_geom_ImmutablePoint.prototype = $extend(tannus_geom_TPoint.prototype,{
	set_x: function(v) {
		return v;
	}
	,set_y: function(v) {
		return v;
	}
	,set_z: function(v) {
		return v;
	}
	,write: function(p) {
		this._x = p.get_x();
		this._y = p.get_y();
		this._z = p.get_z();
	}
	,__class__: tannus_geom_ImmutablePoint
});
var tannus_geom__$Vertices_Vertices_$Impl_$ = {};
$hxClasses["tannus.geom._Vertices.Vertices_Impl_"] = tannus_geom__$Vertices_Vertices_$Impl_$;
tannus_geom__$Vertices_Vertices_$Impl_$.__name__ = ["tannus","geom","_Vertices","Vertices_Impl_"];
tannus_geom__$Vertices_Vertices_$Impl_$._new = function(v) {
	return new tannus_geom_VertexArray(v);
};
tannus_geom__$Vertices_Vertices_$Impl_$.clone = function(this1) {
	return this1.clone();
};
tannus_geom__$Vertices_Vertices_$Impl_$.map = function(this1,f) {
	return this1.map(f);
};
tannus_geom__$Vertices_Vertices_$Impl_$.get = function(this1,i) {
	return this1.get(i);
};
tannus_geom__$Vertices_Vertices_$Impl_$.set = function(this1,i,p) {
	return this1.set(i,p);
};
tannus_geom__$Vertices_Vertices_$Impl_$.toPoints = function(this1) {
	var _g = [];
	var $it0 = this1.iterator();
	while( $it0.hasNext() ) {
		var p = $it0.next();
		_g.push((function($this) {
			var $r;
			var x = p.get_x();
			var y = p.get_y();
			var z = p.get_z();
			$r = new tannus_geom_TPoint(x,y,z);
			return $r;
		}(this)));
	}
	return _g;
};
tannus_geom__$Vertices_Vertices_$Impl_$.fromPoints = function(list) {
	return new tannus_geom_VertexArray(list);
};
tannus_geom__$Vertices_Vertices_$Impl_$.toLines = function(this1) {
	return this1.calculateLines(true);
};
tannus_geom__$Vertices_Vertices_$Impl_$.fromLines = function(lines) {
	var v = tannus_ds_ArrayTools.flatten((function($this) {
		var $r;
		var _g = [];
		{
			var _g1 = 0;
			while(_g1 < lines.length) {
				var l = lines[_g1];
				++_g1;
				_g.push([l.one,l.two]);
			}
		}
		$r = _g;
		return $r;
	}(this)));
	return new tannus_geom_VertexArray(v);
};
tannus_geom__$Vertices_Vertices_$Impl_$.fromShape = function(s) {
	return s.getVertices();
};
var tannus_graphics__$Color_Color_$Impl_$ = {};
$hxClasses["tannus.graphics._Color.Color_Impl_"] = tannus_graphics__$Color_Color_$Impl_$;
tannus_graphics__$Color_Color_$Impl_$.__name__ = ["tannus","graphics","_Color","Color_Impl_"];
tannus_graphics__$Color_Color_$Impl_$._new = function(r,g,b,a) {
	if(b == null) b = 0;
	if(g == null) g = 0;
	if(r == null) r = 0;
	return new tannus_graphics__$Color_TColor(r,g,b,a);
};
tannus_graphics__$Color_Color_$Impl_$.clone = function(this1) {
	return this1.clone();
};
tannus_graphics__$Color_Color_$Impl_$.equals = function(this1,other) {
	return this1.equals(other);
};
tannus_graphics__$Color_Color_$Impl_$.invert = function(this1) {
	return this1.invert();
};
tannus_graphics__$Color_Color_$Impl_$.mix = function(this1,other,ratio) {
	return this1.mix(other,ratio);
};
tannus_graphics__$Color_Color_$Impl_$.lighten = function(this1,amount) {
	return this1.lighten(amount);
};
tannus_graphics__$Color_Color_$Impl_$.darken = function(this1,amount) {
	return this1.darken(amount);
};
tannus_graphics__$Color_Color_$Impl_$.toString = function(this1) {
	return this1.toString();
};
tannus_graphics__$Color_Color_$Impl_$.toByteArray = function(this1) {
	{
		var s = this1.toString();
		var ba = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
		tannus_io__$ByteArray_ByteArray_$Impl_$.writeString(ba,s);
		return ba;
	}
};
tannus_graphics__$Color_Color_$Impl_$.toInt = function(this1) {
	return this1.toInt();
};
tannus_graphics__$Color_Color_$Impl_$.fromString = function(s) {
	return tannus_graphics__$Color_TColor.fromString(s);
};
var tannus_graphics__$Color_TColor = function(r,g,b,a) {
	if(b == null) b = 0;
	if(g == null) g = 0;
	if(r == null) r = 0;
	if(r < 0) this._red = 0; else if(r > 255) this._red = 255; else this._red = r;
	if(g < 0) this._green = 0; else if(g > 255) this._green = 255; else this._green = g;
	if(b < 0) this._blue = 0; else if(b > 255) this._blue = 255; else this._blue = b;
	if(a != null) {
		if(a < 0) this._alpha = 0; else if(a > 255) this._alpha = 255; else this._alpha = a;
	} else this._alpha = null;
};
$hxClasses["tannus.graphics._Color.TColor"] = tannus_graphics__$Color_TColor;
tannus_graphics__$Color_TColor.__name__ = ["tannus","graphics","_Color","TColor"];
tannus_graphics__$Color_TColor.fromString = function(_s) {
	if(StringTools.startsWith(_s,"#")) {
		var s = StringTools.replace(_s,"#","");
		var _g = s.length;
		switch(_g) {
		case 6:
			var parts = [];
			var chars = s.split("");
			parts.push(chars.shift() + chars.shift());
			parts.push(chars.shift() + chars.shift());
			parts.push(chars.shift() + chars.shift());
			var channels = [];
			var _g1 = 0;
			while(_g1 < parts.length) {
				var part = parts[_g1];
				++_g1;
				var channel = Std.parseInt("0x" + part);
				channels.push(channel);
			}
			return new tannus_graphics__$Color_TColor(channels[0],channels[1],channels[2]);
		case 3:
			var parts1 = [];
			var chars1 = s.split("");
			parts1.push(chars1.shift());
			parts1.push(chars1.shift());
			parts1.push(chars1.shift());
			parts1 = parts1.map(function(c) {
				return c + c;
			});
			var channels1 = [];
			var _g11 = 0;
			while(_g11 < parts1.length) {
				var part1 = parts1[_g11];
				++_g11;
				var channel1 = Std.parseInt("0x" + part1);
				channels1.push(channel1);
			}
			return new tannus_graphics__$Color_TColor(channels1[0],channels1[1],channels1[2]);
		default:
			throw new js__$Boot_HaxeError("ColorError: Cannot create Color from \"" + s + "\"!");
		}
	} else {
		var s1 = _s;
		var rgb = new EReg("rgb\\( ?([0-9]+), ?([0-9]+), ?([0-9]+) ?\\)","i");
		var rgba = new EReg("rgba\\( ?([0-9]+), ?([0-9]+), ?([0-9]+), ?([0-9]+) ?\\)","i");
		if(rgb.match(s1)) {
			var data = tannus_io__$RegEx_RegEx_$Impl_$.matches(rgb,s1)[0];
			console.log(data);
			var i = (function(f) {
				return function(x) {
					return f(x);
				};
			})(Std.parseInt);
			return new tannus_graphics__$Color_TColor(i(data[1]),i(data[2]),i(data[3]));
		} else if(rgba.match(s1)) {
			var data1 = tannus_io__$RegEx_RegEx_$Impl_$.matches(rgba,s1)[0];
			console.log(data1);
			var i1 = (function(f1) {
				return function(x1) {
					return f1(x1);
				};
			})(Std.parseInt);
			return new tannus_graphics__$Color_TColor(i1(data1[1]),i1(data1[2]),i1(data1[3]),i1(data1[4]));
		} else throw new js__$Boot_HaxeError("ColorError: Cannot create Color from \"" + s1 + "\"!");
	}
};
tannus_graphics__$Color_TColor.fromInt = function(color) {
	return new tannus_graphics__$Color_TColor(color >> 16 & 255,color >> 8 & 255,color & 255,null);
};
tannus_graphics__$Color_TColor.hex = function(val,digits) {
	return StringTools.hex(val,digits);
};
tannus_graphics__$Color_TColor.prototype = {
	clone: function() {
		return new tannus_graphics__$Color_TColor(this._red,this._green,this._blue,this._alpha);
	}
	,equals: function(other) {
		return this._red == other._red && this._green == other._green && this._blue == other._blue && this._alpha == other._alpha;
	}
	,mix: function(t,weight) {
		var ratio = weight / 100;
		return new tannus_graphics__$Color_TColor(this._red + (t._red - this._red) * ratio | 0,this._green + (t._green - this._green) * ratio | 0,this._blue + (t._blue - this._blue) * ratio | 0,this._alpha + (t._alpha - this._alpha) * ratio | 0);
	}
	,toString: function() {
		if(this._alpha == null) {
			var out = "#";
			out += tannus_graphics__$Color_TColor.hex(this._red,2);
			out += tannus_graphics__$Color_TColor.hex(this._green,2);
			out += tannus_graphics__$Color_TColor.hex(this._blue,2);
			return out;
		} else {
			var out1 = "rgba(" + this._red + ", " + this._green + ", " + this._blue + ", " + tannus_math_TMath.roundFloat((function($this) {
				var $r;
				var this1 = tannus_math__$Percent_Percent_$Impl_$.percent($this._alpha,255);
				$r = this1;
				return $r;
			}(this)) / 100,2) + ")";
			return out1;
		}
	}
	,toInt: function() {
		if(this._alpha == null) return Math.round(this._red) << 16 | Math.round(this._green) << 8 | Math.round(this._blue); else return Math.round(this._red) << 16 | Math.round(this._green) << 8 | Math.round(this._blue) | Math.round(this._alpha) << 24;
	}
	,lighten: function(amount) {
		var col = this.clone();
		var red = col._red * (100 + amount) / 100 | 0;
		var green = col._green * (100 + amount) / 100 | 0;
		var blue = col._blue * (100 + amount) / 100 | 0;
		if(red < 0) col._red = 0; else if(red > 255) col._red = 255; else col._red = red;
		if(green < 0) col._green = 0; else if(green > 255) col._green = 255; else col._green = green;
		if(blue < 0) col._blue = 0; else if(blue > 255) col._blue = 255; else col._blue = blue;
		return col;
	}
	,darken: function(amount) {
		return this.lighten(0 - amount);
	}
	,invert: function() {
		return new tannus_graphics__$Color_TColor(255 - this._red,255 - this._green,255 - this._blue,this._alpha);
	}
	,get_red: function() {
		return this._red;
	}
	,set_red: function(v) {
		return v < 0?this._red = 0:v > 255?this._red = 255:this._red = v;
	}
	,get_green: function() {
		return this._green;
	}
	,set_green: function(v) {
		return v < 0?this._green = 0:v > 255?this._green = 255:this._green = v;
	}
	,get_blue: function() {
		return this._blue;
	}
	,set_blue: function(v) {
		return v < 0?this._blue = 0:v > 255?this._blue = 255:this._blue = v;
	}
	,get_alpha: function() {
		return this._alpha;
	}
	,set_alpha: function(v) {
		return v != null?v < 0?this._alpha = 0:v > 255?this._alpha = 255:this._alpha = v:this._alpha = null;
	}
	,__class__: tannus_graphics__$Color_TColor
	,__properties__: {set_alpha:"set_alpha",get_alpha:"get_alpha",set_blue:"set_blue",get_blue:"get_blue",set_green:"set_green",get_green:"get_green",set_red:"set_red",get_red:"get_red"}
};
var tannus_html__$ElAttributes_ElAttributes_$Impl_$ = {};
$hxClasses["tannus.html._ElAttributes.ElAttributes_Impl_"] = tannus_html__$ElAttributes_ElAttributes_$Impl_$;
tannus_html__$ElAttributes_ElAttributes_$Impl_$.__name__ = ["tannus","html","_ElAttributes","ElAttributes_Impl_"];
tannus_html__$ElAttributes_ElAttributes_$Impl_$.__properties__ = {get_el:"get_el",get_elem:"get_elem"}
tannus_html__$ElAttributes_ElAttributes_$Impl_$._new = function(ref) {
	return ref;
};
tannus_html__$ElAttributes_ElAttributes_$Impl_$.getAttribute = function(this1,name) {
	return this1().attr(name);
};
tannus_html__$ElAttributes_ElAttributes_$Impl_$.setAttribute = function(this1,name,value) {
	this1().attr(name,Std.string(value));
	return tannus_html__$ElAttributes_ElAttributes_$Impl_$.getAttribute(this1,name);
};
tannus_html__$ElAttributes_ElAttributes_$Impl_$.writeObject = function(this1,o) {
	var _g = 0;
	var _g1;
	var this2 = o;
	_g1 = Reflect.fields(this2).map(function(k) {
		return { 'name' : k, 'value' : Reflect.getProperty(this2,k)};
	});
	while(_g < _g1.length) {
		var p = _g1[_g];
		++_g;
		var this3 = this1();
		var value = Std.string(p.value);
		this3.attr(p.name,value);
		value;
	}
};
tannus_html__$ElAttributes_ElAttributes_$Impl_$.toObject = function(this1) {
	var o = { };
	var list;
	list = ((function($this) {
		var $r;
		var this2 = this1();
		$r = this2.get(0);
		return $r;
	}(this))).attributes;
	var _g1 = 0;
	var _g = list.length;
	while(_g1 < _g) {
		var i = _g1++;
		var p = list.item(i);
		var key = p.name;
		Reflect.setProperty(o,key,p.value);
		Reflect.getProperty(o,key);
	}
	return o;
};
tannus_html__$ElAttributes_ElAttributes_$Impl_$.toDict = function(this1) {
	var d = new tannus_ds_CDict();
	var list;
	list = ((function($this) {
		var $r;
		var this2 = this1();
		$r = this2.get(0);
		return $r;
	}(this))).attributes;
	var _g1 = 0;
	var _g = list.length;
	while(_g1 < _g) {
		var i = _g1++;
		var p = list.item(i);
		d.setByKey(p.name,p.value);
	}
	return d;
};
tannus_html__$ElAttributes_ElAttributes_$Impl_$.get_elem = function(this1) {
	return this1();
};
tannus_html__$ElAttributes_ElAttributes_$Impl_$.get_el = function(this1) {
	var this2 = this1();
	return this2.get(0);
};
var tannus_html__$ElStyles_ElStyles_$Impl_$ = {};
$hxClasses["tannus.html._ElStyles.ElStyles_Impl_"] = tannus_html__$ElStyles_ElStyles_$Impl_$;
tannus_html__$ElStyles_ElStyles_$Impl_$.__name__ = ["tannus","html","_ElStyles","ElStyles_Impl_"];
tannus_html__$ElStyles_ElStyles_$Impl_$._new = function(af) {
	return af;
};
tannus_html__$ElStyles_ElStyles_$Impl_$.get = function(this1,key) {
	return this1([key]);
};
tannus_html__$ElStyles_ElStyles_$Impl_$.set = function(this1,key,val) {
	this1([key,Std.string(val)]);
	return this1([key]);
};
tannus_html__$ElStyles_ElStyles_$Impl_$.copy = function(this1,other,keys) {
	var _g = 0;
	while(_g < keys.length) {
		var k = keys[_g];
		++_g;
		var val = other([k]);
		this1([k,Std.string(val)]);
		this1([k]);
	}
};
tannus_html__$ElStyles_ElStyles_$Impl_$.reference = function(this1,key) {
	var s = this1;
	return new tannus_io__$Pointer_Ref(function() {
		return s([key]);
	},function(v) {
		s([key,v == null?"null":"" + v]);
		return s([key]);
	});
};
tannus_html__$ElStyles_ElStyles_$Impl_$.gets = function(this1,keys) {
	var o = { };
	var _g = 0;
	while(_g < keys.length) {
		var k = keys[_g];
		++_g;
		var value = this1([k]);
		Reflect.setProperty(o,k,value);
		Reflect.getProperty(o,k);
	}
	return o;
};
tannus_html__$ElStyles_ElStyles_$Impl_$.writeObject = function(this1,o) {
	var _g = 0;
	var _g1;
	var this2 = o;
	_g1 = Reflect.fields(this2).map(function(k) {
		return { 'name' : k, 'value' : Reflect.getProperty(this2,k)};
	});
	while(_g < _g1.length) {
		var p = _g1[_g];
		++_g;
		var key = p.name;
		this1([key,Std.string(Std.string(p.value))]);
		this1([key]);
	}
};
var tannus_html__$Element_Element_$Impl_$ = {};
$hxClasses["tannus.html._Element.Element_Impl_"] = tannus_html__$Element_Element_$Impl_$;
tannus_html__$Element_Element_$Impl_$.__name__ = ["tannus","html","_Element","Element_Impl_"];
tannus_html__$Element_Element_$Impl_$.__properties__ = {set_position:"set_position",get_position:"get_position",set_rectangle:"set_rectangle",get_rectangle:"get_rectangle",set_h:"set_h",get_h:"get_h",set_w:"set_w",get_w:"get_w",set_z:"set_z",get_z:"get_z",set_y:"set_y",get_y:"get_y",set_x:"set_x",get_x:"get_x",set_classes:"set_classes",get_classes:"get_classes",get_attributes:"get_attributes",get_style:"get_style",set_text:"set_text",get_text:"get_text",get_removed:"get_removed",get_exists:"get_exists",get_self:"get_self"}
tannus_html__$Element_Element_$Impl_$._new = function(jq) {
	return js.JQuery(jq);
};
tannus_html__$Element_Element_$Impl_$.get_self = function(this1) {
	return js.JQuery(this1);
};
tannus_html__$Element_Element_$Impl_$.get_exists = function(this1) {
	return this1.length > 0;
};
tannus_html__$Element_Element_$Impl_$.get_removed = function(this1) {
	return this1.closest("body").length < 1;
};
tannus_html__$Element_Element_$Impl_$.get_text = function(this1) {
	return this1.text();
};
tannus_html__$Element_Element_$Impl_$.set_text = function(this1,nt) {
	this1.text(nt);
	return this1.text();
};
tannus_html__$Element_Element_$Impl_$.get_style = function(this1) {
	var af = (function(f) {
		return function(a1) {
			return f(a1);
		};
	})((function(_e) {
		return function(args) {
			return tannus_html__$Element_Element_$Impl_$._cs(_e,args);
		};
	})(this1));
	return af;
};
tannus_html__$Element_Element_$Impl_$._cs = function(this1,args) {
	var r = tannus_html__$Element_Element_$Impl_$.cs(this1,args[0],args[1]);
	return r != null?r:"";
};
tannus_html__$Element_Element_$Impl_$.get_attributes = function(this1) {
	return function() {
		return this1;
	};
};
tannus_html__$Element_Element_$Impl_$.get_classes = function(this1) {
	return ((function($this) {
		var $r;
		var this2 = this1.attr("class");
		$r = this2 != null?this2:"";
		return $r;
	}(this))).split(" ");
};
tannus_html__$Element_Element_$Impl_$.set_classes = function(this1,cl) {
	var value = cl.join(" ");
	this1.attr("class",value);
	value;
	return ((function($this) {
		var $r;
		var this2 = this1.attr("class");
		$r = this2 != null?this2:"";
		return $r;
	}(this))).split(" ");
};
tannus_html__$Element_Element_$Impl_$.cs = function(this1,k,v) {
	if(v != null) this1.css(k,v != null?v:v);
	return this1.css(k);
};
tannus_html__$Element_Element_$Impl_$.get_x = function(this1) {
	return this1.offset().left;
};
tannus_html__$Element_Element_$Impl_$.set_x = function(this1,nx) {
	tannus_html__$Element_Element_$Impl_$.cs(this1,"left",nx + "px");
	return this1.offset().left;
};
tannus_html__$Element_Element_$Impl_$.get_y = function(this1) {
	return this1.offset().top;
};
tannus_html__$Element_Element_$Impl_$.set_y = function(this1,ny) {
	tannus_html__$Element_Element_$Impl_$.cs(this1,"top",ny + "px");
	return this1.offset().top;
};
tannus_html__$Element_Element_$Impl_$.get_z = function(this1) {
	var msz = this1.css("z-index");
	var mz = parseFloat(msz != null?msz:"0");
	if(isNaN(mz)) mz = 0;
	return mz;
};
tannus_html__$Element_Element_$Impl_$.set_z = function(this1,nz) {
	tannus_html__$Element_Element_$Impl_$.cs(this1,"z-index",nz + "");
	var msz = this1.css("z-index");
	var mz = parseFloat(msz != null?msz:"0");
	if(isNaN(mz)) mz = 0;
	return mz;
};
tannus_html__$Element_Element_$Impl_$.get_w = function(this1) {
	return this1.width() + 0.0;
};
tannus_html__$Element_Element_$Impl_$.set_w = function(this1,v) {
	this1.width(Math.round(v));
	return this1.width() + 0.0;
};
tannus_html__$Element_Element_$Impl_$.get_h = function(this1) {
	return this1.height() + 0.0;
};
tannus_html__$Element_Element_$Impl_$.set_h = function(this1,v) {
	this1.height(Math.round(v));
	return this1.height() + 0.0;
};
tannus_html__$Element_Element_$Impl_$.get_rectangle = function(this1) {
	var r;
	var _x = this1.offset().left;
	var _y = this1.offset().top;
	var _width = this1.width() + 0.0;
	var _height = this1.height() + 0.0;
	r = new tannus_geom_CRectangle(_x,_y,_width,_height);
	var msz = this1.css("z-index");
	var mz = parseFloat(msz != null?msz:"0");
	if(isNaN(mz)) mz = 0;
	r.z = mz;
	return r;
};
tannus_html__$Element_Element_$Impl_$.set_rectangle = function(this1,nr) {
	tannus_html__$Element_Element_$Impl_$.cs(this1,"left",nr.x + "px");
	this1.offset().left;
	tannus_html__$Element_Element_$Impl_$.cs(this1,"top",nr.y + "px");
	this1.offset().top;
	tannus_html__$Element_Element_$Impl_$.cs(this1,"z-index",nr.z + "");
	var msz = this1.css("z-index");
	var mz = parseFloat(msz != null?msz:"0");
	if(isNaN(mz)) mz = 0;
	mz;
	this1.width(Math.round(nr.width));
	this1.width() + 0.0;
	this1.height(Math.round(nr.height));
	this1.height() + 0.0;
	return tannus_html__$Element_Element_$Impl_$.get_rectangle(this1);
};
tannus_html__$Element_Element_$Impl_$.get_position = function(this1) {
	var x = this1.offset().left;
	var y = this1.offset().top;
	var z;
	var msz = this1.css("z-index");
	var mz = parseFloat(msz != null?msz:"0");
	if(isNaN(mz)) mz = 0;
	z = mz;
	return new tannus_geom_TPoint(x,y,z);
};
tannus_html__$Element_Element_$Impl_$.set_position = function(this1,np) {
	var nx = np.get_x();
	tannus_html__$Element_Element_$Impl_$.cs(this1,"left",nx + "px");
	this1.offset().left;
	var ny = np.get_y();
	tannus_html__$Element_Element_$Impl_$.cs(this1,"top",ny + "px");
	this1.offset().top;
	var nz = np.get_z();
	tannus_html__$Element_Element_$Impl_$.cs(this1,"z-index",nz + "");
	var msz = this1.css("z-index");
	var mz = parseFloat(msz != null?msz:"0");
	if(isNaN(mz)) mz = 0;
	mz;
	var x = this1.offset().left;
	var y = this1.offset().top;
	var z;
	var msz1 = this1.css("z-index");
	var mz1 = parseFloat(msz1 != null?msz1:"0");
	if(isNaN(mz1)) mz1 = 0;
	z = mz1;
	return new tannus_geom_TPoint(x,y,z);
};
tannus_html__$Element_Element_$Impl_$.get = function(this1,key) {
	return this1.attr(key);
};
tannus_html__$Element_Element_$Impl_$.set = function(this1,key,value) {
	this1.attr(key,value);
	return value;
};
tannus_html__$Element_Element_$Impl_$.at = function(this1,index) {
	return this1.get(index);
};
tannus_html__$Element_Element_$Impl_$.contains = function(this1,other) {
	return other.closest(this1).length > 0;
};
tannus_html__$Element_Element_$Impl_$.appendElementable = function(this1,child) {
	return this1.append(child.toElement());
};
tannus_html__$Element_Element_$Impl_$.addToElement = function(this1,other) {
	return this1.add(other);
};
tannus_html__$Element_Element_$Impl_$.addToElementArray = function(this1,other) {
	var els = ((function($this) {
		var $r;
		var _g = [];
		{
			var _g2 = 0;
			var _g1 = this1.length;
			while(_g2 < _g1) {
				var i = _g2++;
				_g.push((function($this) {
					var $r;
					var jq = this1.get(i);
					$r = js.JQuery(jq);
					return $r;
				}($this)));
			}
		}
		$r = _g;
		return $r;
	}(this))).concat(other);
	var el = js.JQuery("");
	var _g3 = 0;
	while(_g3 < els.length) {
		var e = els[_g3];
		++_g3;
		el = el.add(e);
	}
	return el;
};
tannus_html__$Element_Element_$Impl_$.addToElementable = function(this1,other) {
	return this1.add(other.toElement());
};
tannus_html__$Element_Element_$Impl_$.subFromElement = function(this1,other) {
	var this2 = js.JQuery(this1);
	var els;
	var _g3 = [];
	var _g21 = 0;
	var _g11 = other.length;
	while(_g21 < _g11) {
		var i1 = _g21++;
		_g3.push((function($this) {
			var $r;
			var jq1 = other.get(i1);
			$r = js.JQuery(jq1);
			return $r;
		}(this)));
	}
	els = _g3;
	var res = ((function($this) {
		var $r;
		var _g = [];
		{
			var _g2 = 0;
			var _g1 = this2.length;
			while(_g2 < _g1) {
				var i = _g2++;
				_g.push((function($this) {
					var $r;
					var jq = this2.get(i);
					$r = js.JQuery(jq);
					return $r;
				}($this)));
			}
		}
		$r = _g;
		return $r;
	}(this))).filter(function(e) {
		return Lambda.has(els,e);
	});
	var result = js.JQuery("");
	var _g4 = 0;
	while(_g4 < res.length) {
		var e1 = res[_g4];
		++_g4;
		result = result.add(e1);
	}
	return result;
};
tannus_html__$Element_Element_$Impl_$.subFromElementArray = function(this1,els) {
	var res = ((function($this) {
		var $r;
		var _g = [];
		{
			var _g2 = 0;
			var _g1 = this1.length;
			while(_g2 < _g1) {
				var i = _g2++;
				_g.push((function($this) {
					var $r;
					var jq = this1.get(i);
					$r = js.JQuery(jq);
					return $r;
				}($this)));
			}
		}
		$r = _g;
		return $r;
	}(this))).filter(function(e) {
		return Lambda.has(els,e);
	});
	var result = js.JQuery("");
	var _g3 = 0;
	while(_g3 < res.length) {
		var e1 = res[_g3];
		++_g3;
		result = result.add(e1);
	}
	return result;
};
tannus_html__$Element_Element_$Impl_$.toArray = function(this1) {
	var _g = [];
	var _g2 = 0;
	var _g1 = this1.length;
	while(_g2 < _g1) {
		var i = _g2++;
		_g.push((function($this) {
			var $r;
			var jq = this1.get(i);
			$r = js.JQuery(jq);
			return $r;
		}(this)));
	}
	return _g;
};
tannus_html__$Element_Element_$Impl_$.fromArray = function(els) {
	var el = js.JQuery("");
	var _g = 0;
	while(_g < els.length) {
		var e = els[_g];
		++_g;
		el = el.add(e);
	}
	return el;
};
tannus_html__$Element_Element_$Impl_$.toHTMLElement = function(this1) {
	return this1.get(0);
};
tannus_html__$Element_Element_$Impl_$.fromString = function(q) {
	return js.JQuery(q);
};
tannus_html__$Element_Element_$Impl_$.fromDOMElement = function(el) {
	return js.JQuery(el);
};
var tannus_html_Elementable = function() { };
$hxClasses["tannus.html.Elementable"] = tannus_html_Elementable;
tannus_html_Elementable.__name__ = ["tannus","html","Elementable"];
tannus_html_Elementable.prototype = {
	__class__: tannus_html_Elementable
};
var tannus_html__$Win_Win_$Impl_$ = {};
$hxClasses["tannus.html._Win.Win_Impl_"] = tannus_html__$Win_Win_$Impl_$;
tannus_html__$Win_Win_$Impl_$.__name__ = ["tannus","html","_Win","Win_Impl_"];
tannus_html__$Win_Win_$Impl_$.__properties__ = {get_current:"get_current",get_viewport:"get_viewport"}
tannus_html__$Win_Win_$Impl_$._new = function(w) {
	return w != null?w:window;
};
tannus_html__$Win_Win_$Impl_$.onScroll = function(this1) {
	var sig = new tannus_io_Signal();
	var handlr = function(event) {
		var scroll = new tannus_geom_TPoint(this1.scrollX,this1.scrollY,0);
		sig.broadcast(scroll);
	};
	this1.addEventListener("scroll",handlr);
	sig.ondelete = function() {
		this1.removeEventListener("scroll",handlr);
	};
	return sig;
};
tannus_html__$Win_Win_$Impl_$.onResize = function(this1) {
	var sig = new tannus_io_Signal();
	var handlr = function(event) {
		var area = [this1.innerWidth,this1.innerHeight];
		sig.broadcast(area);
	};
	this1.addEventListener("resize",handlr);
	sig.ondelete = function() {
		this1.removeEventListener("resize",handlr);
	};
	return sig;
};
tannus_html__$Win_Win_$Impl_$.onKeydown = function(this1) {
	var sig = new tannus_io_Signal();
	var handle = function(event) {
		var mods = [];
		if(event.altKey) mods.push("alt");
		if(event.shiftKey) mods.push("shift");
		if(event.ctrlKey) mods.push("ctrl");
		var e = new tannus_events_KeyboardEvent("keydown",event.keyCode,mods);
		sig.broadcast(e);
	};
	var bod = this1.document.getElementsByTagName("body").item(0);
	bod.addEventListener("keydown",handle);
	sig.ondelete = function() {
		bod.removeEventListener("keydown",handle);
	};
	return sig;
};
tannus_html__$Win_Win_$Impl_$.onBeforeUnload = function(this1) {
	var sig = new tannus_io_Signal();
	var handlr = function(event) {
		sig.call(new Date().getTime());
	};
	this1.addEventListener("beforeunload",handlr);
	sig.ondelete = function() {
		this1.removeEventListener("beforeunload",handlr);
	};
	return sig;
};
tannus_html__$Win_Win_$Impl_$.get_viewport = function(this1) {
	return new tannus_geom_CRectangle(this1.scrollX,this1.scrollY,this1.innerWidth,this1.innerHeight);
};
tannus_html__$Win_Win_$Impl_$.get_current = function() {
	return window;
};
var tannus_html_fs__$WebDirectoryEntry_WebDirectoryEntry_$Impl_$ = {};
$hxClasses["tannus.html.fs._WebDirectoryEntry.WebDirectoryEntry_Impl_"] = tannus_html_fs__$WebDirectoryEntry_WebDirectoryEntry_$Impl_$;
tannus_html_fs__$WebDirectoryEntry_WebDirectoryEntry_$Impl_$.__name__ = ["tannus","html","fs","_WebDirectoryEntry","WebDirectoryEntry_Impl_"];
tannus_html_fs__$WebDirectoryEntry_WebDirectoryEntry_$Impl_$._new = function(dir) {
	return dir;
};
tannus_html_fs__$WebDirectoryEntry_WebDirectoryEntry_$Impl_$.exists = function(this1,path) {
	return new tannus_ds_Promise(function(accept,reject) {
		this1.getFile(path,null,function(entry) {
			accept(true);
		},function(error) {
			var _g = error.code;
			switch(_g) {
			case 1:
				accept(false);
				break;
			default:
				reject(error);
			}
		});
	},null).bool();
};
tannus_html_fs__$WebDirectoryEntry_WebDirectoryEntry_$Impl_$.createFile = function(this1,path) {
	return new tannus_ds_Promise((function(f,a1,a2) {
		return function(a3,a4) {
			f(a1,a2,a3,a4);
		};
	})($bind(this1,this1.getFile),path,{ 'create' : true}));
};
tannus_html_fs__$WebDirectoryEntry_WebDirectoryEntry_$Impl_$.getFile = function(this1,path) {
	return new tannus_ds_Promise((function(f,a1,a2) {
		return function(a3,a4) {
			f(a1,a2,a3,a4);
		};
	})($bind(this1,this1.getFile),path,{ }));
};
tannus_html_fs__$WebDirectoryEntry_WebDirectoryEntry_$Impl_$.createDirectory = function(this1,path) {
	return new tannus_ds_Promise((function(f,a1,a2) {
		return function(a3,a4) {
			f(a1,a2,a3,a4);
		};
	})($bind(this1,this1.getDirectory),path,{ 'create' : true}));
};
tannus_html_fs__$WebDirectoryEntry_WebDirectoryEntry_$Impl_$.readEntries = function(this1) {
	return new tannus_ds_promises_ArrayPromise((function(f) {
		return function(a1,a2) {
			f(a1,a2);
		};
	})(($_=this1.createReader(),$bind($_,$_.readEntries))));
};
tannus_html_fs__$WebDirectoryEntry_WebDirectoryEntry_$Impl_$.filter = function(this1,glob) {
	return new tannus_ds_promises_ArrayPromise((function(f) {
		return function(a1,a2) {
			f(a1,a2);
		};
	})(($_=this1.createReader(),$bind($_,$_.readEntries)))).filter(function(e) {
		return glob.test(e.name);
	});
};
var tannus_html_fs__$WebFile_WebFile_$Impl_$ = {};
$hxClasses["tannus.html.fs._WebFile.WebFile_Impl_"] = tannus_html_fs__$WebFile_WebFile_$Impl_$;
tannus_html_fs__$WebFile_WebFile_$Impl_$.__name__ = ["tannus","html","fs","_WebFile","WebFile_Impl_"];
tannus_html_fs__$WebFile_WebFile_$Impl_$.__properties__ = {get_type:"get_type"}
tannus_html_fs__$WebFile_WebFile_$Impl_$._new = function(f) {
	return f;
};
tannus_html_fs__$WebFile_WebFile_$Impl_$.get_type = function(this1) {
	return this1.type;
};
tannus_html_fs__$WebFile_WebFile_$Impl_$.getObjectURL = function(this1) {
	return window.webkitURL.createObjectURL(this1);
};
var tannus_html_fs__$WebFileEntry_WebFileEntry_$Impl_$ = {};
$hxClasses["tannus.html.fs._WebFileEntry.WebFileEntry_Impl_"] = tannus_html_fs__$WebFileEntry_WebFileEntry_$Impl_$;
tannus_html_fs__$WebFileEntry_WebFileEntry_$Impl_$.__name__ = ["tannus","html","fs","_WebFileEntry","WebFileEntry_Impl_"];
tannus_html_fs__$WebFileEntry_WebFileEntry_$Impl_$.__properties__ = {get_fileSystem:"get_fileSystem"}
tannus_html_fs__$WebFileEntry_WebFileEntry_$Impl_$._new = function(entry) {
	return entry;
};
tannus_html_fs__$WebFileEntry_WebFileEntry_$Impl_$.get_fileSystem = function(this1) {
	return this1.filesystem;
};
tannus_html_fs__$WebFileEntry_WebFileEntry_$Impl_$.file = function(this1) {
	return new tannus_ds_Promise((function(f) {
		return function(a1,a2) {
			f(a1,a2);
		};
	})($bind(this1,this1.file)));
};
tannus_html_fs__$WebFileEntry_WebFileEntry_$Impl_$.size = function(this1) {
	return tannus_html_fs__$WebFileEntry_WebFileEntry_$Impl_$.file(this1).transform(function(f) {
		return f.size;
	});
};
tannus_html_fs__$WebFileEntry_WebFileEntry_$Impl_$.type = function(this1) {
	return tannus_html_fs__$WebFileEntry_WebFileEntry_$Impl_$.file(this1).transform(function(f) {
		return f.type;
	}).string();
};
tannus_html_fs__$WebFileEntry_WebFileEntry_$Impl_$.read = function(this1) {
	return new tannus_ds_Promise(function(accept,reject) {
		this1.file(function(file) {
			var reader = new FileReader();
			reader.onerror = function(error) {
				reject(error);
			};
			reader.onload = function(event) {
				var data;
				var ui = new Uint8Array(event.target.result);
				var ia;
				var _g = [];
				var _g1 = 0;
				while(_g1 < ui.length) {
					var i = ui[_g1];
					++_g1;
					_g.push(i);
				}
				ia = _g;
				data = tannus_io__$ByteArray_ByteArray_$Impl_$._new(ia.map(function(n) {
					var this2;
					if(!tannus_io__$Byte_Byte_$Impl_$.isValid(n)) throw new js__$Boot_HaxeError("Invalid Byte Value (" + n + ")!");
					this2 = n;
					return this2;
				}));
				accept(data);
			};
			reader.readAsArrayBuffer(file);
		},function(error1) {
			reject(error1);
		});
	},null);
};
tannus_html_fs__$WebFileEntry_WebFileEntry_$Impl_$.writer = function(this1) {
	return new tannus_ds_Promise(function(accept,reject) {
		this1.createWriter(function(writer) {
			accept(writer);
		},function(err) {
			reject(err);
		});
	},null);
};
var tannus_html_fs_WebFileError = function(type,msg) {
	Error.call(this,msg);
	this.name = "FileSystemError";
	this.code = type;
};
$hxClasses["tannus.html.fs.WebFileError"] = tannus_html_fs_WebFileError;
tannus_html_fs_WebFileError.__name__ = ["tannus","html","fs","WebFileError"];
tannus_html_fs_WebFileError.__super__ = Error;
tannus_html_fs_WebFileError.prototype = $extend(Error.prototype,{
	__class__: tannus_html_fs_WebFileError
});
var tannus_html_fs__$WebFileWriter_WebFileWriter_$Impl_$ = {};
$hxClasses["tannus.html.fs._WebFileWriter.WebFileWriter_Impl_"] = tannus_html_fs__$WebFileWriter_WebFileWriter_$Impl_$;
tannus_html_fs__$WebFileWriter_WebFileWriter_$Impl_$.__name__ = ["tannus","html","fs","_WebFileWriter","WebFileWriter_Impl_"];
tannus_html_fs__$WebFileWriter_WebFileWriter_$Impl_$._new = function(w) {
	return w;
};
tannus_html_fs__$WebFileWriter_WebFileWriter_$Impl_$.seek = function(this1,pos) {
	this1.seek(pos);
};
tannus_html_fs__$WebFileWriter_WebFileWriter_$Impl_$.write = function(this1,data,cb) {
	if(cb == null) cb = function(x) {
		null;
	};
	this1.onwriteend = function(event) {
		cb(null);
	};
	this1.onerror = function(error) {
		cb(error);
	};
	var blob = new Blob([tannus_io__$ByteArray_ByteArray_$Impl_$.toArrayBuffer(data)]);
	this1.write(blob);
};
tannus_html_fs__$WebFileWriter_WebFileWriter_$Impl_$.append = function(this1,data,cb) {
	this1.seek(this1.length);
	var cb1 = cb;
	if(cb1 == null) cb1 = function(x) {
		null;
	};
	this1.onwriteend = function(event) {
		cb1(null);
	};
	this1.onerror = function(error) {
		cb1(error);
	};
	var blob = new Blob([tannus_io__$ByteArray_ByteArray_$Impl_$.toArrayBuffer(data)]);
	this1.write(blob);
};
var tannus_http__$Url_Url_$Impl_$ = {};
$hxClasses["tannus.http._Url.Url_Impl_"] = tannus_http__$Url_Url_$Impl_$;
tannus_http__$Url_Url_$Impl_$.__name__ = ["tannus","http","_Url","Url_Impl_"];
tannus_http__$Url_Url_$Impl_$._new = function(s) {
	return new tannus_http_CUrl(s);
};
tannus_http__$Url_Url_$Impl_$.toString = function(this1) {
	return this1.toString();
};
tannus_http__$Url_Url_$Impl_$.fromString = function(s) {
	return new tannus_http_CUrl(s);
};
var tannus_http_CUrl = $hx_exports.Href = function(surl) {
	if(new EReg("^([A-Z]+):","i").match(surl)) this.protocol = surl.substring(0,surl.indexOf(":")); else this.protocol = "";
	if(this.protocol.length == 0) this.protocol = "http";
	var noproto = tannus_ds_StringUtils.remove(surl,this.protocol + "://");
	if(StringTools.startsWith(noproto,"/")) noproto = noproto.substring(1);
	this.hostname = tannus_ds_StringUtils.before(noproto,"/");
	if(tannus_ds_StringUtils.has(noproto,"/")) this.pathname = tannus_ds_StringUtils.after(noproto,"/"); else this.pathname = "";
	if(tannus_ds_StringUtils.has(this.pathname,"?")) this.search = tannus_ds_StringUtils.after(this.pathname,"?"); else this.search = "";
	this.pathname = tannus_ds_StringUtils.strip(tannus_ds_StringUtils.strip(this.pathname,tannus_ds__$EitherType_EitherType_$Impl_$.fromL("?")),tannus_ds__$EitherType_EitherType_$Impl_$.fromL(this.search));
	if(tannus_ds_StringUtils.has(this.search,"#")) this.hash = tannus_ds_StringUtils.after(this.search,"#"); else this.hash = "";
	this.search = tannus_ds_StringUtils.before(this.search,"#");
	if(this.hash.length == 0 && tannus_ds_StringUtils.has(this.pathname,"#")) {
		this.hash = tannus_ds_StringUtils.after(this.pathname,"#");
		this.pathname = tannus_ds_StringUtils.before(this.pathname,"#");
	}
	this.params = tannus_ds_QueryString.parse(this.search);
	try {
		this.hashparams = tannus_ds_QueryString.parse(this.hash);
	} catch( err ) {
		if (err instanceof js__$Boot_HaxeError) err = err.val;
		if( js_Boot.__instanceof(err,String) ) {
			this.hashparams = null;
		} else throw(err);
	}
};
$hxClasses["tannus.http.CUrl"] = tannus_http_CUrl;
tannus_http_CUrl.__name__ = ["tannus","http","CUrl"];
tannus_http_CUrl.prototype = {
	toString: function() {
		this.search = tannus_ds_QueryString.stringify(this.params);
		if(this.hashparams != null) this.hash = tannus_ds_QueryString.stringify(this.hashparams); else this.hash = this.hash + "";
		var base = "" + this.protocol + "://" + this.hostname + "/" + this.pathname;
		if(Reflect.fields(this.params).length == 0) base += ""; else base += "?" + this.search;
		if(this.hash != "") base += "#" + this.hash; else base += "";
		return base;
	}
	,clone: function() {
		var s = this.toString();
		return new tannus_http_CUrl(s);
	}
	,get_domain: function() {
		return this.hostname.split(".");
	}
	,set_domain: function(v) {
		this.hostname = v.join(".");
		return this.get_domain();
	}
	,get_path: function() {
		return new tannus_sys__$Path_CPath(this.pathname);
	}
	,set_path: function(v) {
		this.pathname = v.s;
		return new tannus_sys__$Path_CPath(this.pathname);
	}
	,__class__: tannus_http_CUrl
	,__properties__: {set_path:"set_path",get_path:"get_path",set_domain:"set_domain",get_domain:"get_domain"}
};
var tannus_internal_CompileTime = function() { };
$hxClasses["tannus.internal.CompileTime"] = tannus_internal_CompileTime;
tannus_internal_CompileTime.__name__ = ["tannus","internal","CompileTime"];
var tannus_internal__$Error_Error_$Impl_$ = {};
$hxClasses["tannus.internal._Error.Error_Impl_"] = tannus_internal__$Error_Error_$Impl_$;
tannus_internal__$Error_Error_$Impl_$.__name__ = ["tannus","internal","_Error","Error_Impl_"];
tannus_internal__$Error_Error_$Impl_$._new = function(msg) {
	return new Error(msg);
};
tannus_internal__$Error_Error_$Impl_$.fromString = function(s) {
	return new Error(s);
};
var tannus_internal_TypeTools = function() { };
$hxClasses["tannus.internal.TypeTools"] = tannus_internal_TypeTools;
tannus_internal_TypeTools.__name__ = ["tannus","internal","TypeTools"];
tannus_internal_TypeTools.typename = function(o) {
	var valtype = Type["typeof"](o);
	switch(valtype[1]) {
	case 3:
		return "Bool";
	case 2:case 1:
		return "Number";
	case 0:
		return "Null";
	case 5:
		return "Function";
	case 8:
		return "Unknown";
	case 6:
		var klass = valtype[2];
		try {
			var name = Type.getClassName(klass);
			return name;
		} catch( err ) {
			if (err instanceof js__$Boot_HaxeError) err = err.val;
			if( js_Boot.__instanceof(err,String) ) {
				return "Unknown";
			} else throw(err);
		}
		break;
	case 7:
		var enumer = valtype[2];
		var enumName = Type.getEnumName(enumer);
		var valueNames = Type.getEnumConstructs(enumer);
		var index = o[1];
		var results = "" + enumName + "." + valueNames[index];
		var args = o.slice(2);
		if(args.length == 0) return results; else {
			var reps;
			var _g = [];
			var _g1 = 0;
			while(_g1 < args.length) {
				var x = args[_g1];
				++_g1;
				_g.push(Std.string(x));
			}
			reps = _g;
			results += "(" + reps.join(", ") + ")";
			return results;
		}
		break;
	case 4:
		try {
			var name1 = Type.getClassName(o);
			if(name1 != null) return "Class<" + name1 + ">"; else throw new js__$Boot_HaxeError("failed!");
		} catch( err1 ) {
			if (err1 instanceof js__$Boot_HaxeError) err1 = err1.val;
			if( js_Boot.__instanceof(err1,String) ) {
				try {
					var name2 = Type.getEnumName(o);
					if(name2 != null) return "Enum<" + name2 + ">"; else throw new js__$Boot_HaxeError("failed!");
				} catch( err2 ) {
					if (err2 instanceof js__$Boot_HaxeError) err2 = err2.val;
					return "Unknown";
				}
			} else throw(err1);
		}
		break;
	}
};
tannus_internal_TypeTools.getClassHierarchy = function(klass) {
	var kl = klass;
	var hierarchy = [];
	var name = Type.getClassName(kl);
	hierarchy.push(name);
	while(true) try {
		kl = Type.getSuperClass(kl);
		name = Type.getClassName(kl);
		hierarchy.push(name);
	} catch( err ) {
		if (err instanceof js__$Boot_HaxeError) err = err.val;
		break;
	}
	return hierarchy;
};
tannus_internal_TypeTools.hierarchy = function(o) {
	if(Reflect.isObject(o)) {
		var klass = Type.getClass(o);
		if(klass != null) return tannus_internal_TypeTools.getClassHierarchy(klass);
	}
	return [];
};
var tannus_io_Asserts = function() { };
$hxClasses["tannus.io.Asserts"] = tannus_io_Asserts;
tannus_io_Asserts.__name__ = ["tannus","io","Asserts"];
var tannus_io__$Blob_Blob_$Impl_$ = {};
$hxClasses["tannus.io._Blob.Blob_Impl_"] = tannus_io__$Blob_Blob_$Impl_$;
tannus_io__$Blob_Blob_$Impl_$.__name__ = ["tannus","io","_Blob","Blob_Impl_"];
tannus_io__$Blob_Blob_$Impl_$._new = function(name,mime,dat) {
	return new tannus_io_CBlob(name,mime,dat);
};
tannus_io__$Blob_Blob_$Impl_$.toNativeBlob = function(this1) {
	return new Blob([tannus_io__$ByteArray_ByteArray_$Impl_$.toArrayBuffer(this1.data)],{ 'type' : this1.type});
};
tannus_io__$Blob_Blob_$Impl_$.toObjectURL = function(this1) {
	var courl = URL.createObjectURL;
	return courl(new Blob([tannus_io__$ByteArray_ByteArray_$Impl_$.toArrayBuffer(this1.data)],{ 'type' : this1.type}));
};
tannus_io__$Blob_Blob_$Impl_$.fromDataURL = function(durl) {
	return tannus_io_CBlob.fromDataURL(durl);
};
var tannus_io_CBlob = function(nam,mime,dat) {
	this.name = nam;
	this.type = mime != null?mime:"text/plain";
	var alt = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
	if(dat != null) this.data = dat; else this.data = alt;
};
$hxClasses["tannus.io.CBlob"] = tannus_io_CBlob;
tannus_io_CBlob.__name__ = ["tannus","io","CBlob"];
tannus_io_CBlob.fromDataURL = function(durl) {
	durl = durl.substring(5);
	var bits = durl.split(";");
	var mime = bits.shift();
	var encoded = durl.substring(durl.indexOf(",") + 1,durl.length - 1);
	var data;
	var b = haxe_crypto_Base64.decode(encoded);
	{
		var ba = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
		if(b.length > 0) {
			var _g1 = 0;
			var _g = b.length;
			while(_g1 < _g) {
				var i = _g1++;
				var n = b.b[i];
				ba.push(n);
			}
		}
		data = ba;
	}
	return new tannus_io_CBlob("file",mime,data);
};
tannus_io_CBlob.prototype = {
	save: function(dirname) {
		var f;
		var p = new tannus_sys__$Path_CPath("" + dirname + "/" + this.name);
		f = new tannus_sys_CFile(p);
		tannus_sys_JavaScriptFileSystem.write(f._path.s,this.data);
		return f;
	}
	,toDataURL: function() {
		var encoded = haxe_crypto_Base64.encode((function($this) {
			var $r;
			var this1 = $this.data;
			var buf = haxe_io_Bytes.alloc(this1.length);
			tannus_io__$ByteArray_ByteArray_$Impl_$.each(this1,function(i,b) {
				buf.b[i] = b & 255;
			});
			$r = buf;
			return $r;
		}(this)));
		return "data:" + this.type + ";base64," + encoded;
	}
	,__class__: tannus_io_CBlob
};
var tannus_io__$Byte_Byte_$Impl_$ = {};
$hxClasses["tannus.io._Byte.Byte_Impl_"] = tannus_io__$Byte_Byte_$Impl_$;
tannus_io__$Byte_Byte_$Impl_$.__name__ = ["tannus","io","_Byte","Byte_Impl_"];
tannus_io__$Byte_Byte_$Impl_$.__properties__ = {set_aschar:"set_aschar",get_aschar:"get_aschar",set_asint:"set_asint",get_asint:"get_asint",get_self:"get_self"}
tannus_io__$Byte_Byte_$Impl_$._new = function(n) {
	var this1;
	if(!tannus_io__$Byte_Byte_$Impl_$.isValid(n)) throw new js__$Boot_HaxeError("Invalid Byte Value (" + n + ")!");
	this1 = n;
	return this1;
};
tannus_io__$Byte_Byte_$Impl_$.get_self = function(this1) {
	return this1;
};
tannus_io__$Byte_Byte_$Impl_$.get_asint = function(this1) {
	return this1;
};
tannus_io__$Byte_Byte_$Impl_$.set_asint = function(this1,n) {
	if(!tannus_io__$Byte_Byte_$Impl_$.isValid(n)) throw new js__$Boot_HaxeError("Invalid Byte Value (" + n + ")!");
	return this1 = n;
};
tannus_io__$Byte_Byte_$Impl_$.get_aschar = function(this1) {
	return String.fromCharCode(this1);
};
tannus_io__$Byte_Byte_$Impl_$.set_aschar = function(this1,s) {
	var n = HxOverrides.cca(s,0);
	if(!tannus_io__$Byte_Byte_$Impl_$.isValid(n)) throw new js__$Boot_HaxeError("Invalid Byte Value (" + n + ")!");
	this1 = n;
	return String.fromCharCode(this1);
};
tannus_io__$Byte_Byte_$Impl_$.isNumeric = function(this1) {
	return this1 >= 48 && this1 <= 57;
};
tannus_io__$Byte_Byte_$Impl_$.isLetter = function(this1) {
	return this1 >= 65 && this1 <= 90 || this1 >= 97 && this1 <= 122;
};
tannus_io__$Byte_Byte_$Impl_$.isAlphaNumeric = function(this1) {
	return this1 >= 48 && this1 <= 57 || (this1 >= 65 && this1 <= 90 || this1 >= 97 && this1 <= 122);
};
tannus_io__$Byte_Byte_$Impl_$.isUppercase = function(this1) {
	return this1 >= 65 && this1 <= 90;
};
tannus_io__$Byte_Byte_$Impl_$.isLowercase = function(this1) {
	return this1 >= 97 && this1 <= 122;
};
tannus_io__$Byte_Byte_$Impl_$.isWhiteSpace = function(this1) {
	return Lambda.has([9,10,11,12,13,32],this1);
};
tannus_io__$Byte_Byte_$Impl_$.isLineBreaking = function(this1) {
	return this1 == 10 || this1 == 13;
};
tannus_io__$Byte_Byte_$Impl_$.isPunctuation = function(this1) {
	return Lambda.has([33,44,45,46,58,59,53],this1);
};
tannus_io__$Byte_Byte_$Impl_$.equalsi = function(this1,other) {
	return this1 == other;
};
tannus_io__$Byte_Byte_$Impl_$.equalss = function(this1,other) {
	return this1 == HxOverrides.cca(other,0);
};
tannus_io__$Byte_Byte_$Impl_$.repeat = function(this1,times) {
	var s = "";
	while(s.length < times) s += String.fromCharCode(this1);
	return s;
};
tannus_io__$Byte_Byte_$Impl_$.toString = function(this1) {
	return String.fromCharCode(this1);
};
tannus_io__$Byte_Byte_$Impl_$.toInt = function(this1) {
	return this1;
};
tannus_io__$Byte_Byte_$Impl_$.fromString = function(s) {
	var b = 0;
	var n = HxOverrides.cca(s,0);
	if(!tannus_io__$Byte_Byte_$Impl_$.isValid(n)) throw new js__$Boot_HaxeError("Invalid Byte Value (" + n + ")!");
	b = n;
	String.fromCharCode(b);
	return b;
};
tannus_io__$Byte_Byte_$Impl_$.isValid = function(n) {
	return ((n | 0) === n) && isFinite(n) && !isNaN(n);
};
tannus_io__$Byte_Byte_$Impl_$.assertValid = function(n) {
	if(!tannus_io__$Byte_Byte_$Impl_$.isValid(n)) throw new js__$Boot_HaxeError("Invalid Byte Value (" + n + ")!");
};
var tannus_io__$ByteArray_ByteArray_$Impl_$ = {};
$hxClasses["tannus.io._ByteArray.ByteArray_Impl_"] = tannus_io__$ByteArray_ByteArray_$Impl_$;
tannus_io__$ByteArray_ByteArray_$Impl_$.__name__ = ["tannus","io","_ByteArray","ByteArray_Impl_"];
tannus_io__$ByteArray_ByteArray_$Impl_$.__properties__ = {set_last:"set_last",get_last:"get_last",set_first:"set_first",get_first:"get_first",get_empty:"get_empty",get_self:"get_self"}
tannus_io__$ByteArray_ByteArray_$Impl_$._new = function(a) {
	return a != null?a:[];
};
tannus_io__$ByteArray_ByteArray_$Impl_$.get = function(this1,i) {
	return this1[i];
};
tannus_io__$ByteArray_ByteArray_$Impl_$.set = function(this1,i,nb) {
	this1[i] = nb;
	return this1[i];
};
tannus_io__$ByteArray_ByteArray_$Impl_$.iterator = function(this1) {
	return HxOverrides.iter(this1);
};
tannus_io__$ByteArray_ByteArray_$Impl_$.get_self = function(this1) {
	return this1;
};
tannus_io__$ByteArray_ByteArray_$Impl_$.get_empty = function(this1) {
	return this1.length == 0;
};
tannus_io__$ByteArray_ByteArray_$Impl_$.get_first = function(this1) {
	return this1[0];
};
tannus_io__$ByteArray_ByteArray_$Impl_$.set_first = function(this1,nf) {
	return this1[0] = nf;
};
tannus_io__$ByteArray_ByteArray_$Impl_$.get_last = function(this1) {
	return this1[this1.length - 1];
};
tannus_io__$ByteArray_ByteArray_$Impl_$.set_last = function(this1,nl) {
	return this1[this1.length - 1] = nl;
};
tannus_io__$ByteArray_ByteArray_$Impl_$.each = function(this1,func,start,end) {
	var index;
	if(start != null) index = start; else index = 0;
	var goal;
	if(end != null) goal = end; else goal = this1.length;
	if(index < 0) {
		if(end == null) {
			var _i = index;
			index = this1.length + _i;
		} else throw new js__$Boot_HaxeError("Invalid start index " + index + "!");
	}
	var cb;
	while(index < goal) {
		cb = this1[index];
		func(index,cb);
		index++;
	}
};
tannus_io__$ByteArray_ByteArray_$Impl_$.slice = function(this1,start,end) {
	{
		var ia = this1.slice(start,end);
		return tannus_io__$ByteArray_ByteArray_$Impl_$._new(ia.map(function(n) {
			var this2;
			if(!tannus_io__$Byte_Byte_$Impl_$.isValid(n)) throw new js__$Boot_HaxeError("Invalid Byte Value (" + n + ")!");
			this2 = n;
			return this2;
		}));
	}
};
tannus_io__$ByteArray_ByteArray_$Impl_$.indexOf = function(this1,sub) {
	var _g1 = 0;
	var _g = this1.length - sub.length;
	while(_g1 < _g) {
		var i = _g1++;
		var hunk = tannus_io__$ByteArray_ByteArray_$Impl_$.slice(this1,i,i + sub.length);
		console.log(hunk.map(function(b) {
			return String.fromCharCode(b);
		}).join(""));
		if(tannus_io__$ByteArray_ByteArray_$Impl_$.equals_byteArray(hunk,sub)) return i;
	}
	return -1;
};
tannus_io__$ByteArray_ByteArray_$Impl_$.contains = function(this1,sub) {
	return tannus_io__$ByteArray_ByteArray_$Impl_$.indexOf(this1,sub) != -1;
};
tannus_io__$ByteArray_ByteArray_$Impl_$.writeString = function(this1,s) {
	var _g = 0;
	var _g1 = s.split("");
	while(_g < _g1.length) {
		var c = _g1[_g];
		++_g;
		this1.push((function($this) {
			var $r;
			var b = 0;
			{
				var n = HxOverrides.cca(c,0);
				if(!tannus_io__$Byte_Byte_$Impl_$.isValid(n)) throw new js__$Boot_HaxeError("Invalid Byte Value (" + n + ")!");
				b = n;
				String.fromCharCode(b);
			}
			$r = b;
			return $r;
		}(this)));
	}
};
tannus_io__$ByteArray_ByteArray_$Impl_$.getString = function(this1,len) {
	var this2 = tannus_io__$ByteArray_ByteArray_$Impl_$.slice(this1,0,len != null?len:this1.length);
	return this2.map(function(b) {
		return String.fromCharCode(b);
	}).join("");
};
tannus_io__$ByteArray_ByteArray_$Impl_$.writeFloat = function(this1,f) {
	var b;
	var this2 = this1;
	var buf = haxe_io_Bytes.alloc(this2.length);
	tannus_io__$ByteArray_ByteArray_$Impl_$.each(this2,function(i,b1) {
		buf.b[i] = b1 & 255;
	});
	b = buf;
	b.setFloat(this1.length,f);
	var this3;
	var ba = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
	if(b.length > 0) {
		var _g1 = 0;
		var _g = b.length;
		while(_g1 < _g) {
			var i1 = _g1++;
			var n = b.b[i1];
			ba.push(n);
		}
	}
	this3 = ba;
	this1 = this3;
};
tannus_io__$ByteArray_ByteArray_$Impl_$.readFloat = function(this1,i) {
	if(i == null) i = this1.length;
	var b;
	var this2 = this1;
	var buf = haxe_io_Bytes.alloc(this2.length);
	tannus_io__$ByteArray_ByteArray_$Impl_$.each(this2,function(i1,b1) {
		buf.b[i1] = b1 & 255;
	});
	b = buf;
	var res = b.getFloat(this1.length);
	var this3;
	var ba = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
	if(b.length > 0) {
		var _g1 = 0;
		var _g = b.length;
		while(_g1 < _g) {
			var i2 = _g1++;
			var n = b.b[i2];
			ba.push(n);
		}
	}
	this3 = ba;
	this1 = this3;
	return res;
};
tannus_io__$ByteArray_ByteArray_$Impl_$.write = function(this1,ba) {
	this1 = this1.concat(ba);
};
tannus_io__$ByteArray_ByteArray_$Impl_$.writeByte = function(this1,b) {
	this1.push(b);
};
tannus_io__$ByteArray_ByteArray_$Impl_$.append = function(this1,data) {
	var $it0 = HxOverrides.iter(data);
	while( $it0.hasNext() ) {
		var b = $it0.next();
		this1.push(b);
	}
};
tannus_io__$ByteArray_ByteArray_$Impl_$.toDataURI = function(this1,mime) {
	if(mime == null) mime = "text/plain";
	var encoded = haxe_crypto_Base64.encode((function($this) {
		var $r;
		var this2 = this1;
		var buf = haxe_io_Bytes.alloc(this2.length);
		tannus_io__$ByteArray_ByteArray_$Impl_$.each(this2,function(i,b) {
			buf.b[i] = b & 255;
		});
		$r = buf;
		return $r;
	}(this)));
	return "data:" + mime + ";base64," + encoded;
};
tannus_io__$ByteArray_ByteArray_$Impl_$.chunk = function(this1,len,end) {
	if(end == null) end = false;
	var chnk = [];
	var rip;
	var f1 = (function(f) {
		return function() {
			return f();
		};
	})(end?$bind(this1,this1.pop):$bind(this1,this1.shift));
	rip = f1;
	var _g = 0;
	while(_g < len) {
		var i = _g++;
		var b = rip();
		if(b != null) chnk.push(b); else throw new js__$Boot_HaxeError("IncompleteChunkError: Byte-Retrieval failed on byte " + i + "/" + len + "!");
	}
	return chnk;
};
tannus_io__$ByteArray_ByteArray_$Impl_$.equals_byteArray = function(this1,other) {
	if(this1.length != other.length) return false; else {
		var i = 0;
		while(i < this1.length) {
			if(this1[i] != other[i]) return false;
			i++;
		}
		return true;
	}
};
tannus_io__$ByteArray_ByteArray_$Impl_$.plus = function(this1,other) {
	{
		var ia = this1.concat(other);
		return tannus_io__$ByteArray_ByteArray_$Impl_$._new(ia.map(function(n) {
			var this2;
			if(!tannus_io__$Byte_Byte_$Impl_$.isValid(n)) throw new js__$Boot_HaxeError("Invalid Byte Value (" + n + ")!");
			this2 = n;
			return this2;
		}));
	}
};
tannus_io__$ByteArray_ByteArray_$Impl_$.toArray = function(this1) {
	return this1;
};
tannus_io__$ByteArray_ByteArray_$Impl_$.toIntArray = function(this1) {
	return this1.map(function(b) {
		return b;
	});
};
tannus_io__$ByteArray_ByteArray_$Impl_$.toString = function(this1) {
	return this1.map(function(b) {
		return String.fromCharCode(b);
	}).join("");
};
tannus_io__$ByteArray_ByteArray_$Impl_$.toBase64 = function(this1) {
	var b;
	{
		var this2 = this1;
		var buf = haxe_io_Bytes.alloc(this2.length);
		tannus_io__$ByteArray_ByteArray_$Impl_$.each(this2,function(i,b1) {
			buf.b[i] = b1 & 255;
		});
		b = buf;
	}
	return haxe_crypto_Base64.encode(b);
};
tannus_io__$ByteArray_ByteArray_$Impl_$.toBytes = function(this1) {
	var buf = haxe_io_Bytes.alloc(this1.length);
	tannus_io__$ByteArray_ByteArray_$Impl_$.each(this1,function(i,b) {
		buf.b[i] = b & 255;
	});
	return buf;
};
tannus_io__$ByteArray_ByteArray_$Impl_$.toUint8Array = function(this1) {
	return new Uint8Array(this1);
};
tannus_io__$ByteArray_ByteArray_$Impl_$.toArrayBuffer = function(this1) {
	return tannus_io__$ByteArray_ByteArray_$Impl_$.toUint8Array(this1);
};
tannus_io__$ByteArray_ByteArray_$Impl_$.fromIntArray = function(ia) {
	return tannus_io__$ByteArray_ByteArray_$Impl_$._new(ia.map(function(n) {
		var this1;
		if(!tannus_io__$Byte_Byte_$Impl_$.isValid(n)) throw new js__$Boot_HaxeError("Invalid Byte Value (" + n + ")!");
		this1 = n;
		return this1;
	}));
};
tannus_io__$ByteArray_ByteArray_$Impl_$.fromFloatArray = function(ia) {
	return tannus_io__$ByteArray_ByteArray_$Impl_$._new(ia.map(function(n) {
		var n1 = Math.round(n);
		var this1;
		if(!tannus_io__$Byte_Byte_$Impl_$.isValid(n1)) throw new js__$Boot_HaxeError("Invalid Byte Value (" + n1 + ")!");
		this1 = n1;
		return this1;
	}));
};
tannus_io__$ByteArray_ByteArray_$Impl_$.fromBytes = function(buf) {
	var ba = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
	if(buf.length > 0) {
		var _g1 = 0;
		var _g = buf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var n = buf.b[i];
			ba.push(n);
		}
	}
	return ba;
};
tannus_io__$ByteArray_ByteArray_$Impl_$.fromArrayBuffer = function(abuf) {
	var ui = new Uint8Array(abuf);
	var ia;
	var _g = [];
	var _g1 = 0;
	while(_g1 < ui.length) {
		var i = ui[_g1];
		++_g1;
		_g.push(i);
	}
	ia = _g;
	return tannus_io__$ByteArray_ByteArray_$Impl_$._new(ia.map(function(n) {
		var this1;
		if(!tannus_io__$Byte_Byte_$Impl_$.isValid(n)) throw new js__$Boot_HaxeError("Invalid Byte Value (" + n + ")!");
		this1 = n;
		return this1;
	}));
};
tannus_io__$ByteArray_ByteArray_$Impl_$.fromString = function(s) {
	var ba = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
	tannus_io__$ByteArray_ByteArray_$Impl_$.writeString(ba,s);
	return ba;
};
tannus_io__$ByteArray_ByteArray_$Impl_$.fromBase64 = function(s) {
	var b = haxe_crypto_Base64.decode(s);
	{
		var ba = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
		if(b.length > 0) {
			var _g1 = 0;
			var _g = b.length;
			while(_g1 < _g) {
				var i = _g1++;
				var n = b.b[i];
				ba.push(n);
			}
		}
		return ba;
	}
};
var tannus_io_ByteInput = function(data) {
	this.source = data;
	this.onComplete = new tannus_io_Signal();
};
$hxClasses["tannus.io.ByteInput"] = tannus_io_ByteInput;
tannus_io_ByteInput.__name__ = ["tannus","io","ByteInput"];
tannus_io_ByteInput.fromString = function(s) {
	return new tannus_io_ByteInput((function($this) {
		var $r;
		var ba = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
		tannus_io__$ByteArray_ByteArray_$Impl_$.writeString(ba,s);
		$r = ba;
		return $r;
	}(this)));
};
tannus_io_ByteInput.__super__ = haxe_io_Input;
tannus_io_ByteInput.prototype = $extend(haxe_io_Input.prototype,{
	next: function() {
		return this.readByte();
	}
	,back: function(bit) {
		this.source.unshift(bit);
	}
	,readByte: function() {
		if(!(this.source.length == 0)) {
			var i;
			var this1 = this.source.shift();
			i = this1;
			return i;
		} else {
			this.onComplete.broadcast(this);
			throw new js__$Boot_HaxeError("Eof");
		}
	}
	,__class__: tannus_io_ByteInput
});
var tannus_io_EventDispatcher = function() {
	this._sigs = new haxe_ds_StringMap();
};
$hxClasses["tannus.io.EventDispatcher"] = tannus_io_EventDispatcher;
tannus_io_EventDispatcher.__name__ = ["tannus","io","EventDispatcher"];
tannus_io_EventDispatcher.prototype = {
	addSignal: function(name,sig) {
		var v;
		var alt = new tannus_io_Signal();
		if(sig != null) v = sig; else v = alt;
		this._sigs.set(name,v);
		v;
	}
	,addSignals: function(names) {
		var _g = 0;
		while(_g < names.length) {
			var name = names[_g];
			++_g;
			this.addSignal(name);
		}
	}
	,canDispatch: function(name) {
		return this._sigs.exists(name);
	}
	,on: function(name,action,once) {
		if(this.canDispatch(name)) this._sigs.get(name).on(action,once); else throw new js__$Boot_HaxeError("InvalidEvent: \"" + name + "\" is not a valid Event");
	}
	,once: function(name,action) {
		this.on(name,action,true);
	}
	,dispatch: function(name,data) {
		if(this.canDispatch(name)) this._sigs.get(name).call(data);
	}
	,off: function(name,action) {
		var sig = this._sigs.get(name);
		if(sig != null) {
			if(action != null) sig.ignore(action); else sig.handlers = [];
		}
	}
	,when: function(name,test,action) {
		if(this.canDispatch(name)) this._sigs.get(name).when(test,action); else throw new js__$Boot_HaxeError("InvalidEvent: \"" + name + "\" is not a valid Event");
	}
	,__class__: tannus_io_EventDispatcher
};
var tannus_io__$Getter_Getter_$Impl_$ = {};
$hxClasses["tannus.io._Getter.Getter_Impl_"] = tannus_io__$Getter_Getter_$Impl_$;
tannus_io__$Getter_Getter_$Impl_$.__name__ = ["tannus","io","_Getter","Getter_Impl_"];
tannus_io__$Getter_Getter_$Impl_$.__properties__ = {get_v:"get_v"}
tannus_io__$Getter_Getter_$Impl_$._new = function(f) {
	return f;
};
tannus_io__$Getter_Getter_$Impl_$.get_v = function(this1) {
	return this1();
};
tannus_io__$Getter_Getter_$Impl_$.get = function(this1) {
	return this1();
};
tannus_io__$Getter_Getter_$Impl_$.transform = function(this1,f) {
	return function() {
		return f(this1());
	};
};
var tannus_io_OutputStream = function(o) {
	this.out = o;
};
$hxClasses["tannus.io.OutputStream"] = tannus_io_OutputStream;
tannus_io_OutputStream.__name__ = ["tannus","io","OutputStream"];
tannus_io_OutputStream.prototype = {
	open: function(done) {
		this.out.open(done);
	}
	,close: function(done) {
		this.out.close(done);
	}
	,flush: function(done) {
		this.out.flush(done);
	}
	,pause: function() {
		this.out.pause();
	}
	,resume: function() {
		this.out.resume();
	}
	,writeByte: function(c) {
		this.out.write(c);
	}
	,write: function(s) {
		var $it0 = HxOverrides.iter(s);
		while( $it0.hasNext() ) {
			var c = $it0.next();
			this.writeByte(c);
		}
	}
	,writeBytes: function(s,pos,len) {
		var data = tannus_io__$ByteArray_ByteArray_$Impl_$.slice(s,pos,pos + len);
		this.write(data);
	}
	,writeString: function(s) {
		this.write((function($this) {
			var $r;
			var ba = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
			tannus_io__$ByteArray_ByteArray_$Impl_$.writeString(ba,s);
			$r = ba;
			return $r;
		}(this)));
	}
	,__class__: tannus_io_OutputStream
};
var tannus_io__$Pointer_Pointer_$Impl_$ = {};
$hxClasses["tannus.io._Pointer.Pointer_Impl_"] = tannus_io__$Pointer_Pointer_$Impl_$;
tannus_io__$Pointer_Pointer_$Impl_$.__name__ = ["tannus","io","_Pointer","Pointer_Impl_"];
tannus_io__$Pointer_Pointer_$Impl_$.__properties__ = {set_deleter:"set_deleter",get_deleter:"get_deleter",get_set:"get_set",get_get:"get_get",get_exists:"get_exists",set__:"set__",get__:"get__",set_setter:"set_setter",get_setter:"get_setter",set_getter:"set_getter",get_getter:"get_getter",set_v:"set_v",get_v:"get_v",set_value:"set_value",get_value:"get_value",get_self:"get_self"}
tannus_io__$Pointer_Pointer_$Impl_$._new = function(g,s,d) {
	return new tannus_io__$Pointer_Ref(g,s);
};
tannus_io__$Pointer_Pointer_$Impl_$.get_self = function(this1) {
	return this1;
};
tannus_io__$Pointer_Pointer_$Impl_$.get_value = function(this1) {
	return this1.get();
};
tannus_io__$Pointer_Pointer_$Impl_$.set_value = function(this1,nv) {
	return this1.set(nv);
};
tannus_io__$Pointer_Pointer_$Impl_$.get_v = function(this1) {
	return this1.get();
};
tannus_io__$Pointer_Pointer_$Impl_$.set_v = function(this1,nv) {
	return this1.set(nv);
};
tannus_io__$Pointer_Pointer_$Impl_$.get_getter = function(this1) {
	return this1.getter;
};
tannus_io__$Pointer_Pointer_$Impl_$.set_getter = function(this1,ng) {
	return this1.getter = ng;
};
tannus_io__$Pointer_Pointer_$Impl_$.get_setter = function(this1) {
	return this1.setter;
};
tannus_io__$Pointer_Pointer_$Impl_$.set_setter = function(this1,ns) {
	return this1.setter = ns;
};
tannus_io__$Pointer_Pointer_$Impl_$.get__ = function(this1) {
	return this1.get();
};
tannus_io__$Pointer_Pointer_$Impl_$.set__ = function(this1,v) {
	return this1.set(v);
};
tannus_io__$Pointer_Pointer_$Impl_$.get_exists = function(this1) {
	return this1.get() != null;
};
tannus_io__$Pointer_Pointer_$Impl_$.get_get = function(this1) {
	return $bind(this1,this1.get);
};
tannus_io__$Pointer_Pointer_$Impl_$.get_set = function(this1) {
	return $bind(this1,this1.set);
};
tannus_io__$Pointer_Pointer_$Impl_$.get_deleter = function(this1) {
	return this1.deleter;
};
tannus_io__$Pointer_Pointer_$Impl_$.set_deleter = function(this1,nd) {
	return this1.deleter = nd;
};
tannus_io__$Pointer_Pointer_$Impl_$["delete"] = function(this1) {
	this1["delete"]();
};
tannus_io__$Pointer_Pointer_$Impl_$.to_underlying = function(this1) {
	return this1.get();
};
tannus_io__$Pointer_Pointer_$Impl_$.setvalue = function(this1,v) {
	return this1.set(v);
};
tannus_io__$Pointer_Pointer_$Impl_$.setPointer = function(this1,v) {
	return this1.set(v.get());
};
tannus_io__$Pointer_Pointer_$Impl_$.access = function(this1,v) {
	if(v != null) return this1.set(v); else return this1.get();
};
tannus_io__$Pointer_Pointer_$Impl_$.attach_str = function(this1,str) {
	var s = this1.setter;
	this1.setter = tannus_io__$Setter_Setter_$Impl_$.attach(s,str);
};
tannus_io__$Pointer_Pointer_$Impl_$.transform = function(this1,mget,mset) {
	var g = tannus_io__$Getter_Getter_$Impl_$.transform(this1.getter,mget);
	var s = tannus_io__$Setter_Setter_$Impl_$.transform(this1.setter,mset);
	return new tannus_io__$Pointer_Ref(g,s);
};
tannus_io__$Pointer_Pointer_$Impl_$.clone = function(this1) {
	return new tannus_io__$Pointer_Ref(this1.getter,this1.setter);
};
tannus_io__$Pointer_Pointer_$Impl_$.toGetter = function(this1) {
	return this1.getter;
};
tannus_io__$Pointer_Pointer_$Impl_$.toSetter = function(this1) {
	return this1.setter;
};
tannus_io__$Pointer_Pointer_$Impl_$.toString = function(this1) {
	return this1.toString();
};
tannus_io__$Pointer_Pointer_$Impl_$.iterator = function(self) {
	return $iterator(self.get())();
};
tannus_io__$Pointer_Pointer_$Impl_$.fromAccessor = function(af) {
	var g = (function(f,a1) {
		return function() {
			return f(a1);
		};
	})(af,null);
	var s = (function(f1) {
		return function(a11) {
			return f1(a11);
		};
	})(af);
	return new tannus_io__$Pointer_Ref(g,s);
};
var tannus_io__$Pointer_Ref = function(g,s,d) {
	this.getter = g;
	this.setter = s;
	this.deleter = d;
};
$hxClasses["tannus.io._Pointer.Ref"] = tannus_io__$Pointer_Ref;
tannus_io__$Pointer_Ref.__name__ = ["tannus","io","_Pointer","Ref"];
tannus_io__$Pointer_Ref.prototype = {
	get: function() {
		return this.getter();
	}
	,set: function(v) {
		return this.setter(v);
	}
	,'delete': function() {
		if(this.deleter != null) this.deleter();
	}
	,toString: function() {
		return Std.string(this.get());
	}
	,__class__: tannus_io__$Pointer_Ref
};
var tannus_io_ReadableStream = function() {
	this.dataEvent = new tannus_io_Signal();
	this.errorEvent = new tannus_io_Signal();
	this._buffer = [];
	this.opened = false;
	this.closed = false;
	this.paused = false;
};
$hxClasses["tannus.io.ReadableStream"] = tannus_io_ReadableStream;
tannus_io_ReadableStream.__name__ = ["tannus","io","ReadableStream"];
tannus_io_ReadableStream.prototype = {
	ondata: function(cb) {
		this.dataEvent.listen(cb,false);
	}
	,onerror: function(cb) {
		this.errorEvent.listen(cb,false);
	}
	,get: function(cb) {
		var _g = this;
		this.dataEvent.listen(function(data) {
			cb(data);
			_g.close();
		},true);
		this.open();
	}
	,open: function(cb) {
		this.opened = true;
	}
	,close: function() {
		this.closed = true;
	}
	,pause: function() {
		this.paused = true;
	}
	,resume: function() {
		this.paused = false;
		this.flush();
	}
	,buffer: function(d) {
		this._buffer.push(d);
	}
	,provide: function(d) {
		this.dataEvent.broadcast(d);
	}
	,write: function(d) {
		(this.paused?$bind(this,this.buffer):$bind(this,this.provide))(d);
	}
	,flush: function() {
		var _g = 0;
		var _g1 = this._buffer;
		while(_g < _g1.length) {
			var item = _g1[_g];
			++_g;
			this.dataEvent.broadcast(item);
		}
		this._buffer = [];
	}
	,__class__: tannus_io_ReadableStream
};
var tannus_io__$RegEx_RegEx_$Impl_$ = {};
$hxClasses["tannus.io._RegEx.RegEx_Impl_"] = tannus_io__$RegEx_RegEx_$Impl_$;
tannus_io__$RegEx_RegEx_$Impl_$.__name__ = ["tannus","io","_RegEx","RegEx_Impl_"];
tannus_io__$RegEx_RegEx_$Impl_$._new = function(pattern) {
	return pattern;
};
tannus_io__$RegEx_RegEx_$Impl_$.matches = function(this1,text) {
	var ma = [];
	this1.map(text,function(e) {
		var parts = [];
		var i = 0;
		var matched = true;
		while(matched) try {
			parts.push(e.matched(i));
			i++;
		} catch( err ) {
			if (err instanceof js__$Boot_HaxeError) err = err.val;
			matched = false;
			break;
		}
		ma.push(parts);
		return "";
	});
	return ma;
};
tannus_io__$RegEx_RegEx_$Impl_$.search = function(this1,s) {
	return tannus_io__$RegEx_RegEx_$Impl_$.matches(this1,s);
};
tannus_io__$RegEx_RegEx_$Impl_$.extract = function(this1,str,n) {
	if(n == null) n = 0;
	return tannus_io__$RegEx_RegEx_$Impl_$.matches(this1,str)[n];
};
tannus_io__$RegEx_RegEx_$Impl_$.extractGroups = function(this1,str,n) {
	if(n == null) n = 0;
	return tannus_io__$RegEx_RegEx_$Impl_$.matches(this1,str)[0].slice(1);
};
tannus_io__$RegEx_RegEx_$Impl_$.findAll = function(this1,s) {
	var all = [];
	this1.map(s,function(e) {
		var pos = e.matchedPos();
		all.push({ 'str' : s, 'pos' : e.matchedPos()});
		return s;
	});
	return all;
};
tannus_io__$RegEx_RegEx_$Impl_$.replace = function(this1,rtext,text) {
	return this1.map(rtext,function(e) {
		var i = 0;
		var whole = null;
		var subs = [];
		while(true) try {
			var s = this1.matched(i++);
			if(whole == null) whole = s; else subs.push(s);
		} catch( err ) {
			if (err instanceof js__$Boot_HaxeError) err = err.val;
			break;
		}
		var _t = text;
		var _g1 = 0;
		var _g = subs.length;
		while(_g1 < _g) {
			var ii = _g1++;
			_t = StringTools.replace(_t,"{{" + ii + "}}",subs[ii]);
		}
		return _t;
	});
};
tannus_io__$RegEx_RegEx_$Impl_$.toTester = function(this1) {
	return (function(f) {
		return function(s) {
			return f(s);
		};
	})($bind(this1,this1.match));
};
var tannus_io__$Setter_Setter_$Impl_$ = {};
$hxClasses["tannus.io._Setter.Setter_Impl_"] = tannus_io__$Setter_Setter_$Impl_$;
tannus_io__$Setter_Setter_$Impl_$.__name__ = ["tannus","io","_Setter","Setter_Impl_"];
tannus_io__$Setter_Setter_$Impl_$.__properties__ = {set_v:"set_v"}
tannus_io__$Setter_Setter_$Impl_$._new = function(f) {
	return f;
};
tannus_io__$Setter_Setter_$Impl_$.set_v = function(this1,nv) {
	return this1(nv);
};
tannus_io__$Setter_Setter_$Impl_$.wrap = function(this1,f) {
	var self = this1;
	this1 = function(v) {
		return f(self,v);
	};
};
tannus_io__$Setter_Setter_$Impl_$.attach = function(this1,other) {
	var f = function(s,val) {
		other(val);
		return s(val);
	};
	var self = this1;
	this1 = function(v) {
		return f(self,v);
	};
	return this1;
};
tannus_io__$Setter_Setter_$Impl_$.transform = function(this1,f) {
	return function(o) {
		var v = f(o);
		this1(v);
		return o;
	};
};
tannus_io__$Setter_Setter_$Impl_$.set = function(this1,v) {
	return this1(v);
};
var tannus_io_Signal = function() {
	this.handlers = [];
	this.ondelete = function() {
		null;
	};
};
$hxClasses["tannus.io.Signal"] = tannus_io_Signal;
tannus_io_Signal.__name__ = ["tannus","io","Signal"];
tannus_io_Signal.prototype = {
	add: function(handler) {
		this.handlers.push(handler);
	}
	,listen: function(f,once) {
		if(once == null) once = false;
		if(!once) this.add(tannus_io__$Signal_Handler.Normal(f)); else {
			var _fired = false;
			var fired = new tannus_io__$Pointer_Ref(function() {
				return _fired;
			},function(v) {
				return _fired = v;
			});
			this.add(tannus_io__$Signal_Handler.Once(f,fired));
		}
	}
	,on: function(f,once) {
		if(once == null) once = false;
		this.listen(f,once);
	}
	,once: function(f) {
		this.listen(f,true);
	}
	,when: function(test,f) {
		this.add(tannus_io__$Signal_Handler.Tested(f,test));
	}
	,times: function(count,f) {
		var _fired = 0;
		var fired = new tannus_io__$Pointer_Ref(function() {
			return _fired;
		},function(v) {
			return _fired = v;
		});
		this.add(tannus_io__$Signal_Handler.Counted(f,count,fired));
	}
	,every: function(wait,f) {
		var _rem = 0;
		var rem = new tannus_io__$Pointer_Ref(function() {
			return _rem;
		},function(v) {
			return _rem = v;
		});
		this.add(tannus_io__$Signal_Handler.Every(f,wait,rem));
	}
	,ignore: function(func) {
		var toIgnore = [];
		var _g = 0;
		var _g1 = this.handlers;
		while(_g < _g1.length) {
			var h = _g1[_g];
			++_g;
			switch(h[1]) {
			case 0:
				var f = h[2];
				if(Reflect.compareMethods(f,func)) toIgnore.push(h);
				break;
			case 3:
				var f1 = h[2];
				if(Reflect.compareMethods(f1,func)) toIgnore.push(h);
				break;
			case 4:
				var f2 = h[2];
				if(Reflect.compareMethods(f2,func)) toIgnore.push(h);
				break;
			case 1:
				var f3 = h[2];
				if(Reflect.compareMethods(f3,func)) toIgnore.push(h);
				break;
			case 2:
				var f4 = h[2];
				if(Reflect.compareMethods(f4,func)) toIgnore.push(h);
				break;
			}
		}
		var _g2 = 0;
		while(_g2 < toIgnore.length) {
			var h1 = toIgnore[_g2];
			++_g2;
			HxOverrides.remove(this.handlers,h1);
		}
	}
	,off: function(f) {
		this.ignore(f);
	}
	,clear: function() {
		this.handlers = [];
	}
	,callHandler: function(h,arg) {
		switch(h[1]) {
		case 0:
			var f = h[2];
			f(arg);
			break;
		case 3:
			var fired = h[3];
			var f1 = h[2];
			if(!fired.get()) {
				f1(arg);
				fired.set(true);
			}
			break;
		case 4:
			var test = h[3];
			var f2 = h[2];
			if(test(arg)) f2(arg);
			break;
		case 1:
			var called = h[4];
			var count = h[3];
			var f3 = h[2];
			if(called.get() <= count) {
				f3(arg);
				var v = called.get() + 1;
				called.set(v);
			}
			break;
		case 2:
			var rem = h[4];
			var wait = h[3];
			var f4 = h[2];
			if(rem.get() == wait) {
				f4(arg);
				rem.set(0);
			} else {
				var nv = rem.get() + 1;
				rem.set(nv);
			}
			break;
		}
	}
	,broadcast: function(data) {
		var _g = 0;
		var _g1 = this.handlers;
		while(_g < _g1.length) {
			var h = _g1[_g];
			++_g;
			this.callHandler(h,data);
		}
	}
	,call: function(data) {
		this.broadcast(data);
	}
	,__class__: tannus_io_Signal
};
var tannus_io__$Signal_Handler = $hxClasses["tannus.io._Signal.Handler"] = { __ename__ : ["tannus","io","_Signal","Handler"], __constructs__ : ["Normal","Counted","Every","Once","Tested"] };
tannus_io__$Signal_Handler.Normal = function(func) { var $x = ["Normal",0,func]; $x.__enum__ = tannus_io__$Signal_Handler; $x.toString = $estr; return $x; };
tannus_io__$Signal_Handler.Counted = function(func,count,fired) { var $x = ["Counted",1,func,count,fired]; $x.__enum__ = tannus_io__$Signal_Handler; $x.toString = $estr; return $x; };
tannus_io__$Signal_Handler.Every = function(func,wait,remaining) { var $x = ["Every",2,func,wait,remaining]; $x.__enum__ = tannus_io__$Signal_Handler; $x.toString = $estr; return $x; };
tannus_io__$Signal_Handler.Once = function(func,fired) { var $x = ["Once",3,func,fired]; $x.__enum__ = tannus_io__$Signal_Handler; $x.toString = $estr; return $x; };
tannus_io__$Signal_Handler.Tested = function(func,test) { var $x = ["Tested",4,func,test]; $x.__enum__ = tannus_io__$Signal_Handler; $x.toString = $estr; return $x; };
var tannus_io_VoidSignal = function() {
	this.handlers = [];
	this.ondelete = function() {
		null;
	};
	this._remove = [];
};
$hxClasses["tannus.io.VoidSignal"] = tannus_io_VoidSignal;
tannus_io_VoidSignal.__name__ = ["tannus","io","VoidSignal"];
tannus_io_VoidSignal.prototype = {
	add: function(h) {
		this.handlers.push(h);
	}
	,on: function(f) {
		this.add(tannus_io__$VoidSignal_Handler.Normal(f));
	}
	,once: function(f) {
		this.add(tannus_io__$VoidSignal_Handler.Once(f,(function() {
			var _v = false;
			return new tannus_io__$Pointer_Ref(function() {
				return _v;
			},function(v) {
				return _v = v;
			});
		})()));
	}
	,times: function(count,f) {
		this.add(tannus_io__$VoidSignal_Handler.Counted(f,count,(function() {
			var _v = 0;
			return new tannus_io__$Pointer_Ref(function() {
				return _v;
			},function(v) {
				return _v = v;
			});
		})()));
	}
	,every: function(interval,f) {
		this.add(tannus_io__$VoidSignal_Handler.Every(f,interval,(function() {
			var _v = interval;
			return new tannus_io__$Pointer_Ref(function() {
				return _v;
			},function(v) {
				return _v = v;
			});
		})()));
	}
	,ignore: function(func) {
		var ignores = [];
		var _g = 0;
		var _g1 = this.handlers;
		while(_g < _g1.length) {
			var h = _g1[_g];
			++_g;
			switch(h[1]) {
			case 0:
				var f = h[2];
				if(Reflect.compareMethods(f,func)) ignores.push(h);
				break;
			case 3:
				var f1 = h[2];
				if(Reflect.compareMethods(f1,func)) ignores.push(h);
				break;
			case 1:
				var f2 = h[2];
				if(Reflect.compareMethods(f2,func)) ignores.push(h);
				break;
			case 2:
				var f3 = h[2];
				if(Reflect.compareMethods(f3,func)) ignores.push(h);
				break;
			}
		}
		var _g2 = 0;
		while(_g2 < ignores.length) {
			var h1 = ignores[_g2];
			++_g2;
			HxOverrides.remove(this.handlers,h1);
		}
	}
	,off: function(f) {
		this.ignore(f);
	}
	,clear: function() {
		this.handlers = [];
	}
	,callHandler: function(h) {
		switch(h[1]) {
		case 0:
			var f = h[2];
			f();
			break;
		case 3:
			var fired = h[3];
			var f1 = h[2];
			if(!fired.get()) {
				f1();
				this._remove.push(h);
			}
			break;
		case 1:
			var fired1 = h[4];
			var count = h[3];
			var f2 = h[2];
			if(fired1.get() < count) {
				f2();
				var nv = fired1.get() + 1;
				fired1.set(nv);
			} else this._remove.push(h);
			break;
		case 2:
			var rem = h[4];
			var wait = h[3];
			var f3 = h[2];
			if(rem.get() == wait) {
				f3();
				rem.set(0);
			} else {
				var nv1 = rem.get() + 1;
				rem.set(nv1);
			}
			break;
		}
	}
	,call: function() {
		var _g = 0;
		var _g1 = this.handlers;
		while(_g < _g1.length) {
			var h = _g1[_g];
			++_g;
			this.callHandler(h);
		}
		var _g2 = 0;
		var _g11 = this._remove;
		while(_g2 < _g11.length) {
			var h1 = _g11[_g2];
			++_g2;
			HxOverrides.remove(this.handlers,h1);
		}
		this._remove = [];
	}
	,fire: function() {
		this.call();
	}
	,__class__: tannus_io_VoidSignal
};
var tannus_io__$VoidSignal_Handler = $hxClasses["tannus.io._VoidSignal.Handler"] = { __ename__ : ["tannus","io","_VoidSignal","Handler"], __constructs__ : ["Normal","Counted","Every","Once"] };
tannus_io__$VoidSignal_Handler.Normal = function(func) { var $x = ["Normal",0,func]; $x.__enum__ = tannus_io__$VoidSignal_Handler; $x.toString = $estr; return $x; };
tannus_io__$VoidSignal_Handler.Counted = function(func,count,fired) { var $x = ["Counted",1,func,count,fired]; $x.__enum__ = tannus_io__$VoidSignal_Handler; $x.toString = $estr; return $x; };
tannus_io__$VoidSignal_Handler.Every = function(func,wait,remaining) { var $x = ["Every",2,func,wait,remaining]; $x.__enum__ = tannus_io__$VoidSignal_Handler; $x.toString = $estr; return $x; };
tannus_io__$VoidSignal_Handler.Once = function(func,fired) { var $x = ["Once",3,func,fired]; $x.__enum__ = tannus_io__$VoidSignal_Handler; $x.toString = $estr; return $x; };
var tannus_io_WritableStream = function() {
	this.writeEvent = new tannus_io_Signal();
	this._buf = [];
	this.opened = this.closed = this.paused = false;
};
$hxClasses["tannus.io.WritableStream"] = tannus_io_WritableStream;
tannus_io_WritableStream.__name__ = ["tannus","io","WritableStream"];
tannus_io_WritableStream.prototype = {
	open: function(f) {
		this.opened = true;
	}
	,close: function(f) {
		this.closed = true;
	}
	,pause: function() {
		this.paused = true;
	}
	,resume: function() {
		if(this.paused) {
			this.paused = false;
			this.flush();
		}
	}
	,write: function(data) {
		if(this.opened && !this.closed) {
			if(this.paused) this._buf.push(data); else this.writeEvent.broadcast(data);
		} else this.error(new Error("Cannot write to closed or unopened Stream!"));
	}
	,flush: function(done) {
		var _g = 0;
		var _g1 = this._buf;
		while(_g < _g1.length) {
			var d = _g1[_g];
			++_g;
			this.writeEvent.broadcast(d);
		}
	}
	,error: function(e) {
		throw new js__$Boot_HaxeError(e);
	}
	,get_writable: function() {
		return this.opened && !this.closed;
	}
	,__class__: tannus_io_WritableStream
	,__properties__: {get_writable:"get_writable"}
};
var tannus_math_Nums = function() { };
$hxClasses["tannus.math.Nums"] = tannus_math_Nums;
tannus_math_Nums.__name__ = ["tannus","math","Nums"];
tannus_math_Nums.max = function(x,y) {
	if(x > y) return x; else return y;
};
tannus_math_Nums.min = function(x,y) {
	if(x < y) return x; else return y;
};
tannus_math_Nums.clamp = function(value,x,y) {
	var result = value;
	result = value < y?value:y;
	result = value > x?value:x;
	return result;
};
var tannus_math__$Percent_Percent_$Impl_$ = {};
$hxClasses["tannus.math._Percent.Percent_Impl_"] = tannus_math__$Percent_Percent_$Impl_$;
tannus_math__$Percent_Percent_$Impl_$.__name__ = ["tannus","math","_Percent","Percent_Impl_"];
tannus_math__$Percent_Percent_$Impl_$.__properties__ = {set_value:"set_value",get_value:"get_value"}
tannus_math__$Percent_Percent_$Impl_$._new = function(f) {
	return f;
};
tannus_math__$Percent_Percent_$Impl_$.get_value = function(this1) {
	return this1;
};
tannus_math__$Percent_Percent_$Impl_$.set_value = function(this1,nv) {
	return this1 = nv;
};
tannus_math__$Percent_Percent_$Impl_$.complement = function(this1) {
	return 100 - this1;
};
tannus_math__$Percent_Percent_$Impl_$.plus = function(this1,other) {
	return this1 + other;
};
tannus_math__$Percent_Percent_$Impl_$.minus = function(this1,other) {
	return this1 - other;
};
tannus_math__$Percent_Percent_$Impl_$.preincrement = function(this1) {
	return ++this1;
};
tannus_math__$Percent_Percent_$Impl_$.postincrement = function(this1) {
	return this1++;
};
tannus_math__$Percent_Percent_$Impl_$.decrement = function(this1) {
	return --this1;
};
tannus_math__$Percent_Percent_$Impl_$.percent = function(what,of) {
	return what / of * 100;
};
tannus_math__$Percent_Percent_$Impl_$.toString = function(this1) {
	return "" + this1 + "%";
};
var tannus_math_Random = function(seed) {
	if(seed != null) this.state = seed; else this.state = Math.floor(Math.random() * 2147483647);
};
$hxClasses["tannus.math.Random"] = tannus_math_Random;
tannus_math_Random.__name__ = ["tannus","math","Random"];
tannus_math_Random.stringSeed = function(seed) {
	var state = 0;
	var ba;
	var ba1 = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
	tannus_io__$ByteArray_ByteArray_$Impl_$.writeString(ba1,seed);
	ba = ba1;
	var $it0 = HxOverrides.iter(ba);
	while( $it0.hasNext() ) {
		var bit = $it0.next();
		seed += bit;
	}
	return new tannus_math_Random(state);
};
tannus_math_Random.prototype = {
	nextInt: function() {
		this.state = (1103515245.0 * this.state + 12345) % 2147483647;
		return this.state;
	}
	,nextFloat: function() {
		return this.nextInt() / 2147483647;
	}
	,reset: function(value) {
		this.state = value;
	}
	,randint: function(min,max) {
		return Math.floor(this.nextFloat() * (max - min + 1) + min);
	}
	,randbool: function() {
		return this.randint(0,1) == 1;
	}
	,choice: function(set) {
		return set[this.randint(0,set.length - 1)];
	}
	,shuffle: function(set) {
		var copy = set.slice();
		var result = [];
		while(copy.length != 1) {
			var el = this.choice(copy);
			HxOverrides.remove(copy,el);
			result.push(el);
		}
		return result;
	}
	,enumConstruct: function(_enum) {
		var name = this.choice(Type.getEnumConstructs(_enum));
		return (function(f,e,a1) {
			return function(a2) {
				return f(e,a1,a2);
			};
		})(Type.createEnum,_enum,name);
	}
	,__class__: tannus_math_Random
};
var tannus_math_TMath = function() { };
$hxClasses["tannus.math.TMath"] = tannus_math_TMath;
tannus_math_TMath.__name__ = ["tannus","math","TMath"];
tannus_math_TMath.clamp_Int = function(value,min,max) {
	if(value < min) return min; else if(value > max) return max; else return value;
};
tannus_math_TMath.clamp_Float = function(value,min,max) {
	if(value < min) return min; else if(value > max) return max; else return value;
};
tannus_math_TMath.sum_Float = function(list) {
	var res = null;
	var _g = 0;
	while(_g < list.length) {
		var item = list[_g];
		++_g;
		if(!(res != null)) res = item; else res = (res != null?res:res) + item;
	}
	return res != null?res:res;
};
tannus_math_TMath.toRadians = function(degrees) {
	return degrees * 3.141592653589793 / 180;
};
tannus_math_TMath.toDegrees = function(radians) {
	return radians * 180 / 3.141592653589793;
};
tannus_math_TMath.angleBetween = function(x1,y1,x2,y2) {
	return tannus_math_TMath.toDegrees(Math.atan2(y2 - y1,x2 - x1));
};
tannus_math_TMath.max = function(a,b) {
	if(a > b) return a; else return b;
};
tannus_math_TMath.min = function(a,b) {
	if(a < b) return a; else return b;
};
tannus_math_TMath.maxr = function(nums) {
	var m = null;
	var $it0 = $iterator(nums)();
	while( $it0.hasNext() ) {
		var n = $it0.next();
		if(m == null) m = n;
		m = n > m?n:m;
	}
	return m;
};
tannus_math_TMath.minr = function(nums) {
	var m = null;
	var _g = 0;
	while(_g < nums.length) {
		var n = nums[_g];
		++_g;
		if(m == null) m = n;
		m = n < m?n:m;
	}
	return m;
};
tannus_math_TMath.range = function(nums) {
	var mi = null;
	var ma = null;
	var _g = 0;
	while(_g < nums.length) {
		var n = nums[_g];
		++_g;
		if(mi == null) mi = n;
		if(ma == null) ma = n;
		mi = n < mi?n:mi;
		ma = n > ma?n:ma;
	}
	return new tannus_ds_Range(mi,ma);
};
tannus_math_TMath.lerp = function(a,b,x) {
	return a + x * (b - a);
};
tannus_math_TMath.i = function(f) {
	return f | 0;
};
tannus_math_TMath.roundFloat = function(f,digit) {
	var n = Math.pow(10,digit);
	var r = Math.round(f * n) / n;
	return r;
};
tannus_math_TMath.average = function(values) {
	var sum = 0;
	var _g = 0;
	while(_g < values.length) {
		var n = values[_g];
		++_g;
		sum += n;
	}
	return sum / values.length;
};
tannus_math_TMath.largest = function(items,predicate) {
	var highest = 0;
	var $it0 = $iterator(items)();
	while( $it0.hasNext() ) {
		var item = $it0.next();
		highest = tannus_math_TMath.max(highest,predicate(item));
	}
	return highest;
};
tannus_math_TMath.smallest = function(items,predicate) {
	var lowest = 0;
	var $it0 = $iterator(items)();
	while( $it0.hasNext() ) {
		var item = $it0.next();
		lowest = tannus_math_TMath.min(lowest,predicate(item));
	}
	return lowest;
};
tannus_math_TMath.minmax = function(items,predicate) {
	var res = new tannus_ds_FloatRange(NaN,NaN);
	var $it0 = $iterator(items)();
	while( $it0.hasNext() ) {
		var item = $it0.next();
		var score = predicate(item);
		if(res.max < score || isNaN(res.max)) res.max = score; else if(res.min > score || isNaN(res.min)) res.min = score;
		if(res.min > res.max) {
			var _t = res.max;
			res.max = res.min;
			res.min = _t;
		}
	}
	return res;
};
tannus_math_TMath.sign = function(value) {
	if(value < 0) return -1; else if(value > 0) return 1; else return 0;
};
tannus_math_TMath.sampleVariance = function(data) {
	var sampleSize = data.length;
	if(sampleSize < 2) return 0;
	var mean = tannus_math_TMath.average(data);
	return tannus_math_TMath.sum_Float(data.map(function(val) {
		return Math.pow(val - mean,2);
	})) / (sampleSize - 1);
};
tannus_math_TMath.standardDeviation = function(data) {
	return Math.sqrt(tannus_math_TMath.sampleVariance(data));
};
var tannus_media__$Duration_Duration_$Impl_$ = {};
$hxClasses["tannus.media._Duration.Duration_Impl_"] = tannus_media__$Duration_Duration_$Impl_$;
tannus_media__$Duration_Duration_$Impl_$.__name__ = ["tannus","media","_Duration","Duration_Impl_"];
tannus_media__$Duration_Duration_$Impl_$.__properties__ = {set_seconds:"set_seconds",get_seconds:"get_seconds",set_minutes:"set_minutes",get_minutes:"get_minutes",set_hours:"set_hours",get_hours:"get_hours",get_totalHours:"get_totalHours",get_totalMinutes:"get_totalMinutes",set_totalSeconds:"set_totalSeconds",get_totalSeconds:"get_totalSeconds"}
tannus_media__$Duration_Duration_$Impl_$._new = function(s,m,h) {
	if(h == null) h = 0;
	if(m == null) m = 0;
	if(s == null) s = 0;
	return { 'seconds' : s, 'minutes' : m, 'hours' : h};
};
tannus_media__$Duration_Duration_$Impl_$.toString = function(this1) {
	var bits = [];
	if(this1.hours > 0) bits.push("" + this1.hours + "hr");
	if(this1.minutes > 0) bits.push("" + this1.minutes + "min");
	if(this1.seconds > 0) bits.push("" + this1.seconds + "sec");
	return bits.join(" ");
};
tannus_media__$Duration_Duration_$Impl_$.add = function(this1,other) {
	return { 'seconds' : this1.seconds + other.seconds, 'minutes' : this1.minutes + other.minutes, 'hours' : this1.hours + other.hours};
};
tannus_media__$Duration_Duration_$Impl_$.get_totalSeconds = function(this1) {
	return 3600 * this1.hours + 60 * this1.minutes + this1.seconds;
};
tannus_media__$Duration_Duration_$Impl_$.set_totalSeconds = function(this1,v) {
	var s = v;
	var m = 0;
	var h = 0;
	if(s >= 60) {
		m = Math.round(s / 60);
		s = s % 60;
	}
	if(m >= 60) {
		h = Math.round(m / 60);
		m = m % 60;
	}
	this1.seconds = s;
	this1.minutes = m;
	this1.hours = h;
	return 3600 * this1.hours + 60 * this1.minutes + this1.seconds;
};
tannus_media__$Duration_Duration_$Impl_$.get_totalMinutes = function(this1) {
	var res = 0;
	res += 60 * this1.hours;
	res += this1.minutes;
	res += this1.seconds / 60.0;
	return res;
};
tannus_media__$Duration_Duration_$Impl_$.get_totalHours = function(this1) {
	var res = 0;
	res += this1.hours;
	res += (function($this) {
		var $r;
		var res1 = 0;
		res1 += 60 * this1.hours;
		res1 += this1.minutes;
		res1 += this1.seconds / 60.0;
		$r = res1;
		return $r;
	}(this)) / 60.0;
	return res;
};
tannus_media__$Duration_Duration_$Impl_$.get_hours = function(this1) {
	return this1.hours;
};
tannus_media__$Duration_Duration_$Impl_$.set_hours = function(this1,nh) {
	return this1.hours = nh;
};
tannus_media__$Duration_Duration_$Impl_$.get_minutes = function(this1) {
	return this1.minutes;
};
tannus_media__$Duration_Duration_$Impl_$.set_minutes = function(this1,nm) {
	return this1.minutes = nm;
};
tannus_media__$Duration_Duration_$Impl_$.get_seconds = function(this1) {
	return this1.seconds;
};
tannus_media__$Duration_Duration_$Impl_$.set_seconds = function(this1,ns) {
	return this1.seconds = ns;
};
tannus_media__$Duration_Duration_$Impl_$.fromSecondsI = function(i) {
	var d = { 'seconds' : 0, 'minutes' : 0, 'hours' : 0};
	var s = i;
	var m = 0;
	var h = 0;
	if(s >= 60) {
		m = Math.round(s / 60);
		s = s % 60;
	}
	if(m >= 60) {
		h = Math.round(m / 60);
		m = m % 60;
	}
	d.seconds = s;
	d.minutes = m;
	d.hours = h;
	3600 * d.hours + 60 * d.minutes + d.seconds;
	return d;
};
tannus_media__$Duration_Duration_$Impl_$.fromSecondsF = function(i) {
	var d = { 'seconds' : 0, 'minutes' : 0, 'hours' : 0};
	var v = Math.floor(i);
	var s = v;
	var m = 0;
	var h = 0;
	if(s >= 60) {
		m = Math.round(s / 60);
		s = s % 60;
	}
	if(m >= 60) {
		h = Math.round(m / 60);
		m = m % 60;
	}
	d.seconds = s;
	d.minutes = m;
	d.hours = h;
	3600 * d.hours + 60 * d.minutes + d.seconds;
	return d;
};
var tannus_media_Playlist = function() {
	this.title = "My Playlist";
	this.creator = "Ryan Davis";
	this.annotation = "";
	this.date = new Date();
	this.tracks = [];
};
$hxClasses["tannus.media.Playlist"] = tannus_media_Playlist;
tannus_media_Playlist.__name__ = ["tannus","media","Playlist"];
tannus_media_Playlist.prototype = {
	addTrack: function(track) {
		if(track.index > -1) this.tracks.splice(track.index,0,track); else this.tracks.push(track);
		this.updateIndices();
		return track;
	}
	,removeTrack: function(track) {
		var status = HxOverrides.remove(this.tracks,track);
		this.updateIndices();
		return status;
	}
	,updateIndices: function() {
		var _g = 0;
		var _g1 = this.tracks;
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			var i = t.index = HxOverrides.indexOf(this.tracks,t,0);
		}
	}
	,sort: function(pred) {
		var track_list = this.tracks.slice();
		haxe_ds_ArraySort.sort(track_list,pred);
		this.tracks = track_list;
		this.updateIndices();
	}
	,getTrackByIndex: function(i) {
		return this.tracks[i];
	}
	,getTrackByLocation: function(loc) {
		var _g = 0;
		var _g1 = this.tracks;
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			if(t.location == loc) return t;
		}
		return null;
	}
	,getTrackByName: function(name) {
		var _g = 0;
		var _g1 = this.tracks;
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			if(t.title == name) return t;
		}
		return null;
	}
	,getTrackById: function(id) {
		var _g = 0;
		var _g1 = this.tracks;
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			if(t.id == id) return t;
		}
		return null;
	}
	,get_length: function() {
		return this.tracks.length;
	}
	,__class__: tannus_media_Playlist
	,__properties__: {get_length:"get_length"}
};
var tannus_media_Track = function(nam,loc) {
	this.id = tannus_ds_Memory.allocRandomId(12);
	this.index = -1;
	this.duration = { 'seconds' : 0, 'minutes' : 0, 'hours' : 0};
	this.title = nam;
	this.location = loc;
	this.meta = new haxe_ds_StringMap();
};
$hxClasses["tannus.media.Track"] = tannus_media_Track;
tannus_media_Track.__name__ = ["tannus","media","Track"];
tannus_media_Track.prototype = {
	dispose: function() {
		tannus_ds_Memory.freeRandomId(this.id);
	}
	,__class__: tannus_media_Track
};
var tannus_nore_Check = $hxClasses["tannus.nore.Check"] = { __ename__ : ["tannus","nore","Check"], __constructs__ : ["NoCheck","IDCheck","TypeCheck","LooseTypeCheck","FieldExistsCheck","FieldValueCheck","FieldSubChecks","GroupCheck","HelperCheck","TupleCheck","InverseCheck","EitherCheck","TernaryCheck"] };
tannus_nore_Check.NoCheck = ["NoCheck",0];
tannus_nore_Check.NoCheck.toString = $estr;
tannus_nore_Check.NoCheck.__enum__ = tannus_nore_Check;
tannus_nore_Check.IDCheck = function(id) { var $x = ["IDCheck",1,id]; $x.__enum__ = tannus_nore_Check; $x.toString = $estr; return $x; };
tannus_nore_Check.TypeCheck = function(typename) { var $x = ["TypeCheck",2,typename]; $x.__enum__ = tannus_nore_Check; $x.toString = $estr; return $x; };
tannus_nore_Check.LooseTypeCheck = function(typename) { var $x = ["LooseTypeCheck",3,typename]; $x.__enum__ = tannus_nore_Check; $x.toString = $estr; return $x; };
tannus_nore_Check.FieldExistsCheck = function(field) { var $x = ["FieldExistsCheck",4,field]; $x.__enum__ = tannus_nore_Check; $x.toString = $estr; return $x; };
tannus_nore_Check.FieldValueCheck = function(field,op,value) { var $x = ["FieldValueCheck",5,field,op,value]; $x.__enum__ = tannus_nore_Check; $x.toString = $estr; return $x; };
tannus_nore_Check.FieldSubChecks = function(field,sub) { var $x = ["FieldSubChecks",6,field,sub]; $x.__enum__ = tannus_nore_Check; $x.toString = $estr; return $x; };
tannus_nore_Check.GroupCheck = function(subchecks) { var $x = ["GroupCheck",7,subchecks]; $x.__enum__ = tannus_nore_Check; $x.toString = $estr; return $x; };
tannus_nore_Check.HelperCheck = function(helper,args) { var $x = ["HelperCheck",8,helper,args]; $x.__enum__ = tannus_nore_Check; $x.toString = $estr; return $x; };
tannus_nore_Check.TupleCheck = function(tup) { var $x = ["TupleCheck",9,tup]; $x.__enum__ = tannus_nore_Check; $x.toString = $estr; return $x; };
tannus_nore_Check.InverseCheck = function(check) { var $x = ["InverseCheck",10,check]; $x.__enum__ = tannus_nore_Check; $x.toString = $estr; return $x; };
tannus_nore_Check.EitherCheck = function(left,right) { var $x = ["EitherCheck",11,left,right]; $x.__enum__ = tannus_nore_Check; $x.toString = $estr; return $x; };
tannus_nore_Check.TernaryCheck = function(condition,ifTrue,ifFalse) { var $x = ["TernaryCheck",12,condition,ifTrue,ifFalse]; $x.__enum__ = tannus_nore_Check; $x.toString = $estr; return $x; };
var tannus_nore_Compiler = function() {
	this.functions = [];
	this.checks = [];
	this.operators = new haxe_ds_StringMap();
	this.helpers = new haxe_ds_StringMap();
	this.initializeOperators();
	this.initializeHelpers();
};
$hxClasses["tannus.nore.Compiler"] = tannus_nore_Compiler;
tannus_nore_Compiler.__name__ = ["tannus","nore","Compiler"];
tannus_nore_Compiler.compile = function(ast) {
	var compiler = new tannus_nore_Compiler();
	return compiler.compileAST(ast);
};
tannus_nore_Compiler.prototype = {
	push: function(checker) {
		this.functions.push(checker);
	}
	,operator: function(symbol,func) {
		{
			this.operators.set(symbol,func);
			func;
		}
	}
	,initializeOperators: function() {
		{
			this.operators.set("==",function(left,right) {
				return left == right;
			});
			(function(left,right) {
				return left == right;
			});
		}
		{
			this.operators.set("!=",function(left1,right1) {
				return left1 != right1;
			});
			(function(left1,right1) {
				return left1 != right1;
			});
		}
		{
			this.operators.set(">",function(left2,right2) {
				return left2 > right2;
			});
			(function(left2,right2) {
				return left2 > right2;
			});
		}
		{
			this.operators.set("<",function(left3,right3) {
				return left3 < right3;
			});
			(function(left3,right3) {
				return left3 < right3;
			});
		}
		{
			this.operators.set(">=",function(left4,right4) {
				return left4 >= right4;
			});
			(function(left4,right4) {
				return left4 >= right4;
			});
		}
		{
			this.operators.set("<=",function(left5,right5) {
				return left5 <= right5;
			});
			(function(left5,right5) {
				return left5 <= right5;
			});
		}
		{
			this.operators.set("^=",function(left6,right6) {
				return StringTools.startsWith(left6,right6);
			});
			(function(left6,right6) {
				return StringTools.startsWith(left6,right6);
			});
		}
		{
			this.operators.set("$=",function(left7,right7) {
				return StringTools.endsWith(left7,right7);
			});
			(function(left7,right7) {
				return StringTools.endsWith(left7,right7);
			});
		}
		{
			this.operators.set("*=",function(left8,right8) {
				return Std.string(left8).indexOf(right8) != -1;
			});
			(function(left8,right8) {
				return Std.string(left8).indexOf(right8) != -1;
			});
		}
	}
	,helper: function(name,func) {
		var _g1 = this;
		var wrapper = function(target,vargs) {
			var args = [];
			var _g = 0;
			while(_g < vargs.length) {
				var val = vargs[_g];
				++_g;
				var getter = _g1.compileValue(val);
				var result = getter(target);
				args.push(result);
			}
			return func(target,args);
		};
		{
			this.helpers.set(name,wrapper);
			wrapper;
		}
	}
	,initializeHelpers: function() {
		tannus_nore_Compiler.initHelpers.broadcast($bind(this,this.helper));
		var iterate = function(o) {
			var iter = Reflect.getProperty(o,"iterator");
			if(iter != null) {
				var callable = Reflect.isFunction(iter);
				if(callable) try {
					var res = Reflect.callMethod(o,iter,[]);
					if(res != null) return res; else return null;
				} catch( err ) {
					if (err instanceof js__$Boot_HaxeError) err = err.val;
					if( js_Boot.__instanceof(err,String) ) {
						return null;
					} else throw(err);
				} else return null;
			} else return null;
		};
		var has = function(o1,args) {
			if(typeof(o1) == "string") {
				var str = Std.string(o1);
				var _g = 0;
				while(_g < args.length) {
					var a = args[_g];
					++_g;
					var s = Std.string(a);
					if(str.indexOf(s) != -1) return true;
				}
				return false;
			} else {
				var iter1 = iterate(o1);
				if(iter1 != null) {
					var values;
					var _g1 = [];
					while( iter1.hasNext() ) {
						var x = iter1.next();
						_g1.push(x);
					}
					values = _g1;
					var _g11 = 0;
					while(_g11 < args.length) {
						var a1 = args[_g11];
						++_g11;
						if(Lambda.has(values,a1)) return true;
					}
					return false;
				} else return false;
			}
		};
		this.helper("has",has);
		this.helper("contains",has);
	}
	,compileValue: function(value) {
		switch(value[1]) {
		case 0:
			var num = value[2];
			return function(o) {
				return num;
			};
		case 1:
			var str = value[2];
			return function(o1) {
				return str;
			};
		case 5:
			var vals = value[2];
			var vgetters;
			var _g = [];
			var _g1 = 0;
			while(_g1 < vals.length) {
				var v = vals[_g1];
				++_g1;
				_g.push(this.compileValue(v));
			}
			vgetters = _g;
			return function(o2) {
				var _g11 = [];
				var _g2 = 0;
				while(_g2 < vgetters.length) {
					var f = vgetters[_g2];
					++_g2;
					_g11.push(f(o2));
				}
				return _g11;
			};
		case 2:
			var field = value[2];
			var getter = (function(f1,a1) {
				return function(o3) {
					return f1(o3,a1);
				};
			})(Reflect.getProperty,field);
			return function(o4) {
				return getter(o4);
			};
		case 3:
			var index = value[2];
			return function(o5) {
				try {
					var arr;
					arr = js_Boot.__cast(o5 , Array);
					return arr[index];
				} catch( err ) {
					if (err instanceof js__$Boot_HaxeError) err = err.val;
					if( js_Boot.__instanceof(err,String) ) {
						try {
							var s = o5;
							return s.charAt(index);
						} catch( err1 ) {
							if (err1 instanceof js__$Boot_HaxeError) err1 = err1.val;
							if( js_Boot.__instanceof(err1,String) ) {
								throw new js__$Boot_HaxeError("TypeError: Cannot access index " + index + " of " + Std.string(o5) + "!");
							} else throw(err1);
						}
					} else throw(err);
				}
			};
		default:
			throw new js__$Boot_HaxeError("Unable to handle " + Std.string(value) + "!");
		}
	}
	,compileValueChecker: function(val,checker) {
		switch(val[1]) {
		case 0:
			var num = val[2];
			return function(o,v) {
				return checker(v,num);
			};
		case 1:
			var str = val[2];
			return function(o1,v1) {
				return checker(v1,str);
			};
		case 5:
			var vals = val[2];
			var vgetters;
			var _g = [];
			var _g1 = 0;
			while(_g1 < vals.length) {
				var vv = vals[_g1];
				++_g1;
				_g.push(this.compileValue(vv));
			}
			vgetters = _g;
			return function(o2,v2) {
				var _g11 = 0;
				while(_g11 < vgetters.length) {
					var f = vgetters[_g11];
					++_g11;
					var validated = checker(v2,f(o2));
					if(!validated) return false;
				}
				return true;
			};
		case 4:
			var index = val[3];
			var field = val[2];
			var getter = this.compileValue(val);
			return function(o3,v3) {
				var p = getter(o3);
				return checker(v3,p);
			};
		case 2:
			var field1 = val[2];
			var getter1 = this.compileValue(val);
			return function(o4,v4) {
				var p1 = getter1(o4);
				return checker(v4,p1);
			};
		case 3:
			var index1 = val[2];
			var getter2 = this.compileValue(val);
			return function(o5,v5) {
				var p2 = getter2(o5);
				return checker(v5,p2);
			};
		}
	}
	,compileCheck: function(check) {
		var _g = this;
		switch(check[1]) {
		case 0:
			return function(o) {
				return true;
			};
		case 1:
			var id = check[2];
			return (function(f) {
				return function(a1) {
					return f(a1);
				};
			})(this.check_id(id));
		case 2:
			var typename = check[2];
			return (function(f1) {
				return function(a11) {
					return f1(a11);
				};
			})(this.type_check(typename));
		case 3:
			var typename1 = check[2];
			return (function(f2) {
				return function(a12) {
					return f2(a12);
				};
			})(this.loose_type_check(typename1));
		case 4:
			var field = check[2];
			return (function(f3) {
				return function(a13) {
					return f3(a13);
				};
			})(this.field_exists_check(field));
		case 5:
			var val = check[4];
			var operation = check[3];
			var field1 = check[2];
			return (function(f4) {
				return function(a14) {
					return f4(a14);
				};
			})(this.field_value_check(field1,operation,val));
		case 6:
			var checks = check[3];
			var field2 = check[2];
			return (function(f5) {
				return function(a15) {
					return f5(a15);
				};
			})(this.field_sub_checks(field2,checks));
		case 10:
			var check1 = check[2];
			var checker = this.compileCheck(check1);
			return function(o1) {
				return !checker(o1);
			};
		case 11:
			var two = check[3];
			var one = check[2];
			var oner = this.compileCheck(one);
			var twoer = this.compileCheck(two);
			return function(o2) {
				return oner(o2) || twoer(o2);
			};
		case 7:
			var subs = check[2];
			var checker1 = tannus_nore_Compiler.compile(subs);
			return checker1;
		case 12:
			var ifFalseCheck = check[4];
			var ifTrueCheck = check[3];
			var conCheck = check[2];
			var con = this.compileCheck(conCheck);
			var ifTrue = this.compileCheck(ifTrueCheck);
			var ifFalse = this.compileCheck(ifFalseCheck);
			return function(o3) {
				if(con(o3)) return ifTrue(o3); else return ifFalse(o3);
			};
		case 8:
			var vargs = check[3];
			var helper = check[2];
			var args = [];
			if(vargs != null) args = vargs;
			return function(o4) {
				if(_g.helpers.exists(helper)) {
					var func = _g.helpers.get(helper);
					if(Reflect.isFunction(func)) try {
						var result = func(o4,args);
						return result;
					} catch( err ) {
						if (err instanceof js__$Boot_HaxeError) err = err.val;
						if( js_Boot.__instanceof(err,String) ) {
							console.log("Error invoking Helper-Function: " + err);
							return false;
						} else throw(err);
					} else return false;
				} else {
					var prop = Reflect.getProperty(o4,helper);
					if(prop != null) {
						if(Reflect.isFunction(prop)) try {
							var dyn_result = Reflect.callMethod(o4,prop,args);
							if(dyn_result == null) return false;
							return dyn_result == true;
						} catch( err1 ) {
							if (err1 instanceof js__$Boot_HaxeError) err1 = err1.val;
							if( js_Boot.__instanceof(err1,String) ) {
								return false;
							} else throw(err1);
						} else {
							var typ = tannus_internal_TypeTools.typename(prop);
							switch(typ) {
							case "Number":
								return prop > 0;
							case "Bool":
								return prop == true;
							default:
								return true;
							}
						}
					} else return false;
				}
			};
		default:
			throw new js__$Boot_HaxeError("UnknownCheckError: Cannot compile " + Std.string(check) + "!");
		}
	}
	,compileAST: function(ast) {
		var _g = this;
		this.functions = [];
		this.checks = [];
		this.checks = ast;
		var _g1 = 0;
		var _g11 = this.checks;
		while(_g1 < _g11.length) {
			var check = _g11[_g1];
			++_g1;
			var func = this.compileCheck(check);
			this.functions.push(func);
		}
		return function(o) {
			var _g12 = 0;
			var _g2 = _g.functions;
			while(_g12 < _g2.length) {
				var f = _g2[_g12];
				++_g12;
				var passed = f(o);
				if(!passed) return false;
			}
			return true;
		};
	}
	,reset: function() {
		this.functions = [];
		this.checks = [];
	}
	,check_id: function(id) {
		var success = false;
		var checker = function(l,r) {
			var r1 = l == r;
			if(r1) success = true;
			return r1;
		};
		var idcheck = this.compileValueChecker(id,checker);
		return function(o) {
			success = false;
			var id1 = Std.string(Reflect.getProperty(o,"id"));
			idcheck(o,id1);
			return success;
		};
	}
	,type_check: function(typename) {
		return function(o) {
			return tannus_internal_TypeTools.typename(o) == typename;
		};
	}
	,loose_type_check: function(name) {
		return function(o) {
			var h = tannus_internal_TypeTools.hierarchy(o);
			return Lambda.has(h,name);
		};
	}
	,field_exists_check: function(field) {
		var getter = (function(f,a1) {
			return function(o) {
				return f(o,a1);
			};
		})(Reflect.getProperty,field);
		return function(o1) {
			return getter(o1) != null;
		};
	}
	,field_value_check: function(field,op,value) {
		var fgetter = (function(f,a1) {
			return function(o) {
				return f(o,a1);
			};
		})(Reflect.getProperty,field);
		var opfunc = this.operators.get(op);
		var vgetter = this.compileValue(value);
		return function(o1) {
			return opfunc(fgetter(o1),vgetter(o1));
		};
	}
	,field_sub_checks: function(field,checks) {
		var fgetter = (function(f,a1) {
			return function(o) {
				return f(o,a1);
			};
		})(Reflect.getProperty,field);
		var check = tannus_nore_Compiler.compile(checks);
		return function(o1) {
			var param = fgetter(o1);
			return check(param);
		};
	}
	,__class__: tannus_nore_Compiler
};
var tannus_nore_Lexer = function() {
};
$hxClasses["tannus.nore.Lexer"] = tannus_nore_Lexer;
tannus_nore_Lexer.__name__ = ["tannus","nore","Lexer"];
tannus_nore_Lexer.lex = function(s) {
	return new tannus_nore_Lexer().lexString(s);
};
tannus_nore_Lexer.log = function(x) {
	null;
};
tannus_nore_Lexer.prototype = {
	token: function(last) {
		try {
			var c = this.source.next();
			if(Lambda.has([9,10,11,12,13,32],c)) return null; else if(tannus_io__$Byte_Byte_$Impl_$.equalsi(c,34) || tannus_io__$Byte_Byte_$Impl_$.equalsi(c,39)) {
				var delimiter = c;
				var str = "";
				var escaped = false;
				while(true) try {
					var bit = this.source.next();
					if(escaped) {
						str += String.fromCharCode(bit);
						escaped = false;
					} else if(tannus_io__$Byte_Byte_$Impl_$.equalsi(bit,92)) escaped = true; else if(tannus_io__$Byte_Byte_$Impl_$.equalsi(bit,delimiter)) break; else str += String.fromCharCode(bit);
				} catch( err ) {
					if (err instanceof js__$Boot_HaxeError) err = err.val;
					if( js_Boot.__instanceof(err,String) ) {
						if(err + "" == "Eof") throw new js__$Boot_HaxeError("Unterminated String"); else throw new js__$Boot_HaxeError(err);
					} else throw(err);
				}
				var tk = tannus_nore_Token.TString(str);
				return tk;
			} else if(c >= 65 && c <= 90 || c >= 97 && c <= 122) {
				var ident = String.fromCharCode(c) + "";
				while(true) try {
					var bit1 = this.source.next();
					if(bit1 >= 48 && bit1 <= 57 || (bit1 >= 65 && bit1 <= 90 || bit1 >= 97 && bit1 <= 122) || tannus_io__$Byte_Byte_$Impl_$.equalsi(bit1,46)) ident += String.fromCharCode(bit1); else {
						this.source.back(bit1);
						break;
					}
				} catch( err1 ) {
					if (err1 instanceof js__$Boot_HaxeError) err1 = err1.val;
					if( js_Boot.__instanceof(err1,String) ) {
						if(err1 + "" == "Eof") return tannus_nore_Token.TIdent(ident); else throw new js__$Boot_HaxeError(err1);
					} else throw(err1);
				}
				var tk1 = tannus_nore_Token.TIdent(ident);
				return tk1;
			} else if(c >= 48 && c <= 57) {
				var num_str = String.fromCharCode(c) + "";
				var format = 0;
				var ltrCodes = [97,98,99,100,101,102,65,66,67,68,69,70];
				while(true) try {
					var bit2 = this.source.next();
					if(bit2 >= 48 && bit2 <= 57) num_str += String.fromCharCode(bit2); else if(tannus_io__$Byte_Byte_$Impl_$.equalss(bit2,".")) {
						if(format == 0) {
							format = 1;
							num_str += String.fromCharCode(bit2);
						} else throw new js__$Boot_HaxeError("Unexpected \".\"");
					} else if(tannus_io__$Byte_Byte_$Impl_$.equalss(bit2,"x") || tannus_io__$Byte_Byte_$Impl_$.equalss(bit2,"X")) {
						if(num_str == "0" && format == 0) {
							format = 2;
							num_str += String.fromCharCode(bit2);
						} else throw new js__$Boot_HaxeError("Unexpected \"x\"");
					} else if(format == 2 && Lambda.has(ltrCodes,bit2)) num_str += (String.fromCharCode(bit2) + "").toUpperCase(); else {
						this.source.back(bit2);
						break;
					}
				} catch( err2 ) {
					if (err2 instanceof js__$Boot_HaxeError) err2 = err2.val;
					if( js_Boot.__instanceof(err2,String) ) {
						if(err2 + "" == "Eof") {
							if(StringTools.endsWith(num_str,".") || StringTools.endsWith(num_str,"x") || StringTools.endsWith(num_str,"X")) throw new js__$Boot_HaxeError("Unexpected end of input"); else {
								var num1;
								switch(format) {
								case 0:case 1:
									num1 = parseFloat(num_str);
									break;
								case 2:
									num1 = Std.parseInt(num_str) + 0.0;
									break;
								default:
									throw new js__$Boot_HaxeError("Unknown numeric-declaration format " + format);
								}
								var tk3 = tannus_nore_Token.TNumber(num1);
								return tk3;
							}
						} else throw new js__$Boot_HaxeError(err2);
					} else throw(err2);
				}
				var num;
				switch(format) {
				case 0:case 1:
					num = parseFloat(num_str);
					break;
				case 2:
					num = Std.parseInt(num_str) + 0.0;
					break;
				default:
					throw new js__$Boot_HaxeError("Unknown numeric-declaration format " + format);
				}
				var tk2 = tannus_nore_Token.TNumber(num);
				return tk2;
			} else if(this.isOperator(c)) {
				var op_str = String.fromCharCode(c) + "";
				while(true) try {
					var bit3 = this.source.next();
					if(this.isOperator(bit3)) op_str += String.fromCharCode(bit3); else {
						this.source.back(bit3);
						break;
					}
				} catch( err3 ) {
					if (err3 instanceof js__$Boot_HaxeError) err3 = err3.val;
					if( js_Boot.__instanceof(err3,String) ) {
						if(err3 + "" == "Eof") break; else throw new js__$Boot_HaxeError(err3);
					} else throw(err3);
				}
				var tk4 = tannus_nore_Token.TOperator(op_str);
				return tk4;
			} else if(tannus_io__$Byte_Byte_$Impl_$.equalss(c,"[")) {
				var content = this.group(91,93);
				var nodes = new tannus_nore_Lexer().lexString(content);
				switch(nodes.length) {
				case 1:
					switch(nodes[0][1]) {
					case 3:
						var n = nodes[0][2];
						return tannus_nore_Token.TArrayAccess(n);
					default:
						this.tree.push(tannus_nore_Token.TOBracket);
						var _g = 0;
						while(_g < nodes.length) {
							var node = nodes[_g];
							++_g;
							this.tree.push(node);
						}
						this.tree.push(tannus_nore_Token.TCBracket);
						return null;
					}
					break;
				case 3:
					switch(nodes[0][1]) {
					case 3:
						switch(nodes[1][1]) {
						case 10:
							switch(nodes[2][1]) {
							case 3:
								var start = nodes[0][2];
								var end = nodes[2][2];
								return tannus_nore_Token.TRangeAccess(start,end);
							default:
								this.tree.push(tannus_nore_Token.TOBracket);
								var _g1 = 0;
								while(_g1 < nodes.length) {
									var node1 = nodes[_g1];
									++_g1;
									this.tree.push(node1);
								}
								this.tree.push(tannus_nore_Token.TCBracket);
								return null;
							}
							break;
						default:
							this.tree.push(tannus_nore_Token.TOBracket);
							var _g2 = 0;
							while(_g2 < nodes.length) {
								var node2 = nodes[_g2];
								++_g2;
								this.tree.push(node2);
							}
							this.tree.push(tannus_nore_Token.TCBracket);
							return null;
						}
						break;
					default:
						this.tree.push(tannus_nore_Token.TOBracket);
						var _g3 = 0;
						while(_g3 < nodes.length) {
							var node3 = nodes[_g3];
							++_g3;
							this.tree.push(node3);
						}
						this.tree.push(tannus_nore_Token.TCBracket);
						return null;
					}
					break;
				default:
					this.tree.push(tannus_nore_Token.TOBracket);
					var _g4 = 0;
					while(_g4 < nodes.length) {
						var node4 = nodes[_g4];
						++_g4;
						this.tree.push(node4);
					}
					this.tree.push(tannus_nore_Token.TCBracket);
					return null;
				}
			} else if(tannus_io__$Byte_Byte_$Impl_$.equalss(c,"{")) try {
				var content1 = this.group(123,125);
				var nodes1 = new tannus_nore_Lexer().lexString(content1);
				this.push(tannus_nore_Token.TSub(nodes1));
			} catch( err4 ) {
				if (err4 instanceof js__$Boot_HaxeError) err4 = err4.val;
				console.log(err4);
			} else if(tannus_io__$Byte_Byte_$Impl_$.equalss(c,"(")) {
				console.log("Encountering either a group or a tuple!");
				var content2 = this.group(40,41);
				var nodes2 = new tannus_nore_Lexer().lexString(content2);
				var subtree = [];
				var tup = [];
				var i = 0;
				var mode = 0;
				var last1 = null;
				while(true) {
					var t = nodes2[i];
					if(t == null) {
						if(last1 != null) subtree.push(last1);
						if(subtree.length > 0) switch(mode) {
						case 0:
							null;
							break;
						case 1:
							tup.push(subtree);
							subtree = [];
							break;
						default:
							throw new js__$Boot_HaxeError("WTFError: Got a \"mode\" of " + mode + "! How??");
						}
						break;
					}
					if(t != null) switch(t[1]) {
					case 13:
						mode = 1;
						if(last1 != null) {
							subtree.push(last1);
							last1 = null;
						}
						if(subtree.length > 0) {
							tup.push(subtree);
							subtree = [];
						} else throw new js__$Boot_HaxeError("SyntaxError: Unexpected \",\"!");
						break;
					default:
						if(mode == 0) {
							if(i == 0) last1 = t; else {
								if(last1 != null) {
									subtree.push(last1);
									last1 = null;
								}
								subtree.push(t);
							}
						} else if(mode == 1) subtree.push(t);
					} else if(mode == 0) {
						if(i == 0) last1 = t; else {
							if(last1 != null) {
								subtree.push(last1);
								last1 = null;
							}
							subtree.push(t);
						}
					} else if(mode == 1) subtree.push(t);
					i++;
				}
				if(subtree.length == 0 && tup.length == 0) return null; else switch(mode) {
				case 0:
					var tk5 = tannus_nore_Token.TGroup(subtree);
					var last2 = this.tree.pop();
					if(last2 != null) if(last2 != null) switch(last2[1]) {
					case 0:
						var id = last2[2];
						tk5 = tannus_nore_Token.TCall(id,[subtree]);
						break;
					default:
						null;
					} else null;
					return tk5;
				case 1:
					var tk6 = tannus_nore_Token.TTuple(tup);
					var last3 = this.tree.pop();
					if(last3 != null) if(last3 != null) switch(last3[1]) {
					case 0:
						var id1 = last3[2];
						tk6 = tannus_nore_Token.TCall(id1,tup);
						break;
					default:
						null;
					} else null;
					return tk6;
				default:
					throw new js__$Boot_HaxeError("Error: Unrecognized mode " + mode + " in parenthetical group parsing!");
				}
			} else if(tannus_io__$Byte_Byte_$Impl_$.equalss(c,"#")) return tannus_nore_Token.THash; else if(tannus_io__$Byte_Byte_$Impl_$.equalss(c,":")) return tannus_nore_Token.TColon; else if(tannus_io__$Byte_Byte_$Impl_$.equalss(c,"?")) return tannus_nore_Token.TQuestion; else if(tannus_io__$Byte_Byte_$Impl_$.equalss(c,",")) return tannus_nore_Token.TComma; else if(tannus_io__$Byte_Byte_$Impl_$.equalss(c,"@")) try {
				var nxt = this.token();
				if(nxt != null) switch(nxt[1]) {
				case 0:case 3:
					return tannus_nore_Token.TRefence(nxt);
				default:
					throw new js__$Boot_HaxeError("SyntaxError: Expected identifier or number, got " + Std.string(nxt) + "!");
				}
			} catch( err5 ) {
				if (err5 instanceof js__$Boot_HaxeError) err5 = err5.val;
				if( js_Boot.__instanceof(err5,String) ) {
					throw new js__$Boot_HaxeError("SyntaxError: Expected identifier, got EOL");
				} else throw(err5);
			} else if(tannus_io__$Byte_Byte_$Impl_$.equalsi(c,126)) return tannus_nore_Token.TTilde;
		} catch( err6 ) {
			if (err6 instanceof js__$Boot_HaxeError) err6 = err6.val;
			if( js_Boot.__instanceof(err6,String) ) {
				if(err6 + "" == "Eof") throw new js__$Boot_HaxeError("::-EOI-::"); else throw new js__$Boot_HaxeError(err6);
			} else throw(err6);
		}
		return null;
	}
	,lexString: function(s) {
		this.source = tannus_io_ByteInput.fromString(s);
		this.tree = [];
		while(true) try {
			var tk = this.token();
			if(tk != null) this.tree.push(tk);
		} catch( err ) {
			if (err instanceof js__$Boot_HaxeError) err = err.val;
			if( js_Boot.__instanceof(err,String) ) {
				if(err == "::-EOI-::") break; else throw new js__$Boot_HaxeError(err);
			} else throw(err);
		}
		return this.tree;
	}
	,isOperator: function(c) {
		return Lambda.has(["+","-","*","/","=","!","<",">","|"],String.fromCharCode(c));
	}
	,'byte': function() {
		return this.source.next();
	}
	,push: function(tk) {
		this.tree.push(tk);
	}
	,pop: function() {
		return this.tree.pop();
	}
	,group: function(opener,closer,escape) {
		var found = "";
		var state = 1;
		while(state > 0) try {
			var bit = this.source.next();
			if(tannus_io__$Byte_Byte_$Impl_$.equalsi(bit,opener)) state++;
			if(tannus_io__$Byte_Byte_$Impl_$.equalsi(bit,closer)) state--;
			if(state > 0) found += String.fromCharCode(bit);
		} catch( err ) {
			if (err instanceof js__$Boot_HaxeError) err = err.val;
			if( js_Boot.__instanceof(err,String) ) {
				if(err + "" == "Eof") {
					if(state > 0) throw new js__$Boot_HaxeError("Unexpected end of input"); else break;
				} else throw new js__$Boot_HaxeError(err);
			} else throw(err);
		}
		return found;
	}
	,__class__: tannus_nore_Lexer
};
var tannus_nore_ORegEx = function() { };
$hxClasses["tannus.nore.ORegEx"] = tannus_nore_ORegEx;
tannus_nore_ORegEx.__name__ = ["tannus","nore","ORegEx"];
tannus_nore_ORegEx.compile = function(description) {
	if(tannus_nore_ORegEx.ast_results.exists(description)) {
		var ast = tannus_nore_ORegEx.ast_results.get(description);
		return tannus_nore_Compiler.compile(ast);
	} else {
		var ast1 = tannus_nore_Parser.parse(new tannus_nore_Lexer().lexString(description));
		{
			tannus_nore_ORegEx.ast_results.set(description,ast1);
			ast1;
		}
		return tannus_nore_Compiler.compile(ast1);
	}
};
var tannus_nore_Parser = function() {
	this.tokens = [];
	this.ast = [];
};
$hxClasses["tannus.nore.Parser"] = tannus_nore_Parser;
tannus_nore_Parser.__name__ = ["tannus","nore","Parser"];
tannus_nore_Parser.parse = function(tree) {
	var parser = new tannus_nore_Parser();
	return parser.parseTree(tree);
};
tannus_nore_Parser.prototype = {
	parseValue: function(vt) {
		switch(vt[1]) {
		case 3:
			var num = vt[2];
			return tannus_nore_Value.VNumber(num);
		case 2:
			var str = vt[2];
			return tannus_nore_Value.VString(str);
		case 0:
			var str1 = vt[2];
			return tannus_nore_Value.VString(str1);
		case 1:
			var tew = vt[2];
			switch(tew[1]) {
			case 0:
				var id = tew[2];
				return tannus_nore_Value.VFieldReference(id);
			case 3:
				var num1 = tew[2];
				var i = num1 | 0;
				return tannus_nore_Value.VIndexReference(i);
			default:
				throw new js__$Boot_HaxeError("SyntaxError: Cannot parse " + Std.string(tew) + " to a Reference!");
			}
			break;
		case 7:
			var sets = vt[2];
			var values;
			var _g = [];
			var _g1 = 0;
			while(_g1 < sets.length) {
				var set = sets[_g1];
				++_g1;
				_g.push(this.parseValue(set[0]));
			}
			values = _g;
			return tannus_nore_Value.VTuple(values);
		default:
			throw new js__$Boot_HaxeError("ValueError: Cannot parse " + Std.string(vt) + " to a Value!");
		}
	}
	,parseNext: function(last) {
		var tk = this.tokens.shift();
		if(tk != null) switch(tk[1]) {
		case 9:
			return tannus_nore_Check.NoCheck;
		case 18:
			var tid = this.tokens.shift();
			if(tid == null) throw new js__$Boot_HaxeError("@>EOI<@");
			var val = this.parseValue(tid);
			return tannus_nore_Check.IDCheck(val);
			switch(tid[1]) {
			case 0:
				var id = tid[2];
				return tannus_nore_Check.IDCheck(tannus_nore_Value.VString(id));
			case 2:
				var id1 = tid[2];
				return tannus_nore_Check.IDCheck(tannus_nore_Value.VString(id1));
			case 7:
				var sets = tid[2];
				var val1 = this.parseValue(tid);
				break;
			default:
				throw new js__$Boot_HaxeError("SyntaxError: Unexpected " + Std.string(tid));
			}
			break;
		case 4:
			var oper = tk[2];
			console.log(oper);
			switch(oper) {
			case "!":
				var nxt = this.parseNext();
				if(nxt != null) return tannus_nore_Check.InverseCheck(nxt); else throw new js__$Boot_HaxeError("SyntaxError: Unexpected EOI!");
				break;
			case "|":
				console.log("FUCK FUCK FUCK!!");
				var last1 = this.ast.pop();
				if(last1 != null) {
					var nxt1 = this.parseNext();
					if(nxt1 != null) return tannus_nore_Check.EitherCheck(last1,nxt1); else throw new js__$Boot_HaxeError("SyntaxError: Unexpected end of input!");
				} else throw new js__$Boot_HaxeError("SyntaxError: Unexpected \"|\"!");
				break;
			default:
				throw new js__$Boot_HaxeError("SyntaxError: Unexpected \"" + oper + "\"!");
			}
			break;
		case 0:
			var typename = tk[2];
			return tannus_nore_Check.TypeCheck(typename);
		case 2:
			var typename1 = tk[2];
			return tannus_nore_Check.TypeCheck(typename1);
		case 12:
			var nxt2 = this.tokens.shift();
			if(nxt2 == null) throw new js__$Boot_HaxeError("SyntaxError: Unexpected end of input!"); else if(nxt2 != null) switch(nxt2[1]) {
			case 0:
				var name = nxt2[2];
				return tannus_nore_Check.LooseTypeCheck(name);
			case 2:
				var name1 = nxt2[2];
				return tannus_nore_Check.LooseTypeCheck(name1);
			default:
				throw new js__$Boot_HaxeError("SyntaxError: Unexpected " + Std.string(nxt2) + "!");
			} else throw new js__$Boot_HaxeError("SyntaxError: Unexpected " + Std.string(nxt2) + "!");
			break;
		case 14:
			var nodes = [];
			var t = this.tokens.shift();
			try {
				while(t != null) {
					switch(t[1]) {
					case 15:
						throw "__break__";
						break;
					default:
						nodes.push(t);
					}
					t = this.tokens.shift();
				}
			} catch( e ) { if( e != "__break__" ) throw e; }
			if(nodes.length == 0) throw new js__$Boot_HaxeError("SyntaxError: Expected Identifier, got null!"); else {
				var first = nodes.shift();
				switch(first[1]) {
				case 0:
					var field = first[2];
					if(nodes.length == 0) return tannus_nore_Check.FieldExistsCheck(field); else {
						var second = nodes.shift();
						switch(second[1]) {
						case 4:
							var operation = second[2];
							if(nodes.length != 1) throw new js__$Boot_HaxeError("SyntaxError: Expected Value, got " + Std.string(nodes)); else {
								var val2 = nodes.shift();
								if(operation == "=>" && (function($this) {
									var $r;
									switch(val2[1]) {
									case 6:
										$r = true;
										break;
									default:
										$r = false;
									}
									return $r;
								}(this))) return tannus_nore_Check.FieldSubChecks(field,tannus_nore_Parser.parse(val2.slice(2)[0])); else {
									var value = this.parseValue(val2);
									return tannus_nore_Check.FieldValueCheck(field,operation,value);
								}
							}
							break;
						default:
							throw new js__$Boot_HaxeError("SyntaxError: Expected Operator, got " + Std.string(second) + "!");
						}
					}
					break;
				default:
					throw new js__$Boot_HaxeError("SyntaxError: Expected identifier, got " + Std.string(first));
				}
			}
			break;
		case 5:
			var subtree = tk[2];
			var ast = tannus_nore_Parser.parse(subtree);
			return tannus_nore_Check.GroupCheck(ast);
		case 10:
			var nxt3 = this.tokens.shift();
			if(nxt3 == null) throw new js__$Boot_HaxeError("SyntaxError: Unexpected end of input"); else if(nxt3 != null) switch(nxt3[1]) {
			case 0:
				var id2 = nxt3[2];
				var check = tannus_nore_Check.HelperCheck(id2);
				return check;
			case 8:
				var pargs = nxt3[3];
				var id3 = nxt3[2];
				var args = [];
				var v = this.parseValue(tannus_nore_Token.TTuple(pargs));
				switch(v[1]) {
				case 5:
					var vals = v[2];
					args = vals;
					break;
				default:
					throw new js__$Boot_HaxeError("WhatTheFuckError: While parsing the arguments of a function-call, a " + Std.string(v) + " was encountered rather than a tuple");
				}
				var check1 = tannus_nore_Check.HelperCheck(id3,args);
				return check1;
			default:
				throw new js__$Boot_HaxeError("SyntaxError: Unexpected " + Std.string(nxt3) + "!");
			} else throw new js__$Boot_HaxeError("SyntaxError: Unexpected " + Std.string(nxt3) + "!");
			break;
		case 7:
			var sets1 = tk[2];
			var values = [];
			var _g = 0;
			while(_g < sets1.length) {
				var set = sets1[_g];
				++_g;
				var t1 = set[0];
				var v1 = this.parseValue(t1);
				values.push(v1);
			}
			return tannus_nore_Check.TupleCheck(values);
		case 11:
			var prev = this.ast.pop();
			if(prev == null) throw new js__$Boot_HaxeError("SyntaxError: Unexpected \"?\"!");
			var ifTrue = this.parseNext();
			if(ifTrue == null) throw new js__$Boot_HaxeError("SyntaxError: Unexpected end of input!");
			var sep = this.tokens.shift();
			if(sep == null) throw new js__$Boot_HaxeError("Unexpected end of input!");
			if(sep != null) switch(sep[1]) {
			case 10:
				var ifFalse = this.parseNext();
				if(ifFalse == null) ifFalse = tannus_nore_Check.NoCheck;
				return tannus_nore_Check.TernaryCheck(prev,ifTrue,ifFalse);
			default:
				throw new js__$Boot_HaxeError("SyntaxError: Unexpected " + Std.string(sep) + "!");
			} else throw new js__$Boot_HaxeError("SyntaxError: Unexpected " + Std.string(sep) + "!");
			break;
		default:
			throw new js__$Boot_HaxeError("SyntaxError: No directives for handling " + Std.string(tk));
		} else throw new js__$Boot_HaxeError("@>EOI<@");
	}
	,parseTree: function(tree) {
		this.tokens = [];
		this.ast = [];
		this.tokens = tree;
		while(true) try {
			var check = this.parseNext();
			if(check != null) this.ast.push(check);
		} catch( err ) {
			if (err instanceof js__$Boot_HaxeError) err = err.val;
			if( js_Boot.__instanceof(err,String) ) {
				if(err == "@>EOI<@") break; else throw new js__$Boot_HaxeError(err);
			} else throw(err);
		}
		return this.ast;
	}
	,reset: function() {
		this.tokens = [];
		this.ast = [];
	}
	,token: function() {
		return this.tokens.shift();
	}
	,push: function(check) {
		this.ast.push(check);
	}
	,pop: function() {
		return this.ast.pop();
	}
	,__class__: tannus_nore_Parser
};
var tannus_nore__$Selector_Selector_$Impl_$ = {};
$hxClasses["tannus.nore._Selector.Selector_Impl_"] = tannus_nore__$Selector_Selector_$Impl_$;
tannus_nore__$Selector_Selector_$Impl_$.__name__ = ["tannus","nore","_Selector","Selector_Impl_"];
tannus_nore__$Selector_Selector_$Impl_$.__properties__ = {get_func:"get_func",get_selector:"get_selector"}
tannus_nore__$Selector_Selector_$Impl_$._new = function(s) {
	var this1;
	var b = tannus_nore_ORegEx.compile(s);
	this1 = [s,b];
	return this1;
};
tannus_nore__$Selector_Selector_$Impl_$.get_selector = function(this1) {
	return this1[0];
};
tannus_nore__$Selector_Selector_$Impl_$.get_func = function(this1) {
	return this1[1];
};
tannus_nore__$Selector_Selector_$Impl_$.clone = function(this1) {
	var s = this1[0];
	var this2;
	var b = tannus_nore_ORegEx.compile(s);
	this2 = [s,b];
	return this2;
};
tannus_nore__$Selector_Selector_$Impl_$.test = function(this1,o) {
	return this1[1](o);
};
tannus_nore__$Selector_Selector_$Impl_$.filter = function(this1,list) {
	return list.filter(this1[1]);
};
tannus_nore__$Selector_Selector_$Impl_$.toString = function(this1) {
	return "Selector(" + this1[0] + ")";
};
tannus_nore__$Selector_Selector_$Impl_$.toPredicate = function(this1) {
	return this1[1];
};
tannus_nore__$Selector_Selector_$Impl_$.invert = function(this1) {
	var s = "!(" + this1[0] + ")";
	var this2;
	var b = tannus_nore_ORegEx.compile(s);
	this2 = [s,b];
	return this2;
};
tannus_nore__$Selector_Selector_$Impl_$.add = function(one,other) {
	var s = "(" + one[0] + ")(" + other[0] + ")";
	var this1;
	var b = tannus_nore_ORegEx.compile(s);
	this1 = [s,b];
	return this1;
};
tannus_nore__$Selector_Selector_$Impl_$.minus = function(one,other) {
	var s = "(" + one[0] + ") !(" + other[0] + ")";
	var this1;
	var b = tannus_nore_ORegEx.compile(s);
	this1 = [s,b];
	return this1;
};
tannus_nore__$Selector_Selector_$Impl_$.fromString = function(s) {
	var this1;
	var b = tannus_nore_ORegEx.compile(s);
	this1 = [s,b];
	return this1;
};
tannus_nore__$Selector_Selector_$Impl_$.helper = function(name,hf) {
	tannus_nore_Compiler.initHelpers.listen(function(help) {
		help(name,hf);
	},false);
};
var tannus_nore_Token = $hxClasses["tannus.nore.Token"] = { __ename__ : ["tannus","nore","Token"], __constructs__ : ["TIdent","TRefence","TString","TNumber","TOperator","TGroup","TSub","TTuple","TCall","TAny","TColon","TQuestion","TTilde","TComma","TOBracket","TCBracket","TOParen","TCParen","THash","TArrayAccess","TRangeAccess"] };
tannus_nore_Token.TIdent = function(ident) { var $x = ["TIdent",0,ident]; $x.__enum__ = tannus_nore_Token; $x.toString = $estr; return $x; };
tannus_nore_Token.TRefence = function(id) { var $x = ["TRefence",1,id]; $x.__enum__ = tannus_nore_Token; $x.toString = $estr; return $x; };
tannus_nore_Token.TString = function(str) { var $x = ["TString",2,str]; $x.__enum__ = tannus_nore_Token; $x.toString = $estr; return $x; };
tannus_nore_Token.TNumber = function(num) { var $x = ["TNumber",3,num]; $x.__enum__ = tannus_nore_Token; $x.toString = $estr; return $x; };
tannus_nore_Token.TOperator = function(op) { var $x = ["TOperator",4,op]; $x.__enum__ = tannus_nore_Token; $x.toString = $estr; return $x; };
tannus_nore_Token.TGroup = function(subtree) { var $x = ["TGroup",5,subtree]; $x.__enum__ = tannus_nore_Token; $x.toString = $estr; return $x; };
tannus_nore_Token.TSub = function(subtree) { var $x = ["TSub",6,subtree]; $x.__enum__ = tannus_nore_Token; $x.toString = $estr; return $x; };
tannus_nore_Token.TTuple = function(values) { var $x = ["TTuple",7,values]; $x.__enum__ = tannus_nore_Token; $x.toString = $estr; return $x; };
tannus_nore_Token.TCall = function(id,args) { var $x = ["TCall",8,id,args]; $x.__enum__ = tannus_nore_Token; $x.toString = $estr; return $x; };
tannus_nore_Token.TAny = ["TAny",9];
tannus_nore_Token.TAny.toString = $estr;
tannus_nore_Token.TAny.__enum__ = tannus_nore_Token;
tannus_nore_Token.TColon = ["TColon",10];
tannus_nore_Token.TColon.toString = $estr;
tannus_nore_Token.TColon.__enum__ = tannus_nore_Token;
tannus_nore_Token.TQuestion = ["TQuestion",11];
tannus_nore_Token.TQuestion.toString = $estr;
tannus_nore_Token.TQuestion.__enum__ = tannus_nore_Token;
tannus_nore_Token.TTilde = ["TTilde",12];
tannus_nore_Token.TTilde.toString = $estr;
tannus_nore_Token.TTilde.__enum__ = tannus_nore_Token;
tannus_nore_Token.TComma = ["TComma",13];
tannus_nore_Token.TComma.toString = $estr;
tannus_nore_Token.TComma.__enum__ = tannus_nore_Token;
tannus_nore_Token.TOBracket = ["TOBracket",14];
tannus_nore_Token.TOBracket.toString = $estr;
tannus_nore_Token.TOBracket.__enum__ = tannus_nore_Token;
tannus_nore_Token.TCBracket = ["TCBracket",15];
tannus_nore_Token.TCBracket.toString = $estr;
tannus_nore_Token.TCBracket.__enum__ = tannus_nore_Token;
tannus_nore_Token.TOParen = ["TOParen",16];
tannus_nore_Token.TOParen.toString = $estr;
tannus_nore_Token.TOParen.__enum__ = tannus_nore_Token;
tannus_nore_Token.TCParen = ["TCParen",17];
tannus_nore_Token.TCParen.toString = $estr;
tannus_nore_Token.TCParen.__enum__ = tannus_nore_Token;
tannus_nore_Token.THash = ["THash",18];
tannus_nore_Token.THash.toString = $estr;
tannus_nore_Token.THash.__enum__ = tannus_nore_Token;
tannus_nore_Token.TArrayAccess = function(index) { var $x = ["TArrayAccess",19,index]; $x.__enum__ = tannus_nore_Token; $x.toString = $estr; return $x; };
tannus_nore_Token.TRangeAccess = function(start,end) { var $x = ["TRangeAccess",20,start,end]; $x.__enum__ = tannus_nore_Token; $x.toString = $estr; return $x; };
var tannus_nore_Value = $hxClasses["tannus.nore.Value"] = { __ename__ : ["tannus","nore","Value"], __constructs__ : ["VNumber","VString","VFieldReference","VIndexReference","VArrayAccess","VTuple"] };
tannus_nore_Value.VNumber = function(num) { var $x = ["VNumber",0,num]; $x.__enum__ = tannus_nore_Value; $x.toString = $estr; return $x; };
tannus_nore_Value.VString = function(str) { var $x = ["VString",1,str]; $x.__enum__ = tannus_nore_Value; $x.toString = $estr; return $x; };
tannus_nore_Value.VFieldReference = function(field) { var $x = ["VFieldReference",2,field]; $x.__enum__ = tannus_nore_Value; $x.toString = $estr; return $x; };
tannus_nore_Value.VIndexReference = function(index) { var $x = ["VIndexReference",3,index]; $x.__enum__ = tannus_nore_Value; $x.toString = $estr; return $x; };
tannus_nore_Value.VArrayAccess = function(field,index) { var $x = ["VArrayAccess",4,field,index]; $x.__enum__ = tannus_nore_Value; $x.toString = $estr; return $x; };
tannus_nore_Value.VTuple = function(vals) { var $x = ["VTuple",5,vals]; $x.__enum__ = tannus_nore_Value; $x.toString = $estr; return $x; };
var tannus_sys__$Directory_Directory_$Impl_$ = {};
$hxClasses["tannus.sys._Directory.Directory_Impl_"] = tannus_sys__$Directory_Directory_$Impl_$;
tannus_sys__$Directory_Directory_$Impl_$.__name__ = ["tannus","sys","_Directory","Directory_Impl_"];
tannus_sys__$Directory_Directory_$Impl_$.__properties__ = {get_entries:"get_entries",get_exists:"get_exists",get_path:"get_path"}
tannus_sys__$Directory_Directory_$Impl_$._new = function(p,create) {
	if(create == null) create = false;
	var this1;
	this1 = p;
	if(tannus_sys_JavaScriptFileSystem.exists(this1.s)) {
		if(!tannus_sys_JavaScriptFileSystem.isDirectory(this1.s)) throw new js__$Boot_HaxeError((function($this) {
			var $r;
			var x;
			{
				var x1 = new tannus_sys__$Path_CPath("IOError: ");
				var s;
				{
					var this2 = tannus_sys__$Path_CPath.join([x1.s,p.s]);
					s = this2.s;
				}
				x = new tannus_sys__$Path_CPath(s);
			}
			var y = new tannus_sys__$Path_CPath(" is not a Directory!");
			$r = (function($this) {
				var $r;
				var s1;
				{
					var this3 = tannus_sys__$Path_CPath.join([x.s,y.s]);
					s1 = this3.s;
				}
				$r = new tannus_sys__$Path_CPath(s1);
				return $r;
			}($this));
			return $r;
		}(this)));
	} else if(create) tannus_sys_JavaScriptFileSystem.createDirectory(this1.s); else throw new js__$Boot_HaxeError((function($this) {
		var $r;
		var x2;
		{
			var x3 = new tannus_sys__$Path_CPath("IOError: ");
			var s2;
			{
				var this4 = tannus_sys__$Path_CPath.join([x3.s,p.s]);
				s2 = this4.s;
			}
			x2 = new tannus_sys__$Path_CPath(s2);
		}
		var y1 = new tannus_sys__$Path_CPath(" is not a File or a Directory!");
		$r = (function($this) {
			var $r;
			var s3;
			{
				var this5 = tannus_sys__$Path_CPath.join([x2.s,y1.s]);
				s3 = this5.s;
			}
			$r = new tannus_sys__$Path_CPath(s3);
			return $r;
		}($this));
		return $r;
	}(this)));
	return this1;
};
tannus_sys__$Directory_Directory_$Impl_$.get = function(this1,name) {
	var entry;
	{
		var p = new tannus_sys__$Path_CPath(name);
		if(tannus_sys_JavaScriptFileSystem.exists(p.s)) {
			if(tannus_sys_JavaScriptFileSystem.isDirectory(p.s)) {
				var et = tannus_sys_FSEntryType.Folder(p);
				entry = et;
			} else {
				var et1 = tannus_sys_FSEntryType.File(new tannus_sys_CFile(p));
				entry = et1;
			}
		} else throw new js__$Boot_HaxeError("IOError: Cannot create FSEntry instance for Path which does not exist");
	}
	var canRet;
	{
		var _g = entry;
		switch(_g[1]) {
		case 0:
			var f = _g[2];
			canRet = tannus_sys_JavaScriptFileSystem.exists(f._path.s);
			break;
		case 1:
			var f1 = _g[2];
			canRet = tannus_sys_JavaScriptFileSystem.exists(f1.s);
			break;
		}
	}
	if(canRet) return entry; else return null;
};
tannus_sys__$Directory_Directory_$Impl_$.file = function(this1,name) {
	var f;
	{
		var p;
		var y = new tannus_sys__$Path_CPath(name);
		var s;
		{
			var this2 = tannus_sys__$Path_CPath.join([this1.s,y.s]);
			s = this2.s;
		}
		p = new tannus_sys__$Path_CPath(s);
		f = new tannus_sys_CFile(p);
	}
	return f;
};
tannus_sys__$Directory_Directory_$Impl_$.iterator = function(this1) {
	var el = tannus_sys__$Directory_Directory_$Impl_$.get_entries(this1);
	return HxOverrides.iter(el);
};
tannus_sys__$Directory_Directory_$Impl_$.walk = function(this1,func) {
	var _g = 0;
	var _g1 = tannus_sys__$Directory_Directory_$Impl_$.get_entries(this1);
	while(_g < _g1.length) {
		var e = _g1[_g];
		++_g;
		{
			var _g2 = e;
			switch(_g2[1]) {
			case 0:
				var f = _g2[2];
				func(e);
				break;
			case 1:
				var d = _g2[2];
				func(e);
				tannus_sys__$Directory_Directory_$Impl_$.walk(d,func);
				break;
			}
		}
	}
};
tannus_sys__$Directory_Directory_$Impl_$.walkRecursive = function(this1,tester) {
	var results = [];
	var _g = 0;
	var _g1 = tannus_sys__$Directory_Directory_$Impl_$.get_entries(this1);
	while(_g < _g1.length) {
		var e = _g1[_g];
		++_g;
		{
			var _g2 = e;
			switch(_g2[1]) {
			case 0:
				var f = _g2[2];
				if(tester == null) results.push(f); else if(tester(f)) results.push(f);
				break;
			case 1:
				var d = _g2[2];
				results = results.concat(tannus_sys__$Directory_Directory_$Impl_$.walkRecursive(d,tester));
				break;
			}
		}
	}
	return results;
};
tannus_sys__$Directory_Directory_$Impl_$.rename = function(this1,ndir) {
	tannus_sys_JavaScriptFileSystem.volume.rename(this1.s,ndir);
	tannus_sys_JavaScriptFileSystem.save();
};
tannus_sys__$Directory_Directory_$Impl_$["delete"] = function(this1,force) {
	if(force == null) force = false;
	if(!force) tannus_sys_JavaScriptFileSystem.deleteDirectory(this1.s); else tannus_sys__$Directory_Directory_$Impl_$.walk(this1,function(entry) {
		{
			var _g = entry;
			switch(_g[1]) {
			case 0:
				var f = _g[2];
				tannus_sys_JavaScriptFileSystem.volume.deleteFile(f._path.s);
				tannus_sys_JavaScriptFileSystem.save();
				break;
			case 1:
				var f1 = _g[2];
				tannus_sys__$Directory_Directory_$Impl_$["delete"](f1,true);
				break;
			}
		}
	});
};
tannus_sys__$Directory_Directory_$Impl_$.get_path = function(this1) {
	return this1;
};
tannus_sys__$Directory_Directory_$Impl_$.get_exists = function(this1) {
	return tannus_sys_JavaScriptFileSystem.exists(this1.s);
};
tannus_sys__$Directory_Directory_$Impl_$.get_entries = function(this1) {
	var rnames;
	var _g = [];
	var _g1 = 0;
	var _g2 = tannus_sys_JavaScriptFileSystem.readDirectory(this1.s);
	while(_g1 < _g2.length) {
		var s = _g2[_g1];
		++_g1;
		_g.push(new tannus_sys__$Path_CPath(s));
	}
	rnames = _g;
	var elist = [];
	var _g21 = 0;
	var _g11 = rnames.length;
	while(_g21 < _g11) {
		var i = _g21++;
		rnames[i].set_directory(this1);
		elist.push((function($this) {
			var $r;
			var p = rnames[i];
			$r = tannus_sys_JavaScriptFileSystem.exists(p.s)?tannus_sys_JavaScriptFileSystem.isDirectory(p.s)?(function($this) {
				var $r;
				var et = tannus_sys_FSEntryType.Folder(p);
				$r = et;
				return $r;
			}($this)):(function($this) {
				var $r;
				var et1 = tannus_sys_FSEntryType.File(new tannus_sys_CFile(p));
				$r = et1;
				return $r;
			}($this)):(function($this) {
				var $r;
				throw new js__$Boot_HaxeError("IOError: Cannot create FSEntry instance for Path which does not exist");
				return $r;
			}($this));
			return $r;
		}(this)));
	}
	return elist;
};
var tannus_sys__$FSEntry_FSEntry_$Impl_$ = {};
$hxClasses["tannus.sys._FSEntry.FSEntry_Impl_"] = tannus_sys__$FSEntry_FSEntry_$Impl_$;
tannus_sys__$FSEntry_FSEntry_$Impl_$.__name__ = ["tannus","sys","_FSEntry","FSEntry_Impl_"];
tannus_sys__$FSEntry_FSEntry_$Impl_$.__properties__ = {get_name:"get_name",get_path:"get_path",get_type:"get_type"}
tannus_sys__$FSEntry_FSEntry_$Impl_$._new = function(et) {
	return et;
};
tannus_sys__$FSEntry_FSEntry_$Impl_$.get_type = function(this1) {
	return this1;
};
tannus_sys__$FSEntry_FSEntry_$Impl_$.get_path = function(this1) {
	{
		var _g = this1;
		switch(_g[1]) {
		case 0:
			var f = _g[2];
			return f._path;
		case 1:
			var f1 = _g[2];
			return f1;
		}
	}
};
tannus_sys__$FSEntry_FSEntry_$Impl_$.get_name = function(this1) {
	return tannus_sys__$FSEntry_FSEntry_$Impl_$.get_path(this1).get_name();
};
tannus_sys__$FSEntry_FSEntry_$Impl_$.rename = function(this1,ndir) {
	{
		var _g = this1;
		switch(_g[1]) {
		case 0:
			var f = _g[2];
			f.set_path(ndir);
			break;
		case 1:
			var f1 = _g[2];
			tannus_sys_JavaScriptFileSystem.volume.rename(f1.s,ndir.s);
			tannus_sys_JavaScriptFileSystem.save();
			break;
		}
	}
};
tannus_sys__$FSEntry_FSEntry_$Impl_$["delete"] = function(this1) {
	{
		var _g = this1;
		switch(_g[1]) {
		case 0:
			var f = _g[2];
			tannus_sys_JavaScriptFileSystem.volume.deleteFile(f._path.s);
			tannus_sys_JavaScriptFileSystem.save();
			break;
		case 1:
			var f1 = _g[2];
			tannus_sys__$Directory_Directory_$Impl_$["delete"](f1);
			break;
		}
	}
};
tannus_sys__$FSEntry_FSEntry_$Impl_$.file = function(this1) {
	{
		var _g = this1;
		switch(_g[1]) {
		case 0:
			var f = _g[2];
			return f;
		case 1:
			var d = _g[2];
			throw new js__$Boot_HaxeError("IOError: Cannot cast a Directory to a File!");
			break;
		}
	}
};
tannus_sys__$FSEntry_FSEntry_$Impl_$.isFile = function(this1) {
	{
		var _g = this1;
		switch(_g[1]) {
		case 0:
			var f = _g[2];
			return true;
		case 1:
			var d = _g[2];
			return false;
		}
	}
};
tannus_sys__$FSEntry_FSEntry_$Impl_$.isDirectory = function(this1) {
	{
		var _g = this1;
		switch(_g[1]) {
		case 0:
			var f = _g[2];
			return false;
		case 1:
			var d = _g[2];
			return true;
		}
	}
};
tannus_sys__$FSEntry_FSEntry_$Impl_$.folder = function(this1) {
	{
		var _g = this1;
		switch(_g[1]) {
		case 0:
			var f = _g[2];
			throw new js__$Boot_HaxeError("IOError: Cannot cast a File to a Directory!");
			break;
		case 1:
			var d = _g[2];
			return d;
		}
	}
};
tannus_sys__$FSEntry_FSEntry_$Impl_$.fromPath = function(p) {
	if(tannus_sys_JavaScriptFileSystem.exists(p.s)) {
		if(tannus_sys_JavaScriptFileSystem.isDirectory(p.s)) {
			var et = tannus_sys_FSEntryType.Folder(p);
			return et;
		} else {
			var et1 = tannus_sys_FSEntryType.File(new tannus_sys_CFile(p));
			return et1;
		}
	} else throw new js__$Boot_HaxeError("IOError: Cannot create FSEntry instance for Path which does not exist");
};
tannus_sys__$FSEntry_FSEntry_$Impl_$.fromString = function(s) {
	var p = new tannus_sys__$Path_CPath(s);
	if(tannus_sys_JavaScriptFileSystem.exists(p.s)) {
		if(tannus_sys_JavaScriptFileSystem.isDirectory(p.s)) {
			var et = tannus_sys_FSEntryType.Folder(p);
			return et;
		} else {
			var et1 = tannus_sys_FSEntryType.File(new tannus_sys_CFile(p));
			return et1;
		}
	} else throw new js__$Boot_HaxeError("IOError: Cannot create FSEntry instance for Path which does not exist");
};
var tannus_sys_FSEntryType = $hxClasses["tannus.sys.FSEntryType"] = { __ename__ : ["tannus","sys","FSEntryType"], __constructs__ : ["File","Folder"] };
tannus_sys_FSEntryType.File = function(f) { var $x = ["File",0,f]; $x.__enum__ = tannus_sys_FSEntryType; $x.toString = $estr; return $x; };
tannus_sys_FSEntryType.Folder = function(d) { var $x = ["Folder",1,d]; $x.__enum__ = tannus_sys_FSEntryType; $x.toString = $estr; return $x; };
var tannus_sys__$File_File_$Impl_$ = {};
$hxClasses["tannus.sys._File.File_Impl_"] = tannus_sys__$File_File_$Impl_$;
tannus_sys__$File_File_$Impl_$.__name__ = ["tannus","sys","_File","File_Impl_"];
tannus_sys__$File_File_$Impl_$._new = function(p) {
	return new tannus_sys_CFile(p);
};
tannus_sys__$File_File_$Impl_$.lines = function(this1,nlines) {
	if(nlines == null) return ((function($this) {
		var $r;
		var this2 = tannus_sys_JavaScriptFileSystem.read(this1._path.s);
		$r = this2.map(function(b) {
			return String.fromCharCode(b);
		}).join("");
		return $r;
	}(this))).split("\n"); else {
		this1.write((function($this) {
			var $r;
			var s = nlines.join("\n");
			var ba = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
			tannus_io__$ByteArray_ByteArray_$Impl_$.writeString(ba,s);
			$r = ba;
			return $r;
		}(this)));
		return nlines;
	}
};
tannus_sys__$File_File_$Impl_$.fromString = function(p) {
	var p1 = new tannus_sys__$Path_CPath(p);
	return new tannus_sys_CFile(p1);
};
tannus_sys__$File_File_$Impl_$.fromPath = function(p) {
	return new tannus_sys_CFile(p);
};
tannus_sys__$File_File_$Impl_$.fromByteArray = function(p) {
	var p1 = p.map(function(b) {
		return String.fromCharCode(b);
	}).join("");
	var p2 = new tannus_sys__$Path_CPath(p1);
	return new tannus_sys_CFile(p2);
};
var tannus_sys_CFile = function(p) {
	this._path = p;
	if(tannus_sys_JavaScriptFileSystem.exists(this._path.s) && tannus_sys_JavaScriptFileSystem.isDirectory(this._path.s)) tannus_sys_CFile.ferror((function($this) {
		var $r;
		var this1;
		{
			var x;
			var x1 = new tannus_sys__$Path_CPath("\"");
			var s;
			{
				var this2 = tannus_sys__$Path_CPath.join([x1.s,$this._path.s]);
				s = this2.s;
			}
			x = new tannus_sys__$Path_CPath(s);
			var y = new tannus_sys__$Path_CPath("\" is a directory!");
			var s1;
			{
				var this3 = tannus_sys__$Path_CPath.join([x.s,y.s]);
				s1 = this3.s;
			}
			this1 = new tannus_sys__$Path_CPath(s1);
		}
		$r = this1.s;
		return $r;
	}(this)));
};
$hxClasses["tannus.sys.CFile"] = tannus_sys_CFile;
tannus_sys_CFile.__name__ = ["tannus","sys","CFile"];
tannus_sys_CFile.ferror = function(msg) {
	throw new js__$Boot_HaxeError("FileError: " + msg);
};
tannus_sys_CFile.prototype = {
	read: function() {
		return tannus_sys_JavaScriptFileSystem.read(this._path.s);
	}
	,write: function(data) {
		tannus_sys_JavaScriptFileSystem.write(this._path.s,data);
	}
	,append: function(data) {
		tannus_sys_JavaScriptFileSystem.append(this._path.s,data);
	}
	,rename: function(newpath) {
		this.set_path(newpath);
	}
	,'delete': function() {
		tannus_sys_JavaScriptFileSystem.volume.deleteFile(this._path.s);
		tannus_sys_JavaScriptFileSystem.save();
	}
	,get_exists: function() {
		return tannus_sys_JavaScriptFileSystem.exists(this._path.s);
	}
	,get_size: function() {
		var stats = tannus_sys_JavaScriptFileSystem.volume.stat(this._path.s);
		return stats.size;
	}
	,get_data: function() {
		return tannus_sys_JavaScriptFileSystem.read(this._path.s);
	}
	,set_data: function(nd) {
		tannus_sys_JavaScriptFileSystem.write(this._path.s,nd);
		return tannus_sys_JavaScriptFileSystem.read(this._path.s);
	}
	,get_content: function() {
		var f = this;
		var f1 = new tannus_io__$Pointer_Ref(function() {
			return f;
		},function(v) {
			return f = v;
		});
		return f1;
	}
	,get_path: function() {
		return this._path;
	}
	,set_path: function(np) {
		tannus_sys_JavaScriptFileSystem.volume.rename(this._path.s,np.s);
		tannus_sys_JavaScriptFileSystem.save();
		return this._path = np;
	}
	,get_directory: function() {
		return this._path.get_directory();
	}
	,get_input: function() {
		var inp = new haxe_io_BytesInput((function($this) {
			var $r;
			var this1 = $this.get_data();
			var buf = haxe_io_Bytes.alloc(this1.length);
			tannus_io__$ByteArray_ByteArray_$Impl_$.each(this1,function(i,b) {
				buf.b[i] = b & 255;
			});
			$r = buf;
			return $r;
		}(this)));
		return inp;
	}
	,__class__: tannus_sys_CFile
	,__properties__: {get_input:"get_input",get_directory:"get_directory",set_path:"set_path",get_path:"get_path",get_content:"get_content",set_data:"set_data",get_data:"get_data",get_size:"get_size",get_exists:"get_exists"}
};
var tannus_sys__$FileStreamOptions_FileStreamOptions_$Impl_$ = {};
$hxClasses["tannus.sys._FileStreamOptions.FileStreamOptions_Impl_"] = tannus_sys__$FileStreamOptions_FileStreamOptions_$Impl_$;
tannus_sys__$FileStreamOptions_FileStreamOptions_$Impl_$.__name__ = ["tannus","sys","_FileStreamOptions","FileStreamOptions_Impl_"];
tannus_sys__$FileStreamOptions_FileStreamOptions_$Impl_$.__properties__ = {set_end:"set_end",get_end:"get_end",set_start:"set_start",get_start:"get_start"}
tannus_sys__$FileStreamOptions_FileStreamOptions_$Impl_$._new = function(start,end) {
	return { 'start' : start, 'end' : end};
};
tannus_sys__$FileStreamOptions_FileStreamOptions_$Impl_$.get_start = function(this1) {
	return this1.start;
};
tannus_sys__$FileStreamOptions_FileStreamOptions_$Impl_$.set_start = function(this1,v) {
	return this1.start = v;
};
tannus_sys__$FileStreamOptions_FileStreamOptions_$Impl_$.get_end = function(this1) {
	if(this1.end == null) return -1; else return this1.end;
};
tannus_sys__$FileStreamOptions_FileStreamOptions_$Impl_$.set_end = function(this1,v) {
	return this1.end = v;
};
tannus_sys__$FileStreamOptions_FileStreamOptions_$Impl_$.range = function(this1) {
	return new tannus_ds_IntRange(this1.start,this1.end);
};
tannus_sys__$FileStreamOptions_FileStreamOptions_$Impl_$.fromArray = function(a) {
	return { 'start' : a[0], 'end' : a[1]};
};
var tannus_sys__$GlobStar_GlobStar_$Impl_$ = {};
$hxClasses["tannus.sys._GlobStar.GlobStar_Impl_"] = tannus_sys__$GlobStar_GlobStar_$Impl_$;
tannus_sys__$GlobStar_GlobStar_$Impl_$.__name__ = ["tannus","sys","_GlobStar","GlobStar_Impl_"];
tannus_sys__$GlobStar_GlobStar_$Impl_$._new = function(s) {
	return new tannus_sys_CGlobStar(s);
};
tannus_sys__$GlobStar_GlobStar_$Impl_$.fromString = function(s) {
	return new tannus_sys_CGlobStar(s);
};
var tannus_sys_CGlobStar = $hx_exports.globstar = function(pat) {
	this.spat = pat;
	var data = tannus_sys_gs_Printer.compile(pat);
	this.pattern = data.regex;
	this.pind = data.params;
};
$hxClasses["tannus.sys.CGlobStar"] = tannus_sys_CGlobStar;
tannus_sys_CGlobStar.__name__ = ["tannus","sys","CGlobStar"];
tannus_sys_CGlobStar.prototype = {
	test: function(path) {
		var data = tannus_io__$RegEx_RegEx_$Impl_$.matches(this.pattern,path);
		if(data.length == 0) return false; else return StringTools.trim(tannus_ds_StringUtils.remove(path,data[0][0])) == "";
	}
	,match: function(s) {
		var dat = tannus_io__$RegEx_RegEx_$Impl_$.matches(this.pattern,s);
		if(dat.length == 0) return null; else {
			var m = dat[0];
			var res = { };
			var $it0 = this.pind.keys();
			while( $it0.hasNext() ) {
				var k = $it0.next();
				var i = this.pind.get(k);
				console.log(i);
				{
					Reflect.setProperty(res,k,m[i + 1]);
					Reflect.getProperty(res,k);
				}
			}
			return res;
		}
	}
	,__class__: tannus_sys_CGlobStar
};
var tannus_sys_Token = $hxClasses["tannus.sys.Token"] = { __ename__ : ["tannus","sys","Token"], __constructs__ : ["TLiteral","TExpan"] };
tannus_sys_Token.TLiteral = function(s) { var $x = ["TLiteral",0,s]; $x.__enum__ = tannus_sys_Token; $x.toString = $estr; return $x; };
tannus_sys_Token.TExpan = function(bits) { var $x = ["TExpan",1,bits]; $x.__enum__ = tannus_sys_Token; $x.toString = $estr; return $x; };
var tannus_sys_JavaScriptFileSystem = function() { };
$hxClasses["tannus.sys.JavaScriptFileSystem"] = tannus_sys_JavaScriptFileSystem;
tannus_sys_JavaScriptFileSystem.__name__ = ["tannus","sys","JavaScriptFileSystem"];
tannus_sys_JavaScriptFileSystem.__properties__ = {get_v:"get_v"}
tannus_sys_JavaScriptFileSystem.load = function() {
	var ls = js_Browser.getLocalStorage();
	var saved = ls.getItem("::fs::");
	if(saved == null) {
		tannus_sys_JavaScriptFileSystem.volume = new tannus_sys_VirtualVolume("fs");
		tannus_sys_JavaScriptFileSystem.save();
	} else tannus_sys_JavaScriptFileSystem.volume = tannus_sys_VirtualVolume.deserialize((function($this) {
		var $r;
		var ba = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
		tannus_io__$ByteArray_ByteArray_$Impl_$.writeString(ba,saved);
		$r = ba;
		return $r;
	}(this)));
};
tannus_sys_JavaScriptFileSystem.save = function() {
	var ls = js_Browser.getLocalStorage();
	var data = tannus_sys_JavaScriptFileSystem.volume.serialize();
	ls.setItem("::fs::",data.map(function(b) {
		return String.fromCharCode(b);
	}).join(""));
};
tannus_sys_JavaScriptFileSystem.get_v = function() {
	return tannus_sys_JavaScriptFileSystem.volume;
};
tannus_sys_JavaScriptFileSystem.exists = function(name) {
	return tannus_sys_JavaScriptFileSystem.volume.exists(name);
};
tannus_sys_JavaScriptFileSystem.isDirectory = function(name) {
	return tannus_sys_JavaScriptFileSystem.volume.isDirectory(name);
};
tannus_sys_JavaScriptFileSystem.createDirectory = function(name) {
	tannus_sys_JavaScriptFileSystem.volume.createDirectory(name);
	tannus_sys_JavaScriptFileSystem.save();
};
tannus_sys_JavaScriptFileSystem.deleteDirectory = function(name) {
	tannus_sys_JavaScriptFileSystem.volume.deleteDirectory(name);
	tannus_sys_JavaScriptFileSystem.save();
};
tannus_sys_JavaScriptFileSystem.deleteFile = function(name) {
	tannus_sys_JavaScriptFileSystem.volume.deleteFile(name);
	tannus_sys_JavaScriptFileSystem.save();
};
tannus_sys_JavaScriptFileSystem.readDirectory = function(name) {
	return tannus_sys_JavaScriptFileSystem.volume.readDirectory(name);
};
tannus_sys_JavaScriptFileSystem.read = function(name) {
	return tannus_sys_JavaScriptFileSystem.volume.read(name);
};
tannus_sys_JavaScriptFileSystem.write = function(name,data) {
	tannus_sys_JavaScriptFileSystem.volume.write(name,data);
	tannus_sys_JavaScriptFileSystem.save();
};
tannus_sys_JavaScriptFileSystem.append = function(name,data) {
	tannus_sys_JavaScriptFileSystem.volume.append(name,data);
	tannus_sys_JavaScriptFileSystem.save();
};
tannus_sys_JavaScriptFileSystem.istream = function(name,options) {
	throw new js__$Boot_HaxeError("Error: Not implemented!");
};
tannus_sys_JavaScriptFileSystem.rename = function(o,n) {
	tannus_sys_JavaScriptFileSystem.volume.rename(o,n);
	tannus_sys_JavaScriptFileSystem.save();
};
tannus_sys_JavaScriptFileSystem.stat = function(name) {
	return tannus_sys_JavaScriptFileSystem.volume.stat(name);
};
var tannus_sys__$Mime_Mime_$Impl_$ = {};
$hxClasses["tannus.sys._Mime.Mime_Impl_"] = tannus_sys__$Mime_Mime_$Impl_$;
tannus_sys__$Mime_Mime_$Impl_$.__name__ = ["tannus","sys","_Mime","Mime_Impl_"];
tannus_sys__$Mime_Mime_$Impl_$.__properties__ = {get_subtype:"get_subtype",get_type:"get_type"}
tannus_sys__$Mime_Mime_$Impl_$._new = function(m) {
	return m;
};
tannus_sys__$Mime_Mime_$Impl_$.get_type = function(this1) {
	if(tannus_ds_StringUtils.has(this1,"/")) return this1.substring(0,this1.indexOf("/")); else return this1;
};
tannus_sys__$Mime_Mime_$Impl_$.get_subtype = function(this1) {
	var st;
	if(tannus_ds_StringUtils.has(this1,"/")) st = this1.substring(this1.indexOf("/") + 1); else st = null;
	if(st == null) return null;
	return tannus_ds_StringUtils.before(tannus_ds_StringUtils.after(st,"."),"+");
};
tannus_sys__$Mime_Mime_$Impl_$.getSegments = function(this1) {
	var res = [];
	res = res.concat(this1.split("/"));
	var last;
	if(res.length == 2) {
		last = res.pop();
		var subs = last.split(".");
		res = res.concat(subs);
		last = res.pop();
		if(tannus_ds_StringUtils.has(last,"+")) {
			var suff = last.split("+");
			res = res.concat(suff);
		} else res.push(last);
	}
	return res;
};
tannus_sys__$Mime_Mime_$Impl_$.getMainType = function(this1) {
	if(tannus_ds_StringUtils.has(this1,"/")) return this1.substring(0,this1.indexOf("/")); else return this1;
};
tannus_sys__$Mime_Mime_$Impl_$.getSubType = function(this1) {
	if(tannus_ds_StringUtils.has(this1,"/")) return this1.substring(this1.indexOf("/") + 1); else return null;
};
tannus_sys__$Mime_Mime_$Impl_$.getTree = function(this1) {
	var st;
	if(tannus_ds_StringUtils.has(this1,"/")) st = this1.substring(this1.indexOf("/") + 1); else st = null;
	if(st == null) return null; else if(tannus_ds_StringUtils.has(st,".")) return st.substring(0,st.indexOf(".")); else return null;
};
var tannus_sys_Mimes = $hx_exports.tannus.sys.Mimes = function() { };
$hxClasses["tannus.sys.Mimes"] = tannus_sys_Mimes;
tannus_sys_Mimes.__name__ = ["tannus","sys","Mimes"];
tannus_sys_Mimes.minit = function() {
	if(!tannus_sys_Mimes.initted) tannus_sys_Mimes.__init();
};
tannus_sys_Mimes.getMimeType = function(ext) {
	if(!tannus_sys_Mimes.initted) tannus_sys_Mimes.__init();
	if(StringTools.startsWith(ext,".")) ext = ext.substring(1);
	if(tannus_sys_Mimes.extensions.exists(ext)) return tannus_sys_Mimes.extensions.get(ext); else return "application/octet-stream";
};
tannus_sys_Mimes.getExtensionList = function(mime) {
	if(!tannus_sys_Mimes.initted) tannus_sys_Mimes.__init();
	if(tannus_sys_Mimes.types.exists(mime)) return tannus_sys_Mimes.types.get(mime); else return [];
};
tannus_sys_Mimes.__init = function() {
	tannus_sys_Mimes.types = new haxe_ds_StringMap();
	tannus_sys_Mimes.extensions = new haxe_ds_StringMap();
	var all = Reflect.fields(tannus_sys_Mimes.primitive);
	var _g = 0;
	while(_g < all.length) {
		var ext = all[_g];
		++_g;
		var type = Std.string(Reflect.getProperty(tannus_sys_Mimes.primitive,ext));
		{
			tannus_sys_Mimes.extensions.set(ext,type);
			type;
		}
		if(tannus_sys_Mimes.types.get(type) == null) {
			var v = [];
			tannus_sys_Mimes.types.set(type,v);
			v;
		}
		tannus_sys_Mimes.types.get(type).push(ext);
	}
	tannus_sys_Mimes.initted = true;
};
var tannus_sys__$Path_Path_$Impl_$ = {};
$hxClasses["tannus.sys._Path.Path_Impl_"] = tannus_sys__$Path_Path_$Impl_$;
tannus_sys__$Path_Path_$Impl_$.__name__ = ["tannus","sys","_Path","Path_Impl_"];
tannus_sys__$Path_Path_$Impl_$._new = function(s) {
	return new tannus_sys__$Path_CPath(s);
};
tannus_sys__$Path_Path_$Impl_$.sum = function(x,y) {
	var s;
	{
		var this1 = tannus_sys__$Path_CPath.join([x.s,y.s]);
		s = this1.s;
	}
	return new tannus_sys__$Path_CPath(s);
};
tannus_sys__$Path_Path_$Impl_$.toString = function(this1) {
	return this1.s;
};
tannus_sys__$Path_Path_$Impl_$.fromString = function(s) {
	return new tannus_sys__$Path_CPath(s);
};
tannus_sys__$Path_Path_$Impl_$.toByteArray = function(this1) {
	var ba = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
	tannus_io__$ByteArray_ByteArray_$Impl_$.writeString(ba,this1.s);
	return ba;
};
tannus_sys__$Path_Path_$Impl_$.fromByteArray = function(b) {
	var s = b.map(function(b1) {
		return String.fromCharCode(b1);
	}).join("");
	return new tannus_sys__$Path_CPath(s);
};
var tannus_sys__$Path_CPath = function(str) {
	this.s = str;
};
$hxClasses["tannus.sys._Path.CPath"] = tannus_sys__$Path_CPath;
tannus_sys__$Path_CPath.__name__ = ["tannus","sys","_Path","CPath"];
tannus_sys__$Path_CPath.join = function(list) {
	var res = haxe_io_Path.join(list);
	return new tannus_sys__$Path_CPath(res);
};
tannus_sys__$Path_CPath._expand = function(p) {
	var segments = p.get_pieces();
	var pieces = [];
	var _g = 0;
	while(_g < segments.length) {
		var s = segments[_g];
		++_g;
		switch(s) {
		case ".":case "":
			continue;
			break;
		case "..":
			pieces.pop();
			break;
		default:
			pieces.push(s);
		}
	}
	var result = tannus_sys__$Path_CPath.join(pieces).normalize();
	return result;
};
tannus_sys__$Path_CPath.err = function(msg) {
	throw new js__$Boot_HaxeError("PathError: " + msg);
};
tannus_sys__$Path_CPath.prototype = {
	toString: function() {
		return this.s;
	}
	,normalize: function() {
		{
			var s = haxe_io_Path.normalize(this.s);
			return new tannus_sys__$Path_CPath(s);
		}
	}
	,absolutize: function() {
		var spath = this.s + "";
		if(!StringTools.startsWith(spath,"/")) spath = "/" + spath;
		console.log(spath);
		return new tannus_sys__$Path_CPath(spath);
	}
	,expand: function() {
		return tannus_sys__$Path_CPath._expand(this);
	}
	,resolve: function(other) {
		if(!this.get_absolute()) throw new js__$Boot_HaxeError("PathError: " + "Cannot resolve a relative Path by another relative Path; One of them must be absolute!"); else {
			var joined = tannus_sys__$Path_CPath.join([this.s,other.s]).normalize();
			var result = tannus_sys__$Path_CPath._expand(joined);
			return result;
		}
		return new tannus_sys__$Path_CPath("");
	}
	,relative: function(other) {
		if(this.get_absolute() && other.get_absolute()) {
			var a = this.get_pieces();
			var b = other.get_pieces();
			var keep = [];
			var diffs = 0;
			var additions = [];
			var diffhit = false;
			var _g1 = 0;
			var _g = a.length;
			while(_g1 < _g) {
				var i = _g1++;
				var mine = a[i];
				var yurs = b[i];
				if(mine != yurs) diffhit = true;
				if(!diffhit) keep.push(mine); else {
					diffs++;
					if(yurs != null) additions.push(yurs);
				}
			}
			var respieces = tannus_ds_ArrayTools.times([".."],diffs).concat(additions);
			return tannus_sys__$Path_CPath.join(respieces);
		} else throw new js__$Boot_HaxeError("PathError: " + "Both Paths must be absolute!");
		return new tannus_sys__$Path_CPath("");
	}
	,get_sdir: function() {
		return haxe_io_Path.directory(this.s);
	}
	,get_str: function() {
		return this.s;
	}
	,set_str: function(v) {
		return this.s = v;
	}
	,get_directory: function() {
		var s = this.get_sdir();
		return new tannus_sys__$Path_CPath(s);
	}
	,set_directory: function(v) {
		var this1 = tannus_sys__$Path_CPath.join([v.s,this.get_name()]);
		this.s = this1.s;
		return this.get_directory();
	}
	,get_name: function() {
		return haxe_io_Path.withoutDirectory(this.s);
	}
	,set_name: function(v) {
		var this1 = tannus_sys__$Path_CPath.join([this.get_sdir(),v]);
		this.s = this1.s;
		return this.get_name();
	}
	,get_basename: function() {
		return haxe_io_Path.withoutExtension(this.s);
	}
	,set_basename: function(v) {
		this.set_name(v + ("." + this.get_extension()));
		return this.get_basename();
	}
	,get_extension: function() {
		return haxe_io_Path.extension(this.s);
	}
	,set_extension: function(v) {
		this.s = tannus_ds_StringUtils.beforeLast(this.s,".") + ("." + v);
		return this.get_extension();
	}
	,get_mime: function() {
		if(!tannus_ds_StringUtils.empty(this.get_extension())) {
			var m = tannus_sys_Mimes.getMimeType(this.get_extension());
			return m;
		} else return null;
	}
	,get_root: function() {
		return tannus_ds_StringUtils.empty(this.get_sdir());
	}
	,get_absolute: function() {
		return haxe_io_Path.isAbsolute(this.s);
	}
	,get_pieces: function() {
		return this.s.split("/");
	}
	,set_pieces: function(v) {
		var this1 = tannus_sys__$Path_CPath.join(v);
		this.s = this1.s;
		return this.get_pieces();
	}
	,__class__: tannus_sys__$Path_CPath
	,__properties__: {set_pieces:"set_pieces",get_pieces:"get_pieces",get_absolute:"get_absolute",get_root:"get_root",get_mime:"get_mime",set_extension:"set_extension",get_extension:"get_extension",set_basename:"set_basename",get_basename:"get_basename",set_name:"set_name",get_name:"get_name",set_directory:"set_directory",get_directory:"get_directory",set_str:"set_str",get_str:"get_str",get_sdir:"get_sdir"}
};
var tannus_sys_VVEntry = function(vv,nam,typ) {
	this.name = nam;
	this.content = null;
	this.type = typ;
	this.meta = new haxe_ds_StringMap();
	this.volume = vv;
	this.__init();
};
$hxClasses["tannus.sys.VVEntry"] = tannus_sys_VVEntry;
tannus_sys_VVEntry.__name__ = ["tannus","sys","VVEntry"];
tannus_sys_VVEntry.deserialize = function(o,vol) {
	var e = new tannus_sys_VVEntry(vol,o.name,o.type);
	e.meta = o.meta;
	e.content = o.content;
	return e;
};
tannus_sys_VVEntry.prototype = {
	__init: function() {
		this.set_cdate(new Date());
	}
	,update: function() {
		this.set_mdate(new Date());
	}
	,list: function() {
		var _g = this;
		if(!this.get_isFile()) {
			var entries = this.volume.entries;
			return entries.filter(function(e) {
				return new tannus_sys__$Path_CPath(e.name).get_directory() == new tannus_sys__$Path_CPath(_g.name);
			});
		} else throw new js__$Boot_HaxeError((function($this) {
			var $r;
			var x = new tannus_sys__$Path_CPath("IOError: ");
			var y;
			{
				var x1;
				var x2 = new tannus_sys__$Path_CPath("\"");
				var y2 = new tannus_sys__$Path_CPath($this.name);
				var s;
				{
					var this1 = tannus_sys__$Path_CPath.join([x2.s,y2.s]);
					s = this1.s;
				}
				x1 = new tannus_sys__$Path_CPath(s);
				var y1 = new tannus_sys__$Path_CPath("\" is a File!");
				var s1;
				{
					var this2 = tannus_sys__$Path_CPath.join([x1.s,y1.s]);
					s1 = this2.s;
				}
				y = new tannus_sys__$Path_CPath(s1);
			}
			$r = (function($this) {
				var $r;
				var s2;
				{
					var this3 = tannus_sys__$Path_CPath.join([x.s,y.s]);
					s2 = this3.s;
				}
				$r = new tannus_sys__$Path_CPath(s2);
				return $r;
			}($this));
			return $r;
		}(this)));
		return [];
	}
	,write: function(data) {
		if(this.get_isFile() || !this.volume.exists((function($this) {
			var $r;
			var this1 = new tannus_sys__$Path_CPath($this.name);
			$r = this1.s;
			return $r;
		}(this)))) {
			this.content = data;
			this.set_mdate(new Date());
		} else throw new js__$Boot_HaxeError((function($this) {
			var $r;
			var x = new tannus_sys__$Path_CPath("IOError: ");
			var y;
			{
				var x1;
				var x2 = new tannus_sys__$Path_CPath("\"");
				var y2 = new tannus_sys__$Path_CPath($this.name);
				var s;
				{
					var this2 = tannus_sys__$Path_CPath.join([x2.s,y2.s]);
					s = this2.s;
				}
				x1 = new tannus_sys__$Path_CPath(s);
				var y1 = new tannus_sys__$Path_CPath("\" is a Directory!");
				var s1;
				{
					var this3 = tannus_sys__$Path_CPath.join([x1.s,y1.s]);
					s1 = this3.s;
				}
				y = new tannus_sys__$Path_CPath(s1);
			}
			$r = (function($this) {
				var $r;
				var s2;
				{
					var this4 = tannus_sys__$Path_CPath.join([x.s,y.s]);
					s2 = this4.s;
				}
				$r = new tannus_sys__$Path_CPath(s2);
				return $r;
			}($this));
			return $r;
		}(this)));
	}
	,read: function() {
		if(this.get_isFile()) {
			if(this.content == null) {
				var ba = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
				tannus_io__$ByteArray_ByteArray_$Impl_$.writeString(ba,"");
				return ba;
			} else return this.content;
		} else throw new js__$Boot_HaxeError((function($this) {
			var $r;
			var x = new tannus_sys__$Path_CPath("IOError: ");
			var y;
			{
				var x1;
				var x2 = new tannus_sys__$Path_CPath("\"");
				var y2 = new tannus_sys__$Path_CPath($this.name);
				var s;
				{
					var this1 = tannus_sys__$Path_CPath.join([x2.s,y2.s]);
					s = this1.s;
				}
				x1 = new tannus_sys__$Path_CPath(s);
				var y1 = new tannus_sys__$Path_CPath("\" cannot be read!");
				var s1;
				{
					var this2 = tannus_sys__$Path_CPath.join([x1.s,y1.s]);
					s1 = this2.s;
				}
				y = new tannus_sys__$Path_CPath(s1);
			}
			$r = (function($this) {
				var $r;
				var s2;
				{
					var this3 = tannus_sys__$Path_CPath.join([x.s,y.s]);
					s2 = this3.s;
				}
				$r = new tannus_sys__$Path_CPath(s2);
				return $r;
			}($this));
			return $r;
		}(this)));
		return tannus_io__$ByteArray_ByteArray_$Impl_$._new();
	}
	,append: function(data) {
		if(this.get_isFile()) {
			this.content = this.read();
			this.content = this.content.concat(data);
			this.set_mdate(new Date());
		} else throw new js__$Boot_HaxeError((function($this) {
			var $r;
			var x = new tannus_sys__$Path_CPath("IOError: ");
			var y;
			{
				var x1;
				var x2 = new tannus_sys__$Path_CPath("\"");
				var y2 = new tannus_sys__$Path_CPath($this.name);
				var s;
				{
					var this1 = tannus_sys__$Path_CPath.join([x2.s,y2.s]);
					s = this1.s;
				}
				x1 = new tannus_sys__$Path_CPath(s);
				var y1 = new tannus_sys__$Path_CPath("\" cannot be written to!");
				var s1;
				{
					var this2 = tannus_sys__$Path_CPath.join([x1.s,y1.s]);
					s1 = this2.s;
				}
				y = new tannus_sys__$Path_CPath(s1);
			}
			$r = (function($this) {
				var $r;
				var s2;
				{
					var this3 = tannus_sys__$Path_CPath.join([x.s,y.s]);
					s2 = this3.s;
				}
				$r = new tannus_sys__$Path_CPath(s2);
				return $r;
			}($this));
			return $r;
		}(this)));
	}
	,rename: function(newname) {
		if(this.get_isFile()) this.name = newname; else {
			var subs = this.list();
			var _g = 0;
			while(_g < subs.length) {
				var e = subs[_g];
				++_g;
				var np;
				{
					var this1 = new tannus_sys__$Path_CPath(e.name).normalize();
					np = this1.s;
				}
				np = StringTools.replace(np,(function($this) {
					var $r;
					var this2 = new tannus_sys__$Path_CPath($this.name).normalize();
					$r = this2.s;
					return $r;
				}(this)),(function($this) {
					var $r;
					var this3 = new tannus_sys__$Path_CPath(newname).normalize();
					$r = this3.s;
					return $r;
				}(this)));
				e.name = np;
			}
			this.name = newname;
		}
	}
	,serialize: function() {
		return { 'name' : this.name, 'type' : this.type, 'meta' : this.meta, 'content' : this.content};
	}
	,get_path: function() {
		return new tannus_sys__$Path_CPath(this.name);
	}
	,set_path: function(np) {
		this.name = np.s;
		return new tannus_sys__$Path_CPath(this.name);
	}
	,get_stats: function() {
		if(!this.get_isFile()) throw new js__$Boot_HaxeError((function($this) {
			var $r;
			var x = new tannus_sys__$Path_CPath("IOError: ");
			var y;
			{
				var x1;
				var x2 = new tannus_sys__$Path_CPath("\"");
				var y2 = new tannus_sys__$Path_CPath($this.name);
				var s;
				{
					var this1 = tannus_sys__$Path_CPath.join([x2.s,y2.s]);
					s = this1.s;
				}
				x1 = new tannus_sys__$Path_CPath(s);
				var y1 = new tannus_sys__$Path_CPath("\" is a Directory!");
				var s1;
				{
					var this2 = tannus_sys__$Path_CPath.join([x1.s,y1.s]);
					s1 = this2.s;
				}
				y = new tannus_sys__$Path_CPath(s1);
			}
			$r = (function($this) {
				var $r;
				var s2;
				{
					var this3 = tannus_sys__$Path_CPath.join([x.s,y.s]);
					s2 = this3.s;
				}
				$r = new tannus_sys__$Path_CPath(s2);
				return $r;
			}($this));
			return $r;
		}(this)));
		return { 'size' : this.read().length, 'ctime' : this.get_cdate(), 'mtime' : this.get_mdate()};
	}
	,get_isFile: function() {
		var _g = this.type;
		switch(_g[1]) {
		case 0:
			return true;
		default:
			return false;
		}
	}
	,get_isDirectory: function() {
		return !this.get_isFile();
	}
	,get_cdate: function() {
		return this.meta.get("cdate");
	}
	,set_cdate: function(cd) {
		var _cd = this.meta.get("cdate");
		if(_cd != null && js_Boot.__instanceof(_cd,Date)) return _cd; else return (function($this) {
			var $r;
			$this.meta.set("cdate",cd);
			$r = cd;
			return $r;
		}(this));
	}
	,get_mdate: function() {
		var m = this.meta.get("mdate");
		if(m != null) return m; else return this.get_cdate();
	}
	,set_mdate: function(nm) {
		return (function($this) {
			var $r;
			$this.meta.set("mdate",nm);
			$r = nm;
			return $r;
		}(this));
	}
	,__class__: tannus_sys_VVEntry
	,__properties__: {set_mdate:"set_mdate",get_mdate:"get_mdate",set_cdate:"set_cdate",get_cdate:"get_cdate",get_isDirectory:"get_isDirectory",get_isFile:"get_isFile",get_stats:"get_stats",set_path:"set_path",get_path:"get_path"}
};
var tannus_sys_VVType = $hxClasses["tannus.sys.VVType"] = { __ename__ : ["tannus","sys","VVType"], __constructs__ : ["VVFile","VVFolder"] };
tannus_sys_VVType.VVFile = ["VVFile",0];
tannus_sys_VVType.VVFile.toString = $estr;
tannus_sys_VVType.VVFile.__enum__ = tannus_sys_VVType;
tannus_sys_VVType.VVFolder = ["VVFolder",1];
tannus_sys_VVType.VVFolder.toString = $estr;
tannus_sys_VVType.VVFolder.__enum__ = tannus_sys_VVType;
var tannus_sys_VirtualVolume = function(nam) {
	this.name = nam;
	this.entries = [];
};
$hxClasses["tannus.sys.VirtualVolume"] = tannus_sys_VirtualVolume;
tannus_sys_VirtualVolume.__name__ = ["tannus","sys","VirtualVolume"];
tannus_sys_VirtualVolume.deserialize = function(data) {
	var bits = haxe_Unserializer.run(data.map(function(b) {
		return String.fromCharCode(b);
	}).join(""));
	var vv = new tannus_sys_VirtualVolume("wut");
	var _g = 0;
	while(_g < bits.length) {
		var bit = bits[_g];
		++_g;
		var e = tannus_sys_VVEntry.deserialize(bit,vv);
		vv.entries.push(e);
	}
	return vv;
};
tannus_sys_VirtualVolume.error = function(msg) {
	throw new js__$Boot_HaxeError("IOError: " + msg);
};
tannus_sys_VirtualVolume.normal = function(name) {
	{
		var this1 = new tannus_sys__$Path_CPath(name).normalize();
		return this1.s;
	}
};
tannus_sys_VirtualVolume.prototype = {
	all: function() {
		return this.entries;
	}
	,getEntry: function(name) {
		name = tannus_sys_VirtualVolume.normal(name);
		var _g = 0;
		var _g1 = this.entries;
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			if((function($this) {
				var $r;
				var this1 = new tannus_sys__$Path_CPath(f.name);
				$r = this1.s;
				return $r;
			}(this)) == name) return f;
		}
		return null;
	}
	,create: function(name,type) {
		name = tannus_sys_VirtualVolume.normal(name);
		var e = new tannus_sys_VVEntry(this,name,type);
		this.entries.push(e);
		return e;
	}
	,validatePath: function(p) {
		this.name = tannus_sys_VirtualVolume.normal(this.name);
		var _p = p;
		while(true) if(_p.get_root()) break; else {
			_p = _p.get_directory();
			if(!this.exists(_p.s)) tannus_sys_VirtualVolume.error((function($this) {
				var $r;
				var this1;
				{
					var x;
					var x1 = new tannus_sys__$Path_CPath("No such file or directory \"");
					var s;
					{
						var this2 = tannus_sys__$Path_CPath.join([x1.s,_p.s]);
						s = this2.s;
					}
					x = new tannus_sys__$Path_CPath(s);
					var y = new tannus_sys__$Path_CPath("\"!");
					var s1;
					{
						var this3 = tannus_sys__$Path_CPath.join([x.s,y.s]);
						s1 = this3.s;
					}
					this1 = new tannus_sys__$Path_CPath(s1);
				}
				$r = this1.s;
				return $r;
			}(this)));
		}
	}
	,exists: function(name) {
		name = tannus_sys_VirtualVolume.normal(name);
		var p = new tannus_sys__$Path_CPath(name);
		return this.getEntry(p.s) != null;
	}
	,isDirectory: function(name) {
		name = tannus_sys_VirtualVolume.normal(name);
		var p = new tannus_sys__$Path_CPath(name);
		var e = this.getEntry(name);
		if(e == null) return false; else if(name == "" || name == "/") return true; else {
			var _g = e.type;
			switch(_g[1]) {
			case 1:
				return true;
			default:
				return false;
			}
		}
	}
	,createDirectory: function(name) {
		name = tannus_sys_VirtualVolume.normal(name);
		this.validatePath(new tannus_sys__$Path_CPath(name));
		this.create(name,tannus_sys_VVType.VVFolder);
	}
	,deleteDirectory: function(name) {
		name = tannus_sys_VirtualVolume.normal(name);
		if(this.isDirectory(name)) {
			var e = this.getEntry(name);
			var subs = e.list();
			if(subs.length == 0) HxOverrides.remove(this.entries,e); else throw new js__$Boot_HaxeError("IOError: " + ("Directory not empty \"" + name + "\"!"));
		}
	}
	,readDirectory: function(name) {
		name = tannus_sys_VirtualVolume.normal(name);
		var p = new tannus_sys__$Path_CPath(name);
		if(name == "" || name == "/") return this.entries.filter(function(e) {
			return new tannus_sys__$Path_CPath(e.name).get_root();
		}).map(function(e1) {
			{
				var this1 = new tannus_sys__$Path_CPath(e1.name).normalize();
				return this1.s;
			}
		}); else if(this.isDirectory(name)) {
			var e2 = this.getEntry(name);
			return e2.list().map(function(e3) {
				return e3.name;
			});
		} else throw new js__$Boot_HaxeError("IOError: " + ("\"" + name + "\" is not a Directory!"));
	}
	,write: function(path,data) {
		path = tannus_sys_VirtualVolume.normal(path);
		this.validatePath(new tannus_sys__$Path_CPath(path));
		var e = this.getEntry(path);
		if(e == null) e = this.create(path,tannus_sys_VVType.VVFile);
		e.write(data);
	}
	,read: function(path) {
		path = tannus_sys_VirtualVolume.normal(path);
		var e = this.getEntry(path);
		if(e != null && e.get_isFile()) return e.read(); else throw new js__$Boot_HaxeError("IOError: " + ("\"" + path + "\" is either a Directory, or does not exist!"));
	}
	,append: function(path,data) {
		path = tannus_sys_VirtualVolume.normal(path);
		var e = this.getEntry(path);
		if(e != null && e.get_isFile()) e.append(data); else throw new js__$Boot_HaxeError("IOError: " + ("\"" + path + "\" cannot be written to!"));
	}
	,deleteFile: function(path) {
		path = tannus_sys_VirtualVolume.normal(path);
		var e = this.getEntry(path);
		if(e != null && e.get_isFile()) HxOverrides.remove(this.entries,e); else throw new js__$Boot_HaxeError("IOError: " + ("Cannot delete \"" + path + "\"!"));
	}
	,rename: function(oldp,newp) {
		oldp = tannus_sys_VirtualVolume.normal(oldp);
		newp = tannus_sys_VirtualVolume.normal(newp);
		if(this.exists(oldp)) {
			this.validatePath(new tannus_sys__$Path_CPath(newp));
			var e = this.getEntry(oldp);
			e.rename(newp);
		} else throw new js__$Boot_HaxeError("IOError: " + ("No such file or directory \"" + oldp + "\"!"));
	}
	,stat: function(path) {
		path = tannus_sys_VirtualVolume.normal(path);
		var e = this.getEntry(path);
		if(e != null) return e.get_stats(); else throw new js__$Boot_HaxeError("IOError: " + ("No such file or directory \"" + path + "\"!"));
	}
	,serialize: function() {
		var bits = [];
		var _g = 0;
		var _g1 = this.entries;
		while(_g < _g1.length) {
			var e = _g1[_g];
			++_g;
			bits.push(e.serialize());
		}
		var data = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
		haxe_Serializer.USE_CACHE = true;
		haxe_Serializer.USE_ENUM_INDEX = true;
		var ba;
		{
			var s = haxe_Serializer.run(bits);
			var ba1 = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
			tannus_io__$ByteArray_ByteArray_$Impl_$.writeString(ba1,s);
			ba = ba1;
		}
		data = data.concat(ba);
		return data;
	}
	,zip: function() {
		var entry_list = new List();
		var _g = 0;
		var _g1 = this.entries;
		while(_g < _g1.length) {
			var e = _g1[_g];
			++_g;
			if(e.get_isFile()) {
				var zentry = { 'fileTime' : new Date(), 'fileSize' : e.content.length, 'fileName' : (function($this) {
					var $r;
					var this1 = new tannus_sys__$Path_CPath(e.name);
					$r = this1.s;
					return $r;
				}(this)), 'dataSize' : e.content.length, 'data' : (function($this) {
					var $r;
					var this2 = e.content;
					var buf = [haxe_io_Bytes.alloc(this2.length)];
					tannus_io__$ByteArray_ByteArray_$Impl_$.each(this2,(function(buf) {
						return function(i,b) {
							buf[0].b[i] = b & 255;
						};
					})(buf));
					$r = buf[0];
					return $r;
				}(this)), 'compressed' : false, 'extraFields' : null, 'crc32' : null};
				entry_list.push(zentry);
			}
		}
		var out = new haxe_io_BytesOutput();
		var writer = new haxe_zip_Writer(out);
		writer.write(entry_list);
		var zip_data;
		{
			var buf1 = out.getBytes();
			var ba = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
			if(buf1.length > 0) {
				var _g11 = 0;
				var _g2 = buf1.length;
				while(_g11 < _g2) {
					var i1 = _g11++;
					var n = buf1.b[i1];
					ba.push(n);
				}
			}
			zip_data = ba;
		}
		return new tannus_io_CBlob("zipfile","application/zip",zip_data);
	}
	,__class__: tannus_sys_VirtualVolume
};
var tannus_sys_gs_Lexer = function() {
	this.reserved = [];
	this.buffer = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
	this.tree = [];
	this.reserve((function($this) {
		var $r;
		var ba = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
		tannus_io__$ByteArray_ByteArray_$Impl_$.writeString(ba,"*{[,:<");
		$r = ba;
		return $r;
	}(this)));
};
$hxClasses["tannus.sys.gs.Lexer"] = tannus_sys_gs_Lexer;
tannus_sys_gs_Lexer.__name__ = ["tannus","sys","gs","Lexer"];
tannus_sys_gs_Lexer.prototype = {
	lex: function(s) {
		this.buffer = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
		this.tree = [];
		{
			var ba = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
			tannus_io__$ByteArray_ByteArray_$Impl_$.writeString(ba,s);
			this.buffer = ba;
		}
		while(true) {
			var t = this.lexNext();
			if(t == null) break; else this.tree.push(t);
		}
		return this.tree;
	}
	,lexNext: function() {
		var c = this.buffer[0];
		if(this.buffer.length <= 0) return null; else if(tannus_io__$Byte_Byte_$Impl_$.equalsi(c,42)) {
			this.advance();
			console.log("asterisk");
			if(tannus_io__$Byte_Byte_$Impl_$.equalsi(this.buffer[0],42)) {
				this.advance();
				return tannus_sys_gs_Token.DoubleStar;
			} else return tannus_sys_gs_Token.Star;
		} else if(tannus_io__$Byte_Byte_$Impl_$.equalsi(c,44)) {
			this.advance();
			return tannus_sys_gs_Token.Comma;
		} else if(tannus_io__$Byte_Byte_$Impl_$.equalsi(c,123)) {
			var betw = this.between((function($this) {
				var $r;
				var b = 0;
				{
					var n = HxOverrides.cca("{",0);
					if(!tannus_io__$Byte_Byte_$Impl_$.isValid(n)) throw new js__$Boot_HaxeError("Invalid Byte Value (" + n + ")!");
					b = n;
					String.fromCharCode(b);
				}
				$r = b;
				return $r;
			}(this)),(function($this) {
				var $r;
				var b1 = 0;
				{
					var n1 = HxOverrides.cca("}",0);
					if(!tannus_io__$Byte_Byte_$Impl_$.isValid(n1)) throw new js__$Boot_HaxeError("Invalid Byte Value (" + n1 + ")!");
					b1 = n1;
					String.fromCharCode(b1);
				}
				$r = b1;
				return $r;
			}(this)));
			var etree = this.ilex(betw);
			var list = [];
			var ct = [];
			var _g = 0;
			while(_g < etree.length) {
				var tk = etree[_g];
				++_g;
				switch(tk[1]) {
				case 6:
					list.push(ct);
					ct = [];
					break;
				default:
					ct.push(tk);
				}
			}
			list.push(ct);
			return tannus_sys_gs_Token.Expand(list);
		} else if(tannus_io__$Byte_Byte_$Impl_$.equalsi(c,91)) {
			var opt = this.ilex(this.between((function($this) {
				var $r;
				var b2 = 0;
				{
					var n2 = HxOverrides.cca("[",0);
					if(!tannus_io__$Byte_Byte_$Impl_$.isValid(n2)) throw new js__$Boot_HaxeError("Invalid Byte Value (" + n2 + ")!");
					b2 = n2;
					String.fromCharCode(b2);
				}
				$r = b2;
				return $r;
			}(this)),(function($this) {
				var $r;
				var b3 = 0;
				{
					var n3 = HxOverrides.cca("]",0);
					if(!tannus_io__$Byte_Byte_$Impl_$.isValid(n3)) throw new js__$Boot_HaxeError("Invalid Byte Value (" + n3 + ")!");
					b3 = n3;
					String.fromCharCode(b3);
				}
				$r = b3;
				return $r;
			}(this))));
			return tannus_sys_gs_Token.Optional(opt);
		} else if(tannus_io__$Byte_Byte_$Impl_$.equalsi(c,58)) {
			this.advance();
			return tannus_sys_gs_Token.Colon;
		} else if(tannus_io__$Byte_Byte_$Impl_$.equalsi(c,60)) {
			var param = this.ilex(this.between((function($this) {
				var $r;
				var b4 = 0;
				{
					var n4 = HxOverrides.cca("<",0);
					if(!tannus_io__$Byte_Byte_$Impl_$.isValid(n4)) throw new js__$Boot_HaxeError("Invalid Byte Value (" + n4 + ")!");
					b4 = n4;
					String.fromCharCode(b4);
				}
				$r = b4;
				return $r;
			}(this)),(function($this) {
				var $r;
				var b5 = 0;
				{
					var n5 = HxOverrides.cca(">",0);
					if(!tannus_io__$Byte_Byte_$Impl_$.isValid(n5)) throw new js__$Boot_HaxeError("Invalid Byte Value (" + n5 + ")!");
					b5 = n5;
					String.fromCharCode(b5);
				}
				$r = b5;
				return $r;
			}(this)),false));
			var name = "";
			var check = tannus_sys_gs_Token.Star;
			var bits = [param.shift(),param.shift(),param.shift()];
			switch(bits.length) {
			case 3:
				switch(bits[0][1]) {
				case 0:
					if(bits[1] == null) {
						if(bits[2] == null) {
							var sname = bits[0][2];
							name = StringTools.trim(sname);
						} else switch(bits[2][1]) {
						default:
							throw new js__$Boot_HaxeError("Unexpected " + Std.string(bits));
						}
					} else switch(bits[1][1]) {
					case 7:
						var tcheck = bits[2];
						var sname1 = bits[0][2];
						if(tcheck != null) {
							name = sname1;
							check = tcheck;
						} else throw new js__$Boot_HaxeError("Unexpected " + Std.string(bits));
						break;
					default:
						throw new js__$Boot_HaxeError("Unexpected " + Std.string(bits));
					}
					break;
				default:
					throw new js__$Boot_HaxeError("Unexpected " + Std.string(bits));
				}
				break;
			default:
				throw new js__$Boot_HaxeError("Unexpected " + Std.string(bits));
			}
			return tannus_sys_gs_Token.Param(name,check);
		} else {
			var txt = String.fromCharCode(c);
			this.advance();
			while(!(this.buffer.length <= 0) && !Lambda.has(this.reserved,this.buffer[0])) {
				c = this.advance();
				txt += String.fromCharCode(c);
			}
			return tannus_sys_gs_Token.Literal(txt);
		}
	}
	,ilex: function(s) {
		var current = this.save();
		this.buffer = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
		this.tree = [];
		var res = this.lex(s);
		this.restore(current);
		return res;
	}
	,between: function(start,end,recursive) {
		if(recursive == null) recursive = true;
		var c = this.buffer[0];
		var str = "";
		if(tannus_io__$Byte_Byte_$Impl_$.equalsi(c,start)) {
			this.advance();
			var lvl = 1;
			while(!(this.buffer.length <= 0) && lvl > 0) {
				c = this.buffer[0];
				if(tannus_io__$Byte_Byte_$Impl_$.equalsi(c,start) && recursive) lvl++; else if(tannus_io__$Byte_Byte_$Impl_$.equalsi(c,end)) lvl--;
				if(lvl > 0) str += String.fromCharCode(c);
				this.advance();
			}
		} else throw new js__$Boot_HaxeError("Structure not present!");
		return str;
	}
	,reset: function() {
		this.buffer = tannus_io__$ByteArray_ByteArray_$Impl_$._new();
		this.tree = [];
	}
	,next: function(d) {
		if(d == null) d = 1;
		return this.buffer[d - 1];
	}
	,advance: function() {
		return this.buffer.shift();
	}
	,reserve: function(set) {
		this.reserved = this.reserved.concat(set);
	}
	,save: function() {
		return { 'buffer' : this.buffer, 'tree' : this.tree};
	}
	,restore: function(s) {
		this.buffer = s.buffer;
		this.tree = s.tree;
	}
	,get_eoi: function() {
		return this.buffer.length <= 0;
	}
	,__class__: tannus_sys_gs_Lexer
	,__properties__: {get_eoi:"get_eoi"}
};
var tannus_sys_gs_Printer = function() {
	this.groupCount = 0;
	this.params = new haxe_ds_StringMap();
};
$hxClasses["tannus.sys.gs.Printer"] = tannus_sys_gs_Printer;
tannus_sys_gs_Printer.__name__ = ["tannus","sys","gs","Printer"];
tannus_sys_gs_Printer.compile = function(s) {
	var p = new tannus_sys_gs_Printer();
	var t = new tannus_sys_gs_Lexer().lex(s);
	return { 'regex' : p.pattern(t), 'params' : p.params};
};
tannus_sys_gs_Printer.prototype = {
	pattern: function(tree) {
		return new EReg(this.print(tree),"");
	}
	,print: function(tree) {
		var s = "";
		var _g = 0;
		while(_g < tree.length) {
			var t = tree[_g];
			++_g;
			s += this.printToken(t);
		}
		return s;
	}
	,printToken: function(t,parent) {
		switch(t[1]) {
		case 0:
			var txt = t[2];
			return this.escape(txt);
		case 4:
			this.groupCount++;
			return "([^/]+)";
		case 5:
			this.groupCount++;
			return "(.+)";
		case 3:
			var check = t[3];
			var name = t[2];
			var v = this.groupCount;
			this.params.set(name,v);
			v;
			return this.printToken(check,t);
		case 2:
			var tree = t[2];
			this.groupCount++;
			var sprint = (function(f,a1) {
				return function(t1) {
					return f(t1,a1);
				};
			})($bind(this,this.printToken),t);
			return tannus_ds_StringUtils.wrap(tree.map(sprint).join(""),"(",")") + "?";
		case 1:
			var choices = t[2];
			this.groupCount++;
			var sprint1 = (function(f1,a11) {
				return function(t2) {
					return f1(t2,a11);
				};
			})($bind(this,this.printToken),t);
			var schoices;
			var _g = [];
			var _g1 = 0;
			while(_g1 < choices.length) {
				var c = choices[_g1];
				++_g1;
				_g.push(c.map(sprint1).join(""));
			}
			schoices = _g;
			var canBeEmpty = HxOverrides.remove(schoices,"");
			var res = tannus_ds_StringUtils.wrap(schoices.join("|"),"(",")");
			if(canBeEmpty) res += "?";
			return res;
		default:
			console.log(Std.string(t) + "");
			throw new js__$Boot_HaxeError("SyntaxError: Unexpected " + Std.string(t));
			return "";
		}
	}
	,escape: function(txt) {
		var esc = [".","^","$","+","(",")","?"];
		var _g = 0;
		while(_g < esc.length) {
			var c = esc[_g];
			++_g;
			txt = StringTools.replace(txt,c,"\\" + c);
		}
		return txt;
	}
	,__class__: tannus_sys_gs_Printer
};
var tannus_sys_gs_Token = $hxClasses["tannus.sys.gs.Token"] = { __ename__ : ["tannus","sys","gs","Token"], __constructs__ : ["Literal","Expand","Optional","Param","Star","DoubleStar","Comma","Colon"] };
tannus_sys_gs_Token.Literal = function(txt) { var $x = ["Literal",0,txt]; $x.__enum__ = tannus_sys_gs_Token; $x.toString = $estr; return $x; };
tannus_sys_gs_Token.Expand = function(pieces) { var $x = ["Expand",1,pieces]; $x.__enum__ = tannus_sys_gs_Token; $x.toString = $estr; return $x; };
tannus_sys_gs_Token.Optional = function(sub) { var $x = ["Optional",2,sub]; $x.__enum__ = tannus_sys_gs_Token; $x.toString = $estr; return $x; };
tannus_sys_gs_Token.Param = function(name,check) { var $x = ["Param",3,name,check]; $x.__enum__ = tannus_sys_gs_Token; $x.toString = $estr; return $x; };
tannus_sys_gs_Token.Star = ["Star",4];
tannus_sys_gs_Token.Star.toString = $estr;
tannus_sys_gs_Token.Star.__enum__ = tannus_sys_gs_Token;
tannus_sys_gs_Token.DoubleStar = ["DoubleStar",5];
tannus_sys_gs_Token.DoubleStar.toString = $estr;
tannus_sys_gs_Token.DoubleStar.__enum__ = tannus_sys_gs_Token;
tannus_sys_gs_Token.Comma = ["Comma",6];
tannus_sys_gs_Token.Comma.toString = $estr;
tannus_sys_gs_Token.Comma.__enum__ = tannus_sys_gs_Token;
tannus_sys_gs_Token.Colon = ["Colon",7];
tannus_sys_gs_Token.Colon.toString = $estr;
tannus_sys_gs_Token.Colon.__enum__ = tannus_sys_gs_Token;
var tannus_sys_internal__$FileContent_FileContent_$Impl_$ = {};
$hxClasses["tannus.sys.internal._FileContent.FileContent_Impl_"] = tannus_sys_internal__$FileContent_FileContent_$Impl_$;
tannus_sys_internal__$FileContent_FileContent_$Impl_$.__name__ = ["tannus","sys","internal","_FileContent","FileContent_Impl_"];
tannus_sys_internal__$FileContent_FileContent_$Impl_$.__properties__ = {get_f:"get_f"}
tannus_sys_internal__$FileContent_FileContent_$Impl_$._new = function(f) {
	return f;
};
tannus_sys_internal__$FileContent_FileContent_$Impl_$.get_f = function(this1) {
	return this1.get();
};
tannus_sys_internal__$FileContent_FileContent_$Impl_$.append = function(this1,data) {
	this1.get().append(data);
};
tannus_sys_internal__$FileContent_FileContent_$Impl_$.toByteArray = function(this1) {
	return this1.get().read();
};
tannus_sys_internal__$FileContent_FileContent_$Impl_$.toString = function(this1) {
	{
		var this2 = this1.get().read();
		return this2.map(function(b) {
			return String.fromCharCode(b);
		}).join("");
	}
};
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
function $arrayPushClosure(a) { return function(x) { a.push(x); }; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
$hxClasses.Math = Math;
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
$hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
if(Array.prototype.map == null) Array.prototype.map = function(f) {
	var a = [];
	var _g1 = 0;
	var _g = this.length;
	while(_g1 < _g) {
		var i = _g1++;
		a[i] = f(this[i]);
	}
	return a;
};
if(Array.prototype.filter == null) Array.prototype.filter = function(f1) {
	var a1 = [];
	var _g11 = 0;
	var _g2 = this.length;
	while(_g11 < _g2) {
		var i1 = _g11++;
		var e = this[i1];
		if(f1(e)) a1.push(e);
	}
	return a1;
};
var __map_reserved = {}
var q = window.jQuery;
var js = js || {}
js.JQuery = q;
var ArrayBuffer = typeof(window) != "undefined" && window.ArrayBuffer || typeof(global) != "undefined" && global.ArrayBuffer || js_html_compat_ArrayBuffer;
if(ArrayBuffer.prototype.slice == null) ArrayBuffer.prototype.slice = js_html_compat_ArrayBuffer.sliceImpl;
var DataView = typeof(window) != "undefined" && window.DataView || typeof(global) != "undefined" && global.DataView || js_html_compat_DataView;
var Uint8Array = typeof(window) != "undefined" && window.Uint8Array || typeof(global) != "undefined" && global.Uint8Array || js_html_compat_Uint8Array._new;
gryffin_Tools.used_idents = [];
gryffin_core_StageFiller.addedStyleSheet = false;
gryffin_display_Image.registry = new haxe_ds_StringMap();
haxe_Serializer.USE_CACHE = false;
haxe_Serializer.USE_ENUM_INDEX = false;
haxe_Serializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe_Unserializer.DEFAULT_RESOLVER = Type;
haxe_Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe_crypto_Base64.CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
haxe_crypto_Base64.BYTES = haxe_io_Bytes.ofString(haxe_crypto_Base64.CHARS);
haxe_ds_ObjectMap.count = 0;
haxe_io_FPHelper.i64tmp = (function($this) {
	var $r;
	var x = new haxe__$Int64__$_$_$Int64(0,0);
	$r = x;
	return $r;
}(this));
js_Boot.__toStr = {}.toString;
js_html_compat_Uint8Array.BYTES_PER_ELEMENT = 1;
tannus_css_vals__$Unit_Unit_$Impl_$.Em = "em";
tannus_css_vals__$Unit_Unit_$Impl_$.Ex = "ex";
tannus_css_vals__$Unit_Unit_$Impl_$.Ch = "ch";
tannus_css_vals__$Unit_Unit_$Impl_$.Rem = "rem";
tannus_css_vals__$Unit_Unit_$Impl_$.Vpw = "vw";
tannus_css_vals__$Unit_Unit_$Impl_$.Vph = "vh";
tannus_css_vals__$Unit_Unit_$Impl_$.Perc = "%";
tannus_css_vals__$Unit_Unit_$Impl_$.Cm = "cm";
tannus_css_vals__$Unit_Unit_$Impl_$.Mm = "mm";
tannus_css_vals__$Unit_Unit_$Impl_$.In = "in";
tannus_css_vals__$Unit_Unit_$Impl_$.Px = "px";
tannus_css_vals__$Unit_Unit_$Impl_$.Pt = "pt";
tannus_css_vals__$Unit_Unit_$Impl_$.Pc = "pc";
tannus_ds_Memory.state = 0;
tannus_ds_Memory.used = [];
tannus_events__$Key_Key_$Impl_$.CapsLock = 20;
tannus_events__$Key_Key_$Impl_$.NumpadDot = 110;
tannus_events__$Key_Key_$Impl_$.NumpadForwardSlash = 111;
tannus_events__$Key_Key_$Impl_$.Command = 91;
tannus_events__$Key_Key_$Impl_$.ForwardSlash = 191;
tannus_events__$Key_Key_$Impl_$.Enter = 13;
tannus_events__$Key_Key_$Impl_$.Shift = 16;
tannus_events__$Key_Key_$Impl_$.Space = 32;
tannus_events__$Key_Key_$Impl_$.PageUp = 33;
tannus_events__$Key_Key_$Impl_$.Backspace = 8;
tannus_events__$Key_Key_$Impl_$.Tab = 9;
tannus_events__$Key_Key_$Impl_$.NumpadPlus = 107;
tannus_events__$Key_Key_$Impl_$.Dot = 190;
tannus_events__$Key_Key_$Impl_$.OpenBracket = 219;
tannus_events__$Key_Key_$Impl_$.Home = 36;
tannus_events__$Key_Key_$Impl_$.Left = 37;
tannus_events__$Key_Key_$Impl_$.Equals = 187;
tannus_events__$Key_Key_$Impl_$.Apostrophe = 222;
tannus_events__$Key_Key_$Impl_$.Right = 39;
tannus_events__$Key_Key_$Impl_$.CloseBracket = 221;
tannus_events__$Key_Key_$Impl_$.NumLock = 144;
tannus_events__$Key_Key_$Impl_$.BackSlash = 220;
tannus_events__$Key_Key_$Impl_$.PageDown = 34;
tannus_events__$Key_Key_$Impl_$.End = 35;
tannus_events__$Key_Key_$Impl_$.Minus = 189;
tannus_events__$Key_Key_$Impl_$.SemiColon = 186;
tannus_events__$Key_Key_$Impl_$.Down = 40;
tannus_events__$Key_Key_$Impl_$.Esc = 27;
tannus_events__$Key_Key_$Impl_$.Comma = 188;
tannus_events__$Key_Key_$Impl_$.Delete = 46;
tannus_events__$Key_Key_$Impl_$.NumpadAsterisk = 106;
tannus_events__$Key_Key_$Impl_$.BackTick = 192;
tannus_events__$Key_Key_$Impl_$.Ctrl = 17;
tannus_events__$Key_Key_$Impl_$.Insert = 45;
tannus_events__$Key_Key_$Impl_$.ScrollLock = 145;
tannus_events__$Key_Key_$Impl_$.NumpadMinus = 109;
tannus_events__$Key_Key_$Impl_$.Up = 38;
tannus_events__$Key_Key_$Impl_$.Alt = 18;
tannus_events__$Key_Key_$Impl_$.LetterA = 65;
tannus_events__$Key_Key_$Impl_$.LetterB = 66;
tannus_events__$Key_Key_$Impl_$.LetterC = 67;
tannus_events__$Key_Key_$Impl_$.LetterD = 68;
tannus_events__$Key_Key_$Impl_$.LetterE = 69;
tannus_events__$Key_Key_$Impl_$.LetterF = 70;
tannus_events__$Key_Key_$Impl_$.LetterG = 71;
tannus_events__$Key_Key_$Impl_$.LetterH = 72;
tannus_events__$Key_Key_$Impl_$.LetterI = 73;
tannus_events__$Key_Key_$Impl_$.LetterJ = 74;
tannus_events__$Key_Key_$Impl_$.LetterK = 75;
tannus_events__$Key_Key_$Impl_$.LetterL = 76;
tannus_events__$Key_Key_$Impl_$.LetterM = 77;
tannus_events__$Key_Key_$Impl_$.LetterN = 78;
tannus_events__$Key_Key_$Impl_$.LetterO = 79;
tannus_events__$Key_Key_$Impl_$.LetterP = 80;
tannus_events__$Key_Key_$Impl_$.LetterQ = 81;
tannus_events__$Key_Key_$Impl_$.LetterR = 82;
tannus_events__$Key_Key_$Impl_$.LetterS = 83;
tannus_events__$Key_Key_$Impl_$.LetterT = 84;
tannus_events__$Key_Key_$Impl_$.LetterU = 85;
tannus_events__$Key_Key_$Impl_$.LetterV = 86;
tannus_events__$Key_Key_$Impl_$.LetterW = 87;
tannus_events__$Key_Key_$Impl_$.LetterX = 88;
tannus_events__$Key_Key_$Impl_$.LetterY = 89;
tannus_events__$Key_Key_$Impl_$.LetterZ = 90;
tannus_events__$Key_Key_$Impl_$.raw = { };
tannus_geom_Matrix.__identity = new tannus_geom_Matrix();
tannus_math_TMath.E = 2.718281828459045;
tannus_math_TMath.LN2 = 0.6931471805599453;
tannus_math_TMath.LN10 = 2.302585092994046;
tannus_math_TMath.LOG2E = 1.4426950408889634;
tannus_math_TMath.LOG10E = 0.43429448190325176;
tannus_math_TMath.PI = 3.141592653589793;
tannus_math_TMath.SQRT1_2 = 0.7071067811865476;
tannus_math_TMath.SQRT2 = 1.4142135623730951;
tannus_math_TMath.KAPPA = 4 * (Math.sqrt(2) - 1) / 3;
tannus_math_TMath.INT_MIN = -2147483648;
tannus_math_TMath.INT_MAX = 2147483647;
tannus_math_TMath.FLOAT_MIN = -1.79769313486231e+308;
tannus_math_TMath.FLOAT_MAX = 1.79769313486231e+308;
tannus_nore_Compiler.initHelpers = new tannus_io_Signal();
tannus_nore_Lexer.COMPLETION_ERROR = "::-EOI-::";
tannus_nore_ORegEx.ast_results = new haxe_ds_StringMap();
tannus_nore_Parser.COMPLETION_ERROR = "@>EOI<@";
tannus_sys_Mimes.initted = false;
tannus_sys_Mimes.primitive = { '3dml' : "text/vnd.in3d.3dml", '3ds' : "image/x-3ds", '3g2' : "video/3gpp2", '3gp' : "video/3gpp", '7z' : "application/x-7z-compressed", 'aab' : "application/x-authorware-bin", 'aac' : "audio/x-aac", 'aam' : "application/x-authorware-map", 'aas' : "application/x-authorware-seg", 'abw' : "application/x-abiword", 'ac' : "application/pkix-attr-cert", 'acc' : "application/vnd.americandynamics.acc", 'ace' : "application/x-ace-compressed", 'acu' : "application/vnd.acucobol", 'acutc' : "application/vnd.acucorp", 'adp' : "audio/adpcm", 'aep' : "application/vnd.audiograph", 'afm' : "application/x-font-type1", 'afp' : "application/vnd.ibm.modcap", 'ahead' : "application/vnd.ahead.space", 'ai' : "application/postscript", 'aif' : "audio/x-aiff", 'aifc' : "audio/x-aiff", 'aiff' : "audio/x-aiff", 'air' : "application/vnd.adobe.air-application-installer-package+zip", 'ait' : "application/vnd.dvb.ait", 'ami' : "application/vnd.amiga.ami", 'apk' : "application/vnd.android.package-archive", 'appcache' : "text/cache-manifest", 'application' : "application/x-ms-application", 'apr' : "application/vnd.lotus-approach", 'arc' : "application/x-freearc", 'asa' : "text/plain", 'asax' : "application/octet-stream", 'asc' : "application/pgp-signature", 'ascx' : "text/plain", 'asf' : "video/x-ms-asf", 'ashx' : "text/plain", 'asm' : "text/x-asm", 'asmx' : "text/plain", 'aso' : "application/vnd.accpac.simply.aso", 'asp' : "text/plain", 'aspx' : "text/plain", 'asx' : "video/x-ms-asf", 'atc' : "application/vnd.acucorp", 'atom' : "application/atom+xml", 'atomcat' : "application/atomcat+xml", 'atomsvc' : "application/atomsvc+xml", 'atx' : "application/vnd.antix.game-component", 'au' : "audio/basic", 'avi' : "video/x-msvideo", 'aw' : "application/applixware", 'axd' : "text/plain", 'azf' : "application/vnd.airzip.filesecure.azf", 'azs' : "application/vnd.airzip.filesecure.azs", 'azw' : "application/vnd.amazon.ebook", 'bat' : "application/x-msdownload", 'bcpio' : "application/x-bcpio", 'bdf' : "application/x-font-bdf", 'bdm' : "application/vnd.syncml.dm+wbxml", 'bed' : "application/vnd.realvnc.bed", 'bh2' : "application/vnd.fujitsu.oasysprs", 'bin' : "application/octet-stream", 'blb' : "application/x-blorb", 'blorb' : "application/x-blorb", 'bmi' : "application/vnd.bmi", 'bmp' : "image/bmp", 'book' : "application/vnd.framemaker", 'box' : "application/vnd.previewsystems.box", 'boz' : "application/x-bzip2", 'bpk' : "application/octet-stream", 'btif' : "image/prs.btif", 'bz' : "application/x-bzip", 'bz2' : "application/x-bzip2", 'c' : "text/x-c", 'c11amc' : "application/vnd.cluetrust.cartomobile-config", 'c11amz' : "application/vnd.cluetrust.cartomobile-config-pkg", 'c4d' : "application/vnd.clonk.c4group", 'c4f' : "application/vnd.clonk.c4group", 'c4g' : "application/vnd.clonk.c4group", 'c4p' : "application/vnd.clonk.c4group", 'c4u' : "application/vnd.clonk.c4group", 'cab' : "application/vnd.ms-cab-compressed", 'caf' : "audio/x-caf", 'cap' : "application/vnd.tcpdump.pcap", 'car' : "application/vnd.curl.car", 'cat' : "application/vnd.ms-pki.seccat", 'cb7' : "application/x-cbr", 'cba' : "application/x-cbr", 'cbr' : "application/x-cbr", 'cbt' : "application/x-cbr", 'cbz' : "application/x-cbr", 'cc' : "text/x-c", 'cct' : "application/x-director", 'ccxml' : "application/ccxml+xml", 'cdbcmsg' : "application/vnd.contact.cmsg", 'cdf' : "application/x-netcdf", 'cdkey' : "application/vnd.mediastation.cdkey", 'cdmia' : "application/cdmi-capability", 'cdmic' : "application/cdmi-container", 'cdmid' : "application/cdmi-domain", 'cdmio' : "application/cdmi-object", 'cdmiq' : "application/cdmi-queue", 'cdx' : "chemical/x-cdx", 'cdxml' : "application/vnd.chemdraw+xml", 'cdy' : "application/vnd.cinderella", 'cer' : "application/pkix-cert", 'cfc' : "application/x-coldfusion", 'cfm' : "application/x-coldfusion", 'cfs' : "application/x-cfs-compressed", 'cgm' : "image/cgm", 'chat' : "application/x-chat", 'chm' : "application/vnd.ms-htmlhelp", 'chrt' : "application/vnd.kde.kchart", 'cif' : "chemical/x-cif", 'cii' : "application/vnd.anser-web-certificate-issue-initiation", 'cil' : "application/vnd.ms-artgalry", 'cla' : "application/vnd.claymore", 'class' : "application/java-vm", 'clkk' : "application/vnd.crick.clicker.keyboard", 'clkp' : "application/vnd.crick.clicker.palette", 'clkt' : "application/vnd.crick.clicker.template", 'clkw' : "application/vnd.crick.clicker.wordbank", 'clkx' : "application/vnd.crick.clicker", 'clp' : "application/x-msclip", 'cmc' : "application/vnd.cosmocaller", 'cmdf' : "chemical/x-cmdf", 'cml' : "chemical/x-cml", 'cmp' : "application/vnd.yellowriver-custom-menu", 'cmx' : "image/x-cmx", 'cod' : "application/vnd.rim.cod", 'coffee' : "text/coffeescript", 'com' : "application/x-msdownload", 'conf' : "text/plain", 'cpio' : "application/x-cpio", 'cpp' : "text/x-c", 'cpt' : "application/mac-compactpro", 'crd' : "application/x-mscardfile", 'crl' : "application/pkix-crl", 'crt' : "application/x-x509-ca-cert", 'crx' : "application/octet-stream", 'cryptonote' : "application/vnd.rig.cryptonote", 'cs' : "text/plain", 'csh' : "application/x-csh", 'csml' : "chemical/x-csml", 'csp' : "application/vnd.commonspace", 'css' : "text/css", 'cst' : "application/x-director", 'csv' : "text/csv", 'cu' : "application/cu-seeme", 'curl' : "text/vnd.curl", 'cww' : "application/prs.cww", 'cxt' : "application/x-director", 'cxx' : "text/x-c", 'dae' : "model/vnd.collada+xml", 'daf' : "application/vnd.mobius.daf", 'dart' : "application/vnd.dart", 'dataless' : "application/vnd.fdsn.seed", 'davmount' : "application/davmount+xml", 'dbk' : "application/docbook+xml", 'dcr' : "application/x-director", 'dcurl' : "text/vnd.curl.dcurl", 'dd2' : "application/vnd.oma.dd2+xml", 'ddd' : "application/vnd.fujixerox.ddd", 'deb' : "application/x-debian-package", 'def' : "text/plain", 'deploy' : "application/octet-stream", 'der' : "application/x-x509-ca-cert", 'dfac' : "application/vnd.dreamfactory", 'dgc' : "application/x-dgc-compressed", 'dic' : "text/x-c", 'dir' : "application/x-director", 'dis' : "application/vnd.mobius.dis", 'dist' : "application/octet-stream", 'distz' : "application/octet-stream", 'djv' : "image/vnd.djvu", 'djvu' : "image/vnd.djvu", 'dll' : "application/x-msdownload", 'dmg' : "application/x-apple-diskimage", 'dmp' : "application/vnd.tcpdump.pcap", 'dms' : "application/octet-stream", 'dna' : "application/vnd.dna", 'doc' : "application/msword", 'docm' : "application/vnd.ms-word.document.macroenabled.12", 'docx' : "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 'dot' : "application/msword", 'dotm' : "application/vnd.ms-word.template.macroenabled.12", 'dotx' : "application/vnd.openxmlformats-officedocument.wordprocessingml.template", 'dp' : "application/vnd.osgi.dp", 'dpg' : "application/vnd.dpgraph", 'dra' : "audio/vnd.dra", 'dsc' : "text/prs.lines.tag", 'dssc' : "application/dssc+der", 'dtb' : "application/x-dtbook+xml", 'dtd' : "application/xml-dtd", 'dts' : "audio/vnd.dts", 'dtshd' : "audio/vnd.dts.hd", 'dump' : "application/octet-stream", 'dvb' : "video/vnd.dvb.file", 'dvi' : "application/x-dvi", 'dwf' : "model/vnd.dwf", 'dwg' : "image/vnd.dwg", 'dxf' : "image/vnd.dxf", 'dxp' : "application/vnd.spotfire.dxp", 'dxr' : "application/x-director", 'ecelp4800' : "audio/vnd.nuera.ecelp4800", 'ecelp7470' : "audio/vnd.nuera.ecelp7470", 'ecelp9600' : "audio/vnd.nuera.ecelp9600", 'ecma' : "application/ecmascript", 'edm' : "application/vnd.novadigm.edm", 'edx' : "application/vnd.novadigm.edx", 'efif' : "application/vnd.picsel", 'ei6' : "application/vnd.pg.osasli", 'elc' : "application/octet-stream", 'emf' : "application/x-msmetafile", 'eml' : "message/rfc822", 'emma' : "application/emma+xml", 'emz' : "application/x-msmetafile", 'eol' : "audio/vnd.digital-winds", 'eot' : "application/vnd.ms-fontobject", 'eps' : "application/postscript", 'epub' : "application/epub+zip", 'es3' : "application/vnd.eszigno3+xml", 'esa' : "application/vnd.osgi.subsystem", 'esf' : "application/vnd.epson.esf", 'et3' : "application/vnd.eszigno3+xml", 'etx' : "text/x-setext", 'eva' : "application/x-eva", 'evy' : "application/x-envoy", 'exe' : "application/x-msdownload", 'exi' : "application/exi", 'ext' : "application/vnd.novadigm.ext", 'ez' : "application/andrew-inset", 'ez2' : "application/vnd.ezpix-album", 'ez3' : "application/vnd.ezpix-package", 'f' : "text/x-fortran", 'f4v' : "video/x-f4v", 'f77' : "text/x-fortran", 'f90' : "text/x-fortran", 'fbs' : "image/vnd.fastbidsheet", 'fcdt' : "application/vnd.adobe.formscentral.fcdt", 'fcs' : "application/vnd.isac.fcs", 'fdf' : "application/vnd.fdf", 'fe_launch' : "application/vnd.denovo.fcselayout-link", 'fg5' : "application/vnd.fujitsu.oasysgp", 'fgd' : "application/x-director", 'fh' : "image/x-freehand", 'fh4' : "image/x-freehand", 'fh5' : "image/x-freehand", 'fh7' : "image/x-freehand", 'fhc' : "image/x-freehand", 'fig' : "application/x-xfig", 'flac' : "audio/x-flac", 'fli' : "video/x-fli", 'flo' : "application/vnd.micrografx.flo", 'flv' : "video/x-flv", 'flw' : "application/vnd.kde.kivio", 'flx' : "text/vnd.fmi.flexstor", 'fly' : "text/vnd.fly", 'fm' : "application/vnd.framemaker", 'fnc' : "application/vnd.frogans.fnc", 'for' : "text/x-fortran", 'fpx' : "image/vnd.fpx", 'frame' : "application/vnd.framemaker", 'fsc' : "application/vnd.fsc.weblaunch", 'fst' : "image/vnd.fst", 'ftc' : "application/vnd.fluxtime.clip", 'fti' : "application/vnd.anser-web-funds-transfer-initiation", 'fvt' : "video/vnd.fvt", 'fxp' : "application/vnd.adobe.fxp", 'fxpl' : "application/vnd.adobe.fxp", 'fzs' : "application/vnd.fuzzysheet", 'g2w' : "application/vnd.geoplan", 'g3' : "image/g3fax", 'g3w' : "application/vnd.geospace", 'gac' : "application/vnd.groove-account", 'gam' : "application/x-tads", 'gbr' : "application/rpki-ghostbusters", 'gca' : "application/x-gca-compressed", 'gdl' : "model/vnd.gdl", 'geo' : "application/vnd.dynageo", 'gex' : "application/vnd.geometry-explorer", 'ggb' : "application/vnd.geogebra.file", 'ggt' : "application/vnd.geogebra.tool", 'ghf' : "application/vnd.groove-help", 'gif' : "image/gif", 'gim' : "application/vnd.groove-identity-message", 'gml' : "application/gml+xml", 'gmx' : "application/vnd.gmx", 'gnumeric' : "application/x-gnumeric", 'gph' : "application/vnd.flographit", 'gpx' : "application/gpx+xml", 'gqf' : "application/vnd.grafeq", 'gqs' : "application/vnd.grafeq", 'gram' : "application/srgs", 'gramps' : "application/x-gramps-xml", 'gre' : "application/vnd.geometry-explorer", 'grv' : "application/vnd.groove-injector", 'grxml' : "application/srgs+xml", 'gsf' : "application/x-font-ghostscript", 'gtar' : "application/x-gtar", 'gtm' : "application/vnd.groove-tool-message", 'gtw' : "model/vnd.gtw", 'gv' : "text/vnd.graphviz", 'gxf' : "application/gxf", 'gxt' : "application/vnd.geonext", 'gz' : "application/x-gzip", 'h' : "text/x-c", 'h261' : "video/h261", 'h263' : "video/h263", 'h264' : "video/h264", 'hal' : "application/vnd.hal+xml", 'hbci' : "application/vnd.hbci", 'hdf' : "application/x-hdf", 'hh' : "text/x-c", 'hlp' : "application/winhlp", 'hpgl' : "application/vnd.hp-hpgl", 'hpid' : "application/vnd.hp-hpid", 'hps' : "application/vnd.hp-hps", 'hqx' : "application/mac-binhex40", 'hta' : "application/octet-stream", 'htc' : "text/html", 'htke' : "application/vnd.kenameaapp", 'htm' : "text/html", 'html' : "text/html", 'hvd' : "application/vnd.yamaha.hv-dic", 'hvp' : "application/vnd.yamaha.hv-voice", 'hvs' : "application/vnd.yamaha.hv-script", 'hx' : "text/haxe", 'hxml' : "text/haxe.hxml", 'i2g' : "application/vnd.intergeo", 'icc' : "application/vnd.iccprofile", 'ice' : "x-conference/x-cooltalk", 'icm' : "application/vnd.iccprofile", 'ico' : "image/x-icon", 'ics' : "text/calendar", 'ief' : "image/ief", 'ifb' : "text/calendar", 'ifm' : "application/vnd.shana.informed.formdata", 'iges' : "model/iges", 'igl' : "application/vnd.igloader", 'igm' : "application/vnd.insors.igm", 'igs' : "model/iges", 'igx' : "application/vnd.micrografx.igx", 'iif' : "application/vnd.shana.informed.interchange", 'imp' : "application/vnd.accpac.simply.imp", 'ims' : "application/vnd.ms-ims", 'in' : "text/plain", 'ini' : "text/plain", 'ink' : "application/inkml+xml", 'inkml' : "application/inkml+xml", 'install' : "application/x-install-instructions", 'iota' : "application/vnd.astraea-software.iota", 'ipa' : "application/octet-stream", 'ipfix' : "application/ipfix", 'ipk' : "application/vnd.shana.informed.package", 'irm' : "application/vnd.ibm.rights-management", 'irp' : "application/vnd.irepository.package+xml", 'iso' : "application/x-iso9660-image", 'itp' : "application/vnd.shana.informed.formtemplate", 'ivp' : "application/vnd.immervision-ivp", 'ivu' : "application/vnd.immervision-ivu", 'jad' : "text/vnd.sun.j2me.app-descriptor", 'jam' : "application/vnd.jam", 'jar' : "application/java-archive", 'java' : "text/x-java-source", 'jisp' : "application/vnd.jisp", 'jlt' : "application/vnd.hp-jlyt", 'jnlp' : "application/x-java-jnlp-file", 'joda' : "application/vnd.joost.joda-archive", 'jpe' : "image/jpeg", 'jpeg' : "image/jpeg", 'jpg' : "image/jpeg", 'jpgm' : "video/jpm", 'jpgv' : "video/jpeg", 'jpm' : "video/jpm", 'js' : "text/javascript", 'json' : "application/json", 'jsonml' : "application/jsonml+json", 'kar' : "audio/midi", 'karbon' : "application/vnd.kde.karbon", 'kfo' : "application/vnd.kde.kformula", 'kia' : "application/vnd.kidspiration", 'kml' : "application/vnd.google-earth.kml+xml", 'kmz' : "application/vnd.google-earth.kmz", 'kne' : "application/vnd.kinar", 'knp' : "application/vnd.kinar", 'kon' : "application/vnd.kde.kontour", 'kpr' : "application/vnd.kde.kpresenter", 'kpt' : "application/vnd.kde.kpresenter", 'kpxx' : "application/vnd.ds-keypoint", 'ksp' : "application/vnd.kde.kspread", 'ktr' : "application/vnd.kahootz", 'ktx' : "image/ktx", 'ktz' : "application/vnd.kahootz", 'kwd' : "application/vnd.kde.kword", 'kwt' : "application/vnd.kde.kword", 'lasxml' : "application/vnd.las.las+xml", 'latex' : "application/x-latex", 'lbd' : "application/vnd.llamagraphics.life-balance.desktop", 'lbe' : "application/vnd.llamagraphics.life-balance.exchange+xml", 'les' : "application/vnd.hhe.lesson-player", 'less' : "text/less", 'lha' : "application/x-lzh-compressed", 'link66' : "application/vnd.route66.link66+xml", 'list' : "text/plain", 'list3820' : "application/vnd.ibm.modcap", 'listafp' : "application/vnd.ibm.modcap", 'lnk' : "application/x-ms-shortcut", 'log' : "text/plain", 'lostxml' : "application/lost+xml", 'lrf' : "application/octet-stream", 'lrm' : "application/vnd.ms-lrm", 'ltf' : "application/vnd.frogans.ltf", 'lvp' : "audio/vnd.lucent.voice", 'lwp' : "application/vnd.lotus-wordpro", 'lz' : "application/x-lzip", 'lzh' : "application/x-lzh-compressed", 'lzma' : "application/x-lzma", 'lzo' : "application/x-lzop", 'm13' : "application/x-msmediaview", 'm14' : "application/x-msmediaview", 'm1v' : "video/mpeg", 'm21' : "application/mp21", 'm2a' : "audio/mpeg", 'm2v' : "video/mpeg", 'm3a' : "audio/mpeg", 'm3u' : "audio/x-mpegurl", 'm3u8' : "application/vnd.apple.mpegurl", 'm4a' : "audio/mp4", 'm4u' : "video/vnd.mpegurl", 'm4v' : "video/mp4", 'ma' : "application/mathematica", 'mads' : "application/mads+xml", 'mag' : "application/vnd.ecowin.chart", 'maker' : "application/vnd.framemaker", 'man' : "text/troff", 'mar' : "application/octet-stream", 'mathml' : "application/mathml+xml", 'mb' : "application/mathematica", 'mbk' : "application/vnd.mobius.mbk", 'mbox' : "application/mbox", 'mc1' : "application/vnd.medcalcdata", 'mcd' : "application/vnd.mcd", 'mcurl' : "text/vnd.curl.mcurl", 'mdb' : "application/x-msaccess", 'mdi' : "image/vnd.ms-modi", 'md' : "text/markdown", 'me' : "text/troff", 'mesh' : "model/mesh", 'meta4' : "application/metalink4+xml", 'metalink' : "application/metalink+xml", 'mets' : "application/mets+xml", 'mfm' : "application/vnd.mfmp", 'mft' : "application/rpki-manifest", 'mgp' : "application/vnd.osgeo.mapguide.package", 'mgz' : "application/vnd.proteus.magazine", 'mid' : "audio/midi", 'midi' : "audio/midi", 'mie' : "application/x-mie", 'mif' : "application/vnd.mif", 'mime' : "message/rfc822", 'mj2' : "video/mj2", 'mjp2' : "video/mj2", 'mk3d' : "video/x-matroska", 'mka' : "audio/x-matroska", 'mks' : "video/x-matroska", 'mkv' : "video/x-matroska", 'mlp' : "application/vnd.dolby.mlp", 'mmd' : "application/vnd.chipnuts.karaoke-mmd", 'mmf' : "application/vnd.smaf", 'mmr' : "image/vnd.fujixerox.edmics-mmr", 'mng' : "video/x-mng", 'mny' : "application/x-msmoney", 'mobi' : "application/x-mobipocket-ebook", 'mods' : "application/mods+xml", 'mov' : "video/quicktime", 'movie' : "video/x-sgi-movie", 'mp2' : "audio/mpeg", 'mp21' : "application/mp21", 'mp2a' : "audio/mpeg", 'mp3' : "audio/mpeg", 'mp4' : "video/mp4", 'mp4a' : "audio/mp4", 'mp4s' : "application/mp4", 'mp4v' : "video/mp4", 'mpc' : "application/vnd.mophun.certificate", 'mpe' : "video/mpeg", 'mpeg' : "video/mpeg", 'mpg' : "video/mpeg", 'mpg4' : "video/mp4", 'mpga' : "audio/mpeg", 'mpkg' : "application/vnd.apple.installer+xml", 'mpm' : "application/vnd.blueice.multipass", 'mpn' : "application/vnd.mophun.application", 'mpp' : "application/vnd.ms-project", 'mpt' : "application/vnd.ms-project", 'mpy' : "application/vnd.ibm.minipay", 'mqy' : "application/vnd.mobius.mqy", 'mrc' : "application/marc", 'mrcx' : "application/marcxml+xml", 'ms' : "text/troff", 'mscml' : "application/mediaservercontrol+xml", 'mseed' : "application/vnd.fdsn.mseed", 'mseq' : "application/vnd.mseq", 'msf' : "application/vnd.epson.msf", 'msh' : "model/mesh", 'msi' : "application/x-msdownload", 'msl' : "application/vnd.mobius.msl", 'msty' : "application/vnd.muvee.style", 'mts' : "model/vnd.mts", 'mus' : "application/vnd.musician", 'musicxml' : "application/vnd.recordare.musicxml+xml", 'mvb' : "application/x-msmediaview", 'mwf' : "application/vnd.mfer", 'mxf' : "application/mxf", 'mxl' : "application/vnd.recordare.musicxml", 'mxml' : "application/xv+xml", 'mxs' : "application/vnd.triscape.mxs", 'mxu' : "video/vnd.mpegurl", 'n-gage' : "application/vnd.nokia.n-gage.symbian.install", 'n3' : "text/n3", 'nb' : "application/mathematica", 'nbp' : "application/vnd.wolfram.player", 'nc' : "application/x-netcdf", 'ncx' : "application/x-dtbncx+xml", 'nfo' : "text/x-nfo", 'ngdat' : "application/vnd.nokia.n-gage.data", 'nitf' : "application/vnd.nitf", 'nlu' : "application/vnd.neurolanguage.nlu", 'nml' : "application/vnd.enliven", 'nnd' : "application/vnd.noblenet-directory", 'nns' : "application/vnd.noblenet-sealer", 'nnw' : "application/vnd.noblenet-web", 'npx' : "image/vnd.net-fpx", 'nsc' : "application/x-conference", 'nsf' : "application/vnd.lotus-notes", 'ntf' : "application/vnd.nitf", 'nzb' : "application/x-nzb", 'oa2' : "application/vnd.fujitsu.oasys2", 'oa3' : "application/vnd.fujitsu.oasys3", 'oas' : "application/vnd.fujitsu.oasys", 'obd' : "application/x-msbinder", 'obj' : "application/x-tgif", 'oda' : "application/oda", 'odb' : "application/vnd.oasis.opendocument.database", 'odc' : "application/vnd.oasis.opendocument.chart", 'odf' : "application/vnd.oasis.opendocument.formula", 'odft' : "application/vnd.oasis.opendocument.formula-template", 'odg' : "application/vnd.oasis.opendocument.graphics", 'odi' : "application/vnd.oasis.opendocument.image", 'odm' : "application/vnd.oasis.opendocument.text-master", 'odp' : "application/vnd.oasis.opendocument.presentation", 'ods' : "application/vnd.oasis.opendocument.spreadsheet", 'odt' : "application/vnd.oasis.opendocument.text", 'oga' : "audio/ogg", 'ogg' : "audio/ogg", 'ogv' : "video/ogg", 'ogx' : "application/ogg", 'omdoc' : "application/omdoc+xml", 'onepkg' : "application/onenote", 'onetmp' : "application/onenote", 'onetoc' : "application/onenote", 'onetoc2' : "application/onenote", 'opf' : "application/oebps-package+xml", 'opml' : "text/x-opml", 'oprc' : "application/vnd.palm", 'org' : "application/vnd.lotus-organizer", 'osf' : "application/vnd.yamaha.openscoreformat", 'osfpvg' : "application/vnd.yamaha.openscoreformat.osfpvg+xml", 'otc' : "application/vnd.oasis.opendocument.chart-template", 'otf' : "application/x-font-otf", 'otg' : "application/vnd.oasis.opendocument.graphics-template", 'oth' : "application/vnd.oasis.opendocument.text-web", 'oti' : "application/vnd.oasis.opendocument.image-template", 'otp' : "application/vnd.oasis.opendocument.presentation-template", 'ots' : "application/vnd.oasis.opendocument.spreadsheet-template", 'ott' : "application/vnd.oasis.opendocument.text-template", 'oxps' : "application/oxps", 'oxt' : "application/vnd.openofficeorg.extension", 'p' : "text/x-pascal", 'py' : "application/python", 'p10' : "application/pkcs10", 'p12' : "application/x-pkcs12", 'p7b' : "application/x-pkcs7-certificates", 'p7c' : "application/pkcs7-mime", 'p7m' : "application/pkcs7-mime", 'p7r' : "application/x-pkcs7-certreqresp", 'p7s' : "application/pkcs7-signature", 'p8' : "application/pkcs8", 'pas' : "text/x-pascal", 'paw' : "application/vnd.pawaafile", 'pbd' : "application/vnd.powerbuilder6", 'pbm' : "image/x-portable-bitmap", 'pcap' : "application/vnd.tcpdump.pcap", 'pcf' : "application/x-font-pcf", 'pcl' : "application/vnd.hp-pcl", 'pclxl' : "application/vnd.hp-pclxl", 'pct' : "image/x-pict", 'pcurl' : "application/vnd.curl.pcurl", 'pcx' : "image/x-pcx", 'pdb' : "application/vnd.palm", 'pdf' : "application/pdf", 'pfa' : "application/x-font-type1", 'pfb' : "application/x-font-type1", 'pfm' : "application/x-font-type1", 'pfr' : "application/font-tdpfr", 'pfx' : "application/x-pkcs12", 'pgm' : "image/x-portable-graymap", 'pgn' : "application/x-chess-pgn", 'pgp' : "application/pgp-encrypted", 'phar' : "application/octet-stream", 'php' : "text/plain", 'phps' : "application/x-httpd-phps", 'pic' : "image/x-pict", 'pkg' : "application/octet-stream", 'pki' : "application/pkixcmp", 'pkipath' : "application/pkix-pkipath", 'plb' : "application/vnd.3gpp.pic-bw-large", 'plc' : "application/vnd.mobius.plc", 'plf' : "application/vnd.pocketlearn", 'plist' : "application/x-plist", 'pls' : "application/pls+xml", 'pml' : "application/vnd.ctc-posml", 'png' : "image/png", 'pnm' : "image/x-portable-anymap", 'portpkg' : "application/vnd.macports.portpkg", 'pot' : "application/vnd.ms-powerpoint", 'potm' : "application/vnd.ms-powerpoint.template.macroenabled.12", 'potx' : "application/vnd.openxmlformats-officedocument.presentationml.template", 'ppam' : "application/vnd.ms-powerpoint.addin.macroenabled.12", 'ppd' : "application/vnd.cups-ppd", 'ppm' : "image/x-portable-pixmap", 'pps' : "application/vnd.ms-powerpoint", 'ppsm' : "application/vnd.ms-powerpoint.slideshow.macroenabled.12", 'ppsx' : "application/vnd.openxmlformats-officedocument.presentationml.slideshow", 'ppt' : "application/vnd.ms-powerpoint", 'pptm' : "application/vnd.ms-powerpoint.presentation.macroenabled.12", 'pptx' : "application/vnd.openxmlformats-officedocument.presentationml.presentation", 'pqa' : "application/vnd.palm", 'prc' : "application/x-mobipocket-ebook", 'pre' : "application/vnd.lotus-freelance", 'prf' : "application/pics-rules", 'ps' : "application/postscript", 'psb' : "application/vnd.3gpp.pic-bw-small", 'psd' : "image/vnd.adobe.photoshop", 'psf' : "application/x-font-linux-psf", 'pskcxml' : "application/pskc+xml", 'ptid' : "application/vnd.pvi.ptid1", 'pub' : "application/x-mspublisher", 'pvb' : "application/vnd.3gpp.pic-bw-var", 'pwn' : "application/vnd.3m.post-it-notes", 'pya' : "audio/vnd.ms-playready.media.pya", 'pyv' : "video/vnd.ms-playready.media.pyv", 'qam' : "application/vnd.epson.quickanime", 'qbo' : "application/vnd.intu.qbo", 'qfx' : "application/vnd.intu.qfx", 'qps' : "application/vnd.publishare-delta-tree", 'qt' : "video/quicktime", 'qwd' : "application/vnd.quark.quarkxpress", 'qwt' : "application/vnd.quark.quarkxpress", 'qxb' : "application/vnd.quark.quarkxpress", 'qxd' : "application/vnd.quark.quarkxpress", 'qxl' : "application/vnd.quark.quarkxpress", 'qxt' : "application/vnd.quark.quarkxpress", 'ra' : "audio/x-pn-realaudio", 'ram' : "audio/x-pn-realaudio", 'rar' : "application/x-rar-compressed", 'ras' : "image/x-cmu-raster", 'rb' : "text/plain", 'rcprofile' : "application/vnd.ipunplugged.rcprofile", 'rdf' : "application/rdf+xml", 'rdz' : "application/vnd.data-vision.rdz", 'rep' : "application/vnd.businessobjects", 'res' : "application/x-dtbresource+xml", 'resx' : "text/xml", 'rgb' : "image/x-rgb", 'rif' : "application/reginfo+xml", 'rip' : "audio/vnd.rip", 'ris' : "application/x-research-info-systems", 'rl' : "application/resource-lists+xml", 'rlc' : "image/vnd.fujixerox.edmics-rlc", 'rld' : "application/resource-lists-diff+xml", 'rm' : "application/vnd.rn-realmedia", 'rmi' : "audio/midi", 'rmp' : "audio/x-pn-realaudio-plugin", 'rms' : "application/vnd.jcp.javame.midlet-rms", 'rmvb' : "application/vnd.rn-realmedia-vbr", 'rnc' : "application/relax-ng-compact-syntax", 'roa' : "application/rpki-roa", 'roff' : "text/troff", 'rp9' : "application/vnd.cloanto.rp9", 'rpm' : "application/x-rpm", 'rpss' : "application/vnd.nokia.radio-presets", 'rpst' : "application/vnd.nokia.radio-preset", 'rq' : "application/sparql-query", 'rs' : "application/rls-services+xml", 'rsd' : "application/rsd+xml", 'rss' : "application/rss+xml", 'rtf' : "application/rtf", 'rtx' : "text/richtext", 's' : "text/x-asm", 's3m' : "audio/s3m", 's7z' : "application/x-7z-compressed", 'saf' : "application/vnd.yamaha.smaf-audio", 'safariextz' : "application/octet-stream", 'sass' : "text/x-sass", 'sbml' : "application/sbml+xml", 'sc' : "application/vnd.ibm.secure-container", 'scd' : "application/x-msschedule", 'scm' : "application/vnd.lotus-screencam", 'scq' : "application/scvp-cv-request", 'scs' : "application/scvp-cv-response", 'scss' : "text/x-scss", 'scurl' : "text/vnd.curl.scurl", 'sda' : "application/vnd.stardivision.draw", 'sdc' : "application/vnd.stardivision.calc", 'sdd' : "application/vnd.stardivision.impress", 'sdkd' : "application/vnd.solent.sdkm+xml", 'sdkm' : "application/vnd.solent.sdkm+xml", 'sdp' : "application/sdp", 'sdw' : "application/vnd.stardivision.writer", 'see' : "application/vnd.seemail", 'seed' : "application/vnd.fdsn.seed", 'sema' : "application/vnd.sema", 'semd' : "application/vnd.semd", 'semf' : "application/vnd.semf", 'ser' : "application/java-serialized-object", 'setpay' : "application/set-payment-initiation", 'setreg' : "application/set-registration-initiation", 'sfd-hdstx' : "application/vnd.hydrostatix.sof-data", 'sfs' : "application/vnd.spotfire.sfs", 'sfv' : "text/x-sfv", 'sgi' : "image/sgi", 'sgl' : "application/vnd.stardivision.writer-global", 'sgm' : "text/sgml", 'sgml' : "text/sgml", 'sh' : "application/x-sh", 'shar' : "application/x-shar", 'shf' : "application/shf+xml", 'sid' : "image/x-mrsid-image", 'sig' : "application/pgp-signature", 'sil' : "audio/silk", 'silo' : "model/mesh", 'sis' : "application/vnd.symbian.install", 'sisx' : "application/vnd.symbian.install", 'sit' : "application/x-stuffit", 'sitx' : "application/x-stuffitx", 'skd' : "application/vnd.koan", 'skm' : "application/vnd.koan", 'skp' : "application/vnd.koan", 'skt' : "application/vnd.koan", 'sldm' : "application/vnd.ms-powerpoint.slide.macroenabled.12", 'sldx' : "application/vnd.openxmlformats-officedocument.presentationml.slide", 'slt' : "application/vnd.epson.salt", 'sm' : "application/vnd.stepmania.stepchart", 'smf' : "application/vnd.stardivision.math", 'smi' : "application/smil+xml", 'smil' : "application/smil+xml", 'smv' : "video/x-smv", 'smzip' : "application/vnd.stepmania.package", 'snd' : "audio/basic", 'snf' : "application/x-font-snf", 'so' : "application/octet-stream", 'spc' : "application/x-pkcs7-certificates", 'spf' : "application/vnd.yamaha.smaf-phrase", 'spl' : "application/x-futuresplash", 'spot' : "text/vnd.in3d.spot", 'spp' : "application/scvp-vp-response", 'spq' : "application/scvp-vp-request", 'spx' : "audio/ogg", 'sql' : "application/x-sql", 'src' : "application/x-wais-source", 'srt' : "application/x-subrip", 'sru' : "application/sru+xml", 'srx' : "application/sparql-results+xml", 'ssdl' : "application/ssdl+xml", 'sse' : "application/vnd.kodak-descriptor", 'ssf' : "application/vnd.epson.ssf", 'ssml' : "application/ssml+xml", 'st' : "application/vnd.sailingtracker.track", 'stc' : "application/vnd.sun.xml.calc.template", 'std' : "application/vnd.sun.xml.draw.template", 'stf' : "application/vnd.wt.stf", 'sti' : "application/vnd.sun.xml.impress.template", 'stk' : "application/hyperstudio", 'stl' : "application/vnd.ms-pki.stl", 'str' : "application/vnd.pg.format", 'stw' : "application/vnd.sun.xml.writer.template", 'styl' : "text/x-styl", 'sub' : "image/vnd.dvb.subtitle", 'sus' : "application/vnd.sus-calendar", 'susp' : "application/vnd.sus-calendar", 'sv4cpio' : "application/x-sv4cpio", 'sv4crc' : "application/x-sv4crc", 'svc' : "application/vnd.dvb.service", 'svd' : "application/vnd.svd", 'svg' : "image/svg+xml", 'svgz' : "image/svg+xml", 'swa' : "application/x-director", 'swf' : "application/x-shockwave-flash", 'swi' : "application/vnd.aristanetworks.swi", 'sxc' : "application/vnd.sun.xml.calc", 'sxd' : "application/vnd.sun.xml.draw", 'sxg' : "application/vnd.sun.xml.writer.global", 'sxi' : "application/vnd.sun.xml.impress", 'sxm' : "application/vnd.sun.xml.math", 'sxw' : "application/vnd.sun.xml.writer", 't' : "text/troff", 't3' : "application/x-t3vm-image", 'taglet' : "application/vnd.mynfc", 'tao' : "application/vnd.tao.intent-module-archive", 'tar' : "application/x-tar", 'tcap' : "application/vnd.3gpp2.tcap", 'tcl' : "application/x-tcl", 'teacher' : "application/vnd.smart.teacher", 'tei' : "application/tei+xml", 'teicorpus' : "application/tei+xml", 'tex' : "application/x-tex", 'texi' : "application/x-texinfo", 'texinfo' : "application/x-texinfo", 'text' : "text/plain", 'tfi' : "application/thraud+xml", 'tfm' : "application/x-tex-tfm", 'tga' : "image/x-tga", 'tgz' : "application/x-gzip", 'thmx' : "application/vnd.ms-officetheme", 'tif' : "image/tiff", 'tiff' : "image/tiff", 'tmo' : "application/vnd.tmobile-livetv", 'torrent' : "application/x-bittorrent", 'tpl' : "application/vnd.groove-tool-template", 'tpt' : "application/vnd.trid.tpt", 'tr' : "text/troff", 'tra' : "application/vnd.trueapp", 'trm' : "application/x-msterminal", 'tsd' : "application/timestamped-data", 'tsv' : "text/tab-separated-values", 'ttc' : "application/x-font-ttf", 'ttf' : "application/x-font-ttf", 'ttl' : "text/turtle", 'twd' : "application/vnd.simtech-mindmapper", 'twds' : "application/vnd.simtech-mindmapper", 'txd' : "application/vnd.genomatix.tuxedo", 'txf' : "application/vnd.mobius.txf", 'txt' : "text/plain", 'u32' : "application/x-authorware-bin", 'udeb' : "application/x-debian-package", 'ufd' : "application/vnd.ufdl", 'ufdl' : "application/vnd.ufdl", 'ulx' : "application/x-glulx", 'umj' : "application/vnd.umajin", 'unityweb' : "application/vnd.unity", 'uoml' : "application/vnd.uoml+xml", 'uri' : "text/uri-list", 'uris' : "text/uri-list", 'urls' : "text/uri-list", 'ustar' : "application/x-ustar", 'utz' : "application/vnd.uiq.theme", 'uu' : "text/x-uuencode", 'uva' : "audio/vnd.dece.audio", 'uvd' : "application/vnd.dece.data", 'uvf' : "application/vnd.dece.data", 'uvg' : "image/vnd.dece.graphic", 'uvh' : "video/vnd.dece.hd", 'uvi' : "image/vnd.dece.graphic", 'uvm' : "video/vnd.dece.mobile", 'uvp' : "video/vnd.dece.pd", 'uvs' : "video/vnd.dece.sd", 'uvt' : "application/vnd.dece.ttml+xml", 'uvu' : "video/vnd.uvvu.mp4", 'uvv' : "video/vnd.dece.video", 'uvva' : "audio/vnd.dece.audio", 'uvvd' : "application/vnd.dece.data", 'uvvf' : "application/vnd.dece.data", 'uvvg' : "image/vnd.dece.graphic", 'uvvh' : "video/vnd.dece.hd", 'uvvi' : "image/vnd.dece.graphic", 'uvvm' : "video/vnd.dece.mobile", 'uvvp' : "video/vnd.dece.pd", 'uvvs' : "video/vnd.dece.sd", 'uvvt' : "application/vnd.dece.ttml+xml", 'uvvu' : "video/vnd.uvvu.mp4", 'uvvv' : "video/vnd.dece.video", 'uvvx' : "application/vnd.dece.unspecified", 'uvvz' : "application/vnd.dece.zip", 'uvx' : "application/vnd.dece.unspecified", 'uvz' : "application/vnd.dece.zip", 'vcard' : "text/vcard", 'vcd' : "application/x-cdlink", 'vcf' : "text/x-vcard", 'vcg' : "application/vnd.groove-vcard", 'vcs' : "text/x-vcalendar", 'vcx' : "application/vnd.vcx", 'vis' : "application/vnd.visionary", 'viv' : "video/vnd.vivo", 'vob' : "video/x-ms-vob", 'vor' : "application/vnd.stardivision.writer", 'vox' : "application/x-authorware-bin", 'vrml' : "model/vrml", 'vsd' : "application/vnd.visio", 'vsf' : "application/vnd.vsf", 'vss' : "application/vnd.visio", 'vst' : "application/vnd.visio", 'vsw' : "application/vnd.visio", 'vtu' : "model/vnd.vtu", 'vxml' : "application/voicexml+xml", 'w3d' : "application/x-director", 'wad' : "application/x-doom", 'wav' : "audio/x-wav", 'wax' : "audio/x-ms-wax", 'wbmp' : "image/vnd.wap.wbmp", 'wbs' : "application/vnd.criticaltools.wbs+xml", 'wbxml' : "application/vnd.wap.wbxml", 'wcm' : "application/vnd.ms-works", 'wdb' : "application/vnd.ms-works", 'wdp' : "image/vnd.ms-photo", 'weba' : "audio/webm", 'webm' : "video/webm", 'webp' : "image/webp", 'wg' : "application/vnd.pmi.widget", 'wgt' : "application/widget", 'wks' : "application/vnd.ms-works", 'wm' : "video/x-ms-wm", 'wma' : "audio/x-ms-wma", 'wmd' : "application/x-ms-wmd", 'wmf' : "application/x-msmetafile", 'wml' : "text/vnd.wap.wml", 'wmlc' : "application/vnd.wap.wmlc", 'wmls' : "text/vnd.wap.wmlscript", 'wmlsc' : "application/vnd.wap.wmlscriptc", 'wmv' : "video/x-ms-wmv", 'wmx' : "video/x-ms-wmx", 'wmz' : "application/x-ms-wmz", 'woff' : "application/x-font-woff", 'wpd' : "application/vnd.wordperfect", 'wpl' : "application/vnd.ms-wpl", 'wps' : "application/vnd.ms-works", 'wqd' : "application/vnd.wqd", 'wri' : "application/x-mswrite", 'wrl' : "model/vrml", 'wsdl' : "application/wsdl+xml", 'wspolicy' : "application/wspolicy+xml", 'wtb' : "application/vnd.webturbo", 'wvx' : "video/x-ms-wvx", 'x32' : "application/x-authorware-bin", 'x3d' : "model/x3d+xml", 'x3db' : "model/x3d+binary", 'x3dbz' : "model/x3d+binary", 'x3dv' : "model/x3d+vrml", 'x3dvz' : "model/x3d+vrml", 'x3dz' : "model/x3d+xml", 'xaml' : "application/xaml+xml", 'xap' : "application/x-silverlight-app", 'xar' : "application/vnd.xara", 'xbap' : "application/x-ms-xbap", 'xbd' : "application/vnd.fujixerox.docuworks.binder", 'xbm' : "image/x-xbitmap", 'xdf' : "application/xcap-diff+xml", 'xdm' : "application/vnd.syncml.dm+xml", 'xdp' : "application/vnd.adobe.xdp+xml", 'xdssc' : "application/dssc+xml", 'xdw' : "application/vnd.fujixerox.docuworks", 'xenc' : "application/xenc+xml", 'xer' : "application/patch-ops-error+xml", 'xfdf' : "application/vnd.adobe.xfdf", 'xfdl' : "application/vnd.xfdl", 'xht' : "application/xhtml+xml", 'xhtml' : "application/xhtml+xml", 'xhvml' : "application/xv+xml", 'xif' : "image/vnd.xiff", 'xla' : "application/vnd.ms-excel", 'xlam' : "application/vnd.ms-excel.addin.macroenabled.12", 'xlc' : "application/vnd.ms-excel", 'xlf' : "application/x-xliff+xml", 'xlm' : "application/vnd.ms-excel", 'xls' : "application/vnd.ms-excel", 'xlsb' : "application/vnd.ms-excel.sheet.binary.macroenabled.12", 'xlsm' : "application/vnd.ms-excel.sheet.macroenabled.12", 'xlsx' : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 'xlt' : "application/vnd.ms-excel", 'xltm' : "application/vnd.ms-excel.template.macroenabled.12", 'xltx' : "application/vnd.openxmlformats-officedocument.spreadsheetml.template", 'xlw' : "application/vnd.ms-excel", 'xm' : "audio/xm", 'xml' : "application/xml", 'xo' : "application/vnd.olpc-sugar", 'xop' : "application/xop+xml", 'xpi' : "application/x-xpinstall", 'xpl' : "application/xproc+xml", 'xpm' : "image/x-xpixmap", 'xpr' : "application/vnd.is-xpr", 'xps' : "application/vnd.ms-xpsdocument", 'xpw' : "application/vnd.intercon.formnet", 'xpx' : "application/vnd.intercon.formnet", 'xsl' : "application/xml", 'xslt' : "application/xslt+xml", 'xsm' : "application/vnd.syncml+xml", 'xspf' : "application/xspf+xml", 'xul' : "application/vnd.mozilla.xul+xml", 'xvm' : "application/xv+xml", 'xvml' : "application/xv+xml", 'xwd' : "image/x-xwindowdump", 'xyz' : "chemical/x-xyz", 'xz' : "application/x-xz", 'yaml' : "text/yaml", 'yang' : "application/yang", 'yin' : "application/yin+xml", 'yml' : "text/yaml", 'z' : "application/x-compress", 'z1' : "application/x-zmachine", 'z2' : "application/x-zmachine", 'z3' : "application/x-zmachine", 'z4' : "application/x-zmachine", 'z5' : "application/x-zmachine", 'z6' : "application/x-zmachine", 'z7' : "application/x-zmachine", 'z8' : "application/x-zmachine", 'zaz' : "application/vnd.zzazz.deck+xml", 'zip' : "application/zip", 'zir' : "application/vnd.zul", 'zirz' : "application/vnd.zul", 'zmm' : "application/vnd.handheld-entertainment+xml", '123' : "application/vnd.lotus-1-2-3"};
Player.main();
})(typeof console != "undefined" ? console : {log:function(){}}, typeof window != "undefined" ? window : exports);

//# sourceMappingURL=player.js.map