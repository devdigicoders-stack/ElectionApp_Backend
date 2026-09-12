const fs = require('fs');
const path = require('path');

function scanDir(dir) {
  let files = [];
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      files = files.concat(scanDir(full));
    } else if (file.endsWith('.controller.ts')) {
      files.push(full);
    }
  });
  return files;
}

const controllers = scanDir('src/modules');
let allEndpoints = [];

controllers.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Find controller decorators
  const controllerRegex = /@Controller\(['"]([^'"]*)['"]\)/g;
  let ctrlMatch;
  let basePaths = [];
  while ((ctrlMatch = controllerRegex.exec(content)) !== null) {
    basePaths.push(ctrlMatch[1]);
  }
  if (basePaths.length === 0) basePaths.push('');

  // Find methods
  const methodRegex = /@(Get|Post|Put|Patch|Delete)\((?:['"]([^'"]*)['"])?\)/g;
  let match;
  while ((match = methodRegex.exec(content)) !== null) {
    const httpMethod = match[1].toUpperCase();
    const sub = match[2] || '';
    const base = basePaths[0] || '';
    const cleanBase = base ? (base.startsWith('/') ? base : '/' + base) : '';
    const cleanSub = sub ? (sub.startsWith('/') ? sub : '/' + sub) : '';
    const full = (cleanBase + cleanSub).replace(/\/+/g, '/') || '/';
    allEndpoints.push({
      file: path.basename(file),
      module: path.basename(path.dirname(file)),
      method: httpMethod,
      endpoint: full
    });
  }
});

console.log('TOTAL_ENDPOINTS_FOUND=' + allEndpoints.length);

const roleCategories = {
  superAdmin: [],
  tenantAdmin: [],
  citizenPwa: [],
  publicShared: []
};

allEndpoints.forEach(ep => {
  const p = ep.endpoint;
  if (p.includes('super-admin') || ep.file.includes('super-admin') || ep.module === 'plans' && ep.endpoint.startsWith('/plans')) {
    roleCategories.superAdmin.push(ep);
  } else if (
    p.startsWith('/auth') || 
    p.startsWith('/config') || 
    p.startsWith('/banners') && ep.method === 'GET' || 
    p.startsWith('/about-leader') && ep.method === 'GET' ||
    p.startsWith('/events') && (ep.method === 'GET' || p.includes('rsvp')) ||
    p.startsWith('/works') && ep.method === 'GET' ||
    p.startsWith('/complaints/categories') && ep.method === 'GET' ||
    p.startsWith('/complaints/my') ||
    p.startsWith('/complaints') && ep.method === 'POST' ||
    p.startsWith('/complaints') && ep.method === 'GET' && p.match(/\/complaints\/[^\/]+$/) && !p.includes('analytics') && !p.includes('export') ||
    p.startsWith('/polls') && (ep.method === 'GET' || p.includes('vote')) ||
    p.startsWith('/membership/my') ||
    p.startsWith('/membership/apply') ||
    p.startsWith('/volunteers/my') ||
    p.startsWith('/volunteers') && ep.method === 'POST' && !p.includes('status') ||
    p.startsWith('/manifesto') && ep.method === 'GET' ||
    p.startsWith('/news') && ep.method === 'GET' ||
    p.startsWith('/gallery') && ep.method === 'GET' ||
    p.startsWith('/registration-form/public') ||
    p.startsWith('/registration-form/complete-profile') ||
    p.startsWith('/citizen') ||
    p.startsWith('/my-area') ||
    p.startsWith('/uploads') ||
    p.startsWith('/poster-generator/generate') ||
    p.startsWith('/poster-generator/templates') ||
    p.startsWith('/areas/tree') ||
    p.startsWith('/notifications')
  ) {
    roleCategories.citizenPwa.push(ep);
  } else {
    roleCategories.tenantAdmin.push(ep);
  }
});

console.log('\n--- BREAKDOWN ---');
console.log('Super Admin APIs:', roleCategories.superAdmin.length);
console.log('Tenant Admin (Leader/Manager/Staff) APIs:', roleCategories.tenantAdmin.length);
console.log('Citizen / PWA / Public APIs:', roleCategories.citizenPwa.length);
console.log('TOTAL:', allEndpoints.length);

fs.writeFileSync('endpoints_audit.json', JSON.stringify({ allEndpoints, roleCategories }, null, 2));
