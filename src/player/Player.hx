package player;

import gryffin.core.*;
import gryffin.display.*;

import tannus.geom.*;
import tannus.io.Ptr;
import tannus.io.Signal;
import tannus.io.VoidSignal in VSignal;
import tannus.http.Url;
import tannus.media.*;
import tannus.html.Win;
import tannus.chrome.FileSystem;
import tannus.html.fs.*;
import tannus.ds.AsyncStack;

import js.html.Document;

using Lambda;
using tannus.ds.ArrayTools;

class Player extends Ent {
	/* Constructor Function */
	public function new():Void {
		super();

		videoPane = new VideoPane();
		controls = new Controls( this );
		keyControls = new KeyControls( this );
		speedView = new SpeedView( this );
		idleTime = 2200;
		currentMedia = null;

		showAll = false;
	}

/* === Instance Methods === */
	
	/**
	  * Play the given Track
	  */
	public function setMedia(track:Track, ?cb:Void->Void):Void {
		video.load(track.location, function() {
			document.title = 'BPlayer - ${track.title}';
			currentMedia = track;

			if (cb != null) {
				cb();
			}
		});
	}

	/**
	  * Supply a Playlist
	  */
	public function setMediaList(list : Playlist):Void {
		if (!list.tracks.empty()) {
			playlist = list;
			
			/* if nothing is currently playing */
			if (currentMedia == null) {
				// play the first track in the list
				setMedia( list.tracks[0] );
			}
		}
	}

	/**
	  * Skip to the next Track
	  */
	public function nextTrack(cb : Void->Void):Void {
		if (trackNumber != -1) {
			setMedia(playlist.tracks[nextTrackIndex()], cb);
		}
	}

	/**
	  * Skip to the previous Track
	  */
	public function prevTrack(cb : Void->Void):Void {
		if (trackNumber != -1) {
			setMedia(playlist.tracks[prevTrackIndex()], cb);
		}
	}

	/**
	  * Open some video files
	  */
	public function open(?cb : Void->Void):Void {
		choose(function(list) {
			if (playlist == null) {
				setMediaList( list );
			}
			else {
				playlist.tracks = playlist.tracks.concat( list.tracks );
			}

			if (cb != null) {
				cb();
			}
		});
	}

	/**
	  * Get the index of the next track
	  */
	private function nextTrackIndex():Int {
		if (trackNumber == playlist.length - 1) {
			return 0;
		}
		else {
			return (trackNumber + 1);
		}
	}

	/**
	  * Get the index of the previous Track
	  */
	private function prevTrackIndex():Int {
		if (trackNumber == 0) {
			return (playlist.length - 1);
		}
		else {
			return (trackNumber - 1);
		}
	}

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
	  * Initialize [this] Player
	  */
	override public function init(s : Stage):Void {
		super.init( s );

		s.addChild( videoPane );
		s.addChild( controls );
	}

	/**
	  * Update [this] Player
	  */
	override public function update(s : Stage):Void {
		w = s.width;
		h = s.height;

		showAll = false;
		var showAllEvents = ['mousemove', 'click', 'keydown'];
		var now = (Date.now().getTime());
		for (name in showAllEvents) {
			var sinceLast:Float = (now - s.mostRecentOccurrenceTime(name));
			showAll = (sinceLast < idleTime);
			if ( showAll )
				break;
		}
	}

	/**
	  * Render [this] Player
	  */
	override public function render(s:Stage, c:Ctx):Void {
		null;
	}

/* === Computed Instance Fields === */

	/* the 'video' field of [videoPane] */
	public var video(get, never):Video;
	private function get_video():Video {
		return (videoPane.video);
	}

	/* the window [this] Player is currently on */
	public var window(get, never):Win;
	private inline function get_window():Win {
		return Win.current;
	}

	/* the Document [this] Player is in */
	public var document(get, never):Document;
	private inline function get_document():Document {
		return window.document;
	}

	/* the track-number of the current media */
	public var trackNumber(get, never):Int;
	private inline function get_trackNumber():Int {
		if (playlist != null && currentMedia != null) {
			return (playlist.tracks.indexOf(currentMedia));
		}
		else return -1;
	}

/* === Instance Fields === */

	public var videoPane : VideoPane;
	public var controls : Controls;
	public var keyControls : KeyControls;
	public var speedView : SpeedView;
	public var idleTime : Int;
	public var playlist : Null<Playlist>;
	public var currentMedia : Null<Track>;

	public var showAll : Bool;
}
