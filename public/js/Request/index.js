class Request {
  static async post(url, body = {}) {
    let response = null;
    try {
      let userToken = document.cookie.replace(
        /(?:(?:^|.*;\s*)userToken\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      response = await fetch(url, {
        method: "POST",
        headers: {
          "x-auth": userToken ?? "",
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });
    } catch (e) {
      console.error(e);
    }
    return response;
  }

  static async get(url) {
    let response = null;
    try {
      let userToken = document.cookie.replace(
        /(?:(?:^|.*;\s*)userToken\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      response = await fetch(url, {
        method: "GET",
        headers: {
          "x-auth": userToken ?? "",
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      console.error(e);
    }
    return response;
  }

  static async put(url, body = {}) {
    let response = null;
    try {
      let userToken = document.cookie.replace(
        /(?:(?:^|.*;\s*)userToken\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      response = await fetch(url, {
        method: "PUT",
        headers: {
          "x-auth": userToken ?? "",
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });
    } catch (e) {
      console.error(e);
    }
    return response;
  }

  static async delete(url, body = {}) {
    let response = null;
    try {
      let userToken = document.cookie.replace(
        /(?:(?:^|.*;\s*)userToken\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      response = await fetch(url, {
        method: "DELETE",
        headers: {
          "x-auth": userToken ?? "",
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });
    } catch (e) {
      console.error(e);
    }
    return response;
  }
}
