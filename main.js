$(function () {
	var P = $('#P'); // the panel, container of all

	// color of text and background
	var colorMap = {
		1: ['rgb(50,245,82)', 'rgb(14, 97, 27)'],
		2: ['rgb(49, 149, 232)', 'rgb(0, 68, 176)'],
		3: ['rgb(226, 197, 0)', 'rgb(229, 86, 12)'],
		4: ['blue', 'red'],
		5: ['blue', 'red'],
		6: ['blue', 'red'],
		7: ['blue', 'red'],
		8: ['blue', 'red'],
		9: ['blue', 'red'],
		11: ['blue', 'red'],
		12: ['blue', 'red'],
		13: ['blue', 'red'],
		14: ['blue', 'red'],
	};

	// game's size
	var pileCount = 5;

	// for every pile
	var forEach = function (callback) {
		for (var i = 0; i < pileCount; i++) {
			for (var j = 0; j < pileCount; j++) {
				callback(i, j);
			}
		}
	};

	// set the number showed on the pile
	var setValue = function (node, value) {
		node.data('value', value);
		node.text(value);
		node.css('background-color', colorMap[value][0]);
		node.css('color', colorMap[value][1]);
	};

	// px of size of pile
	var pileSize = 50;

	// when pile fall, row No. change
	var setPilePos = function (node, i, j) {
		node.data('i', i);
		node.data('j', j);
		node.css('z-index', i);
		node.attr('id', 'D_'+i+'_'+j);
	};

	var makePile = function (i, j, realRow) {
		var value = Math.floor(Math.random() * 3 + 1);
		var node = $('<div id="D_'+i+'_'+j+'" class="pile">'+value+'<div>');
		setPilePos(node, i, j);
		node.css('top', (realRow * pileSize)+'px').css('left', (j * pileSize)+'px');
		node.data('realRow', realRow);
		node.data('hightLight', 0);
		setValue(node, value);
		P.append(node);
		return node;
	};
	forEach(function (i, j) {
		$pile = makePile(i, j, i);
		console.log(i, j, '=>', $pile.data('value'));
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
			var isHightLight = neighber.data('hightLight');
			var neighberValue = neighber.data('value');
			if (!isHightLight && neighberValue === value) {
				hightLight(neighber);
			}
		};
	};
	var getByPos = function (i, j) {
		var p = $('#D_'+i+'_'+j);
		return p;
	}
	var prepareFill = function  () {
		// for every col
		var fallPos;
		for (var j = 0; j < pileCount; j++) {
			var i;
			var r = pileCount - 1; // real i
			for (i = pileCount - 1; i >= 0; i--) {
				var $pile = getByPos(i, j);
				var length = $pile.length;
				if (length === 0) {
				} else {
					setPilePos($pile, r, j);
					r--;
				}
			}
			var realRow = -1;
			for (; r >= 0; r--) {
				makePile(r, j, realRow);
				realRow--;
			};
		};
	};
	var fall = function  () {
		// for every col
		for (var j = 0; j < pileCount; j++) {
			var i;
			for (i = pileCount - 1; i >= 0; i--) {
				var $pile = getByPos(i, j);
				if ($pile.data('realRow') !== i) {
					// we fall
					$pile.animate({top: ((i)*pileSize)+'px'}, 'slow');
				};
			}
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
					prepareFill();
					fall();
				}
			});
			p.data('hightLight', 0);
		};
	};
	$('.pile').click(function (e) {
		var $this = $(this);
		console.log('this.length', $this.length);
		if (!$this.data('hightLight')) {
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
