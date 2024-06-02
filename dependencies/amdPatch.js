const { readFileSync, writeFileSync } = require("fs");

const path = "./linpack/linpack_xeon64.exe";
const buffer = readFileSync(path);

buffer[0x474] = 0xb8;
buffer[0x475] = 0x01;
buffer[0x476] = 0x00;

writeFileSync(path, buffer);
