export const arrayToObject = (array: object[], keyField: string) =>
  array.reduce((obj: any, item: any) => {
    obj[item[keyField]] = item;
    return obj;
  }, {});
