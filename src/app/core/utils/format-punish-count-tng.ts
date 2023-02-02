import * as moment from 'moment';

const formatPunishCountTng = (createdAt, expectedTenure) => {
  if (!createdAt) {
    return 'N/A';
  }
  const createdDate = new Date(createdAt);
  const dueDate = moment(createdDate).add(parseInt(expectedTenure) + 1, 'days');
  const today = new Date();
  const overdueDateCount = moment(today).diff(dueDate, 'days');
  if (overdueDateCount < 0) {
    return 'N/A';
  } else {
    return overdueDateCount;
  }
};

export default formatPunishCountTng;
