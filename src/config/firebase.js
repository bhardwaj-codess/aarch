const admin = require('firebase-admin');

const serviceAccount = {
  type: "service_account",
  project_id: "aarc-stage",
  private_key_id: "b58f5215f922f6e97c6812019c31e424bbabdc44",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQDcwjYKAN4GmyVB\n0W9gONPUft2Jn7PHZfAX/7XPbUJfLGG4YA4qeAHM6O6PfD97jTJzfKb+ujEtywHc\nPc5tT6d68OZlvlhxZwulFfssZZNwty1pB7mCbFrU/2WFSXXeywRLjrA25ugokMTY\nsauI3Yn2zva539T2ktlCWSX+Nkv+go7JhmzNGytnyyr6pvyD1zpWwRvwax7PL5RY\nF3IaTq4BXv0EWrgs4ZAwIiM1VfBzGmKujIGWPS3C4f3Chh6ixczrAQMySBX8OCyo\n00sGfVEsOAp0i1obWleyXrDAz1ywpkCVpGhzzmAj9LYIce7mXpbshuKyTzrYsUDc\n7KVvjIwPAgMBAAECgf9f4IARDgwBZrEswxM3HDPWe13kiWOfZXdTsZmO741j8M5l\nMQHNmHm2cNI4z+zCVyt9/NSKYVM99UTS1RKIPrh3s154IqXNjUsO5+IabNrLVgZ3\nFztYzraJbR9FUZuVmgJys2ROIxYCHHIeZ3d9h0DWs7uPQhnW/UEbKretFb9yVrYH\nQ5EmI9jpxdDpP1deWqVU5IFNMAPAX6wr6fOpDIn6L820DOIYjFM6IANW2U9oiUeF\nMFpT5I6bDlT2uHsmTyM7npvqrd991mGStEwPFkFYK97kUnd0FYZiV8oNxqi9kRsj\ntKyA5zN5tXXZGcIFaOdAEYyHy70T0TriBwcJgT0CgYEA/kKz1z5TUKTtZvBpaMO0\n3SJZ2pJPWUxuzdVncH1mY1yUPQc5qpp91C/mW6p7BxsPxZXf/7tUq8cyYambR7po\nz/bmGsjUnHXXHFBeUZF1UqPYZqFhyEocd42mUkjN3Y5LxZTIlWuYPOfjePFeKNDu\nfmlSawvZ6jz6xMuUmEUK69MCgYEA3kTV0YBts9wo2z9avxwGs3vfqd2S9F4MkaGC\n8e44POO2OrKihSVsCRtAQXl69CSW0JckKkMLjX/CDVvAEVBWRHnnxNJWkmYF/BJW\nXyFB7HPhejwG35anal2d+dJCJHNzQJpJQjiB85YSWyJEfOldfHvgpYhWhU/YMWHD\nJDlWZVUCgYBe4nOMqsSavsGdfbBImWhAcdZIW/tinsRm6fGtKA7ym5TyZWTexsKY\nUbvMj4VT9IRhPvoVzEnfxPmHOq0pCmac3U2nxzSYot1AwrlABWFcEqrqOeVswkN3\nVhQwdtzkhnq+ZDSqljl82SipdKGn57ho0lMggY6z/Ee08ygj3vghYwKBgFbp/d5l\nZQBu9778ICUY9Xnb15MZ5KwP1sRfrs+hwnX06T48uhZskrlg4Zh4w16SrDK211p7\nSxoyuhP1K77ZdlJihQHO6jFnGbH/Da03WQr4KVReAqYNyDtsjiixUlHkn03Exx7Q\n7+fraBQg6z0ZGAhkfGzeSk7o8PYmb2NL1H/dAoGBAN4WPY2f2TJsAN5I7TKeKrTy\niCvFzPycU5n0AOFCGUnHF6I3M82PcSKjX6kFus9+BYx9cqz/hg17iBJ+oJ496MOZ\nkDUS1b6QCSOkSCRDHZYFO/11SZ628+ZeAwZniDwtQtJjGJ5FbK2ovO0vQkqChuwW\n9LmQ5rxzJFEYX4ZcONSI\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@aarc-stage.iam.gserviceaccount.com",
  client_id: "107537259968145908808",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40aarc-stage.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

module.exports = { admin };
