import * as moment from 'moment';

const formatPunishStartTimeTng = (createdAt, expectedTenure) => {
  if (!createdAt) {
    return 'N/A';
  }

  const createdDate = new Date(createdAt);
  return (
    '00h Ngày ' +
    moment(createdDate)
      .add(parseInt(expectedTenure) + 1, 'days')
      .format('DD/MM/YYYY')
  );
};

export default formatPunishStartTimeTng;
