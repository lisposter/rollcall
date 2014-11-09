var _ = require('lodash');

var pkg = require('./package.json');

var namelist = [];
var passnames = [];
var interval;
var options = {
  bypass: true
};

var btn = document.getElementById("roll");
var container = document.getElementById('container');

/**
 * add message to message board
 * @param {string} msg  message to show
 * @param {string} type message type
 */
function addMsg(msg, type) {
  var msgBoard = $('#message');
  if (type) {
    msgBoard.attr('class', 'bg-' + type);
  }
  msgBoard.text(msg).css('z-index', 1000).siblings().css('z-index', 900);
}

/**
 * show roll result
 * @param  {string} result result to show
 */
function showResult(result) {
  var resultBoard = $('#result');
  resultBoard.text(result).css('z-index', 1000).siblings().css('z-index', 900);
}

window.ondragover = function(e) {
  e.preventDefault();
  return false;
};
window.ondrop = function(e) {
  e.preventDefault();
  return false;
};

container.ondragover = function() {
  this.className = 'hover';
  return false;
};
container.ondragend = function() {
  this.className = '';
  return false;
};
container.ondrop = function(e) {
  this.className = '';
  e.preventDefault();
  var file = e.dataTransfer.files[0];

  var reader = new FileReader();

  reader.onload = function(e) {
    var names = e.target.result.split(/[\r\n]+/g).filter(function(itm) {
      return itm.length > 0;
    });
    namelist = _.shuffle(names);
    addMsg('Ready!', 'info');
  };

  reader.readAsText(file, "GBK");

  return false;
};

function roll() {
  if(namelist.length <= 0) {
    addMsg('Please drag namelist file here!', 'warning');
    return;
  }

  if(interval) {
    passnames.push($('#result').text());
    clearInterval(interval);
    interval = null;
    btn.innerHTML = "Roll!";
    return;
  }

  interval =  setInterval(function() {
    var _temp = [];
    if (options.bypass) {
      _temp = namelist.slice(0);
      _temp = _temp.filter(function(itm) {
        return passnames.indexOf(itm) < 0;
      });
    } else {
      _temp = namelist;
    }
    if (_temp.length <= 1) {
      addMsg('Please Reset!', 'warning');
      clearInterval(interval);
      return false;
    }
    var shuffled = _.shuffle(_temp)[0];
    showResult(shuffled);
  }, 30);

  btn.innerHTML = "Pause";
  $('#roll').blur();
}

function reset() {
  passnames = [];
  if(interval) {
    clearInterval(interval);
    interval = null;
  }
  btn.innerHTML = "Roll!";
  addMsg('Ready!', 'info');
  $('#reset').blur();
}

$('#roll').click(roll);
$('#reset').click(reset);

$('body').keydown(function(e) {
  if (e.which === 32) {
    roll();
  } else if (e.which === 13) {
    reset();
  }
});


function handlePrefs() {
  if(options.bypass === true) {
    $('.drawer #ipt-bypass').attr('checked', true);
  }
}

$('.drawer-handle').click(function() {
  handlePrefs();
  $('.drawer').toggleClass('open');
});

$('#container').click(function() {
  if ($('.drawer').hasClass('open')) {
    $('.drawer').removeClass('open');
  }
});

$('.drawer #ipt-bypass').change(function() {
  options.bypass = $(this).is(':checked');
  if (options.bypass === false) {
    passnames = [];
  }
});

$('.drawer .version').text('v' + pkg.version);


$(function() {
  addMsg('Drag namelist here to start', 'info');
});
