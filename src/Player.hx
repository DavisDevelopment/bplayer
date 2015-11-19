package ;

import tannus.io.Ptr;
import tannus.chrome.FileSystem;
import tannus.html.fs.*;
import tannus.ds.AsyncStack;
import tannus.media.*;

import tannus.sys.Mime;

import gryffin.core.*;

import js.html.CanvasElement;

class Player {
	/* Constructor Function */
	public function new():Void {
		buildPlayer();
	}

/* === Instance Methods === */

	/**
	  * Choose some Video Files
	  */
	public function choose(cb : Playlist -> Void):Void {
		FileSystem.chooseEntry({acceptsMultiple:true}, function(entries : Array<WebFSEntry>) {
			var stack = new AsyncStack();
			var list:Playlist = new Playlist();

			for (entry in entries) {
				if (entry.isFile) {
					stack.under(function(done : Void->Void) {
						var filee:WebFileEntry = cast entry;
						filee.file().then(function( file ) {
							var url:String = file.getObjectURL();

							if (file.type.type == 'video') {
								var track:Track = new Track(entry.name, url);
								
								list.addTrack( track );
								done();
							}
						});
					});
				}
			}

			stack.run(function() {
				cb( list );
			});
		});
	}

	/**
	  * Constructs the video player itself
	  */
	public function buildPlayer():Void {
		var doc = js.Browser.document;
		canvas = doc.createCanvasElement();
		doc.body.appendChild( canvas );

		stage = new Stage( canvas );
		stage.fill();
		
		player = new player.Player();
		stage.addChild( player );
	}

	private static inline function wait(f:Void->Void, ms:Int):Void {
		js.Browser.window.setTimeout(f, ms);
	}

/* === Instance Fields === */

	public var canvas : CanvasElement;
	public var stage : Stage;
	public var player : player.Player;

/* === Static Methods === */

	/* == Main Function == */
	public static function main():Void new Player();
}
