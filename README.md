# rollcall
A simple rollcall app based on nw.js (node-webkit).

> **Note:**
> I just have made it work, the code is messy now.

## How to run?
### Mac:

1\. clone this repo.

```sh
$ git clone git@github.com:lisposter/rollcall.git
```

2\. install node-modules

```sh
$ cd /path/to/rollcall
$ npm i
```

3\. run with nw.js

```
$ /path/to/nw/nwjs.app/Contents/MacOS/nwjs /path/to/this/repo
```


## How to use?
1\. drag and drop a text file contains names of others(one item per line) into app's window.

2\. click 'Roll!' key button to shuffle, and click 'Pause' button to pick up one or just press the space to toggle. The 'Reset'/ enter key is for reset the bypass.

## Options

* `Bypass`, if this is `true`, the names which has been called will be ignored next calling.
* `Language`, currently, there are two languages avaliable: `English`, `简体中文`.

## License
MIT @ [Leigh Zhu](http://zhu.li)
