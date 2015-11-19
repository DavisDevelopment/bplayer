package player;

import tannus.geom.Point;
import tannus.events.MouseEvent;
import tannus.ds.Pair;

import gryffin.core.Stage;
import gryffin.display.Ctx;
import gryffin.display.Image;

import player.ControlButton;

class PlayButton extends ControlButton {
	/* Constructor Function */
	public function new(c : Controls):Void {
		super( c );

		icons = new Pair(Image.load('../assets/play-light.png'), Image.load('../assets/pause-light.png'));
	}

/* === Instance Methods === */

	/**
	  * Calculate the position of [this] Button
	  */
	override public function position():Point {
		return new Point(controls.x, controls.y);
	}
	
	/* handle mouse-clicks */
	override public function click(e : MouseEvent):Void {
		(video.paused?video.play:video.pause)();
	};

	/**
	  * Render [this] Button
	  */
	override public function render(s:Stage, c:Ctx):Void {
		var icon:Image = (video.paused?icons.left:icons.right);
		if ( player.showAll )
			c.drawComponent(icon, 0, 0, icon.width, icon.height, x, y, w, h);
	}

/* === Instance Fields === */

	public var icons : Pair<Image, Image>;
}
