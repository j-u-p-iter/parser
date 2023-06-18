#!/usr/bin/env node

import { JScript } from '../dist/JScript.js';

const jScript = new JScript();

jScript.main(process.argv.slice(2));
