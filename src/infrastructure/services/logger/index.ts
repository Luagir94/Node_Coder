import { createLogger, format, type Logger, transports } from 'winston'

const { combine, timestamp, label, printf, colorize } = format

export class LoggerService {
    private static readonly logger: Logger = createLogger({
        transports: [new transports.Console()],
        format: combine(
            colorize(),
            label({ label: 'LOG' }),
            timestamp({
                format: 'DD-MM-YYYY HH:mm:ss',
            }),
            LoggerService.myFormat()
        ),
    })

    public static info(message: string): void {
        this.logger.info(message)
    }

    public static error(message: string): void {
        this.logger.error(message)
    }

    public static warn(message: string): void {
        this.logger.warn(message)
    }

    private static myFormat() {
        return printf(({ level, message, label, timestamp }) => {
            return `${timestamp} [${label}] ${level}: ${message}`
        })
    }
}
