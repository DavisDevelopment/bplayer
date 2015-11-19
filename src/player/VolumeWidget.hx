package player;

import tannus.geom.*;
import tannus.events.MouseEvent;
import tannus.math.Percent;

import gryffin.core.*;
import gryffin.display.*;

import player.Ent;

class VolumeWidget extends Ent {
	/* Constructor Function */
	public function new(c:Controls, vb:VolumeButton):Void {
		super();

		controls = c;
		button = vb;

		button.on('activated', function(stage) {
			stage.addChild( this );
		});
		on('click', click);
		hide();
	}

/* === Instance Methods === */

	/**
	  * Update [this] Widget
	  */
	override public function update(s : Stage):Void {
		super.update( s );

		w = 10;
		h = 75;
		x = (button.x + (button.w / 2));
		y = (button.y - h - 8);
	}

	/**
	  * Render [this] Widget
	  */
	override public function render(s:Stage, c:Ctx):Void {
		if (button.player.showAll) {
			var _h:Float = (h * volume);
			c.save();
			//- fill the background
			c.fillStyle = '#888';
			c.fillRect(x, y, w, h);
			//- fill the volume indicator
			c.fillStyle = '#FFF';
			c.fillRect(x, (y + (h - _h)), w, _h);
			//- trace the border
			c.strokeStyle = '#000';
			c.strokeRect(x, y, w, h);
			c.restore();
		}
	}

	/**
	  * When [this] Widget gets clicked on
	  */
	public function click(e : MouseEvent):Void {
		var vp:Percent = new Percent(Percent.percent(y - e.position.y, h).value * -1).complement();
		volume = vp.of( 1.0 );
	}

/* === Computed Instance Fields === */

	/**
	  * The volume of [this] Video
	  */
	public var volume(get, set):Float;
	private inline function get_volume():Float {
		return (controls.player.video.volume);
	}
	private inline function set_volume(v : Float):Float {
		return (controls.player.video.volume = v);
	}

/* === Instance Fields === */

	public var controls : Controls;
	public var button : VolumeButton;
}
