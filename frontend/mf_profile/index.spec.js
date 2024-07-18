const fs = require('fs');
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const waitPort = require('wait-port');


describe('Сборка проекта', () => {
  test('Наличие файла index.html в директории public после сборки', () => {
    const fileExists = fs.existsSync('./mf_profile/public/index.html',);

    expect(fileExists).toBe(true);
  });
});

describe('Запуск проекта', () => {
  jest.setTimeout(30000);
  let page;
  let browser;
  let yarnProcess;

  beforeAll(async () => {
    yarnProcess = spawn('yarn', ['start'], { detached: true });
    await waitPort({ host: 'localhost', port: 3303 });
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    process.kill(-yarnProcess.pid);
  })

});
