package ;

import tannus.chrome.*;
import tannus.ds.Object;
import chrome.Runtime.onLaunch;

class Background {
	/* == Main Function == */
	public static function main():Void {
		onLaunch(function(data : Object):Void {
			chrome.Windows.create('pages/index.html', function( app ) {
				trace('Bonerfarts');
			});
		});
	}
}
