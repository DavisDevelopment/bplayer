package player;

import gryffin.core.*;
import gryffin.display.*;
import tannus.graphics.Color;
import tannus.events.MouseEvent;
import tannus.chrome.Extension.getURL in exturl;

import tannus.geom.*;

class PlaybackButton extends TrayButton {
	/* Constructor Function */
	public function new(t : Tray):Void {
		super(t, 'play');
		priority = 2;
		background = '#0000FF';

		on('click', click);
	}

/* === Instance Methods === */

	public function click(e : MouseEvent):Void {
		var v = tray.player.video;
		(v.paused ? v.play : v.pause)();
	}

	override public function update(s : Stage):Void {
		super.update( s );

		size = tray.h;
		x = (tray.x + 5);
		y = (tray.y);
	}
}
