const httpStatus = require("./httpStatusCode");

class NewError {
  constructor(
    httpStatusCode = httpStatus.OK,
    subject = "Operation success",
    message = "OK",
    content = {},
    details = ""
  ) {
    (this.status = httpStatusCode),
      (this.subject = subject),
      (this.message = message),
      (this.content = content);
    this.details = details;
  }
}

module.exports = NewError;
