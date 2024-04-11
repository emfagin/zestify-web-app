async function authenticateUser(req, res, title, allowClerk, allowVisit) {
  let authorizeAccess = false;
  if (req.session && req.session.user) { // if session exists (user signed in)
    if (req.session.user.isClerk ^ allowClerk) { // if signed in as clerk && !clerk, or if customer and clerk cant access
      msg = `Hi ${req.session.user.firstName}, you are not authorized to access this page.`;
      displayError(res, title, msg, 403, "Forbidden");
    } else { // allowed to access it - either customer or clerk
        authorizeAccess = true;
    }
  } else { // if not signed in
    if (allowVisit){
      authorizeAccess = true;
    }
    else{
      displayError(res, title, "Please login to access this page.", 401, "Unauthorized", "Login", "/log-in");
    }
  }
return authorizeAccess;
};

function displayError(res, title, message, errorCode, errorDesc, buttonText, buttonUrl){
  res.status(errorCode).render("general/message", {
    title: errorCode === 200 ? title : `Error: ${title}`,
    message: message,
    errorCode: errorCode,
    errorDesc: errorDesc,
    buttonText: buttonText,
    buttonUrl: buttonUrl
  })
}
const displayError500 = (res, title, message) => displayError(res, title, message, 500, "Internal Server Error");
const displayError404 = (res, title, message) => displayError(res, title, message, 404, "Not Found");

module.exports = {authenticateUser, displayError, displayError500, displayError404 };