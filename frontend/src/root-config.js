// root-config.js
import { registerApplication, start } from 'single-spa';

registerApplication({
    name: 'user-profile',
    app: () => import('userProfile/userProfile'),
    activeWhen: ['/profile']
});

registerApplication({
    name: 'task-manager',
    app: () => import('taskManager/taskManager'),
    activeWhen: ['/tasks']
});

registerApplication({
    name: 'statistics-panel',
    app: () => import('statisticsPanel/statisticsPanel'),
    activeWhen: ['/stats']
});

start();
