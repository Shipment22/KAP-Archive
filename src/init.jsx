import { Database } from 'bun:sqlite';

let db = new Database('database.sqlite');
db.run(`CREATE TABLE IF NOT EXISTS programs 
    (archive__added INT,
    archive__updated INT,
    created INT,
    updated INT, 
    id TEXT, 
    title TEXT, 
    code BLOB,
    folds BLOB,
    thumbnail BLOB,
    fork INT,
    "key" TEXT,
    votes INT,
    spinoffs INT,
    type TEXT,
    width INT,
    height INT,
    user_flagged INT,
    origin_scratchpad TEXT,
    hidden_from_hotlist INT,
    restricted_posting INT,
    by_child INT,
    author__nick TEXT,
    author__name TEXT,
    author__id TEXT,
    author__profile_access TEXT
    )`);
try { db.run(`ALTER TABLE programs ADD archive__source_deleted INT DEFAULT (0)`); } catch(e) {}
db.run(`CREATE TABLE IF NOT EXISTS users (db__id INTEGER PRIMARY KEY AUTOINCREMENT,
    archive__added INT,
    archive__updated INT,
    badge_counts TEXT,
    nick TEXT,
    name TEXT,
    id TEXT,
    bio TEXT,
    child INT,
    joined INT,
    energy_points INT,
    profile_access TEXT,
    videos_complete INT
    )`);

// This is where we start using some amount of database version managment
db.run("CREATE TABLE IF NOT EXISTS kap_internal (db_version INTEGER)");

let db_version = db.query("SELECT db_version FROM kap_internal").get()?.db_version;
if (!db_version) { db.run("INSERT INTO kap_internal VALUES (?)", [1]); db_version = 1; }

console.log("db_version:", db_version);
db.close();