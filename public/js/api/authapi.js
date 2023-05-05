class AuthAPI {
  static url = "/api/auth";

  static logout() {
    sessionStorage.removeItem("usertype");
    document.cookie =
      "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.replace("/");
  }

  static async login(email, password) {
    let response = await Request.post(this.url, { email, password });
    return response;
  }

  static async checkLog() {
    let response = await Request.get(this.url);
    return response;
  }
}
