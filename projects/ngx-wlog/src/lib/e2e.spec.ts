// noinspection DuplicatedCode

import {LoggerFactory} from './logger/logger-factory';
import {DEFAULT_WLOG_CONFIG, WlogConfig} from './config/wlog-config';
import {LogLevel} from './config/log-level.enum';
import {Appender} from './appenders/appender';
import {objectKeys} from 'codelyzer/util/objectKeys';

describe('NgxWlog', () => {

    it('should log', () => {
        LoggerFactory.reload(DEFAULT_WLOG_CONFIG);
        const log = LoggerFactory.createLogger('Test');
        log.trace('Trace');
        log.debug('Debug');
        log.info('Info');
        log.warn('Warn');
        log.error('Error');
        log.fatal('Fatal');
    });

    const appendedData: { [appender: string]: { level: LogLevel, data: any }[] } = {};

    class FakeAppender implements Appender {

        name: string;

        constructor(options: any) {
            this.name = options.name;
            appendedData[this.name] = [];
        }

        append(level: LogLevel, data: any): void {
            appendedData[this.name].push({level, data});
        }
    }

    describe('rules', () => {

        const config = {
            targets: [
                {
                    appender: FakeAppender,
                    name: 'fake',
                    options: {
                        name: 'fake-1'
                    }
                }
            ],
            rules: [
                {
                    name: '*',
                    minLevel: LogLevel.Info,
                    writeTo: 'fake'
                }
            ]
        } as WlogConfig;

        LoggerFactory.reload(config);

        beforeEach(() => {
            objectKeys(appendedData).forEach((key: string) => appendedData[key] = []);
        });

        it('should not log if rule is not active', () => {
            // Arrange
            config.rules[0].active = false;
            LoggerFactory.reload(config);
            const target = LoggerFactory.createLogger('SomeLog');

            // Act
            target.info('SomeMessage');

            // Assert
            expect(appendedData['fake-1'].length).toBe(0);
        });

        it('should not log if rule name filter not match', () => {
            // Arrange
            config.rules[0].name = 'unmatch regex';
            LoggerFactory.reload(config);
            const target = LoggerFactory.createLogger('SomeLog');

            // Act
            target.info('SomeMessage');

            // Assert
            expect(appendedData['fake-1'].length).toBe(0);
        });

        it('should not log if maxLevel is lower than log', () => {
            // Arrange
            config.rules[0].maxLevel = LogLevel.Debug;
            LoggerFactory.reload(config);
            const target = LoggerFactory.createLogger('SomeLog');

            // Act
            target.info('SomeMessage');

            // Assert
            expect(appendedData['fake-1'].length).toBe(0);
        });

        it('should not log if minLevel is greater than log', () => {
            // Arrange
            config.rules[0].minLevel = LogLevel.Warning;
            LoggerFactory.reload(config);
            const target = LoggerFactory.createLogger('SomeLog');

            // Act
            target.info('SomeMessage');

            // Assert
            expect(appendedData['fake-1'].length).toBe(0);
        });

        it('should not log if no writeTo is empty', () => {
            // Arrange
            config.rules[0].writeTo = '';
            LoggerFactory.reload(config);
            const target = LoggerFactory.createLogger('SomeLog');

            // Act
            target.info('SomeMessage');

            // Assert
            expect(appendedData['fake-1'].length).toBe(0);
        });

    });

    describe('targets', () => {

        const config = {
            targets: [
                {
                    appender: FakeAppender,
                    name: 'fake1',
                    options: {
                        name: 'fake-1'
                    }
                },
                {
                    appender: FakeAppender,
                    name: 'fake2',
                    options: {
                        name: 'fake-2'
                    }
                }
            ],
            rules: [
                {
                    name: '*',
                    minLevel: LogLevel.Info,
                    writeTo: 'fake1'
                }
            ]
        } as WlogConfig;

        LoggerFactory.reload(config);


        it('should use appender', () => {
            // Arrange
            const target = LoggerFactory.createLogger('SomeLog');

            // Act
            target.info('Test target');

            // Assert
            expect(appendedData['fake-1'][0].level).toEqual(LogLevel.Info);
        });
    });
});
