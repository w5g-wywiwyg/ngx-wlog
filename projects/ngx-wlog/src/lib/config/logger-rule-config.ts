import {LogLevel} from './log-level.enum';

/**
 * Represents the configuration for a logger rule.
 */
export interface LoggerRuleConfig {

    /**
     * The name of logged loggers. It can be a regular expression. This is finally
     * a filter. If name of logger match this value, log will be embedded.
     */
    name: string;

    /**
     * Represents the target destination of logs. This must be a string that contains name(s) of
     * targets.
     * The list of target can be separated by comma, semicolon or pipe char.
     * Ex: 'console;remote'
     */
    writeTo: string;

    /**
     * Represents the status of activity.
     */
    active?: boolean;

    /**
     * The minimum log level allowed.
     */
    minLevel?: LogLevel;

    /**
     * The maximum log level allowed.
     */
    maxLevel?: LogLevel;
}
