package player;

import gryffin.core.*;
import gryffin.display.*;

import tannus.geom.*;
import tannus.graphics.Color;
import tannus.events.MouseEvent;
import tannus.ds.Value;
import tannus.io.Ptr;
import tannus.io.Signal;

import player.Ent;

class ControlButton extends Ent {
	/* Constructor Function */
	public function new(c : Controls):Void {
		super();

		controls = c;

		on('click', click);
		listen();
	}

/* === Instance Methods === */

	/**
	  * Update [this]
	  */
	override public function update(s : Stage):Void {
		super.update( s );

		w = h = controls.h;
		pos = position();
	}

	/**
	  * Handle the 'click' event
	  */
	private function click(e : MouseEvent):Void {
		trace('you clicked a button');
	}

	/**
	  * set the position of [this] Button
	  */
	private function position():Point {
		return rect.topLeft;
	}

	/**
	  * Do the stuff
	  */
	private function listen():Void {
		controls.on('activated', function(x) {
			controls.stage.addChild( this );
		});
	}

/* === Computed Instance Fields === */

	/* the player that [this] is attached to */
	public var player(get, never):player.Player;
	private inline function get_player() return controls.player;

	/* the video-pane of the Player that [this] is attached to */
	public var videoPane(get, never):VideoPane;
	private inline function get_videoPane():VideoPane return player.videoPane;

	/* the video */
	public var video(get, never):Video;
	private inline function get_video():Video return (player.video);

/* === Instance Fields === */

	public var controls : Controls;
}
