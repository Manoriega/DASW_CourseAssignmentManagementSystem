// require(controller)
const {mongoose} = require ('../database/connectdb');
const RubricSchema = mongoose.Schema({
    uid:{
        type: String, 
        unique: true,
        required: true
    },
    nombre:{
        type: String,
        required: true
    },
    preguntas:{
        type: Object, 
        required: true
    }, 
    owner:{
        type: String, 
        unique: true, 
        required:true
    },
    curso:{
        type: String, 
        required: true
    }, 
    fecha:{
        type: Date,
    default: Date.now
    }
});

RubricSchema.statics.getRubricaByEmail = async(owner) => 
{
    let doc = await Rubrica.find({owner});
    console.log(doc);
    return doc;
}

RubricSchema.statics.getRubricaById = async(uid) => 
{
    let doc = await Rubrica.find({uid});
    console.log(doc);
    return doc;
}

RubricSchema.statics.addRubrica = async(RubricData) => 
{
    let rubricaObject = Rubrica(RubricData);
    return await rubricaObject.save();
}

RubricSchema.statics.actualizarRubrica = async(uid, RubricData) => 
{
    let updatedRubrica = await Rubrica.findOneAndUpdate({uid},{$set: RubricData}, {new: true});
    return updatedRubrica; 
}

RubricSchema.statics.borrarRubrica = async(uid) => 
{
    let doc = await Rubrica.findOneAndDelete({uid});
    console.log(doc);
    return doc;
}

RubricSchema.statics.getRubricas = async() => 
{
    let docs = await Rubrica.find();
    console.log(docs);
    return docs; 
}
const Rubrica = mongoose.model('Rubrica', RubricSchema);

module.exports = {Rubrica};
