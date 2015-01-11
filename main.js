$(function () {
	var P = $('#P');
	var colorMap = {
		1: 'red',
		2: 'yellow',
		3: 'blue',
	};
	var pileCount = 5;
	var forEach = function (callback) {
		for (var i = pileCount - 1; i >= 0; i++) {
			for (var j = pileCount - 1; j >= 0; j++) {
				callback(i, j);
			}
		}
	};
	var setValue = function (node, value) {
		node.data('value', value);
		node.text(value);
		node.css('background-color', colorMap[value]);
	};
	forEach(function (i, j) {
		var value = Math.floor(Math.random() * 3 + 1);
		var node = $('<div id="D_'+i+'_'+j+'" class="pile">'+value+'<div>');
		node.data('i', i);
		node.data('j', j);
		node.data('hightLight', 0);
		var pileSize = 50;
		node.css('top', (i * pileSize)+'px').css('left', (j * pileSize)+'px');
		setValue(node, value);
		P.append(node);
	});
	var hightLighting = [];
	var hightLight = function ($pile) {
		$pile.animate({top: '-=5px'});
		$pile.data('hightLight', 1);
		hightLighting.push($pile);
		var x = $pile.data('i');
		var y = $pile.data('j');
		var value = $pile.data('value');
		hightLightXY(x, y - 1, value);
		hightLightXY(x, y + 1, value);
		hightLightXY(x + 1, y, value);
		hightLightXY(x - 1, y, value);
	};
	var hightLightXY = function (i, j, value) {
		if (i >= 0 && i < pileCount && j >= 0 && j < pileCount) {
			var selector = '#D_'+i+'_'+j;
			var neighber = $(selector);
			// console.log('hightLightXY', i, j, value, neighber[0]);
			if (!neighber.data('hightLight') && neighber.data('value') == value) {
				hightLight(neighber);
			}
		};
	};
	var fall = function  () {
	};
	var collapse = function ($pile) {
		var x = $pile.data('i');
		var y = $pile.data('j');
		var value = $pile.data('value');
		var p;
		for (var i = hightLighting.length - 1; i >= 0; i--) {
			p = hightLighting[i];
			p.data('will_remove', i);
			console.log('p.set will_remove', p.data('will_remove'));
			p.animate({top: (x*50)+'px', left: (y*50)+'px'}, 'fast', 'swing', function() {
				var $this = $(this);
				var will_remove = $this.data('will_remove');
				if (will_remove) {
					console.log('will_remove', $this[0]);
					$this.remove();
				} else {
					console.log('+1', $this[0]);
					setValue($this, value+1);
					fall();
				}
				hightLighting = [];
			});
			p.data('hightLight', 0);
		};
	};
	$('.pile').click(function (e) {
		var $this = $(this);
		if (!$this.data('hightLight')) {
			console.log('length', hightLighting.length);
			if (hightLighting.length > 0) {
				for (var i = hightLighting.length - 1; i >= 0; i--) {
					var p = hightLighting[i];
					p.animate({top: '+=5px'}, 'fast');
					p.data('hightLight', 0);
				};
			}
			hightLighting = [];
			hightLight($this);
		} else {
			collapse($this);
		}
	});
});