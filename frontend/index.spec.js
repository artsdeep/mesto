const fs = require('fs');

describe('Проверка наличия папок', () => {
  test('Наличие папок, начинающихся с "mf_" в корневой директории', () => {
    const folders = fs.readdirSync('./', { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && dirent.name.startsWith('mf_'))
        .map(dirent => dirent.name);

    expect(folders.length).toBeGreaterThan(0);
  });
});
