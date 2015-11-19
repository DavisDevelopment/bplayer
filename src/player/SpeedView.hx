package player;

import gryffin.core.*;
import gryffin.display.*;

import tannus.geom.*;
import tannus.graphics.Color;
import tannus.ds.Value;
import tannus.io.Ptr;
import tannus.io.Signal;
import tannus.math.Percent;
import tannus.events.MouseEvent;
import tannus.media.Duration;

import player.Ent;
import player.Player;

import Math.*;

class SpeedView extends Ent {
	/* Constructor Function */
	public function new(p : Player):Void {
		super();

		player = p;

		player.on('activated', function(s : Stage) {
			s.addChild( this );
		});
	}

/* === Instance Methods === */

	/**
	  * Update [this] view
	  */
	override public function update(s : Stage):Void {
		
	}

	/**
	  * Render [this] view
	  */
	override public function render(s:Stage, c:Ctx):Void {
		if (player.showAll) {
			c.save();
			c.font = '10pt Monospace';
			var tm = c.measureText(speed.toString());
			w = (tm.width + 6);
			h = (tm.height + 6);
			x = (s.width - w - 6);
			y = 6;

			c.fillStyle = '#888';
			c.globalAlpha = 0.8;
			c.fillRect(x, y, w, h);
			c.fillStyle = '#000';
			c.fillText(speed.toString(), x+3, y+h-3);
			c.restore();
		}
	}

/* === Computed Instance Fields === */

	/* the Video that [this] is attached to */
	public var video(get, never):Video;
	private inline function get_video():Video {
		return player.video;
	}

	/* the Percent representing the current playback speed */
	public var speed(get, never):Percent;
	private inline function get_speed():Percent {
		return Percent.percent(video.playbackRate, 1.0);
	}

/* === Instance Fields === */

	public var player : Player;
}
