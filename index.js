#!/usr/bin/env node
const chalk = require("chalk");
const debounce = require("lodash.debounce");
const chokidar = require("chokidar");
const program = require("caporal");
const fs = require('fs');
const {spawn} = require('child_process');

chalk.enabled = true;
chalk.level= 3;


program 
.version("0.0.1")
.argument('[filename]', 'Name of a file to execute')
.action(async ( { filename }) => {
    const name = filename || 'index.js';
    
    try{
    await fs.promises.access(name);
    } catch (err) {
        throw new Error(`Could not find the file ${name}` );

    }
  
    // proc will allow the start function to kill any instances of the program running
    let proc;
  // waits for all files to be "added" by chokidar 100ms
  const start = debounce(() => {
    if (proc) {
        proc.kill();
    }
    console.log(chalk.blue('>>>>Starting process....'));
    // stdio = inherit allows child comms back up to parent program/terminal
    proc = spawn('node', [name], {stdio: 'inherit'});
  }, 100);

  // detects any file changes added (also initial opening), changed, deleted
  chokidar
    .watch(".")
    .on("add", start)
    .on("change", start)
    .on("unlink", start);
});

program.parse(process.argv);


