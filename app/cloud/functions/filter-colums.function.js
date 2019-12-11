Parse.Cloud.define('_filter_columns', async (request, response) => {

  const {user, params} = request
  if (!user) { throw new Error('Debe estar logueado para realizar esta acción') }

  const {className} = params

  if(!className) {
    throw new Error('El parametro className es requerido')
  }
  return await getSchema(className)
})

async function getSchema(className) {
  const schema = new Parse.Schema(className);
  const schemaValues = await schema.get({useMasterKey: true})
  delete schemaValues.fields.ACL
 return schemaValues.fields
}


