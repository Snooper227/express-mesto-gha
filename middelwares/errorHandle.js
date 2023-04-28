function errorHandle(req, res, err) {
  const { statusCode = 500 } = err;
  let { message } = err;

  if (statusCode === 500) {
    message = 'Ошибка на сервере';
  }

  res.status(statusCode).send({ message });
}

module.exports = { errorHandle };
