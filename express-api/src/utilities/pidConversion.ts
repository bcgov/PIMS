export const pidStringToNumber = (pid: string) => {
  return parseInt(pid.trim().replace('-', ''));
};

export const pidNumbertoString = (pid: number) => {
  const pidArray = `${pid}`.split('');
  if (pidArray.length > 9) {
    throw new Error('PID length too long. Maximum 9 digits.');
  }
  while (pidArray.length < 9) {
    pidArray.unshift('0');
  }
  let result = '';
  pidArray.reverse().forEach((letter: string, index: number) => {
    if (index % 3 === 0) {
      result += '-';
    }
    result += letter;
  })
  return result;
}
