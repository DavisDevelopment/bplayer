package player;

import gryffin.core.Stage;
import gryffin.core.Entity;
import gryffin.display.*;

import tannus.geom.*;

import player.Ent;

class VideoPane extends Ent {
	/* Constructor Function */
	public function new(?vid : Video):Void {
		super();

		video = (vid != null ? vid : new Video());
	}

/* === Instance Methods === */

	/**
	  * Initialize [this] VideoPane
	  */
	override public function init(s : Stage):Void {
		super.init( s );
	}

	/**
	  * Update [this] Video Pane
	  */
	override public function update(s : Stage):Void {
		w = s.width;
		h = s.height;
	}

	/**
	  * Render [this] VideoPane
	  */
	override public function render(s:Stage, c:Ctx):Void {
		c.save();
		/* if [video] occupies no space (as will be the case if it's not yet loaded), just draw a black rect */
		if (video.width == 0 || video.height == 0) {
			c.fillStyle = '#000';
			c.fillRect(x, y, w, h);
		}
		else {
			c.drawComponent(video, 0, 0, video.width, video.height, x, y, w, h);
		}
		c.restore();
	}

/* === Instance Fields === */

	public var video : Video;
}
