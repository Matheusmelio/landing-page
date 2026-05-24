export function errorHandler(err, _req, res, _next) {
  const status = err.status ?? err.statusCode ?? 500
  const message = err.message ?? 'Erro interno do servidor'

  if (status >= 500) {
    console.error('[motstart-api]', err)
  }

  res.status(status).json({
    ok: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && err.details ? { details: err.details } : {}),
  })
}
