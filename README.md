# AltSpire
Angular, Polymer, NodeJs

## Current News
### Converting to Gitlab ###

Of course, you can just clone again but you don't have to. You can
do the following to point your local repository to a new place in space.

```
cd existing_repo
git remote remove origin
git remote add gitlab git@gitlab.com:OldProgrammer.io/PepsiCo/altspire.git
```

## Globals
NodeJS version >8
```
npm install bower -g
npm install yarn
```
 
## Installing:

1. Client Side - Install
```
client$ yarn install
client$ bower install
server$ yarn install
```

2. When you work
folderName$, this means change to the foldername

```
Client$ ng serve

Client$ gulp    (syncs universal folder to server)

Server$ gulp serve
```

3. Changing Environments
The altspire can run with the altspire server or with the SpirePlus web server.

This is for AltSpire Client and AltSpire Server
```
client$ gulp setenv --env=altspire
```

This is for AltSpire Client and SpirePlus Server.  With this configuration
you need to have the C# SpirePlus application running.
```
client$ gulp setenv --env=spireplus
```


4. Debugging
In WebStorm, create a configuration, call it `Attach` using the 
```
Chromium Remote, port 41234
```
When using `gulp serve` on the server, you can attach __AFTER__ the server starts. Note that with `gulp serve` you cannot debug 
up code.

Use `gulp serve:debug` to start the server and the app will pause before running and __WAIT__ for the attach.  You then attach with
Webstorm and you can debug through the startup code.

## For those on Mac 
AltSpire/Server NPM Install now 
requires XCODE command line tools, node-gyp, and python 2.7 (already installed)

https://developer.apple.com/download/
https://www.python.org/downloads/release/python-2715/
http://osxdaily.com/2014/02/12/install-command-line-tools-mac-os-x/

```
$ xcode-select --install
$ npm install -g node-gyp
```

