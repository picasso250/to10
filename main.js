$(function () {
	var P = $('#P');
	var colorMap = {
		1: 'red',
		2: 'yellow',
		3: 'blue',
	};
	var pileCount = 5;
	var forEach = function (callback) {
		for (var i = 0; i < pileCount; i++) {
			for (var j = 0; j < pileCount; j++) {
				callback(i, j);
			}
		}
	};
	var setValue = function (node, value) {
		node.data('value', value);
		node.text(value);
		node.css('background-color', colorMap[value]);
	};
	var pileSize = 50;
	var setPileCol = function (node, i) {
		node.data('i', i);
		node.css('z-index', i);
	};
	var makePile = function (i, j) {
		var value = Math.floor(Math.random() * 3 + 1);
		var node = $('<div id="D_'+i+'_'+j+'" class="pile">'+value+'<div>');
		setPileCol(node, i, j);
		node.css('top', (i * pileSize)+'px').css('left', (j * pileSize)+'px');
		node.data('hightLight', 0);
		setValue(node, value);
		P.append(node);
		return node;
	};
	forEach(function (i, j) {
		makePile(i, j);
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
			var neighber = getByPos(i, j);
			if (!neighber.data('hightLight') && neighber.data('value') == value) {
				hightLight(neighber);
			}
		};
	};
	var getByPos = function (i, j) {
		return $('#D_'+i+'_'+j);
	}
	var fall = function  () {
		// for every col
		var fallPos;
		for (var j = 0; j < pileCount; j++) {
			var i;
			fallPos = -1;
			for (i = pileCount - 1; i >= 0; i--) {
				var $pile = getByPos(i, j);
				var length = $pile.length;
				if (length === 0) {
					if (fallPos === -1) {
						fallPos = i;
					}
				} else {
					if (fallPos !== -1) {
						// we fall
						$pile.animate({top: ((fallPos)*pileSize)+'px'}, 'fast');
						setPileCol(i);
						$pile.attr('id', '#D_'+fallPos+'_'+j);
						fallPos--;
					};
				}
			}
			if (fallPos !== -1) {
				for (i = 0; i <= fallPos; i++) {
					makePile(i, j);
				};
			};
		};
	};
	var collapse = function ($pile) {
		var x = $pile.data('i');
		var y = $pile.data('j');
		var value = $pile.data('value');
		var p;
		for (var i = hightLighting.length - 1; i >= 0; i--) {
			p = hightLighting[i];
			p.data('tmp_i', i);
			p.animate({top: (x*50)+'px', left: (y*50)+'px'}, 'fast', 'swing', function() {
				var $this = $(this);
				var i = $this.data('i');
				var j = $this.data('j');
				if (i === x && j === y) {
					$this.data('hightLight', 0);
					setValue($this, value+1);
				} else {
					$this.remove();
				}
				hightLighting = [];
				var tmp_i = $this.data('tmp_i');
				if (0 === tmp_i) { // the last one
					fall();
				}
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