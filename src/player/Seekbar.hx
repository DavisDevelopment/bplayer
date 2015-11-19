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

import Math.*;

class Seekbar extends Ent {
	/* Constructor Function */
	public function new(c : Controls):Void {
		super();

		controls = c;
		hovered = false;
		hoverLocation = null;
		
		listen();
	}

/* === Instance Methods === */

	/**
	  * Update [this]
	  */
	override public function update(s : Stage):Void {
		super.update( s );

		rect.cloneFrom( controls.rect );
		h = 18;
		y = (controls.y - h);

		hovered = false;
		hoverLocation = null;
		var mp = stage.getMousePosition();
		if (mp != null && containsPoint(mp)) {
			hovered = true;
			hoverLocation = mp;
		}
	}

	/**
	  * Render [this]
	  */
	@:access(player.Player)
	override public function render(s:Stage, c:Ctx):Void {
		if ( controls.player.showAll ) {
			c.fillStyle = '#FFF';
			var p = progress();
			c.fillRect(x, y, p.of(w), h);
			
			var text:String = currentTime().toString();
			c.font = '12pt Monospace';
			var tm = c.measureText( text );
			var tr = new Rectangle(0, 0, tm.width+4, tm.height+4);
			tr.x = (x + p.of(w) - (tm.width/2));
			tr.y = (y - tr.h - 5);
			if (tr.x < 5)
				tr.x = 5;
			if (tr.x > s.width - 5)
				tr.x = (s.width - 5);
			c.fillStyle = '#888';
			c.fillRect(tr.x, tr.y, tr.w, tr.h);
			c.fillStyle = '#000';
			c.fillText(text, tr.x+2, tr.y+tr.h-2);
		}
	}

	/**
	  * Register any needed event-handlers
	  */
	private function listen():Void {
		controls.on('activated', function(x) {
			controls.stage.addChild( this );
		});
		on('click', click);
	}

	/**
	  * When [this] is clicked on
	  */
	public function click(e : MouseEvent):Void {
		var p:Percent = Percent.percent(abs(x - e.position.x), w);
		var v = controls.player.video;
		v.currentTime = p.of(v.duration.totalSeconds);
	}

	/**
	  * Get the current progress of the Video
	  */
	private function progress():Percent {
		if ( !hovered ) {
			return controls.player.video.progress;
		}
		else {
			return Percent.percent(hoverLocation.x, w);
		}
	}

	/**
	  * Get the current playback time as a Duration
	  */
	private function currentTime():Duration {
		var v = controls.player.video;
		return Duration.fromSecondsF(progress().of(v.duration.totalSeconds));
	}

/* === Instance Fields === */

	public var controls : Controls;

	public var hovered : Bool;
	public var hoverLocation : Null<Point>;
}
