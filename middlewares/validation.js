function validateRubricPost(req, res, next)
{
    let {preguntas, owner, curso} = req.body; 
    /* if(!preguntas || !Array.isArray(preguntas))
        res.status(400).send({error: "Faltan preguntas"});
    else */ if(!owner)
        res.status(400).send({error: "Falta un owner"});
    else if(!owner)
        res.status(400).send({error: "Falta un owner"});
    else 
    {
        next();
        return;
    }
}

module.exports = {validateRubricPost};