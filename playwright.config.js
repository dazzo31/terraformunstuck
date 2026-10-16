import {defineConfig,devices} from '@playwright/test';
export default defineConfig({
 testDir:'./tests/browser',fullyParallel:true,forbidOnly:!!process.env.CI,retries:0,workers:2,
 reporter:[['list'],['html',{open:'never'}]],
 use:{baseURL:'http://127.0.0.1:8080/terraformunstuck/',trace:'retain-on-failure',screenshot:'only-on-failure'},
 projects:[{name:'desktop-chromium',use:{...devices['Desktop Chrome']}},{name:'mobile-chromium',use:{...devices['Pixel 7']}},{name:'desktop-firefox',use:{...devices['Desktop Firefox']}},{name:'small-mobile-chromium',use:{...devices['Pixel 7'],viewport:{width:320,height:740},screen:{width:320,height:740}}},{name:'desktop-webkit',use:{...devices['Desktop Safari']}},{name:'mobile-webkit',use:{...devices['iPhone SE']}}],
 webServer:{command:'node scripts/serve.mjs',url:'http://127.0.0.1:8080/terraformunstuck/',reuseExistingServer:false,timeout:15000}
});
