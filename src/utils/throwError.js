export const throwError = (res, err, status, messageError) => {
  console.log(err);

  res.status(status).json({
    message: messageError,
  });
}
