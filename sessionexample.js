// When the user logs in, store their login information in session storage
sessionStorage.setItem('username', 'johndoe');
sessionStorage.setItem('isLoggedIn', true);
// Create a cookie that contains a unique identifier for the user's session
function setSessionCookie(sessionId, expires) {
  document.cookie = `sessionId=${sessionId}; expires=${expires}`;
}
// Set the cookie's expiration time to a value that determines how long the session should stay active
const expirationDate = new Date();
expirationDate.setDate(expirationDate.getDate() + 7); // Expires in 7 days
setSessionCookie('abc123', expirationDate.toUTCString());
// When the user makes subsequent requests to the server, include the session identifier in the request headers
const sessionId = document.cookie.split('; ').find(row => row.startsWith('sessionId=')).split('=')[1];
fetch('/api/data', {
  headers: { 'Authorization': `Bearer ${sessionId}` }
}).then(response => {
  // Handle response
});
// When the user logs out, delete the session identifier cookie and clear the login information from session storage
document.cookie = 'sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
sessionStorage.clear();