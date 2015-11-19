package player;

import gryffin.core.*;
import gryffin.display.*;

class Box extends Ent {
	public function new():Void {
		super();

		w = 100;
		h = 100;
	}

	override public function render(s:Stage, c:Ctx):Void {
		c.fillStyle = '#FF0000';
		c.fillRect(x, y, w, h);
	}
}
