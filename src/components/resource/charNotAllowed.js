export default function charNotAllowed(toControl) {
  const re = /^[a-zA-Z0-9._-]+$/;
  return !re.test(toControl);
}
