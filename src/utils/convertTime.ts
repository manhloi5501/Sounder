const convertTime = (totalSecond: number) => {
  if (!totalSecond) {
    return '';
  }
  let minute = Math.floor(totalSecond / 60);
  let second = Math.floor(totalSecond - minute * 60);
  // console.log(totalSecond, minute, second);
  const result = `${minute}:${second < 10 ? `0${second}` : second}`;
  return result;
};

export default convertTime;
