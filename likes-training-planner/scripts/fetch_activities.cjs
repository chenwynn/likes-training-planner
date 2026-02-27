#!/usr/bin/env node
/**
 * Fetch activities from Likes API
 * Usage: node fetch_activities.cjs [options]
 * 
 * Options:
 *   --days <n>       Number of days to fetch (default: 30)
 *   --output <file>  Output file (default: stdout)
 *   --start <date>   Start date (YYYY-MM-DD)
 *   --end <date>     End date (YYYY-MM-DD)
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

function getApiKey() {
  const config = loadConfig();
  return process.env.LIKES_API_KEY || config.apiKey;
}

function getBaseUrl(config) {
  const url = config.baseUrl || 'https://my.likes.com.cn';
  return url.replace(/^https?:\/\//, '');
}

function fetchActivities(apiKey, baseUrl, startTime, endTime) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: baseUrl,
      path: `/api/open/activity?start=${startTime}&end=${endTime}&limit=200`,
      method: 'GET',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result.list || []);
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
    req.end();
  });
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    days: 30,
    output: null,
    start: null,
    end: null
  };
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--days' && i + 1 < args.length) {
      options.days = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === '--output' && i + 1 < args.length) {
      options.output = args[i + 1];
      i++;
    } else if (args[i] === '--start' && i + 1 < args.length) {
      options.start = args[i + 1];
      i++;
    } else if (args[i] === '--end' && i + 1 < args.length) {
      options.end = args[i + 1];
      i++;
    }
  }
  
  return options;
}

async function main() {
  const options = parseArgs();
  const apiKey = getApiKey();
  
  if (!apiKey) {
    console.error('Error: No API key found');
    console.error('Please configure the skill first:');
    console.error('  OpenClaw Control UI → Skills → likes-training-planner → Configure');
    process.exit(1);
  }
  
  const config = loadConfig();
  const baseUrl = getBaseUrl(config);
  
  let startTime, endTime;
  
  if (options.start && options.end) {
    startTime = Math.floor(new Date(options.start).getTime() / 1000);
    endTime = Math.floor(new Date(options.end).getTime() / 1000);
  } else {
    const now = new Date();
    const daysAgo = new Date(now);
    daysAgo.setDate(daysAgo.getDate() - options.days);
    startTime = Math.floor(daysAgo.getTime() / 1000);
    endTime = Math.floor(now.getTime() / 1000);
  }
  
  try {
    const activities = await fetchActivities(apiKey, baseUrl, startTime, endTime);
    
    const output = {
      fetchedAt: new Date().toISOString(),
      period: {
        start: new Date(startTime * 1000).toISOString().split('T')[0],
        end: new Date(endTime * 1000).toISOString().split('T')[0]
      },
      count: activities.length,
      activities: activities
    };
    
    const jsonOutput = JSON.stringify(output, null, 2);
    
    if (options.output) {
      fs.writeFileSync(options.output, jsonOutput);
      console.error(`✅ Fetched ${activities.length} activities`);
      console.error(`📁 Saved to: ${options.output}`);
    } else {
      console.log(jsonOutput);
    }
    
  } catch (e) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
  }
}

main();
