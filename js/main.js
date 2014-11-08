var fs = require('fs');
var _ = require('lodash');

var namelist;
var interal;
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


btn.onclick = function() {
    if(namelist.length <= 0) {
        container.innerHTML = 'Please drag namelist file here!';
        return;
    }

    if(interal) {
        clearInterval(interal);
        interal = null;
        btn.innerHTML = "Roll!";
        return;
    }

    interal =  setInterval(function() {
        var shuffled = _.shuffle(namelist);
        container.innerHTML = shuffled[0];
    }, 10);

    btn.innerHTML = "Pause";
};
