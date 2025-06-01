// src/mcpServer.js
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { getAllModules, getModuleById } from './learnClient.js';
import { z } from 'zod';

export function createMcpServer() {
  const server = new McpServer({
    name: 'LearnCatalogMCP',
    version: '1.0.0'
  });

  server.tool(
    'listModules',
    undefined,
    async () => {
      const modules = await getAllModules();
      return {
        content: [
          { type: 'json', json: modules }
        ]
      };
    }
  );

  server.tool(
    'getModuleDetails',
    { moduleId: z.string() },
    async ({ moduleId }) => {
      const details = await getModuleById(moduleId);
      return {
        content: [
          { type: 'json', json: details }
        ]
      };
    }
  );

  return server;
}

export async function startServer() {
  const express = await import('express');
  const cors = await import('cors');

  const app = express.default();
  app.use(cors.default());
  app.use(express.json());

  const mcpServer = createMcpServer();

  app.get('/mcp/sse', (req, res) => {
    const transport = new SSEServerTransport('/mcp/messages', res);
    mcpServer.connect(transport).catch(err => {
      console.error('Error conectando el MCP transport:', err);
      res.end();
    });
  });

  app.post('/mcp/messages', async (req, res) => {
    try {
      await mcpServer.handlePostMessage(req, res);
    } catch (err) {
      console.error('Error procesando mensaje MCP:', err);
      res.status(500).send('Error interno');
    }
  });

  const PORT = process.env.MCP_PORT || 3001;
  app.listen(PORT, () => {
    console.log(`MCP server escuchando en http://localhost:${PORT}/mcp/sse`);
  });
}
