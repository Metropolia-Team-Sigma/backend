module.exports = (db, collection) => {
  return async (key, value, firstResultOnly, operator = '==') => {
    const cursor = await db.query({
      query: `FOR d in @@collection FILTER d.@key ${operator} @value RETURN d`,
      bindVars: { '@collection': 'rooms', key, value }
    })

    const results = await cursor.all()
    return firstResultOnly ? results[0] : results
  }
}
