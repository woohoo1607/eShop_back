

const userDatabaseManager = {
    table_name: "users",
    update (user) {
        let query = `UPDATE ${this.table_name} SET `;
        let value = [];
        let j = 1;
        for (let i in user) {
            query += i+"=$"+j+", ";
            value.push(user[i]);
            j++
        }
        let querySlice = query.slice(0,-2);
        querySlice += " WHERE id =$" + j;
        value.push(user.id);
        let result = {
            text: querySlice,
            values: value
        };
        return result;
    }
};

module.exports = userDatabaseManager;