class ErrorReporter {
  constructor() {};

  public withError: boolean = false;

  public report(line: number, where: string, message: string) {
    console.log(`[line ${line}] Error ${where}: ${message}`);

    this.withError = true
  }
}

export default new ErrorReporter();
