import { Client } from '../types';
import { getDatabase, initDatabase } from './database';

initDatabase();

export function loadClientsFromDatabase(): Client[] {
    try {
        const database = getDatabase();
        
        const rows = database.prepare(`
            SELECT nombre, correo, telefono, fecha, vendedor, closed, transcripcion
            FROM clients
            WHERE nombre IS NOT NULL AND nombre != '' 
            AND transcripcion IS NOT NULL AND transcripcion != ''
            ORDER BY id
        `).all() as any[];

        const clients: Client[] = rows.map((row) => ({
            nombre: row.nombre || '',
            correo: row.correo || '',
            telefono: row.telefono || '',
            fecha: row.fecha || '',
            vendedor: row.vendedor || '',
            closed: row.closed || 0,
            transcripcion: row.transcripcion || '',
        }));

        return clients;
    } catch (error) {
        throw new Error('Error al cargar datos desde la base de datos');
    }
}
