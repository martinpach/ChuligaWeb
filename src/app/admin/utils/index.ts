export const addAttributeToIframe = (html: string, attribute: string): string => {
  const iframePosition = html.indexOf('iframe');
  if (iframePosition < 0) return html;
  const position = iframePosition + 6;

  return [html.slice(0, position), attribute, html.slice(position)].join('');
};
