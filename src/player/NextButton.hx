package player;

import tannus.geom.Point;
import tannus.events.MouseEvent;
import tannus.ds.Pair;

import gryffin.core.Stage;
import gryffin.display.Ctx;
import gryffin.display.Image;

import player.ControlButton;

class NextButton extends ControlButton {
	/* Constructor Function */
	public function new(c : Controls):Void {
		super( c );

		icon = Image.load('../assets/next-light.png');
	}

/* === Instance Methods === */

	/**
	  * Set the position of [this] Button
	  */
	override public function position():Point {
		return new Point(controls.x+controls.w-(w*2)-10, controls.y);
	}

	/**
	  * Render [this] Button
	  */
	override public function render(s:Stage, c:Ctx):Void {
		if ( player.showAll ) {
			c.drawComponent(icon, 0, 0, icon.width, icon.height, x, y, w, h);
		}
	}

	/**
	  * When [this] Button gets clicked
	  */
	override public function click(e : MouseEvent):Void {
		player.nextTrack(function() {
			trace('skipped to next track');
		});
	}

/* === Instance Fields === */

	public var icon : Image;
}
