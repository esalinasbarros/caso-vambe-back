import { Client } from '../types';
import { getDatabase, initDatabase } from './database';

initDatabase();

export function loadClientsFromDatabase(month?: string | null): Client[] {
    try {
        const database = getDatabase();
        
        let query = `
            SELECT nombre, correo, telefono, fecha, vendedor, closed, transcripcion
            FROM clients
            WHERE nombre IS NOT NULL AND nombre != '' 
            AND transcripcion IS NOT NULL AND transcripcion != ''
        `;
        
        const params: any[] = [];
        
        if (month) {
            query += ` AND strftime('%Y-%m', fecha) = ?`;
            params.push(month);
        }
        
        query += ` ORDER BY id`;
        
        const rows = database.prepare(query).all(...params) as any[];

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
