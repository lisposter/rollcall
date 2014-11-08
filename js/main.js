var fs = require('fs');
var _ = require('lodash');

var namelist = [];
var passnames = [];
var interval;
var options = {
  bypass: true
};

var btn = document.getElementById("roll");
var container = document.getElementById('container');

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
    container.innerHTML = 'Ready!';
  };

  reader.readAsText(file, "GBK");

  return false;
};

function roll() {
  if(namelist.length <= 0) {
    container.innerHTML = 'Please drag namelist file here!';
    return;
  }

  if(interval) {
    passnames.push(container.innerHTML);
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
      container.innerHTML = 'Please Reset!';
      clearInterval(interval);
      return false;
    }
    var shuffled = _.shuffle(_temp)[0];
    container.innerHTML = shuffled;
  }, 10);

  btn.innerHTML = "Pause";
}

function reset() {
  passnames = [];
  if(interval) {
    clearInterval(interval);
    interval = null;
  }
  btn.innerHTML = "Roll!";
  container.innerHTML = 'Ready!';
}

$('#roll').click(roll);
$('#reset').click(reset);

$('body').keydown(function(e) {
  if (e.which === 32) {
    roll();
  }

  if (e.which === 13) {
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

$('.drawer #ipt-bypass').change(function() {
  options.bypass = $(this).is(':checked');
  if (options.bypass === false) {
    passnames = [];
  }
});
