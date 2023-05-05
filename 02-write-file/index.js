const fs = require('fs');
const path = require('node:path');
const readline = require('node:readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let wStream = fs.createWriteStream((path.join(__dirname, '/text.txt')), {
  flags: 'w'
});

console.log('Привет! Поскорее вводи свои данные, чтобы я мог их запомнить:');

rl.on('line', (input) => {
  if (input === 'exit') {
    console.log('Я записал все ваши изменения. Прощайте!');
    wStream.end();
    rl.close();
  } else {
    wStream.write(input + '\n');
  }
});

rl.on('SIGINT', () => {
  console.log('\n'+'Я записал все ваши изменения. Прощайте!');
  wStream.end();
  rl.close();
});

