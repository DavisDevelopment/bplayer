package player;

import gryffin.core.*;
import gryffin.display.*;

import tannus.geom.*;
import tannus.graphics.Color;
import tannus.ds.Value;
import tannus.io.Ptr;
import tannus.io.Signal;

import player.Ent;

class Controls extends Ent {
	/* Constructor Function */
	public function new(p : Player):Void {
		super();

		player = p;
		background = '#666';
		hovered = false;
		seekbar = new Seekbar( this );
		buttons = new Array();

		buttons.push(new PlayButton( this ));
		buttons.push(new VolumeButton( this ));
		buttons.push(new NextButton( this ));
		buttons.push(new PrevButton( this ));
	}

/* === Instance Methods === */

	/**
	  * Update [this]
	  */
	override public function update(s : Stage):Void {
		w = player.w;
		h = 35;
		y = (player.h - h);

		checkMouse();

	}

	@:access(player.Player)
	override public function render(s:Stage, c:Ctx):Void {
		if ( player.showAll ) {
			c.save();
			
			c.globalAlpha = 0.7;
			c.fillStyle = background.toString();
			c.fillRect(x, y, w, h);

			c.restore();
		}
	}

	/**
	  * Check if user is hovering over the Controls
	  */
	private function checkMouse():Void {
		var pos:Null<Point> = stage.getMousePosition();
		hovered = (pos != null && containsPoint( pos ));
	}

/* === Instance Fields === */

	public var background : Color;
	public var player : player.Player;
	public var hovered : Bool;
	public var seekbar : Seekbar;
	public var buttons : Array<ControlButton>;
}
