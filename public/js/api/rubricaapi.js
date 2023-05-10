class RubricasApi 
{
  static urlBase = "/api/rubricas";

  static async getRubricas(
    nombre = null, curso = null
  )
  {
    let url = this.urlBase;
    let querys = [];
    if(nombre != null) querys.push(`nombre=${nombre}`);
    if(curso != null) querys.push(`curso=${curso}`);
    if (querys.length > 0) url += `?${querys.join("&")}`;
    
    return await Request.get(url);
  }
}