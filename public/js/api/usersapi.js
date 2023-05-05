class UsersAPI {
  static urlBase = "/api/users";

  static async getUsers(uid, name, lastname, email, usertype, group) {
    let url = this.urlBase;
    let querys = [];
    if (uid != null) querys.push(`uid=${uid}`);
    if (name != null) querys.push(`name=${name}`);
    if (lastname != null) querys.push(`lastname=${lastname}`);
    if (email != null) querys.push(`email=${email}`);
    if (usertype != null) querys.push(`usertype=${usertype}`);
    if (group != null) querys.push(`group=${group}`);

    if (querys.length > 0) url += `?${querys.join("&")}`;

    return await Request.get(url);
  }

  static async getUser(id) {
    let url = this.urlBase + `/${id}`;
    return await Request.get(url);
  }

  static async createUser(user) {
    let url = this.urlBase;
    return await Request.post(url, user);
  }

  static async updateUser(id, user) {
    let url = this.urlBase + `/${id}`;
    return await Request.put(url, user);
  }

  static async deleteUser(id) {
    let url = this.urlBase + `/${id}`;
    return await Request.delete(url);
  }
}
