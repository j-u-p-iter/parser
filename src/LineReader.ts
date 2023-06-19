import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export class LineReader {
  private line;

  constructor() {
    this.line = createInterface({ 
      input, 
      output,
    });
  }

  readLine(): Promise<string> {
    return new Promise((resolve) => {
      this.line.on('line', (input: string) => {
        resolve(input)
      });
    });
  }
}
