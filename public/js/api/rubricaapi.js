class RubricasApi 
{
  static urlBase = "/api/rubricas";

  static async getRubricas()
  {
    let url = this.urlBase;
    return await Request.get(url);
  }
}