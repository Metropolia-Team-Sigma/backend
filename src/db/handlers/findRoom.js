module.exports = (db, collection) => {
  return async (key, value, operator = '==') => {
    const cursor = await db.query({
      query: `FOR d in @@collection FILTER d.@key ${operator} @value RETURN d`,
      bindVars: { '@collection': 'rooms', key, value }
    })

    return cursor.all()
  }
}
