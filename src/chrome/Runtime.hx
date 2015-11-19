package chrome;

import tannus.io.Signal;
import tannus.ds.Object;

class Runtime {
	/**
	  * Listen for 'launch' events
	  */
	public static inline function onLaunch(f : Object->Void):Void {
		lib.onLaunched.addListener( f );
	}

	/**
	  * Listen for 'install' events
	  */
	public static inline function onInstalled(f : Object->Void):Void {
		rt.onInstalled.addListener( f );
	}

	/**
	  * Reference to chrome.app.runtime to be used internally
	  */
	private static var lib(get, never):Dynamic;
	private static inline function get_lib():Dynamic {
		return untyped __js__('chrome.app.runtime');
	}

	/**
	  * Reference to chrome.runtime
	  */
	private static var rt:Dynamic = {untyped __js__('chrome.runtime');};
}
