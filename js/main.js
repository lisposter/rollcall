var _ = require('lodash');
var fs = require('fs');

var pkg = require('./package.json');
var config = require('./config.json');

if (!config || !config.locale) {
  config.locale = 'default';
}

var i18n = require('./i18n/' + config.locale + '.json');

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
    addMsg(i18n.ready, 'info');
  };

  reader.readAsText(file, "GBK");

  return false;
};

function roll() {
  if(namelist.length <= 0) {
    addMsg(i18n.nofile, 'warning');
    return;
  }

  if(interval) {
    passnames.push($('#result').text());
    clearInterval(interval);
    interval = null;
    btn.innerHTML = i18n.btn_roll;
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
      addMsg(i18n.tip_reset, 'warning');
      clearInterval(interval);
      return false;
    }
    var shuffled = _.shuffle(_temp)[0];
    showResult(shuffled);
  }, 30);

  btn.innerHTML = i18n.btn_pause;
  $('#roll').blur();
}

function reset() {
  passnames = [];
  if(interval) {
    clearInterval(interval);
    interval = null;
  }
  btn.innerHTML = i18n.btn_roll;
  addMsg(i18n.ready, 'info');
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

$('.drawer #select-i18n').change(function() {
  console.log($(this).val());
  config.locale = $(this).val();
  updateConfig(config);
  i18n = require('./i18n/' + config.locale + '.json');
  console.log(i18n);
});

$('.drawer .version').text('v' + pkg.version);


$(function() {
  addMsg(i18n.splash, 'info');

  $('[data-i18n]').toArray().forEach(function(elm) {
    $(elm).text(i18n[$(elm).attr('data-i18n')]);
  });
});


function updateConfig(config) {
  fs.writeFileSync('./config.json', JSON.stringify(config));
}
