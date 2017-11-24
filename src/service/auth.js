/*
function formEncode(data) {
  const pairs = [];
  for (const name in data) {
    if (data.hasOwnProperty(name)) {
      pairs.push(`${encodeURIComponent(name)}=${encodeURIComponent(data[name])}`);
    }
  }
  const encode = pairs.join('&').replace(/%20/g, '+');
  return encode;
}
*/
function authOptions(username, password) {
  return {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formEncode({
      username,
      password,
      grant_type: 'password',
    }),
  };
}

export default authOptions;
