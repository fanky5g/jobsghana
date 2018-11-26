import moment from 'moment';

export function displayDate(intDate, format) {
  if (format && typeof format == 'string') {
    return moment(intDate, 'YYYYMMDD').format(format);
  }
  return moment(intDate, 'YYYYMMDD').format('MMMM DD, YYYY');
}

export function currentDate() {
  return parseInt(moment().format('YYYYMMDD'), 10);
}