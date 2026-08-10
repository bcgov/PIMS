export const isDateTodayOrEarlier = (inputDate: Date): boolean => {
  // Get today's date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get the input date at midnight
  const inputDateAtMidnight = new Date(inputDate);
  inputDateAtMidnight.setHours(0, 0, 0, 0);

  // Compare the dates. The <= operator checks if the input date is less than or equal to today's date (at midnight).
  return inputDateAtMidnight <= today;
};
