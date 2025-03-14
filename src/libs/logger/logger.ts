import pino from 'pino'

const logger = pino({
  level: import.meta.env.VITE_LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'UTC:yyyy-mm-dd HH:MM:ss',
      ignore: 'pid,hostname',
    },
  },
})

export const createLogger = (service: string) => {
  return logger.child({ service })
}

export default logger
