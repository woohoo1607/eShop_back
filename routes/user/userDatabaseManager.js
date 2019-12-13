

const userDatabaseManager = {
    table_name: "users",
    update (user) {
        let query = `UPDATE ${this.table_name} SET `;
        for (let i in user) {
            query += i+"="+user[i]+", ";
        }
        query += "WHERE id =" + user.id;
        return query;
    }
};

module.exports = userDatabaseManager;