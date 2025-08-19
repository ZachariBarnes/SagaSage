import dotenv from "dotenv";
import pg from "pg";
dotenv.config();

const getConnection = async () => {
    const config: pg.ClientConfig = {
        user: process.env.PG_USER,
        password: process.env.PG_PASS,
        host: process.env.PG_HOST,
        database: process.env.PG_DATABASE,
        port: parseInt(process.env.PG_PORT!),
        ssl: { rejectUnauthorized: false },
        application_name: process.env.APP_NAME,
        connectionTimeoutMillis: 60000, // number of milliseconds to wait for connection, default is no timeout
    };
    const con = new pg.Client(config);
    try {
        await con.connect();
        return con;
    }
    catch (error) {
        console.log("Error in getConnection:", error);
        return con;
    }
};

const closeConnection = async (con: pg.Client) => {
    try {
        await con.end();
    }
    catch (error) {
        console.log("Error in closeConnection:", error);
    }
};

export const query = async (queryString: string, values: any[]) => {
    const con = await getConnection();
    if (!con) {
        const connectionError = "Unable to query Database, Connection failed";
        console.log(connectionError);
        return { error: true, result: null, message: connectionError };
    }
    try {
        const res = await con.query(queryString, values);
        console.log(`${res.command} Query Successful. ${res.rowCount} rows affected.`);
        return { error: false, result: getRows(res) };
    }
    catch (err:any) {
        const errorMessage = "Error in query:"+ (err.message? err.message : err);
        console.log();
        return { error: true, result: null, message: errorMessage };
    }
    finally {
        await closeConnection(con);
    }
}

const getRows:any = (pgResult: pg.QueryResult) => {
  return { rows: pgResult.rows, rowCount: pgResult.rowCount };
};


export default query;