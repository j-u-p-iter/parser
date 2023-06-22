import { Tokenizer } from './Tokenizer';
import { Parser } from './Parser';
import { readFile } from 'node:fs/promises';
import { LineReader } from './LineReader';

export class JScript {
  private lineReader: LineReader;

  constructor() {
    this.lineReader = new LineReader();
  }

  async main(args: string[]) {
    if (args.length > 1) {
      console.log('Usage: script [script]');

      process.exit(1);
    } else {
      try {
        if (args.length === 1) {
          await this.runFile(args[0]);
        } else {
          await this.runPrompt();
        }
      } catch(error) {
        console.error(error);
        process.exit(1);
      }
    }
  }

  async runFile(filePath: string) {
    let fileContent;

    try {
      fileContent = await readFile(filePath, { encoding: 'utf8' }); 
    } catch(error) {
      throw new Error(`There is no such a file: ${filePath}`);
    }

    this.runScript(fileContent);
  };

  async runPrompt() {
    const script = await this.lineReader.readLine();

    this.runScript(script);

    await this.runPrompt();
  }

  runScript(script: string) {
    const tokenizer = new Tokenizer();

    tokenizer.init(script);

    console.log('All tokens:', tokenizer.getAllTokens());
  }
}

