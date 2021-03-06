package chrome.app;

typedef ContentBounds = {
	@:optional var top : Int;
	@:optional var left : Int;
	@:optional var width : Int;
	@:optional var height : Int;
}

typedef BoundsSpecification = {
	@:optional var left : Int;
	@:optional var top : Int;
	@:optional var width : Int;
	@:optional var height : Int;
	@:optional var minWidth : Int;
	@:optional var minHeight : Int;
	@:optional var maxWidth : Int;
	@:optional var maxHeight : Int;
}

typedef Bounds = {
	var left : Int;
	var top : Int;
	var width : Int;
	var height : Int;
	@:optional var minWidth : Int;
	@:optional var minHeight : Int;
	@:optional var maxWidth : Int;
	@:optional var maxHeight : Int;
	function setPosition(left:Int,top:Int) : Void;
	function setSize(width:Int,height:Int) : Void;
	function setMinimumSize(minWidth:Int,minHeight:Int) : Void;
	function setMaximumSize(maxWidth:Int,maxHeight:Int) : Void;
}

typedef FrameOptions = {
	@:optional var type : String;
	@:optional var color : String;
	@:optional var activeColor : String;
	@:optional var inactiveColor : String;
}

@:enum abstract WindowState(String) {
	var normal = "normal";
	var fullscreen = "fullscreen";
	var maximized = "maximized";
	var minimized = "minimized";
}

/**
  * Typedef for the options provided when creating a new AppWindow
  */
typedef CreateWindowOptions = {
	@:optional var id : String;
	@:optional var innerBounds : BoundsSpecification;
	@:optional var outerBounds : BoundsSpecification;
	@:optional var minWidth : Int;
	@:optional var minHeight : Int;
	@:optional var maxWidth : Int;
	@:optional var maxHeight : Int;
	@:optional var frame : FrameOptions;
	@:optional var bounds : ContentBounds;
	@:optional var transparentBackground : Bool;
	@:optional var state : WindowState;
	@:optional var hidden : Bool;
	@:optional var resizable : Bool;
	@:optional var singleton : Bool;
	@:optional var alwaysOnTop : Bool;
	@:optional var focused : Bool;
}

typedef TAppWindow = {
	function focus() : Void;
	function fullscreen() : Void;
	function isFullscreen() : Bool;
	function minimize() : Void;
	function isMinimized() : Bool;
	function maximize() : Void;
	function isMaximized() : Bool;
	function restore() : Void;
	function moveTo( left : Int, top : Int ) : Void;
	function resizeTo( width : Int, height : Int ) : Void;
	function drawAttention() : Void;
	function clearAttention() : Void;
	function close() : Void;
	function show( ?focused : Bool ) : Void;
	function hide() : Void;
	//function getBounds() : Bounds;
	//function setBounds( bounds : Bounds ) : Void;
	function isAlwaysOnTop() : Bool;
	function setAlwaysOnTop( alwaysOnTop : Bool ) : Void;

	var contentWindow : js.html.Window;
	var id : Int;
	var innerBounds : Bounds;
	var outerBounds : Bounds;
}

/**
  * Wrapper around the AppWindow type
  */
@:forward
abstract AppWindow (TAppWindow) from TAppWindow {
	/* Constructor Function */
	public inline function new(tw : TAppWindow):Void {
		this = tw;
	}
}
