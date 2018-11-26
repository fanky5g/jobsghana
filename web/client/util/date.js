import moment from 'moment';

export function displayDate(intDate) {
  return moment(intDate, 'YYYYMMDDHHmmss').format('MMMM Do, YYYY');
}

export function currentDate() {
  return parseInt(moment().format('YYYYMMDD'), 10);
}
