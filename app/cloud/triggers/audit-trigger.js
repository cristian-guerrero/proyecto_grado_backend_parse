Parse.Cloud.beforeSave('Sniffer', async request => {


  const {original, ip, object, user, master} = request
  if (master || !original) {
    return
  }
  const obToAudit = {}


  const schema = await  Parse.Schema.all({useMasterKey: true })


})
