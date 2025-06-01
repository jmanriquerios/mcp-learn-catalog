// src/index.js
import express from 'express';
import cors from 'cors';
import { createMcpServer, startServer as startMcpServer } from './mcpServer.js';
import { getAllModules, getModuleById } from './learnClient.js';

const app = express();
app.use(cors());
app.use(express.json());

// 1. Rutas REST para Power Automate
app.get('/api/modules', async (req, res) => {
  try {
    const modules = await getAllModules();
    res.json(modules);
  } catch (err) {
    console.error('Error en GET /api/modules:', err);
    res.status(500).json({ error: 'Error interno al obtener módulos' });
  }
});

app.get('/api/modules/:moduleId', async (req, res) => {
  try {
    const details = await getModuleById(req.params.moduleId);
    res.json(details);
  } catch (err) {
    console.error(`Error en GET /api/modules/${req.params.moduleId}:`, err);
    if (err.message.includes('404')) {
      res.status(404).json({ error: 'Módulo no encontrado' });
    } else {
      res.status(500).json({ error: 'Error interno al obtener detalle' });
    }
  }
});

// 2. Iniciar MCP server en paralelo (puerto 3001)
startMcpServer().catch(err => {
  console.error('No se pudo iniciar MCP Server:', err);
  process.exit(1);
});

// 3. Iniciar REST API en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`REST API lista en http://localhost:${PORT}/api`);
});
