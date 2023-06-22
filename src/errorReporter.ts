class ErrorReporter {
  constructor() {};

  public withError: boolean = false;

  public report(line: number, message: string) {
    console.log(`[line ${line}] Error: ${message}`);

    this.withError = true
  }
}

export default new ErrorReporter();
