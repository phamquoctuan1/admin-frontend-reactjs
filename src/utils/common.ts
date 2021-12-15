
export const capitalizeString = (str: string) => {
  if (!str) return '';
  return `${str[0].toUpperCase()}${str.slice(1)}`;
};

export const numberWithCommas = (num: number | undefined) =>
  num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';

export const calculatorPromotePercentage = (
  num: number | undefined,
  discount_percentage: string | undefined
) => {
  if (num) {
    let price = parseInt(discount_percentage as string);
    let discount_price = num - num * (price / 100);
    return discount_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';
  }
};
export const calculatorPromoteAmount = (num: number, discount_amount: number) => {
  let discount_price = num - discount_amount;
  return discount_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';
};
