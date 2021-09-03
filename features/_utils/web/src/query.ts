export const parseQuery = (queryString: string): { [key: string]: undefined | string } => {
  const query = {} as { [key: string]: string };
  const pairs = (queryString[0] === `?` ? queryString.substr(1) : queryString).split(`&`);
  for (const element of pairs) {
    const pair = element.split(`=`);
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || ``);
  }
  return query;
};
