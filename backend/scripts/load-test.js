import fetch from 'node-fetch';
import fs from 'fs';


const BASE_URL = 'http://localhost:8000/api/v1/admins/allReports';
const TOTAL_REQUESTS = 1500; 
const CONCURRENT_REQUESTS = 105; 
async function makeRequest(noCache = false) {
    const url = noCache ? `${BASE_URL}?noCache=true` : BASE_URL;
    const start = Date.now();
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        await response.json();
        const end = Date.now();
        return end - start;
    } catch (error) {
        console.error(`Request failed: ${error.message}`);
        return null;
    }
}

async function runBatch(requests, noCache = false) {
    const promises = [];
    for (let i = 0; i < requests; i++) {
        promises.push(makeRequest(noCache));
    }
    
    const results = await Promise.all(promises);
    return results.filter(time => time !== null); 
}

async function runPerformanceTest() {
    console.log('🚀 Starting Admin Reports Cache Performance Test\n');
    console.log(`📊 Testing ${TOTAL_REQUESTS} total requests (${TOTAL_REQUESTS/2} with cache, ${TOTAL_REQUESTS/2} without)`);
    console.log(`⚡ Processing in batches of ${CONCURRENT_REQUESTS} concurrent requests\n`);
    
    
    console.log('🔄 Testing WITH cache...');
    const withCacheTimes = [];
    
    for (let i = 0; i < TOTAL_REQUESTS / 2; i += CONCURRENT_REQUESTS) {
        const batchSize = Math.min(CONCURRENT_REQUESTS, TOTAL_REQUESTS / 2 - i);
        console.log(`  Processing batch ${Math.floor(i/CONCURRENT_REQUESTS) + 1} (${batchSize} requests)...`);
        
        const batchTimes = await runBatch(batchSize, false);
        withCacheTimes.push(...batchTimes);
        
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Test without cache
    console.log('\n🔄 Testing WITHOUT cache...');
    const withoutCacheTimes = [];
    
    for (let i = 0; i < TOTAL_REQUESTS / 2; i += CONCURRENT_REQUESTS) {
        const batchSize = Math.min(CONCURRENT_REQUESTS, TOTAL_REQUESTS / 2 - i);
        console.log(`  Processing batch ${Math.floor(i/CONCURRENT_REQUESTS) + 1} (${batchSize} requests)...`);
        
        const batchTimes = await runBatch(batchSize, true);
        withoutCacheTimes.push(...batchTimes);
        
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Calculate statistics
    const calcStats = (times) => {
        const validTimes = times.filter(t => t > 0);
        const avg = validTimes.reduce((a, b) => a + b, 0) / validTimes.length;
        const min = Math.min(...validTimes);
        const max = Math.max(...validTimes);
        const p95 = validTimes.sort((a, b) => a - b)[Math.floor(validTimes.length * 0.95)];
        
        return { avg, min, max, p95, count: validTimes.length };
    };
    
    const withCacheStats = calcStats(withCacheTimes);
    const withoutCacheStats = calcStats(withoutCacheTimes);
    
    // Results
    console.log('\n🎯 PERFORMANCE RESULTS:');
    console.log('='.repeat(50));
    
    console.log('\n📈 WITH CACHE:');
    console.log(`  Requests: ${withCacheStats.count}`);
    console.log(`  Average: ${withCacheStats.avg.toFixed(2)}ms`);
    console.log(`  Min: ${withCacheStats.min}ms`);
    console.log(`  Max: ${withCacheStats.max}ms`);
    console.log(`  95th percentile: ${withCacheStats.p95}ms`);
    
    console.log('\n📉 WITHOUT CACHE:');
    console.log(`  Requests: ${withoutCacheStats.count}`);
    console.log(`  Average: ${withoutCacheStats.avg.toFixed(2)}ms`);
    console.log(`  Min: ${withoutCacheStats.min}ms`);
    console.log(`  Max: ${withoutCacheStats.max}ms`);
    console.log(`  95th percentile: ${withoutCacheStats.p95}ms`);
    
    const improvement = ((withoutCacheStats.avg - withCacheStats.avg) / withoutCacheStats.avg * 100).toFixed(1);
    console.log(`\n💡 PERFORMANCE IMPROVEMENT: ${improvement}% faster with cache`);
    
    // Save detailed results

    const results = {
        timestamp: new Date().toISOString(),
        totalRequests: TOTAL_REQUESTS,
        withCache: withCacheStats,
        withoutCache: withoutCacheStats,
        improvement: `${improvement}%`
    };
    
    fs.writeFileSync('cache-performance-results.json', JSON.stringify(results, null, 2));
    console.log('\n📄 Detailed results saved to cache-performance-results.json');
}

runPerformanceTest().catch(console.error);