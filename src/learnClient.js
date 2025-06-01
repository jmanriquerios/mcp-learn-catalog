// src/learnClient.js
import fetch from 'node-fetch';

const BASE_URL = 'https://learn.microsoft.com/training-support/api/v1';

export async function getAllModules() {
  const url = `${BASE_URL}/catalog/modules`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error obteniendo módulos: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getModuleById(moduleId) {
  const url = `${BASE_URL}/catalog/modules/${moduleId}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error obteniendo módulo ${moduleId}: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
