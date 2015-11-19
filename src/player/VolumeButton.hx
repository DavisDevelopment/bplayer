package player;

import tannus.geom.*;
import tannus.math.Percent;
import tannus.events.MouseEvent;

import gryffin.core.*;
import gryffin.display.*;

import player.ControlButton;

class VolumeButton extends ControlButton {
	/* Constructor Function */
	public function new(c : Controls):Void {
		super( c );

		icon = Image.load('../assets/volume-light.png');

		hovered = false;
		widget = new VolumeWidget(controls, this);
	}

/* === Instance Methods === */

	/**
	  * Update [this] Button
	  */
	override public function update(s : Stage):Void {
		var mp = s.getMousePosition();
		
		hovered = (mp != null && containsPoint( mp ));
		w = h = controls.h;
		x = (controls.x + controls.w - w - 5);
		y = (controls.y);
	}

	/**
	  * Render [this] Button
	  */
	override public function render(s:Stage, c:Ctx):Void {
		if ( player.showAll ) {
			c.drawComponent(icon, 0, 0, icon.width, icon.height, x, y, w, h);
		}
	}

	/**
	  * When [this] Button gets clicked
	  */
	override public function click(e : MouseEvent):Void {
		widget.toggleHidden();
	}

/* === Instance Fields === */

	public var icon : Image;
	public var hovered : Bool;
	public var widget : VolumeWidget;
}
