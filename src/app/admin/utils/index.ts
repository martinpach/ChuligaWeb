export const addAttributeToIframe = (html: string, attribute: string): string => {
  const position = html.indexOf('iframe') + 6;

  return [html.slice(0, position), attribute, html.slice(position)].join('');
};
