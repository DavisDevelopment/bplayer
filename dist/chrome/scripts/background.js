(function (console) { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var Background = function() { };
Background.__name__ = ["Background"];
Background.main = function() {
	chrome.app.runtime.onLaunched.addListener(function(data) {
		chrome_Windows.create("pages/index.html",null,function(app) {
			console.log("Bonerfarts");
		});
	});
};
var EReg = function() { };
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
HxOverrides.__name__ = ["HxOverrides"];
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
var Lambda = function() { };
Lambda.__name__ = ["Lambda"];
Lambda.has = function(it,elt) {
	var $it0 = $iterator(it)();
	while( $it0.hasNext() ) {
		var x = $it0.next();
		if(x == elt) return true;
	}
	return false;
};
var List = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
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
var Reflect = function() { };
Reflect.__name__ = ["Reflect"];
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
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	add: function(x) {
		this.b += Std.string(x);
	}
	,__class__: StringBuf
};
var StringTools = function() { };
StringTools.__name__ = ["StringTools"];
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
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var ValueType = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
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
var chrome_Runtime = function() { };
chrome_Runtime.__name__ = ["chrome","Runtime"];
chrome_Runtime.__properties__ = {get_lib:"get_lib"}
chrome_Runtime.onLaunch = function(f) {
	chrome.app.runtime.onLaunched.addListener(f);
};
chrome_Runtime.onInstalled = function(f) {
	chrome_Runtime.rt.onInstalled.addListener(f);
};
chrome_Runtime.get_lib = function() {
	return chrome.app.runtime;
};
var chrome_Windows = function() { };
chrome_Windows.__name__ = ["chrome","Windows"];
chrome_Windows.create = function(url,options,cb) {
	chrome_Windows.lib.create(url,options,cb);
};
var chrome_app__$AppWindow_AppWindow_$Impl_$ = {};
chrome_app__$AppWindow_AppWindow_$Impl_$.__name__ = ["chrome","app","_AppWindow","AppWindow_Impl_"];
chrome_app__$AppWindow_AppWindow_$Impl_$._new = function(tw) {
	return tw;
};
var haxe_IMap = function() { };
haxe_IMap.__name__ = ["haxe","IMap"];
var haxe__$Int64__$_$_$Int64 = function(high,low) {
	this.high = high;
	this.low = low;
};
haxe__$Int64__$_$_$Int64.__name__ = ["haxe","_Int64","___Int64"];
haxe__$Int64__$_$_$Int64.prototype = {
	__class__: haxe__$Int64__$_$_$Int64
};
var haxe_io_Bytes = function(data) {
	this.length = data.byteLength;
	this.b = new Uint8Array(data);
	data.hxBytes = this;
	data.bytes = this.b;
};
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
var haxe_ds_StringMap = function() {
	this.h = { };
};
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
var haxe_io_Eof = function() { };
haxe_io_Eof.__name__ = ["haxe","io","Eof"];
haxe_io_Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe_io_Eof
};
var haxe_io_Error = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
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
var haxe_io_Input = function() { };
haxe_io_Input.__name__ = ["haxe","io","Input"];
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	if(Error.captureStackTrace) Error.captureStackTrace(this,js__$Boot_HaxeError);
};
js__$Boot_HaxeError.__name__ = ["js","_Boot","HaxeError"];
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
	__class__: js__$Boot_HaxeError
});
var js_Boot = function() { };
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
var tannus_ds_ArrayTools = function() { };
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
var tannus_ds_Destructible = function() { };
tannus_ds_Destructible.__name__ = ["tannus","ds","Destructible"];
tannus_ds_Destructible.prototype = {
	__class__: tannus_ds_Destructible
};
var tannus_ds__$Dict_Dict_$Impl_$ = {};
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
var tannus_ds_Either = { __ename__ : ["tannus","ds","Either"], __constructs__ : ["Left","Right"] };
tannus_ds_Either.Left = function(value) { var $x = ["Left",0,value]; $x.__enum__ = tannus_ds_Either; $x.toString = $estr; return $x; };
tannus_ds_Either.Right = function(value) { var $x = ["Right",1,value]; $x.__enum__ = tannus_ds_Either; $x.toString = $estr; return $x; };
var tannus_ds__$Maybe_Maybe_$Impl_$ = {};
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
var tannus_ds__$Method_Method_$Impl_$ = {};
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
var tannus_ds__$Stack_StackIterator = function(s) {
	this.stack = s;
};
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
var tannus_ds__$TwoTuple_TwoTuple_$Impl_$ = {};
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
var tannus_ds_promises_ArrayPromise = function(f) {
	tannus_ds_Promise.call(this,f);
};
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
var tannus_internal_TypeTools = function() { };
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
var tannus_io__$Byte_Byte_$Impl_$ = {};
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
var tannus_io__$Getter_Getter_$Impl_$ = {};
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
var tannus_io__$Pointer_Pointer_$Impl_$ = {};
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
var tannus_io__$RegEx_RegEx_$Impl_$ = {};
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
var tannus_io__$Signal_Handler = { __ename__ : ["tannus","io","_Signal","Handler"], __constructs__ : ["Normal","Counted","Every","Once","Tested"] };
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
var tannus_io__$VoidSignal_Handler = { __ename__ : ["tannus","io","_VoidSignal","Handler"], __constructs__ : ["Normal","Counted","Every","Once"] };
tannus_io__$VoidSignal_Handler.Normal = function(func) { var $x = ["Normal",0,func]; $x.__enum__ = tannus_io__$VoidSignal_Handler; $x.toString = $estr; return $x; };
tannus_io__$VoidSignal_Handler.Counted = function(func,count,fired) { var $x = ["Counted",1,func,count,fired]; $x.__enum__ = tannus_io__$VoidSignal_Handler; $x.toString = $estr; return $x; };
tannus_io__$VoidSignal_Handler.Every = function(func,wait,remaining) { var $x = ["Every",2,func,wait,remaining]; $x.__enum__ = tannus_io__$VoidSignal_Handler; $x.toString = $estr; return $x; };
tannus_io__$VoidSignal_Handler.Once = function(func,fired) { var $x = ["Once",3,func,fired]; $x.__enum__ = tannus_io__$VoidSignal_Handler; $x.toString = $estr; return $x; };
var tannus_math_Nums = function() { };
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
var tannus_nore_Check = { __ename__ : ["tannus","nore","Check"], __constructs__ : ["NoCheck","IDCheck","TypeCheck","LooseTypeCheck","FieldExistsCheck","FieldValueCheck","FieldSubChecks","GroupCheck","HelperCheck","TupleCheck","InverseCheck","EitherCheck","TernaryCheck"] };
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
var tannus_nore_Token = { __ename__ : ["tannus","nore","Token"], __constructs__ : ["TIdent","TRefence","TString","TNumber","TOperator","TGroup","TSub","TTuple","TCall","TAny","TColon","TQuestion","TTilde","TComma","TOBracket","TCBracket","TOParen","TCParen","THash","TArrayAccess","TRangeAccess"] };
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
var tannus_nore_Value = { __ename__ : ["tannus","nore","Value"], __constructs__ : ["VNumber","VString","VFieldReference","VIndexReference","VArrayAccess","VTuple"] };
tannus_nore_Value.VNumber = function(num) { var $x = ["VNumber",0,num]; $x.__enum__ = tannus_nore_Value; $x.toString = $estr; return $x; };
tannus_nore_Value.VString = function(str) { var $x = ["VString",1,str]; $x.__enum__ = tannus_nore_Value; $x.toString = $estr; return $x; };
tannus_nore_Value.VFieldReference = function(field) { var $x = ["VFieldReference",2,field]; $x.__enum__ = tannus_nore_Value; $x.toString = $estr; return $x; };
tannus_nore_Value.VIndexReference = function(index) { var $x = ["VIndexReference",3,index]; $x.__enum__ = tannus_nore_Value; $x.toString = $estr; return $x; };
tannus_nore_Value.VArrayAccess = function(field,index) { var $x = ["VArrayAccess",4,field,index]; $x.__enum__ = tannus_nore_Value; $x.toString = $estr; return $x; };
tannus_nore_Value.VTuple = function(vals) { var $x = ["VTuple",5,vals]; $x.__enum__ = tannus_nore_Value; $x.toString = $estr; return $x; };
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
String.prototype.__class__ = String;
String.__name__ = ["String"];
Array.__name__ = ["Array"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
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
var ArrayBuffer = typeof(window) != "undefined" && window.ArrayBuffer || typeof(global) != "undefined" && global.ArrayBuffer || js_html_compat_ArrayBuffer;
if(ArrayBuffer.prototype.slice == null) ArrayBuffer.prototype.slice = js_html_compat_ArrayBuffer.sliceImpl;
var DataView = typeof(window) != "undefined" && window.DataView || typeof(global) != "undefined" && global.DataView || js_html_compat_DataView;
var Uint8Array = typeof(window) != "undefined" && window.Uint8Array || typeof(global) != "undefined" && global.Uint8Array || js_html_compat_Uint8Array._new;
chrome_Runtime.rt = chrome.runtime;
chrome_Windows.lib = chrome.app.window;
haxe_crypto_Base64.CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
haxe_crypto_Base64.BYTES = haxe_io_Bytes.ofString(haxe_crypto_Base64.CHARS);
haxe_io_FPHelper.i64tmp = (function($this) {
	var $r;
	var x = new haxe__$Int64__$_$_$Int64(0,0);
	$r = x;
	return $r;
}(this));
js_Boot.__toStr = {}.toString;
js_html_compat_Uint8Array.BYTES_PER_ELEMENT = 1;
tannus_nore_Compiler.initHelpers = new tannus_io_Signal();
tannus_nore_Lexer.COMPLETION_ERROR = "::-EOI-::";
tannus_nore_ORegEx.ast_results = new haxe_ds_StringMap();
tannus_nore_Parser.COMPLETION_ERROR = "@>EOI<@";
Background.main();
})(typeof console != "undefined" ? console : {log:function(){}});

//# sourceMappingURL=background.js.map