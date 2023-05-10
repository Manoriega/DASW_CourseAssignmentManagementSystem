class AssignmentsAPI {
  static urlBase = "/api/assignments";

  static async assignmentsToReview(groupId) {
    let url = this.urlBase + `/toreview/${groupId}`;
    return await Request.get(url);
  }

  static async teacherToReview(groupId) {
    let url = this.urlBase + `/toreview/teacher/${groupId}`;
    return await Request.get(url);
  }

  static async getMyAssignments(groupId, title, dateStart, dateEnd) {
    let querys = [];
    if (title) querys.push(`title=${title}`);
    if (dateStart) querys.push(`dateStart=${dateStart}`);
    if (dateEnd) querys.push(`dateEnd=${dateEnd}`);
    let url = this.urlBase + `/toDo/${groupId}`;
    if (querys.length > 0) url += `?${querys.join("&")}`;
    return await Request.get(url);
  }

  static async getMyAssignmentsDone(groupId) {
    let url = this.urlBase + `/done/${groupId}`;
    return await Request.get(url);
  }

  static async getAssignments(groupId, title, dateStart, dateEnd) {
    let querys = [];
    if (title) querys.push(`title=${title}`);
    if (dateStart) querys.push(`dateStart=${dateStart}`);
    if (dateEnd) querys.push(`dateEnd=${dateEnd}`);
    let url = this.urlBase + `/group/${groupId}`;
    if (querys.length > 0) url += `?${querys.join("&")}`;
    return await Request.get(url);
  }

  static async getAssignment(assignmentId) {
    let url = `${this.urlBase}/${assignmentId}`;
    return await Request.get(url);
  }

  static async createAssignment(assignment) {
    let url = this.urlBase;
    return await Request.post(url, assignment);
  }

  static async updateAssignment(id, assignment) {
    let url = `${this.urlBase}/${id}`;
    return await Request.put(url, assignment);
  }

  static async deleteAssignment(id) {
    let url = `${this.urlBase}/${id}`;
    return await Request.delete(url);
  }

  static async submitAssignment(assignmentId, submit) {
    let url = `${this.urlBase}/submit/${assignmentId}`;
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
        },
        enctype: "multipart/form-data",
        body: submit,
      });
    } catch (e) {
      console.error(e);
    }
    return response;
  }

  static async downloadAllEntries(assignmentId) {
    let url = `${this.urlBase}/download/all/${assignmentId}`;
    return await Request.get(url);
  }

  static async downloadEntry(entryId) {
    let url = `${this.urlBase}/download/${entryId}`;
    return await Request.get(url);
  }

  static async getAllEntries(assignmentId, studentDeliver, dateStart, dateEnd) {
    let querys = [];
    if (studentDeliver) querys.push(`studentDeliver=${studentDeliver}`);
    if (dateStart) querys.push(`dateStart=${dateStart}`);
    if (dateEnd) querys.push(`dateEnd=${dateEnd}`);
    let url = `${this.urlBase}/${assignmentId}/entries`;
    if (querys.length > 0) url += `?${querys.join("&")}`;
    return await Request.get(url);
  }

  static async getEntry(entryId) {
    let url = `${this.urlBase}/entry/${entryId}`;
    return await Request.get(url);
  }

  static async getAssignmentEntry(assignmentEntry) {
    let url = `${this.urlBase}/${assignmentEntry}/entry`;
    return await Request.get(url);
  }

  static async studentReview(entryId, studentScore) {
    let url = `${this.urlBase}/evaluate/reviewer/${entryId}`;
    return await Request.put(url, studentScore);
  }

  static async teacherReview(entryId, teacherScore) {
    let url = `${this.urlBase}/evaluate/teacher/${entryId}`;
    return await Request.put(url, teacherScore);
  }
}
