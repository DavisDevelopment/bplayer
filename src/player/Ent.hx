package player;

import gryffin.core.*;
import gryffin.display.*;

import tannus.geom.*;

class Ent extends Entity {
	/* Constructor Function */
	public function new():Void {
		super();

		rect = new Rectangle();
		
		margin = new Position(0, 0, 0, 0);
		padding = new Position(0, 0, 0, 0);
	}

/* === Instance Methods === */

	/**
	  * Check whether the given Point is 'inside' [rect]
	  */
	override public function containsPoint(p : Point):Bool {
		return (rect.containsPoint( p ));
	}

/* === Computed Instance Fields === */

	/* the 'x' position of [this] */
	public var x(get, set):Float;
	private inline function get_x():Float return rect.x;
	private inline function set_x(v : Float):Float return (rect.x = v);
	
	/* the 'y' position of [this] */
	public var y(get, set):Float;
	private inline function get_y():Float return rect.y;
	private inline function set_y(v : Float):Float return (rect.y = v);
	
	/* the width of [this] */
	public var w(get, set):Float;
	private inline function get_w():Float return rect.w;
	private inline function set_w(v : Float):Float return (rect.w = v);
	
	/* the height of [this] */
	public var h(get, set):Float;
	private inline function get_h():Float return rect.h;
	private inline function set_h(v : Float):Float return (rect.h = v);

	/* the position of [this], as a Point */
	public var pos(get, set):Point;
	private function get_pos():Point {
		return new Point(x, y);
	}
	private function set_pos(v : Point):Point {
		return new Point(x=v.x, y=v.y);
	}

/* === Instance Fields === */

	public var rect : Rectangle;
	
	public var margin : Position;
	public var padding : Position;
}
