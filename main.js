$(function () {
	var P = $('#P'); // the panel, container of all

	// color of text and background
	var colorMap = {
		1: ['rgb(50,245,82)', 'rgb(14, 97, 27)'],
		2: ['rgb(49, 149, 232)', 'rgb(0, 68, 176)'],
		3: ['rgb(226, 197, 0)', 'rgb(229, 86, 12)'],
		4: ['rgb(239, 94, 30)', 'rgb(255, 198, 173)'],
		5: ['rgb(73, 119, 41)', 'rgb(46, 234, 70)'],
		6: ['rgb(103, 13, 113)', 'rgb(226, 56, 253)'],
		7: ['rgb(173, 11, 122)', 'rgb(252, 168, 245)'],
		8: ['rgb(157, 13, 29)', 'rgb(245, 182, 182)'],
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

	// px of size of pile
	var _pileSize = Math.floor(($(document).width() - 2 * 5) / pileCount);
	var pileSize = _pileSize > 50 ? 50 : _pileSize;

	var jumpSize = Math.floor(pileSize / 10); 

	// set the number showed on the pile
	var setValue = function (node, value) {
		node.data('value', value);
		node.text(value);
		node.css('background-color', colorMap[value][0]);
		node.css('color', colorMap[value][1]);
		node.width(pileSize).height(pileSize);
		node.css('font-size', Math.floor(pileSize * 0.6)+'px');
		node.css('line-height', pileSize + 'px');
		node.css('border-bottom-width', jumpSize + 'px');
	};

	// when pile fall, row No. change
	var setPilePos = function (node, i, j) {
		node.data('i', i);
		node.data('j', j);
		node.css('z-index', i);
		node.attr('id', 'D_'+i+'_'+j);
	};

	var changePos = function (array, attr, val) {
		array.map(function (e) {
			var old = parseInt(e.style[attr]);
			e.style[attr] = (old + val) + 'px';
		});
	};
	var onClick = function (e) {
		var $this = $(this);
		if (!$this.data('hightLight')) {
			if (highLighting.length > 0) {
				// if others are highlight-ing
				$(highLighting).data('hightLight', 0);
				changePos(highLighting, 'top', jumpSize);
			}
			highLighting = [];
			hightLight($this);
			changePos(highLighting, 'top', -jumpSize);
		} else {
			if (highLighting.length > 1) {
				collapse($this);
			};
		}
	};

	var gMaxValue = 0;

	var makePile = function (i, j, realRow, maxValue) {
		var value = Math.floor(Math.random() * maxValue + 1);
		if (value > gMaxValue) {
			gMaxValue = value;
		};
		var node = $('<div id="D_'+i+'_'+j+'" class="pile">'+value+'<div>');
		setPilePos(node, i, j);
		node.css('top', (realRow * pileSize)+'px').css('left', (j * pileSize)+'px');
		node.data('realRow', realRow);
		node.data('hightLight', 0);
		setValue(node, value);
		node.on('click', onClick);
		P.append(node);
		return node;
	};
	forEach(function (i, j) {
		$pile = makePile(i, j, i, 3);
	});

	var highLighting = [];
	var hightLight = function ($pile) {
		$pile.data('hightLight', 1);
		highLighting.push($pile[0]);
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
				makePile(r, j, realRow, gMaxValue);
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
	var animate = function (time, callback, after) {
		var startTime = Date.now();
		var endTime = startTime + time;
		var func = function () {
			var timeLeft = endTime - Date.now();
			if (timeLeft < 0) {
				after();
				console.log('cancel');
				return;
			};
			var leftFrameCount = Math.floor(timeLeft / (1000/60)); // left frame count
			callback(leftFrameCount);
			var id = requestAnimationFrame(func);
			console.log('every frame', id);
		};
		requestAnimationFrame(func);
	}
	var collapse = function ($pile) {
		var x = $pile.data('i');
		var y = $pile.data('j');
		var value = $pile.data('value');
		if (value + 1 > gMaxValue) {
			gMaxValue = value + 1;
		};
		var endPos = {top: (x * pileSize), left: (y * pileSize)};
		animate(300, function (leftFrameCount) {
			highLighting.map(function(e) {
				['top', 'left'].map(function(attr) {
					var val = parseInt(e.style[attr]);
					var distance = (endPos[attr] - val);
					var step = Math.floor(distance / leftFrameCount);
					e.style[attr] = (val + step) + 'px';
				});
			});
		}, function() {
			console.log('animate callback', value);
			var p;
			for (var i = highLighting.length - 1; i >= 0; i--) {
				p = $(highLighting[i]);
				if (i) {
					p.remove();
				} else {
					p.data('hightLight', 0);
					setValue(p, value+1);
					setPilePos(p, x, y);
				}
			};

			highLighting = [];

			console.log('last one, we fall', value);
			prepareFill();
			fall();
		});
	};
});
