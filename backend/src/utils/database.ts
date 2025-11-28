import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.join(__dirname, '../../data');
const DB_PATH = path.join(DB_DIR, 'vambe.db');

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
    if (!db) {
        if (!fs.existsSync(DB_DIR)) {
            fs.mkdirSync(DB_DIR, { recursive: true });
        }
        db = new Database(DB_PATH);
        db.pragma('journal_mode = WAL');
    }
    return db;
}

export function initDatabase(): void {
    const database = getDatabase();
    
    database.exec(`
        CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            correo TEXT NOT NULL,
            telefono TEXT,
            fecha TEXT,
            vendedor TEXT,
            closed INTEGER DEFAULT 0,
            transcripcion TEXT NOT NULL
        )
    `);
    
    database.exec(`
        CREATE TABLE IF NOT EXISTS client_categories (
            client_id INTEGER PRIMARY KEY,
            industry TEXT,
            nicheIndustry TEXT,
            companySize TEXT,
            painPoint TEXT,
            painPointDescription TEXT,
            discoveryChannel TEXT,
            nicheDiscoveryChannel TEXT,
            urgency TEXT,
            budgetIndicator TEXT,
            estimatedVolume INTEGER,
            integrationNeeds TEXT,
            byVolume TEXT,
            solution_part TEXT,
            useful_addons TEXT,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
        )
    `);
    
    try {
        database.exec(`ALTER TABLE client_categories ADD COLUMN solution_part TEXT`);
    } catch (e) {
    }
    
    try {
        database.exec(`ALTER TABLE client_categories ADD COLUMN useful_addons TEXT`);
    } catch (e) {
    }
    
}

export function closeDatabase(): void {
    if (db) {
        db.close();
        db = null;
    }
}

