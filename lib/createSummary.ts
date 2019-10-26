import * as chalk from 'chalk'

// 分割代入のために、interfaceを定義
interface testStatus {
  successCount: number;
  failureCount: number;
}

// TODO: fix chalk as any
export const createSuccessMessage = (successCount: Number): string =>
  (chalk as any).green(`${successCount} test passed\n`)

export const createFailureMessage = (failureCount: Number): string =>
  (chalk as any).red(`${failureCount} tests failed\n`)

export const createSummary = ({ successCount, failureCount }: testStatus): string =>
  failureCount > 0
    ? createFailureMessage(failureCount)
    : createSuccessMessage(successCount)
