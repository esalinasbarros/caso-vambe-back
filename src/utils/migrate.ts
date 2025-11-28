import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { initDatabase, getDatabase, closeDatabase } from './database';

const CSV_PATH = path.join(__dirname, '../../vambe_clients.csv');

async function loadDataFromCSV() {
    try {
        initDatabase();
        const database = getDatabase();
        
        const existingCount = database.prepare('SELECT COUNT(*) as count FROM clients').get() as { count: number };
        if (existingCount.count > 0) {
            database.prepare('DELETE FROM clients').run();
        }
        
        if (!fs.existsSync(CSV_PATH)) {
            throw new Error(`Archivo CSV no encontrado en ${CSV_PATH}`);
        }
        
        const fileContent = fs.readFileSync(CSV_PATH, 'utf-8');
        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });
        
        const insert = database.prepare(`
            INSERT INTO clients (nombre, correo, telefono, fecha, vendedor, closed, transcripcion)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        
        const insertMany = database.transaction((records: any[]) => {
            for (const record of records) {
                const nombre = record['Nombre'] || '';
                const correo = record['Correo Electronico'] || '';
                const telefono = record['Numero de Telefono'] || '';
                const fecha = record['Fecha de la Reunion'] || '';
                const vendedor = record['Vendedor asignado'] || '';
                const closed = parseInt(record['closed']) || 0;
                const transcripcion = record['Transcripcion'] || '';
                
                if (nombre && transcripcion) {
                    insert.run(nombre, correo, telefono, fecha, vendedor, closed, transcripcion);
                }
            }
        });
        
        insertMany(records);
    } catch (error) {
        throw error;
    } finally {
        closeDatabase();
    }
}

loadDataFromCSV().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
});

