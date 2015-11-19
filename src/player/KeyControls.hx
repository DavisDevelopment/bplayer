package player;

import tannus.events.KeyboardEvent;

import gryffin.core.Stage;
import gryffin.display.Video;

import player.Player;

class KeyControls {
	/* Constructor Function */
	public function new(p : Player):Void {
		player = p;
		stage = player.stage;

		player.on('activated', function(s : Stage) {
			stage = s;
			listen();
		});
	}

/* === Instance Methods === */

	/**
	  * Listen for keyboard events
	  */
	private function listen():Void {
		stage.on('keydown', press);
	}

	/**
	  * Handle keyboard events
	  */
	private function press(e : KeyboardEvent):Void {
		switch ( e.keyCode ) {
			/* Spacebar */
			case 32:
				(video.paused?video.play:video.pause)();

			/* N key */
			case 78:
				player.nextTrack(function() {
					trace('skipped to next track');
				});

			/* P key */
			case 80:
				player.prevTrack(function() {
					trace('skipped to previous track');
				});

			/* O key */
			case 79 if ( e.ctrlKey ):
				player.open();

			/* M key */
			case 77:
				video.muted = !video.muted;

			/* Right Arrow */
			case 39:
				video.currentTime += 15;

			/* Left Arrow */
			case 37:
				video.currentTime -= 15;

			/* ] key */
			case 221:
				video.playbackRate = Math.round((video.playbackRate + 0.05) * 100) / 100;

			/* [ key */
			case 219:
				video.playbackRate = Math.round((video.playbackRate - 0.05) * 100) / 100;

			/* = key */
			case 187:
				video.playbackRate = 1.0;

			/* Anything Else */
			default:
				trace( e.keyCode );
		}
	}

/* === Computed Instance Fields === */

	/* the video in question */
	public var video(get, never):Video;
	private inline function get_video():Video return player.video;

/* === Instance Fields === */

	public var stage : Stage;
	public var player : Player;
}
