#!/usr/bin/env node
/**
 * Push training plans to Likes API
 * Usage: node push_plans.js <plans.json>
 *    or: node push_plans.js --key <api_key> <plans.json>
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(require('os').homedir(), '.openclaw', 'likes-training-planner.json');

function loadConfig() {
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    } catch (e) {
      return {};
    }
  }
  return {};
}

function getBaseUrl(config) {
  const url = config.baseUrl || 'my.likes.com.cn';
  return url.replace(/^https?:\/\//, '');
}

function pushPlans(apiKey, baseUrl, plansData) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(plansData);
    
    const options = {
      hostname: baseUrl,
      path: '/api/open/plans/push',
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.write(postData);
    req.end();
  });
}

function showUsage() {
  console.log('Usage: node push_plans.js [options] <plans.json>');
  console.log('');
  console.log('Options:');
  console.log('  --key <api_key>    Use specific API key (instead of config file)');
  console.log('  --help             Show this help');
  console.log('');
  console.log('Configuration:');
  console.log('  Run: node configure.js');
  console.log('  Or set environment variable: LIKES_API_KEY=xxx');
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help')) {
    showUsage();
    process.exit(0);
  }
  
  let apiKey = null;
  let plansFile = null;
  
  // Parse args
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--key' && i + 1 < args.length) {
      apiKey = args[i + 1];
      i++;
    } else if (!plansFile && !args[i].startsWith('--')) {
      plansFile = args[i];
    }
  }
  
  if (!plansFile) {
    console.error('Error: Please specify a plans.json file');
    showUsage();
    process.exit(1);
  }
  
  // Load config
  const config = loadConfig();
  const baseUrl = getBaseUrl(config);
  
  // Get API key (priority: arg > env > config file)
  if (!apiKey) {
    apiKey = process.env.LIKES_API_KEY || config.apiKey;
  }
  
  if (!apiKey) {
    console.error('Error: No API key found');
    console.error('');
    console.error('Please configure the skill:');
    console.error('  node configure.js');
    console.error('');
    console.error('Or provide via command line:');
    console.error('  node push_plans.js --key YOUR_KEY plans.json');
    console.error('');
    console.error('Or set environment variable:');
    console.error('  LIKES_API_KEY=xxx node push_plans.js plans.json');
    process.exit(1);
  }
  
  if (!fs.existsSync(plansFile)) {
    console.error(`Error: File not found: ${plansFile}`);
    process.exit(1);
  }

  let plansData;
  try {
    const content = fs.readFileSync(plansFile, 'utf8');
    plansData = JSON.parse(content);
  } catch (e) {
    console.error(`Error: Failed to parse JSON: ${e.message}`);
    process.exit(1);
  }

  if (!plansData.plans || !Array.isArray(plansData.plans)) {
    console.error('Error: Invalid format. Expected { "plans": [...] }');
    process.exit(1);
  }

  console.log(`Pushing ${plansData.plans.length} plan(s) to Likes (${baseUrl})...`);
  console.log('');

  try {
    const result = await pushPlans(apiKey, baseUrl, plansData);
    
    console.log('Result:');
    console.log(`  Total: ${result.total}`);
    console.log(`  Parse OK: ${result.parse_ok}`);
    console.log(`  Parse Failed: ${result.parse_failed}`);
    console.log(`  Inserted: ${result.inserted}`);
    console.log(`  Insert Failed: ${result.insert_failed}`);
    console.log('');

    if (result.results && result.results.length > 0) {
      console.log('Details:');
      result.results.forEach((r, i) => {
        const status = r.status === 'ok' ? '✓' : '✗';
        console.log(`  ${status} [${i}] ${r.title} (${r.start}): ${r.status}`);
        if (r.message) {
          console.log(`      ${r.message}`);
        }
      });
    }

    const hasErrors = result.parse_failed > 0 || result.insert_failed > 0;
    process.exit(hasErrors ? 1 : 0);
    
  } catch (e) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
  }
}

main();
