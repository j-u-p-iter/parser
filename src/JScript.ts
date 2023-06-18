import { Tokenizer } from './Tokenizer';
import { Parser } from './Parser';
import { readFile } from 'node:fs/promises';

export class JScript {
  async main(args: string[]) {
    if (args.length > 1) {
      console.log('Usage: script [script]')
      process.exit(1);
    } else {
      if (args.length === 1) {
        await this.runFile(args[0]);
      } else {
        this.runPrompt();
      }
    }
  }

  async runFile(filePath: string) {
    let fileContent;

    try {
      fileContent = await readFile(filePath, { encoding: 'utf8' }); 
    } catch(error) {
      console.error(`There is no such a file: ${filePath}`);
      process.exit(1);
    }

    this.runScript(fileContent);
  };

  runPrompt() {
    console.log('Running a prompt');
  }

  runScript(script: string) {
    const tokenizer = new Tokenizer();

    tokenizer.init(script);

    let nextToken = tokenizer.getNextToken();

    while(nextToken) {
      console.log(nextToken);
      nextToken = tokenizer.getNextToken();
    }
  }
}

