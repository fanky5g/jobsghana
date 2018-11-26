export const readCookie = (name, cookies) => {
  const nameEQ = name + "=";
  let $cookie = cookies || document.cookie;
  if (!$cookie) return null;

  if (typeof $cookie === 'string') {
    const ca = $cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
  } else if (typeof $cookie === 'object' &&
    typeof $cookie.hasOwnProperty === 'function' &&
    $cookie.hasOwnProperty(name)) {
    return $cookie[name];
  }

  return null;
};