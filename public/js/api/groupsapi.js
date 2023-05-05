class GroupsAPI {
  static urlBase = "/api/groups";

  static async getGroups(
    title = null,
    code = null,
    teacher = null,
    published = null
  ) {
    let url = this.urlBase;
    let querys = [];
    if (title != null) querys.push(`title=${title}`);
    if (code != null) querys.push(`code=${code}`);
    if (teacher != null) querys.push(`teacher=${teacher}`);
    if (published != null) querys.push(`published=${published}`);

    if (querys.length > 0) url += `?${querys.join("&")}`;

    return await Request.get(url);
  }

  static async createGroup(group) {
    let url = this.urlBase;
    return await Request.post(url, group);
  }

  static async getGroup(id) {
    let url = this.urlBase + "/" + id,
      response = await Request.get(url);
    return response;
  }

  static async updateGroup(id, group) {
    let url = this.urlBase + `/${id}`;
    return await Request.put(url, group);
  }

  static async deleteGroup(id) {
    let url = this.urlBase + `/${id}`;
    return await Request.delete(url);
  }

  static async closeGroup(id) {
    let url = this.urlBase + `/${id}/published`;
    return await Request.delete(url);
  }

  static async openGroup(id) {
    let url = this.urlBase + `/${id}/published`;
    return await Request.put(url);
  }

  static async getTeachers() {
    let url = "/api/users?usertype=2";
    return await Request.get(url);
  }
}
