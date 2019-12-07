import chalk from 'chalk'
const JsDiff = require('diff')

// warning!
// t.deepEqual() tests attribute order while prettyDiff() does not
export const deepEqual = (t: any, actual: any, expected: any): void => {
  t.deepEqual(actual, expected, prettyDiff(actual, expected));
}

export const prettyDiff = (actual: any, expected: any): string => {
  const diff = JsDiff.diffJson(expected, actual).map((part: any) => {
    if (part.added) return chalk.green(part.value.replace(/.+/g, '    - $&'));
    if (part.removed) return chalk.red(part.value.replace(/.+/g, '    + $&'));
    return chalk.gray(part.value.replace(/.+/g, '    | $&'));
  }).join('');
  return `\n${diff}\n`;
}