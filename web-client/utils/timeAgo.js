import moment from 'moment'

export default (time) => {
  const datetime = typeof time === 'string' ? moment(time) : time
  return moment(datetime, 'ddd MMM DD YYYY HH:mm:ss GMT Z').fromNow()
}
