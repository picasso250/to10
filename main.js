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
	var makePile = function (i, j) {
		var value = Math.floor(Math.random() * 3 + 1);
		var node = $('<div id="D_'+i+'_'+j+'" class="pile">'+value+'<div>');
		node.data('i', i);
		node.data('j', j);
		node.data('hightLight', 0);
		node.css('top', (i * pileSize)+'px').css('left', (j * pileSize)+'px');
		setValue(node, value);
		P.append(node);
	}
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
		for (var j = 0; j < pileCount; i++) {
			var i;
			fallPos = -1;
			for (i = pileCount - 1; i >= 0; j--) {
				var $pile = getByPos(i, j);
				if ($pile.length == 0) {
					if (fallPos == -1) {
						fallPos = i;
					}
				} else {
					if (fallPos != -1) {
						// we fall
						$pile.animate({top: '+='+((fallPos-i)*pileSize)+'px'}, 'fast');
						$pile.attr('id', '#D_'+fallPos+'_'+j);
						$pile.data('i', fallPos);
						fallPos++;
					};
				}
			}
			if (fallPos != -1) {
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
				if ($this.data('i') === x && $this.data('j') === y) {
					$this.data('hightLight', 0);
					setValue($this, value+1);
				} else {
					$this.remove();
				}
				hightLighting = [];
				var i = $this.data('tmp_i');
				if (0 === i) { // the last one
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